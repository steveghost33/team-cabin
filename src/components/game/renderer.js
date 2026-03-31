// ─────────────────────────────────────────────
//  game/renderer.js
//  Pure canvas drawing — no React, no state.
//  Called each frame by PizzaGame.jsx
// ─────────────────────────────────────────────
import { W, H, GROUND, PW, PH, GLD, GRN, GRN2, CREAM } from './constants.js';
import { LEVELS } from './constants.js';
import { drawPlayer, drawEnemy, drawPizza, drawHeart, drawBoss, drawCharPreview } from './sprites.js';

export function renderFrame(ctx, engine, frame) {
  const gs = engine.gState;

  if (gs === 'title')      { drawTitle(ctx, frame, engine.highSc, engine.initials.join('')); return; }
  if (gs === 'initials')   { drawInitials(ctx, frame, engine); return; }
  if (gs === 'levelintro') { drawLevelIntro(ctx, frame, engine.lvl, engine.introTimer); return; }
  if (gs === 'charselect') { drawCharSelect(ctx, frame, engine.selChar); return; }
  if (gs === 'gameover')  { drawGameOver(ctx, frame, engine.sc, engine.highSc); return; }
  if (gs === 'win')       { drawWin(ctx, frame, engine.sc, engine.highSc, engine.initials.join('')); return; }
  if (gs === 'levelup')   { drawLevelUp(ctx, frame, engine.lvlIdx, engine.lvl); return; }

  const lvl = engine.lvl;
  const scrollX = engine.scrollX;

  // ── SKY ──────────────────────────────────────
  drawSky(ctx, lvl, frame, scrollX);

  // ── YPSILANTI WATER TOWER (far background) ───
  if (engine.lvlIdx === 0) drawWaterTower(ctx, scrollX);

  // ── BUILDINGS ────────────────────────────────
  engine.blds.forEach(b => drawBuilding(ctx, b, scrollX, lvl, frame));

  // ── GROUND ───────────────────────────────────
  drawGround(ctx, lvl, scrollX);

  // ── PICKUPS ──────────────────────────────────
  engine.hearts.forEach(h => drawHeart(ctx, h, scrollX, frame));
  engine.pizzas.forEach(pz => drawPizza(ctx, pz, scrollX, frame));

  // ── ENEMIES ──────────────────────────────────
  engine.obs.forEach(o => drawEnemy(ctx, o, scrollX, frame));

  // ── BOSS ─────────────────────────────────────
  if (engine.boss) drawBoss(ctx, engine.boss, scrollX, frame);

  // ── GROVE STUDIOS (level 1 boss defeated) ───
  if (engine.lvlIdx === 0 && engine.boss && engine.boss.dead) {
    drawGroveStudios(ctx);
  }

  // ── PARTICLES ────────────────────────────────
  engine.parts.forEach(p => {
    ctx.globalAlpha = p.life / p.ml;
    ctx.fillStyle = p.col;
    ctx.fillRect(p.x - p.sz/2, p.y - p.sz/2, p.sz, p.sz);
  });
  ctx.globalAlpha = 1;

  // ── PLAYER ───────────────────────────────────
  drawPlayer(ctx, engine.pl, engine.charIdx, frame);

  // ── HUD ──────────────────────────────────────
  drawHUD(ctx, engine, lvl);
}

// ── SKY ────────────────────────────────────────
function drawSky(ctx, lvl, frame, scrollX) {
  const sg = ctx.createLinearGradient(0, 0, 0, GROUND);
  sg.addColorStop(0, lvl.skyTop);
  sg.addColorStop(1, lvl.skyBot);
  ctx.fillStyle = sg;
  ctx.fillRect(0, 0, W, GROUND);

  if (lvl.hasSun) {
    ctx.fillStyle = '#FFD700';
    ctx.shadowBlur = 20; ctx.shadowColor = 'rgba(255,215,0,0.5)';
    ctx.beginPath(); ctx.arc(W-90, 50, 24, 0, Math.PI*2); ctx.fill();
    ctx.shadowBlur = 0;
    // clouds
    ctx.fillStyle = 'rgba(255,255,255,0.9)';
    [[80,55,30],[240,40,24],[440,62,28],[620,48,22]].forEach(([cx,cy,r]) => {
      const bx = ((cx - scrollX*0.04 + W*4) % (W+200)) - 100;
      ctx.beginPath(); ctx.arc(bx, cy, r, 0, Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.arc(bx+r*0.7, cy+5, r*0.6, 0, Math.PI*2); ctx.fill();
    });
  }

  if (lvl.hasStars) {
    for (let i = 0; i < 35; i++) {
      const sx = ((i*137 + scrollX*0.07) % (W+40) + W+40) % (W+40);
      const sy = (i*73) % (GROUND*0.5);
      ctx.fillStyle = Math.sin(frame*0.03+i) > 0.4
        ? (lvl.windowColor2 || '#ffe066')
        : 'rgba(200,210,230,0.3)';
      ctx.fillRect(sx, sy, 2, 2);
    }
  }

  if (lvl.hasMoon) {
    ctx.fillStyle = '#fffde7';
    ctx.beginPath(); ctx.arc(W-65, 48, 20, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = lvl.skyTop;
    ctx.beginPath(); ctx.arc(W-57, 42, 17, 0, Math.PI*2); ctx.fill();
  }

  if (lvl.hasNeon) {
    // Ferndale neon glow at horizon
    const glow = ctx.createLinearGradient(0, GROUND-60, 0, GROUND);
    glow.addColorStop(0, 'rgba(255,60,180,0)');
    glow.addColorStop(1, 'rgba(255,60,180,0.22)');
    ctx.fillStyle = glow; ctx.fillRect(0, GROUND-60, W, 60);
  }

  // far bg silhouette buildings
  ctx.fillStyle = lvl.hasSun ? 'rgba(80,50,20,0.18)' : 'rgba(4,8,6,0.7)';
  for (let i = 0; i < 10; i++) {
    const bx = ((i*105 - scrollX*0.1) % (W+200) + W+200) % (W+200) - 100;
    ctx.fillRect(bx, GROUND-45-(i%4)*22, 40+(i%3)*14, 45+(i%4)*22);
  }
}

// ── GROUND ─────────────────────────────────────
function drawGround(ctx, lvl, scrollX) {
  ctx.fillStyle = lvl.groundTop;
  ctx.fillRect(0, GROUND, W, 5);
  ctx.fillStyle = lvl.groundColor;
  ctx.fillRect(0, GROUND+5, W, H-GROUND-5);
  ctx.fillStyle = lvl.groundColor;
  ctx.fillRect(0, GROUND+6, W, H-GROUND-6);

  // lane dashes
  ctx.fillStyle = lvl.laneColor;
  const lY = GROUND + (H-GROUND)/2 - 2;
  for (let i = 0; i < W; i += 56) {
    const dx = ((i - scrollX*0.5) % 56 + 56) % 56;
    ctx.fillRect(dx, lY, 36, 3);
  }
}

// ── BUILDINGS ──────────────────────────────────
function drawBuilding(ctx, b, scrollX, lvl, frame) {
  const bx = b.x - scrollX;
  if (bx > W+200 || bx+b.w < -200) return;
  ctx.fillStyle = b.color;
  ctx.fillRect(bx, GROUND-b.h, b.w, b.h);
  ctx.strokeStyle = 'rgba(0,0,0,0.4)'; ctx.lineWidth = 1;
  ctx.strokeRect(bx, GROUND-b.h, b.w, b.h);
  const wc = lvl.windowColor;
  const wc2 = lvl.windowColor2;
  for (let r = 0; r < b.wr; r++) {
    for (let c = 0; c < b.wc; c++) {
      const wx = bx+8+c*17, wy = GROUND-b.h+10+r*19;
      if (wx+10 < bx+b.w-4) {
        const lit = Math.sin(frame*0.013+r*1.8+c*0.9+b.x*0.01) > 0;
        const useAlt = wc2 && (r+c)%3===0;
        ctx.fillStyle = lit ? (useAlt ? wc2 : wc) : (lvl.hasSun ? '#e8d8b0' : '#091505');
        if (lit) { ctx.shadowBlur=4; ctx.shadowColor = useAlt ? wc2 : wc; }
        ctx.fillRect(wx, wy, 10, 10);
        ctx.shadowBlur=0;
      }
    }
  }
  ctx.fillStyle = 'rgba(80,80,80,0.6)';
  ctx.fillRect(bx+b.w/2-3, GROUND-b.h-12, 6, 12);
}

// ── HUD ────────────────────────────────────────
function drawHUD(ctx, engine, lvl) {
  const { sc, lives, pc, pl } = engine;
  const MAX_HP_local = 100;

  // top bar
  ctx.fillStyle = 'rgba(0,0,0,0.78)';
  ctx.fillRect(0, 0, W, 52);

  // score
  ctx.fillStyle = GLD; ctx.font = '11px "Press Start 2P"'; ctx.textAlign = 'left';
  ctx.fillText('SCORE:' + sc, 10, 18);
  if (engine.highSc > 0) {
    ctx.fillStyle = 'rgba(226,168,32,0.55)'; ctx.font = '8px "Press Start 2P"';
    ctx.fillText('BEST:' + engine.highSc, 10, 34);
  }

  // HP bar
  const hpW = 160;
  ctx.fillStyle = '#111'; ctx.fillRect(W/2-hpW/2-2, 8, hpW+4, 16);
  const hpPct = pl.hp / MAX_HP_local;
  ctx.fillStyle = hpPct > 0.5 ? '#2ecc71' : hpPct > 0.25 ? '#f39c12' : '#e74c3c';
  ctx.fillRect(W/2-hpW/2, 10, Math.max(0, hpW*hpPct), 12);
  ctx.strokeStyle = GLD; ctx.lineWidth = 1;
  ctx.strokeRect(W/2-hpW/2-2, 8, hpW+4, 16);
  ctx.fillStyle = '#fff'; ctx.font = '7px "Press Start 2P"'; ctx.textAlign = 'center';
  ctx.fillText('HP', W/2, 22);

  // level name + mission
  ctx.fillStyle = CREAM; ctx.font = '7px "Press Start 2P"'; ctx.textAlign = 'center';
  ctx.fillText(`LVL ${engine.lvlIdx+1} · ${lvl.name}`, W/2, 33);
  ctx.fillStyle = 'rgba(245,240,220,0.5)'; ctx.font = '6px "Press Start 2P"';
  ctx.fillText(lvl.mission, W/2, 46);

  // pixel hearts — top-right, red when alive, dark when spent
  for (let i = 0; i < 3; i++) {
    const hx = W - 14 - (2 - i) * 20;
    const hy = 7;
    const s = 2;
    ctx.fillStyle = i < lives ? '#e74c3c' : '#2a2a2a';
    ctx.fillRect(hx+s,   hy,     s, s); ctx.fillRect(hx+2*s, hy,     s, s);
    ctx.fillRect(hx+4*s, hy,     s, s); ctx.fillRect(hx+5*s, hy,     s, s);
    for (let j = 0; j < 7; j++) ctx.fillRect(hx+j*s, hy+s,   s, s);
    for (let j = 0; j < 7; j++) ctx.fillRect(hx+j*s, hy+2*s, s, s);
    for (let j = 1; j < 6; j++) ctx.fillRect(hx+j*s, hy+3*s, s, s);
    for (let j = 2; j < 5; j++) ctx.fillRect(hx+j*s, hy+4*s, s, s);
    ctx.fillRect(hx+3*s, hy+5*s, s, s);
  }

  // pizza counter or boss HP — boss bar placed BELOW hearts to avoid overlap
  if (!engine.boss) {
    ctx.fillStyle = GLD; ctx.font = '9px "Press Start 2P"'; ctx.textAlign = 'right';
    ctx.fillText(`🍕 ${pc}/16`, W-10, 42);
    for (let i = 0; i < 16; i++) {
      ctx.fillStyle = i < pc ? '#FF8C00' : '#1a2a10';
      ctx.fillRect(W-10-16*11+i*11, 44, 9, 7);
    }
  } else {
    const b = engine.boss;
    const bpct = b.hp / b.maxHp;
    const bW = 180;
    // label above the bar, right-aligned — sits just below hearts (y≈22)
    ctx.fillStyle = '#fff'; ctx.font = '7px "Press Start 2P"'; ctx.textAlign = 'right';
    ctx.fillText(b.label, W - 10, 24);
    // bar at y=27 — below hearts which end at y≈21
    ctx.fillStyle = '#111'; ctx.fillRect(W - bW - 12, 27, bW + 4, 14);
    ctx.fillStyle = bpct > 0.5 ? '#2ecc71' : bpct > 0.25 ? '#f39c12' : '#e74c3c';
    ctx.fillRect(W - bW - 10, 29, Math.max(0, bW * bpct), 10);
    ctx.strokeStyle = GLD; ctx.lineWidth = 1;
    ctx.strokeRect(W - bW - 12, 27, bW + 4, 14);
  }
}

// ── GROVE STUDIOS ──────────────────────────────
// ── YPSILANTI WATER TOWER ──────────────────────
// Pixel-art version of the Ypsilanti Water Tower: limestone cylinder +
// wide mushroom dome cap.  Drawn in the far background with parallax.
function drawWaterTower(ctx, scrollX) {
  const bx = Math.round(310 - scrollX * 0.38);
  if (bx < -120 || bx > W + 80) return;
  const by = GROUND;

  const S1 = '#cfc090'; // light limestone
  const S2 = '#a8986a'; // dark limestone / mortar
  const DM = '#686868'; // dome gray
  const DK = '#404040'; // dome shadow

  // ── cylinder body ──────────────────────────
  // solid fill then pixel mortar grid
  ctx.fillStyle = S1;
  ctx.fillRect(bx - 18, by - 106, 36, 106);

  // horizontal mortar lines
  ctx.fillStyle = S2;
  for (let y = 0; y <= 106; y += 8) ctx.fillRect(bx - 18, by - 106 + y, 36, 1);
  // staggered vertical mortar
  for (let row = 0; row < 14; row++) {
    const xOff = (row % 2) * 11;
    for (let x = xOff; x < 36; x += 22) ctx.fillRect(bx - 18 + x, by - 106 + row * 8, 1, 8);
  }
  // subtle side shading
  ctx.fillStyle = 'rgba(0,0,0,0.12)';
  ctx.fillRect(bx + 10, by - 106, 8, 106);

  // small arched windows on the cylinder
  ctx.fillStyle = DK;
  ctx.fillRect(bx - 5, by - 72, 10, 8);
  ctx.fillRect(bx - 4, by - 75, 8, 3);   // arch top
  ctx.fillRect(bx - 5, by - 42, 10, 8);
  ctx.fillRect(bx - 4, by - 45, 8, 3);

  // ── mushroom dome cap ───────────────────────
  // Stacked pixel rows — widest at base, narrowing to peak
  const rows = [
    [34, 8], [30, 8], [26, 8], [22, 8], [18, 7], [14, 6], [10, 5], [6, 4], [4, 3],
  ];
  let ry = by - 106;
  for (const [rw, rh] of rows) {
    ctx.fillStyle = DM;
    ctx.fillRect(bx - rw / 2, ry - rh, rw, rh);
    // right-side shadow stripe
    ctx.fillStyle = DK;
    ctx.fillRect(bx + rw / 2 - 4, ry - rh, 4, rh);
    ry -= rh;
  }
  // cap tip + antenna
  ctx.fillStyle = DK; ctx.fillRect(bx - 2, ry - 2, 4, 2);
  ctx.fillStyle = '#aaa'; ctx.fillRect(bx - 1, ry - 10, 2, 10);

  // ── base grass mound ────────────────────────
  ctx.fillStyle = 'rgba(50,110,30,0.45)';
  ctx.fillRect(bx - 30, by - 5, 60, 5);
}

// ── GROVE STUDIOS ──────────────────────────────
// Pixel-art version of the real building: dark charcoal upper wall,
// bright green lower wall, red roof trim, glass-block windows, dark door.
function drawGroveStudios(ctx) {
  const bw = 220, bh = 82;
  const bx = W / 2 - bw / 2, by = GROUND;
  const splitY = 30; // height of green lower band

  // ── roof trim (dark red) ─────────────────────
  ctx.fillStyle = '#6e1510';
  ctx.fillRect(bx - 2, by - bh - 4, bw + 4, 6);

  // ── upper wall — dark charcoal/navy ──────────
  ctx.fillStyle = '#252d3a';
  ctx.fillRect(bx, by - bh, bw, bh - splitY);
  // slight texture — horizontal lines
  ctx.fillStyle = 'rgba(0,0,0,0.18)';
  for (let y = 4; y < bh - splitY; y += 8) ctx.fillRect(bx, by - bh + y, bw, 1);

  // ── lower wall — bright green ─────────────────
  ctx.fillStyle = '#1f8c28';
  ctx.fillRect(bx, by - splitY, bw, splitY);
  // subtle horizontal block lines on green
  ctx.fillStyle = 'rgba(0,0,0,0.15)';
  for (let y = 8; y < splitY; y += 8) ctx.fillRect(bx, by - splitY + y, bw, 1);

  // ── door (left side, dark gray metal) ────────
  ctx.fillStyle = '#373c44';
  ctx.fillRect(bx + 16, by - splitY - 2, 24, splitY + 2);
  // door panel inset
  ctx.fillStyle = '#2a2e36';
  ctx.fillRect(bx + 18, by - splitY, 8, 14);
  ctx.fillRect(bx + 18, by - splitY + 16, 8, 10);
  // small glass window in door
  ctx.fillStyle = 'rgba(180,220,255,0.25)';
  ctx.fillRect(bx + 18, by - splitY, 8, 8);
  // handle
  ctx.fillStyle = '#8a8a8a';
  ctx.fillRect(bx + 37, by - 18, 2, 6);

  // ── glass-block windows (3, right side) ──────
  [82, 126, 170].forEach(wx => {
    const wy = by - bh + 10;
    const ww = 32, wh = 26;
    // frame
    ctx.fillStyle = '#181e28';
    ctx.fillRect(bx + wx, wy, ww, wh);
    // 2×2 glass blocks
    const blocks = [[1,1],[17,1],[1,14],[17,14]];
    blocks.forEach(([bkx, bky]) => {
      ctx.fillStyle = 'rgba(200,230,255,0.18)';
      ctx.fillRect(bx + wx + bkx, wy + bky, 14, 12);
      // highlight corner
      ctx.fillStyle = 'rgba(255,255,255,0.12)';
      ctx.fillRect(bx + wx + bkx, wy + bky, 14, 2);
      ctx.fillRect(bx + wx + bkx, wy + bky, 2, 12);
    });
    // grid dividers
    ctx.fillStyle = '#181e28';
    ctx.fillRect(bx + wx + 15, wy + 1, 2, wh - 2);
    ctx.fillRect(bx + wx + 1, wy + 13, ww - 2, 2);
  });

  // ── sign board (upper left) ───────────────────
  ctx.fillStyle = '#080c0a';
  ctx.fillRect(bx + 6, by - bh + 6, 68, 22);
  // green glow border
  ctx.shadowBlur = 8; ctx.shadowColor = '#22dd22';
  ctx.strokeStyle = '#22aa22'; ctx.lineWidth = 1;
  ctx.strokeRect(bx + 6, by - bh + 6, 68, 22);
  ctx.shadowBlur = 0;
  // "GROVE" text in green
  ctx.fillStyle = '#22dd22';
  ctx.font = 'bold 8px "Press Start 2P"'; ctx.textAlign = 'left';
  ctx.fillText('GROVE', bx + 12, by - bh + 20);
  // "STUDIOS" smaller below
  ctx.fillStyle = '#189918';
  ctx.font = '5px "Press Start 2P"';
  ctx.fillText('STUDIOS', bx + 12, by - bh + 25);
}

// ── OVERLAY SCREENS ────────────────────────────
function drawLevelIntro(ctx, frame, lvl, introTimer) {
  // sky background matching the level
  const bg = ctx.createLinearGradient(0, 0, 0, H);
  bg.addColorStop(0, lvl.skyTop); bg.addColorStop(1, lvl.skyBot);
  ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);

  // star / atmosphere particles
  if (lvl.hasStars || lvl.hasSun) {
    for (let i = 0; i < 30; i++) {
      const sx = (i * 137 + frame * 0.2) % W;
      const sy = (i * 73) % (H * 0.6);
      ctx.fillStyle = Math.sin(frame * 0.05 + i) > 0.3
        ? (lvl.windowColor || GLD)
        : 'rgba(200,210,230,0.15)';
      ctx.fillRect(sx, sy, 2, 2);
    }
  }

  // slide-in: panels sweep from left the first ~40 frames
  const slideIn = Math.max(0, 1 - (260 - introTimer) / 40);
  const panelX = -W * slideIn;

  // dark cinematic letterbox bars
  ctx.fillStyle = 'rgba(0,0,0,0.72)';
  ctx.fillRect(panelX, 0, W, H * 0.28);
  ctx.fillRect(panelX, H * 0.72, W, H * 0.28);

  // accent line top/bottom
  ctx.fillStyle = GLD;
  ctx.fillRect(panelX, H * 0.28 - 3, W, 3);
  ctx.fillRect(panelX, H * 0.72, W, 3);

  // LEVEL NUMBER — small, top-left of the cinematic band
  ctx.fillStyle = 'rgba(226,168,32,0.55)';
  ctx.font = '8px "Press Start 2P"';
  ctx.textAlign = 'left';
  ctx.fillText('LEVEL ' + (lvl.id), panelX + 28, H * 0.28 - 14);

  // CITY NAME — big centred
  ctx.fillStyle = GLD;
  ctx.font = '38px "Press Start 2P"';
  ctx.textAlign = 'center';
  ctx.shadowBlur = 18; ctx.shadowColor = GLD;
  ctx.fillText(lvl.name, W / 2 + panelX, H / 2 - 10);
  ctx.shadowBlur = 0;

  // subtitle (time/place)
  ctx.fillStyle = CREAM;
  ctx.font = '8px "Press Start 2P"';
  ctx.fillText(lvl.subtitle, W / 2 + panelX, H / 2 + 18);

  // MISSION — golden, below centre
  ctx.fillStyle = GLD;
  ctx.font = '9px "Press Start 2P"';
  ctx.fillText('MISSION: ' + lvl.mission, W / 2 + panelX, H * 0.72 + 26);

  // funny quip line
  ctx.fillStyle = 'rgba(245,240,220,0.75)';
  ctx.font = '7px "Press Start 2P"';
  ctx.fillText(lvl.introQuip, W / 2 + panelX, H * 0.72 + 50);

  // skip prompt — blinks in bottom letterbox
  if (Math.floor(frame / 22) % 2 === 0) {
    ctx.fillStyle = 'rgba(226,168,32,0.5)';
    ctx.font = '6px "Press Start 2P"';
    ctx.fillText('TAP ANY BUTTON TO SKIP', W / 2 + panelX, H - 18);
  }
}

function drawInitials(ctx, frame, engine) {
  const { initials, initialsPos } = engine;
  ctx.fillStyle = GRN; ctx.fillRect(0,0,W,H);
  for (let i=0;i<40;i++) {
    const sx=(i*131+frame*0.3)%W, sy=(i*71)%(H*0.55);
    ctx.fillStyle=Math.sin(frame*0.04+i)>0.4?GLD:'rgba(226,168,32,0.08)';
    ctx.fillRect(sx,sy,2,2);
  }
  ctx.fillStyle='rgba(0,0,0,0.86)'; ctx.fillRect(W/2-260,H/2-160,520,320);
  ctx.strokeStyle=GLD; ctx.lineWidth=3; ctx.strokeRect(W/2-260,H/2-160,520,320);

  ctx.fillStyle=GLD; ctx.font='13px "Press Start 2P"'; ctx.textAlign='center';
  ctx.fillText('ENTER YOUR INITIALS',W/2,H/2-108);
  ctx.fillStyle='rgba(245,240,220,0.45)'; ctx.font='6px "Press Start 2P"';
  ctx.fillText('← → CHANGE LETTER   ENTER / A = CONFIRM',W/2,H/2-82);

  // 3 letter slots
  const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  for (let i = 0; i < 3; i++) {
    const cx = W/2 - 80 + i * 80;
    const cy = H/2 - 18;
    const active = i === initialsPos;

    // box
    ctx.fillStyle = active ? 'rgba(226,168,32,0.14)' : 'rgba(0,0,0,0.45)';
    ctx.fillRect(cx-26, cy-46, 52, 68);
    ctx.lineWidth = active ? 3 : 1;
    ctx.strokeStyle = active ? GLD : 'rgba(226,168,32,0.25)';
    if (active) { ctx.shadowBlur=14; ctx.shadowColor=GLD; }
    ctx.strokeRect(cx-26, cy-46, 52, 68);
    ctx.shadowBlur=0;

    // show prev/next letters dimmed for context
    const curIdx = CHARS.indexOf(initials[i]);
    ctx.fillStyle='rgba(226,168,32,0.22)'; ctx.font='9px "Press Start 2P"'; ctx.textAlign='center';
    if (active) {
      ctx.fillText(CHARS[(curIdx-1+CHARS.length)%CHARS.length], cx, cy-28);
      ctx.fillText(CHARS[(curIdx+1)%CHARS.length], cx, cy+38);
    }

    // current letter
    ctx.fillStyle = active ? GLD : CREAM;
    ctx.font = active ? '28px "Press Start 2P"' : '24px "Press Start 2P"';
    ctx.fillText(initials[i], cx, cy+10);

    // blinking underline cursor on active
    if (active && Math.floor(frame/18)%2===0) {
      ctx.fillStyle=GLD; ctx.fillRect(cx-16, cy+16, 32, 3);
    }
  }

  if (Math.floor(frame/25)%2===0) {
    ctx.fillStyle='#4A7A30'; ctx.font='9px "Press Start 2P"'; ctx.textAlign='center';
    ctx.fillText(initialsPos < 2 ? '[ CONFIRM LETTER → NEXT ]' : '[ ENTER / START TO CONTINUE ]', W/2, H/2+100);
  }
}

function drawTitle(ctx, frame, highSc, playerName) {
  ctx.fillStyle = GRN; ctx.fillRect(0,0,W,H);
  // star field
  for (let i=0;i<40;i++) {
    const sx=(i*131+frame*0.3)%W, sy=(i*71)%(H*0.55);
    ctx.fillStyle = Math.sin(frame*0.04+i)>0.4 ? GLD : 'rgba(226,168,32,0.08)';
    ctx.fillRect(sx,sy,2,2);
  }
  ctx.fillStyle='rgba(0,0,0,0.88)'; ctx.fillRect(W/2-290,H/2-210,580,420);
  ctx.strokeStyle=GLD; ctx.lineWidth=4; ctx.strokeRect(W/2-290,H/2-210,580,420);
  ctx.fillStyle=GLD; ctx.font='19px "Press Start 2P"'; ctx.textAlign='center';
  ctx.fillText('DETROIT PIZZA QUEST',W/2,H/2-165);
  ctx.fillStyle='rgba(226,168,32,0.6)'; ctx.font='10px "Press Start 2P"';
  ctx.fillText('— Team Cabin Edition —',W/2,H/2-138);
  ctx.fillStyle=CREAM; ctx.font='9px "Press Start 2P"';
  const lines=[
    '3 LEVELS · 3 BOSSES · 1 CITY',
    '← → MOVE   SPACE / A JUMP',
    'JUMP ON ENEMIES TO DEFEAT THEM',
    'COLLECT 16 SLICES → BOSS FIGHT',
    '❤ GRAB HEARTS TO RESTORE HP',
    '❤❤❤  3 LIVES · FULL HP EACH LIFE',
  ];
  lines.forEach((l,i)=>ctx.fillText(l,W/2,H/2-105+i*24));
  if (Math.floor(frame/25)%2===0) {
    ctx.fillStyle='#4A7A30'; ctx.font='11px "Press Start 2P"';
    ctx.fillText('[ PRESS ENTER OR START ]',W/2,H/2+65);
  }
  if (highSc>0){ctx.fillStyle='rgba(226,168,32,0.55)';ctx.font='9px "Press Start 2P"';ctx.fillText('HIGH SCORE: '+highSc+(playerName&&playerName!=='AAA'?' · '+playerName:''),W/2,H/2+95);}
}

function drawCharSelect(ctx, frame, selChar) {
  ctx.fillStyle=GRN; ctx.fillRect(0,0,W,H);
  for(let i=0;i<35;i++){const sx=(i*137)%W,sy=(i*71)%(H*0.6);ctx.fillStyle=Math.sin(frame*0.04+i)>0.4?GLD:'rgba(226,168,32,0.07)';ctx.fillRect(sx,sy,2,2);}
  ctx.fillStyle=GLD; ctx.font='18px "Press Start 2P"'; ctx.textAlign='center';
  ctx.fillText('CHOOSE YOUR PLAYER',W/2,50);
  const chars=[{name:'STEVE',role:'Bass & Vocals'},{name:'MIKE',role:'Drums'},{name:'KYLE',role:'Guitar & Vocals'}];
  const cW=210,cH=360,gap=18;
  const startX = (W-(cW*3+gap*2))/2;
  chars.forEach((ch,i)=>{
    const cx=startX+i*(cW+gap), cy=75;
    const sel=selChar===i;
    ctx.fillStyle=sel?'rgba(226,168,32,0.12)':'rgba(0,0,0,0.5)'; ctx.fillRect(cx,cy,cW,cH);
    ctx.strokeStyle=sel?GLD:'rgba(226,168,32,0.2)'; ctx.lineWidth=sel?4:2; ctx.strokeRect(cx,cy,cW,cH);
    if(sel){ctx.shadowBlur=14;ctx.shadowColor=GLD;ctx.strokeRect(cx,cy,cW,cH);ctx.shadowBlur=0;}
    ctx.save(); ctx.beginPath(); ctx.rect(cx+3,cy+3,cW-6,cH-6); ctx.clip();
    drawCharPreview(ctx, i, cx+cW/2, cy+cH*0.44, 3);
    ctx.restore();
    ctx.fillStyle=sel?GLD:CREAM; ctx.font=`${sel?'13':'11'}px "Press Start 2P"`; ctx.textAlign='center';
    ctx.fillText(ch.name, cx+cW/2, cy+cH-55);
    ctx.fillStyle='rgba(226,168,32,0.6)'; ctx.font='8px "Press Start 2P"';
    ctx.fillText(ch.role, cx+cW/2, cy+cH-32);
    if(sel&&Math.floor(frame/20)%2===0){ctx.fillStyle=GLD;ctx.font='16px serif';ctx.fillText('▼',cx+cW/2,cy-8);}
  });
  ctx.fillStyle=CREAM; ctx.font='9px "Press Start 2P"'; ctx.textAlign='center';
  ctx.fillText('← → SELECT   ENTER / START CONFIRM',W/2,H-16);
}

function drawLevelUp(ctx, frame, lvlIdx, lvl) {
  const bg = ctx.createLinearGradient(0,0,0,H);
  bg.addColorStop(0,lvl.skyTop); bg.addColorStop(1,lvl.skyBot);
  ctx.fillStyle=bg; ctx.fillRect(0,0,W,H);

  // overlay box
  ctx.fillStyle='rgba(0,0,0,0.84)'; ctx.fillRect(W/2-230,H/2-110,460,200);
  ctx.strokeStyle=GLD; ctx.lineWidth=4; ctx.strokeRect(W/2-230,H/2-110,460,200);
  ctx.fillStyle=GLD; ctx.font='14px "Press Start 2P"'; ctx.textAlign='center';
  ctx.fillText('LEVEL '+lvlIdx+' COMPLETE!',W/2,H/2-62);
  ctx.fillStyle=CREAM; ctx.font='18px "Press Start 2P"';
  ctx.fillText('→ '+lvl.name,W/2,H/2-20);
  ctx.fillStyle='rgba(245,240,220,0.6)'; ctx.font='8px "Press Start 2P"';
  ctx.fillText(lvl.mission,W/2,H/2+12);
  if(Math.floor(frame/20)%2===0){ctx.fillStyle='#4A7A30';ctx.font='10px "Press Start 2P"';ctx.fillText('GET READY...',W/2,H/2+55);}
}

function drawGameOver(ctx, frame, sc, highSc) {
  ctx.fillStyle='rgba(0,0,0,0.88)'; ctx.fillRect(0,0,W,H);
  ctx.fillStyle='#e74c3c'; ctx.font='26px "Press Start 2P"'; ctx.textAlign='center';
  ctx.fillText('GAME OVER',W/2,H/2-60);
  ctx.fillStyle=CREAM; ctx.font='12px "Press Start 2P"';
  ctx.fillText('SCORE: '+sc,W/2,H/2-18);
  if(sc>0&&sc>=highSc){ctx.fillStyle=GLD;ctx.fillText('NEW HIGH SCORE!',W/2,H/2+14);}
  if(Math.floor(frame/28)%2===0){ctx.fillStyle=GLD;ctx.font='10px "Press Start 2P"';ctx.fillText('ENTER / START TO TRY AGAIN',W/2,H/2+55);}
}

function drawWin(ctx, frame, sc, highSc, playerName) {
  ctx.fillStyle=GRN; ctx.fillRect(0,0,W,H);
  for(let i=0;i<28;i++){ctx.fillStyle=[GLD,'#e74c3c','#F5F0DC','#4A7A30'][i%4];ctx.fillRect((i*137+frame*2.5)%W,(i*89+frame*1.5)%(H-60),8,8);}
  ctx.fillStyle='rgba(0,0,0,0.85)'; ctx.fillRect(W/2-265,H/2-148,530,296);
  ctx.strokeStyle=GLD; ctx.lineWidth=4; ctx.strokeRect(W/2-265,H/2-148,530,296);
  ctx.fillStyle=GLD; ctx.font='15px "Press Start 2P"'; ctx.textAlign='center';
  ctx.fillText('🍕 DETROIT CONQUERED! 🍕',W/2,H/2-110);
  ctx.fillStyle=CREAM; ctx.font='11px "Press Start 2P"';
  ctx.fillText('ALL 3 BOSSES DEFEATED',W/2,H/2-78);
  ctx.fillText('THE BAND FEASTS TONIGHT',W/2,H/2-50);
  ctx.fillText('SCORE: '+sc,W/2,H/2-18);
  if(sc>0&&sc>=highSc){ctx.fillStyle=GLD;ctx.fillText('✨ NEW HIGH SCORE'+(playerName?' · '+playerName:'')+'! ✨',W/2,H/2+18);}
  if(Math.floor(frame/28)%2===0){ctx.fillStyle=GLD;ctx.font='10px "Press Start 2P"';ctx.fillText('ENTER / START TO PLAY AGAIN',W/2,H/2+62);}
}
