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

// Preload Detroit graffiti mural images
const _dillagraf = new Image(); _dillagraf.src = '/dillagraf.png';
const _gameboygraf = new Image(); _gameboygraf.src = '/gameboygraf.png';
const _liongraf = new Image(); _liongraf.src = '/liongraf.png';
const _tigergraf = new Image(); _tigergraf.src = '/tigergraf.png';
const _wondergraf = new Image(); _wondergraf.src = '/wondergraf.png';

// Preload the Pie Sci logo mark for its storefront sign
const _piesciLogo = new Image(); _piesciLogo.src = '/piesci-logo.png';

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

  // ── DETROIT BACKGROUND (parallax dilapidated bldgs + graffiti) ──
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

  // ── DETROIT LANDMARKS ───────────────────────
  if (engine.lvlIdx === 2) {
    const piescibx = 600 - scrollX;
    if (piescibx > -200 && piescibx < W + 20) drawPieSci(ctx, piescibx, frame);
    const spiritbx = 2200 - scrollX;
    if (spiritbx > -240 && spiritbx < W + 20) drawSpiritOfDetroit(ctx, spiritbx, frame);
    const fistbx = 3900 - scrollX;
    if (fistbx > -220 && fistbx < W + 20) drawJoeLouisFist(ctx, fistbx, frame);
    const magicbx = 5700 - scrollX;
    if (magicbx > -300 && magicbx < W + 20) drawMajestic(ctx, magicbx, frame);
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
  ctx.fillStyle = lvl.silhouetteColor || (lvl.hasSun ? 'rgba(80,50,20,0.18)' : 'rgba(4,8,6,0.7)');
  for (let i = 0; i < 10; i++) {
    const bx = ((i*105 - scrollX*0.1) % (W+200) + W+200) % (W+200) - 100;
    ctx.fillRect(bx, GROUND-45-(i%4)*22, 40+(i%3)*14, 45+(i%4)*22);
  }
}

// ── GROUND ─────────────────────────────────────
// Shift a hex color toward black (amt < 0) or white (amt > 0).
function shadeHex(hex, amt) {
  let h = hex.replace('#', '');
  if (h.length === 3) h = h.split('').map(c => c + c).join('');
  const n = parseInt(h, 16);
  const mix = (c) => Math.max(0, Math.min(255, Math.round(amt < 0 ? c * (1 + amt) : c + (255 - c) * amt)));
  return `rgb(${mix((n >> 16) & 255)},${mix((n >> 8) & 255)},${mix(n & 255)})`;
}

function drawGround(ctx, lvl, scrollX) {
  const walkH = 20;                                  // sidewalk depth below the curb

  // curb edge the player walks on, with a shadow line beneath it
  ctx.fillStyle = lvl.groundTop;
  ctx.fillRect(0, GROUND, W, 4);
  ctx.fillStyle = 'rgba(0,0,0,0.3)';
  ctx.fillRect(0, GROUND + 4, W, 2);

  // sidewalk band
  ctx.fillStyle = lvl.sidewalkColor || shadeHex(lvl.groundColor, 0.14);
  ctx.fillRect(0, GROUND + 6, W, walkH);
  // paving joints, scrolling with the level
  ctx.fillStyle = 'rgba(0,0,0,0.22)';
  for (let i = 0; i < W / 48 + 2; i++) {
    const jx = ((i * 48 - scrollX * 0.5) % (W + 48) + W + 48) % (W + 48) - 48;
    ctx.fillRect(jx, GROUND + 6, 1, walkH);
  }
  ctx.fillStyle = 'rgba(0,0,0,0.35)';
  ctx.fillRect(0, GROUND + 6 + walkH, W, 2);

  // roadway below the sidewalk, falling off toward the bottom of the screen
  const roadY = GROUND + 8 + walkH;
  const road = lvl.roadColor || lvl.groundColor;
  const rg = ctx.createLinearGradient(0, roadY, 0, H);
  rg.addColorStop(0, road);
  rg.addColorStop(1, shadeHex(road, -0.45));
  ctx.fillStyle = rg;
  ctx.fillRect(0, roadY, W, H - roadY);

  // grit on the roadway so the surface reads as ground, not a flat block
  for (let i = 0; i < 70; i++) {
    const gx = ((i * 53 - scrollX * 0.5) % (W + 60) + W + 60) % (W + 60) - 30;
    const gy = roadY + 4 + ((i * 37) % Math.max(1, H - roadY - 8));
    ctx.fillStyle = i % 3 === 0 ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.16)';
    ctx.fillRect(gx, gy, 2 + (i % 3), 2);
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
        ctx.fillStyle = lit ? (useAlt ? wc2 : wc) : (lvl.hasSun ? '#e8d8b0' : (lvl.unlitWindow || '#091505'));
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
  ctx.fillStyle = 'rgba(0,0,0,0.2)';
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
// ── COMO'S — Nine Mile & Woodward, Ferndale ─────────────────────────────────
// Reference: the real corner restaurant — low tan building under a flat
// parapet, deep red awnings over the storefront glass, a wall script sign and
// the rooftop pylon: red "Como's" on white with a gold star over it.
function drawComos(ctx, bx) {
  const bw = 225, bh = 124, storeH = 50, awnH = 22;
  const by = GROUND;
  const upperH = bh - storeH;

  // ── upper wall — warm tan siding under a flat parapet ────────────────
  ctx.fillStyle = '#8a7350';
  ctx.fillRect(bx, by - bh, bw, upperH);
  ctx.fillStyle = 'rgba(0,0,0,0.14)';                     // siding courses
  for (let y = 7; y < upperH; y += 7) ctx.fillRect(bx, by - bh + y, bw, 1);
  ctx.fillStyle = 'rgba(255,220,170,0.06)';               // light wash off the sign
  ctx.fillRect(bx, by - bh, bw, 16);

  // wall-mounted script sign over the awning
  ctx.fillStyle = '#b3202a';
  ctx.font = '13px "Press Start 2P"'; ctx.textAlign = 'center';
  ctx.shadowBlur = 8; ctx.shadowColor = 'rgba(220,40,50,0.7)';
  ctx.fillText("Como's", bx + bw * 0.5, by - storeH - awnH - 12);
  ctx.shadowBlur = 0;

  // ── rooftop pylon sign ───────────────────────────────────────────────
  const sW = 104, sH = 40;
  const sX = bx + bw * 0.5 - sW / 2, sY = by - bh - sH - 10;
  ctx.fillStyle = '#3a3a3a';                              // support legs
  ctx.fillRect(sX + 16, sY + sH, 5, 12); ctx.fillRect(sX + sW - 21, sY + sH, 5, 12);
  ctx.fillStyle = '#141414'; ctx.fillRect(sX - 3, sY - 3, sW + 6, sH + 6);
  ctx.fillStyle = '#f2ece0'; ctx.fillRect(sX, sY, sW, sH);
  ctx.strokeStyle = '#b3202a'; ctx.lineWidth = 2; ctx.strokeRect(sX + 3, sY + 3, sW - 6, sH - 6);
  // gold star riding on top of the box
  const stx = bx + bw * 0.5, sty = sY - 9;
  ctx.fillStyle = '#e8b81c';
  ctx.beginPath();
  for (let i = 0; i < 10; i++) {
    const a = -Math.PI / 2 + (i * Math.PI) / 5;
    const r = i % 2 === 0 ? 9 : 4;
    const px = stx + Math.cos(a) * r, py = sty + Math.sin(a) * r;
    i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
  }
  ctx.closePath(); ctx.fill();
  // red script name + restaurant band
  ctx.fillStyle = '#b3202a'; ctx.font = '12px "Press Start 2P"'; ctx.textAlign = 'center';
  ctx.fillText("Como's", stx, sY + 20);
  ctx.fillStyle = '#b3202a'; ctx.fillRect(sX + 6, sY + 25, sW - 12, 10);
  ctx.fillStyle = '#f2ece0'; ctx.font = '5px "Press Start 2P"';
  ctx.fillText('RESTAURANT', stx, sY + 33);

  // ── deep red awning across the storefront ────────────────────────────
  const awnY = by - storeH - awnH;
  ctx.fillStyle = '#8e1c22';
  ctx.fillRect(bx + 4, awnY, bw - 8, awnH);
  ctx.fillStyle = '#6d1319';                              // shaded underside
  ctx.fillRect(bx + 4, awnY + awnH - 4, bw - 8, 4);
  ctx.fillStyle = '#a52830';                              // valance highlight
  ctx.fillRect(bx + 4, awnY, bw - 8, 3);
  ctx.fillStyle = '#8e1c22';                              // scalloped hem
  for (let i = 0; i < Math.floor((bw - 8) / 16); i++) {
    ctx.beginPath(); ctx.arc(bx + 12 + i * 16, awnY + awnH, 8, 0, Math.PI); ctx.fill();
  }
  ctx.fillStyle = 'rgba(0,0,0,0.18)';                     // seam per awning panel
  for (let i = 0; i < Math.floor((bw - 8) / 32); i++) ctx.fillRect(bx + 20 + i * 32, awnY, 1, awnH);
  ctx.fillStyle = 'rgba(0,0,0,0.35)';                     // shadow the awning casts
  ctx.fillRect(bx + 4, awnY + awnH + 7, bw - 8, 4);

  // ── storefront under the awning ──────────────────────────────────────
  ctx.fillStyle = '#2b2016'; ctx.fillRect(bx, by - storeH, bw, storeH);
  [[bx + 10, 66], [bx + 149, 66]].forEach(([wx, ww]) => {
    ctx.fillStyle = '#160f0a'; ctx.fillRect(wx, by - storeH + 6, ww, storeH - 14);
    ctx.fillStyle = 'rgba(240,185,100,0.3)';              // warm light inside
    ctx.fillRect(wx + 3, by - storeH + 9, ww - 6, storeH - 20);
    ctx.fillStyle = 'rgba(255,215,150,0.16)';             // pooled light near the glass
    ctx.fillRect(wx + 3, by - storeH + 9, ww - 6, 7);
    ctx.fillStyle = '#4a3520'; ctx.fillRect(wx + ww / 2 - 1, by - storeH + 6, 2, storeH - 14);
    ctx.strokeStyle = '#5a4426'; ctx.lineWidth = 1;
    ctx.strokeRect(wx, by - storeH + 6, ww, storeH - 14);
  });
  // door
  const dX = bx + bw * 0.5 - 16;
  ctx.fillStyle = '#1c1208'; ctx.fillRect(dX, by - storeH + 5, 32, storeH - 5);
  ctx.fillStyle = 'rgba(240,190,110,0.18)'; ctx.fillRect(dX + 3, by - storeH + 8, 26, storeH - 14);
  ctx.strokeStyle = '#4a3520'; ctx.lineWidth = 1; ctx.strokeRect(dX, by - storeH + 5, 32, storeH - 5);
  ctx.fillStyle = '#c9a24a'; ctx.fillRect(dX + 25, by - 26, 3, 8);
  // stone base course
  ctx.fillStyle = '#3a2f24'; ctx.fillRect(bx, by - 8, bw, 8);

  // string lights along the right end of the awning
  ctx.fillStyle = 'rgba(255,214,140,0.85)';
  for (let i = 0; i < 7; i++) ctx.fillRect(bx + bw - 62 + i * 9, awnY - 4 + (i % 2), 2, 2);

  // parapet cap
  ctx.fillStyle = '#141414'; ctx.fillRect(bx - 3, by - bh - 5, bw + 6, 6);
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
    ctx.fillText(initialsPos < 2 ? 'ENTER · NEXT' : 'ENTER TO FINISH', W/2, H/2+100);
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
  ctx.fillText('TC PIZZA QUEST',W/2,H/2-118);
  ctx.fillStyle='rgba(226,168,32,0.55)'; ctx.font='10px "Press Start 2P"';
  ctx.fillText('— Team Cabin Edition —',W/2,H/2-90);

  // divider
  ctx.strokeStyle='rgba(226,168,32,0.3)'; ctx.lineWidth=1;
  ctx.beginPath(); ctx.moveTo(W/2-210,H/2-70); ctx.lineTo(W/2+210,H/2-70); ctx.stroke();

  // how to play header
  ctx.fillStyle=GLD; ctx.font='8px "Press Start 2P"'; ctx.textAlign='center';
  ctx.fillText('HOW TO PLAY', W/2, H/2-52);

  // directions — desktop keys first, mobile equivalent after ·
  ctx.fillStyle=CREAM; ctx.font='9px "Press Start 2P"';
  ctx.fillText('MOVE  ←→ ARROWS  ·  D-PAD',    W/2, H/2-28);
  ctx.fillText('JUMP  SPACE  ·  TAP A BUTTON',   W/2, H/2-6);
  ctx.fillText('STOMP ENEMIES  +  COLLECT PIZZAS',W/2, H/2+18);
  ctx.fillText('16 PIZZAS  →  BOSS FIGHT  →  WIN',W/2, H/2+40);

  // divider
  ctx.beginPath(); ctx.moveTo(W/2-210,H/2+58); ctx.lineTo(W/2+210,H/2+58); ctx.stroke();

  // press start
  if (Math.floor(frame/25)%2===0) {
    ctx.fillStyle=GLD; ctx.font='14px "Press Start 2P"';
    ctx.fillText('PRESS ENTER / START',W/2,H/2+90);
  }
  if (highSc>0){ctx.fillStyle='rgba(226,168,32,0.45)';ctx.font='8px "Press Start 2P"';ctx.fillText('BEST: '+highSc+(playerName&&playerName!=='AAA'?' · '+playerName:''),W/2,H/2+120);}
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
  ctx.fillText('← → PICK   ENTER START',W/2,H-16);
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

// ── DETROIT BACKGROUND — dilapidated buildings + graffiti murals ─────────────
function drawDetroitBackground(ctx, scrollX, frame) {
  const px = 0.4;
  const bldgs = [
    { x: 0,    w: 160, h: 110, type: 'crumble' },
    { x: 210,  w: 290, h: 168, type: 'dilla'   },
    { x: 560,  w: 155, h: 108, type: 'crumble' },
    { x: 770,  w: 290, h: 168, type: 'gameboy' },
    { x: 1120, w: 155, h: 108, type: 'crumble' },
    { x: 1330, w: 290, h: 168, type: 'lion'    },
    { x: 1680, w: 155, h: 108, type: 'crumble' },
    { x: 1895, w: 290, h: 168, type: 'tiger'   },
    { x: 2245, w: 155, h: 108, type: 'crumble' },
    { x: 2455, w: 290, h: 168, type: 'wonder'  },
    { x: 2805, w: 155, h: 108, type: 'crumble' },
  ];
  bldgs.forEach(b => {
    const bx = b.x - scrollX * px;
    if (bx + b.w < -10 || bx > W + 10) return;
    const by = GROUND - b.h;
    if (b.type === 'crumble') drawDetroitDilapidated(ctx, bx, by, b.w, b.h);
    else drawDetroitMural(ctx, bx, by, b.w, b.h, b.type, frame);
  });
}

function drawDetroitDilapidated(ctx, bx, by, bw, bh) {
  // brick wall
  ctx.fillStyle = '#2d1c12';
  ctx.fillRect(bx, by, bw, bh);
  ctx.fillStyle = '#3b2513';
  for (let row = 0; row < bh; row += 9) {
    const off = (Math.floor(row / 9) % 2) * 10;
    for (let col = -off; col < bw; col += 20) ctx.fillRect(bx + col, by + row, 18, 7);
  }
  ctx.fillStyle = '#20150d';
  for (let row = 0; row < bh; row += 9) ctx.fillRect(bx, by + row, bw, 2);
  // dark/broken windows
  const wCols = Math.max(2, Math.floor(bw / 26));
  const wRows = Math.max(1, Math.floor(bh / 30));
  for (let wr = 0; wr < wRows; wr++) {
    for (let wc = 0; wc < wCols; wc++) {
      const wx = bx + 8 + wc * 26, wy = by + 10 + wr * 30;
      const broken = (wr * wCols + wc) % 3 === 0;
      ctx.fillStyle = broken ? '#150c0a' : '#1c1412';
      ctx.fillRect(wx, wy, 15, 17);
      if (broken) {
        ctx.strokeStyle = '#2e1512'; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(wx+2, wy); ctx.lineTo(wx+11, wy+11); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(wx+10, wy+2); ctx.lineTo(wx+3, wy+15); ctx.stroke();
      }
    }
  }
  // jagged roofline
  ctx.fillStyle = '#1e160e';
  const nw = Math.max(7, bw / 7);
  for (let i = 0; i < bw; i += nw) {
    if (Math.floor(i / nw) % 3 === 1) ctx.fillRect(bx + i, by - 5 - (i * 3) % 10, nw * 0.65, 7);
  }
  // rebar stubs
  ctx.strokeStyle = '#3d2a12'; ctx.lineWidth = 1;
  for (let i = 1; i <= 3; i++) {
    ctx.beginPath(); ctx.moveTo(bx + bw * (i / 4), by); ctx.lineTo(bx + bw * (i / 4), by - 6 - i * 2); ctx.stroke();
  }
  // rubble at base
  ctx.fillStyle = '#2e1e12';
  for (let i = 0; i < bw; i += 15) {
    if ((i * 7) % 11 < 5) ctx.fillRect(bx + i, GROUND - 5, 11, 5);
  }
}

function drawDetroitMural(ctx, bx, by, bw, bh, type, _frame) {
  const imgMap = { dilla: _dillagraf, gameboy: _gameboygraf, lion: _liongraf, tiger: _tigergraf, wonder: _wondergraf };
  const img = imgMap[type];

  // dark wall base (fallback if image not loaded)
  ctx.fillStyle = '#221c22';
  ctx.fillRect(bx, by, bw, bh);

  if (img && img.complete && img.naturalWidth > 0) {
    // draw actual mural photo, lightly dimmed for 2AM atmosphere
    ctx.drawImage(img, bx, by, bw, bh);
    ctx.fillStyle = 'rgba(0,0,0,0.2)';
    ctx.fillRect(bx, by, bw, bh);
  }

  // roof cap + side edges to ground the building
  ctx.fillStyle = '#191419';
  ctx.fillRect(bx, by, bw, 4);
  ctx.fillRect(bx - 3, by, 3, bh);
  ctx.fillRect(bx + bw, by, 3, bh);
}

// ── PIE SCI PIZZA — Trumbull Ave ─────────────────────────────────────────────
function drawPieSci(ctx, bx, frame) {
  const bw = 178, bh = 200, storeH = 46;
  const by = GROUND;
  const upperH = bh - storeH;

  // ── facade — dark teal panels ────────────────────────────────────────
  ctx.fillStyle = '#0a4a4e';
  ctx.fillRect(bx, by - bh, bw, upperH);
  ctx.fillStyle = 'rgba(0,0,0,0.16)';
  for (let y = 10; y < upperH; y += 12) ctx.fillRect(bx, by - bh + y, bw, 1);
  for (let x = 22; x < bw; x += 44) ctx.fillRect(bx + x, by - bh, 1, upperH);

  // ── illuminated sign board carrying the Pie Sci logo ─────────────────
  const sW = 118, sH = upperH - 22;
  const sX = bx + (bw - sW) / 2, sY = by - bh + 10;
  const glow = 0.75 + Math.sin(frame * 0.05) * 0.15;
  ctx.fillStyle = '#12100f'; ctx.fillRect(sX - 4, sY - 4, sW + 8, sH + 8);
  ctx.fillStyle = '#f4efe2'; ctx.fillRect(sX, sY, sW, sH);
  ctx.strokeStyle = '#1a1a1a'; ctx.lineWidth = 2; ctx.strokeRect(sX, sY, sW, sH);
  // bulbs around the sign box
  ctx.fillStyle = `rgba(255,226,140,${glow})`;
  for (let i = 0; i < Math.floor(sW / 12); i++) {
    ctx.fillRect(sX + 4 + i * 12, sY - 3, 3, 3);
    ctx.fillRect(sX + 4 + i * 12, sY + sH, 3, 3);
  }

  // the logo mark itself, fitted inside the board
  const logo = _piesciLogo;
  if (logo && logo.complete && logo.naturalWidth > 0) {
    const pad = 8;
    const k = Math.min((sW - pad * 2) / logo.naturalWidth, (sH - pad * 2) / logo.naturalHeight);
    const lw = logo.naturalWidth * k, lh = logo.naturalHeight * k;
    ctx.drawImage(logo, sX + (sW - lw) / 2, sY + (sH - lh) / 2, lw, lh);
  } else {
    // fallback wordmark until the logo finishes loading
    ctx.fillStyle = '#c8102e'; ctx.font = 'bold 11px "Press Start 2P"'; ctx.textAlign = 'center';
    ctx.fillText('PIE SCI', sX + sW / 2, sY + sH / 2);
  }

  // ── storefront ───────────────────────────────────────────────────────
  ctx.fillStyle = '#08383a'; ctx.fillRect(bx, by - storeH, bw, storeH);
  ctx.fillStyle = '#061e20'; ctx.fillRect(bx, by - storeH, bw, 4);
  // plate glass either side of the door, warm light inside
  [[bx + 8, 58], [bx + bw - 66, 58]].forEach(([wx, ww]) => {
    ctx.fillStyle = '#0a2426'; ctx.fillRect(wx, by - storeH + 8, ww, storeH - 12);
    ctx.fillStyle = 'rgba(0,200,200,0.16)'; ctx.fillRect(wx + 2, by - storeH + 10, ww - 4, storeH - 16);
  });
  // neon flask in the left window — the sign that hangs in the real one
  const fx = bx + 30, fy = by - storeH + 26;
  ctx.strokeStyle = `rgba(255,90,90,${glow})`; ctx.lineWidth = 1.5;
  ctx.shadowBlur = 7; ctx.shadowColor = 'rgba(255,90,90,0.85)';
  ctx.beginPath(); ctx.moveTo(fx - 3, fy - 11); ctx.lineTo(fx - 3, fy - 5);
  ctx.lineTo(fx - 10, fy + 8); ctx.lineTo(fx + 10, fy + 8); ctx.lineTo(fx + 3, fy - 5);
  ctx.lineTo(fx + 3, fy - 11); ctx.closePath(); ctx.stroke();
  ctx.shadowBlur = 0;
  // door
  ctx.fillStyle = '#05292b'; ctx.fillRect(bx + bw / 2 - 15, by - storeH + 6, 30, storeH - 6);
  ctx.strokeStyle = 'rgba(0,200,200,0.5)'; ctx.lineWidth = 1;
  ctx.strokeRect(bx + bw / 2 - 15, by - storeH + 6, 30, storeH - 6);
  ctx.fillStyle = 'rgba(0,220,220,0.5)'; ctx.font = '4px "Press Start 2P"'; ctx.textAlign = 'center';
  ctx.fillText('OPEN LATE', bx + bw / 2, by - storeH + 3);

  // roof cap + street sign
  ctx.fillStyle = '#141414'; ctx.fillRect(bx - 3, by - bh - 4, bw + 6, 6);
  ctx.fillStyle = 'rgba(226,168,32,0.6)'; ctx.font = '4px "Press Start 2P"'; ctx.textAlign = 'center';
  ctx.fillText('TRUMBULL AVE', bx + bw * 0.5, by - bh - 9);
}

// ── SPIRIT OF DETROIT STATUE ──────────────────────────────────────────────────
// Reference: the real memorial on Woodward — a concave white marble wall whose
// top edge scoops downward in the middle, two carved seals (City of Detroit,
// Wayne County 1796), the 2 Corinthians inscription in gilt letters, and the
// green bronze figure seated cross-legged on a LOW marble base (no tall
// pedestal): gilt sunburst sphere in the raised hand, gilt family group in the
// lower outstretched hand, planting bed + iron fence across the front.
function drawSpiritOfDetroit(ctx, bx, frame) {
  const bw = 240;
  const by = GROUND;
  const cx = bx + bw / 2;
  const wl = bx + 12, wr = bx + bw - 12;   // wall left / right edges
  const wTop = by - 262;                   // wall top at the outer edges
  const wBot = by - 12;

  // ── concave marble wall (top edge scoops down through the middle) ────
  ctx.beginPath();
  ctx.moveTo(wl, wBot);
  ctx.lineTo(wl, wTop);
  ctx.quadraticCurveTo(cx, wTop + 34, wr, wTop);
  ctx.lineTo(wr, wBot);
  ctx.closePath();
  const mg = ctx.createLinearGradient(wl, 0, wr, 0);
  mg.addColorStop(0,    '#b5b0a8');
  mg.addColorStop(0.45, '#e7e3db');
  mg.addColorStop(1,    '#c2bdb4');
  ctx.fillStyle = mg; ctx.fill();
  ctx.save(); ctx.clip();

  // marble course seams — they bow with the curve of the wall
  ctx.strokeStyle = 'rgba(152,147,140,0.4)'; ctx.lineWidth = 1;
  for (let ty = wTop + 22; ty < wBot; ty += 32) {
    ctx.beginPath(); ctx.moveTo(wl, ty);
    ctx.quadraticCurveTo(cx, ty + 10, wr, ty); ctx.stroke();
  }
  // marble panel joints
  for (let vx = wl + 40; vx < wr; vx += 40) {
    ctx.beginPath(); ctx.moveTo(vx, wTop); ctx.lineTo(vx, wBot); ctx.stroke();
  }
  // soft veining
  ctx.strokeStyle = 'rgba(170,165,157,0.45)';
  [[wl+26,wBot,wl+48,wTop+70],[cx-12,wBot-20,cx+12,wTop+56],[wr-32,wBot-8,wr-54,wTop+80]]
    .forEach(([x1,y1,x2,y2]) => { ctx.beginPath(); ctx.moveTo(x1,y1); ctx.lineTo(x2,y2); ctx.stroke(); });
  ctx.restore();

  // small dark vents punched along the top edge, following the curve
  ctx.fillStyle = 'rgba(64,62,58,0.7)';
  for (let i = 1; i < 9; i++) {
    const t = i / 9;
    const vx = wl + (wr - wl) * t;
    const vy = wTop + Math.sin(Math.PI * t) * 26 + 10;
    ctx.fillRect(vx - 2, vy, 4, 4);
  }

  // ── the two carved seals — City of Detroit (left, lower), Wayne County ──
  const drawSeal = (sx, sy, r, l1, l2) => {
    ctx.fillStyle = '#d5d0c7'; ctx.beginPath(); ctx.arc(sx, sy, r, 0, Math.PI*2); ctx.fill();
    ctx.strokeStyle = 'rgba(146,140,130,0.85)'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(sx, sy, r, 0, Math.PI*2); ctx.stroke();
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.arc(sx, sy, r - 5, 0, Math.PI*2); ctx.stroke();
    // lettering ring, suggested with tick marks
    ctx.strokeStyle = 'rgba(150,144,134,0.65)';
    for (let a = 0; a < 22; a++) {
      const th = (a / 22) * Math.PI * 2;
      ctx.beginPath();
      ctx.moveTo(sx + Math.cos(th) * (r - 4), sy + Math.sin(th) * (r - 4));
      ctx.lineTo(sx + Math.cos(th) * (r - 2), sy + Math.sin(th) * (r - 2));
      ctx.stroke();
    }
    // two figures in low relief inside the seal
    ctx.strokeStyle = 'rgba(138,132,122,0.95)'; ctx.lineWidth = 1.4;
    [-4.5, 4.5].forEach(o => {
      ctx.beginPath(); ctx.moveTo(sx + o, sy - 2); ctx.lineTo(sx + o, sy + 5); ctx.stroke();
      ctx.beginPath(); ctx.arc(sx + o, sy - 4.5, 1.8, 0, Math.PI*2); ctx.stroke();
    });
    ctx.beginPath(); ctx.moveTo(sx - 3, sy - 1); ctx.lineTo(sx + 3, sy - 1); ctx.stroke();
    ctx.fillStyle = 'rgba(126,120,110,0.9)'; ctx.font = '3px "Press Start 2P"'; ctx.textAlign = 'center';
    ctx.fillText(l1, sx, sy + r - 7);
    ctx.fillText(l2, sx, sy + r - 2);
  };
  drawSeal(cx - 48, by - 202, 22, 'CITY OF', 'DETROIT');
  drawSeal(cx + 46, by - 222, 20, 'WAYNE CO', '1796');

  // ── inscription — 2 Corinthians 3:17, gilt letters carved in the marble ──
  ctx.fillStyle = 'rgba(152,122,52,0.9)'; ctx.font = '4px "Press Start 2P"'; ctx.textAlign = 'center';
  ctx.fillText('"NOW THE LORD IS THAT SPIRIT', cx, by - 166);
  ctx.fillText('AND WHERE THE SPIRIT OF THE', cx, by - 157);
  ctx.fillText('LORD IS, THERE IS LIBERTY."', cx, by - 148);

  // ── low marble base the figure sits on ───────────────────────────────
  ctx.fillStyle = '#ded9d0'; ctx.fillRect(cx - 74, by - 30, 148, 18);
  ctx.fillStyle = '#c4bfb6'; ctx.fillRect(cx - 74, by - 14, 148, 4);
  ctx.fillStyle = '#eae6de';
  ctx.beginPath(); ctx.ellipse(cx, by - 30, 70, 8, 0, Math.PI, Math.PI*2); ctx.fill();

  // ── verdigris bronze figure, seated cross-legged ─────────────────────
  const fy = by - 30;                    // seat line (top of the marble base)
  const V1 = '#4c9a76', V2 = '#3a7d5e', V3 = '#63b892', Vd = '#25583f';

  // folded legs — thighs out to the sides, shins crossed in front
  ctx.fillStyle = V2;
  ctx.beginPath(); ctx.ellipse(cx - 26, fy - 7, 28, 11, -0.16, 0, Math.PI*2); ctx.fill();
  ctx.beginPath(); ctx.ellipse(cx + 26, fy - 7, 28, 11,  0.16, 0, Math.PI*2); ctx.fill();
  ctx.fillStyle = V1;
  ctx.beginPath(); ctx.ellipse(cx - 12, fy - 2, 23, 8,  0.10, 0, Math.PI*2); ctx.fill();
  ctx.beginPath(); ctx.ellipse(cx + 12, fy - 2, 23, 8, -0.10, 0, Math.PI*2); ctx.fill();
  ctx.fillStyle = Vd;   // bare feet tucked at the sides
  ctx.beginPath(); ctx.ellipse(cx - 40, fy - 3, 9, 6, 0, 0, Math.PI*2); ctx.fill();
  ctx.beginPath(); ctx.ellipse(cx + 40, fy - 3, 9, 6, 0, 0, Math.PI*2); ctx.fill();

  // draped cloth across the lap
  ctx.fillStyle = V2;
  ctx.beginPath();
  ctx.moveTo(cx - 34, fy - 16);
  ctx.quadraticCurveTo(cx, fy + 3, cx + 34, fy - 16);
  ctx.quadraticCurveTo(cx + 30, fy - 26, cx - 30, fy - 26);
  ctx.fill();
  ctx.strokeStyle = Vd; ctx.lineWidth = 1;
  [[cx-14,fy-24,cx-9,fy-5],[cx+1,fy-25,cx+3,fy-5],[cx+15,fy-24,cx+10,fy-6]].forEach(([x1,y1,x2,y2]) => {
    ctx.beginPath(); ctx.moveTo(x1,y1); ctx.lineTo(x2,y2); ctx.stroke();
  });

  // torso — broad chest, upright
  ctx.fillStyle = V1;
  ctx.beginPath();
  ctx.moveTo(cx - 22, fy - 20);
  ctx.lineTo(cx - 27, fy - 72);
  ctx.quadraticCurveTo(cx, fy - 82, cx + 27, fy - 72);
  ctx.lineTo(cx + 22, fy - 20);
  ctx.fill();
  ctx.fillStyle = V2; ctx.fillRect(cx - 26, fy - 70, 7, 48); ctx.fillRect(cx + 19, fy - 70, 7, 48);
  ctx.fillStyle = V3;                                     // chest highlight
  ctx.beginPath(); ctx.ellipse(cx, fy - 52, 10, 15, 0, 0, Math.PI*2); ctx.fill();
  ctx.strokeStyle = Vd; ctx.lineWidth = 1;                // sternum
  ctx.beginPath(); ctx.moveTo(cx, fy - 60); ctx.lineTo(cx, fy - 26); ctx.stroke();

  // ── arms — drawn as jointed limbs so shoulder, elbow and hand connect ──
  const rSh = [cx + 24, fy - 68], rEl = [cx + 54, fy - 82], rHd = [cx + 78, fy - 108];
  const lSh = [cx - 24, fy - 66], lEl = [cx - 54, fy - 60], lHd = [cx - 80, fy - 48];
  ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  const limb = (a, b, c, w) => {
    ctx.strokeStyle = V1; ctx.lineWidth = w;
    ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.lineTo(c[0], c[1]); ctx.stroke();
    ctx.strokeStyle = V2; ctx.lineWidth = w * 0.34;       // underside shading
    ctx.beginPath(); ctx.moveTo(a[0], a[1] + w * 0.28); ctx.lineTo(b[0], b[1] + w * 0.28); ctx.stroke();
  };
  limb(rSh, rEl, rHd, 13);                                 // raised arm (viewer right)
  limb(lSh, lEl, lHd, 13);                                 // outstretched arm (viewer left)
  // deltoids
  ctx.fillStyle = V1;
  ctx.beginPath(); ctx.arc(rSh[0], rSh[1], 7, 0, Math.PI*2); ctx.fill();
  ctx.beginPath(); ctx.arc(lSh[0], lSh[1], 7, 0, Math.PI*2); ctx.fill();

  // open, upturned palms with spread fingers
  const palm = (hx, hy, tilt) => {
    ctx.fillStyle = V2;
    ctx.beginPath(); ctx.ellipse(hx, hy, 11, 5.5, tilt, 0, Math.PI*2); ctx.fill();
    ctx.strokeStyle = V1; ctx.lineWidth = 3;
    [-7, -2.5, 2, 6.5].forEach(fx => {
      ctx.beginPath(); ctx.moveTo(hx + fx * 0.7, hy - 1); ctx.lineTo(hx + fx, hy - 8); ctx.stroke();
    });
  };
  palm(rHd[0], rHd[1], 0.2);
  palm(lHd[0], lHd[1], -0.2);
  ctx.lineCap = 'butt'; ctx.lineJoin = 'miter';

  // gilt sphere with sunburst rays, resting on the raised palm
  const pulse = 0.78 + Math.sin(frame * 0.05) * 0.18;
  const sx = rHd[0] + 1, sy = rHd[1] - 21;
  ctx.shadowBlur = 16; ctx.shadowColor = 'rgba(226,168,32,0.85)';
  ctx.strokeStyle = `rgba(226,168,32,${pulse})`; ctx.lineWidth = 2;
  for (let r = 0; r < 14; r++) {
    const a = (r / 14) * Math.PI * 2;
    const r0 = 12, r1 = 23 + Math.sin(frame * 0.07 + r) * 2;
    ctx.beginPath(); ctx.moveTo(sx + Math.cos(a)*r0, sy + Math.sin(a)*r0);
    ctx.lineTo(sx + Math.cos(a)*r1, sy + Math.sin(a)*r1); ctx.stroke();
  }
  ctx.fillStyle = `rgba(226,168,32,${pulse})`;
  ctx.beginPath(); ctx.arc(sx, sy, 11, 0, Math.PI*2); ctx.fill();
  ctx.fillStyle = 'rgba(255,243,178,0.7)';
  ctx.beginPath(); ctx.arc(sx - 3, sy - 3, 4, 0, Math.PI*2); ctx.fill();
  ctx.shadowBlur = 0;

  // gilt family group standing on the open left palm
  const lx = lHd[0], ly = lHd[1] - 13;
  ctx.shadowBlur = 8; ctx.shadowColor = 'rgba(226,168,32,0.7)';
  ctx.fillStyle = `rgba(226,168,32,${0.72 + Math.sin(frame*0.04)*0.18})`;
  ctx.beginPath(); ctx.arc(lx, ly - 10, 3.5, 0, Math.PI*2); ctx.fill();   // parent head
  ctx.fillRect(lx - 3, ly - 7, 6, 11);                                    // parent body
  ctx.strokeStyle = `rgba(226,168,32,${0.8 + Math.sin(frame*0.04)*0.15})`; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(lx - 3, ly - 4); ctx.lineTo(lx - 9, ly - 10); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(lx + 3, ly - 4); ctx.lineTo(lx + 9, ly - 10); ctx.stroke();
  ctx.fillRect(lx - 9, ly - 3, 4, 7); ctx.fillRect(lx + 5, ly - 3, 4, 7); // two children
  ctx.shadowBlur = 0;

  // ── head — level gaze, heavy waved hair swept back ───────────────────
  ctx.fillStyle = V1;
  ctx.beginPath(); ctx.arc(cx - 1, fy - 88, 16, 0, Math.PI*2); ctx.fill();
  ctx.fillStyle = V2;                                     // jaw / cheek shadow
  ctx.beginPath(); ctx.ellipse(cx - 1, fy - 79, 10, 5, 0, 0, Math.PI); ctx.fill();
  ctx.fillStyle = V1; ctx.fillRect(cx - 6, fy - 76, 12, 8);  // neck
  ctx.strokeStyle = Vd; ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.moveTo(cx - 11, fy - 90); ctx.quadraticCurveTo(cx - 7, fy - 87, cx - 3, fy - 90); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(cx + 1, fy - 90); ctx.quadraticCurveTo(cx + 5, fy - 87, cx + 9, fy - 90); ctx.stroke();
  ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(cx - 12, fy - 95); ctx.lineTo(cx - 3, fy - 94); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(cx + 1, fy - 94); ctx.lineTo(cx + 10, fy - 95); ctx.stroke();
  ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.moveTo(cx - 2, fy - 89); ctx.lineTo(cx - 1, fy - 83); ctx.stroke();   // nose
  ctx.beginPath(); ctx.moveTo(cx - 5, fy - 79); ctx.lineTo(cx + 3, fy - 79); ctx.stroke();   // mouth
  // hair — one heavy mass capping the skull, swept back off the brow
  ctx.fillStyle = V2;
  ctx.beginPath();
  ctx.arc(cx - 1, fy - 88, 17, Math.PI * 1.18, Math.PI * 1.82);
  ctx.closePath(); ctx.fill();
  ctx.strokeStyle = Vd; ctx.lineWidth = 1.2;      // waves combed back through it
  for (let w = 0; w < 3; w++) {
    ctx.beginPath();
    ctx.moveTo(cx - 9 + w * 6, fy - 99);
    ctx.quadraticCurveTo(cx - 6 + w * 6, fy - 103, cx - 3 + w * 6, fy - 100);
    ctx.stroke();
  }

  // ── planting bed + iron fence across the front of the plaza ──────────
  ctx.fillStyle = '#3a2430';                              // dark ornamental shrubs
  for (let i = 0; i < 9; i++) {
    const sxb = bx + 22 + i * 24;
    ctx.beginPath(); ctx.arc(sxb, by - 7, 8, Math.PI, Math.PI*2); ctx.fill();
  }
  ctx.fillStyle = '#356a29';                              // ornamental grasses
  for (let i = 0; i < 15; i++) {
    const gx = bx + 16 + i * 15;
    ctx.fillRect(gx, by - 11, 2, 11); ctx.fillRect(gx + 4, by - 8, 2, 8);
  }
  ctx.strokeStyle = '#171b1d'; ctx.lineWidth = 1.5;       // black iron fence
  ctx.beginPath(); ctx.moveTo(bx + 6, by - 13); ctx.lineTo(bx + bw - 6, by - 13); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(bx + 6, by - 3);  ctx.lineTo(bx + bw - 6, by - 3);  ctx.stroke();
  for (let px = bx + 6; px <= bx + bw - 6; px += 11) {
    ctx.beginPath(); ctx.moveTo(px, by - 16); ctx.lineTo(px, by); ctx.stroke();
  }

  // small bronze dedication plaque cut into the face of the marble base
  ctx.fillStyle = 'rgba(226,168,32,0.55)'; ctx.font = '4px "Press Start 2P"'; ctx.textAlign = 'center';
  ctx.fillText('THE SPIRIT OF DETROIT', cx, by - 19);
}
// ── JOE LOUIS FIST — Monument to Joe Louis ───────────────────────────────────
// Reference: Robert Graham's monument at Jefferson & Woodward — a 24-ft bronze
// arm hung HORIZONTALLY (not dangling) on cables inside a four-legged pyramidal
// steel frame, knuckles forward, the whole thing floating clear of the ground.
function drawJoeLouisFist(ctx, bx, frame) {
  const bw = 176, bh = 196;
  const by = GROUND;
  const apexX = bx + bw / 2, apexY = by - bh;
  const sway = Math.sin(frame * 0.02) * 1.6;

  // ── pyramidal frame: rear pair of legs first (lighter, set back) ─────
  ctx.strokeStyle = '#4b4f52'; ctx.lineWidth = 5; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(bx + 44, by - 6);      ctx.lineTo(apexX + 5, apexY + 3); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(bx + bw - 44, by - 6); ctx.lineTo(apexX + 5, apexY + 3); ctx.stroke();

  // front pair of legs — dark steel plate girders
  ctx.strokeStyle = '#232629'; ctx.lineWidth = 8;
  ctx.beginPath(); ctx.moveTo(bx + 8, by);      ctx.lineTo(apexX, apexY); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(bx + bw - 8, by); ctx.lineTo(apexX, apexY); ctx.stroke();
  // edge highlight down the front legs
  ctx.strokeStyle = 'rgba(150,158,164,0.35)'; ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.moveTo(bx + 11, by); ctx.lineTo(apexX - 2, apexY + 4); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(bx + bw - 11, by); ctx.lineTo(apexX + 2, apexY + 4); ctx.stroke();

  // apex gusset plate + bolts
  ctx.fillStyle = '#1b1e20'; ctx.fillRect(apexX - 8, apexY - 3, 16, 12);
  ctx.fillStyle = '#5c6165';
  [-4, 4].forEach(o => { ctx.beginPath(); ctx.arc(apexX + o, apexY + 4, 1.6, 0, Math.PI*2); ctx.fill(); });

  // concrete footings
  ctx.fillStyle = '#3d3f41';
  ctx.fillRect(bx + 2, by - 5, 16, 6); ctx.fillRect(bx + bw - 18, by - 5, 16, 6);

  // ── suspension cables from the apex down to the arm ──────────────────
  const armY = by - bh * 0.5 + sway;      // the arm hangs level, mid-frame
  const fistCx = bx + bw * 0.3 + sway * 0.5;
  const elbowX = bx + bw * 0.82;
  ctx.strokeStyle = '#8d9296'; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(apexX - 2, apexY + 8); ctx.lineTo(fistCx + 22, armY - 9); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(apexX + 2, apexY + 8); ctx.lineTo(elbowX - 10, armY - 9); ctx.stroke();

  // ── horizontal bronze forearm — thick, tapering toward the wrist ─────
  const BR1 = '#3b352d', BR2 = '#211d18', BR3 = '#57503f', ARM_H = 24;
  ctx.fillStyle = BR1;
  ctx.beginPath();
  ctx.moveTo(elbowX + 6, armY - ARM_H * 0.62);
  ctx.lineTo(fistCx + 20, armY - ARM_H * 0.5);
  ctx.lineTo(fistCx + 20, armY + ARM_H * 0.5);
  ctx.lineTo(elbowX + 6, armY + ARM_H * 0.72);
  ctx.closePath(); ctx.fill();
  // cut end of the forearm (the arm stops mid-bicep, as the real one does)
  ctx.fillStyle = BR2;
  ctx.beginPath(); ctx.ellipse(elbowX + 6, armY + 1, 4, ARM_H * 0.67, 0, 0, Math.PI*2); ctx.fill();
  // top highlight + underside shadow along the forearm
  ctx.fillStyle = BR3; ctx.globalAlpha = 0.45;
  ctx.fillRect(fistCx + 20, armY - ARM_H * 0.5, elbowX - fistCx - 14, 3);
  ctx.globalAlpha = 1;
  ctx.fillStyle = BR2;
  ctx.fillRect(fistCx + 20, armY + ARM_H * 0.34, elbowX - fistCx - 14, 4);

  // ── the fist — one heavy rounded mass, knuckles facing forward-left ──
  const fcy = armY;
  const fw = 70, fh = 48;
  ctx.fillStyle = BR1;
  ctx.beginPath();
  ctx.moveTo(fistCx + fw * 0.34, fcy - fh * 0.5);                                   // wrist top
  ctx.quadraticCurveTo(fistCx - fw * 0.2, fcy - fh * 0.62, fistCx - fw * 0.46, fcy - fh * 0.24);
  ctx.quadraticCurveTo(fistCx - fw * 0.58, fcy + fh * 0.16, fistCx - fw * 0.34, fcy + fh * 0.44);
  ctx.quadraticCurveTo(fistCx + fw * 0.02, fcy + fh * 0.66, fistCx + fw * 0.34, fcy + fh * 0.5);
  ctx.closePath(); ctx.fill();

  // silhouette outline so the mass reads against the night sky
  ctx.strokeStyle = '#15120f'; ctx.lineWidth = 1.5; ctx.stroke();
  // knuckle row across the front of the fist
  [-0.40, -0.24, -0.06, 0.12].forEach((k, i) => {
    const kx = fistCx + fw * k, ky = fcy - fh * (0.26 - i * 0.04);
    ctx.fillStyle = BR3;
    ctx.beginPath(); ctx.ellipse(kx, ky, fw * 0.11, fh * 0.17, -0.25, 0, Math.PI*2); ctx.fill();
    ctx.strokeStyle = BR2; ctx.lineWidth = 1.2;
    ctx.beginPath(); ctx.ellipse(kx, ky, fw * 0.11, fh * 0.17, -0.25, 0, Math.PI*2); ctx.stroke();
  });
  // curled finger divisions running back from the knuckles
  ctx.strokeStyle = BR2; ctx.lineWidth = 1.5;
  [-0.32, -0.14, 0.04].forEach(k => {
    ctx.beginPath();
    ctx.moveTo(fistCx + fw * k - 4, fcy - fh * 0.18);
    ctx.quadraticCurveTo(fistCx + fw * k, fcy + fh * 0.1, fistCx + fw * k - 2, fcy + fh * 0.42);
    ctx.stroke();
  });
  // thumb folded across the near side of the curled fingers
  ctx.fillStyle = BR1;
  ctx.beginPath(); ctx.ellipse(fistCx - fw * 0.12, fcy + fh * 0.3, fw * 0.26, fh * 0.16, 0.18, 0, Math.PI*2); ctx.fill();
  ctx.strokeStyle = BR2; ctx.lineWidth = 1.2;
  ctx.beginPath(); ctx.ellipse(fistCx - fw * 0.12, fcy + fh * 0.3, fw * 0.26, fh * 0.16, 0.18, 0, Math.PI*2); ctx.stroke();
  // patina sheen over the top of the fist
  ctx.fillStyle = 'rgba(96,150,128,0.13)';
  ctx.beginPath(); ctx.ellipse(fistCx - fw * 0.08, fcy - fh * 0.28, fw * 0.32, fh * 0.22, -0.2, 0, Math.PI*2); ctx.fill();

  // ── cast shadow on the plaza below the fist ──────────────────────────
  ctx.fillStyle = 'rgba(0,0,0,0.32)';
  ctx.beginPath(); ctx.ellipse(fistCx + 14, by - 3, 46, 7, 0, 0, Math.PI*2); ctx.fill();

  // plaque
  ctx.fillStyle = '#2b2f31'; ctx.fillRect(bx + bw / 2 - 56, by - 22, 112, 18);
  ctx.fillStyle = 'rgba(226,168,32,0.75)'; ctx.font = '4px "Press Start 2P"'; ctx.textAlign = 'center';
  ctx.fillText('MONUMENT TO JOE LOUIS', bx + bw / 2, by - 10);
  ctx.lineCap = 'butt';
}


// ── THE MAJESTIC COMPLEX — Woodward Ave (Majestic Theatre + Magic Stick) ─────
// Reference: the real Woodward facade — tall orange terra-cotta panels split by
// cream piers, polychrome (blue/red/gold) foliate strips running the full
// height, stepped Deco capitals and a stepped parapet along the roofline, then
// the black marquee with gold MAJESTIC THEATRE letters over a white letterboard
// and three bays of dark entrance doors in a banded stone base.
function drawMajestic(ctx, bx, frame) {
  const bw = 250, bh = 214, storeH = 50;
  const by = GROUND;
  const upperH = bh - storeH;
  const uy = by - bh;                       // top of the facade
  const flash = Math.floor(frame / 14) % 2 === 0;

  // ── cream terra-cotta field ──────────────────────────────────────────
  ctx.fillStyle = '#ded3b8'; ctx.fillRect(bx, uy, bw, upperH);
  ctx.strokeStyle = 'rgba(150,140,116,0.3)'; ctx.lineWidth = 1;
  for (let ty = uy + 14; ty < by - storeH; ty += 14) {
    ctx.beginPath(); ctx.moveTo(bx, ty); ctx.lineTo(bx + bw, ty); ctx.stroke();
  }

  // ── four tall orange panels, five polychrome piers between them ──────
  const pierW = 13, panelW = 42, panelTop = uy + 22;
  const pierXs = [], margin = 8;
  let px = bx + margin;
  for (let i = 0; i < 5; i++) {
    pierXs.push(px); px += pierW;
    if (i < 4) {
      // orange terra-cotta panel
      ctx.fillStyle = '#c85a1e';
      ctx.fillRect(px, panelTop, panelW, by - storeH - panelTop);
      ctx.fillStyle = 'rgba(120,50,14,0.26)';                   // block coursing
      for (let ty = panelTop; ty < by - storeH; ty += 13) ctx.fillRect(px, ty, panelW, 1);
      ctx.fillRect(px + panelW / 2, panelTop, 1, by - storeH - panelTop);
      ctx.fillStyle = 'rgba(226,208,170,0.4)';                  // weathered panel head
      ctx.fillRect(px, panelTop, panelW, 4);
      px += panelW;
    }
  }

  // polychrome foliate strips + stepped Deco capitals on each pier
  pierXs.forEach(sx => {
    const stripX = sx + 3, stripW = 7;
    ctx.fillStyle = '#1b3f86';                                  // blue ground
    ctx.fillRect(stripX - 1, panelTop - 2, stripW + 2, by - storeH - panelTop + 2);
    ctx.fillStyle = '#b9302b';                                  // red inner band
    ctx.fillRect(stripX, panelTop - 2, stripW, by - storeH - panelTop + 2);
    ctx.fillStyle = '#e8c04a';                                  // gold foliate motif
    for (let ty = panelTop + 2; ty < by - storeH - 3; ty += 11) {
      ctx.fillRect(stripX + 1, ty, stripW - 2, 4);
      ctx.fillRect(stripX + 2, ty + 4, stripW - 4, 2);
    }
    ctx.fillStyle = '#2f6f3a';                                  // green accents
    for (let ty = panelTop + 8; ty < by - storeH - 3; ty += 22) ctx.fillRect(stripX + 2, ty, 2, 2);

    // stepped Deco capital crowning the pier
    const capY = uy + 4;
    ctx.fillStyle = '#1b3f86'; ctx.fillRect(stripX - 6, capY, stripW + 12, 18);
    ctx.fillStyle = '#b9302b'; ctx.fillRect(stripX - 4, capY + 4, stripW + 8, 12);
    ctx.fillStyle = '#e8c04a';
    ctx.fillRect(stripX - 3, capY + 8, stripW + 6, 3);
    ctx.fillRect(stripX - 1, capY + 3, stripW + 2, 4);
    ctx.fillRect(stripX + 1, capY - 4, stripW - 2, 6);          // fan finial
    ctx.fillStyle = '#cdbf9f';                                  // cream shoulders
    ctx.fillRect(stripX - 9, capY + 12, 3, 6); ctx.fillRect(stripX + stripW + 6, capY + 12, 3, 6);
  });

  // ── low stepped Deco parapet along the roofline ──────────────────────
  ctx.fillStyle = '#d3c7aa'; ctx.fillRect(bx - 3, uy - 5, bw + 6, 8);
  ctx.fillStyle = '#e5dbc2'; ctx.fillRect(bx - 1, uy - 8, bw + 2, 4);
  // each pier steps a little higher through the coping
  pierXs.forEach(sx => {
    ctx.fillStyle = '#e5dbc2'; ctx.fillRect(sx - 4, uy - 12, pierW + 8, 8);
    ctx.fillStyle = '#d3c7aa'; ctx.fillRect(sx - 1, uy - 15, pierW + 2, 4);
  });
  ctx.fillStyle = 'rgba(120,110,90,0.28)'; ctx.fillRect(bx - 2, uy + 3, bw + 4, 2);

  // ── black marquee ────────────────────────────────────────────────────
  const mqW = bw * 0.72, mqX = bx + (bw - mqW) / 2, mqH = 42, mqY = by - storeH - mqH - 2;
  ctx.fillStyle = '#15130f'; ctx.fillRect(mqX - 7, mqY - 5, mqW + 14, mqH + 10);
  ctx.fillStyle = '#201c16'; ctx.fillRect(mqX, mqY, mqW, mqH);
  // chrome trim ribs and the sloped side returns
  ctx.fillStyle = '#9c9482';
  ctx.fillRect(mqX - 7, mqY - 5, mqW + 14, 2); ctx.fillRect(mqX - 7, mqY + mqH + 3, mqW + 14, 2);
  ctx.fillStyle = '#15130f';
  ctx.fillRect(mqX - 12, mqY + 4, 6, mqH); ctx.fillRect(mqX + mqW + 6, mqY + 4, 6, mqH);
  // bulb runs around the fascia
  ctx.fillStyle = flash ? '#ffe27a' : 'rgba(255,226,122,0.32)';
  for (let i = 0; i < Math.floor((mqW + 14) / 9); i++) {
    ctx.fillRect(mqX - 6 + i * 9, mqY - 3, 4, 3);
    ctx.fillRect(mqX - 6 + i * 9, mqY + mqH + 2, 4, 3);
  }
  // gold MAJESTIC THEATRE lettering
  if (flash) { ctx.shadowBlur = 8; ctx.shadowColor = 'rgba(226,168,32,0.8)'; }
  ctx.fillStyle = '#E2A820'; ctx.font = '8px "Press Start 2P"'; ctx.textAlign = 'center';
  ctx.fillText('MAJESTIC THEATRE', mqX + mqW / 2, mqY + 15);
  ctx.shadowBlur = 0;
  // white letterboard, two rows of changeable black letters
  ctx.fillStyle = '#efe9dc'; ctx.fillRect(mqX + 8, mqY + 21, mqW - 16, 17);
  ctx.fillStyle = 'rgba(120,112,96,0.3)'; ctx.fillRect(mqX + 8, mqY + 29, mqW - 16, 1);
  ctx.fillStyle = '#1a1a1a'; ctx.font = '4px "Press Start 2P"';
  ctx.fillText('TONIGHT RAT KING TRIBUTE', mqX + mqW / 2, mqY + 27);
  ctx.fillText('MAGIC STICK UPSTAIRS 21+', mqX + mqW / 2, mqY + 36);

  // ── banded stone base ────────────────────────────────────────────────
  ctx.fillStyle = '#3b352c'; ctx.fillRect(bx, by - storeH, bw, storeH);
  ctx.fillStyle = 'rgba(20,18,14,0.5)';
  for (let ty = by - storeH; ty < by; ty += 7) ctx.fillRect(bx, ty, bw, 2);
  // three entrance bays under the marquee, split by cream stone piers
  const bay0 = bx + bw * 0.28;
  [0, 1, 2].forEach(i => {
    const dx = bay0 + i * 38;
    ctx.fillStyle = '#0d1512'; ctx.fillRect(dx, by - storeH + 6, 30, storeH - 6);
    ctx.fillStyle = 'rgba(70,120,110,0.22)'; ctx.fillRect(dx + 2, by - storeH + 8, 26, storeH - 12);
    ctx.fillStyle = 'rgba(0,0,0,0.65)'; ctx.fillRect(dx + 14, by - storeH + 6, 2, storeH - 6);
    ctx.fillStyle = '#8a7c58'; ctx.fillRect(dx + 11, by - 26, 3, 7); ctx.fillRect(dx + 17, by - 26, 3, 7);
    ctx.fillStyle = '#cfc4a8'; ctx.fillRect(dx + 30, by - storeH, 8, storeH);
  });
  ctx.fillStyle = '#cfc4a8'; ctx.fillRect(bay0 - 8, by - storeH, 8, storeH);
  // dark plate-glass storefronts flanking the entrance
  ctx.fillStyle = '#0b1418'; ctx.fillRect(bx + 8, by - storeH + 8, 52, storeH - 10);
  ctx.fillRect(bx + bw - 60, by - storeH + 8, 52, storeH - 10);
  ctx.fillStyle = 'rgba(60,120,200,0.16)';
  ctx.fillRect(bx + 10, by - storeH + 10, 48, storeH - 14);
  ctx.fillRect(bx + bw - 58, by - storeH + 10, 48, storeH - 14);
  ctx.fillStyle = 'rgba(245,240,220,0.55)'; ctx.font = '4px "Press Start 2P"'; ctx.textAlign = 'center';
  ctx.fillText('BOX OFFICE', bx + 34, by - storeH + 24);
  ctx.fillText('MAJESTIC CAFE', bx + bw - 34, by - storeH + 24);
  // sidewalk shadow under the marquee
  ctx.fillStyle = 'rgba(0,0,0,0.22)'; ctx.fillRect(bx, by - storeH, bw, 5);

  // ── MAGIC STICK vertical blade sign on the left edge ─────────────────
  const bsX = bx - 17, bsY = by - bh + 34, bsH = 78;
  ctx.fillStyle = '#141014'; ctx.fillRect(bsX, bsY, 18, bsH);
  ctx.strokeStyle = flash ? 'rgba(170,40,255,0.95)' : 'rgba(90,20,150,0.55)'; ctx.lineWidth = 2;
  ctx.strokeRect(bsX, bsY, 18, bsH);
  ctx.fillStyle = '#241c24'; ctx.fillRect(bsX + 18, bsY + bsH / 2 - 3, 6, 6);   // wall bracket
  if (flash) { ctx.shadowBlur = 10; ctx.shadowColor = 'rgba(170,40,255,0.9)'; }
  ctx.fillStyle = flash ? '#cc55ff' : '#8a28cc';
  ctx.save(); ctx.translate(bsX + 9, bsY + bsH / 2); ctx.rotate(-Math.PI / 2);
  ctx.font = '6px "Press Start 2P"'; ctx.textAlign = 'center'; ctx.fillText('MAGIC STICK', 0, 2);
  ctx.restore(); ctx.shadowBlur = 0;

  // ── WOODWARD AVE street sign ─────────────────────────────────────────
  ctx.fillStyle = '#1a3a8a'; ctx.fillRect(bx + bw + 4, by - 70, 14, 56);
  ctx.fillStyle = '#ffffff'; ctx.save(); ctx.translate(bx + bw + 11, by - 42); ctx.rotate(-Math.PI / 2);
  ctx.font = '5px "Press Start 2P"'; ctx.textAlign = 'center'; ctx.fillText('WOODWARD AVE', 0, 4);
  ctx.restore();
}
