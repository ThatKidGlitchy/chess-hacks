# Chess Assist

Stockfish chess engine hack for chess.com. Desktop and mobile versions included.

![Chess Assist UI](.github/screenshot.png)

## Features

- **Auto-play** — engine plays the best move automatically each turn with anti-repetition to avoid draw loops
- **Move delay** — random delay before auto-play moves (0–15s) to simulate human thinking time
- **Best move arrows** — green arrow showing the engine's top pick
- **Hidden arrows** — subtle square shading instead of visible arrows for a less obvious look
- **Opponent's best move** — red arrow predicting the opponent's best reply
- **Win percent eval bar** — live vertical bar showing win probability from Stockfish evaluation
- **Cheat detection** — real-time CPL, accuracy %, best move rate, and suspicion gauge
- **Opponent / You toggle** — track the opponent's accuracy or your own with full move history
- **Re-analyze game** — replay all moves through the engine to recalculate stats
- **Custom piece skins** — upload custom images for any piece (both colors)
- **Board themes** — custom board background image
- **Tile overlays** — separate images for light and dark squares
- **Adjustable depth** — engine search depth from 1 to 24 (default 16)
- **Customizable keybinds** — assign hotkeys to any toggle
- **Tabbed UI** — Gameplay / Detection / Skins in a draggable panel
- All settings persist in localStorage across page reloads (toggles, depth, delay, keybinds, detection target)
- All skins persist in localStorage across sessions
- Runs entirely client-side, no data sent anywhere

## Install — pick one

There are three ways to install Chess Assist. Pick whichever works for you:

### Use warning and disclaimer

By downloading, installing, or using Chess Assist, you acknowledge that you have read and agree to the [Use Warning and Disclaimer](Chess-Assist-Disclaimer.md)

### 1. Tampermonkey

Install from Greasy Fork or directly from GitHub:

- **Desktop:** [chess-assist-tampermonkey.js](https://raw.githubusercontent.com/ThatKidGlitchy/chess-hacks/main/chess-assist-tampermonkey.js)
- **Mobile:** [chess-assist-tampermonkey-mobile.js](https://raw.githubusercontent.com/ThatKidGlitchy/chess-hacks/main/chess-assist-tampermonkey-mobile.js)

Open the raw link with Tampermonkey installed and it will offer to install the script. Updates automatically.

### 2. Chrome Extension

Download [`chess-assist-extension.zip`](https://github.com/ThatKidGlitchy/chess-hacks/releases/latest/download/chess-assist-extension.zip) from [releases](https://github.com/ThatKidGlitchy/chess-hacks/releases), unzip, and load as an unpacked extension at `chrome://extensions` with Developer mode on.

### 3. Bookmarklet

See below under each version for the bookmarklet loader URL.

## Desktop (chess-assist.js)

### Usage — Loader Bookmarklet

Always runs the latest version from GitHub:

1. Create a bookmark in your browser with this URL:
   ```
   javascript:void(fetch('https://raw.githubusercontent.com/ThatKidGlitchy/chess-hacks/main/chess-assist.js').then(r=>r.text()).then(eval))
   ```
2. Open a game on chess.com, click the bookmarklet
3. Click the knight icon to open the panel

### Alternative — paste in console

1. Open a game on chess.com
2. Open browser DevTools (F12 → Console)
3. Paste the contents of `chess-assist.js` and press Enter
4. Click the knight icon to open the panel

## Mobile / iOS Safari (chess-assist-mobile.js)

Same features as desktop (including skins, live win percent eval bar and engine detection) except no keybind system and no hide-all toggle (mobile doesn't use keyboards). Touch-optimized with larger targets (48px bubble, 28px switches, 22px slider thumbs), close button on panel, slightly longer timeouts for slower devices.

### Usage — Loader Bookmarklet

Always runs the latest version from GitHub:

1. Create a bookmark in Safari with this URL:
   ```
   javascript:void(fetch('https://raw.githubusercontent.com/ThatKidGlitchy/chess-hacks/main/chess-assist-mobile.js').then(r=>r.text()).then(eval))
   ```
2. Open a chess.com game in Safari, tap the bookmarklet
3. Tap the knight icon to open the panel

### Alternative — paste in console

On desktop Safari or any browser with console access, paste the contents of `chess-assist-mobile.js` directly.

## Engine

Both versions use Stockfish 19 WASM (lite single-threaded build) loaded from unpkg CDN. Falls back to ASM.js if WASM is unavailable. MultiPV 3 with anti-repetition logic to avoid draw loops.

## Arrow Colors

| Arrow | Color | Meaning |
|-------|-------|---------|
| Green | #96bc4b | Your best move |
| Red | #e04040 | Opponent's best reply |

## Notes

- Works on chess.com only (relies on chess.com DOM structure)
- The script runs entirely client-side — no data sent anywhere
- Use the loader bookmarklet to always get the latest version automatically
- Both arrow types can be shown simultaneously (different SVG layers)
- Thank you "Chess helper (chess.com)" on the Chrome web store for the UI theme!
