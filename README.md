# game-roulette
 Decky Loader plugin for the Steam Deck. Spins a slot-machine reel of your library capsules and lands on something to play, so you stop staring at 300 games and just *pick one*.


## What it does

- **Slot reel** — real cover art whizzes past and decelerates onto a winner.
- **Filters** — installed-only, and playtime buckets (never played / under 2h /
  under 10h) so it doubles as a backlog-buster.
- **Weight toward neglected** — inverse-playtime weighting means the games
  you've barely touched land more often.
- **Avoid recent rolls** — won't keep landing on the same three.
- **Launch now** — one tap boots the winner straight from the Quick Access Menu.

Filters and roll history are persisted by the Python backend, so they survive
reboots.

## Building

Requires Node 18+ and pnpm.

```bash
pnpm install
pnpm run build
```

That produces `dist/index.js`. A deployable plugin is the folder containing:

```
game-roulette/
├── plugin.json
├── main.py
├── package.json
└── dist/
    └── index.js
```

## Installing on the Deck

1. Copy the built folder to `~/homebrew/plugins/game-roulette` on the Deck
   (SSH, or the Decky "Developer mode → install from ZIP" flow).
2. Restart Decky (or reboot). It appears in the Quick Access Menu (••• button)
   with a dice icon.

For iterating, Decky's developer mode + `pnpm run watch` plus remote deploy is
the usual loop.

## How it reaches the library

The frontend reads `collectionStore.allAppsCollection.allApps` from the live
Steam client and launches via `SteamClient.Apps.RunGame`. Capsule art is pulled
from the client's local asset cache (`steamloopback.host`), so the reel needs no
network. Those store shapes are stable but Valve-owned — every access is
defensive, so a future client rename degrades to an empty pool rather than a
crash. If a Steam update ever empties the pool, the field names in
`readLibrary()` in `src/index.tsx` are the place to look.

## Notes

- `prefers-reduced-motion` is respected — the reel snaps to the result instead
  of spinning.
- Backend settings live in Decky's per-plugin settings directory as
  `settings.json`.

## License

BSD-3-Clause.
