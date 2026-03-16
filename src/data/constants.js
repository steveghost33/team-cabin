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
export const MUSIC_LINKS = [
  { name: 'Spotify',      icon: '♫', color: '#1db954', bg: 'rgba(29,185,84,0.1)',   url: 'https://open.spotify.com/artist/3Tf5gGxM19534XdbyqHsUO?si=ATZjxDE1SVqWGmuJSgscug' },
  { name: 'Apple Music',  icon: '♪', color: '#fc3c44', bg: 'rgba(252,60,68,0.1)',   url: 'https://music.apple.com/us/artist/team-cabin/1232990862' },
  { name: 'Bandcamp',     icon: '◎', color: '#1da0c3', bg: 'rgba(29,160,195,0.1)',  url: 'https://teamcabin.bandcamp.com/' },
  { name: 'YouTube Music',icon: '▶', color: '#ff0000', bg: 'rgba(255,0,0,0.1)',     url: 'https://music.youtube.com/channel/UCTjflMMBBqxCs2oUNMVLIuA?si=15mKpkFEZfdxr3v7' },
  { name: 'YouTube',      icon: '▶', color: '#ff4444', bg: 'rgba(255,68,68,0.1)',   url: 'https://youtube.com/@teamcabinmi?si=my2xg-r5hxGNAAsl' },
  { name: 'SoundCloud',   icon: '☁', color: '#ff5500', bg: 'rgba(255,85,0,0.1)',    url: 'https://soundcloud.com' },
  { name: 'Amazon Music', icon: '★', color: '#ff9900', bg: 'rgba(255,153,0,0.1)',   url: 'https://music.amazon.com' },
];

// ── Social / Footer Links ──
export const SOCIAL_LINKS = [
  { label: 'Instagram', url: 'https://www.instagram.com/teamcabin' },
  { label: 'Facebook',  url: 'https://www.facebook.com/TeamCabin/' },
  { label: 'Threads',   url: 'https://www.threads.com/@teamcabin' },
  { label: 'Twitter / X', url: 'https://x.com/weareteamcabin' },
  { label: 'TikTok',    url: 'https://www.tiktok.com/@weareteamcabin' },
  { label: 'YouTube',   url: 'https://youtube.com/@teamcabinmi?si=my2xg-r5hxGNAAsl' },
  { label: 'Press Kit', url: '#' },
  { label: 'Mailing List', url: '#' },
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
