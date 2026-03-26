// ─────────────────────────────────────────────
//  game/sprites.js
//  All canvas draw functions for the game.
// ─────────────────────────────────────────────
import { PW, PH, GLD, GRN } from './constants.js';

// ── PLAYER ────────────────────────────────────
export function drawPlayer(ctx, pl, charIdx, frame) {
  if (pl.inv > 0 && Math.floor(pl.inv / 5) % 2 === 0) return;
  const { x: px, y: py, face } = pl;
  ctx.save();
  if (face === -1) { ctx.translate(px + PW, 0); ctx.scale(-1, 1); ctx.translate(-px, 0); }

  if (charIdx === 0) {
    // STEVE — plaid flannel
    ctx.fillStyle = '#111'; ctx.fillRect(px, py+26, 8, 4); ctx.fillRect(px+13, py+26, 8, 4);
    ctx.fillStyle = '#1c1c2c'; ctx.fillRect(px+1, py+16, 7, 11); ctx.fillRect(px+13, py+16, 7, 11);
    ctx.fillStyle = '#848688'; ctx.fillRect(px-1, py+5, PW+2, 12);
    ctx.fillStyle = 'rgba(70,72,74,0.5)';
    [px+3,px+9,px+15].forEach(x=>ctx.fillRect(x,py+5,2,12));
    [py+8,py+12].forEach(y=>ctx.fillRect(px-1,y,PW+2,2));
    ctx.fillStyle = '#4a6030'; ctx.fillRect(px+8, py+5, 6, 4);
    ctx.fillStyle = '#848688'; ctx.fillRect(px-5,py+5,5,10); ctx.fillRect(px+PW,py+5,5,10);
    ctx.fillStyle = '#e0c090'; ctx.fillRect(px-5,py+14,5,3); ctx.fillRect(px+PW,py+14,5,3);
    ctx.fillStyle = '#e0c090'; ctx.fillRect(px+3,py-10,16,13);
    ctx.fillStyle = 'rgba(138,112,69,0.35)'; ctx.fillRect(px+3,py-10,16,3);
    ctx.fillStyle = '#8a7045'; ctx.fillRect(px+3,py+1,16,3); ctx.fillRect(px+4,py-1,3,3); ctx.fillRect(px+15,py-1,3,3);
    ctx.fillStyle = '#1a1a1a'; ctx.fillRect(px+6,py-6,3,3); ctx.fillRect(px+13,py-6,3,3);
    ctx.strokeStyle = '#7a6535'; ctx.lineWidth = 1;
    ctx.strokeRect(px+5,py-7,5,5); ctx.strokeRect(px+12,py-7,5,5);
    ctx.fillStyle = '#7a6535'; ctx.fillRect(px+10,py-5,2,1);

  } else if (charIdx === 1) {
    // MIKE — plain grey hoodie, dark gray shoes, mustard hat
    // dark gray shoes — both same
    ctx.fillStyle = '#3a3a3a'; ctx.fillRect(px,py+26,8,4); ctx.fillRect(px+13,py+26,8,4);
    // maroon pants
    ctx.fillStyle = '#7B2D3A'; ctx.fillRect(px+1,py+16,7,11); ctx.fillRect(px+13,py+16,7,11);
    // plain grey hoodie — NO logo
    ctx.fillStyle = '#9a9a9a'; ctx.fillRect(px-1,py+5,PW+2,12);
    ctx.fillStyle = '#888'; ctx.fillRect(px+3,py+12,16,4); // pocket only
    ctx.fillStyle = '#838383'; ctx.fillRect(px+11,py+5,1,12); // center seam
    ctx.fillStyle = '#9a9a9a'; ctx.fillRect(px-5,py+5,5,12); ctx.fillRect(px+PW,py+5,5,12);
    ctx.fillStyle = '#c49a6c'; ctx.fillRect(px-5,py+16,5,3); ctx.fillRect(px+PW,py+16,5,3);
    // head
    ctx.fillStyle = '#c49a6c'; ctx.fillRect(px+3,py-10,16,13);
    // beard
    ctx.fillStyle = '#2a1a0a'; ctx.fillRect(px+3,py+1,16,4); ctx.fillRect(px+4,py-1,3,3); ctx.fillRect(px+15,py-1,3,3);
    // eyes
    ctx.fillStyle = '#111'; ctx.fillRect(px+6,py-6,3,3); ctx.fillRect(px+13,py-6,3,3);
    // mustard yellow snapback — brim + crown
    ctx.fillStyle = '#c8a020'; ctx.fillRect(px-1,py-12,PW+2,2); // brim
    ctx.fillStyle = '#a07810'; ctx.fillRect(px-1,py-11,PW+2,1); // brim underside
    ctx.fillStyle = '#c8a020'; ctx.fillRect(px+1,py-18,PW,7);   // crown
    ctx.fillStyle = '#d4b030'; ctx.fillRect(px+3,py-18,PW-4,4); // crown highlight
    ctx.fillStyle = '#b89018'; ctx.fillRect(px+9,py-18,4,1);    // button

  } else {
    // KYLE — green zip fleece, short hair, glasses
    ctx.fillStyle = '#5D4037'; ctx.fillRect(px,py+26,8,4); ctx.fillRect(px+13,py+26,8,4);
    ctx.fillStyle = '#283040'; ctx.fillRect(px+1,py+16,7,11); ctx.fillRect(px+13,py+16,7,11);
    ctx.fillStyle = '#3D5A2A'; ctx.fillRect(px-1,py+5,PW+2,12);
    ctx.fillStyle = '#2D4A1E'; ctx.fillRect(px+10,py+5,2,12); ctx.fillRect(px+7,py+4,8,3);
    ctx.fillStyle = '#3D5A2A'; ctx.fillRect(px-5,py+5,5,12); ctx.fillRect(px+PW,py+5,5,12);
    ctx.fillStyle = '#E0C090'; ctx.fillRect(px-5,py+16,5,3); ctx.fillRect(px+PW,py+16,5,3);
    ctx.fillStyle = '#E0C090'; ctx.fillRect(px+3,py-10,16,13);
    // short hair
    ctx.fillStyle = '#6B4C2A'; ctx.fillRect(px+3,py-10,16,3); ctx.fillRect(px+1,py-9,3,5); ctx.fillRect(px+18,py-9,3,5);
    ctx.fillStyle = '#1a1a1a'; ctx.fillRect(px+6,py-6,3,3); ctx.fillRect(px+13,py-6,3,3);
    ctx.strokeStyle = '#6B4C2A'; ctx.lineWidth = 1;
    ctx.strokeRect(px+5,py-7,5,5); ctx.strokeRect(px+12,py-7,5,5);
    ctx.fillStyle = '#6B4C2A'; ctx.fillRect(px+10,py-5,2,1);
  }
  ctx.restore();
}

// ── CHAR SELECT PREVIEW (scaled up) ───────────
export function drawCharPreview(ctx, idx, cx, cy, scale) {
  ctx.save();
  ctx.translate(cx - 11*scale, cy - 18*scale);
  ctx.scale(scale, scale);
  const px=0, py=0;

  if (idx === 0) {
    ctx.fillStyle='#111'; ctx.fillRect(px,py+26,8,4); ctx.fillRect(px+13,py+26,8,4);
    ctx.fillStyle='#1c1c2c'; ctx.fillRect(px+1,py+16,7,11); ctx.fillRect(px+13,py+16,7,11);
    ctx.fillStyle='#848688'; ctx.fillRect(px-1,py+5,26,12);
    ctx.fillStyle='rgba(70,72,74,0.5)';
    [px+3,px+9,px+15].forEach(x=>ctx.fillRect(x,py+5,2,12));
    [py+8,py+12].forEach(y=>ctx.fillRect(px-1,y,26,2));
    ctx.fillStyle='#4a6030'; ctx.fillRect(px+8,py+5,6,4);
    ctx.fillStyle='#848688'; ctx.fillRect(px-5,py+5,5,10); ctx.fillRect(px+24,py+5,5,10);
    ctx.fillStyle='#e0c090'; ctx.fillRect(px-5,py+14,5,3); ctx.fillRect(px+24,py+14,5,3);
    ctx.fillStyle='#e0c090'; ctx.fillRect(px+3,py-10,16,13);
    ctx.fillStyle='rgba(138,112,69,0.35)'; ctx.fillRect(px+3,py-10,16,3);
    ctx.fillStyle='#8a7045'; ctx.fillRect(px+3,py+1,16,3); ctx.fillRect(px+4,py-1,3,3); ctx.fillRect(px+15,py-1,3,3);
    ctx.fillStyle='#1a1a1a'; ctx.fillRect(px+6,py-6,3,3); ctx.fillRect(px+13,py-6,3,3);
    ctx.strokeStyle='#7a6535'; ctx.lineWidth=1;
    ctx.strokeRect(px+5,py-7,5,5); ctx.strokeRect(px+12,py-7,5,5);
    ctx.fillStyle='#7a6535'; ctx.fillRect(px+10,py-5,2,1);

  } else if (idx === 1) {
    // dark gray shoes
    ctx.fillStyle='#3a3a3a'; ctx.fillRect(px,py+26,8,4); ctx.fillRect(px+13,py+26,8,4);
    ctx.fillStyle='#7B2D3A'; ctx.fillRect(px+1,py+16,7,11); ctx.fillRect(px+13,py+16,7,11);
    ctx.fillStyle='#9a9a9a'; ctx.fillRect(px-1,py+5,26,12);
    ctx.fillStyle='#888'; ctx.fillRect(px+3,py+12,16,4);
    ctx.fillStyle='#838383'; ctx.fillRect(px+11,py+5,1,12);
    ctx.fillStyle='#9a9a9a'; ctx.fillRect(px-5,py+5,5,12); ctx.fillRect(px+24,py+5,5,12);
    ctx.fillStyle='#c49a6c'; ctx.fillRect(px-5,py+16,5,3); ctx.fillRect(px+24,py+16,5,3);
    ctx.fillStyle='#c49a6c'; ctx.fillRect(px+3,py-10,16,13);
    ctx.fillStyle='#2a1a0a'; ctx.fillRect(px+3,py+1,16,4); ctx.fillRect(px+4,py-1,3,3); ctx.fillRect(px+15,py-1,3,3);
    ctx.fillStyle='#111'; ctx.fillRect(px+6,py-6,3,3); ctx.fillRect(px+13,py-6,3,3);
    // mustard hat
    ctx.fillStyle='#c8a020'; ctx.fillRect(px-1,py-12,26,2);
    ctx.fillStyle='#a07810'; ctx.fillRect(px-1,py-11,26,1);
    ctx.fillStyle='#c8a020'; ctx.fillRect(px+1,py-18,22,7);
    ctx.fillStyle='#d4b030'; ctx.fillRect(px+3,py-18,18,4);
    ctx.fillStyle='#b89018'; ctx.fillRect(px+9,py-18,4,1);

  } else {
    ctx.fillStyle='#5D4037'; ctx.fillRect(px,py+26,8,4); ctx.fillRect(px+13,py+26,8,4);
    ctx.fillStyle='#283040'; ctx.fillRect(px+1,py+16,7,11); ctx.fillRect(px+13,py+16,7,11);
    ctx.fillStyle='#3D5A2A'; ctx.fillRect(px-1,py+5,26,12);
    ctx.fillStyle='#2D4A1E'; ctx.fillRect(px+10,py+5,2,12); ctx.fillRect(px+7,py+4,8,3);
    ctx.fillStyle='#3D5A2A'; ctx.fillRect(px-5,py+5,5,12); ctx.fillRect(px+24,py+5,5,12);
    ctx.fillStyle='#E0C090'; ctx.fillRect(px-5,py+16,5,3); ctx.fillRect(px+24,py+16,5,3);
    ctx.fillStyle='#E0C090'; ctx.fillRect(px+3,py-10,16,13);
    ctx.fillStyle='#6B4C2A'; ctx.fillRect(px+3,py-10,16,3); ctx.fillRect(px+1,py-9,3,5); ctx.fillRect(px+18,py-9,3,5);
    ctx.fillStyle='#1a1a1a'; ctx.fillRect(px+6,py-6,3,3); ctx.fillRect(px+13,py-6,3,3);
    ctx.strokeStyle='#6B4C2A'; ctx.lineWidth=1;
    ctx.strokeRect(px+5,py-7,5,5); ctx.strokeRect(px+12,py-7,5,5);
    ctx.fillStyle='#6B4C2A'; ctx.fillRect(px+10,py-5,2,1);
  }
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

  const walk = Math.sin((o.at || 0) * 0.2) * 3;
  if (o.at !== undefined) o.at++;

  if (o.type === 'cone') {
    ctx.fillStyle = '#FF6600';
    ctx.beginPath(); ctx.moveTo(ox+9,oy); ctx.lineTo(ox-2,oy+26); ctx.lineTo(ox+20,oy+26); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#FF8C00';
    ctx.beginPath(); ctx.moveTo(ox+9,oy); ctx.lineTo(ox+20,oy+26); ctx.lineTo(ox+9,oy+14); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.fillRect(ox+1,oy+10,16,3); ctx.fillRect(ox+3,oy+16,12,2);
    ctx.fillStyle = '#333'; ctx.fillRect(ox-4,oy+24,26,4);

  } else if (o.type === 'metermaid') {
    // legs
    ctx.fillStyle = '#1a4a1a'; ctx.fillRect(ox+3,oy+22,7,10+walk); ctx.fillRect(ox+14,oy+22,7,10-walk);
    ctx.fillStyle = '#111'; ctx.fillRect(ox+2,oy+30,9,4); ctx.fillRect(ox+13,oy+30,9,4);
    // body
    ctx.fillStyle = '#1a6a1a'; ctx.fillRect(ox+1,oy+9,22,14);
    ctx.fillStyle = '#2a7a2a'; ctx.fillRect(ox+3,oy+9,18,7);
    ctx.fillStyle = '#0a5a0a'; ctx.fillRect(ox+1,oy+20,22,4);
    // badge
    ctx.fillStyle = GLD; ctx.fillRect(ox+9,oy+13,6,5);
    ctx.fillStyle = '#c89000'; ctx.fillRect(ox+10,oy+14,4,3);
    // arms
    ctx.fillStyle = '#1a6a1a'; ctx.fillRect(ox-4,oy+9,6,12); ctx.fillRect(ox+22,oy+9,6,12);
    ctx.fillStyle = '#c8855a'; ctx.fillRect(ox-4,oy+19,6,4); ctx.fillRect(ox+22,oy+19,6,4);
    // ticket pad
    ctx.fillStyle = '#fff'; ctx.fillRect(ox+22,oy+12,9,10);
    ctx.fillStyle = '#ddd'; ctx.fillRect(ox+23,oy+14,7,1); ctx.fillRect(ox+23,oy+17,7,1);
    // head
    ctx.fillStyle = '#c8855a'; ctx.fillRect(ox+7,oy+1,10,10);
    // hat
    ctx.fillStyle = '#1a4a1a'; ctx.fillRect(ox+5,oy-3,14,5);
    ctx.fillStyle = '#2a6a2a'; ctx.fillRect(ox+7,oy-2,10,3);
    ctx.fillStyle = GLD; ctx.fillRect(ox+7,oy-1,10,1);
    // eyes
    ctx.fillStyle = '#1a1a1a'; ctx.fillRect(ox+9,oy+3,3,3); ctx.fillRect(ox+14,oy+3,3,3);

  } else if (o.type === 'muscledude') {
    // legs
    ctx.fillStyle = '#222'; ctx.fillRect(ox+3,oy+22,8,10+walk); ctx.fillRect(ox+13,oy+22,8,10-walk);
    ctx.fillStyle = '#111'; ctx.fillRect(ox+2,oy+30,10,4); ctx.fillRect(ox+13,oy+30,10,4);
    // body — red NO PKG shirt
    ctx.fillStyle = '#8B0000'; ctx.fillRect(ox,oy+9,24,14);
    ctx.fillStyle = '#aa1010'; ctx.fillRect(ox+2,oy+9,20,7);
    ctx.fillStyle = '#6a0000'; ctx.fillRect(ox,oy+20,24,4);
    ctx.fillStyle = '#fff'; ctx.font = '5px sans-serif'; ctx.textAlign = 'center';
    ctx.fillText('NO PKG', ox+12, oy+18);
    // big arms
    ctx.fillStyle = '#8B0000'; ctx.fillRect(ox-6,oy+9,8,14); ctx.fillRect(ox+22,oy+9,8,14);
    ctx.fillStyle = '#c8855a'; ctx.fillRect(ox-8,oy+21,10,5); ctx.fillRect(ox+22,oy+21,10,5);
    // head
    ctx.fillStyle = '#c8855a'; ctx.fillRect(ox+7,oy-2,10,12);
    // angry brow
    ctx.fillStyle = '#6a0000';
    ctx.beginPath(); ctx.moveTo(ox+6,oy-5); ctx.lineTo(ox+12,oy-2); ctx.lineTo(ox+6,oy-2); ctx.closePath(); ctx.fill();
    ctx.beginPath(); ctx.moveTo(ox+18,oy-5); ctx.lineTo(ox+12,oy-2); ctx.lineTo(ox+18,oy-2); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#1a1a1a'; ctx.fillRect(ox+8,oy,3,3); ctx.fillRect(ox+13,oy,3,3);

  } else if (o.type === 'rat') {
    // tail
    ctx.strokeStyle = '#a07050'; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(ox,oy+8); ctx.quadraticCurveTo(ox-10,oy+12,ox-14,oy+8); ctx.stroke();
    // body
    ctx.fillStyle = '#6a6060'; ctx.beginPath(); ctx.ellipse(ox+8,oy+8,8,6,0,0,Math.PI*2); ctx.fill();
    ctx.fillStyle = '#8a8080'; ctx.beginPath(); ctx.ellipse(ox+8,oy+7,6,4,0,0,Math.PI*2); ctx.fill();
    // head
    ctx.fillStyle = '#6a6060'; ctx.beginPath(); ctx.ellipse(ox+16,oy+6,5,4,0,0,Math.PI*2); ctx.fill();
    // snout
    ctx.fillStyle = '#c87070'; ctx.beginPath(); ctx.ellipse(ox+20,oy+5,3,2.5,0,0,Math.PI*2); ctx.fill();
    // nose
    ctx.fillStyle = '#cc0000'; ctx.beginPath(); ctx.arc(ox+22,oy+4,1.5,0,Math.PI*2); ctx.fill();
    // eye
    ctx.fillStyle = '#cc2200'; ctx.beginPath(); ctx.arc(ox+17,oy+4,2,0,Math.PI*2); ctx.fill();
    ctx.fillStyle = '#111'; ctx.beginPath(); ctx.arc(ox+17,oy+4,1,0,Math.PI*2); ctx.fill();
    // ear
    ctx.fillStyle = '#c87070'; ctx.beginPath(); ctx.ellipse(ox+14,oy+1,3,4,0,0,Math.PI*2); ctx.fill();
    ctx.fillStyle = '#e89090'; ctx.beginPath(); ctx.ellipse(ox+14,oy+1,1.5,2.5,0,0,Math.PI*2); ctx.fill();
    // legs
    ctx.fillStyle = '#555';
    ctx.fillRect(ox+3,oy+12+walk,4,4); ctx.fillRect(ox+10,oy+12-walk,4,4);

  } else if (o.type === 'biker') {
    // legs
    ctx.fillStyle = '#1a1a1a'; ctx.fillRect(ox+3,oy+22,8,10+walk); ctx.fillRect(ox+13,oy+22,8,10-walk);
    ctx.fillStyle = '#111'; ctx.fillRect(ox+2,oy+30,10,4); ctx.fillRect(ox+13,oy+30,10,4);
    // leather jacket
    ctx.fillStyle = '#1a1a1a'; ctx.fillRect(ox,oy+9,24,14);
    ctx.fillStyle = '#2a2a2a'; ctx.fillRect(ox+2,oy+9,20,7);
    ctx.fillStyle = '#555'; ctx.fillRect(ox+10,oy+9,4,14); // zipper
    // red detail
    ctx.fillStyle = '#e74c3c'; ctx.fillRect(ox+2,oy+11,8,4); ctx.fillRect(ox+14,oy+11,8,4);
    // arms
    ctx.fillStyle = '#1a1a1a'; ctx.fillRect(ox-5,oy+9,7,14); ctx.fillRect(ox+22,oy+9,7,14);
    ctx.fillStyle = '#c8855a'; ctx.fillRect(ox-5,oy+21,7,4); ctx.fillRect(ox+22,oy+21,7,4);
    // head / helmet
    ctx.fillStyle = '#c8855a'; ctx.fillRect(ox+7,oy+1,10,9);
    ctx.fillStyle = '#111'; ctx.fillRect(ox+5,oy-5,14,8);
    ctx.fillStyle = '#555'; ctx.fillRect(ox+6,oy+1,12,2);
    // visor
    ctx.fillStyle = 'rgba(100,200,255,0.4)'; ctx.fillRect(ox+7,oy-3,10,5);
    // glowing eyes through visor
    ctx.fillStyle = '#e74c3c'; ctx.fillRect(ox+8,oy-2,4,2); ctx.fillRect(ox+13,oy-2,4,2);
  }
}

// ── PIZZA SLICE ───────────────────────────────
export function drawPizza(ctx, pz, scrollX, frame) {
  if (pz.collected) return;
  const ox = pz.x - scrollX;
  const oy = pz.y + Math.sin(frame * 0.08 + pz.bob) * 5;
  if (ox > 900 || ox < -60) return;

  const tipX=ox+14, tipY=oy+2, leftX=ox, leftY=oy+26, rightX=ox+28, rightY=oy+26;
  ctx.fillStyle = '#C8860A';
  ctx.beginPath(); ctx.moveTo(tipX,tipY); ctx.lineTo(leftX,leftY); ctx.lineTo(rightX,rightY); ctx.closePath(); ctx.fill();
  ctx.fillStyle = '#FFD966';
  ctx.beginPath(); ctx.moveTo(tipX,tipY+5); ctx.lineTo(leftX+3,leftY-2); ctx.lineTo(rightX-3,rightY-2); ctx.closePath(); ctx.fill();
  ctx.fillStyle = '#C0392B';
  ctx.beginPath(); ctx.moveTo(tipX,tipY+8); ctx.lineTo(leftX+5,leftY-3); ctx.lineTo(rightX-5,rightY-3); ctx.closePath(); ctx.fill();
  // crust bumps
  ctx.fillStyle = '#b8750a';
  [leftX+1,leftX+6,leftX+12,leftX+18,leftX+24].forEach(x=>{ctx.beginPath();ctx.arc(x,leftY,3,0,Math.PI*2);ctx.fill();});
  // pepperoni
  ctx.fillStyle = '#8B0000';
  [[tipX-2,tipY+10],[tipX+6,tipY+15],[tipX-7,tipY+17]].forEach(([cx,cy])=>{ctx.beginPath();ctx.arc(cx,cy,3,0,Math.PI*2);ctx.fill();});
  // glow
  ctx.shadowBlur = 8; ctx.shadowColor = '#FF8C00';
  ctx.strokeStyle = 'rgba(255,140,0,0.3)'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(tipX,tipY); ctx.lineTo(leftX,leftY); ctx.lineTo(rightX,rightY); ctx.closePath(); ctx.stroke();
  ctx.shadowBlur = 0;
  // label
  ctx.fillStyle = GLD; ctx.font = '10px "Press Start 2P"'; ctx.textAlign = 'center';
  ctx.fillText('+100', ox+14, oy-6);
}

// ── HEART PICKUP ──────────────────────────────
export function drawHeart(ctx, h, scrollX, frame) {
  if (h.collected) return;
  const ox = h.x - scrollX;
  const oy = h.y + Math.sin(frame * 0.1 + h.bob) * 4;
  if (ox > 900 || ox < -40) return;
  ctx.shadowBlur = 10; ctx.shadowColor = '#e74c3c';
  ctx.fillStyle = '#e74c3c';
  // pixel heart
  ctx.fillRect(ox+2,oy+2,4,4); ctx.fillRect(ox+8,oy+2,4,4);
  ctx.fillRect(ox,oy+4,14,4); ctx.fillRect(ox+2,oy+8,10,4);
  ctx.fillRect(ox+4,oy+12,6,3); ctx.fillRect(ox+6,oy+14,2,2);
  ctx.fillStyle = '#ff8888';
  ctx.fillRect(ox+3,oy+3,2,2); ctx.fillRect(ox+9,oy+3,2,2);
  ctx.shadowBlur = 0;
  ctx.fillStyle = '#ffaaaa'; ctx.font = '7px "Press Start 2P"'; ctx.textAlign = 'center';
  ctx.fillText('+HP', ox+7, oy-3);
}

// ── BOSSES ────────────────────────────────────
export function drawBoss(ctx, boss, scrollX, frame) {
  if (!boss || boss.dead) return;
  const ox = boss.x - scrollX;
  const oy = boss.y;
  if (ox > 920 || ox + boss.w < -100) return;

  const bob = Math.sin(frame * 0.05) * 4;
  const angry = boss.hitFlash > 0;

  if (boss.type === 'landlord') {
    drawLandlord(ctx, ox, oy + bob, boss.hp, boss.maxHp, angry);
  } else if (boss.type === 'ratking') {
    drawRatKing(ctx, ox, oy + bob, boss.hp, boss.maxHp, angry);
  } else if (boss.type === 'recordexec') {
    drawRecordExec(ctx, ox, oy + bob, boss.hp, boss.maxHp, angry);
  }

  // HP bar
  const barW = boss.w + 20;
  const barX = ox - 10;
  const barY = oy - 28;
  const pct = boss.hp / boss.maxHp;
  ctx.fillStyle = 'rgba(0,0,0,0.75)'; ctx.fillRect(barX-2,barY-2,barW+4,14);
  ctx.fillStyle = pct > 0.5 ? '#2ecc71' : pct > 0.25 ? '#f39c12' : '#e74c3c';
  ctx.fillRect(barX,barY,Math.max(0,barW*pct),10);
  ctx.strokeStyle = GLD; ctx.lineWidth = 2; ctx.strokeRect(barX-2,barY-2,barW+4,14);
  ctx.fillStyle = GLD; ctx.font = '8px "Press Start 2P"'; ctx.textAlign = 'center';
  ctx.fillText(boss.label, ox + boss.w/2, barY - 8);
}

function drawLandlord(ctx, ox, oy, hp, maxHp, angry) {
  // LANDLORD — fat suit, eviction notice, angry mustache
  const bx = ox, by = oy;
  // feet
  ctx.fillStyle = '#111'; ctx.fillRect(bx+4,by+72,18,8); ctx.fillRect(bx+38,by+72,18,8);
  // legs — dark trousers
  ctx.fillStyle = '#1a1a3a'; ctx.fillRect(bx+8,by+52,14,22); ctx.fillRect(bx+38,by+52,14,22);
  // body — grey suit
  ctx.fillStyle = angry ? '#8B0000' : '#4a4a6a';
  ctx.fillRect(bx,by+20,boss_w(60),32);
  ctx.fillStyle = angry ? '#aa1010' : '#5a5a7a';
  ctx.fillRect(bx+4,by+20,52,14);
  // tie
  ctx.fillStyle = '#e74c3c';
  ctx.fillRect(bx+22,by+22,6,22);
  ctx.beginPath(); ctx.moveTo(bx+22,by+22); ctx.lineTo(bx+28,by+22); ctx.lineTo(bx+26,by+34); ctx.closePath(); ctx.fill();
  // arms
  ctx.fillStyle = angry ? '#8B0000' : '#4a4a6a';
  ctx.fillRect(bx-10,by+20,12,22); ctx.fillRect(bx+58,by+20,12,22);
  ctx.fillStyle = '#c8a070';
  ctx.fillRect(bx-10,by+38,12,8); ctx.fillRect(bx+58,by+38,12,8);
  // eviction notice in right hand
  ctx.fillStyle = '#fffde7'; ctx.fillRect(bx+68,by+36,16,22);
  ctx.fillStyle = '#e74c3c'; ctx.font = '4px sans-serif'; ctx.textAlign = 'center';
  ctx.fillText('EVICT', bx+76, by+43); ctx.fillText('NOTICE', bx+76, by+50);
  // head
  ctx.fillStyle = '#d4905a'; ctx.fillRect(bx+14,by-10,32,32);
  ctx.fillStyle = '#e4a06a'; ctx.fillRect(bx+16,by-10,28,12);
  // hair ring
  ctx.fillStyle = '#5c3d1a'; ctx.fillRect(bx+12,by-8,6,8); ctx.fillRect(bx+42,by-8,6,8);
  // eyes
  ctx.fillStyle = '#111'; ctx.fillRect(bx+18,by+2,8,6); ctx.fillRect(bx+36,by+2,8,6);
  ctx.fillStyle = '#fff'; ctx.fillRect(bx+19,by+3,3,3); ctx.fillRect(bx+37,by+3,3,3);
  // brows — angry or normal
  ctx.strokeStyle = '#5c3d1a'; ctx.lineWidth = 3;
  if (angry) {
    ctx.beginPath(); ctx.moveTo(bx+17,by-3); ctx.lineTo(bx+27,by+1); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(bx+44,by-3); ctx.lineTo(bx+34,by+1); ctx.stroke();
  } else {
    ctx.fillStyle = '#5c3d1a'; ctx.fillRect(bx+17,by-2,10,3); ctx.fillRect(bx+34,by-2,10,3);
  }
  // mustache
  ctx.fillStyle = '#5c3d1a';
  ctx.beginPath(); ctx.arc(bx+26,by+14,6,Math.PI,0); ctx.fill();
  ctx.beginPath(); ctx.arc(bx+36,by+14,6,Math.PI,0); ctx.fill();
}

function drawRatKing(ctx, ox, oy, hp, maxHp, angry) {
  // RAT KING — giant rat with golden crown, purple robe
  const bx = ox, by = oy;
  // tail
  ctx.strokeStyle = '#a07050'; ctx.lineWidth = 4;
  ctx.beginPath(); ctx.moveTo(bx+8,by+80); ctx.quadraticCurveTo(bx-40,by+90,bx-50,by+68); ctx.stroke();
  ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(bx+8,by+80); ctx.quadraticCurveTo(bx-38,by+86,bx-46,by+66); ctx.stroke();
  // legs
  ctx.fillStyle = '#6a6060'; ctx.fillRect(bx+5,by+70,16,14); ctx.fillRect(bx+40,by+70,16,14);
  // claws
  ctx.fillStyle = '#888'; [0,5,10].forEach(d=>ctx.fillRect(bx+5+d,by+82,3,5));
  [0,5,10].forEach(d=>ctx.fillRect(bx+40+d,by+82,3,5));
  // robe — purple
  ctx.fillStyle = angry ? '#5a0060' : '#6a2a8a';
  ctx.fillRect(bx+2,by+22,58,50);
  ctx.fillStyle = angry ? '#7a2080' : '#8a3aaa';
  ctx.fillRect(bx+6,by+22,50,18);
  // robe trim — gold
  ctx.fillStyle = GLD;
  ctx.fillRect(bx+2,by+20,58,4);
  ctx.fillRect(bx+2,by+70,58,3);
  ctx.fillRect(bx+2,by+22,4,50); ctx.fillRect(bx+56,by+22,4,50);
  // arms
  ctx.fillStyle = '#6a6060'; ctx.fillRect(bx-12,by+22,16,30); ctx.fillRect(bx+58,by+22,16,30);
  ctx.fillStyle = '#888'; ctx.fillRect(bx-12,by+50,16,8); ctx.fillRect(bx+58,by+50,16,8);
  // body / head — big fat rat
  ctx.fillStyle = '#7a7070'; ctx.beginPath(); ctx.ellipse(bx+31,by+14,28,22,0,0,Math.PI*2); ctx.fill();
  ctx.fillStyle = '#9a9090'; ctx.beginPath(); ctx.ellipse(bx+31,by+8,20,16,0,0,Math.PI*2); ctx.fill();
  // ears
  ctx.fillStyle = '#c87070'; ctx.beginPath(); ctx.ellipse(bx+12,by-8,10,13,-.3,0,Math.PI*2); ctx.fill();
  ctx.fillStyle = '#c87070'; ctx.beginPath(); ctx.ellipse(bx+50,by-8,10,13,.3,0,Math.PI*2); ctx.fill();
  ctx.fillStyle = '#e89090'; ctx.beginPath(); ctx.ellipse(bx+12,by-8,5,8,-.3,0,Math.PI*2); ctx.fill();
  ctx.fillStyle = '#e89090'; ctx.beginPath(); ctx.ellipse(bx+50,by-8,5,8,.3,0,Math.PI*2); ctx.fill();
  // eyes — big red
  ctx.fillStyle = '#cc0000'; ctx.beginPath(); ctx.arc(bx+20,by+6,7,0,Math.PI*2); ctx.fill();
  ctx.fillStyle = '#cc0000'; ctx.beginPath(); ctx.arc(bx+42,by+6,7,0,Math.PI*2); ctx.fill();
  ctx.fillStyle = '#330000'; ctx.beginPath(); ctx.arc(bx+20,by+6,4,0,Math.PI*2); ctx.fill();
  ctx.fillStyle = '#330000'; ctx.beginPath(); ctx.arc(bx+42,by+6,4,0,Math.PI*2); ctx.fill();
  ctx.fillStyle = '#fff'; ctx.fillRect(bx+17,by+3,3,3); ctx.fillRect(bx+39,by+3,3,3);
  // snout
  ctx.fillStyle = '#c87070'; ctx.beginPath(); ctx.ellipse(bx+31,by+16,9,6,0,0,Math.PI*2); ctx.fill();
  ctx.fillStyle = '#cc0000'; ctx.beginPath(); ctx.arc(bx+31,by+12,3,0,Math.PI*2); ctx.fill();
  // whiskers
  ctx.strokeStyle = '#ddd'; ctx.lineWidth = 1;
  [-1,1].forEach(dir => {
    [12,17,22].forEach((y,i) => {
      ctx.beginPath(); ctx.moveTo(bx+31,by+y); ctx.lineTo(bx+31+dir*(22+i*4),by+y-2); ctx.stroke();
    });
  });
  // CROWN — gold
  ctx.fillStyle = GLD;
  ctx.fillRect(bx+8,by-24,46,14);
  ctx.fillStyle = '#ffe060';
  // crown points
  [[bx+8,by-36],[bx+20,by-30],[bx+31,by-40],[bx+42,by-30],[bx+46,by-36]].forEach(([cx,cy])=>{
    ctx.beginPath(); ctx.moveTo(cx-1,by-24); ctx.lineTo(cx+5,cy); ctx.lineTo(cx+11,by-24); ctx.closePath(); ctx.fill();
  });
  ctx.fillStyle = GLD; ctx.fillRect(bx+8,by-24,46,14);
  // crown gems
  ctx.fillStyle = '#e74c3c'; ctx.beginPath(); ctx.arc(bx+19,by-16,4,0,Math.PI*2); ctx.fill();
  ctx.fillStyle = '#3498db'; ctx.beginPath(); ctx.arc(bx+31,by-16,4,0,Math.PI*2); ctx.fill();
  ctx.fillStyle = '#2ecc71'; ctx.beginPath(); ctx.arc(bx+43,by-16,4,0,Math.PI*2); ctx.fill();
  if (angry) {
    ctx.strokeStyle = '#330000'; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(bx+12,by-2); ctx.lineTo(bx+24,by+4); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(bx+50,by-2); ctx.lineTo(bx+38,by+4); ctx.stroke();
  }
}

function drawRecordExec(ctx, ox, oy, hp, maxHp, angry) {
  // RECORD EXEC — sleazy suit, giant sunglasses, contract
  const bx = ox, by = oy;
  // feet
  ctx.fillStyle = '#111'; ctx.fillRect(bx+4,by+72,18,8); ctx.fillRect(bx+38,by+72,18,8);
  // fancy shoes — pointed
  ctx.fillStyle = '#1a1a1a'; ctx.fillRect(bx+2,by+74,22,6); ctx.fillRect(bx+36,by+74,22,6);
  ctx.fillStyle = '#333'; ctx.fillRect(bx+22,by+76,4,3); ctx.fillRect(bx+56,by+76,4,3);
  // legs — shiny pants
  ctx.fillStyle = '#1a0a2a'; ctx.fillRect(bx+8,by+52,14,22); ctx.fillRect(bx+38,by+52,14,22);
  // body — flashy suit
  ctx.fillStyle = angry ? '#6a0020' : '#8B2252';
  ctx.fillRect(bx,by+20,60,32);
  ctx.fillStyle = angry ? '#8a0030' : '#aa3370';
  ctx.fillRect(bx+4,by+20,52,14);
  // shirt + bolo tie
  ctx.fillStyle = '#f5f5dc'; ctx.fillRect(bx+22,by+22,16,22);
  ctx.fillStyle = '#cc0000'; ctx.fillRect(bx+28,by+24,4,18);
  ctx.fillStyle = GLD; ctx.beginPath(); ctx.arc(bx+30,by+30,4,0,Math.PI*2); ctx.fill();
  // arms
  ctx.fillStyle = angry ? '#6a0020' : '#8B2252';
  ctx.fillRect(bx-10,by+20,12,24); ctx.fillRect(bx+58,by+20,12,24);
  ctx.fillStyle = '#c8a070';
  ctx.fillRect(bx-10,by+40,12,8); ctx.fillRect(bx+58,by+40,12,8);
  // contract in left hand
  ctx.fillStyle = '#fffde7'; ctx.fillRect(bx-20,by+32,16,22);
  ctx.fillStyle = '#e74c3c'; ctx.font = '4px sans-serif'; ctx.textAlign = 'center';
  ctx.fillText('SIGN', bx-12, by+40); ctx.fillText('HERE', bx-12, by+46);
  ctx.fillStyle = '#1a1a1a'; ctx.fillRect(bx-18,by+50,12,1); ctx.fillRect(bx-18,by+53,12,1);
  // pen in right hand
  ctx.fillStyle = GLD; ctx.fillRect(bx+68,by+38,4,18);
  ctx.fillStyle = '#1a1a1a'; ctx.fillRect(bx+68,by+54,4,4);
  // head
  ctx.fillStyle = '#c8a070'; ctx.fillRect(bx+14,by-10,32,32);
  ctx.fillStyle = '#d8b080'; ctx.fillRect(bx+16,by-10,28,12);
  // slicked hair
  ctx.fillStyle = '#1a1a1a'; ctx.fillRect(bx+12,by-12,36,6);
  ctx.fillStyle = '#2a2a2a'; ctx.fillRect(bx+14,by-12,28,3);
  // HUGE sunglasses
  ctx.fillStyle = '#111';
  ctx.fillRect(bx+14,by+2,14,10); ctx.fillRect(bx+32,by+2,14,10);
  ctx.fillRect(bx+28,by+4,4,6);
  ctx.fillStyle = angry ? 'rgba(255,0,0,0.35)' : 'rgba(100,0,200,0.35)';
  ctx.fillRect(bx+15,by+3,12,8); ctx.fillRect(bx+33,by+3,12,8);
  // nose
  ctx.fillStyle = '#b8905a'; ctx.fillRect(bx+28,by+15,4,4);
  // smirk
  ctx.fillStyle = '#9a6a40';
  ctx.beginPath(); ctx.moveTo(bx+22,by+20); ctx.lineTo(bx+38,by+18); ctx.lineTo(bx+38,by+20); ctx.closePath(); ctx.fill();
  // chain
  ctx.strokeStyle = GLD; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.arc(bx+30,by+30,8,0.8,2.3); ctx.stroke();
  if (angry) {
    ctx.strokeStyle = '#333'; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(bx+13,by-4); ctx.lineTo(bx+28,by+2); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(bx+48,by-4); ctx.lineTo(bx+33,by+2); ctx.stroke();
  }
}

// helper
function boss_w(w) { return w; }
