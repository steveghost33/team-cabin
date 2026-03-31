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
export const GLD = '#E2A820';
export const GRN = '#1C3D12';
export const GRN2 = '#2D4A1E';
export const CREAM = '#F5F0DC';

// ── LEVEL CONFIGS ─────────────────────────────
// Level order: Ypsilanti → Ferndale → Detroit
export const LEVELS = [
  {
    id: 1,
    name: 'YPSILANTI',
    subtitle: 'Depot Town · 3:00 PM',
    mission: "GET TO GROVE STUDIOS",
    introQuip: "Your practice started 10 minutes ago. You're still at home.",
    skyTop: '#1a4a8a',
    skyBot: '#4a90cf',
    groundTop: '#3a7a28',
    groundColor: '#1a3a10',
    laneColor: '#4a8a3a',
    buildingCols: ['#8B4513','#6B3A2A','#9B5523','#7B4010'],
    windowColor: '#FFD700',
    hasSun: true,
    hasClouds: true,
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
    introQuip: "Doors opened at 10. It's 10:12. You're across town. Cool.",
    skyTop: '#0d0820',
    skyBot: '#1a1035',
    groundTop: '#1a1a1a',
    groundColor: '#222222',
    laneColor: '#e74c3c',
    buildingCols: ['#2e0d50','#3a1060','#230840','#320c58'],
    windowColor: '#ff55bb',
    windowColor2: '#55bbff',
    hasNeon: true,
    hasStars: true,
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
    introQuip: "The Rat King has claimed every pizzeria in Detroit. Not on your watch.",
    skyTop: '#050d03',
    skyBot: '#112009',
    groundTop: '#0c0c0c',
    groundColor: '#111',
    laneColor: '#E2A820',
    buildingCols: ['#162b10','#1e3314','#0f2008','#243c17'],
    windowColor: '#E2A820',
    hasMoon: true,
    hasStars: true,
    spawnRate: 50,
    enemySpeed: 3.0,
    enemyTypes: ['cone','metermaid','muscledude','rat','biker'],
    pizzaRate: 60,
    heartRate: 700,
    boss: 'ratking',
  },
];
