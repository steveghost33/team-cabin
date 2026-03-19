export function drawCharSprite(ctx, idx, px, py, PW, C) {
  if (idx === 0) {
    // STEVE — plaid flannel, beard, glasses
    ctx.fillStyle='#3d2b1f'; ctx.fillRect(px,py+28,9,4); ctx.fillRect(px+14,py+28,9,4);
    ctx.fillStyle='#2a1a0f'; ctx.fillRect(px-1,py+30,10,2); ctx.fillRect(px+13,py+30,10,2);
    ctx.fillStyle='#2c3e6b'; ctx.fillRect(px+1,py+16,8,13); ctx.fillRect(px+14,py+16,8,13);
    ctx.fillStyle='#1a2a4a'; ctx.fillRect(px+4,py+16,2,13); ctx.fillRect(px+17,py+16,2,13);
    ctx.fillStyle='#848688'; ctx.fillRect(px-1,py+5,PW+2,12);
    ctx.fillStyle='rgba(60,62,64,0.6)';
    [px+2,px+6,px+10,px+14,px+18].forEach(x=>ctx.fillRect(x,py+5,2,12));
    ctx.fillStyle='rgba(60,62,64,0.5)';
    [py+7,py+10,py+13].forEach(y=>ctx.fillRect(px-1,y,PW+2,2));
    ctx.fillStyle='rgba(74,96,48,0.4)'; ctx.fillRect(px+6,py+5,4,12);
    ctx.fillStyle='#6a6c6e'; ctx.fillRect(px+8,py+5,6,3);
    ctx.fillStyle='#848688'; ctx.fillRect(px-5,py+5,5,11); ctx.fillRect(px+PW,py+5,5,11);
    ctx.fillStyle='#d4a574'; ctx.fillRect(px-5,py+14,5,4); ctx.fillRect(px+PW,py+14,5,4);
    ctx.fillStyle='#d4a574'; ctx.fillRect(px+9,py-1,5,7);
    ctx.fillStyle='#d4a574'; ctx.fillRect(px+4,py-11,16,12);
    ctx.fillStyle='#5c3d1a'; ctx.fillRect(px+4,py-11,16,4);
    ctx.fillRect(px+3,py-10,3,6); ctx.fillRect(px+18,py-10,3,5);
    ctx.fillStyle='#8a6535'; ctx.fillRect(px+4,py+0,16,4);
    ctx.fillRect(px+3,py-2,3,5); ctx.fillRect(px+18,py-2,2,5);
    ctx.fillStyle='rgba(138,101,53,0.6)'; ctx.fillRect(px+5,py-4,13,3);
    ctx.strokeStyle='#4a3a1a'; ctx.lineWidth=1.5;
    ctx.strokeRect(px+5,py-8,5,5); ctx.strokeRect(px+13,py-8,5,5);
    ctx.fillStyle='#4a3a1a'; ctx.fillRect(px+10,py-6,3,1);
    ctx.fillStyle='#1a1a1a'; ctx.fillRect(px+7,py-7,2,2); ctx.fillRect(px+15,py-7,2,2);
    ctx.fillStyle='rgba(255,255,255,0.4)'; ctx.fillRect(px+6,py-8,2,1); ctx.fillRect(px+14,py-8,2,1);

  } else if (idx === 1) {
    // MIKE — solid grey hoodie, no hat, short black hair, beard
    ctx.fillStyle='#111'; ctx.fillRect(px,py+28,9,4); ctx.fillRect(px+14,py+28,9,4);
    ctx.fillStyle='#fff'; ctx.fillRect(px,py+30,9,1); ctx.fillRect(px+14,py+30,9,1);
    ctx.fillStyle='#7B2D3A'; ctx.fillRect(px+1,py+16,8,13); ctx.fillRect(px+14,py+16,8,13);
    ctx.fillStyle='#5a1e28'; ctx.fillRect(px+4,py+16,2,13); ctx.fillRect(px+17,py+16,2,13);
    ctx.fillStyle='#7a7a7a'; ctx.fillRect(px-1,py+5,PW+2,12);
    ctx.fillStyle='#6a6a6a'; ctx.fillRect(px+5,py+12,13,5);
    ctx.fillStyle='#5a5a5a'; ctx.fillRect(px+10,py+12,2,5);
    ctx.fillStyle='#6a6a6a'; ctx.fillRect(px+10,py+5,2,12);
    ctx.fillStyle='#6a6a6a'; ctx.fillRect(px+2,py-2,PW-2,5);
    ctx.fillStyle='#7a7a7a'; ctx.fillRect(px-5,py+5,5,13); ctx.fillRect(px+PW,py+5,5,13);
    ctx.fillStyle='#5a5a5a'; ctx.fillRect(px-5,py+16,5,2); ctx.fillRect(px+PW,py+16,5,2);
    ctx.fillStyle='#c49a6c'; ctx.fillRect(px-5,py+17,5,4); ctx.fillRect(px+PW,py+17,5,4);
    ctx.fillStyle='#c49a6c'; ctx.fillRect(px+9,py-1,5,7);
    ctx.fillStyle='#c49a6c'; ctx.fillRect(px+4,py-11,16,12);
    ctx.fillStyle='#0a0a0a'; ctx.fillRect(px+4,py-11,16,5);
    ctx.fillRect(px+3,py-10,3,4); ctx.fillRect(px+19,py-10,2,4);
    ctx.fillStyle='#1a0f05'; ctx.fillRect(px+4,py-7,2,5); ctx.fillRect(px+18,py-7,2,5);
    ctx.fillStyle='#2a1a0a'; ctx.fillRect(px+5,py-1,13,3);
    ctx.fillRect(px+4,py-3,3,4); ctx.fillRect(px+17,py-3,2,4);
    ctx.fillStyle='#1a1a1a'; ctx.fillRect(px+7,py-7,3,3); ctx.fillRect(px+14,py-7,3,3);
    ctx.fillStyle='#fff'; ctx.fillRect(px+7,py-7,1,1); ctx.fillRect(px+14,py-7,1,1);
    ctx.fillStyle='#8B4513'; ctx.fillRect(px+8,py-3,7,1);

  } else {
    // KYLE — green Patagonia zip fleece, longish brown hair, glasses
    ctx.fillStyle='#6B4C2A'; ctx.fillRect(px,py+28,9,4); ctx.fillRect(px+14,py+28,9,4);
    ctx.fillStyle='#4a3020'; ctx.fillRect(px-1,py+30,10,2); ctx.fillRect(px+13,py+30,10,2);
    ctx.fillStyle='#283040'; ctx.fillRect(px+1,py+16,8,13); ctx.fillRect(px+14,py+16,8,13);
    ctx.fillStyle='#1a2030'; ctx.fillRect(px+4,py+16,2,13); ctx.fillRect(px+17,py+16,2,13);
    ctx.fillStyle='#3D5A2A'; ctx.fillRect(px-1,py+5,PW+2,12);
    ctx.fillStyle='#2D4A1E'; ctx.fillRect(px+10,py+5,2,12);
    ctx.fillStyle='#aaa'; ctx.fillRect(px+9,py+8,4,2);
    ctx.fillStyle='#2D4A1E'; ctx.fillRect(px+3,py+6,6,5);
    ctx.fillStyle='#4a7a30'; ctx.fillRect(px+4,py+7,4,3);
    ctx.fillStyle='rgba(45,74,30,0.5)';
    [py+8,py+11,py+14].forEach(y=>ctx.fillRect(px-1,y,PW+2,1));
    ctx.fillStyle='#3D5A2A'; ctx.fillRect(px-5,py+5,5,12); ctx.fillRect(px+PW,py+5,5,12);
    ctx.fillStyle='#d4b07a'; ctx.fillRect(px-5,py+15,5,4); ctx.fillRect(px+PW,py+15,5,4);
    ctx.fillStyle='#d4b07a'; ctx.fillRect(px+9,py-1,5,7);
    ctx.fillStyle='#d4b07a'; ctx.fillRect(px+4,py-12,16,13);
    ctx.fillStyle='#6B4C2A';
    ctx.fillRect(px+4,py-12,16,5);
    ctx.fillRect(px+3,py-11,3,9); ctx.fillRect(px+18,py-11,3,8);
    ctx.fillRect(px+4,py-8,2,6); ctx.fillRect(px+18,py-8,2,5);
    ctx.strokeStyle='#5c4020'; ctx.lineWidth=1.5;
    ctx.strokeRect(px+5,py-8,5,5); ctx.strokeRect(px+13,py-8,5,5);
    ctx.fillStyle='#5c4020'; ctx.fillRect(px+10,py-6,3,1);
    ctx.fillStyle='#1a1a1a'; ctx.fillRect(px+7,py-7,2,2); ctx.fillRect(px+15,py-7,2,2);
    ctx.fillStyle='rgba(255,255,255,0.4)'; ctx.fillRect(px+6,py-8,2,1); ctx.fillRect(px+14,py-8,2,1);
    ctx.fillStyle='rgba(100,70,30,0.4)'; ctx.fillRect(px+5,py-1,13,3);
  }
}

export function drawPizzaSlice(ctx, ox, py, C) {
  const tipX=ox+14, tipY=py+2, leftX=ox, leftY=py+26, rightX=ox+28, rightY=py+26;
  ctx.fillStyle='#C8860A';
  ctx.beginPath(); ctx.moveTo(tipX,tipY); ctx.lineTo(leftX,leftY); ctx.lineTo(rightX,rightY); ctx.closePath(); ctx.fill();
  ctx.fillStyle='#FFD966';
  ctx.beginPath(); ctx.moveTo(tipX,tipY+4); ctx.lineTo(leftX+3,leftY-2); ctx.lineTo(rightX-3,rightY-2); ctx.closePath(); ctx.fill();
  ctx.fillStyle='#C0392B';
  ctx.beginPath(); ctx.moveTo(tipX,tipY+7); ctx.lineTo(leftX+5,leftY-3); ctx.lineTo(rightX-5,rightY-3); ctx.closePath(); ctx.fill();
  ctx.fillStyle='#b8750a';
  [leftX+1,leftX+6,leftX+12,leftX+18,leftX+24].forEach(x=>{ctx.beginPath();ctx.arc(x,leftY,3,0,Math.PI*2);ctx.fill();});
  ctx.fillStyle='#8B0000';
  [[tipX-2,tipY+10],[tipX+5,tipY+15],[tipX-6,tipY+17]].forEach(([cx,cy])=>{ctx.beginPath();ctx.arc(cx,cy,3,0,Math.PI*2);ctx.fill();});
  ctx.fillStyle='rgba(255,80,80,0.4)';
  [[tipX-2,tipY+10],[tipX+5,tipY+15],[tipX-6,tipY+17]].forEach(([cx,cy])=>{ctx.beginPath();ctx.arc(cx-1,cy-1,1,0,Math.PI*2);ctx.fill();});
  ctx.fillStyle='#FFE680';
  [[tipX+3,tipY+12],[tipX-5,tipY+14],[tipX+6,tipY+18]].forEach(([cx,cy])=>{ctx.fillRect(cx-2,cy-2,4,4);});
  ctx.shadowBlur=8; ctx.shadowColor='#FF8C00';
  ctx.strokeStyle='rgba(255,140,0,0.3)'; ctx.lineWidth=2;
  ctx.beginPath(); ctx.moveTo(tipX,tipY); ctx.lineTo(leftX,leftY); ctx.lineTo(rightX,rightY); ctx.closePath(); ctx.stroke();
  ctx.shadowBlur=0;
  ctx.fillStyle=C.gold; ctx.font='13px "Press Start 2P"'; ctx.textAlign='center';
  ctx.fillText('+100',ox+14,py-6);
}

export function drawTaco(ctx, ox, py, C) {
  ctx.fillStyle='#D4A017';
  ctx.beginPath(); ctx.ellipse(ox+14,py+18,14,8,0,0,Math.PI); ctx.fill();
  ctx.strokeStyle='#b8860b'; ctx.lineWidth=1;
  ctx.beginPath(); ctx.ellipse(ox+14,py+18,14,8,0,0,Math.PI); ctx.stroke();
  ctx.fillStyle='#2ecc71'; ctx.fillRect(ox+4,py+10,20,6);
  ctx.fillStyle='#27ae60';
  [ox+4,ox+8,ox+12,ox+16,ox+20].forEach(x=>ctx.fillRect(x,py+8,3,5));
  ctx.fillStyle='#8B4513'; ctx.fillRect(ox+5,py+12,18,4);
  ctx.fillStyle='#FFD700'; ctx.fillRect(ox+6,py+11,16,3);
  ctx.fillStyle='#e74c3c';
  [ox+7,ox+13,ox+18].forEach(x=>{ctx.beginPath();ctx.arc(x,py+13,2,0,Math.PI*2);ctx.fill();});
  ctx.fillStyle=C.gold; ctx.font='13px "Press Start 2P"'; ctx.textAlign='center';
  ctx.fillText('+100',ox+14,py-6);
}

export function drawEnemySprite(ctx, o, scrollX, C) {
  const ox=o.x-scrollX, oy=o.y;
  if(ox>860||ox+o.w<-80) return;
  if(o.dead){
    ctx.globalAlpha=Math.max(0,o.deadTimer/30);
    ctx.fillStyle='#555'; ctx.fillRect(ox,oy+o.h-4,o.w,4);
    ctx.fillStyle='#fff'; ctx.font='24px serif'; ctx.textAlign='center';
    ctx.fillText('💀',ox+o.w/2,oy+o.h-6);
    ctx.globalAlpha=1; return;
  }
  o.at++;
  const walk=Math.sin(o.at*0.2)*2;
  if(o.type==='cone'){
    ctx.fillStyle='#FF6600'; ctx.beginPath(); ctx.moveTo(ox+9,oy); ctx.lineTo(ox,oy+26); ctx.lineTo(ox+18,oy+26); ctx.closePath(); ctx.fill();
    ctx.fillStyle='#fff'; ctx.fillRect(ox+3,oy+9,12,4);
    ctx.fillStyle='#FF8C00'; ctx.fillRect(ox+4,oy+15,10,3);
    ctx.fillStyle='#444'; ctx.fillRect(ox-2,oy+24,22,4);
    ctx.fillStyle='rgba(255,220,0,0.5)'; ctx.fillRect(ox-4,oy+22,26,3);
  } else if(o.type==='metermaid'){
    ctx.fillStyle='#1a4a1a'; ctx.fillRect(ox+3,oy+22,7,14+walk); ctx.fillRect(ox+12,oy+22,7,14-walk);
    ctx.fillStyle='#111'; ctx.fillRect(ox+1,oy+34,9,4); ctx.fillRect(ox+11,oy+34,9,4);
    ctx.fillStyle='#1a6c1a'; ctx.fillRect(ox,oy+6,22,17);
    ctx.fillStyle=C.gold; ctx.fillRect(ox+8,oy+10,6,4);
    ctx.fillStyle='#fff'; ctx.fillRect(ox+9,oy+11,4,2);
    ctx.fillStyle='#c8855a'; ctx.fillRect(ox+5,oy-4,12,11);
    ctx.fillStyle='#1a4a1a'; ctx.fillRect(ox+3,oy-8,16,6);
    ctx.fillStyle=C.gold; ctx.fillRect(ox+6,oy-7,10,3);
    ctx.fillStyle='#1a1a1a'; ctx.fillRect(ox+7,oy,3,3); ctx.fillRect(ox+12,oy,3,3);
    ctx.fillStyle='#1a1a1a'; ctx.fillRect(ox+7,oy-2,3,1); ctx.fillRect(ox+12,oy-2,3,1);
  } else if(o.type==='muscledude'){
    ctx.fillStyle='#333'; ctx.fillRect(ox+3,oy+28,9,10+walk); ctx.fillRect(ox+16,oy+28,9,10-walk);
    ctx.fillStyle='#111'; ctx.fillRect(ox+1,oy+36,11,4); ctx.fillRect(ox+15,oy+36,11,4);
    ctx.fillStyle='#8B0000'; ctx.fillRect(ox,oy+10,28,20);
    ctx.fillStyle='#c8855a'; ctx.fillRect(ox-6,oy+10,8,14); ctx.fillRect(ox+26,oy+10,8,14);
    ctx.fillStyle='#a07045'; ctx.fillRect(ox-7,oy+22,9,6); ctx.fillRect(ox+26,oy+22,9,6);
    ctx.fillStyle='#c8855a'; ctx.fillRect(ox+10,oy+5,8,7); ctx.fillRect(ox+6,oy-6,16,13);
    ctx.fillStyle='#1a1a1a'; ctx.fillRect(ox+8,oy-2,3,3); ctx.fillRect(ox+17,oy-2,3,3);
    ctx.fillStyle='#8B0000'; ctx.fillRect(ox+8,oy-4,3,2); ctx.fillRect(ox+17,oy-4,3,2);
    ctx.fillStyle='#fff'; ctx.font='11px "Press Start 2P"'; ctx.textAlign='center';
    ctx.fillText('NO',ox+14,oy+20); ctx.fillText('PKG',ox+14,oy+27);
  } else {
    ctx.strokeStyle='#a07050'; ctx.lineWidth=2;
    ctx.beginPath(); ctx.moveTo(ox,oy+10); ctx.quadraticCurveTo(ox-8,oy+20,ox-14,oy+8); ctx.stroke();
    ctx.fillStyle='#888'; ctx.beginPath(); ctx.ellipse(ox+10,oy+8,10,8,0,0,Math.PI*2); ctx.fill();
    ctx.fillStyle='#999'; ctx.beginPath(); ctx.ellipse(ox+19,oy+4,6,5,0,0,Math.PI*2); ctx.fill();
    ctx.fillStyle='#c87070'; ctx.beginPath(); ctx.ellipse(ox+19,oy-2,3,3,0,0,Math.PI*2); ctx.fill();
    ctx.fillStyle='#f00'; ctx.fillRect(ox+21,oy+2,2,2);
    ctx.fillStyle='#777'; ctx.fillRect(ox+4,oy+14+walk,4,4); ctx.fillRect(ox+12,oy+14-walk,4,4);
    ctx.fillStyle='#FF8C00'; ctx.fillRect(ox+22,oy+5,5,4);
    ctx.fillStyle='#C0392B'; ctx.fillRect(ox+23,oy+6,3,2);
  }
}

export function drawBossSprite(ctx, boss, scrollX, bossHits, bossMaxHits, C) {
  if(!boss) return;
  const ox=boss.x-scrollX, oy=boss.y;
  if(ox>900||ox+boss.w<-100) return;
  if(boss.dead){
    ctx.globalAlpha=Math.max(0,boss.deadTimer/60);
    ctx.font='48px serif'; ctx.textAlign='center';
    ctx.fillText('💀',ox+boss.w/2,oy+boss.h/2);
    ctx.globalAlpha=1; return;
  }
  boss.at++;
  const bob=Math.sin(boss.at*0.05)*3;
  const angry=boss.inv>0;

  if(boss.type==='landlord'){
    const bx=ox,by=oy+bob;
    ctx.fillStyle='#111'; ctx.fillRect(bx+5,by+70,16,8); ctx.fillRect(bx+35,by+70,16,8);
    ctx.fillStyle='#1a1a3a'; ctx.fillRect(bx+8,by+50,14,22); ctx.fillRect(bx+34,by+50,14,22);
    ctx.fillStyle=angry?'#8B0000':'#4a4a6a'; ctx.fillRect(bx,by+20,boss.w,32);
    ctx.fillStyle='#fff'; ctx.fillRect(bx+18,by+20,6,12); ctx.fillRect(bx+14,by+20,5,8);
    ctx.fillStyle='#e74c3c'; ctx.fillRect(bx+22,by+22,4,14);
    ctx.fillStyle=angry?'#8B0000':'#4a4a6a';
    ctx.fillRect(bx-8,by+20,10,20); ctx.fillRect(bx+boss.w-2,by+20,10,20);
    ctx.fillStyle='#c8a070'; ctx.fillRect(bx-8,by+38,10,8); ctx.fillRect(bx+boss.w-2,by+38,10,8);
    ctx.fillStyle='#fff'; ctx.fillRect(bx+boss.w+4,by+36,14,18);
    ctx.fillStyle='#333'; ctx.font='5px sans-serif'; ctx.textAlign='center';
    ctx.fillText('EVICT',bx+boss.w+11,by+46);
    ctx.fillStyle=angry?'#d4604a':'#d4905a'; ctx.fillRect(bx+12,by-10,36,32);
    ctx.fillStyle=angry?'#c45040':'#c4804a'; ctx.fillRect(bx+8,by+10,8,14); ctx.fillRect(bx+44,by+10,8,14);
    ctx.fillStyle='#5c3d1a'; ctx.fillRect(bx+10,by-10,6,8); ctx.fillRect(bx+44,by-10,6,8);
    ctx.fillStyle='#1a1a1a'; ctx.fillRect(bx+17,by,8,6); ctx.fillRect(bx+35,by,8,6);
    ctx.fillStyle='#fff'; ctx.fillRect(bx+18,by+1,3,3); ctx.fillRect(bx+36,by+1,3,3);
    ctx.strokeStyle='#5c3d1a'; ctx.lineWidth=3;
    if(angry){
      ctx.beginPath(); ctx.moveTo(bx+16,by-3); ctx.lineTo(bx+26,by+1); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(bx+44,by-3); ctx.lineTo(bx+34,by+1); ctx.stroke();
    } else {
      ctx.fillStyle='#5c3d1a'; ctx.fillRect(bx+16,by-2,10,3); ctx.fillRect(bx+34,by-2,10,3);
    }
    ctx.fillStyle='#5c3d1a'; ctx.fillRect(bx+18,by+8,24,5);
    ctx.fillStyle='#8B2000'; ctx.fillRect(bx+20,by+14,20,4);

  } else if(boss.type==='ratking'){
    const bx=ox,by=oy+bob;
    ctx.strokeStyle='#a07050'; ctx.lineWidth=5;
    ctx.beginPath(); ctx.moveTo(bx,by+60); ctx.quadraticCurveTo(bx-30,by+80,bx-45,by+55); ctx.stroke();
    ctx.fillStyle='#888'; ctx.beginPath(); ctx.ellipse(bx+30,by+45,28,22,0,0,Math.PI*2); ctx.fill();
    ctx.fillStyle='#aaa'; ctx.beginPath(); ctx.ellipse(bx+30,by+48,16,14,0,0,Math.PI*2); ctx.fill();
    ctx.fillStyle='#777'; ctx.fillRect(bx+10,by+60,12,16); ctx.fillRect(bx+36,by+60,12,16);
    ctx.fillStyle='#666'; ctx.fillRect(bx+8,by+74,14,6); ctx.fillRect(bx+34,by+74,14,6);
    ctx.fillStyle='#777'; ctx.fillRect(bx-4,by+35,12,18); ctx.fillRect(bx+48,by+35,12,18);
    ctx.fillStyle='#C8860A'; ctx.beginPath(); ctx.moveTo(bx+60,by+34); ctx.lineTo(bx+50,by+52); ctx.lineTo(bx+70,by+52); ctx.closePath(); ctx.fill();
    ctx.fillStyle='#C0392B'; ctx.beginPath(); ctx.moveTo(bx+60,by+38); ctx.lineTo(bx+53,by+50); ctx.lineTo(bx+67,by+50); ctx.closePath(); ctx.fill();
    ctx.fillStyle='#FFD966'; ctx.beginPath(); ctx.moveTo(bx+60,by+36); ctx.lineTo(bx+54,by+48); ctx.lineTo(bx+66,by+48); ctx.closePath(); ctx.fill();
    ctx.fillStyle='#999'; ctx.beginPath(); ctx.ellipse(bx+30,by+16,22,18,0,0,Math.PI*2); ctx.fill();
    ctx.fillStyle='#bbb'; ctx.beginPath(); ctx.ellipse(bx+38,by+22,10,8,0.3,0,Math.PI*2); ctx.fill();
    ctx.fillStyle='#c87070'; ctx.fillRect(bx+35,by+20,3,3); ctx.fillRect(bx+40,by+20,3,3);
    ctx.fillStyle='#cc0000'; ctx.beginPath(); ctx.arc(bx+20,by+12,5,0,Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(bx+36,by+10,5,0,Math.PI*2); ctx.fill();
    ctx.fillStyle='#ff4444'; ctx.beginPath(); ctx.arc(bx+19,by+11,2,0,Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(bx+35,by+9,2,0,Math.PI*2); ctx.fill();
    ctx.fillStyle='#c87070'; ctx.beginPath(); ctx.ellipse(bx+12,by+4,8,10,0,0,Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(bx+40,by+2,8,10,0,0,Math.PI*2); ctx.fill();
    ctx.fillStyle='#e89090'; ctx.beginPath(); ctx.ellipse(bx+12,by+4,5,7,0,0,Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(bx+40,by+2,5,7,0,0,Math.PI*2); ctx.fill();
    ctx.fillStyle='#FFD700'; ctx.fillRect(bx+12,by-16,36,12);
    [[bx+12,by-28],[bx+22,by-24],[bx+30,by-30],[bx+38,by-24],[bx+46,by-28]].forEach(([cx,cy])=>{
      ctx.beginPath(); ctx.moveTo(cx,by-16); ctx.lineTo(cx+6,cy); ctx.lineTo(cx+12,by-16); ctx.closePath(); ctx.fill();
    });
    ctx.fillStyle='#e74c3c'; ctx.beginPath(); ctx.arc(bx+18,by-10,3,0,Math.PI*2); ctx.fill();
    ctx.fillStyle='#3498db'; ctx.beginPath(); ctx.arc(bx+30,by-10,3,0,Math.PI*2); ctx.fill();
    ctx.fillStyle='#2ecc71'; ctx.beginPath(); ctx.arc(bx+42,by-10,3,0,Math.PI*2); ctx.fill();

  } else {
    // RECORD EXEC
    const bx=ox,by=oy+bob;
    ctx.fillStyle='#111'; ctx.fillRect(bx+4,by+72,14,6); ctx.fillRect(bx+34,by+72,14,6);
    ctx.fillRect(bx+2,by+74,5,3); ctx.fillRect(bx+46,by+74,5,3);
    ctx.fillStyle='#1a1a1a'; ctx.fillRect(bx+8,by+50,12,24); ctx.fillRect(bx+36,by+50,12,24);
    ctx.fillStyle='#2a2a2a'; ctx.fillRect(bx+13,by+50,2,24); ctx.fillRect(bx+41,by+50,2,24);
    ctx.fillStyle=angry?'#5a0020':'#6a0030'; ctx.fillRect(bx,by+18,boss.w,34);
    ctx.fillStyle='rgba(255,255,255,0.08)'; ctx.fillRect(bx+2,by+18,8,34);
    ctx.fillStyle='#f0f0f0'; ctx.fillRect(bx+20,by+18,16,12);
    ctx.strokeStyle='#FFD700'; ctx.lineWidth=2;
    ctx.beginPath(); ctx.arc(bx+28,by+26,8,0,Math.PI); ctx.stroke();
    ctx.beginPath(); ctx.arc(bx+28,by+28,6,0,Math.PI); ctx.stroke();
    ctx.fillStyle=angry?'#4a0018':'#5a0028'; ctx.fillRect(bx+14,by+18,8,14); ctx.fillRect(bx+34,by+18,8,14);
    ctx.fillStyle=angry?'#5a0020':'#6a0030'; ctx.fillRect(bx-8,by+18,10,22); ctx.fillRect(bx+boss.w-2,by+18,10,22);
    ctx.fillStyle='#c8a070'; ctx.fillRect(bx-8,by+38,10,8); ctx.fillRect(bx+boss.w-2,by+38,10,8);
    ctx.fillStyle='#fff'; ctx.fillRect(bx-14,by+34,16,22);
    [by+38,by+42,by+46,by+50].forEach(y=>{ctx.fillStyle='#ccc';ctx.fillRect(bx-12,y,12,1);});
    ctx.fillStyle='#e74c3c'; ctx.font='5px sans-serif'; ctx.textAlign='center';
    ctx.fillText('SIGN',bx-6,by+37); ctx.fillText('HERE',bx-6,by+42);
    ctx.fillStyle='#FFD700'; ctx.fillRect(bx+boss.w+4,by+35,3,16);
    ctx.fillStyle='#111'; ctx.fillRect(bx+boss.w+4,by+49,3,4);
    ctx.fillStyle='#c8a070'; ctx.fillRect(bx+12,by-8,32,28);
    ctx.fillStyle='#0a0a0a'; ctx.fillRect(bx+12,by-8,32,10);
    ctx.fillRect(bx+10,by-6,4,12); ctx.fillRect(bx+42,by-6,4,10);
    ctx.fillStyle='rgba(255,255,255,0.2)'; ctx.fillRect(bx+16,by-7,10,3);
    ctx.fillStyle='#111'; ctx.fillRect(bx+12,by+2,14,9); ctx.fillRect(bx+30,by+2,14,9);
    ctx.fillStyle='#333'; ctx.fillRect(bx+26,by+4,4,4);
    ctx.strokeStyle='#888'; ctx.lineWidth=1.5;
    ctx.strokeRect(bx+12,by+2,14,9); ctx.strokeRect(bx+30,by+2,14,9);
    ctx.fillStyle='rgba(255,255,255,0.15)'; ctx.fillRect(bx+13,by+3,5,3); ctx.fillRect(bx+31,by+3,5,3);
    ctx.fillStyle='#8B4513'; ctx.beginPath(); ctx.arc(bx+28,by+16,8,0,Math.PI); ctx.fill();
    ctx.fillStyle='#c8a070'; ctx.fillRect(bx+21,by+16,14,5);
    ctx.fillStyle='#fff'; ctx.fillRect(bx+23,by+16,4,4); ctx.fillRect(bx+28,by+16,4,4); ctx.fillRect(bx+33,by+16,3,4);
  }

  // HP bar
  ctx.fillStyle='rgba(0,0,0,0.6)'; ctx.fillRect(ox-5,oy-26,boss.w+10,10);
  ctx.fillStyle='#e74c3c'; ctx.fillRect(ox-4,oy-25,Math.max(0,(boss.w+8)*((bossMaxHits-bossHits)/bossMaxHits)),8);
  ctx.strokeStyle=C.gold; ctx.lineWidth=1; ctx.strokeRect(ox-5,oy-26,boss.w+10,10);
  const names={landlord:'LANDLORD',ratking:'RAT KING',recordexec:'RECORD EXEC'};
  ctx.fillStyle=C.gold; ctx.font='7px "Press Start 2P"'; ctx.textAlign='center';
  ctx.fillText(names[boss.type]||'BOSS',ox+boss.w/2,oy-29);
}