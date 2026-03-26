# Team Cabin — Band Website

## Getting Started

```bash
# Install dependencies
npm install

# Start dev server (opens at http://localhost:3000)
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
├── index.css                ← Global styles & animations
│
├── data/
│   └── constants.js         ← ⭐ EDIT YOUR CONTENT HERE
│                               Shows, music links, bios,
│                               social links, brand colors
│
└── components/
    ├── Nav.jsx              ← Sticky navigation bar
    ├── Hero.jsx             ← Full-screen hero with logo + characters
    ├── Music.jsx            ← Streaming platform links grid
    ├── Shows.jsx            ← Upcoming shows list
    ├── Band.jsx             ← Band member cards
    ├── GameSection.jsx      ← Game section wrapper + description
    ├── PizzaGame.jsx        ← Detroit Pizza Quest canvas game
    ├── TCLogo.jsx           ← TC circle logo (SVG)
    ├── Characters.jsx       ← Pixel art characters (Steve, Mike, Kyle)
    └── SectionTitle.jsx     ← Reusable dashed section heading
```

---

## How to Edit Common Things

### Add a new show
Open `src/data/constants.js` and add to the `SHOWS` array:
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
In `src/data/constants.js`, update the `url` fields in `MUSIC_LINKS`:
```js
{ name: 'Spotify', ..., url: 'https://open.spotify.com/artist/YOUR_ID' },
```

### Update social links
In `src/data/constants.js`, update the `url` fields in `SOCIAL_LINKS`:
```js
{ label: 'Instagram', url: 'https://instagram.com/teamcabin' },
```

### Update band bios
In `src/data/constants.js`, edit the `bio` and `pizza` fields in `MEMBERS`.

### Change brand colors
In `src/data/constants.js`, edit the `C` object:
```js
export const C = {
  gold:  '#D4A017',   // main gold
  goldL: '#E8B84B',   // light gold
  green: '#2D4A1E',   // dark green
  ...
};
```

### Change game difficulty
Open `src/components/PizzaGame.jsx` and edit the settings at the top:
```js
const WIN         = 16;    // pizzas needed to win (lower = easier)
const SPAWN_RATE  = 130;   // frames between enemies (higher = easier)
const JUMP_POWER  = -13;   // more negative = higher jump
const ENEMY_SPEED = 2.5;   // higher = faster enemies
```

---

## Deploying

After running `npm run build`, the `build/` folder is ready to deploy to:
- **Netlify** — drag the `build/` folder into netlify.com
- **Vercel** — `npx vercel` from this directory
- **GitHub Pages** — add `"homepage": "."` to package.json, then `npm run build`
