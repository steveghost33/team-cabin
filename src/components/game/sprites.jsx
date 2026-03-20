export function drawCharSprite(ctx, idx, px, py, PW, C) {
  const s = PW / 24;
  function r(x, y, w, h, fill) { ctx.fillStyle=fill; ctx.fillRect(px+x*s, py+y*s, w*s, h*s); }

  if (idx === 0) {
    // STEVE — plaid flannel, beard, glasses
    r(0,26,8,3,'#111'); r(13,26,8,3,'#111');
    r(1,20,7,10,'#1c1c2c'); r(13,20,7,10,'#1c1c2c');
    r(1,19,20,2,'#3a2a10'); r(8,19,6,2,'#c8a020');
    r(-1,10,24,10,'#848688');
    ctx.fillStyle='rgba(90,92,94,0.5)';
    [12,15,18].forEach(y=>ctx.fillRect(px-s,py+y*s,24*s,s));
    [3,9,15].forEach(x=>ctx.fillRect(px+x*s,py+10*s,2*s,10*s));
    r(8,10,6,4,'#4a6030');
    r(-5,10,5,8,'#848688'); r(PW+1,10,5,8,'#848688');
    r(-5,17,5,3,'#e0c090'); r(PW+1,17,5,3,'#e0c090');
    r(3,7,6,4,'#e0c090');
    r(3,1,16,9,'#e0c090');
    ctx.fillStyle='rgba(138,112,69,0.35)'; ctx.fillRect(px+3*s,py+s,16*s,2*s);
    r(3,8,16,3,'#8a7045'); r(4,7,3,2,'#8a7045'); r(15,7,3,2,'#8a7045');
    r(6,4,3,3,'#1a1a1a'); r(13,4,3,3,'#1a1a1a');
    ctx.strokeStyle='#7a6535'; ctx.lineWidth=s;
    ctx.strokeRect(px+5*s,py+3*s,5*s,4*s); ctx.strokeRect(px+12*s,py+3*s,5*s,4*s);
    r(10,5,2,1,'#7a6535');

  } else if (idx === 1) {
    // MIKE — plain grey hoodie NO logo, mustard yellow fitted snapback
    r(0,26,8,3,'#2a2a2a'); r(13,26,8,3,'#2a2a2a');
    ctx.fillStyle='rgba(255,255,255,0.25)';
    ctx.fillRect(px,py+31*s,8*s,s); ctx.fillRect(px+13*s,py+31*s,8*s,s);
    r(1,20,7,10,'#7B2D3A'); r(13,20,7,10,'#7B2D3A');
    r(3,20,3,5,'#9a3a4a'); r(16,20,3,5,'#9a3a4a');
    r(1,19,20,2,'#2a2a2a');
    r(-1,10,24,10,'#9a9a9a');
    r(-1,10,24,3,'#adadad'); r(-1,17,24,3,'#888');
    r(4,15,14,4,'#888'); r(4,15,14,1,'#777');
    r(10,10,2,10,'#878787');
    r(-5,10,5,8,'#9a9a9a'); r(PW+1,10,5,8,'#9a9a9a');
    r(-5,16,5,2,'#888'); r(PW+1,16,5,2,'#888');
    r(-5,17,5,3,'#c49a6c'); r(PW+1,17,5,3,'#c49a6c');
    r(3,7,6,4,'#c49a6c');
    r(3,1,16,9,'#c49a6c'); r(5,1,12,4,'#d4aa7c');
    r(3,7,16,4,'#1a0f05'); r(4,6,3,2,'#1a0f05'); r(15,6,3,2,'#1a0f05');
    r(6,4,3,3,'#111'); r(13,4,3,3,'#111');
    ctx.fillStyle='rgba(255,255,255,0.4)';
    ctx.fillRect(px+6*s,py+4*s,s,s); ctx.fillRect(px+13*s,py+4*s,s,s);
    // mustard yellow fitted snapback
    r(2,0,18,4,'#c8a020'); r(4,0,14,2,'#d8b030');
    r(0,1,4,3,'#c8a020'); r(18,1,4,3,'#c8a020');
    r(-1,3,24,2,'#c8a020'); r(-1,4,24,1,'#a07810');
    r(9,0,4,1,'#b89018'); r(7,3,8,2,'#b89018');

  } else {
    // KYLE — dark olive Patagonia zip fleece, brown hair, glasses
    r(0,26,8,3,'#4a3020'); r(13,26,8,3,'#4a3020');
    r(0,31,8,1,'#6a5040'); r(13,31,8,1,'#6a5040');
    r(1,20,7,10,'#2a2a2a'); r(13,20,7,10,'#2a2a2a');
    r(3,20,3,5,'#383838'); r(16,20,3,5,'#383838');
    r(1,19,20,2,'#3a3020');
    r(-1,10,24,10,'#2D4A1E');
    r(-1,10,24,3,'#3D5A2A'); r(-1,17,24,3,'#1D3A10');
    r(10,10,2,10,'#1D3A10'); r(10,12,2,6,'#aaa');
    r(0,12,7,5,'#3a6a28'); r(1,13,5,2,'#D4A017');
    r(1,13,5,1,'#1D3A10'); r(1,14,5,1,'#fff');
    r(7,9,8,3,'#1D3A10');
    r(-5,10,5,8,'#2D4A1E'); r(PW+1,10,5,8,'#2D4A1E');
    r(-5,16,5,2,'#1D3A10'); r(PW+1,16,5,2,'#1D3A10');
    r(-5,17,5,3,'#d4b07a'); r(PW+1,17,5,3,'#d4b07a');
    r(3,7,6,4,'#d4b07a');
    r(3,1,16,9,'#d4b07a'); r(5,1,12,4,'#e4c08a');
    r(3,1,16,3,'#6B4C2A'); r(5,1,12,1,'#7B5C3A');
    r(-2,2,4,9,'#6B4C2A'); r(18,2,4,9,'#6B4C2A');
    ctx.fillStyle='rgba(138,96,48,0.3)';
    ctx.fillRect(px+4*s,py+8*s,14*s,2*s);
    r(6,4,3,3,'#1a1a1a'); r(13,4,3,3,'#1a1a1a');
    ctx.fillStyle='rgba(255,255,255,0.35)';
    ctx.fillRect(px+6*s,py+4*s,s,s); ctx.fillRect(px+13*s,py+4*s,s,s);
    ctx.strokeStyle='#8B6C4A'; ctx.lineWidth=s;
    ctx.strokeRect(px+5*s,py+3*s,5*s,4*s); ctx.strokeRect(px+12*s,py+3*s,5*s,4*s);
    r(10,5,2,1,'#8B6C4A');
    ctx.fillStyle='rgba(196,144,106,0.55)';
    ctx.fillRect(px+7*s,py+9*s,8*s,s);
  }
}

export function drawPizzaSlice(ctx, ox, py, C) {
  const tipX=ox+14,tipY=py+2,leftX=ox,leftY=py+26,rightX=ox+28,rightY=py+26;
  ctx.fillStyle='#C8860A';
  ctx.beginPath();ctx.moveTo(tipX,tipY);ctx.lineTo(leftX,leftY);ctx.lineTo(rightX,rightY);ctx.closePath();ctx.fill();
  ctx.fillStyle='#FFD966';
  ctx.beginPath();ctx.moveTo(tipX,tipY+4);ctx.lineTo(leftX+3,leftY-2);ctx.lineTo(rightX-3,rightY-2);ctx.closePath();ctx.fill();
  ctx.fillStyle='#C0392B';
  ctx.beginPath();ctx.moveTo(tipX,tipY+7);ctx.lineTo(leftX+5,leftY-3);ctx.lineTo(rightX-5,rightY-3);ctx.closePath();ctx.fill();
  ctx.fillStyle='#b8750a';
  [leftX+1,leftX+6,leftX+12,leftX+18,leftX+24].forEach(x=>{ctx.beginPath();ctx.arc(x,leftY,3,0,Math.PI*2);ctx.fill();});
  ctx.fillStyle='#8B0000';
  [[tipX-2,tipY+10],[tipX+5,tipY+15],[tipX-6,tipY+17]].forEach(([cx,cy])=>{ctx.beginPath();ctx.arc(cx,cy,3,0,Math.PI*2);ctx.fill();});
  ctx.shadowBlur=8;ctx.shadowColor='#FF8C00';
  ctx.strokeStyle='rgba(255,140,0,0.3)';ctx.lineWidth=2;
  ctx.beginPath();ctx.moveTo(tipX,tipY);ctx.lineTo(leftX,leftY);ctx.lineTo(rightX,rightY);ctx.closePath();ctx.stroke();
  ctx.shadowBlur=0;
  ctx.fillStyle=C.gold;ctx.font='11px "Press Start 2P"';ctx.textAlign='center';
  ctx.fillText('+100',ox+14,py-6);
}

export function drawTaco(ctx, ox, py, C) {
  ctx.fillStyle='#D4A017';
  ctx.beginPath();ctx.ellipse(ox+14,py+18,14,8,0,0,Math.PI);ctx.fill();
  ctx.strokeStyle='#b8860b';ctx.lineWidth=1;
  ctx.beginPath();ctx.ellipse(ox+14,py+18,14,8,0,0,Math.PI);ctx.stroke();
  ctx.fillStyle='#2ecc71';ctx.fillRect(ox+4,py+10,20,6);
  ctx.fillStyle='#27ae60';
  [ox+4,ox+8,ox+12,ox+16,ox+20].forEach(x=>ctx.fillRect(x,py+8,3,5));
  ctx.fillStyle='#8B4513';ctx.fillRect(ox+5,py+12,18,4);
  ctx.fillStyle='#FFD700';ctx.fillRect(ox+6,py+11,16,3);
  ctx.fillStyle='#e74c3c';
  [ox+7,ox+13,ox+18].forEach(x=>{ctx.beginPath();ctx.arc(x,py+13,2,0,Math.PI*2);ctx.fill();});
  ctx.fillStyle=C.gold;ctx.font='11px "Press Start 2P"';ctx.textAlign='center';
  ctx.fillText('+100',ox+14,py-6);
}

export function drawEnemySprite(ctx, o, scrollX, C) {
  const ox=o.x-scrollX,oy=o.y;
  if(ox>900||ox+o.w<-80) return;
  if(o.dead){
    ctx.globalAlpha=Math.max(0,o.deadTimer/30);
    ctx.font='18px serif';ctx.textAlign='center';
    ctx.fillText('💀',ox+o.w/2,oy+o.h-2);
    ctx.globalAlpha=1;return;
  }
  o.at++;
  const walk=Math.sin(o.at*0.2)*3;

  if(o.type==='cone'){
    ctx.fillStyle='#333';ctx.fillRect(ox-3,oy+22,24,5);
    ctx.fillStyle='#FF6600';
    ctx.beginPath();ctx.moveTo(ox+9,oy);ctx.lineTo(ox-2,oy+24);ctx.lineTo(ox+20,oy+24);ctx.closePath();ctx.fill();
    ctx.fillStyle='#FF8C22';
    ctx.beginPath();ctx.moveTo(ox+9,oy);ctx.lineTo(ox+9,oy+24);ctx.lineTo(ox+20,oy+24);ctx.closePath();ctx.fill();
    ctx.fillStyle='#fff';ctx.fillRect(ox+1,oy+8,16,3);ctx.fillRect(ox+3,oy+14,12,3);
    ctx.fillStyle='rgba(255,220,0,0.35)';ctx.fillRect(ox-4,oy+20,26,4);

  } else if(o.type==='rat'){
    // small realistic rat — 12×10
    ctx.strokeStyle='#a07050';ctx.lineWidth=1.5;
    ctx.beginPath();ctx.moveTo(ox,oy+6);ctx.quadraticCurveTo(ox-6,oy+10,ox-9,oy+6);ctx.stroke();
    ctx.fillStyle='#6a6060';
    ctx.beginPath();ctx.ellipse(ox+6,oy+6,6,5,0,0,Math.PI*2);ctx.fill();
    ctx.fillStyle='#8a8080';
    ctx.beginPath();ctx.ellipse(ox+6,oy+5,4,3,0,0,Math.PI*2);ctx.fill();
    ctx.fillStyle='#6a6060';
    ctx.beginPath();ctx.ellipse(ox+11,oy+4,4,3,0,0,Math.PI*2);ctx.fill();
    ctx.fillStyle='#7a7070';
    ctx.beginPath();ctx.ellipse(ox+12,oy+3,2.5,2,0,0,Math.PI*2);ctx.fill();
    ctx.fillStyle='#c87070';
    ctx.beginPath();ctx.ellipse(ox+10,oy+1,2,3,-.2,0,Math.PI*2);ctx.fill();
    ctx.fillStyle='#e89090';
    ctx.beginPath();ctx.ellipse(ox+10,oy+1,1,2,-.2,0,Math.PI*2);ctx.fill();
    ctx.fillStyle='#cc0000';
    ctx.beginPath();ctx.arc(ox+12,oy+3,1.5,0,Math.PI*2);ctx.fill();
    ctx.fillStyle='#000';
    ctx.beginPath();ctx.arc(ox+12,oy+3,0.8,0,Math.PI*2);ctx.fill();
    ctx.fillStyle='#ff8888';
    ctx.beginPath();ctx.ellipse(ox+14,oy+5,2,1.5,0,0,Math.PI*2);ctx.fill();
    ctx.fillStyle='#ff4444';
    ctx.beginPath();ctx.arc(ox+15,oy+5,1,0,Math.PI*2);ctx.fill();
    ctx.fillStyle='#555';
    ctx.fillRect(ox+3,oy+9+walk,3,3);ctx.fillRect(ox+8,oy+9-walk,3,3);

  } else if(o.type==='metermaid'){
    // player-sized 24×32
    ctx.fillStyle='#1a4a1a';ctx.fillRect(ox+3,oy+22,7,10+walk);ctx.fillRect(ox+14,oy+22,7,10-walk);
    ctx.fillStyle='#111';ctx.fillRect(ox+1,oy+30,9,4);ctx.fillRect(ox+13,oy+30,9,4);
    ctx.fillStyle='#333';ctx.fillRect(ox+3,oy+30,6,3);ctx.fillRect(ox+15,oy+30,6,3);
    ctx.fillStyle='#1a6c1a';ctx.fillRect(ox+1,oy+10,22,13);
    ctx.fillStyle='#2a7c2a';ctx.fillRect(ox+3,oy+10,18,6);
    ctx.fillStyle='#0a5a0a';ctx.fillRect(ox+1,oy+20,22,4);
    ctx.fillStyle=C.gold;ctx.fillRect(ox+9,oy+14,6,5);
    ctx.fillStyle='#c89000';ctx.fillRect(ox+9,oy+14,6,3);
    ctx.fillStyle='#fff';ctx.fillRect(ox+10,oy+15,4,2);
    ctx.fillStyle='#1a6c1a';ctx.fillRect(ox-4,oy+10,6,11);ctx.fillRect(ox+22,oy+10,6,11);
    ctx.fillStyle='#c8855a';ctx.fillRect(ox-4,oy+19,6,4);ctx.fillRect(ox+22,oy+19,6,4);
    ctx.fillStyle='#fff';ctx.fillRect(ox+22,oy+13,8,9);
    ctx.fillStyle='#ddd';ctx.fillRect(ox+23,oy+15,6,1);ctx.fillRect(ox+23,oy+18,6,1);
    ctx.fillStyle='#c8855a';ctx.fillRect(ox+7,oy+2,10,10);
    ctx.fillStyle='#d89060';ctx.fillRect(ox+9,oy+2,7,5);
    ctx.fillStyle='#1a4a1a';ctx.fillRect(ox+5,oy-2,14,5);
    ctx.fillStyle='#2a5a2a';ctx.fillRect(ox+7,oy-2,10,2);
    ctx.fillStyle=C.gold;ctx.fillRect(ox+7,oy-1,10,2);
    ctx.fillStyle='#1a4a1a';ctx.fillRect(ox+3,oy+2,18,3);
    ctx.fillStyle='#1a1a1a';ctx.fillRect(ox+9,oy+4,3,3);ctx.fillRect(ox+14,oy+4,3,3);
    ctx.fillStyle='#fff';ctx.fillRect(ox+9,oy+4,1,1);ctx.fillRect(ox+14,oy+4,1,1);
    ctx.fillStyle='#8B4513';ctx.fillRect(ox+10,oy+8,6,2);

  } else if(o.type==='muscledude'){
    // player-sized 24×32
    ctx.fillStyle='#222';ctx.fillRect(ox+3,oy+22,8,10+walk);ctx.fillRect(ox+13,oy+22,8,10-walk);
    ctx.fillStyle='#111';ctx.fillRect(ox+1,oy+30,10,4);ctx.fillRect(ox+13,oy+30,10,4);
    ctx.fillStyle='#333';ctx.fillRect(ox+3,oy+30,6,3);ctx.fillRect(ox+15,oy+30,6,3);
    ctx.fillStyle='#8B0000';ctx.fillRect(ox,oy+10,24,13);
    ctx.fillStyle='#aa1010';ctx.fillRect(ox+2,oy+10,20,6);
    ctx.fillStyle='#6a0000';ctx.fillRect(ox,oy+20,24,4);
    ctx.fillStyle='#fff';ctx.font='5px sans-serif';ctx.textAlign='center';
    ctx.fillText('NO PKG',ox+12,oy+17);
    ctx.fillStyle='#8B0000';ctx.fillRect(ox-6,oy+10,8,14);ctx.fillRect(ox+22,oy+10,8,14);
    ctx.fillStyle='#aa1010';ctx.fillRect(ox-4,oy+10,4,10);ctx.fillRect(ox+24,oy+10,4,10);
    ctx.fillStyle='#c8855a';ctx.fillRect(ox-8,oy+22,10,6);ctx.fillRect(ox+22,oy+22,10,6);
    ctx.fillStyle='#c8855a';ctx.fillRect(ox+8,oy+4,8,7);ctx.fillRect(ox+6,oy-4,12,10);
    ctx.fillStyle='#d89060';ctx.fillRect(ox+8,oy-4,9,5);
    ctx.fillStyle='#1a1a1a';ctx.fillRect(ox+8,oy-1,3,3);ctx.fillRect(ox+13,oy-1,3,3);
    ctx.fillStyle='#fff';ctx.fillRect(ox+8,oy-1,1,1);ctx.fillRect(ox+13,oy-1,1,1);
    ctx.fillStyle='#6a0000';
    ctx.beginPath();ctx.moveTo(ox+6,oy-3);ctx.lineTo(ox+11,oy-1);ctx.lineTo(ox+6,oy-1);ctx.closePath();ctx.fill();
    ctx.beginPath();ctx.moveTo(ox+18,oy-3);ctx.lineTo(ox+13,oy-1);ctx.lineTo(ox+18,oy-1);ctx.closePath();ctx.fill();
    ctx.fillStyle='rgba(0,0,0,0.4)';ctx.fillRect(ox+7,oy+3,10,4);

  } else if(o.type==='biker'){
    // player-sized 24×32 — leather jacket, helmet, red eyes
    ctx.fillStyle='#1a1a1a';ctx.fillRect(ox+3,oy+22,8,10+walk);ctx.fillRect(ox+13,oy+22,8,10-walk);
    ctx.fillStyle='#111';ctx.fillRect(ox+1,oy+30,10,4);ctx.fillRect(ox+13,oy+30,10,4);
    ctx.fillStyle='#333';ctx.fillRect(ox+3,oy+30,6,3);ctx.fillRect(ox+15,oy+30,6,3);
    // leather jacket
    ctx.fillStyle='#1a1a1a';ctx.fillRect(ox,oy+10,24,13);
    ctx.fillStyle='#2a2a2a';ctx.fillRect(ox+2,oy+10,20,6);
    ctx.fillStyle='#555';ctx.fillRect(ox+10,oy+10,4,13);
    // skull patch on chest
    ctx.fillStyle='#e74c3c';ctx.fillRect(ox+8,oy+13,8,5);
    ctx.fillStyle='#c0392b';ctx.fillRect(ox+9,oy+14,6,3);
    ctx.fillStyle='#fff';ctx.fillRect(ox+10,oy+14,4,3);
    ctx.fillStyle='#1a1a1a';ctx.fillRect(ox+11,oy+15,2,1);
    // arms
    ctx.fillStyle='#1a1a1a';ctx.fillRect(ox-5,oy+10,7,14);ctx.fillRect(ox+22,oy+10,7,14);
    ctx.fillStyle='#c8855a';ctx.fillRect(ox-5,oy+22,7,4);ctx.fillRect(ox+22,oy+22,7,4);
    // head
    ctx.fillStyle='#c8855a';ctx.fillRect(ox+8,oy+2,8,9);
    ctx.fillStyle='#d89060';ctx.fillRect(ox+9,oy+2,6,4);
    // stubble
    ctx.fillStyle='#333';ctx.fillRect(ox+8,oy+8,8,3);
    // helmet
    ctx.fillStyle='#111';ctx.fillRect(ox+6,oy-4,12,8);
    ctx.fillStyle='#222';ctx.fillRect(ox+8,oy-4,9,4);
    ctx.fillStyle='#555';ctx.fillRect(ox+6,oy+2,12,2);
    // visor
    ctx.fillStyle='rgba(100,200,255,0.45)';ctx.fillRect(ox+8,oy-2,8,4);
    // red eyes through visor
    ctx.fillStyle='#e74c3c';ctx.fillRect(ox+9,oy+0,3,2);ctx.fillRect(ox+13,oy+0,3,2);
  }
}

export function drawBossSprite(ctx, boss, scrollX, bossHits, bossMaxHits, C) {
  if(!boss) return;
  const ox=boss.x-scrollX,oy=boss.y;
  if(ox>920||ox+boss.w<-120) return;
  if(boss.dead){
    ctx.globalAlpha=Math.max(0,boss.deadTimer/60);
    ctx.font='56px serif';ctx.textAlign='center';
    ctx.fillText('💀',ox+boss.w/2,oy+boss.h/2);
    ctx.globalAlpha=1;return;
  }
  boss.at++;
  const bob=Math.sin(boss.at*0.05)*4;
  const angry=boss.inv>0;

  if(boss.type==='landlord'){
    const bx=ox,by=oy+bob;
    ctx.fillStyle='#111';ctx.fillRect(bx+5,by+76,16,8);ctx.fillRect(bx+39,by+76,16,8);
    ctx.fillStyle='#333';ctx.fillRect(bx+7,by+76,10,5);ctx.fillRect(bx+41,by+76,10,5);
    ctx.fillStyle='#1a1a3a';ctx.fillRect(bx+8,by+54,14,24);ctx.fillRect(bx+38,by+54,14,24);
    ctx.fillStyle=angry?'#8B0000':'#4a4a6a';ctx.fillRect(bx,by+22,boss.w,34);
    ctx.fillStyle=angry?'#aa1010':'#5a5a7a';ctx.fillRect(bx+4,by+22,boss.w-8,12);
    ctx.fillStyle='#fff';ctx.fillRect(bx+22,by+22,16,14);
    ctx.fillStyle='#e74c3c';ctx.fillRect(bx+27,by+26,6,18);
    ctx.fillStyle='#c0392b';ctx.fillRect(bx+28,by+26,4,14);
    ctx.fillStyle=angry?'#8B0000':'#4a4a6a';
    ctx.beginPath();ctx.moveTo(bx+22,by+22);ctx.lineTo(bx+14,by+36);ctx.lineTo(bx+22,by+38);ctx.closePath();ctx.fill();
    ctx.beginPath();ctx.moveTo(bx+48,by+22);ctx.lineTo(bx+56,by+36);ctx.lineTo(bx+48,by+38);ctx.closePath();ctx.fill();
    ctx.fillStyle=angry?'#8B0000':'#4a4a6a';
    ctx.fillRect(bx-10,by+22,12,24);ctx.fillRect(bx+boss.w-2,by+22,12,24);
    ctx.fillStyle='#c8a070';ctx.fillRect(bx-10,by+44,12,10);ctx.fillRect(bx+boss.w-2,by+44,12,10);
    ctx.fillStyle='#fff';ctx.fillRect(bx+boss.w+8,by+38,16,22);
    ctx.fillStyle='#ddd';[by+42,by+46,by+50].forEach(y=>ctx.fillRect(bx+boss.w+10,y,12,1));
    ctx.fillStyle='#e74c3c';ctx.font='5px sans-serif';ctx.textAlign='center';
    ctx.fillText('EVICT',bx+boss.w+16,by+42);
    ctx.fillStyle=angry?'#d4604a':'#d4905a';ctx.fillRect(bx+14,by-10,boss.w-28,34);
    ctx.fillStyle=angry?'#e47060':'#e4a06a';ctx.fillRect(bx+16,by-10,boss.w-32,12);
    ctx.fillStyle=angry?'#c45040':'#c4804a';
    ctx.fillRect(bx+10,by+10,10,16);ctx.fillRect(bx+40,by+10,10,16);
    ctx.fillStyle='#5c3d1a';ctx.fillRect(bx+14,by-10,boss.w-28,6);
    ctx.fillRect(bx+12,by-8,4,8);ctx.fillRect(bx+44,by-8,4,8);
    ctx.fillStyle='#1a1a1a';ctx.fillRect(bx+18,by+2,10,8);ctx.fillRect(bx+32,by+2,10,8);
    ctx.fillStyle='#fff';ctx.fillRect(bx+18,by+2,3,3);ctx.fillRect(bx+32,by+2,3,3);
    ctx.strokeStyle='#5c3d1a';ctx.lineWidth=3;
    if(angry){
      ctx.beginPath();ctx.moveTo(bx+16,by-3);ctx.lineTo(bx+28,by+2);ctx.stroke();
      ctx.beginPath();ctx.moveTo(bx+44,by-3);ctx.lineTo(bx+32,by+2);ctx.stroke();
    } else {
      ctx.fillStyle='#5c3d1a';ctx.fillRect(bx+16,by-2,12,3);ctx.fillRect(bx+32,by-2,12,3);
    }
    ctx.fillStyle='#5c3d1a';ctx.fillRect(bx+20,by+10,20,5);
    ctx.fillStyle='#8B2000';ctx.fillRect(bx+22,by+14,16,4);

  } else if(boss.type==='ratking'){
    // RAT FINK BOSS — giant green rat, bulging eyes, crown, pizza
    const bx=ox,by=oy+bob;
    // tail
    ctx.strokeStyle='#2a8a2a';ctx.lineWidth=6;
    ctx.beginPath();ctx.moveTo(bx+5,by+80);ctx.quadraticCurveTo(bx-35,by+100,bx-55,by+70);ctx.stroke();
    ctx.strokeStyle='#3aaa3a';ctx.lineWidth=3;
    ctx.beginPath();ctx.moveTo(bx+6,by+80);ctx.quadraticCurveTo(bx-32,by+96,bx-50,by+68);ctx.stroke();
    // feet + claws
    ctx.fillStyle='#1a6a1a';ctx.fillRect(bx+4,by+80,18,10);ctx.fillRect(bx+38,by+80,18,10);
    ctx.fillStyle='#2a8a2a';ctx.fillRect(bx+6,by+80,12,7);ctx.fillRect(bx+40,by+80,12,7);
    ctx.fillStyle='#0a4a0a';
    [[bx+3,by+89],[bx+9,by+92],[bx+15,by+89],[bx+37,by+89],[bx+43,by+92],[bx+49,by+89]]
      .forEach(([cx,cy])=>{ctx.beginPath();ctx.arc(cx,cy,4,0,Math.PI*2);ctx.fill();});
    // legs
    ctx.fillStyle='#2a8a2a';ctx.fillRect(bx+10,by+62,16,20);ctx.fillRect(bx+34,by+62,16,20);
    ctx.fillStyle='#3aaa3a';ctx.fillRect(bx+12,by+62,8,12);ctx.fillRect(bx+36,by+62,8,12);
    // body
    ctx.fillStyle='#2a8a2a';ctx.beginPath();ctx.ellipse(bx+30,by+46,28,24,0,0,Math.PI*2);ctx.fill();
    ctx.fillStyle='#3aaa3a';ctx.beginPath();ctx.ellipse(bx+30,by+40,20,16,0,0,Math.PI*2);ctx.fill();
    ctx.fillStyle='#1a7a1a';ctx.beginPath();ctx.ellipse(bx+30,by+56,20,12,0,0,Math.PI*2);ctx.fill();
    // belly
    ctx.fillStyle='#4aba4a';ctx.beginPath();ctx.ellipse(bx+30,by+48,16,14,0,0,Math.PI*2);ctx.fill();
    ctx.fillStyle='#5aca5a';ctx.beginPath();ctx.ellipse(bx+30,by+44,10,8,0,0,Math.PI*2);ctx.fill();
    // RF badge
    ctx.fillStyle='#cc0000';ctx.beginPath();ctx.ellipse(bx+30,by+48,12,12,0,0,Math.PI*2);ctx.fill();
    ctx.fillStyle='#ee1111';ctx.beginPath();ctx.ellipse(bx+30,by+46,8,8,0,0,Math.PI*2);ctx.fill();
    ctx.fillStyle='#FFD700';ctx.font='bold 11px sans-serif';ctx.textAlign='center';ctx.fillText('RF',bx+30,by+52);
    // arms
    ctx.fillStyle='#2a8a2a';ctx.fillRect(bx-12,by+32,16,22);ctx.fillRect(bx+boss.w-4,by+32,16,22);
    ctx.fillStyle='#3aaa3a';ctx.fillRect(bx-10,by+32,8,14);ctx.fillRect(bx+boss.w-2,by+32,8,14);
    // pizza held up in right hand
    ctx.fillStyle='#1a6a1a';ctx.fillRect(bx+boss.w+8,by+48,12,10);
    ctx.fillStyle='#C8860A';
    ctx.beginPath();ctx.moveTo(bx+boss.w+20,by+18);ctx.lineTo(bx+boss.w+6,by+52);ctx.lineTo(bx+boss.w+34,by+52);ctx.closePath();ctx.fill();
    ctx.fillStyle='#FFD966';
    ctx.beginPath();ctx.moveTo(bx+boss.w+20,by+23);ctx.lineTo(bx+boss.w+9,by+50);ctx.lineTo(bx+boss.w+31,by+50);ctx.closePath();ctx.fill();
    ctx.fillStyle='#C0392B';
    ctx.beginPath();ctx.moveTo(bx+boss.w+20,by+27);ctx.lineTo(bx+boss.w+12,by+48);ctx.lineTo(bx+boss.w+28,by+48);ctx.closePath();ctx.fill();
    [bx+boss.w+8,bx+boss.w+14,bx+boss.w+20,bx+boss.w+26,bx+boss.w+32].forEach(x=>{
      ctx.fillStyle='#b8750a';ctx.beginPath();ctx.arc(x,by+52,3,0,Math.PI*2);ctx.fill();
    });
    // neck
    ctx.fillStyle='#2a8a2a';ctx.fillRect(bx+20,by+22,20,10);
    ctx.fillStyle='#3aaa3a';ctx.fillRect(bx+22,by+22,12,6);
    // head
    ctx.fillStyle='#2a8a2a';ctx.beginPath();ctx.ellipse(bx+30,by+10,24,20,0,0,Math.PI*2);ctx.fill();
    ctx.fillStyle='#3aaa3a';ctx.beginPath();ctx.ellipse(bx+30,by+5,16,12,0,0,Math.PI*2);ctx.fill();
    ctx.fillStyle='#1a7a1a';ctx.beginPath();ctx.ellipse(bx+30,by+18,18,10,0,0,Math.PI*2);ctx.fill();
    // ears
    ctx.fillStyle='#2a8a2a';
    ctx.beginPath();ctx.ellipse(bx+10,by+2,9,12,-.3,0,Math.PI*2);ctx.fill();
    ctx.beginPath();ctx.ellipse(bx+50,by+2,9,12,.3,0,Math.PI*2);ctx.fill();
    ctx.fillStyle='#ff8888';
    ctx.beginPath();ctx.ellipse(bx+10,by+2,5,8,-.3,0,Math.PI*2);ctx.fill();
    ctx.beginPath();ctx.ellipse(bx+50,by+2,5,8,.3,0,Math.PI*2);ctx.fill();
    ctx.fillStyle='#ff9999';
    ctx.beginPath();ctx.ellipse(bx+10,by+1,3,5,-.3,0,Math.PI*2);ctx.fill();
    ctx.beginPath();ctx.ellipse(bx+50,by+1,3,5,.3,0,Math.PI*2);ctx.fill();
    // HUGE bulging Rat Fink eyes
    ctx.fillStyle='#fff';
    ctx.beginPath();ctx.ellipse(bx+18,by+5,10,13,-.2,0,Math.PI*2);ctx.fill();
    ctx.beginPath();ctx.ellipse(bx+42,by+5,10,13,.2,0,Math.PI*2);ctx.fill();
    ctx.strokeStyle='#000';ctx.lineWidth=2;
    ctx.beginPath();ctx.ellipse(bx+18,by+5,10,13,-.2,0,Math.PI*2);ctx.stroke();
    ctx.beginPath();ctx.ellipse(bx+42,by+5,10,13,.2,0,Math.PI*2);ctx.stroke();
    ctx.fillStyle='#cc0000';
    ctx.beginPath();ctx.arc(bx+18,by+6,6,0,Math.PI*2);ctx.fill();
    ctx.beginPath();ctx.arc(bx+42,by+6,6,0,Math.PI*2);ctx.fill();
    ctx.fillStyle='#000';
    ctx.beginPath();ctx.arc(bx+18,by+6,3,0,Math.PI*2);ctx.fill();
    ctx.beginPath();ctx.arc(bx+42,by+6,3,0,Math.PI*2);ctx.fill();
    ctx.fillStyle='#fff';
    ctx.beginPath();ctx.arc(bx+16,by+4,2,0,Math.PI*2);ctx.fill();
    ctx.beginPath();ctx.arc(bx+40,by+4,2,0,Math.PI*2);ctx.fill();
    // eye veins
    ctx.strokeStyle='rgba(255,0,0,0.45)';ctx.lineWidth=1;
    [[bx+12,by,bx+16,by+5],[bx+24,by,bx+20,by+5],[bx+36,by,bx+40,by+5],[bx+48,by,bx+44,by+5]]
      .forEach(([x1,y1,x2,y2])=>{ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x2,y2);ctx.stroke();});
    // snout
    ctx.fillStyle='#1a6a1a';ctx.beginPath();ctx.ellipse(bx+30,by+20,12,8,0,0,Math.PI*2);ctx.fill();
    ctx.fillStyle='#2a8a2a';ctx.beginPath();ctx.ellipse(bx+30,by+18,8,5,0,0,Math.PI*2);ctx.fill();
    ctx.fillStyle='#ff9999';ctx.fillRect(bx+24,by+18,6,4);ctx.fillRect(bx+32,by+18,6,4);
    // HUGE teeth
    ctx.fillStyle='#fff';
    ctx.fillRect(bx+20,by+23,6,10);ctx.fillRect(bx+27,by+23,6,10);ctx.fillRect(bx+34,by+23,6,10);
    ctx.strokeStyle='#bbb';ctx.lineWidth=1;
    ctx.strokeRect(bx+20,by+23,6,10);ctx.strokeRect(bx+27,by+23,6,10);ctx.strokeRect(bx+34,by+23,6,10);
    // GOLD CROWN
    ctx.fillStyle='#FFD700';ctx.fillRect(bx+12,by-18,36,12);
    ctx.fillStyle='#ffe040';ctx.fillRect(bx+14,by-18,32,6);
    ctx.fillStyle='#c8a010';ctx.fillRect(bx+12,by-8,36,3);
    [[bx+12,by-30],[bx+21,by-26],[bx+30,by-34],[bx+39,by-26],[bx+46,by-30]].forEach(([cx,cy])=>{
      ctx.fillStyle='#FFD700';ctx.beginPath();ctx.moveTo(cx,by-18);ctx.lineTo(cx+5,cy);ctx.lineTo(cx+10,by-18);ctx.closePath();ctx.fill();
      ctx.fillStyle='#ffe040';ctx.beginPath();ctx.moveTo(cx+2,by-18);ctx.lineTo(cx+5,cy+3);ctx.lineTo(cx+8,by-18);ctx.closePath();ctx.fill();
    });
    ctx.fillStyle='#e74c3c';ctx.beginPath();ctx.arc(bx+17,by-12,4,0,Math.PI*2);ctx.fill();
    ctx.fillStyle='#3498db';ctx.beginPath();ctx.arc(bx+30,by-12,4,0,Math.PI*2);ctx.fill();
    ctx.fillStyle='#2ecc71';ctx.beginPath();ctx.arc(bx+43,by-12,4,0,Math.PI*2);ctx.fill();
    if(angry){
      ctx.strokeStyle='#000';ctx.lineWidth=4;
      ctx.beginPath();ctx.moveTo(bx+8,by-6);ctx.lineTo(bx+22,by+2);ctx.stroke();
      ctx.beginPath();ctx.moveTo(bx+52,by-6);ctx.lineTo(bx+38,by+2);ctx.stroke();
    }

  } else {
    // RECORD EXEC
    const bx=ox,by=oy+bob;
    ctx.fillStyle='#111';ctx.fillRect(bx+4,by+76,14,8);ctx.fillRect(bx+42,by+76,14,8);
    ctx.fillStyle='#333';ctx.fillRect(bx+6,by+76,10,5);ctx.fillRect(bx+44,by+76,10,5);
    ctx.fillStyle='#111';ctx.fillRect(bx+8,by+54,12,24);ctx.fillRect(bx+40,by+54,12,24);
    ctx.fillStyle=angry?'#5a0020':'#6a0030';ctx.fillRect(bx,by+22,boss.w,34);
    ctx.fillStyle=angry?'#7a0030':'#8a0040';ctx.fillRect(bx+4,by+22,boss.w-8,12);
    ctx.fillStyle='#f0f0f0';ctx.fillRect(bx+22,by+22,16,14);
    ctx.fillStyle='#111';ctx.beginPath();ctx.arc(bx+30,by+32,6,0,Math.PI*2);ctx.fill();
    ctx.fillStyle='#cc0000';ctx.beginPath();ctx.arc(bx+30,by+32,5,0,Math.PI*2);ctx.fill();
    ctx.fillStyle='#FFD700';ctx.font='5px sans-serif';ctx.textAlign='center';ctx.fillText('REC',bx+30,by+35);
    ctx.fillStyle=angry?'#6a0030':'#7a0040';
    ctx.beginPath();ctx.moveTo(bx+22,by+22);ctx.lineTo(bx+14,by+38);ctx.lineTo(bx+22,by+40);ctx.closePath();ctx.fill();
    ctx.beginPath();ctx.moveTo(bx+48,by+22);ctx.lineTo(bx+56,by+38);ctx.lineTo(bx+48,by+40);ctx.closePath();ctx.fill();
    ctx.strokeStyle='#FFD700';ctx.lineWidth=3;ctx.beginPath();ctx.arc(bx+30,by+38,10,0,Math.PI);ctx.stroke();
    ctx.fillStyle=angry?'#5a0020':'#6a0030';
    ctx.fillRect(bx-10,by+22,12,24);ctx.fillRect(bx+boss.w-2,by+22,12,24);
    ctx.fillStyle='#c8a070';ctx.fillRect(bx-10,by+44,12,10);ctx.fillRect(bx+boss.w-2,by+44,12,10);
    ctx.fillStyle='#fff';ctx.fillRect(bx-14,by+36,16,22);
    [by+40,by+44,by+48,by+52].forEach(y=>{ctx.fillStyle='#eee';ctx.fillRect(bx-12,y,12,1);});
    ctx.fillStyle='#e74c3c';ctx.font='5px sans-serif';ctx.textAlign='center';
    ctx.fillText('SIGN',bx-6,by+40);ctx.fillText('HERE',bx-6,by+45);
    ctx.fillStyle='#FFD700';ctx.fillRect(bx+boss.w+6,by+36,4,20);
    ctx.fillStyle='#111';ctx.fillRect(bx+boss.w+6,by+54,4,5);
    ctx.fillStyle='#c8a070';ctx.fillRect(bx+12,by-10,boss.w-24,36);
    ctx.fillStyle='#d8b080';ctx.fillRect(bx+14,by-10,boss.w-28,12);
    ctx.fillStyle='#0a0a0a';ctx.fillRect(bx+12,by-10,boss.w-24,8);
    ctx.fillStyle='#222';ctx.fillRect(bx+14,by-10,boss.w-28,4);
    ctx.fillStyle='#0a0a0a';ctx.fillRect(bx+10,by-8,4,12);ctx.fillRect(bx+46,by-8,4,10);
    ctx.fillStyle='#111';ctx.fillRect(bx+14,by+4,16,12);ctx.fillRect(bx+34,by+4,16,12);
    ctx.fillStyle='#333';ctx.fillRect(bx+28,by+6,4,6);
    ctx.strokeStyle='#888';ctx.lineWidth=2;
    ctx.strokeRect(bx+14,by+4,16,12);ctx.strokeRect(bx+34,by+4,16,12);
    ctx.fillStyle='rgba(255,255,255,0.1)';ctx.fillRect(bx+15,by+5,6,5);ctx.fillRect(bx+35,by+5,6,5);
    ctx.fillStyle='#8B4513';ctx.beginPath();ctx.arc(bx+30,by+18,10,0,Math.PI);ctx.fill();
    ctx.fillStyle='#c8a070';ctx.fillRect(bx+22,by+18,16,5);
    ctx.fillStyle='#fff';
    ctx.fillRect(bx+24,by+18,4,5);ctx.fillRect(bx+30,by+18,4,5);ctx.fillRect(bx+35,by+18,4,5);
  }

  // HP bar — all bosses
  ctx.fillStyle='rgba(0,0,0,0.7)';ctx.fillRect(ox-8,oy-32,boss.w+16,14);
  ctx.fillStyle='#e74c3c';ctx.fillRect(ox-6,oy-30,Math.max(0,(boss.w+12)*((bossMaxHits-bossHits)/bossMaxHits)),10);
  ctx.fillStyle='rgba(255,80,80,0.25)';ctx.fillRect(ox-6,oy-30,Math.max(0,(boss.w+12)*((bossMaxHits-bossHits)/bossMaxHits)),5);
  ctx.strokeStyle='#E2A820';ctx.lineWidth=2;ctx.strokeRect(ox-8,oy-32,boss.w+16,14);
  const names={landlord:'LANDLORD',ratking:'RAT KING',recordexec:'RECORD EXEC'};
  ctx.fillStyle='#E2A820';ctx.font='8px "Press Start 2P"';ctx.textAlign='center';
  ctx.fillText(names[boss.type]||'BOSS',ox+boss.w/2,oy-35);
}