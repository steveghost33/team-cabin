// ── Brand Colors ──
// Used by the canvas game renderer (JS context) and as a reference for CSS variables.
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

// ── Nav Links ──
export const NAV_LINKS = [
  { id: 'home',  label: 'Home' },
  { id: 'music', label: 'Music' },
  { id: 'shows', label: 'Shows' },
  { id: 'band',  label: 'The Band' },
  { id: 'game',  label: '🍕 Pizza Quest', mobileLabel: '🍕 Pizza Quest Game' },
];

// ── Upcoming Shows ──
// feat: true → gold highlight border
export const SHOWS = [
  {
    mo:   'MAY',
    d:    '08',
    v:    'Ypsi Ale House',
    loc:  'Ypsilanti, MI',
    t:    'w/ Shindig Machine, Frost Is Rad & Twin Deer',
    feat: true,
  },
];

// ── Music Streaming Links ──
export const MUSIC_LINKS = [
  { name: 'Bandcamp',      icon: '◎', color: '#1da0c3', bg: 'rgba(29,160,195,0.1)',  url: 'https://teamcabin.bandcamp.com/album/tall-bike' },
  { name: 'Apple Music',   icon: '♪', color: '#fc3c44', bg: 'rgba(252,60,68,0.1)',   url: 'https://music.apple.com/us/album/tall-bike-single/1895354765' },
  { name: 'YouTube Music', icon: '▶', color: '#ff0000', bg: 'rgba(255,0,0,0.1)',     url: 'https://music.youtube.com/channel/UCTjflMMBBqxCs2oUNMVLIuA?si=15mKpkFEZfdxr3v7' },
  { name: 'YouTube',       icon: '▶', color: '#ff4444', bg: 'rgba(255,68,68,0.1)',   url: 'https://www.youtube.com/watch?v=DzjUkpx3O6g', label: 'Watch Now →' },
  { name: 'Amazon Music',  icon: '★', color: '#ff9900', bg: 'rgba(255,153,0,0.1)',   url: 'https://music.amazon.com/albums/B0GTWT6XVK?marketplaceId=ATVPDKIKX0DER&musicTerritory=US&ref=dm_sh_Q6SpmxblyKtmfFX6S9g9z92Da&trackAsin=B0GTXBRZCY' },
  { name: 'Spotify',       icon: '♫', color: '#1db954', bg: 'rgba(29,185,84,0.1)',   url: 'https://open.spotify.com/album/7LCGYsups8nXjBB3NLyZkn?si=FhNynvoOSQ66DuGgyM3-zg' },
];

// ── Social / Footer Links ──
export const SOCIAL_LINKS = [
  { label: 'Instagram',   url: 'https://www.instagram.com/teamcabin' },
  { label: 'Facebook',    url: 'https://www.facebook.com/TeamCabin/' },
  { label: 'Threads',     url: 'https://www.threads.com/@teamcabin' },
  { label: 'Twitter / X', url: 'https://x.com/weareteamcabin' },
  { label: 'TikTok',      url: 'https://www.tiktok.com/@weareteamcabin' },
  { label: 'YouTube',     url: 'https://youtube.com/@teamcabinmi?si=my2xg-r5hxGNAAsl' },
];

// ── Band Members ──
// charId maps to CHARS index in Characters.jsx: 0=Steve, 1=Mike, 2=Kyle
export const MEMBERS = [
  {
    charId: 0,
    name:   'STEVE',
    role:   'Bass & Vocals',
    bio:    'The kind of guy who finds the deeper story in a two-minute song — thoughtful, grounded, and always a little surprising. Holds down the low end and keeps the whole thing honest.',
    pizza:  'Deep dish, obviously',
  },
  {
    charId: 1,
    name:   'MIKE',
    role:   'Drums',
    bio:    'Everybody loves Mike. Walks into a room and leaves it louder and happier than he found it. Keeps the beat and the mood — simultaneously the heartbeat and the punchline of the band.',
    pizza:  'Whatever makes the table laugh',
  },
  {
    charId: 2,
    name:   'KYLE',
    role:   'Guitar & Vocals',
    bio:    'Tall, lanky, and somehow always three chords ahead of everyone else in the room. A bona fide guitar-slinging music obsessive — the kind of guy who hears the song inside the song.',
    pizza:  'Thin crust, non-negotiable',
  },
];
