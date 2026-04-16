// ─────────────────────────────────────────────
//  game/renderer.js
//  Pure canvas drawing — no React, no state.
//  Called each frame by PizzaGame.jsx
// ─────────────────────────────────────────────
import { W, H, GROUND, PW, PH, GLD, GRN, GRN2, CREAM } from './constants.js';
import { LEVELS } from './constants.js';
import { drawPlayer, drawEnemy, drawPizza, drawHeart, drawBoss, drawCharPreview } from './sprites.js';

// Preload PugFest banner image
const _pugImg = new Image();
_pugImg.src = '/pugfest-banner.png';

// Preload TC logo banner for Ferndale celebration
const _tcImg = new Image();
_tcImg.src = '/tc-banner.png';

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

  // ── YPSILANTI PLANES (sky layer, before buildings) ───────────
  if (engine.lvlIdx === 0) drawYpsiPlanes(ctx, frame);

  // ── DETROIT BACKGROUND (dilapidated + graffiti, parallax layer) ─
  if (engine.lvlIdx === 2) drawDetroitBackground(ctx, scrollX, frame);

  // ── BUILDINGS ────────────────────────────────
  engine.blds.forEach(b => drawBuilding(ctx, b, scrollX, lvl, frame));

  // ── FERNDALE LANDMARKS ───────────────────────
  if (engine.lvlIdx === 1) {
    // PugFest only appears as fixed boss-fight backdrop — never as a world landmark
    if (engine.boss && !engine.boss.dead) {
      drawPugFest(ctx, W / 2 - 140);
    }
    const combx = 900 - scrollX;
    if (combx > -240 && combx < W + 20) drawComos(ctx, combx);
    const dibx = 3200 - scrollX;
    if (dibx > -200 && dibx < W + 20) drawDannys(ctx, dibx);
  }

  // ── FERNDALE BOSS-DEAD CELEBRATION ───────────
  if (engine.lvlIdx === 1 && engine.boss && engine.boss.dead) {
    drawPugFestCelebration(ctx, engine, frame);
    drawHUD(ctx, engine, lvl);
    return;
  }

  // ── YPSILANTI LANDMARKS (drawn after buildings so they're in front) ──
  if (engine.lvlIdx === 0) {
    const mrpbx = 400 - scrollX;
    if (mrpbx > -200 && mrpbx < W + 20) drawMrPizza(ctx, mrpbx);
    const hbx = 2800 - scrollX;
    if (hbx > -260 && hbx < W + 20) drawHyperionCoffee(ctx, hbx);
    const hlbx = 3800 - scrollX;
    if (hlbx > -340 && hlbx < W + 20) drawHalesKitchen(ctx, hlbx, frame, engine.halesBarks, scrollX);
    const bbx = 5500 - scrollX;
    if (bbx > -220 && bbx < W + 20) drawTheBomber(ctx, bbx);
  }

  // ── DETROIT LANDMARKS ────────────────────────
  if (engine.lvlIdx === 2) {
    const piescibx = 500 - scrollX;
    if (piescibx > -180 && piescibx < W + 20) drawPieSci(ctx, piescibx, frame);
    const spiritbx = 1800 - scrollX;
    if (spiritbx > -200 && spiritbx < W + 20) drawSpiritOfDetroit(ctx, spiritbx, frame);
    const fistbx = 3000 - scrollX;
    if (fistbx > -200 && fistbx < W + 20) drawJoeLouis(ctx, fistbx, frame);
    const guardianbx = 4400 - scrollX * 0.7;
    if (guardianbx > -300 && guardianbx < W + 20) drawGuardianBuilding(ctx, Math.round(guardianbx), frame);
    const magicbx = 6200 - scrollX;
    if (magicbx > -280 && magicbx < W + 20) drawMagicStick(ctx, magicbx, frame);
  }

  // ── GROUND ───────────────────────────────────
  drawGround(ctx, lvl, scrollX);

  // ── PICKUPS ──────────────────────────────────
  engine.hearts.forEach(h => drawHeart(ctx, h, scrollX, frame));
  engine.pizzas.forEach(pz => drawPizza(ctx, pz, scrollX, frame));

  // ── FERNDALE CARS ────────────────────────────
  if (engine.cars) engine.cars.forEach(car => drawFerndaleCar(ctx, car, scrollX, frame));

  // ── ENEMIES ──────────────────────────────────
  engine.obs.forEach(o => drawEnemy(ctx, o, scrollX, frame));

  // ── BOSS ─────────────────────────────────────
  if (engine.boss) drawBoss(ctx, engine.boss, scrollX, frame);

  // ── PARTICLES ────────────────────────────────
  engine.parts.forEach(p => {
    ctx.globalAlpha = p.life / p.ml;
    ctx.fillStyle = p.col;
    ctx.fillRect(p.x - p.sz/2, p.y - p.sz/2, p.sz, p.sz);
  });
  ctx.globalAlpha = 1;

  // ── PLAYER ───────────────────────────────────
  drawPlayer(ctx, engine.pl, engine.charIdx, frame);

  // ── GROVE STUDIOS (drawn after player so building covers walk-in) ───
  if (engine.lvlIdx === 0 && engine.groveX > 0) {
    drawGroveStudios(ctx, engine.groveX - engine.scrollX);
  }

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

  // character life icons — top-right
  const rx = W - 20;
  for (let i = 0; i < 3; i++) {
    const iconX = rx - (2 - i) * 26;
    const iconY = 22;
    if (i >= lives) ctx.globalAlpha = 0.13;
    drawCharPreview(ctx, engine.charIdx, iconX, iconY, 0.52);
    ctx.globalAlpha = 1;
  }

  // pizza counter or boss HP
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
    // boss bar sits BELOW the life icons (which end ~y=35)
    ctx.fillStyle = '#fff'; ctx.font = '7px "Press Start 2P"'; ctx.textAlign = 'right';
    ctx.fillText(b.label, W - 10, 36);
    ctx.fillStyle = '#111'; ctx.fillRect(W - bW - 12, 38, bW + 4, 12);
    ctx.fillStyle = bpct > 0.5 ? '#2ecc71' : bpct > 0.25 ? '#f39c12' : '#e74c3c';
    ctx.fillRect(W - bW - 10, 40, Math.max(0, bW * bpct), 8);
    ctx.strokeStyle = GLD; ctx.lineWidth = 1;
    ctx.strokeRect(W - bW - 12, 38, bW + 4, 12);
  }
}

// ── YPSILANTI WATER TOWER ──────────────────────
// 8-bit Ypsilanti Water Tower: warm brick cylinder + tall rounded bullet
// dome (dark chocolate brown), decorative collar ring at the junction.
function drawWaterTower(ctx, scrollX) {
  const bx = Math.round(260 - scrollX * 0.10);
  if (bx < -120 || bx > W + 80) return;
  const by = GROUND;

  const CY1 = '#b86838'; // cylinder light brick
  const CY2 = '#8a4820'; // cylinder dark / mortar
  const DM  = '#5e2a0c'; // dome dark chocolate
  const DML = '#7a3a14'; // dome lighter face
  const COL = '#3e1c08'; // collar ring

  // ── cylinder body (brick/terracotta) ─────────
  ctx.fillStyle = CY1;
  ctx.fillRect(bx - 18, by - 106, 36, 106);
  // horizontal brick mortar
  ctx.fillStyle = CY2;
  for (let y = 0; y <= 106; y += 9) ctx.fillRect(bx - 18, by - 106 + y, 36, 1);
  // staggered vertical mortar
  for (let row = 0; row < 12; row++) {
    const xOff = (row % 2) * 11;
    for (let x = xOff; x < 36; x += 22) ctx.fillRect(bx - 18 + x, by - 106 + row * 9, 1, 9);
  }
  // right-side shading on cylinder
  ctx.fillStyle = 'rgba(0,0,0,0.14)';
  ctx.fillRect(bx + 9, by - 106, 9, 106);

  // small round window (cross inside circle — characteristic detail)
  ctx.fillStyle = CY2;
  ctx.fillRect(bx - 6, by - 68, 12, 10);
  ctx.fillRect(bx - 5, by - 70, 10, 2);   // arch top
  ctx.fillStyle = 'rgba(0,0,0,0.35)';
  ctx.fillRect(bx - 4, by - 67, 8, 8);
  // cross detail inside window
  ctx.fillStyle = CY2;
  ctx.fillRect(bx - 1, by - 67, 2, 8);
  ctx.fillRect(bx - 4, by - 64, 8, 2);

  // ── horizontal band rings on cylinder (visible in the sticker) ───────
  ctx.fillStyle = COL;
  ctx.fillRect(bx - 19, by - 38, 38, 4);
  ctx.fillRect(bx - 19, by - 68, 38, 4);
  ctx.fillRect(bx - 19, by - 98, 38, 4);

  // ── decorative collar ring (junction) ────────
  ctx.fillStyle = COL;
  ctx.fillRect(bx - 21, by - 110, 42, 6);
  ctx.fillStyle = 'rgba(0,0,0,0.4)';
  ctx.fillRect(bx - 21, by - 108, 42, 1);
  ctx.fillRect(bx - 21, by - 105, 42, 1);

  // ── rounded dome — wide hemisphere matching the real tower ──────────
  // The tank is nearly 2× the cylinder width, bulbous and round like the photo.
  // Rows from bottom (collar) to top; wide in the middle, curving to blunt top.
  // Bullet/capsule shape — same width as cylinder, tall, smooth rounded top
  const dRows = [
    [38, 4], [40, 4], [40, 4], [40, 4], [40, 4], // slight overhang, stays consistent
    [40, 4], [40, 4], [38, 4], [36, 4], [32, 3], // holds width then begins rounding
    [26, 3], [20, 2], [14, 2], [8, 1], [4, 1], [2, 1], // smooth round top
  ];
  let dy = by - 110; // start at top of collar
  for (const [rw, rh] of dRows) {
    ctx.fillStyle = DML;
    ctx.fillRect(bx - rw / 2, dy - rh, rw, rh);
    // right-side shadow for roundness
    const sh = Math.max(2, Math.floor(rw * 0.18));
    ctx.fillStyle = DM;
    ctx.fillRect(bx + rw / 2 - sh, dy - rh, sh, rh);
    dy -= rh;
  }

  // ── base grass mound ─────────────────────────
  ctx.fillStyle = 'rgba(50,110,30,0.45)';
  ctx.fillRect(bx - 30, by - 5, 60, 5);
}

// ── HYPERION COFFEE ────────────────────────────
// 8-bit Hyperion Coffee Co. (Ypsilanti): red brick two-story building,
// dark storefront with two large door openings, hanging sign.
function drawHyperionCoffee(ctx, bx) {
  const bw = 210, bh = 148, storeH = 54;
  const by = GROUND;
  const upperH = bh - storeH; // 110px

  // ── upper brick wall ─────────────────────────
  ctx.fillStyle = '#7a3018';
  ctx.fillRect(bx, by - bh, bw, upperH);
  ctx.fillStyle = 'rgba(0,0,0,0.18)';
  for (let y = 7; y < upperH; y += 9) ctx.fillRect(bx, by - bh + y, bw, 1);
  ctx.fillStyle = 'rgba(0,0,0,0.10)';
  for (let row = 0; row < Math.floor(upperH / 9); row++) {
    const xOff = (row % 2) * 14;
    for (let x = xOff; x < bw; x += 28) ctx.fillRect(bx + x, by - bh + row * 9, 1, 9);
  }

  // ── GIANT sign — nearly full building width, 100px tall ──
  const sw = 228, sh = 100, sx = bx + 6, sy = by - bh + 5;
  // drop shadow
  ctx.fillStyle = 'rgba(0,0,0,0.45)';
  ctx.fillRect(sx + 4, sy + 4, sw, sh);
  // sign cream body
  ctx.fillStyle = '#f5f0e0';
  ctx.fillRect(sx, sy, sw, sh);
  // thick border
  ctx.strokeStyle = '#5a4020'; ctx.lineWidth = 3;
  ctx.strokeRect(sx + 1, sy + 1, sw - 2, sh - 2);
  // inner thin border
  ctx.strokeStyle = '#8b6535'; ctx.lineWidth = 1;
  ctx.strokeRect(sx + 5, sy + 5, sw - 10, sh - 10);

  // ── Planet/Saturn logo — centered at top of sign ──
  const pcx = sx + sw / 2, pcy = sy + 38, pr = 20;
  // planet body
  ctx.fillStyle = '#1a1a1a';
  ctx.beginPath(); ctx.arc(pcx, pcy, pr, 0, Math.PI * 2); ctx.fill();
  // planet highlight
  ctx.fillStyle = 'rgba(255,255,255,0.18)';
  ctx.beginPath(); ctx.arc(pcx - 6, pcy - 6, 8, 0, Math.PI * 2); ctx.fill();
  // ring (ellipse behind + front) — tilt like the real logo
  ctx.save();
  ctx.translate(pcx, pcy);
  ctx.rotate(-0.3);
  // back arc of ring (clipped behind planet)
  ctx.strokeStyle = '#1a1a1a'; ctx.lineWidth = 3;
  ctx.beginPath(); ctx.ellipse(0, 0, pr * 1.9, pr * 0.52, 0, Math.PI, Math.PI * 2); ctx.stroke();
  // front arc of ring
  ctx.beginPath(); ctx.ellipse(0, 0, pr * 1.9, pr * 0.52, 0, 0, Math.PI); ctx.stroke();
  ctx.restore();

  // ── HYPERION text — large, below planet ───────
  ctx.fillStyle = '#111111';
  ctx.textAlign = 'center';
  ctx.font = '14px "Press Start 2P"';
  ctx.fillText('HYPERION', sx + sw / 2, sy + 72);
  // COFFEE CO. small
  ctx.font = '6px "Press Start 2P"';
  ctx.fillStyle = '#444';
  ctx.fillText('COFFEE  CO.', sx + sw / 2, sy + 86);

  // hanging wire brackets
  ctx.fillStyle = '#777';
  ctx.fillRect(sx + 24, sy - 8, 3, 9);
  ctx.fillRect(sx + sw - 27, sy - 8, 3, 9);

  // ── dark lower storefront ─────────────────────
  ctx.fillStyle = '#0a0f0a';
  ctx.fillRect(bx, by - storeH, bw, storeH);

  // ── two DOMINANT green doors ──────────────────
  [4, 122].forEach(dx => {
    const dw = 112, dh = storeH - 4;
    const dy = by - storeH + 4;
    // door fill — dark forest green
    ctx.fillStyle = '#091809';
    ctx.fillRect(bx + dx, dy, dw, dh);
    // bold green frame — 4px
    ctx.strokeStyle = '#2d602d'; ctx.lineWidth = 4;
    ctx.strokeRect(bx + dx + 2, dy + 2, dw - 4, dh - 2);
    // horizontal panel slats
    ctx.strokeStyle = '#1a3d1a'; ctx.lineWidth = 1;
    for (let py2 = dy + 14; py2 < dy + dh - 4; py2 += 14) {
      ctx.beginPath(); ctx.moveTo(bx + dx + 7, py2); ctx.lineTo(bx + dx + dw - 7, py2); ctx.stroke();
    }
    // center vertical split
    ctx.strokeStyle = '#2d602d'; ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(bx + dx + Math.floor(dw / 2), dy + 5);
    ctx.lineTo(bx + dx + Math.floor(dw / 2), dy + dh - 2);
    ctx.stroke();
  });

  // ── roof cap ─────────────────────────────────
  ctx.fillStyle = '#1a1a1a';
  ctx.fillRect(bx - 3, by - bh - 6, bw + 6, 7);
}

// ── SMALL PLANES flying through Ypsilanti sky ──────────────────
function drawYpsiPlanes(ctx, frame) {
  for (let i = 0; i < 3; i++) {
    const period = W + 280;
    const px = W + 140 - ((frame * 0.55 + i * Math.floor(period / 3)) % period);
    const py = 80 + i * 32;
    if (px < -50 || px > W + 50) continue;
    // fuselage
    ctx.fillStyle = '#8a8a8a';
    ctx.fillRect(px, py, 30, 6);
    // nose cone
    ctx.fillStyle = '#666';
    ctx.fillRect(px - 5, py + 1, 6, 4);
    // cockpit
    ctx.fillStyle = '#7ac8e0';
    ctx.fillRect(px + 4, py - 4, 9, 5);
    // wings
    ctx.fillStyle = '#aaa';
    ctx.fillRect(px + 6, py + 5, 18, 4);
    // tail fin (vertical)
    ctx.fillStyle = '#888';
    ctx.fillRect(px + 25, py - 5, 5, 6);
    // tail horizontal
    ctx.fillRect(px + 23, py + 5, 9, 3);
    // propeller
    ctx.fillStyle = '#444';
    ctx.fillRect(px - 6, py - 1, 2, 8);
  }
}

// ── MR. PIZZA (Ypsilanti ~25% through level) ───────────────────
function drawMrPizza(ctx, bx) {
  const bw = 178, bh = 98, storeH = 50;
  const by = GROUND;

  // dark charcoal upper facade
  ctx.fillStyle = '#2e2e2e';
  ctx.fillRect(bx, by - bh, bw, bh - storeH);
  ctx.fillStyle = 'rgba(0,0,0,0.25)';
  for (let y = 8; y < bh - storeH; y += 10) ctx.fillRect(bx, by - bh + y, bw, 1);

  // BIG illuminated sign — full width, 34px tall
  const sy = by - bh + 3, sw = bw - 6, sx = bx + 3;
  // glow halo
  ctx.fillStyle = 'rgba(255,220,100,0.12)';
  ctx.fillRect(sx - 4, sy - 4, sw + 8, 42);
  // sign body
  ctx.fillStyle = '#f8f4e0';
  ctx.fillRect(sx, sy, sw, 34);
  ctx.strokeStyle = '#cc8800'; ctx.lineWidth = 2;
  ctx.strokeRect(sx + 1, sy + 1, sw - 2, 32);
  // "Mr." smaller
  ctx.fillStyle = '#d04000';
  ctx.font = '8px "Press Start 2P"'; ctx.textAlign = 'left';
  ctx.fillText('Mr.', sx + 6, sy + 15);
  // "PIZZA" huge
  ctx.fillStyle = '#e05500';
  ctx.font = '17px "Press Start 2P"'; ctx.textAlign = 'center';
  ctx.fillText('PIZZA', sx + sw / 2 + 16, sy + 28);

  // red storefront
  ctx.fillStyle = '#b81010';
  ctx.fillRect(bx, by - storeH, bw, storeH);

  // string lights strip
  ctx.fillStyle = '#ccc';
  ctx.fillRect(bx, by - storeH, bw, 3);
  for (let lx = bx + 5; lx < bx + bw - 4; lx += 10) {
    ctx.fillStyle = (Math.floor(lx / 10) % 2 === 0) ? '#fff6aa' : '#aaffaa';
    ctx.fillRect(lx, by - storeH, 5, 5);
  }

  // two large windows
  [6, bw - 64].forEach(wx => {
    ctx.fillStyle = '#162838';
    ctx.fillRect(bx + wx, by - storeH + 6, 54, 38);
    ctx.fillStyle = 'rgba(100,180,220,0.3)';
    ctx.fillRect(bx + wx + 2, by - storeH + 8, 50, 34);
    ctx.fillStyle = 'rgba(200,20,20,0.2)';
    ctx.fillRect(bx + wx + 2, by - storeH + 8, 50, 34);
    // string lights inside window
    for (let li = 0; li < 5; li++) {
      ctx.fillStyle = 'rgba(255,255,180,0.75)';
      ctx.fillRect(bx + wx + 5 + li * 9, by - storeH + 10, 4, 3);
    }
    ctx.strokeStyle = '#666'; ctx.lineWidth = 1;
    ctx.strokeRect(bx + wx, by - storeH + 6, 54, 38);
  });

  // center glass door
  const dx = Math.floor((bw - 36) / 2);
  ctx.fillStyle = '#162838';
  ctx.fillRect(bx + dx, by - storeH + 10, 36, 40);
  ctx.fillStyle = 'rgba(100,180,220,0.35)';
  ctx.fillRect(bx + dx + 2, by - storeH + 12, 15, 36);
  ctx.fillRect(bx + dx + 19, by - storeH + 12, 15, 36);
  ctx.strokeStyle = '#666'; ctx.lineWidth = 1;
  ctx.strokeRect(bx + dx, by - storeH + 10, 36, 40);

  // roof cap
  ctx.fillStyle = '#111';
  ctx.fillRect(bx - 2, by - bh - 4, bw + 4, 5);
}

// ── THE BOMBER (Ypsilanti ~75% through level) ──────────────────
function drawTheBomber(ctx, bx) {
  const bw = 200, bh = 110, lowerH = 46;
  const by = GROUND;
  const upperH = bh - lowerH;

  // bright yellow upper wall
  ctx.fillStyle = '#f2b800';
  ctx.fillRect(bx, by - bh, bw, upperH);
  // top stripe
  ctx.fillStyle = '#c99a00';
  ctx.fillRect(bx, by - bh, bw, 5);

  // sign box outline on yellow
  const sw = 180, sx = bx + 10, sy2 = by - bh + 8;
  ctx.strokeStyle = '#1a1a1a'; ctx.lineWidth = 2;
  ctx.strokeRect(sx, sy2, sw, upperH - 12);

  // pixel plane silhouette
  const pcx = sx + sw / 2, pcy = sy2 + 20;
  ctx.fillStyle = '#111';
  ctx.fillRect(pcx - 20, pcy - 3, 40, 6);   // fuselage
  ctx.fillRect(pcx - 26, pcy + 1, 52, 4);   // wings
  ctx.fillRect(pcx + 18, pcy - 3, 7, 4);   // nose
  ctx.fillRect(pcx - 28, pcy - 8, 8, 10);  // tail fin

  // text
  ctx.fillStyle = '#111';
  ctx.font = '9px "Press Start 2P"'; ctx.textAlign = 'center';
  ctx.fillText('THE BOMBER', sx + sw / 2, sy2 + 38);
  ctx.font = '6px "Press Start 2P"';
  ctx.fillText('RESTAURANT', sx + sw / 2, sy2 + 50);
  ctx.font = '5px "Press Start 2P"';
  ctx.fillText('306', sx + sw / 2, sy2 + 60);

  // yellow band dividing upper/lower
  ctx.fillStyle = '#f2b800';
  ctx.fillRect(bx, by - lowerH - 3, bw, 6);

  // red brick lower section
  ctx.fillStyle = '#8B1010';
  ctx.fillRect(bx, by - lowerH, bw, lowerH);
  ctx.fillStyle = 'rgba(0,0,0,0.15)';
  for (let y = 8; y < lowerH; y += 10) ctx.fillRect(bx, by - lowerH + y, bw, 1);
  for (let row = 0; row < Math.floor(lowerH / 10); row++) {
    const xOff = (row % 2) * 18;
    for (let x = xOff; x < bw; x += 36) ctx.fillRect(bx + x, by - lowerH + row * 10, 1, 10);
  }

  // two windows lower left
  [8, 72].forEach(wx => {
    ctx.fillStyle = '#2a4a6a';
    ctx.fillRect(bx + wx, by - lowerH + 6, 54, 30);
    ctx.fillStyle = 'rgba(160,210,255,0.3)';
    ctx.fillRect(bx + wx + 2, by - lowerH + 8, 50, 26);
    ctx.strokeStyle = '#555'; ctx.lineWidth = 1;
    ctx.strokeRect(bx + wx, by - lowerH + 6, 54, 30);
  });

  // door right side
  ctx.fillStyle = '#1a2a3a';
  ctx.fillRect(bx + 145, by - lowerH + 8, 30, 38);
  ctx.fillStyle = 'rgba(160,210,255,0.3)';
  ctx.fillRect(bx + 147, by - lowerH + 10, 26, 34);

  // roof cap
  ctx.fillStyle = '#c99a00';
  ctx.fillRect(bx - 2, by - bh - 5, bw + 4, 6);
}

// ── HALE'S KITCHEN (Ypsilanti ~halfway through level) ──────────
function drawHalesKitchen(ctx, bx, frame, halesBarks, scrollX) {
  const by = GROUND;
  const garageW = 118;
  const houseW  = 162;
  const totalW  = garageW + houseW; // 280
  const bh = 138;

  // ── YARD GRASS ──────────────────────────────
  ctx.fillStyle = '#3d8a28';
  ctx.fillRect(bx - 28, by - 44, totalW + 56, 44);

  // ── DRIVEWAY (in front of garage) ───────────
  ctx.fillStyle = '#b0a898';
  ctx.fillRect(bx + 4, by - 44, garageW - 6, 44);
  ctx.fillStyle = 'rgba(0,0,0,0.1)';
  for (let lx = bx + 20; lx < bx + garageW - 10; lx += 28) {
    ctx.fillRect(lx, by - 44, 10, 44); // faint tire marks
  }

  // ── TREES ───────────────────────────────────
  _hkTree(ctx, bx - 10, by, 52, '#246a14', '#184e0e');
  _hkTree(ctx, bx + totalW + 14, by, 48, '#246014', '#185010');
  _hkTree(ctx, bx + garageW + 100, by, 36, '#226012', '#164010');

  // ── GARAGE WALL (orange-tan siding) ─────────
  ctx.fillStyle = '#c98828';
  ctx.fillRect(bx, by - bh, garageW, bh);
  // siding horizontal lines
  ctx.fillStyle = 'rgba(0,0,0,0.09)';
  for (let y = 6; y < bh; y += 8) ctx.fillRect(bx, by - bh + y, garageW, 1);

  // Garage door — grid panel door (dark olive-green frame, brownish-red panels)
  const gdx = bx + 5, gdy = by - 78, gdw = garageW - 10, gdh = 78;
  // outer frame shadow
  ctx.fillStyle = '#080e02';
  ctx.fillRect(gdx - 2, gdy - 2, gdw + 4, gdh + 2);
  // frame body — dark olive-green (matches reference image)
  ctx.fillStyle = '#2e3d12';
  ctx.fillRect(gdx, gdy, gdw, gdh);
  // subtle vertical siding lines on frame
  ctx.fillStyle = 'rgba(0,0,0,0.18)';
  for (let lx = gdx + 8; lx < gdx + gdw - 4; lx += 12) {
    ctx.fillRect(lx, gdy, 1, gdh);
  }
  // panel grid: 4 cols × 3 rows (recessed brownish-red panels)
  { const cols = 4, rows = 3, pad = 5, gap = 4;
    const pw = Math.floor((gdw - pad * 2 - gap * (cols - 1)) / cols);
    const ph = Math.floor((gdh - pad * 2 - gap * (rows - 1)) / rows);
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const px = gdx + pad + col * (pw + gap);
        const py = gdy + pad + row * (ph + gap);
        // inset panel shadow
        ctx.fillStyle = 'rgba(0,0,0,0.45)';
        ctx.fillRect(px - 1, py - 1, pw + 2, ph + 2);
        // panel body — dark brownish-red
        ctx.fillStyle = '#6b2d14';
        ctx.fillRect(px, py, pw, ph);
        // panel highlight top & left edges
        ctx.fillStyle = 'rgba(180,85,38,0.5)';
        ctx.fillRect(px, py, pw, 2);
        ctx.fillRect(px, py, 2, ph);
        // panel shadow bottom & right edges
        ctx.fillStyle = 'rgba(0,0,0,0.42)';
        ctx.fillRect(px, py + ph - 2, pw, 2);
        ctx.fillRect(px + pw - 2, py, 2, ph);
      }
    }
  }
  // door outer border
  ctx.strokeStyle = '#0f1a06'; ctx.lineWidth = 2;
  ctx.strokeRect(gdx, gdy, gdw, gdh);

  // ── HOUSE WALL ──────────────────────────────
  ctx.fillStyle = '#d49030';
  ctx.fillRect(bx + garageW, by - bh, houseW, bh);
  // brick texture
  ctx.fillStyle = 'rgba(0,0,0,0.11)';
  for (let y = 8; y < bh; y += 9) ctx.fillRect(bx + garageW, by - bh + y, houseW, 1);
  for (let row = 0; row < Math.floor(bh / 9); row++) {
    const xOff = (row % 2) * 14;
    for (let x = xOff; x < houseW; x += 28) {
      ctx.fillRect(bx + garageW + x, by - bh + row * 9, 1, 9);
    }
  }

  // House windows (2)
  [18, 82].forEach(wx => {
    const wbx = bx + garageW + wx, wby = by - bh + 38;
    ctx.fillStyle = '#18304e';
    ctx.fillRect(wbx, wby, 30, 26);
    ctx.fillStyle = 'rgba(150,195,240,0.38)';
    ctx.fillRect(wbx + 2, wby + 2, 26, 22);
    // pane dividers
    ctx.fillStyle = '#18304e';
    ctx.fillRect(wbx + 14, wby + 2, 2, 22);
    ctx.fillRect(wbx + 2, wby + 13, 26, 2);
    ctx.strokeStyle = '#7a5828'; ctx.lineWidth = 1;
    ctx.strokeRect(wbx, wby, 30, 26);
  });

  // Front door
  const dox = bx + garageW + 122, doy = by - 46;
  ctx.fillStyle = '#1e1008';
  ctx.fillRect(dox, doy, 24, 46);
  ctx.fillStyle = 'rgba(140,190,230,0.18)';
  ctx.fillRect(dox + 2, doy + 2, 20, 18);
  ctx.strokeStyle = '#5a3610'; ctx.lineWidth = 1;
  ctx.strokeRect(dox, doy, 24, 46);
  // door knob
  ctx.fillStyle = '#d4a020';
  ctx.fillRect(dox + 18, doy + 26, 3, 3);

  // ── HALE'S KITCHEN SIGN WITH FLAMES ─────────────
  const sw = 168, sh = 46, sx = bx + garageW + 3, sy2 = by - bh + 3;

  // === ANIMATED FLAMES rising above the sign ===
  ctx.save();
  const flameCount = 11;
  for (let fi = 0; fi < flameCount; fi++) {
    const flameX = sx + 10 + fi * (sw - 20) / (flameCount - 1);
    const flk1 = Math.sin(frame * 0.17 + fi * 0.88) * 0.5 + 0.5;
    const flk2 = Math.sin(frame * 0.11 + fi * 1.43) * 0.5 + 0.5;
    const flameH = 10 + flk1 * 8 + flk2 * 5;
    const flameW = 4.5 + flk1 * 2.5;
    const grad = ctx.createLinearGradient(flameX, sy2 - flameH, flameX, sy2 + 3);
    grad.addColorStop(0,    'rgba(255,30,0,0)');
    grad.addColorStop(0.22, 'rgba(255,80,0,0.85)');
    grad.addColorStop(0.6,  'rgba(255,165,0,0.95)');
    grad.addColorStop(1,    'rgba(255,230,40,1)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.moveTo(flameX - flameW / 2, sy2 + 3);
    ctx.quadraticCurveTo(
      flameX - flameW, sy2 - flameH * 0.32,
      flameX + flk1 * 4 - 2, sy2 - flameH
    );
    ctx.quadraticCurveTo(
      flameX + flameW, sy2 - flameH * 0.32,
      flameX + flameW / 2, sy2 + 3
    );
    ctx.fill();
  }
  ctx.restore();

  // drop shadow
  ctx.fillStyle = 'rgba(0,0,0,0.55)';
  ctx.fillRect(sx + 4, sy2 + 4, sw, sh);
  // sign body — dark charcoal/chalkboard
  ctx.fillStyle = '#120a01';
  ctx.fillRect(sx, sy2, sw, sh);
  // flame-orange outer border
  ctx.strokeStyle = '#e05500'; ctx.lineWidth = 2;
  ctx.strokeRect(sx + 2, sy2 + 2, sw - 4, sh - 4);
  // inner accent border
  ctx.strokeStyle = '#7a2200'; ctx.lineWidth = 1;
  ctx.strokeRect(sx + 5, sy2 + 5, sw - 10, sh - 10);

  // === INLINE FLAME ICONS flanking the text ===
  ctx.save();
  [[sx + 8, 0], [sx + sw - 22, 1]].forEach(([fx, i]) => {
    const fy = sy2 + 7;
    const flk = Math.sin(frame * 0.2 + i * 1.65) * 0.5 + 0.5;
    // outer flame body
    const fg = ctx.createLinearGradient(fx + 6, fy, fx + 6, fy + 18);
    fg.addColorStop(0,   `rgba(255,${50 + (flk * 40) | 0},0,0.88)`);
    fg.addColorStop(0.5, `rgba(255,${140 + (flk * 45) | 0},0,0.95)`);
    fg.addColorStop(1,   'rgba(255,225,45,1)');
    ctx.fillStyle = fg;
    ctx.beginPath();
    ctx.moveTo(fx + 6, fy + 18);
    ctx.quadraticCurveTo(fx,      fy + 10, fx + 3,  fy + 4);
    ctx.quadraticCurveTo(fx + 6,  fy + 8,  fx + 8,  fy + 1);
    ctx.quadraticCurveTo(fx + 13, fy + 8,  fx + 12, fy + 18);
    ctx.fill();
    // bright inner core
    ctx.fillStyle = `rgba(255,240,80,${0.68 + flk * 0.32})`;
    ctx.beginPath();
    ctx.moveTo(fx + 6, fy + 15);
    ctx.quadraticCurveTo(fx + 3, fy + 11, fx + 5, fy + 8);
    ctx.quadraticCurveTo(fx + 7, fy + 11, fx + 8, fy + 6);
    ctx.quadraticCurveTo(fx + 10, fy + 11, fx + 9, fy + 15);
    ctx.fill();
  });
  ctx.restore();

  // "HALE'S" — hot orange with fire glow
  ctx.textAlign = 'center';
  ctx.fillStyle = '#ff7a00';
  ctx.shadowBlur = 9; ctx.shadowColor = '#ff3300';
  ctx.font = 'bold 11px "Press Start 2P"';
  ctx.fillText("HALE'S", sx + sw / 2, sy2 + 21);
  ctx.shadowBlur = 0;
  // "KITCHEN" — warm cream with subtle glow
  ctx.fillStyle = '#ffe8a0';
  ctx.shadowBlur = 4; ctx.shadowColor = '#ff6600';
  ctx.font = '8px "Press Start 2P"';
  ctx.fillText('KITCHEN', sx + sw / 2, sy2 + 35);
  ctx.shadowBlur = 0;

  // ── ROOF CAP ────────────────────────────────
  ctx.fillStyle = '#2a1408';
  ctx.fillRect(bx - 3, by - bh - 5, totalW + 6, 6);
  // small roofline detail on house section
  ctx.fillStyle = '#3a1e0a';
  ctx.fillRect(bx + garageW - 2, by - bh - 11, houseW + 4, 8);

  // ── DOGS IN YARD ────────────────────────────
  // Two dogs run back and forth inside the yard behind fence
  const yardL = bx + 16, yardR = bx + totalW - 20;
  const period = 230;
  [0, 1].forEach(i => {
    const phase = i * Math.round(period * 0.52);
    const t = ((frame + phase) % period) / period;
    const pp = t < 0.5 ? t * 2 : (1 - t) * 2;
    const dogX = yardL + pp * (yardR - yardL);
    const dogFace = t < 0.5 ? 1 : -1;
    const dogY = by - 42;
    _hkDog(ctx, dogX, dogY, dogFace, frame + phase * 2);
  });

  // ── CHAIN-LINK FENCE (front of yard) ────────
  const fx = bx - 22, fw = totalW + 44, fh = 30, fy = by - fh;
  // posts
  ctx.fillStyle = '#9e9e9e';
  for (let px = 0; px <= fw + 2; px += 26) {
    ctx.fillRect(fx + px, fy - 4, 3, fh + 4);
  }
  // top rail
  ctx.fillStyle = '#b8b8b8';
  ctx.fillRect(fx, fy, fw, 3);
  // diamond chain-link weave
  ctx.strokeStyle = 'rgba(180,180,180,0.72)'; ctx.lineWidth = 1;
  for (let x = -8; x < fw + 8; x += 8) {
    ctx.beginPath(); ctx.moveTo(fx + x, fy);     ctx.lineTo(fx + x + 8, fy + fh); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(fx + x + 8, fy); ctx.lineTo(fx + x, fy + fh);     ctx.stroke();
  }
  // bottom rail
  ctx.fillStyle = '#b8b8b8';
  ctx.fillRect(fx, fy + fh - 2, fw, 3);
  // post caps
  ctx.fillStyle = '#d0d0d0';
  for (let px = 0; px <= fw + 2; px += 26) {
    ctx.fillRect(fx + px - 1, fy - 7, 5, 4);
  }

  // ── BARK PROJECTILES ────────────────────────
  if (halesBarks) {
    halesBarks.forEach(b => {
      const bsx = b.x - scrollX;
      if (bsx < -30 || bsx > W + 30) return;
      const alpha = Math.min(1, b.life / 60);
      ctx.save();
      ctx.globalAlpha = alpha;
      // concentric arcs (sound waves going left)
      const dir = b.vx < 0 ? 0 : Math.PI; // open left or right
      [6, 12, 19].forEach((r, ri) => {
        ctx.strokeStyle = ri === 0 ? '#FF8C00' : ri === 1 ? '#FFA040' : 'rgba(255,170,60,0.5)';
        ctx.lineWidth = ri === 0 ? 2 : 1.5;
        ctx.beginPath();
        ctx.arc(bsx, b.y + 6, r, dir - Math.PI * 0.55, dir + Math.PI * 0.55);
        ctx.stroke();
      });
      // "WOOF!" tag
      ctx.fillStyle = '#FF8C00';
      ctx.font = 'bold 7px "Press Start 2P"';
      ctx.textAlign = b.vx < 0 ? 'right' : 'left';
      ctx.fillText('WOOF!', bsx + (b.vx < 0 ? -4 : 4), b.y - 2);
      ctx.restore();
    });
  }
}

// helper — leafy yard tree
function _hkTree(ctx, x, by, r, col1, col2) {
  ctx.fillStyle = '#5a3012';
  ctx.fillRect(x - 5, by - Math.round(r * 1.7), 10, Math.round(r * 1.6));
  ctx.fillStyle = col2;
  ctx.beginPath(); ctx.arc(x, by - Math.round(r * 1.9), Math.round(r * 1.1), 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = col1;
  ctx.beginPath(); ctx.arc(x - Math.round(r * 0.42), by - Math.round(r * 2.2), Math.round(r * 0.9), 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(x + Math.round(r * 0.42), by - Math.round(r * 2.1), Math.round(r * 0.85), 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(x, by - Math.round(r * 2.6), Math.round(r * 0.75), 0, Math.PI * 2); ctx.fill();
}

// helper — pixel art dog
function _hkDog(ctx, x, y, face, at) {
  const walk = Math.sin(at * 0.22) * 2.5;
  const lL = Math.round(walk), lR = -lL;
  ctx.save();
  if (face === -1) { ctx.translate(x + 28, 0); ctx.scale(-1, 1); ctx.translate(-x, 0); }
  // body
  ctx.fillStyle = '#9c6c20';
  ctx.fillRect(x,      y + 5,  19, 9);
  ctx.fillRect(x + 16, y + 2,  5,  7); // neck
  // head
  ctx.fillStyle = '#a87428';
  ctx.fillRect(x + 19, y - 2, 10, 9);
  // snout
  ctx.fillStyle = '#c89848';
  ctx.fillRect(x + 26, y + 2, 5, 4);
  // floppy ear
  ctx.fillStyle = '#7a4e14';
  ctx.fillRect(x + 19, y - 6, 5, 5);
  // eye
  ctx.fillStyle = '#1a1a1a';
  ctx.fillRect(x + 22, y + 1, 2, 2);
  // nose
  ctx.fillStyle = '#1a1a1a';
  ctx.fillRect(x + 29, y + 3, 2, 2);
  // wagging tail
  const wag = Math.sin(at * 0.38) * 5;
  ctx.fillStyle = '#9c6c20';
  ctx.fillRect(x - 6, y + 5 - Math.round(wag * 0.3), 7, 3);
  // legs
  ctx.fillStyle = '#7a4e14';
  ctx.fillRect(x + 3,  y + 14 + lL, 3, 5);
  ctx.fillRect(x + 9,  y + 14 + lR, 3, 5);
  ctx.fillRect(x + 14, y + 14 + lR, 3, 5);
  ctx.fillRect(x + 19, y + 14 + lL, 3, 5);
  ctx.restore();
}

// ── PUG FEST BOSS-DEAD CELEBRATION ────────────────────────────
function drawPugFestCelebration(ctx, engine, frame) {
  const stageH = 44;
  const stageY = GROUND - stageH;
  const scale = 3.2;

  // Night sky
  const sg = ctx.createLinearGradient(0, 0, 0, H);
  sg.addColorStop(0, '#060015'); sg.addColorStop(1, '#1a0535');
  ctx.fillStyle = sg; ctx.fillRect(0, 0, W, H);

  // Stars
  for (let i = 0; i < 70; i++) {
    const sx = (i * 137 + 50) % W;
    const sy = (i * 89) % (GROUND - 80);
    const blink = Math.sin(frame * 0.05 + i * 0.8) * 0.5 + 0.5;
    ctx.globalAlpha = 0.3 + blink * 0.7;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(sx, sy, 1, 1);
  }
  ctx.globalAlpha = 1;

  // Sweeping spotlights from sky
  const beamCols = ['rgba(255,80,255,0.07)','rgba(80,220,255,0.07)','rgba(255,220,40,0.06)','rgba(100,255,150,0.06)'];
  beamCols.forEach((col, i) => {
    const bx2 = W / 2 + Math.sin(frame * 0.018 + i * 1.6) * 260;
    ctx.save(); ctx.globalAlpha = 1; ctx.fillStyle = col;
    ctx.beginPath();
    ctx.moveTo(bx2, 0);
    ctx.lineTo(bx2 - 70, GROUND); ctx.lineTo(bx2 + 70, GROUND);
    ctx.closePath(); ctx.fill(); ctx.restore();
  });

  // Ground
  ctx.fillStyle = '#120824'; ctx.fillRect(0, GROUND, W, H - GROUND);
  ctx.fillStyle = '#1e0f38'; ctx.fillRect(0, GROUND - 3, W, 3);

  // ── Full-width stage platform ──
  ctx.fillStyle = '#1e0f2e';
  ctx.fillRect(0, stageY, W, stageH);
  ctx.fillStyle = '#2e1a48';
  ctx.fillRect(0, stageY + 2, W, stageH - 6);
  ctx.fillStyle = '#0e0018';
  ctx.fillRect(0, stageY + stageH - 4, W, 4);

  // Stage edge neon strip
  const neonGrad = ctx.createLinearGradient(0, 0, W, 0);
  neonGrad.addColorStop(0, '#ff44ff'); neonGrad.addColorStop(0.5, '#44aaff'); neonGrad.addColorStop(1, '#ff44ff');
  ctx.fillStyle = neonGrad;
  ctx.fillRect(0, stageY, W, 3);

  // ── Left scaffold tower ──
  ctx.fillStyle = '#1a1a1a';
  ctx.fillRect(8, 20, 14, stageY - 20);
  ctx.fillRect(26, 20, 14, stageY - 20);
  ctx.strokeStyle = '#2a2a2a'; ctx.lineWidth = 2;
  for (let y = 20; y < stageY; y += 24) {
    ctx.beginPath(); ctx.moveTo(8, y); ctx.lineTo(40, y + 24); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(40, y); ctx.lineTo(8, y + 24); ctx.stroke();
  }
  // Light bar left
  ctx.fillStyle = '#111'; ctx.fillRect(4, 14, 40, 10);
  ['#ff44ff','#44ffff','#ffff44','#ff4488','#44ff88'].forEach((c, i) => {
    ctx.fillStyle = c; ctx.fillRect(6 + i * 7, 15, 5, 8);
    ctx.save(); ctx.globalAlpha = 0.14; ctx.fillStyle = c;
    ctx.beginPath();
    ctx.moveTo(8 + i * 7, 23); ctx.lineTo(8 + i * 7 - 40, stageY); ctx.lineTo(8 + i * 7 + 30, stageY);
    ctx.closePath(); ctx.fill(); ctx.restore();
  });

  // ── Right scaffold tower ──
  ctx.fillStyle = '#1a1a1a';
  ctx.fillRect(W - 40, 20, 14, stageY - 20);
  ctx.fillRect(W - 22, 20, 14, stageY - 20);
  ctx.strokeStyle = '#2a2a2a'; ctx.lineWidth = 2;
  for (let y = 20; y < stageY; y += 24) {
    ctx.beginPath(); ctx.moveTo(W - 40, y); ctx.lineTo(W - 8, y + 24); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(W - 8, y); ctx.lineTo(W - 40, y + 24); ctx.stroke();
  }
  ctx.fillStyle = '#111'; ctx.fillRect(W - 44, 14, 40, 10);
  ['#44ffff','#ff44ff','#ff8800','#44ff88','#aa44ff'].forEach((c, i) => {
    ctx.fillStyle = c; ctx.fillRect(W - 42 + i * 7, 15, 5, 8);
    ctx.save(); ctx.globalAlpha = 0.14; ctx.fillStyle = c;
    ctx.beginPath();
    ctx.moveTo(W - 40 + i * 7, 23); ctx.lineTo(W - 40 + i * 7 - 30, stageY); ctx.lineTo(W - 40 + i * 7 + 40, stageY);
    ctx.closePath(); ctx.fill(); ctx.restore();
  });

  // ── Top truss connecting towers ──
  ctx.fillStyle = '#111'; ctx.fillRect(48, 18, W - 96, 8);
  ctx.strokeStyle = '#222'; ctx.lineWidth = 1;
  for (let x = 0; x < W - 96; x += 14) {
    ctx.beginPath(); ctx.moveTo(48 + x, 18); ctx.lineTo(48 + x + 7, 26); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(48 + x + 7, 18); ctx.lineTo(48 + x, 26); ctx.stroke();
  }

  // ── BIG PugFest banner behind band ──
  const bannerW = 460, bannerH = 220;
  const bannerX = W / 2 - bannerW / 2;
  const bannerTop = stageY - bannerH - 6;
  const textStripH = 30;
  const imgAreaH = bannerH - textStripH;

  // Banner frame
  ctx.fillStyle = '#0a000e';
  ctx.fillRect(bannerX - 4, bannerTop - 4, bannerW + 8, bannerH + 8);
  ctx.fillStyle = '#111';
  ctx.fillRect(bannerX, bannerTop, bannerW, bannerH);

  // TC logo as main backdrop behind the band
  if (_tcImg.complete && _tcImg.naturalWidth > 0) {
    const aspect = _tcImg.naturalWidth / _tcImg.naturalHeight;
    let dw = bannerW, dh = bannerW / aspect;
    if (dh > imgAreaH) { dh = imgAreaH; dw = imgAreaH * aspect; }
    const dx = bannerX + (bannerW - dw) / 2;
    const dy = bannerTop + (imgAreaH - dh) / 2;
    ctx.drawImage(_tcImg, dx, dy, dw, dh);
  } else if (_pugImg.complete && _pugImg.naturalWidth > 0) {
    // fallback to pugfest banner if TC image not yet loaded
    const aspect = _pugImg.naturalWidth / _pugImg.naturalHeight;
    let dw = bannerW, dh = bannerW / aspect;
    if (dh > imgAreaH) { dh = imgAreaH; dw = imgAreaH * aspect; }
    const dx = bannerX + (bannerW - dw) / 2;
    const dy = bannerTop + (imgAreaH - dh) / 2;
    ctx.drawImage(_pugImg, dx, dy, dw, dh);
  }

  // Text strip
  const textY = bannerTop + imgAreaH;
  ctx.fillStyle = '#f5e050';
  ctx.fillRect(bannerX, textY, bannerW, textStripH);
  ctx.textAlign = 'center';
  ctx.fillStyle = '#7a3a00'; ctx.font = 'bold 17px Arial Black, Arial';
  ctx.fillText('PUG FEST', W / 2 + 1, textY + textStripH - 7);
  ctx.fillStyle = '#44ccee';
  ctx.fillText('PUG FEST', W / 2, textY + textStripH - 8);

  // Banner border & bulb lights
  ctx.strokeStyle = '#aa8800'; ctx.lineWidth = 2;
  ctx.strokeRect(bannerX, bannerTop, bannerW, bannerH);
  const bulbCols = ['#ff4444','#ffcc00','#44ff88','#44aaff','#ff44ff'];
  for (let i = 0; i <= 12; i++) {
    const bx2 = bannerX + i * (bannerW / 12);
    ctx.fillStyle = bulbCols[i % bulbCols.length];
    ctx.beginPath(); ctx.arc(bx2, bannerTop, 3, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(bx2, bannerTop + bannerH, 3, 0, Math.PI * 2); ctx.fill();
  }

  // Character feet land on stage surface
  // drawCharPreview: feet at cy + 24*scale
  // Want feet at stageY → cy = stageY - 24*scale
  const charY = stageY - 24 * scale;

  // ── Amps behind Steve (left/stage-right) and Kyle (right/stage-left) ──
  // Drawn first so chars appear in front
  drawAmp(ctx, 54, stageY - 60, 46, 62);       // amp behind Steve (left)
  drawAmp(ctx, W - 102, stageY - 60, 46, 62);  // amp behind Kyle (right)

  // ── Mike center-back on drums ──
  const mikeCX = W / 2;
  const kitS = 2.0; // drum kit scale for celebration
  const kitX = mikeCX - 44 * kitS; // center the kit around Mike
  // Draw Mike first (behind drums)
  const mikeY = charY - 8 + Math.sin(frame * 0.15) * 2;
  drawCharPreview(ctx, 1, mikeCX, mikeY, scale);
  // Draw kit on top so Mike appears seated behind it
  drawDrumKit(ctx, kitX, stageY, frame, kitS);
  // Drum sticks (in front of kit)
  const stickA = Math.sin(frame * 0.28) * 0.9;
  ctx.strokeStyle = '#c8a060'; ctx.lineWidth = 3;
  ctx.save(); ctx.translate(mikeCX - 16, mikeY + 10 * scale);
  ctx.rotate(-0.6 + stickA);
  ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, 26); ctx.stroke();
  ctx.restore();
  ctx.save(); ctx.translate(mikeCX + 12, mikeY + 10 * scale);
  ctx.rotate(0.6 - stickA);
  ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, 26); ctx.stroke();
  ctx.restore();

  // ── Steve stage-right (left of screen, charIdx=0) on bass ──
  const steveCX = 120;
  const steveY = charY + Math.sin(frame * 0.12) * 3;
  drawCharPreview(ctx, 0, steveCX, steveY, scale);
  // Bass at mid-body height, fixed instrument scale so neck stays on-screen
  drawBassGuitar(ctx, steveCX + 38, stageY - 55, 2.2);

  // ── Kyle stage-left (right of screen, charIdx=2) on guitar ──
  const kyleCX = W - 120;
  const kyleY = charY + Math.sin(frame * 0.12 + 1.1) * 3;
  drawCharPreview(ctx, 2, kyleCX, kyleY, scale);
  // Guitar neck points left (toward center), body toward right edge
  drawElectricGuitar(ctx, kyleCX + 12, stageY - 55, 2.2);

  // ── Floating musical notes ──
  const notes = ['♪', '♫', '♩', '♬'];
  for (let i = 0; i < 8; i++) {
    const nx = 80 + i * 90 + Math.sin(frame * 0.04 + i) * 14;
    const ny = stageY - 70 - ((frame * 0.7 + i * 30) % 100);
    ctx.globalAlpha = 0.8 - ((frame * 0.7 + i * 30) % 100) / 100 * 0.8;
    ctx.fillStyle = ['#ff88ff','#88ffff',GLD,'#88ff88'][i % 4];
    ctx.font = '16px serif'; ctx.textAlign = 'center';
    ctx.fillText(notes[i % notes.length], nx, ny);
  }
  ctx.globalAlpha = 1;

  // ── "RECORD EXEC DEFEATED!" flash banner ──
  if (Math.floor(frame / 18) % 2 === 0) {
    ctx.fillStyle = 'rgba(0,0,0,0.6)';
    ctx.fillRect(W / 2 - 190, 10, 380, 38);
    ctx.strokeStyle = GLD; ctx.lineWidth = 2;
    ctx.strokeRect(W / 2 - 190, 10, 380, 38);
    ctx.fillStyle = GLD; ctx.font = '13px "Press Start 2P"'; ctx.textAlign = 'center';
    ctx.fillText('RECORD EXEC DEFEATED!', W / 2, 35);
  }
}

// Instrument drawing helpers
function drawBassGuitar(ctx, x, y, sc) {
  const s = sc || 1;
  // Body
  ctx.fillStyle = '#8B1a1a';
  ctx.fillRect(x - 20*s, y - 5*s, 28*s, 10*s);
  ctx.fillStyle = '#aa2222';
  ctx.fillRect(x - 19*s, y - 4*s, 26*s, 3*s);
  // Neck
  ctx.fillStyle = '#6B4C2A';
  ctx.fillRect(x - 42*s, y - 3*s, 24*s, 5*s);
  // Headstock
  ctx.fillStyle = '#5a3a18';
  ctx.fillRect(x - 48*s, y - 5*s, 8*s, 8*s);
  // Strings
  ctx.strokeStyle = '#cccccc'; ctx.lineWidth = Math.max(0.5, s * 0.5);
  [0, 2, 4].forEach(oy => {
    ctx.beginPath(); ctx.moveTo(x - 48*s, y - 2*s + oy*s); ctx.lineTo(x + 8*s, y - 2*s + oy*s); ctx.stroke();
  });
  ctx.fillStyle = '#111'; ctx.fillRect(x - 8*s, y - 4*s, 8*s, 8*s);
}

function drawElectricGuitar(ctx, x, y, sc) {
  const s = sc || 1;
  // Body
  ctx.fillStyle = '#1a3a6B';
  ctx.fillRect(x - 16*s, y - 6*s, 24*s, 12*s);
  ctx.fillStyle = '#2244aa';
  ctx.fillRect(x - 15*s, y - 5*s, 22*s, 4*s);
  // Neck
  ctx.fillStyle = '#8B6914';
  ctx.fillRect(x - 36*s, y - 3*s, 22*s, 5*s);
  ctx.fillStyle = '#6B4C2A';
  ctx.fillRect(x - 42*s, y - 5*s, 8*s, 8*s);
  // Strings
  ctx.strokeStyle = '#dddddd'; ctx.lineWidth = Math.max(0.5, s * 0.5);
  [0, 2, 4].forEach(oy => {
    ctx.beginPath(); ctx.moveTo(x - 42*s, y - 1*s + oy*s); ctx.lineTo(x + 8*s, y - 1*s + oy*s); ctx.stroke();
  });
  ctx.fillStyle = '#111'; ctx.fillRect(x - 6*s, y - 4*s, 6*s, 8*s);
}

function drawAmp(ctx, x, y, w, h) {
  // Amp cabinet
  ctx.fillStyle = '#111';
  ctx.fillRect(x, y, w, h);
  ctx.fillStyle = '#1e1e1e';
  ctx.fillRect(x + 2, y + 2, w - 4, h - 4);
  // Speaker grille
  ctx.fillStyle = '#161616';
  ctx.fillRect(x + 4, y + 4, w - 8, h - 16);
  ctx.strokeStyle = '#252525'; ctx.lineWidth = 1;
  for (let gy = 0; gy < h - 16; gy += 5) ctx.strokeRect(x + 4, y + 4 + gy, w - 8, 3);
  // Speaker cone
  ctx.fillStyle = '#2a2a2a';
  ctx.beginPath(); ctx.ellipse(x + w/2, y + (h-16)/2 + 4, (w-12)/2, (h-24)/2, 0, 0, Math.PI*2); ctx.fill();
  ctx.fillStyle = '#111';
  ctx.beginPath(); ctx.ellipse(x + w/2, y + (h-16)/2 + 4, (w-22)/2, (h-36)/2, 0, 0, Math.PI*2); ctx.fill();
  // Control knobs at bottom
  ctx.fillStyle = '#333';
  ctx.fillRect(x + 4, y + h - 10, w - 8, 6);
  [0.25, 0.5, 0.75].forEach(t => {
    ctx.fillStyle = '#555';
    ctx.beginPath(); ctx.arc(x + w * t, y + h - 7, 2, 0, Math.PI*2); ctx.fill();
  });
}

function drawDrumKit(ctx, x, y, frame, kitScale) {
  const s = kitScale || 1.4;
  const f = frame || 0;

  // ── Bass drum (kick) — large round drum lying on its side ──
  // Sits on stage floor; front face visible
  ctx.fillStyle = '#1a0830';
  ctx.beginPath(); ctx.ellipse(x + 22*s, y - 18*s, 22*s, 18*s, 0, 0, Math.PI*2); ctx.fill();
  // Bass drum shell ring
  ctx.strokeStyle = '#9944ee'; ctx.lineWidth = 2.5;
  ctx.beginPath(); ctx.ellipse(x + 22*s, y - 18*s, 22*s, 18*s, 0, 0, Math.PI*2); ctx.stroke();
  // Bass drum head (front face)
  ctx.fillStyle = '#281040';
  ctx.beginPath(); ctx.ellipse(x + 22*s, y - 18*s, 17*s, 13*s, 0, 0, Math.PI*2); ctx.fill();
  // Bass drum logo star detail
  ctx.fillStyle = '#6633cc';
  ctx.beginPath(); ctx.arc(x + 22*s, y - 18*s, 5*s, 0, Math.PI*2); ctx.fill();
  ctx.fillStyle = '#8844ff';
  ctx.beginPath(); ctx.arc(x + 22*s, y - 18*s, 2.5*s, 0, Math.PI*2); ctx.fill();
  // Bass drum spur legs
  ctx.strokeStyle = '#555'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(x + 6*s, y - 2*s); ctx.lineTo(x + 4*s, y); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(x + 38*s, y - 2*s); ctx.lineTo(x + 40*s, y); ctx.stroke();

  // ── Floor tom (right side, lower) ──
  ctx.fillStyle = '#1a0830';
  ctx.beginPath(); ctx.ellipse(x + 52*s, y - 14*s, 13*s, 10*s, 0, 0, Math.PI*2); ctx.fill();
  ctx.strokeStyle = '#7733bb'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.ellipse(x + 52*s, y - 14*s, 13*s, 10*s, 0, 0, Math.PI*2); ctx.stroke();
  ctx.fillStyle = '#2a1050';
  ctx.beginPath(); ctx.ellipse(x + 52*s, y - 14*s, 9*s, 7*s, 0, 0, Math.PI*2); ctx.fill();
  // Floor tom legs
  ctx.strokeStyle = '#444'; ctx.lineWidth = 1.5;
  [[x+44*s, y-6*s, x+43*s, y],[x+60*s, y-6*s, x+61*s, y]].forEach(([x1,y1,x2,y2]) => {
    ctx.beginPath(); ctx.moveTo(x1,y1); ctx.lineTo(x2,y2); ctx.stroke();
  });

  // ── Rack tom (mounted above kick drum) ──
  ctx.fillStyle = '#1a0830';
  ctx.beginPath(); ctx.ellipse(x + 10*s, y - 42*s, 11*s, 8*s, 0, 0, Math.PI*2); ctx.fill();
  ctx.strokeStyle = '#8844ee'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.ellipse(x + 10*s, y - 42*s, 11*s, 8*s, 0, 0, Math.PI*2); ctx.stroke();
  ctx.fillStyle = '#28104a';
  ctx.beginPath(); ctx.ellipse(x + 10*s, y - 42*s, 7.5*s, 5.5*s, 0, 0, Math.PI*2); ctx.fill();
  // Rack tom mount rod
  ctx.strokeStyle = '#666'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(x + 10*s, y - 36*s); ctx.lineTo(x + 18*s, y - 28*s); ctx.stroke();

  // ── Snare drum (front-left on stand) ──
  const snareX = x - 6*s, snareY = y - 38*s;
  // Stand legs
  ctx.strokeStyle = '#555'; ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.moveTo(snareX + 7*s, snareY + 7*s); ctx.lineTo(snareX + 3*s, y); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(snareX + 7*s, snareY + 7*s); ctx.lineTo(snareX + 11*s, y); ctx.stroke();
  // Drum body
  ctx.fillStyle = '#2a1010';
  ctx.beginPath(); ctx.ellipse(snareX + 8*s, snareY + 4*s, 10*s, 7*s, 0, 0, Math.PI*2); ctx.fill();
  ctx.strokeStyle = '#cc3333'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.ellipse(snareX + 8*s, snareY + 4*s, 10*s, 7*s, 0, 0, Math.PI*2); ctx.stroke();
  // Snare head
  ctx.fillStyle = '#e8e0d0';
  ctx.beginPath(); ctx.ellipse(snareX + 8*s, snareY, 10*s, 6*s, 0, 0, Math.PI*2); ctx.fill();
  ctx.strokeStyle = '#cc3333'; ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.ellipse(snareX + 8*s, snareY, 10*s, 6*s, 0, 0, Math.PI*2); ctx.stroke();

  // ── Hi-hat (left stand) ──
  const hhX = x - 16*s, hhY = y - 58*s;
  // Stand pole
  ctx.strokeStyle = '#666'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(hhX + 4*s, hhY + 12*s); ctx.lineTo(hhX + 4*s, y); ctx.stroke();
  // Stand feet
  ctx.beginPath(); ctx.moveTo(hhX + 4*s, y); ctx.lineTo(hhX - 4*s, y + 2*s); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(hhX + 4*s, y); ctx.lineTo(hhX + 12*s, y + 2*s); ctx.stroke();
  // Bottom cymbal (thicker)
  ctx.fillStyle = '#c8a000';
  ctx.beginPath(); ctx.ellipse(hhX + 4*s, hhY + 10*s, 14*s, 3.5*s, 0, 0, Math.PI*2); ctx.fill();
  // Top cymbal (thin, slightly open)
  const hhTilt = Math.sin(f * 0.18) * 0.08;
  ctx.save(); ctx.translate(hhX + 4*s, hhY + 6*s); ctx.rotate(hhTilt);
  ctx.fillStyle = '#e0b800';
  ctx.beginPath(); ctx.ellipse(0, 0, 14*s, 3*s, 0, 0, Math.PI*2); ctx.fill();
  ctx.strokeStyle = '#a08000'; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.ellipse(0, 0, 14*s, 3*s, 0, 0, Math.PI*2); ctx.stroke();
  ctx.restore();

  // ── Crash cymbal (right, angled) ──
  const crX = x + 62*s, crY = y - 60*s;
  ctx.strokeStyle = '#666'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(crX, crY + 14*s); ctx.lineTo(crX, y); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(crX, y); ctx.lineTo(crX - 8*s, y + 2*s); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(crX, y); ctx.lineTo(crX + 8*s, y + 2*s); ctx.stroke();
  const ct = Math.sin(f * 0.2) * 0.15;
  ctx.save(); ctx.translate(crX, crY + 8*s); ctx.rotate(-0.2 + ct);
  ctx.fillStyle = '#c8a000';
  ctx.beginPath(); ctx.ellipse(0, 0, 18*s, 4*s, 0, 0, Math.PI*2); ctx.fill();
  ctx.strokeStyle = '#a08000'; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.ellipse(0, 0, 18*s, 4*s, 0, 0, Math.PI*2); ctx.stroke();
  ctx.restore();

  // ── Bass drum pedal ──
  ctx.fillStyle = '#333';
  ctx.fillRect(x + 14*s, y - 3*s, 12*s, 4*s);
  ctx.strokeStyle = '#555'; ctx.lineWidth = 1;
  ctx.strokeRect(x + 14*s, y - 3*s, 12*s, 4*s);
}

// ── PUG FEST CONCERT STAGE (Ferndale ~25%) ─────────────────────
function drawPugFest(ctx, bx) {
  const bw = 280, stageH = 30, towerH = 175, bannerH = 110, bannerW = 210;
  const by = GROUND;
  const cx = bx + bw / 2;

  // ── ground shadow / festival footprint ──
  ctx.fillStyle = 'rgba(0,0,0,0.35)';
  ctx.fillRect(bx - 4, by - 2, bw + 8, 6);

  // ── stage floor platform ──
  ctx.fillStyle = '#2a1a3a';
  ctx.fillRect(bx, by - stageH, bw, stageH);
  ctx.fillStyle = '#3d2655';
  ctx.fillRect(bx + 2, by - stageH + 2, bw - 4, stageH - 6);
  // stage front lip
  ctx.fillStyle = '#1a0d28';
  ctx.fillRect(bx, by - 6, bw, 6);

  // ── left scaffolding tower ──
  ctx.fillStyle = '#222';
  ctx.fillRect(bx + 4, by - towerH, 14, towerH - stageH);
  ctx.fillRect(bx + 20, by - towerH, 14, towerH - stageH);
  // cross braces
  ctx.strokeStyle = '#333'; ctx.lineWidth = 2;
  for (let y = 0; y < towerH - stageH; y += 22) {
    ctx.beginPath(); ctx.moveTo(bx + 4, by - towerH + y); ctx.lineTo(bx + 34, by - towerH + y + 22); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(bx + 34, by - towerH + y); ctx.lineTo(bx + 4, by - towerH + y + 22); ctx.stroke();
  }
  // top light bar — left
  ctx.fillStyle = '#111';
  ctx.fillRect(bx + 2, by - towerH - 8, 36, 10);
  // spotlights left (4 cans)
  const lLights = ['#ff44ff','#44ffff','#ffff44','#ff4488'];
  lLights.forEach((col, i) => {
    ctx.fillStyle = col;
    ctx.fillRect(bx + 4 + i * 8, by - towerH - 7, 6, 8);
    // light beam cone
    ctx.fillStyle = col.replace(')', ',0.07)').replace('rgb','rgba').replace('#', 'rgba(').replace('rgba(', 'rgba(');
    ctx.save();
    ctx.globalAlpha = 0.13;
    ctx.fillStyle = col;
    ctx.beginPath();
    ctx.moveTo(bx + 7 + i * 8, by - towerH - 2);
    ctx.lineTo(bx + 7 + i * 8 - 30, by - stageH);
    ctx.lineTo(bx + 7 + i * 8 + 20, by - stageH);
    ctx.closePath(); ctx.fill();
    ctx.restore();
  });

  // ── right scaffolding tower ──
  ctx.fillStyle = '#222';
  ctx.fillRect(bx + bw - 34, by - towerH, 14, towerH - stageH);
  ctx.fillRect(bx + bw - 18, by - towerH, 14, towerH - stageH);
  ctx.strokeStyle = '#333'; ctx.lineWidth = 2;
  for (let y = 0; y < towerH - stageH; y += 22) {
    ctx.beginPath(); ctx.moveTo(bx + bw - 34, by - towerH + y); ctx.lineTo(bx + bw - 4, by - towerH + y + 22); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(bx + bw - 4, by - towerH + y); ctx.lineTo(bx + bw - 34, by - towerH + y + 22); ctx.stroke();
  }
  // top light bar — right
  ctx.fillStyle = '#111';
  ctx.fillRect(bx + bw - 38, by - towerH - 8, 36, 10);
  const rLights = ['#44ffff','#ff44ff','#ff8800','#44ff88'];
  rLights.forEach((col, i) => {
    ctx.fillStyle = col;
    ctx.fillRect(bx + bw - 36 + i * 8, by - towerH - 7, 6, 8);
    ctx.save();
    ctx.globalAlpha = 0.13;
    ctx.fillStyle = col;
    ctx.beginPath();
    ctx.moveTo(bx + bw - 33 + i * 8, by - towerH - 2);
    ctx.lineTo(bx + bw - 33 + i * 8 - 20, by - stageH);
    ctx.lineTo(bx + bw - 33 + i * 8 + 30, by - stageH);
    ctx.closePath(); ctx.fill();
    ctx.restore();
  });

  // ── truss bar connecting towers across top ──
  ctx.fillStyle = '#1a1a1a';
  ctx.fillRect(bx + 38, by - towerH - 4, bw - 76, 8);
  ctx.strokeStyle = '#2a2a2a'; ctx.lineWidth = 1;
  for (let x = 0; x < bw - 76; x += 12) {
    ctx.beginPath(); ctx.moveTo(bx + 38 + x, by - towerH - 4); ctx.lineTo(bx + 38 + x + 6, by - towerH + 4); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(bx + 38 + x + 6, by - towerH - 4); ctx.lineTo(bx + 38 + x, by - towerH + 4); ctx.stroke();
  }

  // ── big PUG FEST banner / backdrop ──
  const bannerX = cx - bannerW / 2;
  const textH = 26; // height reserved below image for "PUG FEST" text
  const imgH = bannerH - textH;
  const bannerTop = by - stageH - bannerH;
  // banner frame
  ctx.fillStyle = '#0d0010';
  ctx.fillRect(bannerX - 3, bannerTop - 3, bannerW + 6, bannerH + 6);
  // banner background — dark behind image
  ctx.fillStyle = '#111';
  ctx.fillRect(bannerX, bannerTop, bannerW, bannerH);

  // ── draw actual pugfest-banner.png image ──
  if (_pugImg.complete && _pugImg.naturalWidth > 0) {
    // draw image fitted into the image area, centered
    const aspect = _pugImg.naturalWidth / _pugImg.naturalHeight;
    let dw = bannerW, dh = bannerW / aspect;
    if (dh > imgH) { dh = imgH; dw = imgH * aspect; }
    const dx = bannerX + (bannerW - dw) / 2;
    const dy = bannerTop + (imgH - dh) / 2;
    ctx.drawImage(_pugImg, dx, dy, dw, dh);
  }

  // ── "PUG FEST" text strip below image — poster cyan block style ──
  const textY = bannerTop + imgH;
  ctx.fillStyle = '#f5e050';
  ctx.fillRect(bannerX, textY, bannerW, textH);
  ctx.textAlign = 'center';
  // shadow
  ctx.fillStyle = '#7a3a00';
  ctx.font = 'bold 15px Arial Black, Arial';
  ctx.letterSpacing = '2px';
  ctx.fillText('PUG FEST', cx + 1, textY + textH - 7);
  // main cyan text
  ctx.fillStyle = '#44ccee';
  ctx.fillText('PUG FEST', cx, textY + textH - 8);
  ctx.letterSpacing = '0px';

  // banner border
  ctx.strokeStyle = '#aa8800'; ctx.lineWidth = 2;
  ctx.strokeRect(bannerX, bannerTop, bannerW, bannerH);
  // festival bulb lights along banner edge
  const bulbCols = ['#ff4444','#ffcc00','#44ff88','#44aaff','#ff44ff'];
  for (let i = 0; i <= 10; i++) {
    const bx2 = bannerX + i * (bannerW / 10);
    ctx.fillStyle = bulbCols[i % bulbCols.length];
    ctx.beginPath(); ctx.arc(bx2, bannerTop, 3, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(bx2, bannerTop + bannerH, 3, 0, Math.PI * 2); ctx.fill();
  }

  // ── speakers on stage sides ──
  [[bx + 38, by - stageH - 50, 28, 52], [bx + bw - 66, by - stageH - 50, 28, 52]].forEach(([sx, sy, sw, sh]) => {
    ctx.fillStyle = '#111';
    ctx.fillRect(sx, sy, sw, sh);
    ctx.fillStyle = '#1e1e1e';
    ctx.fillRect(sx + 2, sy + 2, sw - 4, sh - 4);
    // speaker cones
    [[sy + 8, 10], [sy + 24, 10], [sy + 40, 8]].forEach(([ky, kr]) => {
      ctx.fillStyle = '#333';
      ctx.beginPath(); ctx.arc(sx + sw / 2, ky, kr, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#222';
      ctx.beginPath(); ctx.arc(sx + sw / 2, ky, kr * 0.5, 0, Math.PI * 2); ctx.fill();
    });
    // speaker grille lines
    ctx.strokeStyle = '#2a2a2a'; ctx.lineWidth = 1;
    for (let gl = 0; gl < sh - 4; gl += 4) ctx.strokeRect(sx + 2, sy + 2 + gl, sw - 4, 2);
  });

  // ── crowd silhouettes on stage ──
  ctx.fillStyle = '#1a0828';
  const crowdHeads = [20, 45, 70, 95, 120, 145, 170, 195, 220, 245];
  crowdHeads.forEach(hx => {
    const hOff = Math.sin(hx * 0.8) * 3;
    ctx.beginPath(); ctx.arc(bx + hx, by - stageH - 2 + hOff, 5, Math.PI, 0); ctx.fill();
    ctx.fillRect(bx + hx - 4, by - stageH - 2 + hOff, 8, 6);
  });

}

// ── COMO'S PIZZA (Ferndale ~50%) ───────────────────────────────
function drawComos(ctx, bx) {
  const bw = 225, bh = 120, storeH = 42;
  const by = GROUND;
  const upperH = bh - storeH;

  // orange-red brick upper wall
  ctx.fillStyle = '#c04418';
  ctx.fillRect(bx, by - bh, bw, upperH);
  ctx.fillStyle = 'rgba(0,0,0,0.15)';
  for (let y = 8; y < upperH; y += 9) ctx.fillRect(bx, by - bh + y, bw, 1);
  for (let row = 0; row < Math.floor(upperH / 9); row++) {
    const xOff = (row % 2) * 16;
    for (let x = xOff; x < bw; x += 32) ctx.fillRect(bx + x, by - bh + row * 9, 1, 9);
  }
  // "COMOS" raised letter effect (big embossed letters on brick)
  ctx.fillStyle = 'rgba(0,0,0,0.22)';
  ctx.font = 'bold 22px "Press Start 2P"'; ctx.textAlign = 'center';
  ctx.fillText('COMOS', bx + bw / 2, by - storeH - 12);
  ctx.fillStyle = 'rgba(255,255,255,0.08)';
  ctx.fillText('COMOS', bx + bw / 2 - 1, by - storeH - 13);

  // neon sign on a pole — "Como's" in a yellow box with red star
  const signX = bx + bw / 2 - 55, signY = by - bh - 52;
  // pole
  ctx.fillStyle = '#555';
  ctx.fillRect(bx + bw / 2 - 2, signY + 10, 4, bh + 52);
  // sign frame — yellow
  ctx.fillStyle = '#d4a800';
  ctx.fillRect(signX, signY, 110, 52);
  ctx.fillStyle = '#f0c000';
  ctx.fillRect(signX + 2, signY + 2, 106, 48);
  // red star at top
  ctx.fillStyle = '#cc1111';
  ctx.fillRect(signX + 47, signY - 10, 16, 14);
  ctx.fillRect(signX + 43, signY - 6, 24, 6);
  // "Como's" script-ish text
  ctx.fillStyle = '#cc2244';
  ctx.font = '11px "Press Start 2P"'; ctx.textAlign = 'center';
  ctx.fillText("Como's", signX + 55, signY + 24);
  ctx.fillStyle = '#1a1a88';
  ctx.font = '6px "Press Start 2P"';
  ctx.fillText('Restaurant', signX + 55, signY + 36);
  // yellow sign border lines
  ctx.strokeStyle = '#888800'; ctx.lineWidth = 1;
  ctx.strokeRect(signX + 4, signY + 4, 102, 44);

  // lower storefront — warm tan/wood
  ctx.fillStyle = '#8b5a20';
  ctx.fillRect(bx, by - storeH, bw, storeH);
  // wood panel texture
  ctx.fillStyle = 'rgba(0,0,0,0.12)';
  for (let y = 10; y < storeH; y += 10) ctx.fillRect(bx, by - storeH + y, bw, 1);

  // three windows + center door (ground level)
  [8, 76, 152].forEach((wx, i) => {
    const iw = i === 1 ? 32 : 56;
    ctx.fillStyle = i === 1 ? '#3a2010' : '#0a1820';
    ctx.fillRect(bx + wx, by - storeH + 4, iw, storeH - 4);
    ctx.fillStyle = i === 1 ? 'rgba(180,100,30,0.3)' : 'rgba(80,140,200,0.2)';
    ctx.fillRect(bx + wx + 2, by - storeH + 6, iw - 4, storeH - 8);
    ctx.strokeStyle = '#5a3a10'; ctx.lineWidth = 1;
    ctx.strokeRect(bx + wx, by - storeH + 4, iw, storeH - 4);
  });

  // roof cap
  ctx.fillStyle = '#1a1a1a';
  ctx.fillRect(bx - 2, by - bh - 4, bw + 4, 5);
}

// ── DANNY'S IRISH PUB (Ferndale ~75%) ──────────────────────────
function drawDannys(ctx, bx) {
  const bw = 185, bh = 100, storeH = 44;
  const by = GROUND;

  // stone/rock facade — gray with variation
  ctx.fillStyle = '#6a6a6a';
  ctx.fillRect(bx, by - bh, bw, bh - storeH);
  // stone block texture
  const stoneColors = ['#787878','#6a6a6a','#727272','#686868'];
  for (let row = 0; row < 6; row++) {
    for (let col = 0; col < 5; col++) {
      const xOff = (row % 2) * 18;
      ctx.fillStyle = stoneColors[(row + col) % stoneColors.length];
      ctx.fillRect(bx + col * 37 + xOff, by - bh + row * 10, 35, 9);
      ctx.fillStyle = 'rgba(0,0,0,0.2)';
      ctx.fillRect(bx + col * 37 + xOff, by - bh + row * 10 + 8, 35, 1);
      ctx.fillRect(bx + col * 37 + xOff + 35, by - bh + row * 10, 1, 10);
    }
  }

  // GREEN sign — "Danny's Irish Pub"
  const sy = by - bh + 4, sw = bw - 10, sx2 = bx + 5;
  ctx.fillStyle = '#0a3a0a';
  ctx.fillRect(sx2, sy, sw, 30);
  ctx.shadowBlur = 6; ctx.shadowColor = '#00cc00';
  ctx.strokeStyle = '#0a8a0a'; ctx.lineWidth = 2;
  ctx.strokeRect(sx2 + 1, sy + 1, sw - 2, 28);
  ctx.shadowBlur = 0;
  // shamrock pixel art
  ctx.fillStyle = '#00aa00';
  [[0,1],[1,0],[1,2],[2,1],[1,1]].forEach(([px,py]) => ctx.fillRect(sx2 + 8 + px * 4, sy + 8 + py * 4, 4, 4));
  ctx.fillRect(sx2 + 12, sy + 20, 4, 8);
  // text
  ctx.fillStyle = '#00ee00';
  ctx.font = '7px "Press Start 2P"'; ctx.textAlign = 'center';
  ctx.fillText("Danny's", sx2 + sw / 2 + 8, sy + 14);
  ctx.fillStyle = '#00aa00';
  ctx.font = '5px "Press Start 2P"';
  ctx.fillText('IRISH PUB', sx2 + sw / 2 + 8, sy + 24);

  // storefront — dark
  ctx.fillStyle = '#1a1a1a';
  ctx.fillRect(bx, by - storeH, bw, storeH);

  // rainbow flag in window (left window)
  const fw = 40, fh = 24, fx = bx + 12, fy = by - storeH + 10;
  const rainbowCols = ['#e40303','#ff8c00','#ffed00','#008026','#004dff','#750787'];
  rainbowCols.forEach((c, i) => {
    ctx.fillStyle = c;
    ctx.fillRect(fx, fy + i * 4, fw, 4);
  });
  ctx.strokeStyle = '#444'; ctx.lineWidth = 1;
  ctx.strokeRect(fx, fy, fw, fh);

  // right window
  ctx.fillStyle = '#0a1020';
  ctx.fillRect(bx + bw - 58, by - storeH + 8, 50, 28);
  ctx.fillStyle = 'rgba(80,140,200,0.2)';
  ctx.fillRect(bx + bw - 56, by - storeH + 10, 46, 24);

  // center door
  const dx = Math.floor((bw - 32) / 2);
  ctx.fillStyle = '#1a3a10';
  ctx.fillRect(bx + dx, by - storeH + 6, 32, 38);
  ctx.strokeStyle = '#0a5a0a'; ctx.lineWidth = 2;
  ctx.strokeRect(bx + dx + 2, by - storeH + 8, 28, 34);

  // roof cap
  ctx.fillStyle = '#1a1a1a';
  ctx.fillRect(bx - 2, by - bh - 4, bw + 4, 5);
}

// ── FERNDALE CAR (obstacle) ────────────────────────────────────
function drawFerndaleCar(ctx, car, scrollX, frame) {
  const cx = car.x - scrollX;
  if (cx > W + 80 || cx + car.w < -80) return;
  const cy = car.y;

  // car body — dark purple/pink neon Ferndale aesthetic
  ctx.fillStyle = '#2a0a3a';
  ctx.fillRect(cx, cy + 6, car.w, car.h - 6);
  // roof
  ctx.fillStyle = '#3a1050';
  ctx.fillRect(cx + 10, cy, car.w - 20, 10);
  // neon undercarriage glow
  ctx.fillStyle = 'rgba(200,50,255,0.25)';
  ctx.fillRect(cx + 4, cy + car.h - 2, car.w - 8, 4);
  // windshields
  ctx.fillStyle = '#7ac8e0';
  ctx.fillRect(cx + 12, cy + 2, 16, 7);
  ctx.fillRect(cx + car.w - 28, cy + 2, 16, 7);
  // headlights (front = left, going left)
  ctx.fillStyle = '#ffffc0';
  ctx.fillRect(cx, cy + 9, 5, 5);
  // tail lights
  ctx.fillStyle = '#ff2222';
  ctx.fillRect(cx + car.w - 5, cy + 9, 5, 5);
  // neon stripe along side
  ctx.fillStyle = 'rgba(180,40,255,0.7)';
  ctx.fillRect(cx + 4, cy + 14, car.w - 8, 2);
  // wheels
  ctx.fillStyle = '#1a1a1a';
  ctx.fillRect(cx + 6, cy + car.h - 7, 14, 8);
  ctx.fillRect(cx + car.w - 20, cy + car.h - 7, 14, 8);
  ctx.fillStyle = '#555';
  ctx.fillRect(cx + 9, cy + car.h - 6, 8, 6);
  ctx.fillRect(cx + car.w - 17, cy + car.h - 6, 8, 6);
}

// ── GROVE STUDIOS ──────────────────────────────
// 8-bit version of the real Grove Studios building (Ypsilanti):
//   dark charcoal upper wall · vivid green lower band · dark-red roof
//   trim · steel door far-left · three glass-block windows · sign w/ logo
function drawGroveStudios(ctx, bx) {
  const bw = 250, bh = 88;
  const by = GROUND;
  const green = 36; // height of vivid green lower band

  // ── thin dark-red roof trim ───────────────────
  ctx.fillStyle = '#751510';
  ctx.fillRect(bx, by - bh - 3, bw, 5);

  // ── upper wall — dark charcoal ────────────────
  ctx.fillStyle = '#2c2f35';
  ctx.fillRect(bx, by - bh, bw, bh - green);
  // cinder-block texture: faint horizontal mortar lines
  ctx.fillStyle = 'rgba(0,0,0,0.22)';
  for (let y = 8; y < bh - green; y += 10) ctx.fillRect(bx, by - bh + y, bw, 1);
  // staggered verticals
  ctx.fillStyle = 'rgba(0,0,0,0.10)';
  for (let row = 0; row < Math.floor((bh - green) / 10); row++) {
    const xOff = (row % 2) * 24;
    for (let x = xOff; x < bw; x += 48) ctx.fillRect(bx + x, by - bh + row * 10, 1, 10);
  }

  // ── lower wall — vivid green ──────────────────
  ctx.fillStyle = '#1ea82a';
  ctx.fillRect(bx, by - green, bw, green);
  // cinder-block lines on green
  ctx.fillStyle = 'rgba(0,0,0,0.18)';
  for (let y = 10; y < green; y += 10) ctx.fillRect(bx, by - green + y, bw, 1);

  // ── steel door (far left, full height of green + overlaps gray) ──
  const dx = bx + 12;
  ctx.fillStyle = '#44484e';
  ctx.fillRect(dx, by - green - 4, 22, green + 4);
  // door recessed panels
  ctx.fillStyle = '#353840';
  ctx.fillRect(dx + 2, by - green, 8, 14);
  ctx.fillRect(dx + 2, by - green + 16, 8, 12);
  ctx.fillRect(dx + 12, by - green, 8, 14);
  // small door window (upper)
  ctx.fillStyle = 'rgba(190,225,255,0.22)';
  ctx.fillRect(dx + 2, by - green - 2, 18, 10);
  // handle
  ctx.fillStyle = '#9a9a9a';
  ctx.fillRect(dx + 18, by - 16, 2, 8);
  ctx.fillRect(dx + 18, by - 16, 5, 2);

  // ── three glass-block windows ─────────────────
  [54, 104, 165].forEach(wx => {
    const wy = by - bh + 8;
    const ww = 38, wh = 32;
    // dark frame
    ctx.fillStyle = '#1a1a22';
    ctx.fillRect(bx + wx, wy, ww, wh);
    // 2×3 glass-block grid (2 cols, 3 rows)
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 2; col++) {
        const gx = bx + wx + 1 + col * 19;
        const gy = wy + 1 + row * 10;
        ctx.fillStyle = 'rgba(210,235,255,0.14)';
        ctx.fillRect(gx, gy, 17, 9);
        // frosted sheen
        ctx.fillStyle = 'rgba(255,255,255,0.09)';
        ctx.fillRect(gx, gy, 17, 2);
        ctx.fillRect(gx, gy, 2, 9);
      }
    }
    // divider lines
    ctx.fillStyle = '#1a1a22';
    ctx.fillRect(bx + wx + 19, wy + 1, 1, wh - 2);
    for (let r = 1; r < 3; r++) ctx.fillRect(bx + wx + 1, wy + r * 10, ww - 2, 1);
  });

  // ── sign board (upper-left, dark bg) ──────────
  const sx = bx + 4, sy = by - bh + 4;
  ctx.fillStyle = '#060a06';
  ctx.fillRect(sx, sy, 112, 36);
  ctx.shadowBlur = 9; ctx.shadowColor = '#20dd20';
  ctx.strokeStyle = '#189a18'; ctx.lineWidth = 1;
  ctx.strokeRect(sx, sy, 112, 36);
  ctx.shadowBlur = 0;

  // pixel circle logo (left of text)
  ctx.fillStyle = '#20cc20';
  [[3,1],[2,1],[1,2],[1,3],[1,4],[2,5],[3,5],[4,5],[5,4],[5,3],[5,2],[4,1]].forEach(([px,py]) => {
    ctx.fillRect(sx + 6 + px * 2, sy + 8 + py * 2, 2, 2);
  });
  ctx.fillRect(sx + 11, sy + 18, 4, 2);
  ctx.fillRect(sx + 15, sy + 16, 4, 2);
  ctx.fillRect(sx + 19, sy + 18, 2, 2);

  // "GROVE" text — bigger
  ctx.fillStyle = '#22dd22';
  ctx.font = 'bold 11px "Press Start 2P"'; ctx.textAlign = 'left';
  ctx.fillText('GROVE', sx + 30, sy + 20);
  // "STUDIOS" sub-text
  ctx.fillStyle = '#18a018';
  ctx.font = '7px "Press Start 2P"';
  ctx.fillText('STUDIOS', sx + 30, sy + 30);
}

// ══════════════════════════════════════════════
//  DETROIT LEVEL LANDMARKS & BACKGROUND
// ══════════════════════════════════════════════

// ── DETROIT BACKGROUND: dilapidated buildings + graffiti murals ──
function drawDetroitBackground(ctx, scrollX, frame) {
  const by = GROUND;
  const bgBuilds = [
    { wx: 280,  w: 82,  h: 98,  type: 'crumble' },
    { wx: 750,  w: 128, h: 132, type: 'graffiti', murIdx: 0 },
    { wx: 1250, w: 74,  h: 88,  type: 'crumble' },
    { wx: 1850, w: 148, h: 142, type: 'graffiti', murIdx: 1 },
    { wx: 2450, w: 92,  h: 108, type: 'crumble' },
    { wx: 3050, w: 158, h: 138, type: 'graffiti', murIdx: 2 },
    { wx: 3650, w: 78,  h: 93,  type: 'crumble' },
    { wx: 4250, w: 142, h: 132, type: 'graffiti', murIdx: 3 },
    { wx: 4850, w: 88,  h: 102, type: 'crumble' },
    { wx: 5450, w: 152, h: 138, type: 'graffiti', murIdx: 0 },
    { wx: 6050, w: 96,  h: 110, type: 'crumble' },
    { wx: 6650, w: 118, h: 122, type: 'graffiti', murIdx: 1 },
  ];

  bgBuilds.forEach(bg => {
    const bx = Math.round(bg.wx - scrollX * 0.22);
    if (bx > W + 220 || bx + bg.w < -220) return;
    const bh = bg.h, bw = bg.w;

    if (bg.type === 'crumble') {
      // ── Dilapidated building ──
      ctx.fillStyle = '#1c1008';
      ctx.fillRect(bx, by - bh, bw, bh);
      // brick texture
      for (let row = 0; row < Math.floor(bh / 8); row++) {
        const xOff = (row % 2) * 11;
        for (let col = 0; col < Math.ceil(bw / 22); col++) {
          const cx = bx + col * 22 + xOff, cy = by - bh + row * 8;
          if (cx + 20 > bx + bw - 2) continue;
          ctx.fillStyle = row % 3 === 0 ? '#381e0c' : '#2e1a0a';
          ctx.fillRect(cx, cy, 20, 7);
        }
      }
      ctx.fillStyle = 'rgba(0,0,0,0.4)';
      for (let row = 0; row <= bh; row += 8) ctx.fillRect(bx, by - bh + row, bw, 1);

      // broken / dark windows
      [[0.12,0.2],[0.45,0.22],[0.72,0.2],[0.2,0.52],[0.6,0.5],[0.35,0.75]].forEach(([wx, wy]) => {
        if (wx * bw + 13 > bw - 3) return;
        ctx.fillStyle = '#060606';
        ctx.fillRect(bx + wx * bw, by - bh + wy * bh, 13, 11);
        ctx.fillStyle = 'rgba(160,190,210,0.07)';
        ctx.fillRect(bx + wx * bw, by - bh + wy * bh, 7, 6);
        ctx.strokeStyle = 'rgba(0,0,0,0.7)'; ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(bx + wx * bw + 7, by - bh + wy * bh);
        ctx.lineTo(bx + wx * bw + 4, by - bh + wy * bh - 7);
        ctx.stroke();
      });

      // jagged crumbling top
      ctx.fillStyle = '#0a0a0a';
      const seg = Math.max(6, Math.floor(bw / 6));
      for (let i = 0; i < 6; i++) {
        const drop = (i % 3) * 6 + ((i * 7) % 5) * 3;
        ctx.fillRect(bx + i * seg, by - bh - drop, seg, drop + 3);
      }
      // partial collapse — missing section in wall
      ctx.fillStyle = '#0a0a0a';
      ctx.fillRect(bx + bw * 0.55, by - bh * 0.42, bw * 0.22, bh * 0.42);
      // rubble chunks at base
      ctx.fillStyle = '#2a1408';
      for (let i = 0; i < 6; i++) {
        ctx.fillRect(bx + bw * 0.50 + i * 9, by - 6 - (i % 3) * 4, 7 + (i % 2) * 4, 6 + (i % 3) * 4);
      }
      // exposed rebar
      ctx.strokeStyle = '#555'; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(bx + bw * 0.58, by - bh * 0.42); ctx.lineTo(bx + bw * 0.60, by - bh * 0.42 - 12); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(bx + bw * 0.68, by - bh * 0.42); ctx.lineTo(bx + bw * 0.66, by - bh * 0.42 - 18); ctx.stroke();

    } else {
      // ── Graffiti mural building ──
      ctx.fillStyle = '#141414';
      ctx.fillRect(bx, by - bh, bw, bh);
      ctx.fillStyle = 'rgba(255,255,255,0.025)';
      for (let y = 18; y < bh; y += 18) ctx.fillRect(bx, by - bh + y, bw, 1);

      drawDetroitGraffiti(ctx, bx, by - bh, bw, bh, bg.murIdx, frame);

      // paint drips
      ctx.fillStyle = 'rgba(255,80,0,0.28)';
      ctx.fillRect(bx + bw * 0.22, by - 18, 2, 18);
      ctx.fillStyle = 'rgba(0,160,255,0.22)';
      ctx.fillRect(bx + bw * 0.62, by - 24, 2, 24);
      ctx.fillStyle = 'rgba(220,20,200,0.20)';
      ctx.fillRect(bx + bw * 0.78, by - 14, 2, 14);
    }

    // dark roof cap on every bg building
    ctx.fillStyle = '#0a0a0a';
    ctx.fillRect(bx - 1, by - bh - 3, bw + 2, 4);
  });
}

function drawDetroitGraffiti(ctx, x, y, w, h, murIdx, frame) {
  const murals = [
    // 0 – Phoenix / Detroit Rises  (orange-red bird motif)
    (x, y, w, h) => {
      ctx.fillStyle = '#0a0520'; ctx.fillRect(x, y, w, h);
      const cx = x + w * 0.5, cy = y + h * 0.45;
      // body
      ctx.fillStyle = '#cc3300';
      ctx.fillRect(cx - w*0.14, cy - h*0.18, w*0.28, h*0.28);
      // wings
      ctx.fillStyle = '#ff5500';
      ctx.fillRect(x + w*0.05, cy - h*0.10, w*0.30, h*0.15);
      ctx.fillRect(cx + w*0.15, cy - h*0.10, w*0.30, h*0.15);
      ctx.fillStyle = '#ff8800';
      ctx.fillRect(x + w*0.02, cy - h*0.18, w*0.15, h*0.10);
      ctx.fillRect(cx + w*0.33, cy - h*0.18, w*0.15, h*0.10);
      // tail feathers
      ctx.fillStyle = '#aa2200';
      ctx.fillRect(cx - w*0.18, cy + h*0.08, w*0.36, h*0.22);
      ctx.fillStyle = '#ff4400';
      ctx.fillRect(cx - w*0.10, cy + h*0.18, w*0.06, h*0.20);
      ctx.fillRect(cx - w*0.02, cy + h*0.20, w*0.06, h*0.18);
      ctx.fillRect(cx + w*0.06, cy + h*0.18, w*0.06, h*0.20);
      // head
      ctx.fillStyle = '#ff6600';
      ctx.fillRect(cx - w*0.08, cy - h*0.30, w*0.16, h*0.15);
      ctx.fillStyle = '#ffee00';
      ctx.fillRect(cx + w*0.02, cy - h*0.28, w*0.04, h*0.04);
      ctx.fillStyle = '#ffcc00';
      ctx.fillRect(cx - w*0.10, cy - h*0.24, w*0.06, h*0.04);
      // flames below
      ctx.fillStyle = '#ff2200';
      ctx.fillRect(cx - w*0.20, cy + h*0.32, w*0.40, h*0.10);
      ctx.fillStyle = '#ff6600';
      ctx.fillRect(cx - w*0.12, cy + h*0.28, w*0.10, h*0.08);
      ctx.fillRect(cx + w*0.02, cy + h*0.26, w*0.10, h*0.10);
      ctx.fillStyle = '#ffaa00';
      ctx.fillRect(cx - w*0.04, cy + h*0.22, w*0.14, h*0.08);
      ctx.fillStyle = '#ff6600';
      ctx.font = `${Math.floor(w * 0.08)}px "Press Start 2P"`; ctx.textAlign = 'center';
      ctx.fillText('DETROIT', x + w/2, y + h * 0.96);
    },
    // 1 – "MADE IN DETROIT"  geometric bold lettering
    (x, y, w, h) => {
      ctx.fillStyle = '#08001a'; ctx.fillRect(x, y, w, h);
      ctx.fillStyle = '#4400aa';
      ctx.fillRect(x, y + h*0.05, w*0.14, h*0.90);
      ctx.fillStyle = '#0044aa';
      ctx.fillRect(x + w*0.86, y + h*0.05, w*0.14, h*0.90);
      ctx.fillStyle = '#002244';
      ctx.fillRect(x + w*0.10, y + h*0.05, w*0.80, h*0.35);
      ctx.fillStyle = '#001a33';
      ctx.fillRect(x + w*0.10, y + h*0.38, w*0.80, h*0.30);
      // diamonds
      ctx.fillStyle = '#00aaff';
      ctx.fillRect(x + w*0.18, y + h*0.10, w*0.09, h*0.09);
      ctx.fillStyle = '#ff00aa';
      ctx.fillRect(x + w*0.73, y + h*0.10, w*0.09, h*0.09);
      // text
      ctx.fillStyle = '#aaaaff';
      ctx.font = `${Math.floor(w * 0.07)}px "Press Start 2P"`; ctx.textAlign = 'center';
      ctx.fillText('MADE IN', x + w/2, y + h*0.32);
      ctx.fillStyle = '#00ffee';
      ctx.font = `bold ${Math.floor(w * 0.10)}px "Press Start 2P"`;
      ctx.fillText('DETROIT', x + w/2, y + h*0.48);
      ctx.fillStyle = '#ff6600';
      ctx.font = `${Math.floor(w * 0.065)}px "Press Start 2P"`;
      ctx.fillText('313', x + w/2, y + h*0.65);
      // stripes
      ['#cc3300','#ff6600','#ffcc00'].forEach((c, i) => {
        ctx.fillStyle = c;
        ctx.fillRect(x + w*0.10, y + h*(0.74 + i*0.07), w*0.80, h*0.055);
      });
    },
    // 2 – Large face / street-art portrait
    (x, y, w, h) => {
      ctx.fillStyle = '#cc0033'; ctx.fillRect(x, y, w * 0.5, h);
      ctx.fillStyle = '#0033aa'; ctx.fillRect(x + w*0.5, y, w*0.5, h);
      ctx.fillStyle = '#b86820';
      ctx.fillRect(x + w*0.22, y + h*0.10, w*0.56, h*0.62);
      // hair
      ctx.fillStyle = '#100808';
      ctx.fillRect(x + w*0.18, y + h*0.04, w*0.64, h*0.20);
      ctx.fillRect(x + w*0.18, y + h*0.10, w*0.08, h*0.35);
      ctx.fillRect(x + w*0.74, y + h*0.10, w*0.08, h*0.35);
      ctx.fillStyle = '#9a5010';
      ctx.fillRect(x + w*0.64, y + h*0.12, w*0.14, h*0.50);
      // eyes
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(x + w*0.28, y + h*0.30, w*0.16, h*0.10);
      ctx.fillRect(x + w*0.56, y + h*0.30, w*0.16, h*0.10);
      ctx.fillStyle = '#1a1060';
      ctx.fillRect(x + w*0.31, y + h*0.31, w*0.09, h*0.08);
      ctx.fillRect(x + w*0.59, y + h*0.31, w*0.09, h*0.08);
      // nose
      ctx.fillStyle = '#9a5010';
      ctx.fillRect(x + w*0.42, y + h*0.43, w*0.16, h*0.10);
      // mouth
      ctx.fillStyle = '#7a1010';
      ctx.fillRect(x + w*0.34, y + h*0.57, w*0.32, h*0.06);
      ctx.fillStyle = '#cc2020';
      ctx.fillRect(x + w*0.35, y + h*0.575, w*0.30, h*0.025);
      // dot accents sides
      ctx.fillStyle = '#ffdd00';
      for (let i = 0; i < 5; i++) {
        ctx.fillRect(x + w*0.06, y + h*(0.12 + i*0.16), w*0.08, h*0.09);
        ctx.fillRect(x + w*0.86, y + h*(0.12 + i*0.16), w*0.08, h*0.09);
      }
    },
    // 3 – Abstract Detroit skyline / geometric night art
    (x, y, w, h) => {
      ctx.fillStyle = '#03070a'; ctx.fillRect(x, y, w, h);
      ctx.fillStyle = '#061225';
      ctx.fillRect(x + w*0.05, y + h*0.05, w*0.90, h*0.65);
      // building silhouettes – amber/gold
      ctx.fillStyle = '#cc8800';
      [[0.06,0.50,0.10,0.45],[0.17,0.35,0.12,0.60],[0.30,0.42,0.08,0.53],
       [0.39,0.28,0.14,0.67],[0.54,0.38,0.09,0.57],[0.64,0.30,0.16,0.65],
       [0.81,0.44,0.13,0.51]].forEach(([bx2,by2,bw2,bh2]) => {
        ctx.fillRect(x + w*bx2, y + h*by2, w*bw2, h*bh2);
      });
      // lit windows
      ctx.fillStyle = '#ffe040';
      [[0.09,0.56],[0.09,0.64],[0.20,0.40],[0.20,0.52],[0.41,0.34],
       [0.41,0.46],[0.66,0.36],[0.66,0.50],[0.66,0.62]].forEach(([wx2,wy2]) => {
        ctx.fillRect(x + w*wx2, y + h*wy2, w*0.05, h*0.06);
      });
      // river reflection
      ctx.fillStyle = '#0a1a30';
      ctx.fillRect(x + w*0.05, y + h*0.70, w*0.90, h*0.20);
      ctx.fillStyle = '#cc8820';
      for (let i = 0; i < 5; i++) ctx.fillRect(x + w*(0.15 + i*0.17), y + h*0.73, w*0.06, h*0.02);
      // stars
      ctx.fillStyle = '#ffffff';
      [[0.15,0.08],[0.35,0.12],[0.60,0.07],[0.80,0.13],[0.90,0.09]].forEach(([sx,sy]) => {
        ctx.fillRect(x + w*sx, y + h*sy, 2, 2);
      });
      // crescent moon
      ctx.fillStyle = '#fffde7';
      ctx.beginPath(); ctx.arc(x + w*0.88, y + h*0.12, w*0.07, 0, Math.PI*2); ctx.fill();
      ctx.fillStyle = '#061225';
      ctx.beginPath(); ctx.arc(x + w*0.91, y + h*0.10, w*0.06, 0, Math.PI*2); ctx.fill();
    },
  ];
  const mural = murals[murIdx % murals.length];
  mural(x, y, w, h);
}

// ── SPIRIT OF DETROIT STATUE ──────────────────────────────────────
function drawSpiritOfDetroit(ctx, bx, frame) {
  const by = GROUND;
  const pulse = 0.85 + Math.sin(frame * 0.04) * 0.15;

  // plaza base
  ctx.fillStyle = '#141420';
  ctx.fillRect(bx, by - 14, 122, 14);
  ctx.fillStyle = '#1c1c2e';
  ctx.fillRect(bx + 2, by - 12, 118, 10);

  // lower plinth step
  ctx.fillStyle = '#1e1e30';
  ctx.fillRect(bx + 8, by - 42, 106, 28);
  ctx.fillStyle = '#28283c';
  ctx.fillRect(bx + 10, by - 40, 102, 24);
  // upper pedestal block
  ctx.fillStyle = '#181828';
  ctx.fillRect(bx + 20, by - 70, 82, 28);
  ctx.fillStyle = '#222235';
  ctx.fillRect(bx + 22, by - 68, 78, 24);
  // stone edge highlights
  ctx.fillStyle = '#333345';
  ctx.fillRect(bx + 10, by - 42, 102, 3);
  ctx.fillRect(bx + 22, by - 70, 78, 3);

  // engraved text on pedestal
  ctx.fillStyle = `rgba(226,168,32,${0.72 * pulse})`;
  ctx.font = '5px "Press Start 2P"'; ctx.textAlign = 'center';
  ctx.fillText('SPIRIT OF', bx + 61, by - 52);
  ctx.fillText('DETROIT', bx + 61, by - 44);

  // throne seat
  const tx = bx + 26, ty = by - 70;
  ctx.fillStyle = '#0e1822';
  ctx.fillRect(tx - 2, ty - 74, 72, 74);
  ctx.fillStyle = '#121e2c';
  ctx.fillRect(tx, ty - 72, 68, 70);
  // throne arch / backrest
  ctx.fillStyle = '#0e1822';
  ctx.fillRect(tx + 6, ty - 92, 56, 22);
  ctx.fillStyle = '#0a1218';
  ctx.fillRect(tx + 8, ty - 90, 52, 20);
  ctx.fillStyle = '#1a2a3a';
  ctx.fillRect(tx + 12, ty - 87, 44, 15);

  // ─ figure body (seated, verdigris bronze) ─
  const fg  = '#3a7858';
  const fgS = '#2a5840';
  const fgH = '#4a9870';

  // torso
  ctx.fillStyle = fg;
  ctx.fillRect(tx + 14, ty - 62, 40, 36);
  ctx.fillStyle = fgS;
  ctx.fillRect(tx + 42, ty - 62, 12, 36);
  // robe folds
  ctx.fillStyle = fgS;
  ctx.fillRect(tx + 20, ty - 60, 2, 30);
  ctx.fillRect(tx + 30, ty - 62, 2, 34);
  ctx.fillRect(tx + 40, ty - 58, 2, 28);
  ctx.fillStyle = fgH;
  ctx.fillRect(tx + 16, ty - 62, 4, 36);

  // head
  ctx.fillStyle = fg;
  ctx.fillRect(tx + 22, ty - 84, 24, 24);
  ctx.fillStyle = fgS;
  ctx.fillRect(tx + 36, ty - 84, 10, 24);
  // minimal face detail
  ctx.fillStyle = fgS;
  ctx.fillRect(tx + 25, ty - 77, 8, 4);
  ctx.fillRect(tx + 26, ty - 72, 6, 3);
  // golden laurel crown
  ctx.fillStyle = `rgba(226,168,32,${0.85 * pulse})`;
  ctx.fillRect(tx + 20, ty - 88, 28, 5);
  ctx.shadowBlur = 6; ctx.shadowColor = '#E2A820';
  ctx.fillRect(tx + 22, ty - 89, 24, 3);
  ctx.shadowBlur = 0;

  // left arm raised → holds golden sphere (Family / Humanity)
  ctx.fillStyle = fg;
  ctx.fillRect(tx + 6, ty - 70, 12, 28);
  ctx.fillRect(tx + 2, ty - 80, 16, 12);
  // golden sphere
  ctx.fillStyle = `rgba(226,168,32,${pulse})`;
  ctx.shadowBlur = 12; ctx.shadowColor = '#E2A820';
  ctx.beginPath(); ctx.arc(tx + 9, ty - 90, 11, 0, Math.PI * 2); ctx.fill();
  ctx.shadowBlur = 0;
  ctx.fillStyle = 'rgba(255,235,110,0.5)';
  ctx.beginPath(); ctx.arc(tx + 6, ty - 93, 5, 0, Math.PI * 2); ctx.fill();

  // right arm extended, holding small family group
  ctx.fillStyle = fg;
  ctx.fillRect(tx + 54, ty - 60, 28, 10);
  ctx.fillStyle = fg;
  ctx.fillRect(tx + 78, ty - 70, 6, 14);   // adult figure 1
  ctx.fillRect(tx + 84, ty - 72, 5, 10);   // child
  ctx.fillRect(tx + 87, ty - 68, 6, 12);   // adult figure 2

  // legs (seated, knees forward)
  ctx.fillStyle = fg;
  ctx.fillRect(tx + 14, ty - 28, 16, 28);
  ctx.fillRect(tx + 36, ty - 28, 16, 28);
  ctx.fillStyle = fgH;
  ctx.fillRect(tx + 14, ty - 30, 18, 6);
  ctx.fillRect(tx + 34, ty - 30, 18, 6);
  // sandaled feet
  ctx.fillStyle = fgS;
  ctx.fillRect(tx + 12, ty, 20, 6);
  ctx.fillRect(tx + 34, ty, 18, 6);

  // verdigris sheen overlay
  ctx.fillStyle = 'rgba(80,200,140,0.08)';
  ctx.fillRect(tx + 6, ty - 92, 88, 100);

  // decorative side panels on pedestal
  ctx.fillStyle = '#2a2a40';
  [[12, 0], [102, 0]].forEach(([ox]) => {
    ctx.fillRect(bx + ox, by - 68, 8, 26);
    ctx.fillStyle = '#3a3a55';
    ctx.fillRect(bx + ox + 1, by - 66, 6, 10);
    ctx.fillRect(bx + ox + 1, by - 54, 6, 10);
    ctx.fillStyle = '#2a2a40';
  });
}

// ── JOE LOUIS FIST (Monument to Joe Louis) ────────────────────────
function drawJoeLouis(ctx, bx, frame) {
  const by = GROUND;
  const sway = Math.sin(frame * 0.025) * 1.5;

  // steel triangular pylon frame
  ctx.fillStyle = '#2a2a2a';
  ctx.fillRect(bx + 10, by - 162, 7, 162);  // left leg
  ctx.fillRect(bx + 103, by - 162, 7, 162); // right leg
  ctx.fillRect(bx + 8, by - 165, 104, 8);   // top crossbar
  ctx.fillStyle = '#222';
  ctx.fillRect(bx + 17, by - 100, 86, 5);   // mid cross brace
  // bolt details on frame
  ctx.fillStyle = '#444';
  [[bx+9,by-165],[bx+104,by-165],[bx+14,by-100],[bx+100,by-100]].forEach(([fx,fy]) => {
    ctx.fillRect(fx, fy, 6, 6);
  });

  // suspension chains
  ctx.strokeStyle = '#4a4a4a'; ctx.lineWidth = 2;
  const c1x = bx + 35, c1y = by - 160;
  const c2x = bx + 85, c2y = by - 160;
  const fCX  = bx + 55 + sway, fCY = by - 108;
  ctx.beginPath(); ctx.moveTo(c1x, c1y); ctx.lineTo(fCX - 6, fCY); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(c2x, c2y); ctx.lineTo(fCX + 6, fCY); ctx.stroke();
  // chain link steps
  ctx.strokeStyle = '#555'; ctx.lineWidth = 1;
  for (let i = 1; i < 5; i++) {
    const t = i / 5;
    ctx.strokeRect(c1x + (fCX-6-c1x)*t - 1, c1y + (fCY-c1y)*t - 1, 5, 3);
    ctx.strokeRect(c2x + (fCX+6-c2x)*t - 1, c2y + (fCY-c2y)*t - 1, 5, 3);
  }

  // forearm (angled, going lower-left to upper-right toward fist)
  const aX = bx + 38 + sway, aY = by - 100;
  ctx.fillStyle = '#8a4a18';
  ctx.fillRect(aX,      aY + 8,  16, 10);
  ctx.fillRect(aX + 8,  aY + 0,  16, 10);
  ctx.fillRect(aX + 16, aY - 8,  16, 10);
  ctx.fillStyle = '#7a3a10';
  ctx.fillRect(aX + 22, aY - 15, 16, 8);

  // fist (massive, clenched)
  const fX = aX + 20, fY = aY - 24;
  ctx.fillStyle = '#9a5a20';
  ctx.fillRect(fX, fY, 36, 30);
  // knuckle ridge
  ctx.fillStyle = '#ba7830';
  ctx.fillRect(fX, fY, 36, 9);
  // individual knuckle bumps
  [0, 9, 18, 27].forEach(kx => {
    ctx.fillStyle = '#c88030';
    ctx.fillRect(fX + kx, fY - 4, 7, 6);
  });
  // thumb
  ctx.fillStyle = '#9a5a20';
  ctx.fillRect(fX - 9, fY + 5, 10, 16);
  ctx.fillStyle = '#8a4a18';
  ctx.fillRect(fX - 9, fY + 5, 10, 6);
  // finger divisions
  ctx.fillStyle = 'rgba(0,0,0,0.22)';
  [8, 17, 26].forEach(kx => ctx.fillRect(fX + kx, fY, 1, 30));
  // right-side shading
  ctx.fillStyle = 'rgba(0,0,0,0.28)';
  ctx.fillRect(fX + 28, fY, 8, 30);
  // verdigris patina hints
  ctx.fillStyle = 'rgba(60,160,80,0.10)';
  ctx.fillRect(fX, fY, 10, 30);

  // label plaque
  ctx.fillStyle = '#181818';
  ctx.fillRect(bx + 14, by - 16, 92, 16);
  ctx.fillStyle = '#282828';
  ctx.fillRect(bx + 16, by - 14, 88, 12);
  ctx.fillStyle = '#886611';
  ctx.font = '4px "Press Start 2P"'; ctx.textAlign = 'center';
  ctx.fillText('MONUMENT TO', bx + 60, by - 9);
  ctx.fillStyle = '#cc9922';
  ctx.font = '5px "Press Start 2P"';
  ctx.fillText('JOE LOUIS', bx + 60, by - 2);

  ctx.fillStyle = '#111';
  ctx.fillRect(bx + 5, by - 3, 110, 3);
}

// ── GUARDIAN BUILDING (art deco, mid-parallax background) ─────────
function drawGuardianBuilding(ctx, bx, frame) {
  const by = GROUND;
  const glow = 0.75 + Math.sin(frame * 0.05) * 0.25;
  const tx = bx + 14;
  const tw = 58, th = 198;

  // ── base setback (widest) ──
  ctx.fillStyle = '#8a3c14';
  ctx.fillRect(tx - 14, by - 82, tw + 28, 82);
  ctx.fillStyle = '#9e4820';
  ctx.fillRect(tx - 10, by - 80, tw + 20, 76);

  // ── mid setback ──
  ctx.fillStyle = '#8a3c14';
  ctx.fillRect(tx - 7, by - 134, tw + 14, 52);
  ctx.fillStyle = '#9e4820';
  ctx.fillRect(tx - 5, by - 132, tw + 10, 48);

  // ── main tower shaft ──
  ctx.fillStyle = '#8a3c14';
  ctx.fillRect(tx, by - th, tw, th);
  ctx.fillStyle = '#9e4820';
  ctx.fillRect(tx + 3, by - th, tw - 6, th);

  // gold horizontal bands at setback ledges
  ctx.fillStyle = '#e8c870';
  [by - 82, by - 134, by - 170].forEach(bY => {
    ctx.fillRect(tx - 14, bY, tw + 28, 4);
  });

  // art deco checkerboard tile on main tower face
  ctx.fillStyle = '#6a2c0a';
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 6; col++) {
      if ((row + col) % 2 === 0) ctx.fillRect(tx + 4 + col * 8, by - 165 + row * 8, 7, 7);
    }
  }
  ctx.fillStyle = '#bc8830';
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 6; col++) {
      if ((row + col) % 2 === 1) ctx.fillRect(tx + 4 + col * 8, by - 165 + row * 8, 7, 7);
    }
  }

  // vertical pilasters (columns) on base section
  ctx.fillStyle = '#cc6824';
  [tx - 11, tx + 8, tx + 24, tx + 40, tx + tw + 3].forEach(px => {
    ctx.fillRect(px, by - 82, 4, 82);
  });

  // cream horizontal stripe pattern on base
  ctx.fillStyle = '#e8d8b8';
  for (let i = 0; i < 5; i++) ctx.fillRect(tx - 8, by - 76 + i * 13, tw + 16, 3);
  ctx.fillStyle = '#d8c8a8';
  for (let i = 0; i < 3; i++) ctx.fillRect(tx - 2, by - 128 + i * 12, tw + 4, 3);

  // arched windows — base section (4 columns × 5 rows)
  const winCols = [tx - 10, tx + 8, tx + 26, tx + 44];
  winCols.forEach((wx, wi) => {
    for (let row = 0; row < 5; row++) {
      const wy = by - 74 + row * 14;
      ctx.fillStyle = '#0a0808';
      ctx.fillRect(wx, wy, 14, 11);
      ctx.fillRect(wx + 2, wy - 4, 10, 6); // arch
      const lit = Math.sin(frame * 0.014 + row * 1.5 + wi * 0.8) > 0;
      ctx.fillStyle = lit ? `rgba(226,168,32,${0.5 * glow})` : '#060404';
      ctx.fillRect(wx + 1, wy + 1, 12, 9);
      if (lit) {
        ctx.shadowBlur = 4; ctx.shadowColor = '#E2A820';
        ctx.fillRect(wx + 1, wy + 1, 12, 9);
        ctx.shadowBlur = 0;
      }
    }
    // mid section windows
    for (let row = 0; row < 3; row++) {
      const wy = by - 130 + row * 14;
      ctx.fillStyle = '#0a0808';
      ctx.fillRect(wx + 3, wy, 10, 10);
      const lit = Math.sin(frame * 0.017 + row * 1.2 + wi * 1.1) > 0;
      ctx.fillStyle = lit ? `rgba(226,168,32,${0.45 * glow})` : '#060404';
      ctx.fillRect(wx + 4, wy + 1, 8, 8);
    }
  });

  // pointed spire setbacks
  ctx.fillStyle = '#6a2c10';
  ctx.fillRect(tx + tw/2 - 9, by - th - 22, 18, 24);
  ctx.fillStyle = '#8a3c14';
  ctx.fillRect(tx + tw/2 - 6, by - th - 40, 12, 20);
  ctx.fillStyle = '#9a4a1a';
  ctx.fillRect(tx + tw/2 - 4, by - th - 54, 8, 16);
  // glowing spire tip
  ctx.fillStyle = `rgba(226,168,32,${glow})`;
  ctx.shadowBlur = 10; ctx.shadowColor = '#E2A820';
  ctx.fillRect(tx + tw/2 - 1, by - th - 65, 2, 13);
  ctx.shadowBlur = 0;

  // ornate ground-floor entry arch
  ctx.fillStyle = '#6a2c0a';
  ctx.fillRect(tx - 12, by - 30, tw + 24, 30);
  ctx.fillStyle = '#e8c870';
  ctx.fillRect(tx - 10, by - 28, tw + 20, 4);
  // arch opening
  ctx.fillStyle = '#040404';
  ctx.fillRect(tx + tw/2 - 14, by - 28, 28, 28);
  ctx.fillRect(tx + tw/2 - 12, by - 34, 24, 8);
  ctx.fillRect(tx + tw/2 - 10, by - 39, 20, 7);
  // door frame gold trim
  ctx.strokeStyle = '#e8c870'; ctx.lineWidth = 1;
  ctx.strokeRect(tx + tw/2 - 13, by - 28, 26, 28);

  ctx.fillStyle = `rgba(226,168,32,${0.65 * glow})`;
  ctx.font = '5px "Press Start 2P"'; ctx.textAlign = 'center';
  ctx.fillText('GUARDIAN', tx + tw/2, by - 38);
  ctx.fillText('BLDG', tx + tw/2, by - 31);

  // right-side shading
  ctx.fillStyle = 'rgba(0,0,0,0.28)';
  ctx.fillRect(tx + tw - 5, by - th, 8, th);
  ctx.fillRect(tx + tw + 9, by - 82, 8, 82);
}

// ── MAGIC STICK / MAJESTIC COMPLEX (Woodward Ave) ──────────────────
function drawMagicStick(ctx, bx, frame) {
  const by = GROUND;
  const flash = Math.floor(frame / 12) % 2 === 0;
  const bw = 222, bh = 142;

  // brick facade
  ctx.fillStyle = '#3a1208';
  ctx.fillRect(bx, by - bh, bw, bh);
  ctx.fillStyle = '#4a1a0c';
  for (let row = 0; row < Math.floor(bh / 9); row++) {
    const xOff = (row % 2) * 14;
    for (let col = 0; col < Math.ceil(bw / 28); col++) {
      ctx.fillRect(bx + col * 28 + xOff, by - bh + row * 9, 26, 8);
    }
  }
  ctx.fillStyle = 'rgba(0,0,0,0.35)';
  for (let row = 0; row <= bh; row += 9) ctx.fillRect(bx, by - bh + row, bw, 1);

  // roof coping & ornamental blocks
  ctx.fillStyle = '#1a1a1a';
  ctx.fillRect(bx - 2, by - bh - 6, bw + 4, 7);
  ctx.fillStyle = '#441a0a';
  ctx.fillRect(bx + 10, by - bh - 14, 30, 9);
  ctx.fillRect(bx + 90, by - bh - 16, 42, 11);
  ctx.fillRect(bx + 180, by - bh - 14, 30, 9);

  // ─ MAJESTIC THEATRE marquee ─
  const marqY = by - bh + 12;
  ctx.fillStyle = '#111';
  ctx.fillRect(bx + 10, marqY, bw - 20, 40);
  ctx.strokeStyle = '#cc9900'; ctx.lineWidth = 2;
  ctx.strokeRect(bx + 10, marqY, bw - 20, 40);
  // blinking border lights
  ctx.fillStyle = flash ? '#ffdd00' : '#886600';
  for (let lx = bx + 15; lx < bx + bw - 15; lx += 12) {
    ctx.fillRect(lx, marqY + 3, 5, 5);
    ctx.fillRect(lx, marqY + 32, 5, 5);
  }
  for (let ly = marqY + 8; ly < marqY + 32; ly += 12) {
    ctx.fillRect(bx + 13, ly, 5, 5);
    ctx.fillRect(bx + bw - 18, ly, 5, 5);
  }
  // "MAJESTIC" text
  ctx.shadowBlur = flash ? 7 : 0; ctx.shadowColor = '#ffaa00';
  ctx.fillStyle = '#ffdd00';
  ctx.font = 'bold 10px "Press Start 2P"'; ctx.textAlign = 'center';
  ctx.fillText('MAJESTIC', bx + bw / 2, marqY + 18);
  ctx.shadowBlur = 0;
  ctx.fillStyle = '#cc9900';
  ctx.font = '6px "Press Start 2P"';
  ctx.fillText('THEATRE', bx + bw / 2, marqY + 30);

  // ─ MAGIC STICK neon sign (upper left) ─
  const msX = bx + 5, msY = marqY - 30;
  ctx.fillStyle = '#0a0020';
  ctx.fillRect(msX, msY, 92, 26);
  ctx.shadowBlur = flash ? 5 : 0; ctx.shadowColor = '#aa00ff';
  ctx.strokeStyle = '#aa00ff'; ctx.lineWidth = 1;
  ctx.strokeRect(msX, msY, 92, 26);
  ctx.shadowBlur = 0;
  ctx.fillStyle = flash ? '#cc44ff' : '#8800cc';
  ctx.font = '7px "Press Start 2P"'; ctx.textAlign = 'center';
  ctx.fillText('MAGIC', msX + 46, msY + 11);
  ctx.fillText('STICK', msX + 46, msY + 21);

  // ─ Majestic 20 Café sign (upper right) ─
  const m20X = bx + bw - 97, m20Y = marqY - 28;
  ctx.fillStyle = '#1a0a00';
  ctx.fillRect(m20X, m20Y, 90, 24);
  ctx.shadowBlur = flash ? 4 : 0; ctx.shadowColor = '#ff6600';
  ctx.strokeStyle = '#ff6600'; ctx.lineWidth = 1;
  ctx.strokeRect(m20X, m20Y, 90, 24);
  ctx.shadowBlur = 0;
  ctx.fillStyle = '#ff8800';
  ctx.font = '6px "Press Start 2P"'; ctx.textAlign = 'center';
  ctx.fillText('MAJESTIC 20', m20X + 45, m20Y + 11);
  ctx.fillText('CAFÉ', m20X + 45, m20Y + 21);

  // show listing strip below marquee
  const showY = marqY + 54;
  ctx.fillStyle = '#111';
  ctx.fillRect(bx + 10, showY, bw - 20, 24);
  ctx.strokeStyle = '#555'; ctx.lineWidth = 1;
  ctx.strokeRect(bx + 10, showY, bw - 20, 24);
  ctx.fillStyle = '#ffdd00';
  ctx.font = '6px "Press Start 2P"'; ctx.textAlign = 'center';
  ctx.fillText('TONIGHT:', bx + bw / 2, showY + 10);
  ctx.fillStyle = '#ff8800';
  ctx.fillText('RAT KING TRIBUTE', bx + bw / 2, showY + 20);

  // ─ storefront (ground floor) ─
  const sfY = by - 48;
  ctx.fillStyle = '#0a0a0a';
  ctx.fillRect(bx, sfY, bw, 48);
  // box office
  ctx.fillStyle = '#141414';
  ctx.fillRect(bx + 10, sfY + 6, 48, 32);
  ctx.fillStyle = 'rgba(100,140,200,0.14)';
  ctx.fillRect(bx + 12, sfY + 8, 44, 28);
  ctx.fillStyle = '#cc9922';
  ctx.font = '5px "Press Start 2P"'; ctx.textAlign = 'center';
  ctx.fillText('BOX', bx + 34, sfY + 20);
  ctx.fillText('OFFICE', bx + 34, sfY + 29);
  // main double doors
  const dX = bx + bw / 2 - 24;
  ctx.fillStyle = '#1a1a1a';
  ctx.fillRect(dX, sfY + 4, 48, 44);
  ctx.fillStyle = '#222';
  ctx.fillRect(dX + 2, sfY + 6, 21, 38);
  ctx.fillRect(dX + 25, sfY + 6, 21, 38);
  ctx.fillStyle = '#886600';
  ctx.fillRect(dX + 18, sfY + 24, 4, 4);
  ctx.fillRect(dX + 26, sfY + 24, 4, 4);
  // right side window
  ctx.fillStyle = '#141414';
  ctx.fillRect(bx + bw - 58, sfY + 6, 48, 32);
  ctx.fillStyle = 'rgba(100,140,200,0.10)';
  ctx.fillRect(bx + bw - 56, sfY + 8, 44, 28);

  // Woodward Ave street sign (on building flank)
  ctx.fillStyle = '#003388';
  ctx.fillRect(bx + bw - 8, by - bh + 18, 8, 44);
  ctx.fillStyle = '#ffffff';
  ctx.font = '4px "Press Start 2P"'; ctx.textAlign = 'center';
  ctx.save();
  ctx.translate(bx + bw - 4, by - bh + 40);
  ctx.rotate(Math.PI / 2);
  ctx.fillText('WOODWARD', 0, 0);
  ctx.restore();
}

// ── PIE SCI PIZZA (Trumbull Ave) ──────────────────────────────────
function drawPieSci(ctx, bx, frame) {
  const by = GROUND;
  const np = 0.80 + Math.sin(frame * 0.06) * 0.20; // neon pulse
  const bw = 148, bh = 92;

  // building facade
  ctx.fillStyle = '#1a1a14';
  ctx.fillRect(bx, by - bh, bw, bh);
  ctx.fillStyle = '#222218';
  for (let row = 0; row < Math.floor(bh / 12); row++) {
    ctx.fillRect(bx, by - bh + row * 12, bw, 11);
  }
  ctx.fillStyle = 'rgba(0,0,0,0.3)';
  for (let row = 0; row <= bh; row += 12) ctx.fillRect(bx, by - bh + row, bw, 1);

  // ─ upper mural panel ─
  ctx.fillStyle = '#0a3030';
  ctx.fillRect(bx + 8, by - bh + 6, bw - 16, 44);
  ctx.fillStyle = '#0c3c3c';
  ctx.fillRect(bx + 10, by - bh + 8, bw - 20, 40);

  // pizza slice icon (left side of panel)
  ctx.fillStyle = '#cc7700';
  ctx.fillRect(bx + 14, by - bh + 14, 22, 20);
  ctx.fillStyle = '#ffcc00';
  ctx.fillRect(bx + 20, by - bh + 14, 10, 7);      // cheese blob
  ctx.fillStyle = '#cc2200';
  ctx.fillRect(bx + 15, by - bh + 21, 5, 5);
  ctx.fillRect(bx + 24, by - bh + 24, 4, 4);        // pepperoni
  ctx.fillStyle = '#4a3a2a';
  ctx.fillRect(bx + 14, by - bh + 32, 22, 3);       // crust edge

  // atom rings (science theme)
  ctx.strokeStyle = `rgba(0,221,170,${np})`; ctx.lineWidth = 1;
  ctx.shadowBlur = np > 0.9 ? 4 : 0; ctx.shadowColor = '#00ddaa';
  ctx.beginPath(); ctx.ellipse(bx + 25, by - bh + 23, 17, 6, -0.4, 0, Math.PI * 2); ctx.stroke();
  ctx.beginPath(); ctx.ellipse(bx + 25, by - bh + 23, 17, 6,  0.4, 0, Math.PI * 2); ctx.stroke();
  ctx.shadowBlur = 0;

  // "PIE SCI" name
  ctx.fillStyle = `rgba(0,220,170,${np})`;
  ctx.shadowBlur = np > 0.9 ? 7 : 2; ctx.shadowColor = '#00ddaa';
  ctx.font = 'bold 10px "Press Start 2P"'; ctx.textAlign = 'center';
  ctx.fillText('PIE SCI', bx + bw / 2 + 12, by - bh + 23);
  ctx.shadowBlur = 0;
  ctx.fillStyle = '#00aa88';
  ctx.font = '5px "Press Start 2P"';
  ctx.fillText('PIZZA', bx + bw / 2 + 12, by - bh + 33);
  ctx.fillStyle = 'rgba(0,180,140,0.55)';
  ctx.font = '4px "Press Start 2P"';
  ctx.fillText('TRUMBULL AVE', bx + bw / 2 + 12, by - bh + 43);

  // roof + HVAC
  ctx.fillStyle = '#0d0d0d';
  ctx.fillRect(bx - 2, by - bh - 4, bw + 4, 5);
  ctx.fillStyle = '#2a2a2a';
  ctx.fillRect(bx + bw - 32, by - bh - 16, 22, 13);
  ctx.fillRect(bx + bw - 28, by - bh - 23, 14, 8);
  ctx.fillRect(bx + 14, by - bh - 14, 8, 11);
  ctx.fillRect(bx + 12, by - bh - 16, 12, 4);

  // ─ storefront (ground floor) ─
  const sfH = 38;
  ctx.fillStyle = '#0c0c0c';
  ctx.fillRect(bx, by - sfH, bw, sfH);

  // OPEN neon in window
  ctx.fillStyle = '#08100e';
  ctx.fillRect(bx + 8, by - sfH + 4, 56, 24);
  ctx.fillStyle = `rgba(0,200,150,${np})`;
  ctx.shadowBlur = np > 0.9 ? 5 : 1; ctx.shadowColor = '#00cc88';
  ctx.font = '6px "Press Start 2P"'; ctx.textAlign = 'center';
  ctx.fillText('OPEN', bx + 36, by - sfH + 13);
  ctx.font = '4px "Press Start 2P"';
  ctx.fillText('LATE NIGHT', bx + 36, by - sfH + 23);
  ctx.shadowBlur = 0;

  // front door
  ctx.fillStyle = '#181818';
  ctx.fillRect(bx + bw / 2 - 17, by - sfH + 2, 34, sfH - 2);
  ctx.fillStyle = '#222';
  ctx.fillRect(bx + bw / 2 - 15, by - sfH + 4, 15, sfH - 6);
  ctx.fillRect(bx + bw / 2 + 0,  by - sfH + 4, 15, sfH - 6);
  ctx.fillStyle = '#00aa88';
  ctx.fillRect(bx + bw / 2 - 3, by - sfH + 14, 6, 2);

  // right window
  ctx.fillStyle = '#0a0c0a';
  ctx.fillRect(bx + bw - 46, by - sfH + 4, 38, 24);
  ctx.fillStyle = 'rgba(0,150,100,0.07)';
  ctx.fillRect(bx + bw - 44, by - sfH + 6, 34, 20);

  // chalkboard menu sign
  ctx.fillStyle = '#1a2a1a';
  ctx.fillRect(bx + 4, by - sfH + 4, 42, 24);
  ctx.strokeStyle = '#2a4a2a'; ctx.lineWidth = 1;
  ctx.strokeRect(bx + 4, by - sfH + 4, 42, 24);
  ctx.fillStyle = '#88cc88';
  ctx.font = '4px "Press Start 2P"'; ctx.textAlign = 'center';
  ctx.fillText('NY STYLE', bx + 25, by - sfH + 14);
  ctx.fillText('$3/SLICE', bx + 25, by - sfH + 22);
}

// ── OVERLAY SCREENS ────────────────────────────
function drawLevelIntro(ctx, frame, lvl, introTimer) {
  // full-screen sky for this level
  const bg = ctx.createLinearGradient(0, 0, 0, H);
  bg.addColorStop(0, lvl.skyTop); bg.addColorStop(1, lvl.skyBot);
  ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);

  // dark overlay panel
  ctx.fillStyle = 'rgba(0,0,0,0.78)';
  ctx.fillRect(0, 0, W, H);

  ctx.textAlign = 'center';

  // gold accent bars
  ctx.fillStyle = GLD;
  ctx.fillRect(0, H / 2 - 106, W, 3);
  ctx.fillRect(0, H / 2 + 80,  W, 3);

  // CITY NAME
  ctx.fillStyle = GLD;
  ctx.font = '64px "Press Start 2P"';
  ctx.shadowBlur = 26; ctx.shadowColor = GLD;
  ctx.fillText(lvl.name, W / 2, H / 2 - 28);
  ctx.shadowBlur = 0;

  // Mission
  ctx.fillStyle = GLD;
  ctx.font = '14px "Press Start 2P"';
  ctx.fillText(lvl.mission, W / 2, H / 2 + 18);

  // Quip
  ctx.fillStyle = CREAM;
  ctx.font = '13px "Press Start 2P"';
  ctx.fillText(lvl.introQuip, W / 2, H / 2 + 52);

  // skip prompt
  if (Math.floor(frame / 22) % 2 === 0) {
    ctx.fillStyle = 'rgba(226,168,32,0.4)';
    ctx.font = '8px "Press Start 2P"';
    ctx.fillText('TAP TO SKIP', W / 2, H - 22);
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
  for (let i=0;i<40;i++) {
    const sx=(i*131+frame*0.3)%W, sy=(i*71)%(H*0.55);
    ctx.fillStyle = Math.sin(frame*0.04+i)>0.4 ? GLD : 'rgba(226,168,32,0.08)';
    ctx.fillRect(sx,sy,2,2);
  }
  ctx.fillStyle='rgba(0,0,0,0.92)'; ctx.fillRect(W/2-270,H/2-180,540,360);
  ctx.strokeStyle=GLD; ctx.lineWidth=4; ctx.strokeRect(W/2-270,H/2-180,540,360);

  // title
  ctx.fillStyle=GLD; ctx.font='22px "Press Start 2P"'; ctx.textAlign='center';
  ctx.fillText('DETROIT PIZZA QUEST',W/2,H/2-118);
  ctx.fillStyle='rgba(226,168,32,0.55)'; ctx.font='10px "Press Start 2P"';
  ctx.fillText('— Team Cabin Edition —',W/2,H/2-90);

  // big simple instructions
  ctx.fillStyle=CREAM; ctx.font='15px "Press Start 2P"'; ctx.textAlign='center';
  ctx.fillText('MOVE:  ← →',       W/2, H/2 - 36);
  ctx.fillText('JUMP:  SPACE / A',  W/2, H/2 + 6);
  ctx.fillText('STOMP ENEMIES',     W/2, H/2 + 48);

  // press start
  if (Math.floor(frame/25)%2===0) {
    ctx.fillStyle=GLD; ctx.font='14px "Press Start 2P"';
    ctx.fillText('PRESS ENTER / START',W/2,H/2+110);
  }
  if (highSc>0){ctx.fillStyle='rgba(226,168,32,0.45)';ctx.font='8px "Press Start 2P"';ctx.fillText('BEST: '+highSc+(playerName&&playerName!=='AAA'?' · '+playerName:''),W/2,H/2+140);}
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
