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
export const HP_REGEN = 25;          // hearts restore this much
export const MAX_LIVES = 3;
export const PIZZA_TO_BOSS = 16;     // slices needed to trigger boss
export const SONG_FILE = '/kylesong.mp3';
export const SONG_VOLUME = 0.5;
export const GLD = '#E2A820';
export const GRN = '#1C3D12';
export const GRN2 = '#2D4A1E';
export const CREAM = '#F5F0DC';

// ── LEVEL CONFIGS ─────────────────────────────
// Each level increases enemy speed, spawn rate, more variety
export const LEVELS = [
  {
    id: 1,
    name: 'YPSILANTI',
    subtitle: 'Depot Town · 3:00 PM',
    // Sky: afternoon blue
    skyTop: '#1a4a8a',
    skyBot: '#4a90cf',
    groundTop: '#3a7a28',    // grass green
    groundColor: '#1a3a10',
    laneColor: '#4a8a3a',
    buildingCols: ['#8B4513','#6B3A2A','#9B5523','#7B4010'],
    windowColor: '#FFD700',
    hasSun: true,
    hasClouds: true,
    // Gameplay — easiest
    spawnRate: 120,
    enemySpeed: 1.4,
    enemyTypes: ['cone','metermaid','rat'],   // limited enemy variety
    pizzaRate: 80,
    heartRate: 200,          // hearts spawn often
    boss: 'landlord',
  },
  {
    id: 2,
    name: 'DETROIT',
    subtitle: 'Downtown · 11:00 PM',
    // Sky: night
    skyTop: '#050d03',
    skyBot: '#112009',
    groundTop: '#0c0c0c',
    groundColor: '#111',
    laneColor: '#E2A820',
    buildingCols: ['#162b10','#1e3314','#0f2008','#243c17'],
    windowColor: '#E2A820',
    hasMoon: true,
    hasStars: true,
    // Gameplay — medium
    spawnRate: 85,
    enemySpeed: 2.0,
    enemyTypes: ['cone','metermaid','muscledude','rat'],
    pizzaRate: 72,
    heartRate: 280,
    boss: 'ratking',
  },
  {
    id: 3,
    name: 'FERNDALE',
    subtitle: 'Nine Mile · 2:00 AM',
    // Sky: deep night, neon
    skyTop: '#020508',
    skyBot: '#080f18',
    groundTop: '#080808',
    groundColor: '#0a0a0a',
    laneColor: '#e74c3c',
    buildingCols: ['#1a0530','#25083a','#100220','#1e0630'],
    windowColor: '#ff44aa',
    windowColor2: '#44aaff',
    hasNeon: true,
    hasStars: true,
    // Gameplay — hardest
    spawnRate: 55,
    enemySpeed: 3.0,
    enemyTypes: ['cone','metermaid','muscledude','rat','biker'],
    pizzaRate: 60,
    heartRate: 380,          // hearts rare
    boss: 'recordexec',
  },
];
