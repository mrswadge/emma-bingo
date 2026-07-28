# ✨ Emma Bingo ✨

A fun, fully client-side bingo game built for GitHub Pages.

## How to play

1. Open the page – you get **this week's board** (same for everyone in the same Mon–Sun week).
2. **Tap / click a phrase** to cross it off.  Tap it again if you need to undo it.
3. Keep going until all phrases are crossed off and the **EMMA BINGO!** celebration fires 🎊  
   *(your browser will announce the winner via speech synthesis)*

## Controls

| Button | What it does |
|--------|--------------|
| 📅 **Weekly** | Switch to this week's shared board |
| 🔀 **Shuffle** | Generate your own random board (saved for the week) |
| 🔄 **Reset** | Clear all crosses on the current board |
| **Board size** | Choose 3×3, 4×4, 5×5 (default), 6×6 or 7×7 |

## Features

- **Weekly rotation** – boards change automatically every Monday; no server needed.
- **Persistent state** – crosses are remembered in `localStorage` so you can close the tab and come back.
- **Odd-sized grids** (3×3, 5×5, 7×7) have an Emma Bingo logo in the centre as a free space.
- **Victory screen** – full-screen confetti animation + speech synthesis ("EMMA BINGO! …").
- **Keyboard accessible** – cells can be toggled with `Enter` or `Space`.

## Deploying to GitHub Pages

1. Go to your repository **Settings → Pages**.
2. Under *Source* choose **Deploy from a branch**, select `main` and `/ (root)`.
3. Save – your site will be live at `https://<your-username>.github.io/emma-bingo/`.
