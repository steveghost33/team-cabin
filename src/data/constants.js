// ─────────────────────────────────────
//  TEAM CABIN — Editable Site Data
//  Change shows, music links, bios,
//  social links, and colors all here.
// ─────────────────────────────────────

// ── Brand Colors ──
export const C = {
  gold:   '#D4A017',
  goldL:  '#E8B84B',
  goldD:  '#A07810',
  green:  '#2D4A1E',
  greenM: '#3D6B2A',
  greenL: '#4A7A30',
  cream:  '#F5F0DC',
  black:  '#0a0a0a',
};

// ── Upcoming Shows ──
// Add or remove show objects here.
// feat: true  → gold highlight + bigger ticket button
// feat: false → standard styling
export const SHOWS = [
  {
    mo:   'MAR',
    d:    '08',
    v:    'Ypsi Ale House',
    loc:  'Ypsilanti, MI',
    t:    'w/ Cult Therapy & Shindig Machine',
    feat: true,
    ticketUrl: '#',   // ← replace with real ticket link
  },
  // Add more shows like this:
  // {
  //   mo: 'APR', d: '15',
  //   v: 'El Club', loc: 'Detroit, MI',
  //   t: '9PM Doors', feat: false, ticketUrl: '#',
  // },
];

// ── Music Streaming Links ──
// Replace the url values with your real profile links.
export const MUSIC_LINKS = [
  { name: 'Spotify',      icon: '♫', color: '#1db954', bg: 'rgba(29,185,84,0.1)',   url: 'https://open.spotify.com' },
  { name: 'Apple Music',  icon: '♪', color: '#fc3c44', bg: 'rgba(252,60,68,0.1)',   url: 'https://music.apple.com' },
  { name: 'Bandcamp',     icon: '◎', color: '#1da0c3', bg: 'rgba(29,160,195,0.1)',  url: 'https://bandcamp.com' },
  { name: 'YouTube',      icon: '▶', color: '#ff0000', bg: 'rgba(255,0,0,0.1)',      url: 'https://youtube.com' },
  { name: 'SoundCloud',   icon: '☁', color: '#ff5500', bg: 'rgba(255,85,0,0.1)',     url: 'https://soundcloud.com' },
  { name: 'Amazon Music', icon: '★', color: '#ff9900', bg: 'rgba(255,153,0,0.1)',   url: 'https://music.amazon.com' },
];

// ── Social / Footer Links ──
// Replace '#' with real URLs
export const SOCIAL_LINKS = [
  { label: 'Instagram',   url: '#' },
  { label: 'Facebook',    url: '#' },
  { label: 'Twitter / X', url: '#' },
  { label: 'TikTok',      url: '#' },
  { label: 'Press Kit',   url: '#' },
  { label: 'Mailing List',url: '#' },
];

// ── Band Members ──
// bio    = shown on the band section card
// pizza  = fun pizza preference shown at bottom of card
// charId = 0 (Steve/plaid), 1 (Mike/hoodie), 2 (Kyle/green jacket)
//          Must match the character pixel art order — don't change unless
//          you also update the character components.
export const MEMBERS = [
  {
    charId: 0,
    name:  'STEVE',
    role:  'Bass & Vocals',
    bio:   'The kind of guy who turns a three-minute song into a minor philosophy lecture — rough around the edges, but the kind of rough that makes you think. Holds the low end like a grudge.',
    pizza: 'Deep dish, obviously',
  },
  {
    charId: 1,
    name:  'MIKE',
    role:  'Drums',
    bio:   'Everybody loves Mike. Walks into a room and leaves it louder and happier than he found it. Keeps the beat and the mood — simultaneously the heartbeat and the punchline of the band.',
    pizza: 'Whatever makes the table laugh',
  },
  {
    charId: 2,
    name:  'KYLE',
    role:  'Guitar & Vocals',
    bio:   'Tall, lanky, and somehow always three chords ahead of everyone else in the room. A bona fide guitar-slinging music obsessive — the kind of guy who hears the song inside the song.',
    pizza: 'Thin crust, non-negotiable',
  },
];
