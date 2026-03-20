// ─────────────────────────────────────
//  TEAM CABIN — Editable Site Data
//  Change shows, music links, bios,
//  social links, and colors all here.
// ─────────────────────────────────────

// ── Brand Colors ──
export const C = {
  gold:     '#E2A820',
  goldL:    '#f0c040',
  goldD:    '#a07810',
  green:    '#1C3D12',
  greenM:   '#2D4A1E',
  greenL:   '#4A7A30',
  cream:    '#F5F0DC',
  creamD:   '#c8c0a0',
  black:    '#080f06',
  offBlack: '#111a0e',
};

// ── Upcoming Shows ──
// feat: true  → gold highlight + primary ticket button
// feat: false → standard styling
export const SHOWS = [
  {
    mo:   'MAY',
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
  { name: 'Spotify',       icon: '♫', color: '#1db954', url: 'https://open.spotify.com/artist/3Tf5gGxM19534XdbyqHsUO?si=ATZjxDE1SVqWGmuJSgscug' },
  { name: 'Apple Music',   icon: '♪', color: '#fc3c44', url: 'https://music.apple.com/us/artist/team-cabin/1232990862' },
  { name: 'Bandcamp',      icon: '◎', color: '#1da0c3', url: 'https://teamcabin.bandcamp.com/' },
  { name: 'YouTube Music', icon: '▶', color: '#ff0000', url: 'https://music.youtube.com/channel/UCTjflMMBBqxCs2oUNMVLIuA?si=15mKpkFEZfdxr3v7' },
  { name: 'YouTube',       icon: '▶', color: '#ff4444', url: 'https://youtube.com/@teamcabinmi?si=my2xg-r5hxGNAAsl' },
  { name: 'SoundCloud',    icon: '☁', color: '#ff5500', url: 'https://soundcloud.com' },
  { name: 'Amazon Music',  icon: '★', color: '#ff9900', url: 'https://music.amazon.com/artists/B071L2FBBB/team-cabin' },
];

// ── Social / Footer Links ──
export const SOCIAL_LINKS = [
  { label: 'Instagram',   url: 'https://www.instagram.com/teamcabin' },
  { label: 'Facebook',    url: 'https://www.facebook.com/TeamCabin/' },
  { label: 'Threads',     url: 'https://www.threads.com/@teamcabin' },
  { label: 'Twitter / X', url: 'https://x.com/weareteamcabin' },
  { label: 'TikTok',      url: 'https://www.tiktok.com/@weareteamcabin' },
  { label: 'YouTube',     url: 'https://youtube.com/@teamcabinmi?si=my2xg-r5hxGNAAsl' },
  { label: 'Press Kit',   url: '#' },
  { label: 'Mailing List',url: '#' },
];

// ── Band Members ──
// charId = 0 (Steve), 1 (Mike), 2 (Kyle) — matches pixel art order
export const MEMBERS = [
  {
    charId: 0,
    name:  'STEVE',
    role:  'Bass & Vocals',
    bio:   'The kind of guy who turns a 2-minute song into a minor philosophy lecture — rough around the edges, but the kind of rough that makes you think. Holds the low end like a grudge.',
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
