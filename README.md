# Neha portfolio draft

Current working draft for the portfolio site.

## Project goals
- Keep the design clean, polished, and professional.
- Stay original, inspired by references but not copied.
- Use factual content from the CV and real provided material only.
- Keep changes reviewable before any repo migration, commit, or deployment.

## Local files
- `index.html` , main page structure and content
- `style.css` , global styles, layout, theme rules
- `script.js` , smooth scrolling, theme toggle, debug logging
- `assets/` , local images and company logos
- `TODO.md` , current follow-up work

## Run locally
From this folder:

```bash
python3 -m http.server 8019
```

Then open:

```text
http://localhost:8019
```

## Current hero direction
The avatar / mascot experiments were intentionally removed.
The hero is now text-led until a stronger visual direction is chosen later.

If an avatar is revisited later, build it in a separate branch or isolated component first.

## Theme toggle
A day / night toggle is available in the top bar.

### Theme behavior
- stores preference in `localStorage`
- key: `neha-portfolio-theme`
- respects system theme if no stored preference exists

## Debug logging
`script.js` now exposes a lightweight debug surface on `window.portfolioSite`.

### Default behavior
- debug logging is enabled on localhost
- can also be enabled with `?debug=1`
- can be persisted with localStorage via helper methods below

### Useful console helpers
Open browser devtools and use:

```js
window.portfolioSite.dumpState()
window.portfolioSite.enableDebug()
window.portfolioSite.disableDebug()
window.portfolioSite.todo
window.portfolioSite.state
```

### What gets logged
- site boot sequence
- theme initialization
- theme toggle changes
- smooth-scroll setup
- missing anchor targets
- current TODO snapshot

## Editing guide

### Update hero copy
Edit the hero section in `index.html`.
Look for:
- `QA AUTOMATION ENGINEER · SDET · RESEARCH BACKGROUND`
- `Quality engineering for products that need confidence...`
- `hero-panel-featured`

### Update text content elsewhere
Edit section copy directly in `index.html`.
Recommended review targets:
- About
- Projects / Featured work
- Recommendations
- Outside Work
- Contact

### Update styles
Edit `style.css`.
Recommended entry points:
- root variables in `:root`
- dark theme variables in `body[data-theme="dark"]`
- hero layout styles
- section card styles

### Update behavior
Edit `script.js`.
The file is organized into:
- config
- todo list
- logger
- smooth scroll init
- theme init
- exported debug helpers

## Content safety notes
- Do not invent recommendations, publications, or role details.
- Keep company logos and experience details factual.
- Keep the visual tone elegant, not playful or childish.

## Future workflow suggestion
When revisiting visual experiments:
1. build them separately first
2. review in isolation
3. only merge into `index.html` after approval

## GitHub Pages compatibility
This project is already set up in a GitHub Pages friendly way:
- all CSS, JS, and image paths are relative
- no build step is required
- the site can be hosted as a plain static site
- a `.nojekyll` file is included so GitHub Pages serves files directly without Jekyll processing

### Recommended deployment flow
If you are publishing to your `neha.github.io` repository:
1. copy these files into the repository root
2. keep `index.html`, `style.css`, `script.js`, `assets/`, `README.md`, `TODO.md`, and `.nojekyll`
3. commit and push to the default branch
4. in GitHub Pages settings, ensure publishing is enabled from the repository root

### Final pre-push checklist
- review content one last time
- test locally on `http://localhost:8019`
- confirm all external links open correctly
- confirm images load from `assets/`
- confirm dark mode toggle still works after refresh

## Open tasks
See `TODO.md`.
