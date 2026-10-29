// ─────────────────────────────────────────────
//  game/constants.js
//  All tuning values for Detroit Pizza Quest
// ─────────────────────────────────────────────

export const W = 780;
export const H = 520;
export const GROUND = H - 80;
export const PW = 24;
export const PH = 32;
export const GRAVITY = 0.65;
export const JUMP_POWER = -13;
export const MOVE_SPEED = 4.2;
export const MAX_HP = 100;
export const HP_REGEN = 15;          // hearts restore this much
export const MAX_LIVES = 3;
export const PIZZA_TO_BOSS = 16;     // slices needed to trigger boss
export const SONG_FILE = '/kylesong.mp3';
export const SONG_VOLUME = 0.5;
// Arcade chrome — matches the site theme (red sticker logo, cream, yellow).
export const GLD = '#E9C118';
export const MENU_BG = '#8E1512';
export const CREAM = '#F7F4EC';

// ── LEVEL CONFIGS ─────────────────────────────
// Level order: Ypsilanti → Ferndale → Detroit
export const LEVELS = [
  {
    id: 1,
    name: 'YPSILANTI',
    subtitle: 'Depot Town · 3:00 PM',
    mission: "GET TO GROVE STUDIOS",
    introQuip: "Practice started 20 minutes ago. You're still home.",
    skyTop: '#3870D8',
    skyBot: '#5C94FC',
    groundTop: '#00A800',
    groundColor: '#006600',
    laneColor: '#00CC00',
    sidewalkColor: '#a19883',
    roadColor: '#3f3d3a',
    buildingCols: ['#CC8844','#AA6622','#DD9955','#BB7733'],
    windowColor: '#FFFFAA',
    hasSun: true,
    hasClouds: true,
    smb2Ground: true,
    spawnRate: 120,
    enemySpeed: 1.4,
    enemyTypes: ['cone','metermaid','rat'],
    pizzaRate: 80,
    heartRate: 360,
    boss: 'landlord',
  },
  {
    id: 2,
    name: 'FERNDALE',
    subtitle: 'Nine Mile · 10:00 PM',
    mission: "GET TO THE ROCK SHOW",
    introQuip: "Doors at 10. It's 10:23. The opener is done. Go.",
    skyTop: '#280060',
    skyBot: '#5014A8',
    groundTop: '#CC8800',
    groundColor: '#885500',
    laneColor: '#FFAA00',
    sidewalkColor: '#4b4657',
    roadColor: '#2c2833',
    buildingCols: ['#6622AA','#8833CC','#551188','#7728BB'],
    windowColor: '#FF88FF',
    windowColor2: '#88FFFF',
    hasNeon: true,
    hasStars: true,
    smb2Ground: true,
    spawnRate: 75,
    enemySpeed: 2.2,
    enemyTypes: ['cone','metermaid','muscledude','biker','rat'],
    pizzaRate: 68,
    heartRate: 520,
    boss: 'recordexec',
  },
  {
    id: 3,
    name: 'DETROIT',
    subtitle: 'Downtown · 2:00 AM',
    mission: "RID THE RATS, SAVE THE CITY",
    introQuip: "Every slice in Detroit: gone. The Rat King did this. End him.",
    skyTop: '#080820',
    skyBot: '#181858',
    groundTop: '#222288',
    groundColor: '#111155',
    laneColor: '#4444FF',
    sidewalkColor: '#5c574c',
    roadColor: '#332f28',
    buildingCols: ['#222266','#333377','#111155','#2a2a77'],
    windowColor: '#AAAAFF',
    unlitWindow: '#221d17',
    silhouetteColor: 'rgba(6,10,16,0.6)',
    hasMoon: true,
    hasStars: true,
    smb2Ground: true,
    spawnRate: 50,
    enemySpeed: 3.0,
    enemyTypes: ['cone','metermaid','muscledude','rat','biker'],
    pizzaRate: 60,
    heartRate: 700,
    boss: 'ratking',
  },
];
