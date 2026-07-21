import json
import os
import re
import time
import urllib.request

import decky  # provided by Decky Loader at runtime

DEFAULT_SETTINGS = {
    "installedOnly": True,
    "playtimeBucket": "all",        # all | unplayed | under2h | under10h
    "deckCompat": "any",            # any | playable | verified
    "oneSitting": False,            # HLTB main story <= oneSittingHours
    "oneSittingHours": 3,
    "avoidRecent": True,
    "weightNeglected": True,
    "sound": True,
    "haptics": True,
    "recent": [],                   # list of appids, most-recent first
}

RECENT_LIMIT = 15

# HLTB cache: name(lowercased) -> {"h": float|None, "t": epoch_seconds}
HLTB_TTL = 60 * 60 * 24 * 30  # 30 days
UA = (
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 "
    "(KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36"
)


def _settings_path() -> str:
    directory = decky.DECKY_PLUGIN_SETTINGS_DIR
    os.makedirs(directory, exist_ok=True)
    return os.path.join(directory, "settings.json")


def _hltb_cache_path() -> str:
    directory = decky.DECKY_PLUGIN_SETTINGS_DIR
    os.makedirs(directory, exist_ok=True)
    return os.path.join(directory, "hltb_cache.json")


# --------------------------------------------------------------------------- #
# HLTB best-effort client                                                      #
#                                                                              #
# HLTB has no official API. This mirrors the well-known discovery approach:    #
# fetch the site's Next.js _app bundle, pull the obfuscated /api/<...> search  #
# endpoint out of it, then POST a search query. It is deliberately wrapped so  #
# that ANY failure returns None and the "one sitting" filter degrades to a     #
# no-op rather than breaking a spin. If HLTB change their scheme, the two      #
# regexes in _discover_endpoint() are the place to update.                     #
# --------------------------------------------------------------------------- #

def _http(url: str, data: bytes = None, headers: dict = None, timeout: int = 12) -> str:
    req = urllib.request.Request(
        url,
        data=data,
        method="POST" if data is not None else "GET",
        headers={
            "User-Agent": UA,
            "Accept": "*/*",
            "Accept-Encoding": "identity",
            "Referer": "https://howlongtobeat.com/",
            "Origin": "https://howlongtobeat.com",
            **(headers or {}),
        },
    )
    with urllib.request.urlopen(req, timeout=timeout) as resp:
        return resp.read().decode("utf-8", "replace")


def _discover_endpoint() -> str:
    """Return the full search URL, e.g. https://howlongtobeat.com/api/seek/<key>."""
    home = _http("https://howlongtobeat.com/")
    m = re.search(r"/_next/static/chunks/pages/(_app-\w+\.js)", home)
    if not m:
        raise RuntimeError("HLTB: could not locate _app bundle")
    script = _http(f"https://howlongtobeat.com/_next/static/chunks/pages/{m.group(1)}")

    # The fetch path is built as "/api/<word>/" then .concat("..")-ed with a key.
    api = re.search(r'"/api/\w+/?"', script)
    if not api:
        raise RuntimeError("HLTB: could not locate api path")
    base = api.group(0).strip('"').rstrip("/")

    # Collect the concatenated key fragments that follow the api path.
    key = "".join(re.findall(r'\.concat\("([^"]*)"\)', script))
    url = f"https://howlongtobeat.com{base}"
    if key:
        url = f"{url}/{key}"
    return url


def _query_hltb(name: str) -> float:
    """Return main-story hours for the best name match, or raise on failure."""
    url = _discover_endpoint()
    payload = {
        "searchType": "games",
        "searchTerms": name.split(),
        "searchPage": 1,
        "size": 20,
        "searchOptions": {
            "games": {
                "userId": 0,
                "platform": "",
                "sortCategory": "popular",
                "rangeCategory": "main",
                "rangeTime": {"min": None, "max": None},
                "gameplay": {"perspective": "", "flow": "", "genre": ""},
                "modifier": "",
            },
            "filter": "",
            "sort": 0,
            "randomizer": 0,
        },
        "useCache": True,
    }
    body = json.dumps(payload).encode("utf-8")
    raw = _http(url, data=body, headers={"Content-Type": "application/json"})
    parsed = json.loads(raw)
    results = parsed.get("data") or []
    if not results:
        raise RuntimeError("HLTB: no results")

    target = name.strip().lower()
    best = None
    for row in results:
        rn = str(row.get("game_name", "")).strip().lower()
        seconds = row.get("comp_main") or 0
        if rn == target:
            best = seconds
            break
        if best is None:
            best = seconds  # first (most popular) as fallback
    if not best:
        raise RuntimeError("HLTB: no main-story time")
    return round(best / 3600.0, 1)


class Plugin:
    async def _main(self):
        decky.logger.info("Game Roulette loaded.")

    async def _unload(self):
        decky.logger.info("Game Roulette unloaded.")

    async def get_settings(self) -> dict:
        path = _settings_path()
        if not os.path.exists(path):
            return dict(DEFAULT_SETTINGS)
        try:
            with open(path, "r", encoding="utf-8") as handle:
                stored = json.load(handle)
        except (json.JSONDecodeError, OSError) as err:
            decky.logger.warning(f"Could not read settings, using defaults: {err}")
            return dict(DEFAULT_SETTINGS)
        merged = dict(DEFAULT_SETTINGS)
        merged.update(stored)
        return merged

    async def set_settings(self, settings: dict) -> bool:
        merged = dict(DEFAULT_SETTINGS)
        merged.update(settings or {})
        merged["recent"] = list(merged.get("recent", []))[:RECENT_LIMIT]
        try:
            with open(_settings_path(), "w", encoding="utf-8") as handle:
                json.dump(merged, handle)
        except OSError as err:
            decky.logger.error(f"Could not write settings: {err}")
            return False
        return True

    async def record_roll(self, appid: int) -> list:
        current = await self.get_settings()
        recent = [a for a in current.get("recent", []) if a != appid]
        recent.insert(0, appid)
        recent = recent[:RECENT_LIMIT]
        current["recent"] = recent
        await self.set_settings(current)
        return recent

    async def get_hltb(self, name: str):
        """Main-story hours for a game name, cached. Returns float or None."""
        if not name:
            return None
        key = name.strip().lower()

        cache = {}
        path = _hltb_cache_path()
        if os.path.exists(path):
            try:
                with open(path, "r", encoding="utf-8") as handle:
                    cache = json.load(handle)
            except (json.JSONDecodeError, OSError):
                cache = {}

        entry = cache.get(key)
        if entry and (time.time() - entry.get("t", 0)) < HLTB_TTL:
            return entry.get("h")

        hours = None
        try:
            hours = _query_hltb(name)
        except Exception as err:  # network, parse, scheme change — all non-fatal
            decky.logger.info(f"HLTB lookup failed for '{name}': {err}")

        cache[key] = {"h": hours, "t": time.time()}
        try:
            with open(path, "w", encoding="utf-8") as handle:
                json.dump(cache, handle)
        except OSError:
            pass
        return hours
