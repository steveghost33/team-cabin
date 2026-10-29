// Original character art on a two-pixel grid. Dots are transparent pixels.
const INK = '#17152b';
const PAPER = '#fff1d8';
const BASE = { '#': INK, w: PAPER, s: '#f6bd87', d: '#cd8054', h: '#69452d', p: '#32354f', b: '#343044' };

export const HERO_PALETTES = [
  { ...BASE, c: '#a3a6b0', l: '#d4d5d8', t: '#565b70', h: '#987044', a: '#56733c' },
  { ...BASE, s: '#dca16c', d: '#b87349', h: '#412d27', c: '#a3a6b0', l: '#d4d5d8', t: '#696d83', p: '#913c57', a: '#efb62c', g: '#ffe06b' },
  { ...BASE, c: '#528b36', l: '#8fbe54', t: '#30552b', h: '#715037', a: '#d6d8bd', b: '#704a38' },
];

const HEADS = [
  [
    '.....######.....',
    '....#ssssss#....',
    '...#ssssssss#...',
    '...#s##ss##s#...',
    '...##w####w##...',
    '...#s##ss##ss#..',
    '...#sssssdss#...',
    '....#hhsshh#....',
    '....#hhhhhh#....',
    '.....######.....',
  ],
  [
    '.....######.....',
    '....#gggaaa#....',
    '...#gaaaaaaa#...',
    '..#aaaaaaaaaa#..',
    '..############..',
    '...#ss#ss#ss#...',
    '...#ss#ss#sss#..',
    '...#hssssssh#...',
    '....#hhhhhh#....',
    '.....######.....',
  ],
  [
    '.....######.....',
    '....#hhhhhh#....',
    '...#hhhhhhhh#...',
    '...#hssssssh#...',
    '...##w####w##...',
    '...#s##ss##ss#..',
    '...#sssssdss#...',
    '....#ss##ss#....',
    '....#ssssss#....',
    '.....######.....',
  ],
];

const SHIRTS = [
  [
    '....##aa##......',
    '...#lctcctl#....',
    '..#cctcctcc#....',
    '.#tttttttttt#...',
    '.#cctcctcctc#...',
    '.#cctcctcctc#...',
    '.#stttttttts#...',
    '..##cccccc##....',
    '...########.....',
  ],
  [
    '....##tt##......',
    '...#lcttcll#....',
    '..#lcwcwcccl#...',
    '.#lccccccccl#...',
    '.#cccccccccc#...',
    '.#ccttttttcc#...',
    '.#sctcccctcs#...',
    '..##tttttt##....',
    '...########.....',
  ],
  [
    '....##tt##......',
    '...#lttattl#....',
    '..#lcctatccl#...',
    '.#lcccatcccl#...',
    '.#ccccatcccc#...',
    '.#cctcatctcc#...',
    '.#sctcatctcs#...',
    '..##ttattt##....',
    '...########.....',
  ],
];

const LEGS = [
  ['...#pp##pp#.....', '...#pp##pp#.....', '...#pp##pp#.....', '..#bbb##bbb#....', '..##########....'],
  ['...#pp##pp#.....', '..#pp#..#pp#....', '..#pp#...###....', '.#bbb#..........', '.#####..........'],
  ['...#pp##pp#.....', '..#pp#..#pp#....', '..###...#pp#....', '........#bbb#...', '........#####...'],
  ['..##pp##pp##....', '.#bpp#..#ppb#...', '.####....####...', '................', '................'],
];

// Draw runs instead of individual pixels to keep canvas work bounded.
export function drawPixels(ctx, rows, palette, x, y, size = 2) {
  rows.forEach((row, j) => {
    for (let i = 0; i < row.length;) {
      const color = row[i];
      let end = i + 1;
      while (row[end] === color) end++;
      if (palette[color]) {
        ctx.fillStyle = palette[color];
        ctx.fillRect(Math.round(x + i * size), Math.round(y + j * size), size * (end - i), size);
      }
      i = end;
    }
  });
}

export function drawHeroArt(ctx, idx, x, y, pose = 0, dying = false) {
  const palette = HERO_PALETTES[idx] || HERO_PALETTES[0];
  const head = HEADS[idx] || HEADS[0];
  drawPixels(ctx, LEGS[pose], palette, x, y + 38);
  drawPixels(ctx, SHIRTS[idx] || SHIRTS[0], palette, x, y + 20);
  drawPixels(ctx, head, palette, x, y);
  if (dying) {
    drawPixels(ctx, ['r.r..r.r', '.r....r.', 'r.r..r.r'], { r: '#e83b3b' }, x + 10, y + 8, 1);
  }
}

const ENEMY_HEADS = {
  metermaid: [
    '.....######.....', '....#ccwwcc#....', '...##########...',
    '....#ssssss#....', '....#w#ss#w#....', '....#sssssss#...',
    '.....#s##ss#....', '......#####.....',
  ],
  muscledude: [
    '.....######.....', '....#hhhhhh#....', '....##ssss##....',
    '....#s#ss#s#....', '....#sssssss#...', '....#swwwws#....',
    '.....#dddd#.....', '......####......',
  ],
  biker: [
    '.....######.....', '....#tlllltt#...', '...#tttttttt#...',
    '...#wwwwwwww#...', '...##r#ww#r##...', '....#ssssss#....',
    '....##s##s##....', '.....######.....',
  ],
};
const ENEMY_SHIRTS = {
  metermaid: ['....########....', '...#lcctccll#...', '..#ccwwtccccc#..', '..#ccwatccccc#..', '..#cccttcccss#..', '..#scttttcs##...', '...#########....'],
  muscledude: ['...##########...', '..#llccccclll#..', '.#s#cccccccc#s#.', '.#s#cccccccc#s#.', '.#ssccccccccss#.', '..##tttttttt##..', '...##########...'],
  biker: ['....########....', '...#lltwtlll#...', '..#ctrtwtrtcc#..', '..#ctttwtttcc#..', '..#ctttwtttss#..', '..#ssttwtts##...', '...#########....'],
};
const ENEMY_PALETTES = {
  metermaid: { ...BASE, c: '#398c45', l: '#83be54', t: '#245033', a: '#efbc32' },
  muscledude: { ...BASE, c: '#ce3c3d', l: '#f57651', t: '#872d46' },
  biker: { ...BASE, c: '#333449', l: '#737a96', t: '#454b67', r: '#f15b51' },
};
const CONE = [
  '......##......', '.....#oo#.....', '.....#ol#.....', '....#ollo#....',
  '....#ollo#....', '...#wwwwww#...', '...#wwwwww#...', '..#oolllllo#..',
  '..#oolllllo#..', '.#wwwwwwwwww#.', '.#oooooooooo#.', '##############',
  '#tttttttttttt#', '##############',
];
const RAT = [
  '.....###...........', '....#rrr#..........', '....#rsr#####......',
  '..###rrr#tttt#.....', '.#rrw#rrrrlltt#....', '#srr#rrrrllllt#....',
  '.###rrrllllllt#..##', '...#rrrrrrrrtt###s#', '....#########sss#..',
  '.....#ss#.#ss###...', '.....####.####.....',
];
const SKULL = ['..######..', '.#wwwwww#.', '#wwwwwwww#', '#w##ww##w#', '#w##ww##w#', '.#ww##ww#.', '..#wwww#..', '..#w#w##..', '...####...'];

export function drawEnemyArt(ctx, type, x, y, frame, dead = false) {
  if (dead) {
    drawPixels(ctx, SKULL, BASE, x + 2, y);
  } else if (type === 'cone') {
    drawPixels(ctx, CONE, { ...BASE, o: '#ed5424', l: '#ff9b36', t: '#59536b' }, x - 5, y - 2);
  } else if (type === 'rat') {
    const step = Math.floor(frame / 8) % 2;
    drawPixels(ctx, RAT, { ...BASE, r: '#8e839a', l: '#beb6c5', t: '#57495f' }, x - 4, y - 6 - step);
  } else if (ENEMY_HEADS[type]) {
    const palette = ENEMY_PALETTES[type];
    const pose = 1 + Math.floor(frame / 8) % 2;
    drawPixels(ctx, LEGS[pose], palette, x - 3, y + 28);
    drawPixels(ctx, ENEMY_SHIRTS[type], palette, x - 3, y + 14);
    drawPixels(ctx, ENEMY_HEADS[type], palette, x - 3, y - 2);
    if (type === 'metermaid') {
      drawPixels(ctx, ['#####', '#www#', '#wtw#', '#www#', '#wtw#', '#####'], palette, x + 22, y + 16);
    } else if (type === 'muscledude') {
      // A tiny pixel P and slash retain the no-parking shirt without font smoothing.
      drawPixels(ctx, ['www.r', 'w.wr.', 'wwr..', 'wr...', 'r....'], { w: PAPER, r: INK }, x + 8, y + 19, 1);
    }
  }
}

const SUIT_BODY = [
  '.....##########.....',
  '...##llcwwcclll##...',
  '..#lllcwwwwccllll#..',
  '.#lcccctwwtcccccll#.',
  '#lccccctrrtcccccccl#',
  '#ccc#cctrrtccc#cccc#',
  '#ccc#cctrrtccc#cccc#',
  '#ccc#cctrrtccc#cccc#',
  '#sss#cctrrtccc#ssss#',
  '.###ccctrrtcccc####.',
  '...#cccttttcccc#....',
  '...#ccccccccccc#....',
  '....###########.....',
  '....#pppp#pppp#.....',
  '....#pppp#pppp#.....',
  '....#pppp#pppp#.....',
  '....#ppp#.#ppp#.....',
  '...#bbbb#.#bbbb#....',
  '..#bbbbb#.#bbbbb#...',
  '..#######.#######...',
];
const BOSS_HEADS = {
  landlord: [
    '.......######.......', '.....##ssssss##.....', '....#hhsssssshh#....',
    '....#hssssssssh#....', '....#s##ss##sss#....', '....#sw#ssw#sss#....',
    '....#ssssddssss#....', '....#sshhsshhss#....', '.....#hhhhhhhh#.....',
    '.....#sswwwwss#.....', '......#ssssss#......', '.......######.......',
  ],
  recordexec: [
    '......########......', '.....#tllllltt#.....', '....#tttttttttt#....',
    '....#tsssssssst#....', '....############....', '....#wl##wwl##s#....',
    '....#ll##sll##s#....', '....#ssssddssss#....', '.....#ssssssss#.....',
    '.....#sswwww#s#.....', '......#ssssss#......', '.......######.......',
  ],
};
const RAT_KING = [
  '......#g...#g...#g......', '......#gg.#ggg.#gg......', '......#ggggggggggg#.....',
  '...##.#ggggggggggg#.##..', '...#ss##ttttttttt##ss#..', '......############......',
  '...##################...', '..#ssss#tttttttt#ssss#..', '..#srrss########ssrrs#..',
  '..#srsssttttttttssrs#...', '...##tttllllllllttt##...',
  '..ww#ttll##ll##lltt#ww..', '..ww#tlllw#llw#lllt#ww..', '....#tllllllllllllt#....',
  '...##tllsssrrsssllt##...', '..#ww#lssssssssssl#ww#..', '...##llss######ssll##...',
  '....#lll#wwwwww#lll#....', '.....###wwwwwwww###.....',
  '...###gg########gg###...', '..#tt#ggccccccccgg#tt#..', '.#tlt#gccllllllccg#tlt#.',
  '.#tlt#gccccllccccg#tlt#.', '.#tlt#gccccggccccg#tlt#.', '.#ttt#gcccggggcccg#ttt#.',
  '.#www#gccccggccccg#www#.', '..###cgccccccccccgc###..', '....#cggggggggggggc#....',
  '....################....', '.....#ttt#....#ttt#.....', '....#ssst#....#tsss#....',
  '....######....######....',
];

export function drawBossArt(ctx, type, x, y, angry, frame) {
  const palette = { ...BASE, c: type === 'landlord' ? '#656b9c' : '#c53e77', l: type === 'landlord' ? '#969bc4' : '#ee78a2', t: '#3b335e', r: '#ed4e43', g: '#f4c13e' };
  if (angry) { palette.c = '#e84e48'; palette.l = '#fff1d8'; }
  if (type === 'ratking') {
    drawPixels(ctx, ['##..........', '#s#.........', '.#s#.....###', '..#s#####ss#', '...#ssssss#.', '....######..'], palette, x - 24, y + 66, 3);
    drawPixels(ctx, RAT_KING, { ...palette, c: angry ? '#e84e48' : '#7442a5', l: '#b3a3c3', t: '#71617f', s: '#d6a0a5', r: '#e85163', b: '#508bdd' }, x - 5, y - 4, 3);
    return;
  }
  const bob = Math.floor(frame / 24) % 2;
  drawPixels(ctx, SUIT_BODY, palette, x, y + 22 - bob, 3);
  drawPixels(ctx, BOSS_HEADS[type] || BOSS_HEADS.landlord, palette, x, y - 14 - bob, 3);
  if (type === 'landlord') {
    // contract to sign — gold header, text lines, red X signature mark
    drawPixels(ctx, [
      '#########',
      '#ggggggg#',
      '#ttttttt#',
      '#ttttttt#',
      '#wwwwwww#',
      '#ttttttt#',
      '#wwwwwww#',
      '#rwwrwww#',
      '#ttttttt#',
      '#########',
    ], palette, x + 57, y + 36 - bob, 3);
  }
  if (type === 'recordexec') {
    // Creed "Human Clay" vinyl record held aloft — dark vinyl, pink-magenta label
    drawPixels(ctx, [
      '..######..',
      '.#tttttt#.',
      '#tt####tt#',
      '#t##ll##t#',
      '#t#lcll#t#',
      '#t##ll##t#',
      '#tt####tt#',
      '.#tttttt#.',
      '..######..',
    ], palette, x - 21, y + 12 - bob, 3);
  }
}
