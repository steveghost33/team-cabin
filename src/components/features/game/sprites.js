import { PW, PH, GLD } from './constants.js';
import { drawHeroArt, drawEnemyArt, drawBossArt } from './pixelArt.js';

export function drawPlayer(ctx, pl, charIdx, frame) {
  if (!pl.dying && pl.inv > 0 && Math.floor(pl.inv / 5) % 2 === 0) return;
  const px = Math.round(pl.x), py = Math.round(pl.y);
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
  } else if (pl.face === -1) {
    ctx.translate(px + PW, 0);
    ctx.scale(-1, 1);
    ctx.translate(-px, 0);
  }
  const walking = Math.abs(pl.vx) > 0.1 && pl.og;
  const pose = pl.dying ? 0 : !pl.og ? 3 : walking ? 1 + Math.floor(frame / 7) % 2 : 0;
  drawHeroArt(ctx, charIdx, px - 4, py - 16, pose, pl.dying);
  ctx.restore();
}

export function drawCharPreview(ctx, idx, cx, cy, scale) {
  ctx.save();
  ctx.translate(Math.round(cx - 16 * scale), Math.round(cy - 24 * scale));
  ctx.scale(scale, scale);
  drawHeroArt(ctx, idx, 0, 0);
  ctx.restore();
}

export function drawEnemy(ctx, o, scrollX, frame) {
  const x = Math.round(o.x - scrollX), y = Math.round(o.y);
  if (x > 900 || x + o.w < -80) return;
  ctx.save();
  if (o.dead) ctx.globalAlpha = Math.max(0, Math.min(1, o.deadTimer / 30));
  drawEnemyArt(ctx, o.type, x, y, frame, o.dead);
  if (o.hitFlash > 0 && !o.dead) {
    ctx.globalAlpha = 0.55 * (o.hitFlash / 25);
    ctx.fillStyle = '#ff7700';
    ctx.fillRect(x - 1, y - 1, o.w + 2, o.h + 2);
  }
  ctx.restore();
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

// Boss artwork shares the same pixel grid and flat palette as the heroes.
export function drawBoss(ctx, boss, scrollX, frame) {
  if (!boss || boss.dead) return;
  const x = Math.round(boss.x - scrollX), y = Math.round(boss.y);
  if (x > 920 || x + boss.w < -100) return;
  ctx.save();
  drawBossArt(ctx, boss.type, x, y, boss.hitFlash > 0, frame);
  const barW = boss.w + 20;
  const barX = x - 10, barY = y - 32;
  const pct = Math.max(0, Math.min(1, boss.hp / boss.maxHp));
  ctx.fillStyle = '#17152b'; ctx.fillRect(barX - 2, barY - 2, barW + 4, 14);
  ctx.fillStyle = pct > 0.5 ? '#83be54' : pct > 0.25 ? '#efbc32' : '#ed4e43';
  ctx.fillRect(barX, barY, Math.round(barW * pct), 10);
  ctx.strokeStyle = GLD; ctx.lineWidth = 2; ctx.strokeRect(barX - 2, barY - 2, barW + 4, 14);
  ctx.fillStyle = GLD; ctx.font = '8px "Press Start 2P"'; ctx.textAlign = 'center';
  ctx.fillText(boss.label, x + boss.w / 2, barY - 8);
  ctx.restore();
}
