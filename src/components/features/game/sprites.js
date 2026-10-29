// ─────────────────────────────────────────────
//  game/sprites.js  — Super Mario Bros 2 Theme
// ─────────────────────────────────────────────
import { PW, PH, GLD } from './constants.js';

// SMB2 NES palette
const RED    = '#CC2200';
const DK_RED = '#881100';
const GREEN  = '#007700';
const DK_GRN = '#004400';
const BLUE   = '#2266BB';
const SKIN   = '#FFD8A0';
const BROWN  = '#7A4520';
const GOLD   = '#FFD700';
const DKGLD  = '#AA8800';
const PINK   = '#FF6EB0';
const DK_PNK = '#BB3380';
const WHITE  = '#FFFEF0';
const BLACK  = '#1A1A1A';

// ── PLAYER ────────────────────────────────────
export function drawPlayer(ctx, pl, charIdx, frame) {
  if (!pl.dying && pl.inv > 0 && Math.floor(pl.inv / 5) % 2 === 0) return;
  const { x: px, y: py, face } = pl;
  ctx.save();

  if (pl.dying) {
    const cx = px + PW / 2, cy = py + PH / 2;
    ctx.translate(cx, cy);
    if (!pl.dyingLaunched) {
      const t = Math.min(1, (120 - pl.dyingTimer) / 40);
      ctx.scale(1 + t * 0.8, 1 + t * 0.8);
    } else {
      ctx.rotate(Math.max(0, 80 - pl.dyingTimer) * 0.18);
    }
    ctx.translate(-cx, -cy);
  } else {
    if (face === -1) { ctx.translate(px + PW, 0); ctx.scale(-1, 1); ctx.translate(-px, 0); }
  }

  const isMoving = Math.abs(pl.vx) > 0.1 && pl.og;
  const walkOsc  = isMoving ? Math.sin(frame * 0.28) : 0;
  const lL = Math.round(walkOsc * 3);
  const lR = -lL;

  if      (charIdx === 0) _mario(ctx, px, py, lL, lR);
  else if (charIdx === 1) _luigi(ctx, px, py, lL, lR);
  else                    _peach(ctx, px, py, lL, lR);

  if (pl.dying) {
    ctx.fillStyle = '#ff2020';
    [[px+6, py-6], [px+13, py-6]].forEach(([ex, ey]) => {
      ctx.fillRect(ex,   ey,   1, 1); ctx.fillRect(ex+2, ey,   1, 1);
      ctx.fillRect(ex+1, ey+1, 1, 1);
      ctx.fillRect(ex,   ey+2, 1, 1); ctx.fillRect(ex+2, ey+2, 1, 1);
    });
  }
  ctx.restore();
}

function _mario(ctx, px, py, lL, lR) {
  // brown shoes
  ctx.fillStyle = BROWN;
  ctx.fillRect(px-2, py+26+lL, 12, 4);
  ctx.fillRect(px+13, py+26+lR, 12, 4);
  // red overalls legs
  ctx.fillStyle = RED;
  ctx.fillRect(px+1, py+16+lL, 8, 11);
  ctx.fillRect(px+15, py+16+lR, 8, 11);
  // blue shirt body
  ctx.fillStyle = BLUE;
  ctx.fillRect(px-1, py+5, 26, 12);
  // red overalls bib
  ctx.fillStyle = RED;
  ctx.fillRect(px+6, py+5, 12, 9);
  ctx.fillStyle = DK_RED;
  ctx.fillRect(px+14, py+5, 4, 9);
  // yellow overall buttons
  ctx.fillStyle = GOLD;
  ctx.fillRect(px+7, py+13, 2, 2);
  ctx.fillRect(px+15, py+13, 2, 2);
  // blue arms
  ctx.fillStyle = BLUE;
  ctx.fillRect(px-5, py+5, 5, 11);
  ctx.fillRect(px+24, py+5, 5, 11);
  // skin hands
  ctx.fillStyle = SKIN;
  ctx.fillRect(px-5, py+14, 5, 4);
  ctx.fillRect(px+24, py+14, 5, 4);
  // head
  ctx.fillStyle = SKIN;
  ctx.fillRect(px+3, py-8, 18, 14);
  // red cap
  ctx.fillStyle = RED;
  ctx.fillRect(px+2, py-12, 20, 5);
  ctx.fillRect(px-1, py-8, 26, 2);
  ctx.fillStyle = DK_RED;
  ctx.fillRect(px-1, py-7, 26, 1);
  // brown hair/sideburns
  ctx.fillStyle = BROWN;
  ctx.fillRect(px+3, py-8, 5, 4);
  ctx.fillRect(px+16, py-8, 4, 4);
  // eyes
  ctx.fillStyle = '#000066';
  ctx.fillRect(px+6, py-4, 4, 3);
  ctx.fillRect(px+13, py-4, 4, 3);
  ctx.fillStyle = WHITE;
  ctx.fillRect(px+7, py-4, 2, 2);
  ctx.fillRect(px+14, py-4, 2, 2);
  // brown mustache
  ctx.fillStyle = BROWN;
  ctx.fillRect(px+5, py+2, 14, 3);
  ctx.fillRect(px+7, py, 10, 3);
}

function _luigi(ctx, px, py, lL, lR) {
  // brown shoes
  ctx.fillStyle = BROWN;
  ctx.fillRect(px-2, py+26+lL, 12, 4);
  ctx.fillRect(px+13, py+26+lR, 12, 4);
  // green overalls legs
  ctx.fillStyle = GREEN;
  ctx.fillRect(px+1, py+16+lL, 8, 11);
  ctx.fillRect(px+15, py+16+lR, 8, 11);
  // blue shirt body
  ctx.fillStyle = BLUE;
  ctx.fillRect(px-1, py+5, 26, 12);
  // green overalls bib
  ctx.fillStyle = GREEN;
  ctx.fillRect(px+6, py+5, 12, 9);
  ctx.fillStyle = DK_GRN;
  ctx.fillRect(px+14, py+5, 4, 9);
  // yellow overall buttons
  ctx.fillStyle = GOLD;
  ctx.fillRect(px+7, py+13, 2, 2);
  ctx.fillRect(px+15, py+13, 2, 2);
  // blue arms
  ctx.fillStyle = BLUE;
  ctx.fillRect(px-5, py+5, 5, 11);
  ctx.fillRect(px+24, py+5, 5, 11);
  // skin hands
  ctx.fillStyle = SKIN;
  ctx.fillRect(px-5, py+14, 5, 4);
  ctx.fillRect(px+24, py+14, 5, 4);
  // head
  ctx.fillStyle = SKIN;
  ctx.fillRect(px+3, py-8, 18, 14);
  // green cap
  ctx.fillStyle = GREEN;
  ctx.fillRect(px+2, py-12, 20, 5);
  ctx.fillRect(px-1, py-8, 26, 2);
  ctx.fillStyle = DK_GRN;
  ctx.fillRect(px-1, py-7, 26, 1);
  // brown hair/sideburns
  ctx.fillStyle = BROWN;
  ctx.fillRect(px+3, py-8, 5, 4);
  ctx.fillRect(px+16, py-8, 4, 4);
  // eyes
  ctx.fillStyle = '#000066';
  ctx.fillRect(px+6, py-4, 4, 3);
  ctx.fillRect(px+13, py-4, 4, 3);
  ctx.fillStyle = WHITE;
  ctx.fillRect(px+7, py-4, 2, 2);
  ctx.fillRect(px+14, py-4, 2, 2);
  // mustache
  ctx.fillStyle = BROWN;
  ctx.fillRect(px+5, py+2, 14, 3);
  ctx.fillRect(px+7, py, 10, 3);
}

function _peach(ctx, px, py, lL, lR) {
  // white shoes
  ctx.fillStyle = WHITE;
  ctx.fillRect(px-1, py+26+lL, 11, 4);
  ctx.fillRect(px+13, py+26+lR, 11, 4);
  // pink dress lower legs
  ctx.fillStyle = PINK;
  ctx.fillRect(px-2, py+16+lL, 12, 11);
  ctx.fillRect(px+13, py+16+lR, 12, 11);
  // pink dress body
  ctx.fillStyle = PINK;
  ctx.fillRect(px-2, py+5, 28, 12);
  ctx.fillStyle = DK_PNK;
  ctx.fillRect(px+20, py+5, 6, 12);
  // white collar
  ctx.fillStyle = WHITE;
  ctx.fillRect(px+5, py+5, 14, 6);
  // white glove arms
  ctx.fillStyle = WHITE;
  ctx.fillRect(px-5, py+5, 5, 12);
  ctx.fillRect(px+24, py+5, 5, 12);
  // skin hands
  ctx.fillStyle = SKIN;
  ctx.fillRect(px-5, py+15, 5, 4);
  ctx.fillRect(px+24, py+15, 5, 4);
  // head
  ctx.fillStyle = SKIN;
  ctx.fillRect(px+3, py-8, 18, 14);
  // blonde hair
  ctx.fillStyle = GOLD;
  ctx.fillRect(px+1, py-12, 22, 6);
  ctx.fillRect(px-1, py-6, 5, 10);
  ctx.fillRect(px+20, py-6, 5, 10);
  ctx.fillStyle = DKGLD;
  ctx.fillRect(px+1, py-12, 22, 2);
  // crown
  ctx.fillStyle = GOLD;
  ctx.fillRect(px+5, py-16, 14, 5);
  ctx.fillRect(px+6, py-20, 3, 5);
  ctx.fillRect(px+11, py-22, 3, 7);
  ctx.fillRect(px+16, py-20, 3, 5);
  ctx.fillStyle = DKGLD;
  ctx.fillRect(px+5, py-12, 14, 1);
  // crown gem
  ctx.fillStyle = '#FF0066';
  ctx.fillRect(px+12, py-17, 2, 2);
  ctx.fillStyle = WHITE;
  ctx.fillRect(px+12, py-17, 1, 1);
  // eyes
  ctx.fillStyle = '#000066';
  ctx.fillRect(px+7, py-4, 3, 4);
  ctx.fillRect(px+14, py-4, 3, 4);
  ctx.fillStyle = WHITE;
  ctx.fillRect(px+7, py-4, 1, 2);
  ctx.fillRect(px+14, py-4, 1, 2);
  // lips
  ctx.fillStyle = '#CC2266';
  ctx.fillRect(px+9, py+2, 6, 3);
  ctx.fillStyle = '#FF4488';
  ctx.fillRect(px+10, py+2, 4, 1);
}

// ── CHAR PREVIEW (scaled) ─────────────────────
export function drawCharPreview(ctx, idx, cx, cy, scale) {
  ctx.save();
  ctx.translate(cx - 12*scale, cy - 6*scale);
  ctx.scale(scale, scale);
  const px=0, py=0;
  if      (idx === 0) _mario(ctx, px, py, 0, 0);
  else if (idx === 1) _luigi(ctx, px, py, 0, 0);
  else                _peach(ctx, px, py, 0, 0);
  ctx.restore();
}

// ── ENEMIES ───────────────────────────────────
export function drawEnemy(ctx, o, scrollX, frame) {
  const ox = o.x - scrollX;
  const oy = o.y;
  if (ox > 900 || ox + o.w < -80) return;

  if (o.dead) {
    ctx.globalAlpha = Math.max(0, o.deadTimer / 30);
    ctx.font = '18px serif'; ctx.textAlign = 'center';
    ctx.fillText('💀', ox + o.w/2, oy + o.h - 2);
    ctx.globalAlpha = 1;
    return;
  }

  o.at = (o.at || 0) + 1;
  const walk = Math.sin(o.at * 0.2) * 3;
  const lL = Math.round(walk), lR = -lL;

  if      (o.type === 'cone')       _shyGuy(ctx, ox, oy, lL, lR);
  else if (o.type === 'metermaid')  _birdo(ctx, ox, oy, lL, lR);
  else if (o.type === 'muscledude') _mouser(ctx, ox, oy, lL, lR);
  else if (o.type === 'rat')        _bobOmb(ctx, ox, oy, o.at);
  else if (o.type === 'biker')      _trouter(ctx, ox, oy, o.at);
}

// Shy Guy — white oval mask, red robe, tan sandals
function _shyGuy(ctx, ox, oy, lL, lR) {
  // sandals
  ctx.fillStyle = '#C89050';
  ctx.fillRect(ox+1, oy+22+lL, 8, 4);
  ctx.fillRect(ox+11, oy+22+lR, 8, 4);
  // red robe legs
  ctx.fillStyle = RED;
  ctx.fillRect(ox+3, oy+12+lL, 7, 12);
  ctx.fillRect(ox+12, oy+12+lR, 7, 12);
  // red robe body
  ctx.fillStyle = RED;
  ctx.fillRect(ox-2, oy+5, 26, 10);
  ctx.fillStyle = DK_RED;
  ctx.fillRect(ox+18, oy+5, 6, 10);
  // brown belt
  ctx.fillStyle = BROWN;
  ctx.fillRect(ox-2, oy+14, 26, 3);
  ctx.fillStyle = GOLD;
  ctx.fillRect(ox+9, oy+14, 4, 3);
  // white oval mask
  ctx.fillStyle = WHITE;
  ctx.fillRect(ox+2, oy-4, 18, 18);
  ctx.fillStyle = '#E8E8E0';
  ctx.fillRect(ox+16, oy-4, 4, 18);
  // black eye holes (SMB2 style)
  ctx.fillStyle = BLACK;
  ctx.fillRect(ox+4, oy+1, 5, 7);
  ctx.fillRect(ox+13, oy+1, 5, 7);
  ctx.fillStyle = '#111144';
  ctx.fillRect(ox+5, oy+2, 3, 4);
  ctx.fillRect(ox+14, oy+2, 3, 4);
  // red hood above mask
  ctx.fillStyle = RED;
  ctx.fillRect(ox+1, oy-10, 20, 8);
  ctx.fillRect(ox+4, oy-14, 14, 6);
  ctx.fillStyle = DK_RED;
  ctx.fillRect(ox+16, oy-14, 4, 22);
  // chin shadow on mask
  ctx.fillStyle = '#D8D8D0';
  ctx.fillRect(ox+8, oy+11, 6, 4);
}

// Birdo — pink dinosaur-like creature, red bow, big snout
function _birdo(ctx, ox, oy, lL, lR) {
  // feet/stumps
  ctx.fillStyle = '#DD6688';
  ctx.fillRect(ox+1, oy+30+lL, 9, 5);
  ctx.fillRect(ox+13, oy+30+lR, 9, 5);
  ctx.fillStyle = '#FF88AA';
  ctx.fillRect(ox+3, oy+22+lL, 7, 10);
  ctx.fillRect(ox+13, oy+22+lR, 7, 10);
  // pink body
  ctx.fillStyle = '#FF88AA';
  ctx.fillRect(ox+0, oy+8, 24, 16);
  ctx.fillStyle = '#DD6688';
  ctx.fillRect(ox+16, oy+8, 8, 16);
  // neck
  ctx.fillStyle = '#FF88AA';
  ctx.fillRect(ox+7, oy+0, 12, 10);
  // head
  ctx.fillStyle = '#FF88AA';
  ctx.fillRect(ox+4, oy-8, 18, 12);
  // red bow on top
  ctx.fillStyle = '#CC0044';
  ctx.fillRect(ox+6, oy-16, 6, 8);
  ctx.fillRect(ox+14, oy-16, 6, 8);
  ctx.fillRect(ox+10, oy-14, 6, 6);
  ctx.fillStyle = '#FF0066';
  ctx.fillRect(ox+7, oy-15, 4, 5);
  ctx.fillRect(ox+15, oy-15, 4, 5);
  // big red round snout (signature Birdo feature)
  ctx.fillStyle = '#CC0044';
  ctx.fillRect(ox+5, oy, 14, 12);
  ctx.fillStyle = '#441122';
  ctx.fillRect(ox+8, oy+4, 8, 6);
  ctx.fillStyle = '#990033';
  ctx.fillRect(ox+6, oy+2, 3, 3);
  ctx.fillRect(ox+15, oy+2, 3, 3);
  // eyes
  ctx.fillStyle = WHITE;
  ctx.fillRect(ox+5, oy-6, 5, 6);
  ctx.fillRect(ox+14, oy-6, 5, 6);
  ctx.fillStyle = BLACK;
  ctx.fillRect(ox+6, oy-5, 3, 4);
  ctx.fillRect(ox+15, oy-5, 3, 4);
  ctx.fillStyle = WHITE;
  ctx.fillRect(ox+6, oy-5, 1, 1);
  ctx.fillRect(ox+15, oy-5, 1, 1);
  // eyelashes
  ctx.fillStyle = BLACK;
  ctx.fillRect(ox+5, oy-7, 2, 2);
  ctx.fillRect(ox+8, oy-8, 2, 2);
  ctx.fillRect(ox+14, oy-7, 2, 2);
  ctx.fillRect(ox+17, oy-8, 2, 2);
}

// Mouser — big gray mouse in red vest with blue sunglasses
function _mouser(ctx, ox, oy, lL, lR) {
  // feet
  ctx.fillStyle = '#555';
  ctx.fillRect(ox+2, oy+30+lL, 10, 5);
  ctx.fillRect(ox+14, oy+30+lR, 10, 5);
  // gray legs
  ctx.fillStyle = '#888';
  ctx.fillRect(ox+4, oy+20+lL, 8, 12);
  ctx.fillRect(ox+14, oy+20+lR, 8, 12);
  // red vest body
  ctx.fillStyle = '#CC2200';
  ctx.fillRect(ox+0, oy+8, 26, 14);
  ctx.fillStyle = '#AA1100';
  ctx.fillRect(ox+20, oy+8, 6, 14);
  // white shirt beneath vest
  ctx.fillStyle = WHITE;
  ctx.fillRect(ox+9, oy+9, 8, 12);
  // gray arms
  ctx.fillStyle = '#888';
  ctx.fillRect(ox-8, oy+8, 10, 14);
  ctx.fillRect(ox+24, oy+8, 10, 14);
  ctx.fillStyle = '#666';
  ctx.fillRect(ox-8, oy+20, 10, 6);
  ctx.fillRect(ox+24, oy+20, 10, 6);
  // gray head
  ctx.fillStyle = '#AAA';
  ctx.fillRect(ox+3, oy-6, 20, 16);
  ctx.fillStyle = '#888';
  ctx.fillRect(ox+18, oy-6, 5, 16);
  // big round ears
  ctx.fillStyle = '#888';
  ctx.fillRect(ox-1, oy-16, 10, 12);
  ctx.fillRect(ox+17, oy-16, 10, 12);
  ctx.fillStyle = '#CC8888';
  ctx.fillRect(ox+1, oy-13, 6, 8);
  ctx.fillRect(ox+19, oy-13, 6, 8);
  ctx.fillStyle = '#FFAAAA';
  ctx.fillRect(ox+2, oy-11, 3, 5);
  ctx.fillRect(ox+21, oy-11, 3, 5);
  // blue tinted sunglasses
  ctx.fillStyle = BLACK;
  ctx.fillRect(ox+4, oy-2, 8, 6);
  ctx.fillRect(ox+14, oy-2, 8, 6);
  ctx.fillRect(ox+12, oy, 3, 4);
  ctx.fillStyle = '#003388';
  ctx.fillRect(ox+5, oy-1, 6, 4);
  ctx.fillRect(ox+15, oy-1, 6, 4);
  // nose/snout
  ctx.fillStyle = '#CC9999';
  ctx.fillRect(ox+10, oy+6, 6, 5);
  // whiskers
  ctx.fillStyle = '#CCCCCC';
  ctx.fillRect(ox-2, oy+4, 5, 2); ctx.fillRect(ox-2, oy+7, 5, 2);
  ctx.fillRect(ox+23, oy+4, 5, 2); ctx.fillRect(ox+23, oy+7, 5, 2);
}

// Bob-omb — round black wind-up bomb
function _bobOmb(ctx, ox, oy, at) {
  const bob = Math.sin(at * 0.18) * 2;
  // fuse + spark
  ctx.strokeStyle = '#FF8800'; ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(ox+12, oy+2+bob);
  ctx.quadraticCurveTo(ox+18, oy-6+bob, ox+14, oy-12+bob);
  ctx.stroke();
  ctx.fillStyle = '#FFFF00';
  ctx.fillRect(ox+13, oy-13+bob, 3, 3);
  ctx.fillStyle = '#FF4400';
  ctx.fillRect(ox+12, oy-14+bob, 5, 3);
  // black round body
  ctx.fillStyle = '#1A1A1A';
  ctx.fillRect(ox+2, oy+3, 18, 18);
  ctx.fillRect(ox+0, oy+7, 22, 10);
  ctx.fillRect(ox+4, oy+1, 14, 3);
  ctx.fillRect(ox+4, oy+20, 14, 3);
  // body highlight
  ctx.fillStyle = '#333';
  ctx.fillRect(ox+3, oy+4, 8, 7);
  // wide white eyes
  ctx.fillStyle = WHITE;
  ctx.fillRect(ox+3, oy+8, 7, 7);
  ctx.fillRect(ox+12, oy+8, 7, 7);
  ctx.fillStyle = BLACK;
  ctx.fillRect(ox+5, oy+10, 3, 3);
  ctx.fillRect(ox+14, oy+10, 3, 3);
  ctx.fillStyle = WHITE;
  ctx.fillRect(ox+5, oy+10, 1, 1);
  ctx.fillRect(ox+14, oy+10, 1, 1);
  // gold wind-up key on side
  ctx.fillStyle = GOLD;
  ctx.fillRect(ox-4, oy+9, 4, 7);
  ctx.fillRect(ox-8, oy+8, 5, 2);
  ctx.fillRect(ox-8, oy+14, 5, 2);
  // feet
  ctx.fillStyle = '#333';
  ctx.fillRect(ox+3, oy+21, 6, 5);
  ctx.fillRect(ox+13, oy+21, 6, 5);
}

// Trouter — orange jumping fish
function _trouter(ctx, ox, oy, at) {
  const hop = Math.abs(Math.sin(at * 0.12)) * 3;
  // tail fin
  ctx.fillStyle = '#FF6600';
  ctx.fillRect(ox-6, oy+4-hop, 8, 14);
  ctx.fillStyle = '#FF4400';
  ctx.fillRect(ox-10, oy+1-hop, 6, 4);
  ctx.fillRect(ox-10, oy+13-hop, 6, 4);
  // orange body
  ctx.fillStyle = '#FF8C00';
  ctx.fillRect(ox+2, oy+2-hop, 18, 14);
  // lighter belly
  ctx.fillStyle = '#FFAA44';
  ctx.fillRect(ox+4, oy+8-hop, 14, 7);
  // dorsal fin
  ctx.fillStyle = '#FF6600';
  ctx.fillRect(ox+6, oy-5-hop, 8, 8);
  ctx.fillRect(ox+8, oy-8-hop, 4, 4);
  // pectoral fin
  ctx.fillStyle = '#FF6600';
  ctx.fillRect(ox+8, oy+14-hop, 6, 5);
  // eye
  ctx.fillStyle = WHITE;
  ctx.fillRect(ox+14, oy+3-hop, 5, 5);
  ctx.fillStyle = BLACK;
  ctx.fillRect(ox+15, oy+4-hop, 3, 3);
  ctx.fillStyle = WHITE;
  ctx.fillRect(ox+15, oy+4-hop, 1, 1);
  // mouth
  ctx.fillStyle = '#CC4400';
  ctx.fillRect(ox+18, oy+9-hop, 4, 4);
  ctx.fillStyle = WHITE;
  ctx.fillRect(ox+18, oy+9-hop, 4, 1);
  // scale details
  ctx.fillStyle = '#FF6600';
  ctx.fillRect(ox+5, oy+4-hop, 3, 3);
  ctx.fillRect(ox+10, oy+3-hop, 3, 3);
}

// ── TURNIP (replaces pizza) ────────────────────
export function drawPizza(ctx, pz, scrollX, frame) {
  if (pz.collected) return;
  const ox = pz.x - scrollX;
  const oy = pz.y + Math.sin(frame * 0.08 + pz.bob) * 5;
  if (ox > 900 || ox < -60) return;

  // green leaves on top
  ctx.fillStyle = '#228B22';
  ctx.fillRect(ox+10, oy-4, 4, 8);
  ctx.fillRect(ox+6, oy-9, 4, 6);
  ctx.fillRect(ox+14, oy-7, 4, 5);
  ctx.fillStyle = '#00AA00';
  ctx.fillRect(ox+4, oy-11, 3, 4);
  ctx.fillRect(ox+17, oy-9, 3, 4);
  // white turnip body
  ctx.fillStyle = '#F5F5DC';
  ctx.fillRect(ox+2, oy+2, 20, 18);
  ctx.fillRect(ox+0, oy+6, 24, 10);
  ctx.fillRect(ox+4, oy+0, 16, 4);
  ctx.fillRect(ox+4, oy+20, 16, 4);
  // pink/purple stripes (SMB2 turnip look)
  ctx.fillStyle = '#CC88BB';
  ctx.fillRect(ox+2, oy+4, 4, 12);
  ctx.fillRect(ox+7, oy+2, 3, 18);
  ctx.fillRect(ox+12, oy+2, 3, 18);
  ctx.fillRect(ox+18, oy+4, 4, 12);
  // highlight
  ctx.fillStyle = WHITE;
  ctx.fillRect(ox+5, oy+3, 4, 4);
  // glow
  ctx.shadowBlur = 8; ctx.shadowColor = '#88FF88';
  ctx.strokeStyle = 'rgba(0,200,100,0.4)'; ctx.lineWidth = 2;
  ctx.strokeRect(ox+1, oy+1, 22, 22);
  ctx.shadowBlur = 0;
  // label
  ctx.fillStyle = GLD; ctx.font = '10px "Press Start 2P"'; ctx.textAlign = 'center';
  ctx.fillText('+100', ox+12, oy-13);
}

// ── CHERRY (replaces heart) ────────────────────
export function drawHeart(ctx, h, scrollX, frame) {
  if (h.collected) return;
  const ox = h.x - scrollX;
  const oy = h.y + Math.sin(frame * 0.1 + h.bob) * 4;
  if (ox > 900 || ox < -40) return;

  // stems (pixel style)
  ctx.strokeStyle = '#228B22'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(ox+5, oy+4); ctx.lineTo(ox+10, oy-4); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(ox+15, oy+4); ctx.lineTo(ox+10, oy-4); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(ox+10, oy-4); ctx.lineTo(ox+10, oy-8); ctx.stroke();

  // two round cherries (pixel art squares)
  ctx.shadowBlur = 6; ctx.shadowColor = '#FF0000';
  ctx.fillStyle = '#CC0000';
  ctx.fillRect(ox+0, oy+2, 12, 12);
  ctx.fillRect(ox+2, oy+0, 8, 4);
  ctx.fillRect(ox+2, oy+14, 8, 2);
  ctx.fillRect(ox+12, oy+2, 12, 12);
  ctx.fillRect(ox+14, oy+0, 8, 4);
  ctx.fillRect(ox+14, oy+14, 8, 2);
  // highlights
  ctx.fillStyle = '#FF4444';
  ctx.fillRect(ox+1, oy+3, 4, 4);
  ctx.fillRect(ox+13, oy+3, 4, 4);
  ctx.fillStyle = WHITE;
  ctx.fillRect(ox+2, oy+3, 2, 2);
  ctx.fillRect(ox+14, oy+3, 2, 2);
  ctx.shadowBlur = 0;

  ctx.fillStyle = '#ffaaaa'; ctx.font = '7px "Press Start 2P"'; ctx.textAlign = 'center';
  ctx.fillText('+HP', ox+12, oy-10);
}

// ── BOSSES ─────────────────────────────────────
export function drawBoss(ctx, boss, scrollX, frame) {
  if (!boss || boss.dead) return;
  const ox = boss.x - scrollX;
  const oy = boss.y;
  if (ox > 920 || ox + boss.w < -100) return;

  const bob = Math.sin(frame * 0.05) * 4;
  const angry = boss.hitFlash > 0;

  if      (boss.type === 'landlord')   _wart(ctx, ox, oy + bob, angry);
  else if (boss.type === 'ratking')    _triclyde(ctx, ox, oy + bob, angry);
  else if (boss.type === 'recordexec') _clawgrip(ctx, ox, oy + bob, angry);

  // HP bar
  const barW = boss.w + 20;
  const barX = ox - 10;
  const barY = oy - 28;
  const pct = boss.hp / boss.maxHp;
  ctx.fillStyle = 'rgba(0,0,0,0.75)'; ctx.fillRect(barX-2, barY-2, barW+4, 14);
  ctx.fillStyle = pct > 0.5 ? '#2ecc71' : pct > 0.25 ? '#f39c12' : '#e74c3c';
  ctx.fillRect(barX, barY, Math.max(0, barW*pct), 10);
  ctx.strokeStyle = GLD; ctx.lineWidth = 2; ctx.strokeRect(barX-2, barY-2, barW+4, 14);
  ctx.fillStyle = GLD; ctx.font = '8px "Press Start 2P"'; ctx.textAlign = 'center';
  ctx.fillText(boss.label, ox + boss.w/2, barY - 8);
}

// Wart — the frog king (SMB2 final boss)
function _wart(ctx, ox, oy, angry) {
  const bx = ox, by = oy;
  const bodyCol = angry ? '#55DD55' : '#44BB44';
  const darkCol = angry ? '#33AA33' : '#228B22';
  const midCol  = angry ? '#66EE66' : '#55CC55';

  // feet / flippers
  ctx.fillStyle = darkCol;
  ctx.fillRect(bx+0, by+72, 24, 8);   ctx.fillRect(bx+36, by+72, 24, 8);
  ctx.fillRect(bx-6, by+74, 14, 6);   ctx.fillRect(bx+52, by+74, 14, 6);
  // legs
  ctx.fillStyle = bodyCol;
  ctx.fillRect(bx+6, by+52, 16, 22);  ctx.fillRect(bx+38, by+52, 16, 22);
  ctx.fillStyle = darkCol;
  ctx.fillRect(bx+6, by+64, 16, 8);   ctx.fillRect(bx+38, by+64, 16, 8);
  // body
  ctx.fillStyle = bodyCol;
  ctx.fillRect(bx+0, by+16, 60, 38);
  ctx.fillStyle = midCol;
  ctx.fillRect(bx+4, by+16, 52, 18);
  // light belly
  ctx.fillStyle = '#AAEEBB';
  ctx.fillRect(bx+8, by+26, 44, 26);
  ctx.fillStyle = '#88CC99';
  ctx.fillRect(bx+12, by+28, 8, 8);   ctx.fillRect(bx+28, by+32, 10, 8);   ctx.fillRect(bx+42, by+28, 8, 8);
  // arms
  ctx.fillStyle = bodyCol;
  ctx.fillRect(bx-12, by+18, 14, 20); ctx.fillRect(bx+58, by+18, 14, 20);
  ctx.fillStyle = darkCol;
  ctx.fillRect(bx-12, by+36, 14, 8);  ctx.fillRect(bx+58, by+36, 14, 8);
  // hands / claws
  ctx.fillStyle = darkCol;
  ctx.fillRect(bx-14, by+42, 8, 4);   ctx.fillRect(bx-12, by+46, 6, 4);   ctx.fillRect(bx-10, by+50, 4, 4);
  ctx.fillRect(bx+66, by+42, 8, 4);   ctx.fillRect(bx+66, by+46, 6, 4);   ctx.fillRect(bx+66, by+50, 4, 4);
  // head
  ctx.fillStyle = bodyCol;
  ctx.fillRect(bx+8, by-14, 44, 32);
  ctx.fillStyle = midCol;
  ctx.fillRect(bx+10, by-14, 40, 14);
  // cheek bulges
  ctx.fillStyle = bodyCol;
  ctx.fillRect(bx+2, by-2, 14, 16);   ctx.fillRect(bx+44, by-2, 14, 16);
  // bulging eye sockets on top of head
  ctx.fillStyle = bodyCol;
  ctx.fillRect(bx+10, by-22, 14, 14); ctx.fillRect(bx+36, by-22, 14, 14);
  ctx.fillStyle = angry ? '#FF0000' : WHITE;
  ctx.fillRect(bx+12, by-20, 10, 10); ctx.fillRect(bx+38, by-20, 10, 10);
  ctx.fillStyle = BLACK;
  ctx.fillRect(bx+15, by-18, 6, 6);   ctx.fillRect(bx+41, by-18, 6, 6);
  if (angry) { ctx.shadowBlur = 12; ctx.shadowColor = '#FF0000'; }
  ctx.fillStyle = angry ? '#FF4444' : '#3333AA';
  ctx.fillRect(bx+16, by-17, 4, 4);   ctx.fillRect(bx+42, by-17, 4, 4);
  ctx.shadowBlur = 0;
  // nostril slits
  ctx.fillStyle = darkCol;
  ctx.fillRect(bx+18, by+2, 4, 3);    ctx.fillRect(bx+38, by+2, 4, 3);
  // wide frog mouth
  ctx.fillStyle = BLACK;
  ctx.fillRect(bx+10, by+10, 40, 12);
  ctx.fillStyle = '#CC2200';
  ctx.fillRect(bx+12, by+12, 36, 8);
  // teeth
  ctx.fillStyle = WHITE;
  [bx+12, bx+18, bx+24, bx+30, bx+36, bx+42].forEach(tx => {
    ctx.fillRect(tx, by+12, 5, 6);
    ctx.fillRect(tx+1, by+16, 3, 4);
  });
  // angry brows
  if (angry) {
    ctx.fillStyle = '#004400';
    ctx.fillRect(bx+8,  by-16, 18, 5);
    ctx.fillRect(bx+34, by-16, 18, 5);
  }
  // crown
  ctx.fillStyle = GOLD;
  ctx.fillRect(bx+16, by-32, 28, 12);
  ctx.fillRect(bx+17, by-42, 7, 12);
  ctx.fillRect(bx+25, by-46, 7, 16);
  ctx.fillRect(bx+33, by-42, 7, 12);
  ctx.fillStyle = DKGLD;
  ctx.fillRect(bx+16, by-21, 28, 2);
  // crown gems
  ctx.fillStyle = '#FF0000'; ctx.fillRect(bx+19, by-28, 5, 5);
  ctx.fillStyle = '#0000FF'; ctx.fillRect(bx+29, by-28, 5, 5);
  ctx.fillStyle = '#00FF00'; ctx.fillRect(bx+37, by-28, 5, 5);
  ctx.fillStyle = WHITE;
  ctx.fillRect(bx+19, by-28, 2, 2); ctx.fillRect(bx+29, by-28, 2, 2); ctx.fillRect(bx+37, by-28, 2, 2);
}

// Triclyde — three-headed snake boss
function _triclyde(ctx, ox, oy, angry) {
  const bx = ox, by = oy;
  const sc   = angry ? '#FF6644' : '#44AA22';
  const scDk = angry ? '#CC4422' : '#228800';

  // body coils
  ctx.fillStyle = sc;
  ctx.fillRect(bx+8,  by+60, 46, 18);
  ctx.fillRect(bx+0,  by+48, 20, 18);
  ctx.fillRect(bx+42, by+48, 20, 18);
  ctx.fillStyle = scDk;
  ctx.fillRect(bx+10, by+64, 42, 8);
  ctx.fillRect(bx+2,  by+52, 16, 8);
  ctx.fillRect(bx+44, by+52, 16, 8);
  // belly stripes
  ctx.fillStyle = '#AAEEBB';
  ctx.fillRect(bx+20, by+60, 22, 18);
  ctx.fillRect(bx+4,  by+48, 8, 14);
  ctx.fillRect(bx+50, by+48, 8, 14);
  // tail tip
  ctx.fillStyle = sc;
  ctx.fillRect(bx+24, by+72, 14, 8);
  ctx.fillRect(bx+28, by+78, 6, 8);

  // three necks
  ctx.fillStyle = sc;
  ctx.fillRect(bx+2,  by+20, 14, 30);
  ctx.fillRect(bx+24, by+8,  14, 42);
  ctx.fillRect(bx+46, by+20, 14, 30);
  ctx.fillStyle = scDk;
  ctx.fillRect(bx+2,  by+42, 14, 8);
  ctx.fillRect(bx+24, by+38, 14, 12);
  ctx.fillRect(bx+46, by+42, 14, 8);

  const drawHead = (hx, hy, big) => {
    const hw = big ? 22 : 18, hh = big ? 20 : 16;
    ctx.fillStyle = sc;
    ctx.fillRect(hx - hw/2, hy, hw, hh);
    ctx.fillStyle = scDk;
    ctx.fillRect(hx - hw/2 + 2, hy + hh - 4, hw - 4, 4);
    // eyes
    ctx.fillStyle = angry ? '#FF0000' : '#FFFF00';
    ctx.fillRect(hx - hw/2 + 3, hy + 3, 4, 4);
    ctx.fillRect(hx + hw/2 - 7, hy + 3, 4, 4);
    if (angry) { ctx.shadowBlur = 8; ctx.shadowColor = '#FF0000'; }
    ctx.fillStyle = BLACK;
    ctx.fillRect(hx - hw/2 + 4, hy + 4, 2, 2);
    ctx.fillRect(hx + hw/2 - 6, hy + 4, 2, 2);
    ctx.shadowBlur = 0;
    // forked tongue
    ctx.fillStyle = '#FF4466';
    ctx.fillRect(hx - 2, hy + hh, 4, 6);
    ctx.fillRect(hx - 4, hy + hh + 4, 4, 3);
    ctx.fillRect(hx + 1, hy + hh + 4, 4, 3);
    // mouth slit
    ctx.fillStyle = '#881100';
    ctx.fillRect(hx - hw/2 + 2, hy + hh - 6, hw - 4, 3);
  };

  drawHead(bx+9,  by+4,  false);
  drawHead(bx+31, by-8,  true);
  drawHead(bx+53, by+4,  false);
}

// Clawgrip — giant orange crab boss
function _clawgrip(ctx, ox, oy, angry) {
  const bx = ox, by = oy;
  const shell   = angry ? '#FF8800' : '#CC6600';
  const shellLt = angry ? '#FFAA44' : '#EE8822';
  const claw    = angry ? '#DD6600' : '#AA4400';

  // left big claw
  ctx.fillStyle = claw;
  ctx.fillRect(bx-22, by+30, 22, 14);
  ctx.fillRect(bx-32, by+26, 16, 10);
  ctx.fillRect(bx-32, by+40, 16, 10);
  ctx.fillStyle = shellLt;
  ctx.fillRect(bx-30, by+28, 10, 6);
  ctx.fillRect(bx-30, by+42, 10, 6);
  // right big claw
  ctx.fillStyle = claw;
  ctx.fillRect(bx+60, by+30, 22, 14);
  ctx.fillRect(bx+76, by+26, 16, 10);
  ctx.fillRect(bx+76, by+40, 16, 10);
  ctx.fillStyle = shellLt;
  ctx.fillRect(bx+78, by+28, 10, 6);
  ctx.fillRect(bx+78, by+42, 10, 6);
  // walking legs
  ctx.fillStyle = claw;
  [-18,-8,2].forEach(dx => {
    ctx.fillRect(bx+dx, by+54, 8, 26);
    ctx.fillRect(bx+dx-2, by+76, 10, 4);
    ctx.fillRect(bx+70-dx*0.5|0, by+54, 8, 26);
    ctx.fillRect(bx+68-dx*0.5|0, by+76, 10, 4);
  });
  // shell body
  ctx.fillStyle = shell;
  ctx.fillRect(bx+0, by+10, 60, 48);
  ctx.fillStyle = shellLt;
  ctx.fillRect(bx+4, by+10, 52, 22);
  ctx.fillStyle = claw;
  [by+24, by+36, by+48].forEach(sy => ctx.fillRect(bx+2, sy, 56, 3));
  ctx.fillStyle = shellLt;
  [bx+8, bx+22, bx+36, bx+50].forEach(sx => ctx.fillRect(sx, by+13, 8, 8));
  // head
  ctx.fillStyle = shellLt;
  ctx.fillRect(bx+12, by-10, 36, 22);
  ctx.fillStyle = shell;
  ctx.fillRect(bx+14, by-10, 32, 8);
  // eye stalks
  ctx.fillStyle = claw;
  ctx.fillRect(bx+14, by-26, 8, 18);
  ctx.fillRect(bx+38, by-26, 8, 18);
  // eyes
  ctx.fillStyle = angry ? '#FF0000' : WHITE;
  ctx.fillRect(bx+12, by-30, 12, 12);
  ctx.fillRect(bx+36, by-30, 12, 12);
  if (angry) { ctx.shadowBlur = 10; ctx.shadowColor = '#FF0000'; }
  ctx.fillStyle = BLACK;
  ctx.fillRect(bx+14, by-28, 7, 7);
  ctx.fillRect(bx+38, by-28, 7, 7);
  ctx.shadowBlur = 0;
  ctx.fillStyle = WHITE;
  ctx.fillRect(bx+14, by-28, 2, 2);
  ctx.fillRect(bx+38, by-28, 2, 2);
  // mandibles
  ctx.fillStyle = claw;
  ctx.fillRect(bx+16, by+6, 28, 8);
  ctx.fillStyle = BLACK;
  ctx.fillRect(bx+18, by+8, 24, 4);
  // angry brows
  if (angry) {
    ctx.fillStyle = '#882200';
    ctx.fillRect(bx+12, by-16, 14, 6);
    ctx.fillRect(bx+34, by-16, 14, 6);
  }
}
