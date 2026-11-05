# What Should I Eat?

A spinning meal wheel that picks a halal-friendly dish when you cannot decide. Live at https://naadirsoofi.github.io/what-should-i-eat/

## Features

- Labelled wheel: up to twelve dishes are dealt onto the wheel from the categories you choose, and the result card always shows the slice the pointer lands on.
- 62 dishes across breakfast, lunch, dinner, snacks, desserts, drinks and quick bites.
- Favourites: save a pick with the heart, reopen it from the favourites list, or spin from favourites only.
- Preferences (categories, favourites, sound, confetti, theme) are saved in your browser with localStorage.
- Optional sound (synthesised with the Web Audio API, off by default) and confetti.
- Light and dark themes, keyboard friendly (Space spins), and reduced motion support (the wheel lands without spinning and confetti is skipped).
- Easter egg: type C, A, T and a cat takes the wheel.

## Run locally

No build step. Serve the folder with any static server, for example:

```
python -m http.server 5631 --bind 127.0.0.1
```

Then open http://127.0.0.1:5631/

## Files

- `index.html`: page structure and the inline SVG icon set
- `style.css`: layout, themes and wheel styling
- `script.js`: menu data, wheel drawing, spin logic, sound and storage
- `favicon.svg`: site icon
- `.github/workflows/deploy.yml`: publishes the site files to GitHub Pages on push to `main`

## Adding dishes

Add an entry to the `FOOD` array in `script.js` with a unique `id`, a `name`, a `short` wheel label (about 14 characters at most), one or more `category` ids, an `icon` name from the sprite in `index.html`, a `description` and `tags`.

## Halal note

Meat and seafood dishes assume halal sourcing. Always check packaged and restaurant food yourself.
