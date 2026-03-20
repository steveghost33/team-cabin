export const LEVELS = [
  {
    id: 1,
    name: 'YPSILANTI',
    subtitle: 'Depot Town',
    // DAYTIME — blue sky, warm brick buildings, green grass
    daytime: true,
    skyTop: '#5b8fce',
    skyBot: '#a8d4f5',
    groundTop: '#4a8a3a',     // grass strip
    groundTopH: 14,
    groundColor: '#8B6914',   // dirt/sidewalk
    streetColor: '#555',
    laneColor: '#e0e0e0',
    groundLine: '#3a7a2a',
    // buildings — warm brick reds, creams, forest greens
    buildingCols: ['#8B3A2A','#c9a87c','#5a7a3a','#a05030','#d4b896','#3a6a50'],
    windowColor: '#ffe8a0',
    roofColor: '#6b2020',
    awningCols: ['#c0392b','#2980b9','#27ae60','#e67e22'],
    // special buildings
    specials: ['grove','hyperion','ypsi'],
    // gameplay
    spawnRate: 110,           // easy — lots of time between spawns
    enemySpeed: 2.8,
    collectible: 'pizza',
    boss: 'landlord',
    collectTarget: 16,
    // visual extras
    hasGrass: true,
    cloudColor: '#fff',
    sunColor: '#FFD700',
    groundDecor: 'cracks',    // cracks in sidewalk
  },
  {
    id: 2,
    name: 'DOWNTOWN DETROIT',
    subtitle: 'St. Andrews · Checker · Ren Cen',
    // NIGHT — dark sky, neon lights, concrete
    daytime: false,
    skyTop: '#080c18',
    skyBot: '#0f1a2e',
    groundTop: '#1a1a1a',     // dark concrete
    groundTopH: 8,
    groundColor: '#111',
    streetColor: '#0d0d0d',
    laneColor: '#E2A820',
    groundLine: '#333',
    // buildings — dark with neon accents, blues and teals
    buildingCols: ['#0a1525','#0e2035','#081830','#122040','#0c1a2e','#162845'],
    windowColor: '#E2A820',
    windowColor2: '#40e0ff',  // neon blue/teal second color
    roofColor: '#050d1a',
    awningCols: ['#cc0000','#0066cc','#00aa66'],
    specials: ['standrews','checker','rencen'],
    spawnRate: 75,
    enemySpeed: 4.0,
    collectible: 'pizza',
    boss: 'ratking',
    collectTarget: 16,
    hasGrass: false,
    moonColor: '#d0e8ff',
    neon: true,               // draw neon glow effects
    groundDecor: 'grate',     // metal grates
  },
  {
    id: 3,
    name: 'MEXICANTOWN',
    subtitle: 'Vernor & Bagley',
    // SUNSET/DUSK — warm orange sky, colorful buildings
    daytime: false,
    skyTop: '#1a0a00',
    skyBot: '#8B3a00',
    groundTop: '#5a3010',     // terra cotta
    groundTopH: 10,
    groundColor: '#3a1a08',
    streetColor: '#2a1206',
    laneColor: '#e74c3c',
    groundLine: '#8B4513',
    // buildings — vibrant pinks, yellows, terracottas, turquoise
    buildingCols: ['#c0392b','#e67e22','#16a085','#8e44ad','#d4ac0d','#922b21'],
    windowColor: '#f39c12',
    windowColor2: '#e74c3c',
    roofColor: '#922b21',
    awningCols: ['#e74c3c','#f39c12','#2ecc71','#9b59b6'],
    specials: ['mexican'],
    spawnRate: 48,            // hard — fast spawns
    enemySpeed: 5.2,
    collectible: 'taco',
    boss: 'recordexec',
    collectTarget: 16,
    hasGrass: false,
    moonColor: '#ffd700',
    groundDecor: 'tile',      // decorative tiles
    hasPapelPicado: true,
  },
];
