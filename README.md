# Team Cabin — Band Website

## Getting Started

```bash
# Install dependencies
npm install

# Start dev server (opens at http://localhost:5173)
npm start

# Build for production
npm run build
```

---

## Project Structure

```
src/
├── App.jsx                  ← Root: controls section order
├── index.js                 ← Entry point
├── styles/                  ← Global styles, CSS variables, component CSS
│
├── config/
│   └── constants.js         ← ⭐ EDIT YOUR CONTENT HERE
│                               Shows, music links, bios,
│                               social links, nav links, brand colors
│
└── components/
    ├── common/              ← Reusable presentational components
    ├── layout/              ← Site-wide layout components
    └── features/            ← Page sections and feature-specific code
        └── game/            ← Detroit Pizza Quest engine/rendering modules
```

---

## How to Edit Common Things

### Add a new show
Open `src/config/constants.js` and add to the `SHOWS` array:
```js
{
  mo: 'APR', d: '15',
  v: 'El Club', loc: 'Detroit, MI',
  t: '9PM Doors', feat: false,
  ticketUrl: 'https://your-ticket-link.com',
}
```
Set `feat: true` to give it the gold highlight treatment.

### Update music links
In `src/config/constants.js`, update the `url` fields in `MUSIC_LINKS`:
```js
{ name: 'Spotify', ..., url: 'https://open.spotify.com/artist/YOUR_ID' },
```

### Update social links
In `src/config/constants.js`, update the `url` fields in `SOCIAL_LINKS`:
```js
{ label: 'Instagram', url: 'https://instagram.com/teamcabin' },
```

### Update band bios
In `src/config/constants.js`, edit the `bio` and `pizza` fields in `MEMBERS`.

### Change brand colors
In `src/config/constants.js`, edit the `C` object:
```js
export const C = {
  gold:  '#D4A017',   // main gold
  goldL: '#E8B84B',   // light gold
  green: '#2D4A1E',   // dark green
  ...
};
```

### Change game difficulty
Open `src/components/features/game/constants.js` and edit the settings:
```js
export const PIZZA_TO_BOSS = 16;     // slices needed to trigger boss
export const JUMP_POWER = -13;       // more negative = higher jump

// Per-level enemy speed and spawn rate live in each LEVELS entry.
```

---

## Deploying

After running `npm run build`, the `build/` folder is ready to deploy to:
- **Netlify** — drag the `build/` folder into netlify.com
- **Vercel** — `npx vercel` from this directory
- **GitHub Pages** — add `"homepage": "."` to package.json, then `npm run build`

Security headers are configured in `public/_headers` for Netlify-compatible hosts and `vercel.json` for Vercel. GitHub Pages does not support custom response headers, so use a fronting CDN or another static host if CSP and clickjacking headers are required.
