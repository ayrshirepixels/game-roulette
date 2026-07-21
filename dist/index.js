const manifest = {"name":"Game Roulette"};
const API_VERSION = 2;
const internalAPIConnection = window.__DECKY_SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED_deckyLoaderAPIInit;
if (!internalAPIConnection) {
    throw new Error('[@decky/api]: Failed to connect to the loader as as the loader API was not initialized. This is likely a bug in Decky Loader.');
}
let api;
try {
    api = internalAPIConnection.connect(API_VERSION, manifest.name);
}
catch {
    api = internalAPIConnection.connect(1, manifest.name);
    console.warn(`[@decky/api] Requested API version ${API_VERSION} but the running loader only supports version 1. Some features may not work.`);
}
if (api._version != API_VERSION) {
    console.warn(`[@decky/api] Requested API version ${API_VERSION} but the running loader only supports version ${api._version}. Some features may not work.`);
}
const callable = api.callable;
const toaster = api.toaster;
const definePlugin = (fn) => {
    return (...args) => {
        return fn(...args);
    };
};

// Ayrshire Pixels roulette wheel, vectorized from the source PNG. Uses
// currentColor + 1em sizing so it inherits Steam's icon colour and adapts on
// hover/focus (a raw white PNG vanished against the light hover highlight).
function WheelIcon({ style }) {
    return (SP_JSX.jsx("svg", { viewBox: "0 0 268 274", xmlns: "http://www.w3.org/2000/svg", width: "1em", height: "1em", fill: "currentColor", role: "img", "aria-hidden": "true", style: style, children: SP_JSX.jsx("g", { transform: "translate(0.000000,274.000000) scale(0.100000,-0.100000)", fillRule: "evenodd", children: SP_JSX.jsx("path", { d: "M1216 2549 c-703 -97 -1203 -750 -1102 -1439 127 -867 1059 -1356 1838 -964 564 284 839 941 642 1534 -142 426 -503 748 -954 851 -100 23 -322 32 -424 18z m281 -160 c762 -85 1218 -899 888 -1584 -139 -288 -418 -518 -730 -602 -147 -39 -403 -39 -548 0 -390 105 -696 405 -803 789 -32 115 -44 343 -24 466 93 581 635 996 1217 931z M1237 2339 c-199 -29 -422 -130 -559 -253 -36 -33 -36 -34 20 -90 l49 -47 74 56 c137 104 303 169 482 190 l57 6 0 75 0 74 -32 -1 c-18 -1 -59 -5 -91 -10z M1400 2278 l0 -75 64 -7 c434 -44 783 -394 831 -833 l7 -63 74 0 c86 0 81 -13 58 139 -71 486 -466 856 -966 907 l-68 6 0 -74z M1310 2148 c0 -13 7 -78 16 -145 l17 -123 37 0 37 0 11 88 c7 48 15 113 18 145 l7 57 -72 0 c-67 0 -71 -1 -71 -22z M1180 2146 c-65 -14 -64 -4 -14 -164 l38 -124 35 7 c82 14 78 3 56 165 -8 58 -15 111 -15 118 0 14 -26 14 -100 -2z M1480 2148 c0 -7 -7 -60 -15 -118 -22 -162 -26 -151 56 -165 l35 -7 41 134 c22 73 39 134 38 136 -5 5 -118 31 -137 32 -10 0 -18 -6 -18 -12z M891 2021 c-29 -22 -57 -43 -63 -49 -6 -6 22 -47 78 -113 48 -57 88 -106 90 -107 1 -2 23 10 48 27 l45 31 -45 83 c-25 45 -55 101 -66 125 -26 51 -21 50 -87 3z M1738 1934 l-66 -125 41 -30 c22 -16 44 -28 48 -27 5 2 132 153 171 204 7 10 -106 104 -124 104 -2 0 -33 -57 -70 -126z M562 1965 c-140 -167 -224 -371 -247 -597 l-7 -68 75 0 76 0 6 58 c23 201 91 361 218 515 l40 49 -54 53 -54 53 -53 -63z M1236 1835 c-253 -70 -421 -289 -421 -550 0 -510 612 -765 966 -403 356 364 101 971 -406 967 -49 0 -112 -7 -139 -14z m194 -148 c14 -25 13 -30 -2 -58 -13 -21 -18 -52 -18 -102 0 -82 3 -88 48 -111 18 -9 41 -31 52 -49 10 -18 24 -38 30 -44 16 -19 151 -17 176 2 59 45 132 -18 86 -75 -22 -27 -65 -30 -91 -6 -31 28 -179 12 -187 -20 -6 -22 -36 -52 -93 -94 -28 -20 -33 -155 -7 -191 30 -43 7 -89 -45 -89 -55 0 -72 40 -41 94 14 24 17 47 14 104 l-4 74 -43 26 c-24 14 -53 42 -64 63 -20 35 -22 36 -95 42 -66 6 -80 4 -111 -15 l-36 -21 -27 20 c-33 25 -38 47 -18 78 19 29 60 33 90 10 46 -35 168 -15 197 31 11 19 41 48 65 65 l44 30 0 79 c0 55 -5 87 -17 108 -16 28 -16 31 1 56 24 37 74 33 96 -7z M641 1771 c-22 -33 -41 -61 -41 -64 0 -3 57 -35 126 -72 139 -73 127 -73 169 -3 l16 27 -107 85 c-58 48 -109 86 -114 86 -4 0 -26 -27 -49 -59z M1965 1754 c-129 -107 -121 -95 -90 -143 15 -22 29 -41 30 -41 8 0 255 132 255 137 0 13 -84 123 -94 122 -6 0 -51 -34 -101 -75z M526 1531 c-7 -12 -28 -142 -24 -146 9 -10 271 -36 279 -28 4 4 9 28 11 52 l3 45 -133 42 c-72 23 -134 39 -136 35z M2090 1495 c-74 -24 -134 -46 -133 -49 1 -3 4 -25 8 -49 4 -23 9 -44 10 -47 4 -7 274 25 281 33 6 6 -15 126 -25 143 -4 7 -51 -3 -141 -31z M490 1286 c0 -36 3 -67 8 -69 4 -2 68 4 142 14 74 10 136 19 138 19 6 0 1 70 -5 70 -5 0 -62 7 -128 15 -170 21 -155 26 -155 -49z M317 1253 c-8 -13 11 -173 28 -235 112 -429 503 -762 932 -795 l83 -6 0 74 0 75 -91 12 c-429 58 -756 394 -804 825 l-6 57 -69 0 c-38 0 -71 -3 -73 -7z m373 -648 c55 -28 72 -91 20 -73 -33 11 -60 43 -60 70 0 22 3 22 40 3z M2296 1223 c-39 -266 -104 -408 -261 -568 -163 -166 -322 -247 -546 -277 l-89 -12 0 -73 0 -73 53 0 c185 1 424 97 603 244 232 190 353 420 389 744 l6 52 -75 0 -75 0 -5 -37z m-186 -622 c0 -18 -45 -71 -61 -71 -4 0 -14 -3 -23 -6 -29 -11 -18 26 18 62 38 38 66 44 66 15z M628 1202 c-119 -14 -128 -17 -128 -36 1 -38 26 -131 36 -131 5 0 67 18 137 40 l129 39 -7 46 c-8 52 -12 60 -28 59 -7 -1 -69 -8 -139 -17z M1976 1212 c-3 -6 -9 -30 -12 -54 l-6 -44 128 -39 c71 -22 133 -40 139 -40 8 0 34 98 35 136 0 13 -22 18 -112 28 -62 7 -125 15 -139 18 -15 3 -29 0 -33 -5z M720 929 c-63 -34 -117 -63 -119 -65 -3 -3 56 -95 85 -133 3 -3 164 123 218 170 11 10 -39 89 -57 89 -6 0 -64 -28 -127 -61z M1874 950 c-16 -24 -23 -44 -18 -49 51 -45 215 -173 218 -170 17 21 87 131 84 133 -14 12 -237 126 -246 126 -7 0 -24 -18 -38 -40z M1712 789 l-43 -31 58 -106 c32 -59 63 -116 69 -126 10 -17 15 -15 77 25 37 24 66 47 64 51 -2 7 -177 218 -180 218 -1 -1 -21 -15 -45 -31z M905 704 c-48 -58 -86 -106 -84 -108 42 -31 130 -88 133 -85 4 5 45 79 94 170 l41 77 -39 26 c-22 14 -44 26 -48 26 -5 0 -49 -47 -97 -106z M1496 697 l-48 -10 6 -56 c4 -31 11 -95 17 -142 l11 -86 77 16 c66 14 76 19 73 36 -6 32 -73 240 -81 246 -3 3 -28 1 -55 -4z M1168 589 c-53 -164 -55 -150 30 -170 40 -9 74 -14 76 -10 7 11 38 272 33 277 -2 3 -27 7 -54 10 l-49 6 -36 -113z M1340 668 c0 -7 -7 -58 -15 -113 -24 -165 -27 -155 55 -155 82 0 77 -13 55 150 -8 58 -15 111 -15 118 0 7 -15 12 -40 12 -25 0 -40 -5 -40 -12z" }) }) }));
}

const DEFAULT_SETTINGS = {
    installedOnly: true,
    playtimeBucket: "all",
    deckCompat: "any",
    oneSitting: false,
    oneSittingHours: 3,
    avoidRecent: true,
    weightNeglected: true,
    sound: true,
    haptics: true,
    recent: [],
};
const getSettings = callable("get_settings");
const setSettings = callable("set_settings");
const recordRoll = callable("record_roll");
const getHltb = callable("get_hltb");
/* ------------------------------------------------------------------ */
/* Steam library access                                                */
/*                                                                     */
/* Reaches into live Steam client stores. Field shapes are taken from  */
/* @decky/ui's SteamClient typings but every access is defensive: a    */
/* Valve rename degrades to "no games" rather than a crash.            */
/* ------------------------------------------------------------------ */
// ESteamDeckCompatibilityCategory: 0 Unknown, 1 Unsupported, 2 Playable, 3 Verified
const COMPAT_PLAYABLE = 2;
const COMPAT_VERIFIED = 3;
const APP_TYPE_GAME = 1; // EAppType.Game
function overviewToGame(app) {
    if (!app)
        return null;
    const type = Number(app.app_type ?? 0);
    if (type !== 0 && (type & APP_TYPE_GAME) === 0)
        return null;
    const appid = Number(app.appid);
    if (!Number.isFinite(appid))
        return null;
    return {
        appid,
        name: String(app.display_name ?? "Unknown"),
        minutes: Number(app.minutes_playtime_forever ?? 0) || 0,
        installed: Boolean(app.installed),
        compat: Number(app.steam_deck_compat_category ?? 0) || 0,
    };
}
function readLibrary() {
    const store = window.collectionStore;
    const raw = store?.allAppsCollection?.allApps ?? [];
    const games = [];
    for (const app of raw) {
        const g = overviewToGame(app);
        if (g)
            games.push(g);
    }
    return games;
}
function lookupGame(appid, library) {
    const hit = library.find((g) => g.appid === appid);
    if (hit)
        return hit;
    // Fall back to the app store for games not in the filtered library snapshot.
    const overview = window.appStore?.GetAppOverviewByAppID?.(appid);
    return overviewToGame(overview);
}
function capsuleUrl(appid) {
    return `https://steamloopback.host/assets/${appid}/library_600x900.jpg`;
}
function headerUrl(appid) {
    return `https://steamloopback.host/assets/${appid}/header.jpg`;
}
function launchGame(appid) {
    try {
        window.SteamClient?.Apps?.RunGame(`${appid}`, "", -1, 100);
    }
    catch (err) {
        console.error("[GameRoulette] launch failed", err);
        toaster.toast({ title: "Game Roulette", body: "Couldn't launch that one." });
    }
}
function viewInLibrary(appid) {
    try {
        DFL.Navigation.Navigate(`/library/app/${appid}`);
        DFL.Navigation.CloseSideMenus();
    }
    catch (err) {
        console.error("[GameRoulette] navigate failed", err);
        toaster.toast({ title: "Game Roulette", body: "Couldn't open that game's page." });
    }
}
const VERSION = "1.0.0";
const GITHUB_URL = "https://github.com/ayrshirepixels/game-roulette";
function openExternal(url) {
    try {
        DFL.Navigation.NavigateToExternalWeb(url);
        DFL.Navigation.CloseSideMenus();
    }
    catch (err) {
        console.error("[GameRoulette] external nav failed", err);
        toaster.toast({ title: "Game Roulette", body: "Couldn't open the browser." });
    }
}
/* ------------------------------------------------------------------ */
/* Feedback: sound + haptics on land                                   */
/* ------------------------------------------------------------------ */
let audioCtx = null;
function playClunk() {
    try {
        const Ctx = window.AudioContext || window.webkitAudioContext;
        if (!Ctx)
            return;
        if (!audioCtx)
            audioCtx = new Ctx();
        const ctx = audioCtx;
        if (ctx.state === "suspended")
            ctx.resume();
        const now = ctx.currentTime;
        // Low mechanical thump: a quick downward pitch drop with a fast decay.
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "triangle";
        osc.frequency.setValueAtTime(150, now);
        osc.frequency.exponentialRampToValueAtTime(55, now + 0.09);
        gain.gain.setValueAtTime(0.0001, now);
        gain.gain.exponentialRampToValueAtTime(0.32, now + 0.005);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.16);
        osc.connect(gain).connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.18);
        // Short noise tick layered on top for the "clack".
        const buffer = ctx.createBuffer(1, ctx.sampleRate * 0.03, ctx.sampleRate);
        const ch = buffer.getChannelData(0);
        for (let i = 0; i < ch.length; i++)
            ch[i] = (Math.random() * 2 - 1) * (1 - i / ch.length);
        const noise = ctx.createBufferSource();
        const ngain = ctx.createGain();
        const lp = ctx.createBiquadFilter();
        lp.type = "lowpass";
        lp.frequency.value = 2200;
        ngain.gain.setValueAtTime(0.18, now);
        ngain.gain.exponentialRampToValueAtTime(0.0001, now + 0.05);
        noise.buffer = buffer;
        noise.connect(lp).connect(ngain).connect(ctx.destination);
        noise.start(now);
    }
    catch (err) {
        console.warn("[GameRoulette] sound failed", err);
    }
}
function pulseHaptic() {
    try {
        // TriggerHapticPulse(controllerIndex, eHapticType, param2); type 2 == Click.
        window.SteamClient?.Input?.TriggerHapticPulse?.(0, 2, 0);
    }
    catch {
        /* haptics are best-effort */
    }
}
/* ------------------------------------------------------------------ */
/* Filtering + weighted pick                                           */
/* ------------------------------------------------------------------ */
function applyFilters(all, s) {
    let pool = all;
    if (s.installedOnly)
        pool = pool.filter((g) => g.installed);
    switch (s.playtimeBucket) {
        case "unplayed":
            pool = pool.filter((g) => g.minutes === 0);
            break;
        case "under2h":
            pool = pool.filter((g) => g.minutes < 120);
            break;
        case "under10h":
            pool = pool.filter((g) => g.minutes < 600);
            break;
    }
    if (s.deckCompat === "verified")
        pool = pool.filter((g) => g.compat === COMPAT_VERIFIED);
    else if (s.deckCompat === "playable")
        pool = pool.filter((g) => g.compat >= COMPAT_PLAYABLE);
    if (s.avoidRecent && s.recent.length) {
        const trimmed = pool.filter((g) => !s.recent.includes(g.appid));
        if (trimmed.length >= 5)
            pool = trimmed;
    }
    return pool;
}
function pickWinner(pool, weighted) {
    if (!weighted)
        return pool[Math.floor(Math.random() * pool.length)];
    const weights = pool.map((g) => 1 / (g.minutes + 30));
    const total = weights.reduce((a, b) => a + b, 0);
    let roll = Math.random() * total;
    for (let i = 0; i < pool.length; i++) {
        roll -= weights[i];
        if (roll <= 0)
            return pool[i];
    }
    return pool[pool.length - 1];
}
function sample(arr, n) {
    const out = [];
    for (let i = 0; i < n; i++)
        out.push(arr[Math.floor(Math.random() * arr.length)]);
    return out;
}
function playtimeLabel(minutes) {
    if (minutes <= 0)
        return "never played";
    if (minutes < 60)
        return `${minutes}m played`;
    return `${(minutes / 60).toFixed(minutes < 600 ? 1 : 0)}h played`;
}
/* ------------------------------------------------------------------ */
/* Reel visual constants                                               */
/* ------------------------------------------------------------------ */
const ITEM_W = 92;
const ITEM_H = 138;
const GAP = 8;
const VISIBLE = 3;
const STRIP_LEN = 30;
const WINNER_INDEX = STRIP_LEN - 3;
const SPIN_MS = 3200;
function Capsule({ game, highlight }) {
    const [src, setSrc] = SP_REACT.useState(capsuleUrl(game.appid));
    const [fellBack, setFellBack] = SP_REACT.useState(false);
    return (SP_JSX.jsx("div", { style: {
            width: ITEM_W,
            height: ITEM_H,
            flex: "0 0 auto",
            borderRadius: 6,
            overflow: "hidden",
            position: "relative",
            background: "#1a1f2b",
            boxShadow: highlight
                ? "0 0 0 2px #ffd24a, 0 0 14px rgba(255, 210, 74, 0.55)"
                : "0 1px 3px rgba(0,0,0,0.5)",
            transition: "box-shadow 180ms ease",
        }, children: SP_JSX.jsx("img", { src: src, alt: game.name, onError: () => {
                if (!fellBack) {
                    setFellBack(true);
                    setSrc(headerUrl(game.appid));
                }
            }, style: { width: "100%", height: "100%", objectFit: "cover", display: "block" } }) }));
}
/* ------------------------------------------------------------------ */
/* Recent rolls (collapsible)                                          */
/* ------------------------------------------------------------------ */
function RecentRolls({ recent, library }) {
    const [open, setOpen] = SP_REACT.useState(false);
    if (!recent.length)
        return null;
    const games = recent
        .map((id) => lookupGame(id, library))
        .filter((g) => g !== null);
    return (SP_JSX.jsxs(DFL.PanelSection, { title: "Recent rolls", children: [SP_JSX.jsx(DFL.PanelSectionRow, { children: SP_JSX.jsxs(DFL.ButtonItem, { layout: "below", onClick: () => setOpen((v) => !v), children: [open ? "Hide" : "Show", " last ", games.length] }) }), open &&
                games.map((g) => (SP_JSX.jsx(DFL.PanelSectionRow, { children: SP_JSX.jsx(DFL.ButtonItem, { layout: "below", onClick: () => launchGame(g.appid), description: playtimeLabel(g.minutes), children: g.name }) }, g.appid)))] }));
}
function Content() {
    const [settings, setSettingsState] = SP_REACT.useState(DEFAULT_SETTINGS);
    const [library, setLibrary] = SP_REACT.useState([]);
    const [phase, setPhase] = SP_REACT.useState("idle");
    const [strip, setStrip] = SP_REACT.useState([]);
    const [winner, setWinner] = SP_REACT.useState(null);
    const [why, setWhy] = SP_REACT.useState("");
    const trackRef = SP_REACT.useRef(null);
    const settledRef = SP_REACT.useRef(false);
    const hltbCache = SP_REACT.useRef(new Map());
    const settingsRef = SP_REACT.useRef(settings);
    settingsRef.current = settings;
    SP_REACT.useEffect(() => {
        let alive = true;
        (async () => {
            try {
                const s = await getSettings();
                if (alive)
                    setSettingsState(s);
            }
            catch {
                /* defaults */
            }
            if (alive)
                setLibrary(readLibrary());
        })();
        return () => {
            alive = false;
        };
    }, []);
    const pool = SP_REACT.useMemo(() => applyFilters(library, settings), [library, settings]);
    function persist(next) {
        setSettingsState(next);
        setSettings(next).catch(() => undefined);
    }
    function update(key, value) {
        persist({ ...settings, [key]: value });
    }
    async function hltbHours(name) {
        if (hltbCache.current.has(name))
            return hltbCache.current.get(name);
        let h = null;
        try {
            h = await getHltb(name);
        }
        catch {
            h = null;
        }
        hltbCache.current.set(name, h);
        return h;
    }
    // Pick a game whose HLTB main story fits the "one sitting" threshold.
    async function pickShort(from) {
        const s = settingsRef.current;
        const tried = new Set();
        let anyResolved = false;
        let shortest = null;
        const maxTries = Math.min(12, from.length);
        for (let i = 0; i < maxTries; i++) {
            let c = pickWinner(from, s.weightNeglected);
            let guard = 0;
            while (tried.has(c.appid) && guard++ < 20)
                c = pickWinner(from, s.weightNeglected);
            tried.add(c.appid);
            const h = await hltbHours(c.name);
            if (h != null) {
                anyResolved = true;
                if (h <= s.oneSittingHours)
                    return { game: c };
                if (!shortest || h < shortest.h)
                    shortest = { g: c, h };
            }
        }
        if (!anyResolved)
            return { game: null, note: "Couldn't reach HowLongToBeat — rolled without the length filter." };
        if (shortest)
            return { game: shortest.g, note: `Nothing under ${settingsRef.current.oneSittingHours}h — landed on the shortest found (~${shortest.h}h).` };
        return { game: null, note: "No length data — rolled without the length filter." };
    }
    function runReel(chosen) {
        const filler = sample(pool.length > 1 ? pool : library, STRIP_LEN);
        filler[WINNER_INDEX] = chosen;
        settledRef.current = false;
        setWinner(null);
        setWhy("");
        setStrip(filler);
        setPhase("spinning");
        const reduce = !!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
        const centreOffset = (WINNER_INDEX - Math.floor(VISIBLE / 2)) * (ITEM_W + GAP);
        // Safety net: guarantee a landing even if the CSS transition never fires
        // (settle is idempotent via settledRef, so whichever path wins is fine).
        window.setTimeout(() => settle(chosen), reduce ? 0 : SPIN_MS + 250);
        const track = trackRef.current;
        if (!track)
            return;
        if (reduce) {
            track.style.transition = "none";
            track.style.transform = `translateX(-${centreOffset}px)`;
            return; // landing handled by the timeout above
        }
        // Reset to the start with no transition. transform is a compositor
        // property, so offsetHeight alone won't commit it — reading a computed
        // style value forces the reset to actually take before we animate.
        track.style.transition = "none";
        track.style.transform = "translateX(0px)";
        window.getComputedStyle(track).transform; // force style flush
        // Kick the spin off on a later frame so the reset paints first; this is
        // what makes the transition fire on the *second* spin (0 -> -offset is a
        // real change) rather than getting coalesced away.
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                const t = trackRef.current;
                if (!t)
                    return;
                t.style.transition = `transform ${SPIN_MS}ms cubic-bezier(0.12, 0.8, 0.16, 1)`;
                t.style.transform = `translateX(-${centreOffset}px)`;
            });
        });
    }
    async function spin() {
        if (phase === "spinning" || phase === "searching")
            return;
        if (pool.length === 0) {
            toaster.toast({ title: "Game Roulette", body: "No games match those filters." });
            return;
        }
        if (settings.oneSitting) {
            setPhase("searching");
            const { game, note } = await pickShort(pool);
            if (note)
                toaster.toast({ title: "Game Roulette", body: note });
            const chosen = game ?? pickWinner(pool, settings.weightNeglected);
            runReel(chosen);
            return;
        }
        runReel(pickWinner(pool, settings.weightNeglected));
    }
    function buildWhy(g) {
        const s = settingsRef.current;
        const parts = [`Picked from ${pool.length} game${pool.length === 1 ? "" : "s"}`];
        if (s.weightNeglected)
            parts.push("weighted to neglected");
        parts.push(playtimeLabel(g.minutes));
        const h = hltbCache.current.get(g.name);
        if (h != null)
            parts.push(`~${h}h to beat`);
        return parts.join(" · ");
    }
    function settle(chosen) {
        if (settledRef.current)
            return;
        settledRef.current = true;
        setWinner(chosen);
        setWhy(buildWhy(chosen));
        setPhase("done");
        if (settingsRef.current.sound)
            playClunk();
        if (settingsRef.current.haptics)
            pulseHaptic();
        recordRoll(chosen.appid)
            .then((recent) => setSettingsState((prev) => ({ ...prev, recent })))
            .catch(() => undefined);
    }
    const viewportW = VISIBLE * ITEM_W + (VISIBLE - 1) * GAP;
    const spinLabel = phase === "spinning" ? "Spinning…" :
        phase === "searching" ? "Finding a short one…" :
            phase === "done" ? "Spin again" : "Spin";
    return (SP_JSX.jsxs(SP_JSX.Fragment, { children: [SP_JSX.jsxs(DFL.PanelSection, { children: [SP_JSX.jsx(DFL.PanelSectionRow, { children: SP_JSX.jsx(DFL.Focusable, { style: { display: "flex", justifyContent: "center", padding: "4px 0 10px" }, children: SP_JSX.jsxs("div", { style: {
                                    width: viewportW,
                                    height: ITEM_H,
                                    overflow: "hidden",
                                    position: "relative",
                                    borderRadius: 8,
                                    background: "#0c0f16",
                                    border: "1px solid #2a3140",
                                }, children: [SP_JSX.jsx("div", { style: {
                                            position: "absolute",
                                            top: 0,
                                            bottom: 0,
                                            left: ITEM_W + GAP - 1,
                                            width: ITEM_W + 2,
                                            borderLeft: "1px solid rgba(255,210,74,0.25)",
                                            borderRight: "1px solid rgba(255,210,74,0.25)",
                                            pointerEvents: "none",
                                            zIndex: 2,
                                        } }), SP_JSX.jsx("div", { ref: trackRef, onTransitionEnd: (e) => {
                                            // Ignore transitions bubbling up from child capsules (e.g. the
                                            // highlight box-shadow) — only the reel's own transform counts.
                                            if (e.target !== trackRef.current || e.propertyName !== "transform")
                                                return;
                                            if (phase === "spinning" && strip[WINNER_INDEX])
                                                settle(strip[WINNER_INDEX]);
                                        }, style: { display: "flex", gap: GAP, height: "100%", alignItems: "center", willChange: "transform" }, children: strip.length === 0 ? (SP_JSX.jsx("div", { style: { width: viewportW, textAlign: "center", color: "#6b7688", fontSize: 13, alignSelf: "center" }, children: "Press Spin" })) : (strip.map((g, i) => (SP_JSX.jsx(Capsule, { game: g, highlight: phase === "done" && i === WINNER_INDEX }, `${g.appid}-${i}`)))) })] }) }) }), phase === "done" && winner && (SP_JSX.jsxs(SP_JSX.Fragment, { children: [SP_JSX.jsx(DFL.PanelSectionRow, { children: SP_JSX.jsx("div", { style: { textAlign: "center", fontWeight: 700, fontSize: 15, padding: "2px 4px 2px", color: "#ffd24a" }, children: winner.name }) }), why && (SP_JSX.jsx(DFL.PanelSectionRow, { children: SP_JSX.jsx("div", { style: { textAlign: "center", fontSize: 11, color: "#8b95a7", padding: "0 4px 6px", width: "100%" }, children: why }) })), SP_JSX.jsx(DFL.PanelSectionRow, { children: SP_JSX.jsx(DFL.ButtonItem, { layout: "below", onClick: () => launchGame(winner.appid), children: "Launch now" }) }), SP_JSX.jsx(DFL.PanelSectionRow, { children: SP_JSX.jsx(DFL.ButtonItem, { layout: "below", onClick: () => viewInLibrary(winner.appid), children: "View in library" }) })] })), SP_JSX.jsx(DFL.PanelSectionRow, { children: SP_JSX.jsx(DFL.ButtonItem, { layout: "below", onClick: spin, disabled: phase === "spinning" || phase === "searching", children: spinLabel }) }), SP_JSX.jsx(DFL.PanelSectionRow, { children: SP_JSX.jsxs("div", { style: { fontSize: 12, color: "#6b7688", textAlign: "center", width: "100%" }, children: [pool.length, " game", pool.length === 1 ? "" : "s", " in the pool"] }) }), SP_JSX.jsx(DFL.PanelSectionRow, { children: SP_JSX.jsx("div", { style: { fontSize: 10, color: "#5a6473", textAlign: "center", width: "100%", letterSpacing: "0.3px" }, children: "Ayrshire Pixels" }) })] }), SP_JSX.jsx(RecentRolls, { recent: settings.recent, library: library }), SP_JSX.jsxs(DFL.PanelSection, { title: "Filters", children: [SP_JSX.jsx(DFL.PanelSectionRow, { children: SP_JSX.jsx(DFL.ToggleField, { label: "Installed only", checked: settings.installedOnly, onChange: (v) => update("installedOnly", v) }) }), SP_JSX.jsx(DFL.PanelSectionRow, { children: SP_JSX.jsx(DFL.DropdownItem, { label: "Playtime", rgOptions: [
                                { data: "all", label: "Anything" },
                                { data: "unplayed", label: "Never played" },
                                { data: "under2h", label: "Under 2 hours" },
                                { data: "under10h", label: "Under 10 hours" },
                            ], selectedOption: settings.playtimeBucket, onChange: (o) => update("playtimeBucket", o.data) }) }), SP_JSX.jsx(DFL.PanelSectionRow, { children: SP_JSX.jsx(DFL.DropdownItem, { label: "Deck compatibility", rgOptions: [
                                { data: "any", label: "Any" },
                                { data: "playable", label: "Playable or better" },
                                { data: "verified", label: "Verified only" },
                            ], selectedOption: settings.deckCompat, onChange: (o) => update("deckCompat", o.data) }) }), SP_JSX.jsx(DFL.PanelSectionRow, { children: SP_JSX.jsx(DFL.ToggleField, { label: "One-sitting only", description: `Only games with a HowLongToBeat main story under ${settings.oneSittingHours} hours.`, checked: settings.oneSitting, onChange: (v) => update("oneSitting", v) }) }), SP_JSX.jsx(DFL.PanelSectionRow, { children: SP_JSX.jsx(DFL.ToggleField, { label: "Weight toward neglected", description: "Rarely-played games land more often.", checked: settings.weightNeglected, onChange: (v) => update("weightNeglected", v) }) }), SP_JSX.jsx(DFL.PanelSectionRow, { children: SP_JSX.jsx(DFL.ToggleField, { label: "Avoid recent rolls", description: "Skip the last few games it landed on.", checked: settings.avoidRecent, onChange: (v) => update("avoidRecent", v) }) })] }), SP_JSX.jsxs(DFL.PanelSection, { title: "Feel", children: [SP_JSX.jsx(DFL.PanelSectionRow, { children: SP_JSX.jsx(DFL.ToggleField, { label: "Sound on land", checked: settings.sound, onChange: (v) => update("sound", v) }) }), SP_JSX.jsx(DFL.PanelSectionRow, { children: SP_JSX.jsx(DFL.ToggleField, { label: "Haptics on land", checked: settings.haptics, onChange: (v) => update("haptics", v) }) })] }), SP_JSX.jsxs(DFL.PanelSection, { title: "About", children: [SP_JSX.jsx(DFL.PanelSectionRow, { children: SP_JSX.jsxs(DFL.Focusable, { style: { display: "flex", alignItems: "center", gap: 10, padding: "2px 2px 8px" }, children: [SP_JSX.jsx(WheelIcon, { style: { fontSize: 30, flex: "0 0 auto", color: "#e6ebf2" } }), SP_JSX.jsxs("div", { style: { display: "flex", flexDirection: "column", lineHeight: 1.25 }, children: [SP_JSX.jsx("span", { style: { fontWeight: 700, fontSize: 14, color: "#e6ebf2" }, children: "Ayrshire Pixels" }), SP_JSX.jsxs("span", { style: { fontSize: 11, color: "#8b95a7" }, children: ["Game Roulette v", VERSION] })] })] }) }), SP_JSX.jsx(DFL.PanelSectionRow, { children: SP_JSX.jsx(DFL.ButtonItem, { layout: "below", onClick: () => openExternal(GITHUB_URL), children: "View on GitHub" }) }), SP_JSX.jsx(DFL.PanelSectionRow, { children: SP_JSX.jsx("div", { style: { fontSize: 10, color: "#5a6473", textAlign: "center", width: "100%", padding: "2px 0 4px" }, children: "Made in Irvine, Ayrshire \uD83C\uDFF4\uDB40\uDC67\uDB40\uDC62\uDB40\uDC73\uDB40\uDC63\uDB40\uDC74\uDB40\uDC7F" }) })] })] }));
}
class Boundary extends SP_REACT.Component {
    constructor() {
        super(...arguments);
        this.state = { err: null };
    }
    static getDerivedStateFromError(err) {
        return { err };
    }
    componentDidCatch(err) {
        console.error("[GameRoulette] render error", err);
    }
    render() {
        if (this.state.err) {
            return (SP_JSX.jsx(DFL.PanelSection, { children: SP_JSX.jsx(DFL.PanelSectionRow, { children: SP_JSX.jsx("div", { style: { padding: 8, color: "#ff8a8a", fontSize: 13, textAlign: "center" }, children: "Game Roulette hit an error. Close and reopen this menu to reset." }) }) }));
        }
        return this.props.children;
    }
}
var index = definePlugin(() => ({
    name: "Game Roulette",
    titleView: SP_JSX.jsx("div", { className: DFL.staticClasses.Title, children: "Game Roulette" }),
    content: (SP_JSX.jsx(Boundary, { children: SP_JSX.jsx(Content, {}) })),
    icon: SP_JSX.jsx(WheelIcon, {}),
    onDismount() {
        /* nothing to tear down */
    },
}));

export { index as default };
//# sourceMappingURL=index.js.map
