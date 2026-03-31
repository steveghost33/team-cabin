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

  if (gs === 'title')     { drawTitle(ctx, frame, engine.highSc); return; }
  if (gs === 'charselect'){ drawCharSelect(ctx, frame, engine.selChar); return; }
  if (gs === 'gameover')  { drawGameOver(ctx, frame, engine.sc, engine.highSc); return; }
  if (gs === 'win')       { drawWin(ctx, frame, engine.sc, engine.highSc); return; }
  if (gs === 'levelup')   { drawLevelUp(ctx, frame, engine.lvlIdx, engine.lvl); return; }

  const lvl = engine.lvl;
  const scrollX = engine.scrollX;

  // ── SKY ──────────────────────────────────────
  drawSky(ctx, lvl, frame, scrollX);

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

// ── OVERLAY SCREENS ────────────────────────────
function drawTitle(ctx, frame, highSc) {
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
  if (highSc>0){ctx.fillStyle='rgba(226,168,32,0.55)';ctx.font='9px "Press Start 2P"';ctx.fillText('HIGH SCORE: '+highSc,W/2,H/2+95);}
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
  ctx.fillText('← → SELECT   ENTER CONFIRM',W/2,H-16);
}

function drawLevelUp(ctx, frame, lvlIdx, lvl) {
  const bg = ctx.createLinearGradient(0,0,0,H);
  bg.addColorStop(0,lvl.skyTop); bg.addColorStop(1,lvl.skyBot);
  ctx.fillStyle=bg; ctx.fillRect(0,0,W,H);

  // Grove Studios building — shown when completing level 1 (Ypsilanti)
  if (lvlIdx === 1) {
    const bx = W/2-70, by = H-80;
    // building body
    ctx.fillStyle='#6B3A2A'; ctx.fillRect(bx,by-100,140,100);
    ctx.fillStyle='#8B4513'; ctx.fillRect(bx+4,by-96,132,92);
    // roof
    ctx.fillStyle='#4a2010'; ctx.fillRect(bx-6,by-103,152,8);
    // windows — lit warm yellow
    ctx.fillStyle='#FFD700';
    [[10,20],[38,20],[66,20],[94,20],[10,50],[66,50],[94,50]].forEach(([wx,wy])=>{
      ctx.fillRect(bx+wx,by-100+wy,18,14);
      ctx.fillStyle='rgba(255,220,80,0.3)'; ctx.fillRect(bx+wx-1,by-100+wy-1,20,16);
      ctx.fillStyle='#FFD700';
    });
    // door
    ctx.fillStyle='#2a1008'; ctx.fillRect(bx+57,by-30,26,30);
    ctx.fillStyle='#3a1a08'; ctx.fillRect(bx+59,by-28,10,26);
    // sign
    ctx.fillStyle='#111'; ctx.fillRect(bx+8,by-75,124,18);
    ctx.fillStyle=GLD; ctx.font='bold 9px "Press Start 2P"'; ctx.textAlign='center';
    ctx.fillText('GROVE STUDIOS',W/2,by-62);
    // neon glow under sign
    ctx.shadowBlur=10; ctx.shadowColor=GLD;
    ctx.strokeStyle=GLD; ctx.lineWidth=1; ctx.strokeRect(bx+8,by-75,124,18);
    ctx.shadowBlur=0;
  }

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
  if(Math.floor(frame/28)%2===0){ctx.fillStyle=GLD;ctx.font='10px "Press Start 2P"';ctx.fillText('PRESS ENTER TO TRY AGAIN',W/2,H/2+55);}
}

function drawWin(ctx, frame, sc, highSc) {
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
  if(sc>0&&sc>=highSc){ctx.fillStyle=GLD;ctx.fillText('✨ NEW HIGH SCORE! ✨',W/2,H/2+18);}
  if(Math.floor(frame/28)%2===0){ctx.fillStyle=GLD;ctx.font='10px "Press Start 2P"';ctx.fillText('PRESS ENTER TO PLAY AGAIN',W/2,H/2+62);}
}
