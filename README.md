# ✨ Emma Bingo ✨

A fun, fully client-side bingo game built for GitHub Pages.

## How to play

1. Open the page – you get **your weekly board** (saved per player for that Mon–Sun week).
2. **Tap / click a phrase** to cross it off.  Tap it again if you need to undo it.
3. Keep going until all phrases are crossed off and the **EMMA BINGO!** celebration fires 🎊  
   *(your browser will announce the winner via speech synthesis)*

## Controls

| Button | What it does |
|--------|--------------|
| 📅 **Weekly** | Switch to your weekly board for this week |
| 🔀 **Shuffle** | Generate a random board and persist it in the URL |
| 🔄 **Reset** | Clear all crosses on the current board |
| **Board size** | Choose 3×3, 4×4, 5×5 (default), 6×6 or 7×7 |

## Victory animation

When all phrases are crossed off, a full-screen **MilkDrop/Geiss-style** animation fires:

- **Zoom-warp feedback loop** — the screen zooms with tighter bounds to keep the animation full-screen
- **Plasma colour blobs** — screen-blended animated gradients paint shifting rainbow backgrounds
- **Emma particles** — Emma's photo orbits, spirals, wobbles and tunnels across the screen with more prominent photo rendering
- **Auto-stops after 60 seconds**, then the victory panel fades in
- **Tap/click anywhere** during the animation to add more Emmas, randomise the colour palette, and increase the chaos (up to 12 taps)
- At **tap level 3+**, a **kaleidoscope mirror effect** kicks in with increasing symmetry
- At **tap level 5+**, all Emmas enter **tunnel mode** (flying toward the viewer)
- Speech synthesis announces "EMMA BINGO! …" at the start (female voice preferred when available)
- Victory music plays alongside the celebration

### Adding Emma's photo

The animation uses `emma.png` in the repository root. Add the photo to unlock the full effect:

1. Save your Emma photo as `emma.png` (any size — square works best)
2. Commit it to the repository root
3. The animation will automatically use it

Without `emma.png` the animation still runs — each particle slot shows a 👸 emoji avatar instead.


## Deploying to GitHub Pages

1. Go to your repository **Settings → Pages**.
2. Under *Source* choose **Deploy from a branch**, select `main` and `/ (root)`.
3. Save – your site will be live at `https://<your-username>.github.io/emma-bingo/`.
