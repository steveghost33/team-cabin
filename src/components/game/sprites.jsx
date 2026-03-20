export function drawCharSprite(ctx, idx, px, py, PW, C) {
  if (idx === 0) {
    // STEVE — plaid flannel, beard, glasses
    ctx.fillStyle='#0a0a0a'; ctx.fillRect(px,py+56,18,8); ctx.fillRect(px+28,py+56,18,8);
    ctx.fillStyle='#222'; ctx.fillRect(px+2,py+56,14,4); ctx.fillRect(px+30,py+56,14,4);
    ctx.fillStyle='#1c1c3a'; ctx.fillRect(px+2,py+34,16,22); ctx.fillRect(px+28,py+34,16,22);
    ctx.fillStyle='#2a2a4a'; ctx.fillRect(px+4,py+34,8,22); ctx.fillRect(px+30,py+34,8,22);
    ctx.fillStyle='#111128'; ctx.fillRect(px+2,py+52,16,4); ctx.fillRect(px+28,py+52,16,4);
    ctx.fillStyle='#3a2a10'; ctx.fillRect(px+2,py+32,44,4);
    ctx.fillStyle='#c8a020'; ctx.fillRect(px+20,py+32,8,4);
    ctx.fillStyle='#7a7c7e'; ctx.fillRect(px,py+10,48,24);
    ctx.fillStyle='#9a9c9e'; ctx.fillRect(px+2,py+10,44,4);
    ctx.fillStyle='#6a6c6e'; ctx.fillRect(px,py+30,48,4);
    ctx.fillStyle='rgba(60,62,64,0.55)';
    [px+6,px+14,px+22,px+30,px+38].forEach(x=>ctx.fillRect(x,py+10,3,24));
    ctx.fillStyle='rgba(60,62,64,0.4)';
    [py+14,py+19,py+24,py+29].forEach(y=>ctx.fillRect(px,y,48,2));
    ctx.fillStyle='rgba(74,96,48,0.5)'; ctx.fillRect(px+16,py+10,6,24);
    ctx.fillStyle='#9a9c9e'; ctx.fillRect(px+16,py+10,16,4);
    ctx.fillStyle='#4a6030'; ctx.fillRect(px+18,py+10,12,6);
    ctx.fillStyle='#7a7c7e'; ctx.fillRect(px-10,py+10,12,22); ctx.fillRect(px+46,py+10,12,22);
    ctx.fillStyle='#8a8c8e'; ctx.fillRect(px-8,py+10,6,18); ctx.fillRect(px+50,py+10,6,18);
    ctx.fillStyle='#5a5c5e'; ctx.fillRect(px-10,py+28,12,4); ctx.fillRect(px+46,py+28,12,4);
    ctx.fillStyle='#d4a574'; ctx.fillRect(px-10,py+30,12,8); ctx.fillRect(px+46,py+30,12,8);
    ctx.fillStyle='#c49060'; ctx.fillRect(px-10,py+35,12,3); ctx.fillRect(px+46,py+35,12,3);
    ctx.fillStyle='#e4b584'; ctx.fillRect(px-8,py+30,6,4); ctx.fillRect(px+50,py+30,6,4);
    ctx.fillStyle='#d4a574'; ctx.fillRect(px+18,py+2,12,10);
    ctx.fillStyle='#c49060'; ctx.fillRect(px+22,py+2,4,10);
    ctx.fillStyle='#d4a574'; ctx.fillRect(px+8,py-22,32,26);
    ctx.fillStyle='#e4b584'; ctx.fillRect(px+10,py-22,28,8);
    ctx.fillStyle='#c49060'; ctx.fillRect(px+8,py+2,32,2);
    ctx.fillStyle='#b48050'; ctx.fillRect(px+8,py-2,32,4);
    ctx.fillStyle='rgba(220,140,100,0.3)'; ctx.fillRect(px+8,py-8,6,4); ctx.fillRect(px+34,py-8,6,4);
    ctx.fillStyle='#8a7040'; ctx.fillRect(px+8,py-4,32,8);
    ctx.fillStyle='#9a8050'; ctx.fillRect(px+10,py-4,28,4);
    ctx.fillStyle='#7a6030'; ctx.fillRect(px+8,py+2,32,2);
    ctx.fillStyle='#8a7040'; ctx.fillRect(px+6,py-10,4,14); ctx.fillRect(px+38,py-10,4,14);
    ctx.fillStyle='#7a6535'; ctx.fillRect(px+8,py-22,32,6);
    ctx.fillStyle='#8a7545'; ctx.fillRect(px+10,py-22,28,3);
    ctx.fillStyle='#5a4525'; ctx.fillRect(px+6,py-20,4,8); ctx.fillRect(px+38,py-20,4,8);
    ctx.fillStyle='#1a1a1a'; ctx.fillRect(px+12,py-14,6,6); ctx.fillRect(px+30,py-14,6,6);
    ctx.fillStyle='#4a3a20'; ctx.fillRect(px+13,py-13,4,4); ctx.fillRect(px+31,py-13,4,4);
    ctx.fillStyle='#fff'; ctx.fillRect(px+12,py-14,2,2); ctx.fillRect(px+30,py-14,2,2);
    ctx.strokeStyle='#7a6535'; ctx.lineWidth=2;
    ctx.strokeRect(px+10,py-16,10,8); ctx.strokeRect(px+28,py-16,10,8);
    ctx.fillStyle='#7a6535'; ctx.fillRect(px+20,py-13,8,2);
    ctx.fillStyle='rgba(150,180,220,0.15)'; ctx.fillRect(px+11,py-15,8,6); ctx.fillRect(px+29,py-15,8,6);

  } else if (idx === 1) {
    // MIKE — plain grey hoodie NO logo, mustard yellow fitted snapback, maroon pants, dark sneakers
    ctx.fillStyle='#1a1a2a'; ctx.fillRect(px,py+56,18,8); ctx.fillRect(px+28,py+56,18,8);
    ctx.fillStyle='#2a2a3a'; ctx.fillRect(px+2,py+56,14,4); ctx.fillRect(px+30,py+56,14,4);
    ctx.fillStyle='#fff'; ctx.fillRect(px+1,py+62,16,2); ctx.fillRect(px+29,py+62,16,2);
    ctx.fillStyle='#7B2D3A'; ctx.fillRect(px+2,py+34,16,22); ctx.fillRect(px+28,py+34,16,22);
    ctx.fillStyle='#9a3a4a'; ctx.fillRect(px+4,py+34,8,10); ctx.fillRect(px+30,py+34,8,10);
    ctx.fillStyle='#5a1a28'; ctx.fillRect(px+2,py+52,16,4); ctx.fillRect(px+28,py+52,16,4);
    ctx.fillStyle='#2a2a2a'; ctx.fillRect(px+2,py+32,44,4);
    ctx.fillStyle='#555'; ctx.fillRect(px+20,py+32,8,4);
    // plain grey hoodie body
    ctx.fillStyle='#9a9a9a'; ctx.fillRect(px,py+10,48,24);
    ctx.fillStyle='#adadad'; ctx.fillRect(px+2,py+10,44,6);
    ctx.fillStyle='#888'; ctx.fillRect(px,py+28,48,6);
    ctx.fillStyle='#888'; ctx.fillRect(px+10,py+22,28,10);
    ctx.fillStyle='#7a7a7a'; ctx.fillRect(px+10,py+22,28,2);
    ctx.fillStyle='#878787'; ctx.fillRect(px+22,py+10,4,24);
    ctx.fillStyle='#888'; ctx.fillRect(px+4,py+4,40,8);
    ctx.fillStyle='#999'; ctx.fillRect(px+6,py+4,36,4);
    ctx.fillStyle='#9a9a9a'; ctx.fillRect(px-10,py+10,12,22); ctx.fillRect(px+46,py+10,12,22);
    ctx.fillStyle='#adadad'; ctx.fillRect(px-8,py+10,6,14); ctx.fillRect(px+50,py+10,6,14);
    ctx.fillStyle='#888'; ctx.fillRect(px-10,py+28,12,4); ctx.fillRect(px+46,py+28,12,4);
    ctx.fillStyle='#c49a6c'; ctx.fillRect(px-10,py+30,12,8); ctx.fillRect(px+46,py+30,12,8);
    ctx.fillStyle='#b48a5c'; ctx.fillRect(px-10,py+35,12,3); ctx.fillRect(px+46,py+35,12,3);
    ctx.fillStyle='#d4aa7c'; ctx.fillRect(px-8,py+30,6,4); ctx.fillRect(px+50,py+30,6,4);
    ctx.fillStyle='#c49a6c'; ctx.fillRect(px+18,py+2,12,10);
    ctx.fillStyle='#b48a5c'; ctx.fillRect(px+22,py+6,4,6);
    ctx.fillStyle='#c49a6c'; ctx.fillRect(px+8,py-22,32,26);
    ctx.fillStyle='#d4aa7c'; ctx.fillRect(px+10,py-22,28,8);
    ctx.fillStyle='#b48a5c'; ctx.fillRect(px+8,py+2,32,2);
    ctx.fillStyle='rgba(200,120,80,0.3)'; ctx.fillRect(px+8,py-8,6,4); ctx.fillRect(px+34,py-8,6,4);
    ctx.fillStyle='#1a0f05'; ctx.fillRect(px+8,py-4,32,8);
    ctx.fillStyle='#2a1a0a'; ctx.fillRect(px+10,py-4,28,4);
    ctx.fillStyle='#0a0500'; ctx.fillRect(px+8,py+2,32,2);
    ctx.fillStyle='#1a0f05'; ctx.fillRect(px+6,py-10,4,14); ctx.fillRect(px+38,py-10,4,14);
    ctx.fillStyle='#111'; ctx.fillRect(px+12,py-14,6,6); ctx.fillRect(px+30,py-14,6,6);
    ctx.fillStyle='#fff'; ctx.fillRect(px+12,py-14,2,2); ctx.fillRect(px+30,py-14,2,2);
    // MUSTARD YELLOW FITTED SNAPBACK — tight to head, small neat brim
    ctx.fillStyle='#c8a020'; ctx.fillRect(px+6,py-30,36,13);
    ctx.fillStyle='#d8b030'; ctx.fillRect(px+8,py-30,32,6);
    ctx.fillStyle='#a07810'; ctx.fillRect(px+6,py-19,36,2);
    ctx.fillStyle='#c8a020'; ctx.fillRect(px+2,py-28,6,11); ctx.fillRect(px+40,py-28,6,11);
    ctx.fillStyle='#a07810'; ctx.fillRect(px+2,py-19,6,2); ctx.fillRect(px+40,py-19,6,2);
    ctx.fillStyle='#c8a020'; ctx.fillRect(px+4,py-19,40,5);
    ctx.fillStyle='#d8b030'; ctx.fillRect(px+4,py-19,40,2);
    ctx.fillStyle='#a07810'; ctx.fillRect(px+4,py-15,40,1);
    ctx.fillStyle='#b89018'; ctx.fillRect(px+14,py-19,20,4);
    ctx.fillStyle='#8a6010'; ctx.fillRect(px+18,py-18,12,2);
    ctx.fillStyle='#b89018'; ctx.fillRect(px+20,py-31,8,2);

  } else {
    // KYLE — dark olive Patagonia zip fleece, dark pants, brown hiking boots, glasses
    ctx.fillStyle='#4a3020'; ctx.fillRect(px,py+56,18,8); ctx.fillRect(px+28,py+56,18,8);
    ctx.fillStyle='#6a5040'; ctx.fillRect(px+2,py+56,14,4); ctx.fillRect(px+30,py+56,14,4);
    ctx.fillStyle='#2a1a10'; ctx.fillRect(px,py+60,18,4); ctx.fillRect(px+28,py+60,18,4);
    ctx.fillStyle='#2a2a2a'; ctx.fillRect(px+2,py+34,16,22); ctx.fillRect(px+28,py+34,16,22);
    ctx.fillStyle='#383838'; ctx.fillRect(px+4,py+34,8,10); ctx.fillRect(px+30,py+34,8,10);
    ctx.fillStyle='#1a1a1a'; ctx.fillRect(px+2,py+52,16,4); ctx.fillRect(px+28,py+52,16,4);
    ctx.fillStyle='#3a3020'; ctx.fillRect(px+2,py+32,44,4);
    ctx.fillStyle='#2D4A1E'; ctx.fillRect(px,py+10,48,24);
    ctx.fillStyle='#3D5A2A'; ctx.fillRect(px+2,py+10,44,8);
    ctx.fillStyle='#1D3A10'; ctx.fillRect(px,py+28,48,6);
    ctx.fillStyle='#1D3A10'; ctx.fillRect(px+21,py+10,6,24);
    ctx.fillStyle='#aaa'; ctx.fillRect(px+23,py+14,2,18);
    ctx.fillStyle='#3a6a28'; ctx.fillRect(px+4,py+14,14,8);
    ctx.fillStyle='#D4A017'; ctx.fillRect(px+5,py+15,12,4);
    ctx.fillStyle='#1D3A10'; ctx.fillRect(px+5,py+15,12,2);
    ctx.fillStyle='#fff'; ctx.fillRect(px+6,py+16,10,2);
    ctx.fillStyle='#1D3A10'; ctx.fillRect(px+14,py+8,20,6);
    ctx.fillStyle='#2D4A1E'; ctx.fillRect(px+16,py+8,16,4);
    ctx.fillStyle='#2D4A1E'; ctx.fillRect(px-10,py+10,12,22); ctx.fillRect(px+46,py+10,12,22);
    ctx.fillStyle='#3D5A2A'; ctx.fillRect(px-8,py+10,6,14); ctx.fillRect(px+50,py+10,6,14);
    ctx.fillStyle='#1D3A10'; ctx.fillRect(px-10,py+28,12,4); ctx.fillRect(px+46,py+28,12,4);
    ctx.fillStyle='#d4b07a'; ctx.fillRect(px-10,py+30,12,8); ctx.fillRect(px+46,py+30,12,8);
    ctx.fillStyle='#c4a06a'; ctx.fillRect(px-10,py+35,12,3); ctx.fillRect(px+46,py+35,12,3);
    ctx.fillStyle='#e4c08a'; ctx.fillRect(px-8,py+30,6,4); ctx.fillRect(px+50,py+30,6,4);
    ctx.fillStyle='#d4b07a'; ctx.fillRect(px+18,py+2,12,10);
    ctx.fillStyle='#c4a06a'; ctx.fillRect(px+22,py+6,4,6);
    ctx.fillStyle='#d4b07a'; ctx.fillRect(px+8,py-22,32,26);
    ctx.fillStyle='#e4c08a'; ctx.fillRect(px+10,py-22,28,8);
    ctx.fillStyle='#c4a06a'; ctx.fillRect(px+8,py+2,32,2);
    ctx.fillStyle='rgba(210,150,100,0.3)'; ctx.fillRect(px+8,py-8,6,4); ctx.fillRect(px+34,py-8,6,4);
    ctx.fillStyle='#6B4C2A'; ctx.fillRect(px+8,py-22,32,6);
    ctx.fillStyle='#7B5C3A'; ctx.fillRect(px+10,py-22,28,3);
    ctx.fillStyle='#5B3C1A'; ctx.fillRect(px+4,py-20,6,22); ctx.fillRect(px+38,py-20,6,22);
    ctx.fillStyle='#6B4C2A'; ctx.fillRect(px+4,py-20,4,16); ctx.fillRect(px+40,py-20,4,16);
    ctx.fillStyle='rgba(100,70,30,0.3)'; ctx.fillRect(px+8,py-2,32,4);
    ctx.fillStyle='#1a1a1a'; ctx.fillRect(px+12,py-14,6,6); ctx.fillRect(px+30,py-14,6,6);
    ctx.fillStyle='#3a3a5a'; ctx.fillRect(px+13,py-13,4,4); ctx.fillRect(px+31,py-13,4,4);
    ctx.fillStyle='#fff'; ctx.fillRect(px+12,py-14,2,2); ctx.fillRect(px+30,py-14,2,2);
    ctx.strokeStyle='#8B6C4A'; ctx.lineWidth=2;
    ctx.strokeRect(px+10,py-16,10,8); ctx.strokeRect(px+28,py-16,10,8);
    ctx.fillStyle='#8B6C4A'; ctx.fillRect(px+20,py-13,8,2);
    ctx.fillStyle='rgba(150,180,220,0.12)'; ctx.fillRect(px+11,py-15,8,6); ctx.fillRect(px+29,py-15,8,6);
    ctx.fillStyle='#c4906a'; ctx.fillRect(px+14,py-2,20,2);
  }
}

export function drawPizzaSlice(ctx, ox, py, C) {
  const tipX=ox+18,tipY=py+2,leftX=ox,leftY=py+36,rightX=ox+36,rightY=py+36;
  ctx.fillStyle='#C8860A';
  ctx.beginPath();ctx.moveTo(tipX,tipY);ctx.lineTo(leftX,leftY);ctx.lineTo(rightX,rightY);ctx.closePath();ctx.fill();
  ctx.fillStyle='#d89820';
  ctx.beginPath();ctx.moveTo(tipX,tipY+4);ctx.lineTo(tipX-6,tipY+14);ctx.lineTo(tipX+6,tipY+14);ctx.closePath();ctx.fill();
  ctx.fillStyle='#FFD966';
  ctx.beginPath();ctx.moveTo(tipX,tipY+5);ctx.lineTo(leftX+4,leftY-3);ctx.lineTo(rightX-4,rightY-3);ctx.closePath();ctx.fill();
  ctx.fillStyle='#ffe880';
  ctx.beginPath();ctx.moveTo(tipX,tipY+5);ctx.lineTo(tipX-4,tipY+14);ctx.lineTo(tipX+4,tipY+14);ctx.closePath();ctx.fill();
  ctx.fillStyle='#C0392B';
  ctx.beginPath();ctx.moveTo(tipX,tipY+9);ctx.lineTo(leftX+7,leftY-5);ctx.lineTo(rightX-7,rightY-5);ctx.closePath();ctx.fill();
  ctx.fillStyle='#b8750a';
  [leftX+2,leftX+9,leftX+16,leftX+23,leftX+30].forEach(x=>{ctx.beginPath();ctx.arc(x,leftY,4,0,Math.PI*2);ctx.fill();});
  ctx.fillStyle='#d89020';
  [leftX+3,leftX+10,leftX+17,leftX+24,leftX+31].forEach(x=>{ctx.beginPath();ctx.arc(x,leftY-1,2,0,Math.PI*2);ctx.fill();});
  ctx.fillStyle='#8B0000';
  [[tipX-3,tipY+14],[tipX+7,tipY+21],[tipX-8,tipY+24]].forEach(([cx,cy])=>{ctx.beginPath();ctx.arc(cx,cy,4,0,Math.PI*2);ctx.fill();});
  ctx.fillStyle='#aa2020';
  [[tipX-3,tipY+14],[tipX+7,tipY+21],[tipX-8,tipY+24]].forEach(([cx,cy])=>{ctx.beginPath();ctx.arc(cx-1,cy-1,2,0,Math.PI*2);ctx.fill();});
  ctx.fillStyle='#FFE680';
  [[tipX+4,tipY+17],[tipX-6,tipY+20],[tipX+8,tipY+26]].forEach(([cx,cy])=>{ctx.fillRect(cx-3,cy-3,6,6);});
  ctx.shadowBlur=12;ctx.shadowColor='#FF8C00';
  ctx.strokeStyle='rgba(255,140,0,0.4)';ctx.lineWidth=2;
  ctx.beginPath();ctx.moveTo(tipX,tipY);ctx.lineTo(leftX,leftY);ctx.lineTo(rightX,rightY);ctx.closePath();ctx.stroke();
  ctx.shadowBlur=0;
  ctx.fillStyle=C.gold;ctx.font='11px "Press Start 2P"';ctx.textAlign='center';
  ctx.fillText('+100',ox+18,py-8);
}

export function drawTaco(ctx, ox, py, C) {
  ctx.fillStyle='#D4A017';
  ctx.beginPath();ctx.ellipse(ox+18,py+22,18,10,0,0,Math.PI);ctx.fill();
  ctx.fillStyle='#e8b828';
  ctx.beginPath();ctx.ellipse(ox+18,py+22,14,7,0,0,Math.PI);ctx.fill();
  ctx.strokeStyle='#b8860b';ctx.lineWidth=2;
  ctx.beginPath();ctx.ellipse(ox+18,py+22,18,10,0,0,Math.PI);ctx.stroke();
  ctx.fillStyle='#2ecc71';ctx.fillRect(ox+4,py+10,28,8);
  ctx.fillStyle='#3ddd82';ctx.fillRect(ox+5,py+10,24,4);
  ctx.fillStyle='#27ae60';
  [ox+4,ox+9,ox+14,ox+19,ox+24,ox+29].forEach(x=>ctx.fillRect(x,py+7,4,6));
  ctx.fillStyle='#8B4513';ctx.fillRect(ox+5,py+13,26,6);
  ctx.fillStyle='#a05025';ctx.fillRect(ox+6,py+13,22,3);
  ctx.fillStyle='#FFD700';ctx.fillRect(ox+6,py+11,24,4);
  ctx.fillStyle='#ffe040';ctx.fillRect(ox+7,py+11,20,2);
  ctx.fillStyle='#e74c3c';
  [ox+8,ox+15,ox+22].forEach(x=>{ctx.beginPath();ctx.arc(x,py+14,3,0,Math.PI*2);ctx.fill();});
  ctx.fillStyle='#ff6655';
  [ox+8,ox+15,ox+22].forEach(x=>{ctx.beginPath();ctx.arc(x-1,py+13,1,0,Math.PI*2);ctx.fill();});
  ctx.fillStyle=C.gold;ctx.font='11px "Press Start 2P"';ctx.textAlign='center';
  ctx.fillText('+100',ox+18,py-8);
}

export function drawEnemySprite(ctx, o, scrollX, C) {
  const ox=o.x-scrollX,oy=o.y;
  if(ox>900||ox+o.w<-80) return;
  if(o.dead){
    ctx.globalAlpha=Math.max(0,o.deadTimer/30);
    ctx.font='28px serif';ctx.textAlign='center';
    ctx.fillText('💀',ox+o.w/2,oy+o.h-4);
    ctx.globalAlpha=1;return;
  }
  o.at++;
  const walk=Math.sin(o.at*0.18)*3;

  if(o.type==='cone'){
    // CONE — static hazard, no movement code here, just draw
    ctx.fillStyle='#333';ctx.fillRect(ox-4,oy+22,26,6);
    ctx.fillStyle='#555';ctx.fillRect(ox-2,oy+22,20,3);
    ctx.fillStyle='#FF6600';
    ctx.beginPath();ctx.moveTo(ox+9,oy);ctx.lineTo(ox-2,oy+24);ctx.lineTo(ox+20,oy+24);ctx.closePath();ctx.fill();
    ctx.fillStyle='#FF8C22';
    ctx.beginPath();ctx.moveTo(ox+9,oy);ctx.lineTo(ox+9,oy+24);ctx.lineTo(ox+20,oy+24);ctx.closePath();ctx.fill();
    ctx.fillStyle='#fff';ctx.fillRect(ox+1,oy+8,16,4);ctx.fillRect(ox+3,oy+14,12,3);
    ctx.fillStyle='#eee';ctx.fillRect(ox+9,oy+8,8,4);ctx.fillRect(ox+9,oy+14,6,3);
    ctx.fillStyle='rgba(255,220,0,0.4)';ctx.fillRect(ox-5,oy+20,28,4);

  } else if(o.type==='metermaid'){
    ctx.fillStyle='#1a4a1a';ctx.fillRect(ox+3,oy+22,8,16+walk);ctx.fillRect(ox+13,oy+22,8,16-walk);
    ctx.fillStyle='#2a5a2a';ctx.fillRect(ox+5,oy+22,4,12+walk);ctx.fillRect(ox+15,oy+22,4,12-walk);
    ctx.fillStyle='#111';ctx.fillRect(ox+1,oy+36,10,5);ctx.fillRect(ox+11,oy+36,10,5);
    ctx.fillStyle='#333';ctx.fillRect(ox+3,oy+36,6,3);ctx.fillRect(ox+13,oy+36,6,3);
    ctx.fillStyle='#1a6c1a';ctx.fillRect(ox,oy+6,24,18);
    ctx.fillStyle='#2a7c2a';ctx.fillRect(ox+2,oy+6,20,8);
    ctx.fillStyle='#0a5a0a';ctx.fillRect(ox,oy+20,24,4);
    ctx.fillStyle=C.gold;ctx.fillRect(ox+8,oy+10,8,6);
    ctx.fillStyle='#c89000';ctx.fillRect(ox+8,oy+10,8,3);
    ctx.fillStyle='#fff';ctx.fillRect(ox+9,oy+11,6,3);
    ctx.fillStyle='#fff';ctx.fillRect(ox+18,oy+12,8,10);
    ctx.fillStyle='#ddd';ctx.fillRect(ox+19,oy+14,6,2);ctx.fillRect(ox+19,oy+17,6,2);
    ctx.fillStyle='#1a6c1a';ctx.fillRect(ox-6,oy+6,8,14);ctx.fillRect(ox+22,oy+6,8,14);
    ctx.fillStyle='#2a7c2a';ctx.fillRect(ox-4,oy+6,4,10);ctx.fillRect(ox+24,oy+6,4,10);
    ctx.fillStyle='#c8855a';ctx.fillRect(ox-6,oy+18,8,5);ctx.fillRect(ox+22,oy+18,8,5);
    ctx.fillStyle='#c8855a';ctx.fillRect(ox+5,oy-4,14,12);
    ctx.fillStyle='#d89060';ctx.fillRect(ox+7,oy-4,10,5);
    ctx.fillStyle='#1a4a1a';ctx.fillRect(ox+3,oy-8,18,6);
    ctx.fillStyle='#2a5a2a';ctx.fillRect(ox+5,oy-8,14,3);
    ctx.fillStyle=C.gold;ctx.fillRect(ox+6,oy-7,12,3);
    ctx.fillStyle='#1a4a1a';ctx.fillRect(ox+1,oy-4,22,3);
    ctx.fillStyle='#1a1a1a';ctx.fillRect(ox+7,oy+0,4,4);ctx.fillRect(ox+13,oy+0,4,4);
    ctx.fillStyle='#fff';ctx.fillRect(ox+7,oy,2,2);ctx.fillRect(ox+13,oy,2,2);
    ctx.fillStyle='#8B4513';ctx.fillRect(ox+8,oy+5,8,2);

  } else if(o.type==='muscledude'){
    ctx.fillStyle='#222';ctx.fillRect(ox+3,oy+28,11,12+walk);ctx.fillRect(ox+18,oy+28,11,12-walk);
    ctx.fillStyle='#333';ctx.fillRect(ox+5,oy+28,6,8+walk);ctx.fillRect(ox+20,oy+28,6,8-walk);
    ctx.fillStyle='#111';ctx.fillRect(ox+1,oy+38,13,6);ctx.fillRect(ox+18,oy+38,13,6);
    ctx.fillStyle='#8B0000';ctx.fillRect(ox,oy+10,32,20);
    ctx.fillStyle='#aa1010';ctx.fillRect(ox+2,oy+10,28,8);
    ctx.fillStyle='#6a0000';ctx.fillRect(ox,oy+26,32,4);
    ctx.fillStyle='#fff';ctx.font='bold 6px sans-serif';ctx.textAlign='center';
    ctx.fillText('NO PKG',ox+16,oy+22);
    ctx.fillStyle='#8B0000';ctx.fillRect(ox-10,oy+10,12,18);ctx.fillRect(ox+30,oy+10,12,18);
    ctx.fillStyle='#aa1010';ctx.fillRect(ox-8,oy+10,6,12);ctx.fillRect(ox+32,oy+10,6,12);
    ctx.fillStyle='#c8855a';ctx.fillRect(ox-12,oy+26,14,8);ctx.fillRect(ox+30,oy+26,14,8);
    ctx.fillStyle='#c8855a';ctx.fillRect(ox+12,oy+5,8,7);
    ctx.fillStyle='#c8855a';ctx.fillRect(ox+7,oy-14,18,20);
    ctx.fillStyle='#d89060';ctx.fillRect(ox+9,oy-14,14,8);
    ctx.fillStyle='#1a1a1a';ctx.fillRect(ox+9,oy-8,4,4);ctx.fillRect(ox+19,oy-8,4,4);
    ctx.fillStyle='#fff';ctx.fillRect(ox+9,oy-8,2,2);ctx.fillRect(ox+19,oy-8,2,2);
    ctx.fillStyle='#6a0000';
    ctx.beginPath();ctx.moveTo(ox+7,oy-10);ctx.lineTo(ox+14,oy-8);ctx.lineTo(ox+7,oy-8);ctx.closePath();ctx.fill();
    ctx.beginPath();ctx.moveTo(ox+25,oy-10);ctx.lineTo(ox+18,oy-8);ctx.lineTo(ox+25,oy-8);ctx.closePath();ctx.fill();

  } else {
    // RAT — Rat Fink style: green, bulging eyes, huge teeth, pizza in mouth
    // tail
    ctx.strokeStyle='#1a7a1a';ctx.lineWidth=4;
    ctx.beginPath();ctx.moveTo(ox+2,oy+14);ctx.quadraticCurveTo(ox-16,oy+24,ox-22,oy+10);ctx.stroke();
    ctx.strokeStyle='#2a9a2a';ctx.lineWidth=2;
    ctx.beginPath();ctx.moveTo(ox+2,oy+14);ctx.quadraticCurveTo(ox-14,oy+22,ox-20,oy+10);ctx.stroke();
    // body — big round green gut
    ctx.fillStyle='#2a8a2a';
    ctx.beginPath();ctx.ellipse(ox+12,oy+12,14,11,0,0,Math.PI*2);ctx.fill();
    ctx.fillStyle='#3aaa3a';
    ctx.beginPath();ctx.ellipse(ox+12,oy+9,10,7,0,0,Math.PI*2);ctx.fill();
    ctx.fillStyle='#1a7a1a';
    ctx.beginPath();ctx.ellipse(ox+12,oy+16,10,6,0,0,Math.PI*2);ctx.fill();
    // belly lighter
    ctx.fillStyle='#4aba4a';
    ctx.beginPath();ctx.ellipse(ox+12,oy+12,8,7,0,0,Math.PI*2);ctx.fill();
    // RF badge on belly
    ctx.fillStyle='#cc0000';
    ctx.beginPath();ctx.ellipse(ox+12,oy+13,5,5,0,0,Math.PI*2);ctx.fill();
    ctx.fillStyle='#FFD700';ctx.font='bold 5px sans-serif';ctx.textAlign='center';
    ctx.fillText('RF',ox+12,oy+16);
    // arms / claws
    ctx.fillStyle='#2a8a2a';ctx.fillRect(ox-4,oy+8,6,8);ctx.fillRect(ox+22,oy+8,6,8);
    ctx.fillStyle='#1a6a1a';
    [[ox-6,oy+15],[ox-2,oy+17],[ox+2,oy+15]].forEach(([cx,cy])=>{ctx.beginPath();ctx.arc(cx,cy,2,0,Math.PI*2);ctx.fill();});
    [[ox+22,oy+15],[ox+26,oy+17],[ox+30,oy+15]].forEach(([cx,cy])=>{ctx.beginPath();ctx.arc(cx,cy,2,0,Math.PI*2);ctx.fill();});
    // legs
    ctx.fillStyle='#2a8a2a';ctx.fillRect(ox+4,oy+21,6,6+walk);ctx.fillRect(ox+14,oy+21,6,6-walk);
    ctx.fillStyle='#1a6a1a';
    [[ox+3,oy+27+walk],[ox+6,oy+29+walk],[ox+10,oy+27+walk]].forEach(([cx,cy])=>{ctx.beginPath();ctx.arc(cx,cy,2,0,Math.PI*2);ctx.fill();});
    [[ox+13,oy+27-walk],[ox+17,oy+29-walk],[ox+21,oy+27-walk]].forEach(([cx,cy])=>{ctx.beginPath();ctx.arc(cx,cy,2,0,Math.PI*2);ctx.fill();});
    // neck
    ctx.fillStyle='#2a8a2a';ctx.fillRect(ox+8,oy+2,8,6);
    // head — big round
    ctx.fillStyle='#2a8a2a';
    ctx.beginPath();ctx.ellipse(ox+13,oy-4,12,10,0,0,Math.PI*2);ctx.fill();
    ctx.fillStyle='#3aaa3a';
    ctx.beginPath();ctx.ellipse(ox+13,oy-7,8,6,0,0,Math.PI*2);ctx.fill();
    // ears
    ctx.fillStyle='#2a8a2a';
    ctx.beginPath();ctx.ellipse(ox+4,oy-12,5,7,-.3,0,Math.PI*2);ctx.fill();
    ctx.beginPath();ctx.ellipse(ox+22,oy-12,5,7,.3,0,Math.PI*2);ctx.fill();
    ctx.fillStyle='#ff8888';
    ctx.beginPath();ctx.ellipse(ox+4,oy-12,3,5,-.3,0,Math.PI*2);ctx.fill();
    ctx.beginPath();ctx.ellipse(ox+22,oy-12,3,5,.3,0,Math.PI*2);ctx.fill();
    // HUGE bulging eyes — Rat Fink style
    ctx.fillStyle='#fff';
    ctx.beginPath();ctx.ellipse(ox+8,oy-6,6,8,-.15,0,Math.PI*2);ctx.fill();
    ctx.beginPath();ctx.ellipse(ox+18,oy-6,6,8,.15,0,Math.PI*2);ctx.fill();
    ctx.strokeStyle='#000';ctx.lineWidth=1.5;
    ctx.beginPath();ctx.ellipse(ox+8,oy-6,6,8,-.15,0,Math.PI*2);ctx.stroke();
    ctx.beginPath();ctx.ellipse(ox+18,oy-6,6,8,.15,0,Math.PI*2);ctx.stroke();
    // red pupils
    ctx.fillStyle='#cc0000';
    ctx.beginPath();ctx.arc(ox+8,oy-5,4,0,Math.PI*2);ctx.fill();
    ctx.beginPath();ctx.arc(ox+18,oy-5,4,0,Math.PI*2);ctx.fill();
    ctx.fillStyle='#000';
    ctx.beginPath();ctx.arc(ox+8,oy-5,2,0,Math.PI*2);ctx.fill();
    ctx.beginPath();ctx.arc(ox+18,oy-5,2,0,Math.PI*2);ctx.fill();
    ctx.fillStyle='#fff';
    ctx.beginPath();ctx.arc(ox+7,oy-7,1,0,Math.PI*2);ctx.fill();
    ctx.beginPath();ctx.arc(ox+17,oy-7,1,0,Math.PI*2);ctx.fill();
    // eye veins
    ctx.strokeStyle='rgba(255,0,0,0.5)';ctx.lineWidth=1;
    ctx.beginPath();ctx.moveTo(ox+3,oy-11);ctx.lineTo(ox+7,oy-7);ctx.stroke();
    ctx.beginPath();ctx.moveTo(ox+13,oy-11);ctx.lineTo(ox+9,oy-7);ctx.stroke();
    ctx.beginPath();ctx.moveTo(ox+15,oy-11);ctx.lineTo(ox+17,oy-7);ctx.stroke();
    ctx.beginPath();ctx.moveTo(ox+24,oy-11);ctx.lineTo(ox+20,oy-7);ctx.stroke();
    // snout
    ctx.fillStyle='#1a6a1a';
    ctx.beginPath();ctx.ellipse(ox+13,oy+1,7,5,0,0,Math.PI*2);ctx.fill();
    ctx.fillStyle='#2a8a2a';
    ctx.beginPath();ctx.ellipse(ox+13,oy-1,5,3,0,0,Math.PI*2);ctx.fill();
    ctx.fillStyle='#ff9999';ctx.fillRect(ox+8,oy-1,4,3);ctx.fillRect(ox+14,oy-1,4,3);
    // HUGE teeth
    ctx.fillStyle='#fff';
    ctx.fillRect(ox+7,oy+3,4,6);ctx.fillRect(ox+12,oy+3,4,6);ctx.fillRect(ox+17,oy+3,4,6);
    ctx.strokeStyle='#ccc';ctx.lineWidth=1;
    ctx.strokeRect(ox+7,oy+3,4,6);ctx.strokeRect(ox+12,oy+3,4,6);ctx.strokeRect(ox+17,oy+3,4,6);
    // pizza slice in mouth
    ctx.fillStyle='#FF8C00';ctx.fillRect(ox+21,oy-1,8,6);
    ctx.fillStyle='#CC3322';ctx.fillRect(ox+22,oy,6,4);
    ctx.fillStyle='#FFD700';ctx.fillRect(ox+22,oy-1,6,2);
  }
}

export function drawBossSprite(ctx, boss, scrollX, bossHits, bossMaxHits, C) {
  if(!boss) return;
  const ox=boss.x-scrollX,oy=boss.y;
  if(ox>920||ox+boss.w<-120) return;
  if(boss.dead){
    ctx.globalAlpha=Math.max(0,boss.deadTimer/60);
    ctx.font='64px serif';ctx.textAlign='center';
    ctx.fillText('💀',ox+boss.w/2,oy+boss.h/2);
    ctx.globalAlpha=1;return;
  }
  boss.at++;
  const bob=Math.sin(boss.at*0.05)*4;
  const angry=boss.inv>0;

  if(boss.type==='landlord'){
    const bx=ox,by=oy+bob;
    ctx.fillStyle='#111';ctx.fillRect(bx+4,by+76,18,8);ctx.fillRect(bx+38,by+76,18,8);
    ctx.fillStyle='#333';ctx.fillRect(bx+6,by+76,12,5);ctx.fillRect(bx+40,by+76,12,5);
    ctx.fillStyle='#1a1a3a';ctx.fillRect(bx+6,by+52,18,26);ctx.fillRect(bx+36,by+52,18,26);
    ctx.fillStyle='#2a2a4a';ctx.fillRect(bx+8,by+52,10,14);ctx.fillRect(bx+38,by+52,10,14);
    ctx.fillStyle=angry?'#8B0000':'#4a4a6a';ctx.fillRect(bx,by+22,boss.w,32);
    ctx.fillStyle=angry?'#aa1010':'#5a5a7a';ctx.fillRect(bx+4,by+22,boss.w-8,12);
    ctx.fillStyle=angry?'#6a0000':'#3a3a5a';ctx.fillRect(bx,by+48,boss.w,6);
    ctx.fillStyle='#fff';ctx.fillRect(bx+22,by+22,16,14);
    ctx.fillStyle='#eee';ctx.fillRect(bx+24,by+22,12,6);
    ctx.fillStyle='#e74c3c';ctx.fillRect(bx+27,by+24,6,18);
    ctx.fillStyle='#c0392b';ctx.fillRect(bx+28,by+24,4,16);
    ctx.fillStyle='#ff6655';ctx.fillRect(bx+28,by+24,2,8);
    ctx.fillStyle=angry?'#8B0000':'#4a4a6a';
    ctx.beginPath();ctx.moveTo(bx+22,by+22);ctx.lineTo(bx+14,by+34);ctx.lineTo(bx+22,by+36);ctx.closePath();ctx.fill();
    ctx.beginPath();ctx.moveTo(bx+38,by+22);ctx.lineTo(bx+46,by+34);ctx.lineTo(bx+38,by+36);ctx.closePath();ctx.fill();
    ctx.fillStyle=angry?'#8B0000':'#4a4a6a';ctx.fillRect(bx-10,by+22,12,24);ctx.fillRect(bx+boss.w-2,by+22,12,24);
    ctx.fillStyle=angry?'#aa1010':'#5a5a7a';ctx.fillRect(bx-8,by+22,6,16);ctx.fillRect(bx+boss.w,by+22,6,16);
    ctx.fillStyle='#c8a070';ctx.fillRect(bx-10,by+44,12,10);ctx.fillRect(bx+boss.w-2,by+44,12,10);
    ctx.fillStyle='#d8b080';ctx.fillRect(bx-8,by+44,6,6);ctx.fillRect(bx+boss.w,by+44,6,6);
    ctx.fillStyle='#fff';ctx.fillRect(bx+boss.w+8,by+38,18,22);
    ctx.fillStyle='#eee';ctx.fillRect(bx+boss.w+10,by+40,14,2);ctx.fillRect(bx+boss.w+10,by+44,14,2);ctx.fillRect(bx+boss.w+10,by+48,14,2);
    ctx.fillStyle='#e74c3c';ctx.font='5px sans-serif';ctx.textAlign='center';
    ctx.fillText('EVICT',bx+boss.w+17,by+42);
    ctx.fillStyle=angry?'#d4604a':'#d4905a';ctx.fillRect(bx+14,by-10,boss.w-28,34);
    ctx.fillStyle=angry?'#e47060':'#e4a06a';ctx.fillRect(bx+16,by-10,boss.w-32,12);
    ctx.fillStyle=angry?'#c45040':'#c4804a';ctx.fillRect(bx+14,by+20,boss.w-28,4);
    ctx.fillStyle=angry?'#c45040':'#c4804a';ctx.fillRect(bx+10,by+10,10,16);ctx.fillRect(bx+40,by+10,10,16);
    ctx.fillStyle='#5c3d1a';ctx.fillRect(bx+14,by-10,boss.w-28,6);ctx.fillRect(bx+12,by-8,4,8);ctx.fillRect(bx+44,by-8,4,8);
    ctx.fillStyle='#1a1a1a';ctx.fillRect(bx+18,by+0,10,8);ctx.fillRect(bx+32,by+0,10,8);
    ctx.fillStyle='#fff';ctx.fillRect(bx+18,by+0,3,3);ctx.fillRect(bx+32,by+0,3,3);
    ctx.strokeStyle='#5c3d1a';ctx.lineWidth=3;
    if(angry){
      ctx.beginPath();ctx.moveTo(bx+16,by-3);ctx.lineTo(bx+28,by+2);ctx.stroke();
      ctx.beginPath();ctx.moveTo(bx+44,by-3);ctx.lineTo(bx+32,by+2);ctx.stroke();
    } else {
      ctx.fillStyle='#5c3d1a';ctx.fillRect(bx+16,by-2,12,3);ctx.fillRect(bx+32,by-2,12,3);
    }
    ctx.fillStyle='#5c3d1a';ctx.fillRect(bx+20,by+10,20,5);
    ctx.fillStyle='#8B2000';ctx.fillRect(bx+22,by+12,16,5);
    ctx.fillStyle='#fff';ctx.fillRect(bx+24,by+12,4,4);ctx.fillRect(bx+32,by+12,4,4);

  } else if(boss.type==='ratking'){
    // RAT KING — giant Rat Fink style, green, crown, pizza
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
    [[bx+3,by+89],[bx+9,by+92],[bx+15,by+89],[bx+37,by+89],[bx+43,by+92],[bx+49,by+89]].forEach(([cx,cy])=>{ctx.beginPath();ctx.arc(cx,cy,4,0,Math.PI*2);ctx.fill();});
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
    ctx.fillStyle='#FFD700';ctx.font='bold 11px sans-serif';ctx.textAlign='center';
    ctx.fillText('RF',bx+30,by+52);
    // arms
    ctx.fillStyle='#2a8a2a';ctx.fillRect(bx-12,by+32,16,22);ctx.fillRect(bx+boss.w-4,by+32,16,22);
    ctx.fillStyle='#3aaa3a';ctx.fillRect(bx-10,by+32,8,14);ctx.fillRect(bx+boss.w-2,by+32,8,14);
    // pizza slice held up
    ctx.fillStyle='#1a6a1a';ctx.fillRect(bx+boss.w+8,by+48,12,10);
    ctx.fillStyle='#C8860A';ctx.beginPath();ctx.moveTo(bx+boss.w+20,by+18);ctx.lineTo(bx+boss.w+6,by+52);ctx.lineTo(bx+boss.w+34,by+52);ctx.closePath();ctx.fill();
    ctx.fillStyle='#FFD966';ctx.beginPath();ctx.moveTo(bx+boss.w+20,by+23);ctx.lineTo(bx+boss.w+9,by+50);ctx.lineTo(bx+boss.w+31,by+50);ctx.closePath();ctx.fill();
    ctx.fillStyle='#C0392B';ctx.beginPath();ctx.moveTo(bx+boss.w+20,by+27);ctx.lineTo(bx+boss.w+12,by+48);ctx.lineTo(bx+boss.w+28,by+48);ctx.closePath();ctx.fill();
    [bx+boss.w+8,bx+boss.w+14,bx+boss.w+20,bx+boss.w+26,bx+boss.w+32].forEach(x=>{ctx.fillStyle='#b8750a';ctx.beginPath();ctx.arc(x,by+52,3,0,Math.PI*2);ctx.fill();});
    // neck
    ctx.fillStyle='#2a8a2a';ctx.fillRect(bx+20,by+22,20,10);
    ctx.fillStyle='#3aaa3a';ctx.fillRect(bx+22,by+22,12,6);
    // head
    ctx.fillStyle='#2a8a2a';ctx.beginPath();ctx.ellipse(bx+30,by+10,24,20,0,0,Math.PI*2);ctx.fill();
    ctx.fillStyle='#3aaa3a';ctx.beginPath();ctx.ellipse(bx+30,by+5,16,12,0,0,Math.PI*2);ctx.fill();
    ctx.fillStyle='#1a7a1a';ctx.beginPath();ctx.ellipse(bx+30,by+18,18,10,0,0,Math.PI*2);ctx.fill();
    // ears
    ctx.fillStyle='#2a8a2a';ctx.beginPath();ctx.ellipse(bx+10,by+2,9,12,-.3,0,Math.PI*2);ctx.fill();
    ctx.beginPath();ctx.ellipse(bx+50,by+2,9,12,.3,0,Math.PI*2);ctx.fill();
    ctx.fillStyle='#ff8888';ctx.beginPath();ctx.ellipse(bx+10,by+2,5,8,-.3,0,Math.PI*2);ctx.fill();
    ctx.beginPath();ctx.ellipse(bx+50,by+2,5,8,.3,0,Math.PI*2);ctx.fill();
    ctx.fillStyle='#ff9999';ctx.beginPath();ctx.ellipse(bx+10,by+1,3,5,-.3,0,Math.PI*2);ctx.fill();
    ctx.beginPath();ctx.ellipse(bx+50,by+1,3,5,.3,0,Math.PI*2);ctx.fill();
    // HUGE bulging eyes
    ctx.fillStyle='#fff';ctx.beginPath();ctx.ellipse(bx+18,by+5,10,13,-.2,0,Math.PI*2);ctx.fill();
    ctx.beginPath();ctx.ellipse(bx+42,by+5,10,13,.2,0,Math.PI*2);ctx.fill();
    ctx.strokeStyle='#000';ctx.lineWidth=2;
    ctx.beginPath();ctx.ellipse(bx+18,by+5,10,13,-.2,0,Math.PI*2);ctx.stroke();
    ctx.beginPath();ctx.ellipse(bx+42,by+5,10,13,.2,0,Math.PI*2);ctx.stroke();
    ctx.fillStyle='#cc0000';ctx.beginPath();ctx.arc(bx+18,by+6,6,0,Math.PI*2);ctx.fill();
    ctx.beginPath();ctx.arc(bx+42,by+6,6,0,Math.PI*2);ctx.fill();
    ctx.fillStyle='#000';ctx.beginPath();ctx.arc(bx+18,by+6,3,0,Math.PI*2);ctx.fill();
    ctx.beginPath();ctx.arc(bx+42,by+6,3,0,Math.PI*2);ctx.fill();
    ctx.fillStyle='#fff';ctx.beginPath();ctx.arc(bx+16,by+4,2,0,Math.PI*2);ctx.fill();
    ctx.beginPath();ctx.arc(bx+40,by+4,2,0,Math.PI*2);ctx.fill();
    // eye veins
    ctx.strokeStyle='rgba(255,0,0,0.5)';ctx.lineWidth=1;
    [[bx+12,by],[bx+16,by+5],[bx+24,by],[bx+20,by+5],[bx+36,by],[bx+40,by+5],[bx+48,by],[bx+44,by+5]].forEach((_,i,a)=>{if(i%2===0){ctx.beginPath();ctx.moveTo(a[i][0],a[i][1]);ctx.lineTo(a[i+1][0],a[i+1][1]);ctx.stroke();}});
    // snout
    ctx.fillStyle='#1a6a1a';ctx.beginPath();ctx.ellipse(bx+30,by+20,12,8,0,0,Math.PI*2);ctx.fill();
    ctx.fillStyle='#2a8a2a';ctx.beginPath();ctx.ellipse(bx+30,by+18,8,5,0,0,Math.PI*2);ctx.fill();
    ctx.fillStyle='#ff9999';ctx.fillRect(bx+24,by+18,6,4);ctx.fillRect(bx+32,by+18,6,4);
    // HUGE teeth
    ctx.fillStyle='#fff';
    ctx.fillRect(bx+20,by+23,6,10);ctx.fillRect(bx+27,by+23,6,10);ctx.fillRect(bx+34,by+23,6,10);
    ctx.strokeStyle='#bbb';ctx.lineWidth=1;
    ctx.strokeRect(bx+20,by+23,6,10);ctx.strokeRect(bx+27,by+23,6,10);ctx.strokeRect(bx+34,by+23,6,10);
    // CROWN
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
    ctx.fillStyle='#111';ctx.fillRect(bx+4,by+76,18,8);ctx.fillRect(bx+38,by+76,18,8);
    ctx.fillStyle='#444';ctx.fillRect(bx+6,by+76,12,4);ctx.fillRect(bx+40,by+76,12,4);
    ctx.fillStyle='#111';ctx.fillRect(bx+6,by+52,18,26);ctx.fillRect(bx+36,by+52,18,26);
    ctx.fillStyle='#222';ctx.fillRect(bx+8,by+52,10,14);ctx.fillRect(bx+38,by+52,10,14);
    ctx.fillStyle=angry?'#5a0020':'#6a0030';ctx.fillRect(bx,by+22,boss.w,32);
    ctx.fillStyle=angry?'#7a0030':'#8a0040';ctx.fillRect(bx+4,by+22,boss.w-8,12);
    ctx.fillStyle=angry?'#4a0018':'#5a0028';ctx.fillRect(bx,by+48,boss.w,6);
    ctx.fillStyle='#f0f0f0';ctx.fillRect(bx+22,by+22,16,14);
    ctx.fillStyle='#fff';ctx.fillRect(bx+24,by+22,12,6);
    ctx.fillStyle='#111';ctx.beginPath();ctx.arc(bx+30,by+30,6,0,Math.PI*2);ctx.fill();
    ctx.fillStyle='#cc0000';ctx.beginPath();ctx.arc(bx+30,by+30,5,0,Math.PI*2);ctx.fill();
    ctx.fillStyle='#FFD700';ctx.font='5px sans-serif';ctx.textAlign='center';
    ctx.fillText('REC',bx+30,by+33);
    ctx.fillStyle=angry?'#6a0030':'#7a0040';
    ctx.beginPath();ctx.moveTo(bx+22,by+22);ctx.lineTo(bx+14,by+36);ctx.lineTo(bx+22,by+38);ctx.closePath();ctx.fill();
    ctx.beginPath();ctx.moveTo(bx+38,by+22);ctx.lineTo(bx+46,by+36);ctx.lineTo(bx+38,by+38);ctx.closePath();ctx.fill();
    ctx.strokeStyle='#FFD700';ctx.lineWidth=3;
    ctx.beginPath();ctx.arc(bx+30,by+36,10,0,Math.PI);ctx.stroke();
    ctx.fillStyle=angry?'#5a0020':'#6a0030';ctx.fillRect(bx-10,by+22,12,24);ctx.fillRect(bx+boss.w-2,by+22,12,24);
    ctx.fillStyle='#c8a070';ctx.fillRect(bx-10,by+44,12,10);ctx.fillRect(bx+boss.w-2,by+44,12,10);
    ctx.fillStyle='#fff';ctx.fillRect(bx-16,by+36,18,24);
    [by+40,by+44,by+48,by+52].forEach(y=>{ctx.fillStyle='#eee';ctx.fillRect(bx-14,y,14,2);});
    ctx.fillStyle='#e74c3c';ctx.font='5px sans-serif';ctx.textAlign='center';
    ctx.fillText('SIGN',bx-7,by+40);ctx.fillText('HERE',bx-7,by+45);
    ctx.fillStyle='#FFD700';ctx.fillRect(bx+boss.w+6,by+38,4,20);
    ctx.fillStyle='#111';ctx.fillRect(bx+boss.w+6,by+56,4,5);
    ctx.fillStyle='#c8a070';ctx.fillRect(bx+12,by-10,boss.w-24,36);
    ctx.fillStyle='#d8b080';ctx.fillRect(bx+14,by-10,boss.w-28,12);
    ctx.fillStyle='#b89060';ctx.fillRect(bx+12,by+22,boss.w-24,4);
    ctx.fillStyle='#b89060';ctx.fillRect(bx+8,by+6,10,18);ctx.fillRect(bx+42,by+6,10,18);
    ctx.fillStyle='#0a0a0a';ctx.fillRect(bx+12,by-10,boss.w-24,8);
    ctx.fillStyle='#222';ctx.fillRect(bx+14,by-10,boss.w-28,4);
    ctx.fillStyle='#0a0a0a';ctx.fillRect(bx+10,by-8,4,14);ctx.fillRect(bx+46,by-8,4,12);
    ctx.fillStyle='#111';ctx.fillRect(bx+14,by+2,16,12);ctx.fillRect(bx+32,by+2,16,12);
    ctx.fillStyle='#1a1a1a';ctx.fillRect(bx+28,by+4,4,6);
    ctx.strokeStyle='#888';ctx.lineWidth=2;
    ctx.strokeRect(bx+14,by+2,16,12);ctx.strokeRect(bx+32,by+2,16,12);
    ctx.fillStyle='rgba(255,255,255,0.12)';ctx.fillRect(bx+15,by+3,7,5);ctx.fillRect(bx+33,by+3,7,5);
    ctx.fillStyle='#8B4513';ctx.beginPath();ctx.arc(bx+30,by+18,10,0,Math.PI);ctx.fill();
    ctx.fillStyle='#c8a070';ctx.fillRect(bx+22,by+18,16,6);
    ctx.fillStyle='#fff';ctx.fillRect(bx+24,by+18,5,5);ctx.fillRect(bx+30,by+18,5,5);ctx.fillRect(bx+35,by+18,4,5);
  }

  // HP bar
  ctx.fillStyle='rgba(0,0,0,0.7)';ctx.fillRect(ox-8,oy-32,boss.w+16,14);
  ctx.fillStyle='#e74c3c';ctx.fillRect(ox-6,oy-30,Math.max(0,(boss.w+12)*((bossMaxHits-bossHits)/bossMaxHits)),10);
  ctx.fillStyle='rgba(255,80,80,0.3)';ctx.fillRect(ox-6,oy-30,Math.max(0,(boss.w+12)*((bossMaxHits-bossHits)/bossMaxHits)),5);
  ctx.strokeStyle=C.gold;ctx.lineWidth=2;ctx.strokeRect(ox-8,oy-32,boss.w+16,14);
  const names={landlord:'LANDLORD',ratking:'RAT KING',recordexec:'RECORD EXEC'};
  ctx.fillStyle=C.gold;ctx.font='8px "Press Start 2P"';ctx.textAlign='center';
  ctx.fillText(names[boss.type]||'BOSS',ox+boss.w/2,oy-35);
}