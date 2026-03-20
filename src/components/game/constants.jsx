import { useEffect, useRef, useState } from 'react';
import { C } from '../data/constants';
import { LEVELS } from './game/levels.jsx';
import { drawCharSprite, drawPizzaSlice, drawTaco, drawEnemySprite, drawBossSprite } from './game/sprites.jsx';

const W = 780;
const H = 520;
const GROUND = H - 80;
const PW = 24;
const PH = 32;
const GRAVITY = 0.65;
const JUMP_POWER = -13;
const SONG_FILE = '/kylesong.mp3';
const SONG_VOLUME = 0.5;

export default function PizzaGame() {
  const canvasRef = useRef(null);
  const gameRef = useRef({});
  const [uiState, setUiState] = useState({ state:'title', score:0, lives:3, pizza:0, level:1 });
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const music = new Audio(SONG_FILE);
    music.loop = true;
    music.volume = SONG_VOLUME;

    let gState='title';
    let sc=0, lv=3, pc=0, levelIdx=0;
    let frame=0, scrollX=0, spT=0, piT=0, highSc=0;
    let obs=[], pizzas=[], parts=[], blds=[];
    let keys={}, charIdx=0, selectedChar=0;
    let boss=null, bossHits=0, bossMaxHits=8;
    let transitionTimer=0;

    const pl={x:80,y:GROUND-PH,vx:0,vy:0,og:true,face:1,inv:0};
    const sync=()=>setUiState({state:gState,score:sc,lives:lv,pizza:pc,level:levelIdx+1});
    const cfg=()=>LEVELS[levelIdx];

    function reset() {
      Object.assign(pl,{x:80,y:GROUND-PH,vx:0,vy:0,og:true,inv:0});
      obs=[];pizzas=[];parts=[];blds=[];
      boss=null;bossHits=0;
      scrollX=0;spT=0;piT=0;
      for(let i=0;i<26;i++) blds.push(mkBld(i*160+200));
    }

    function start() {
      sc=0;lv=3;pc=0;levelIdx=0;
      charIdx=selectedChar;
      reset();
      gState='playing';
      music.currentTime=0;
      music.play().catch(()=>{});
      sync();
    }

    function respawn() {
      Object.assign(pl,{x:80,y:GROUND-PH,vx:0,vy:0,og:true,inv:180});
      charIdx=selectedChar;
      gState='playing';
      music.play().catch(()=>{});
      sync();
    }

    function jump() {
      if(pl.og){pl.vy=JUMP_POWER;pl.og=false;}
    }

    function mkBld(x) {
      const c=cfg();
      const awningCols=['#c0392b','#2980b9','#27ae60','#8e44ad','#e67e22'];
      let specialType=null;
      if(levelIdx===0){
        const r=Math.random();
        if(r<0.1) specialType='grove';
        else if(r<0.2) specialType='hyperion';
        else if(r<0.32) specialType='ypsi';
      } else if(levelIdx===1){
        const r=Math.random();
        if(r<0.1) specialType='standrews';
        else if(r<0.18) specialType='checker';
        else if(r<0.26) specialType='rencen';
      } else if(levelIdx===2){
        if(Math.random()<0.22) specialType='mexican';
      }
      return {
        x,
        w:55+Math.random()*85,
        h:70+Math.random()*160,
        color:c.buildingCols[Math.floor(Math.random()*c.buildingCols.length)],
        wc:Math.floor(Math.random()*4)+2,
        wr:Math.floor(Math.random()*3)+2,
        specialType,
        awningCol:awningCols[Math.floor(Math.random()*awningCols.length)],
      };
    }

    function spawnEnemy() {
      if(boss&&!boss.dead) return;
      const c=cfg();
      const r=Math.random();
      const type=r<0.28?'cone':r<0.55?'metermaid':r<0.78?'muscledude':'rat';
      const geo={cone:{w:18,h:26,gy:GROUND-26},metermaid:{w:22,h:38,gy:GROUND-38},muscledude:{w:28,h:40,gy:GROUND-40},rat:{w:20,h:16,gy:GROUND-16}}[type];
      obs.push({type,x:W+scrollX+80,y:geo.gy,w:geo.w,h:geo.h,vx:-c.enemySpeed,at:0,dead:false,deadTimer:0});
    }

    function spawnCollectible() {
      if(boss&&!boss.dead) return;
      const fly=Math.random()<0.4;
      pizzas.push({x:W+scrollX+80,y:fly?GROUND-PH-50-Math.random()*60:GROUND-PH-4,bob:Math.random()*Math.PI*2,collected:false,type:cfg().collectible});
    }

    function triggerBoss() {
      obs=[];pizzas=[];
      bossMaxHits=6+levelIdx*2;
      bossHits=0;
      const types=['landlord','ratking','recordexec'];
      boss={type:types[levelIdx],x:W+scrollX+120,y:GROUND-80,w:60,h:80,vx:-(1.8+levelIdx*0.4),at:0,inv:0,dead:false,deadTimer:0};
    }

    function addParts(x,y,col,n) {
      for(let i=0;i<n;i++) parts.push({x,y,vx:(Math.random()-0.5)*7,vy:(Math.random()-0.5)*7-2,life:50+Math.random()*20,ml:70,col,sz:3+Math.random()*4});
    }

    function drawBackground() {
      const c=cfg();
      if(c.daytime){
        // DAYTIME SKY — Ypsilanti
        const sg=ctx.createLinearGradient(0,0,0,GROUND);
        sg.addColorStop(0,'#4a90d9');sg.addColorStop(1,'#87ceeb');
        ctx.fillStyle=sg;ctx.fillRect(0,0,W,GROUND);
        // sun
        ctx.fillStyle='#FFD700';ctx.beginPath();ctx.arc(W-90,55,26,0,Math.PI*2);ctx.fill();
        ctx.fillStyle='rgba(255,215,0,0.25)';ctx.beginPath();ctx.arc(W-90,55,38,0,Math.PI*2);ctx.fill();
        // clouds
        ctx.fillStyle='rgba(255,255,255,0.92)';
        [[100,75,35],[240,55,28],[400,85,32],[560,65,26],[680,50,30]].forEach(([cx,cy,r])=>{
          const cloudX=((cx-scrollX*0.04+W*2)%(W+80))-40;
          ctx.beginPath();ctx.arc(cloudX,cy,r,0,Math.PI*2);ctx.fill();
          ctx.beginPath();ctx.arc(cloudX+r*0.65,cy+6,r*0.65,0,Math.PI*2);ctx.fill();
          ctx.beginPath();ctx.arc(cloudX-r*0.55,cy+9,r*0.55,0,Math.PI*2);ctx.fill();
        });
      } else {
        const sg=ctx.createLinearGradient(0,0,0,GROUND);
        sg.addColorStop(0,c.skyTop);sg.addColorStop(1,c.skyBot);
        ctx.fillStyle=sg;ctx.fillRect(0,0,W,GROUND);
        for(let i=0;i<40;i++){
          const sx=((i*137+scrollX*0.07)%(W+40)+W+40)%(W+40),sy=(i*73)%(GROUND*0.5);
          ctx.fillStyle=Math.sin(frame*0.03+i)>0.4?c.starColor:'rgba(212,160,23,0.15)';
          ctx.fillRect(sx,sy,2,2);
        }
        ctx.fillStyle=c.moonColor;ctx.beginPath();ctx.arc(W-65,50,20,0,Math.PI*2);ctx.fill();
        ctx.fillStyle=c.skyTop;ctx.beginPath();ctx.arc(W-56,44,17,0,Math.PI*2);ctx.fill();
        if(levelIdx===2){
          const ng=ctx.createLinearGradient(0,GROUND-50,0,GROUND);
          ng.addColorStop(0,'rgba(231,76,60,0)');ng.addColorStop(1,'rgba(231,76,60,0.22)');
          ctx.fillStyle=ng;ctx.fillRect(0,GROUND-50,W,50);
        }
      }
      const farCol=c.daytime?'rgba(80,120,60,0.5)':c.skyTop;
      ctx.fillStyle=farCol;
      for(let i=0;i<10;i++){const bx=((i*105-scrollX*0.1)%(W+200)+W+200)%(W+200)-100;ctx.fillRect(bx,GROUND-45-(i%4)*22,40+(i%3)*14,45+(i%4)*22);}
    }

    function drawBuilding(b) {
      const c=cfg();
      const bx=b.x-scrollX;
      if(bx>W+200||bx+b.w<-200) return;

      // GROVE STUDIOS
      if(b.specialType==='grove'){
        ctx.fillStyle='#2a2a2a';ctx.fillRect(bx,GROUND-130,90,130);
        ctx.strokeStyle='#444';ctx.lineWidth=2;ctx.strokeRect(bx,GROUND-130,90,130);
        ctx.fillStyle='rgba(150,200,255,0.3)';ctx.fillRect(bx+8,GROUND-105,74,55);
        ctx.strokeStyle='#555';ctx.strokeRect(bx+8,GROUND-105,74,55);
        ctx.strokeStyle='#444';ctx.lineWidth=1;
        ctx.beginPath();ctx.moveTo(bx+45,GROUND-105);ctx.lineTo(bx+45,GROUND-50);ctx.stroke();
        ctx.beginPath();ctx.moveTo(bx+8,GROUND-78);ctx.lineTo(bx+82,GROUND-78);ctx.stroke();
        ctx.fillStyle='#cc0000';ctx.fillRect(bx+4,GROUND-128,82,20);
        ctx.fillStyle='#fff';ctx.font='bold 7px "Press Start 2P"';ctx.textAlign='center';
        ctx.fillText('GROVE',bx+45,GROUND-120);
        ctx.font='5px "Press Start 2P"';ctx.fillText('STUDIOS',bx+45,GROUND-112);
        ctx.fillStyle='#333';ctx.fillRect(bx+32,GROUND-42,26,42);
        ctx.fillStyle='rgba(150,200,255,0.2)';ctx.fillRect(bx+34,GROUND-40,10,22);ctx.fillRect(bx+46,GROUND-40,10,22);
        ctx.fillStyle='#ffe066';
        for(let i=0;i<6;i++){
          const gx=bx+8+i*14;
          ctx.beginPath();ctx.arc(gx,GROUND-132+Math.sin(frame*0.04+i)*2,2,0,Math.PI*2);ctx.fill();
        }
        return;
      }

      // HYPERION COFFEE
      if(b.specialType==='hyperion'){
        ctx.fillStyle='#4a3020';ctx.fillRect(bx,GROUND-110,80,110);
        ctx.strokeStyle='#2a1a10';ctx.lineWidth=2;ctx.strokeRect(bx,GROUND-110,80,110);
        ctx.fillStyle='rgba(255,200,100,0.4)';ctx.fillRect(bx+6,GROUND-85,68,50);
        ctx.strokeStyle='#5a3a20';ctx.strokeRect(bx+6,GROUND-85,68,50);
        ctx.fillStyle='#1a5a4a';ctx.fillRect(bx+4,GROUND-110,72,24);
        ctx.fillStyle='#fff';ctx.font='bold 7px "Press Start 2P"';ctx.textAlign='center';
        ctx.fillText('HYPERION',bx+40,GROUND-102);
        ctx.font='5px "Press Start 2P"';ctx.fillText('COFFEE',bx+40,GROUND-94);
        ctx.fillStyle='#fff';ctx.fillRect(bx+32,GROUND-88,16,11);
        ctx.fillStyle='#1a5a4a';ctx.fillRect(bx+33,GROUND-87,14,9);
        ctx.strokeStyle='rgba(255,255,255,0.5)';ctx.lineWidth=1;
        [bx+36,bx+39,bx+42].forEach(hx=>{ctx.beginPath();ctx.moveTo(hx,GROUND-89);ctx.quadraticCurveTo(hx+2,GROUND-94,hx,GROUND-97);ctx.stroke();});
        ctx.fillStyle='#2a1a10';ctx.fillRect(bx+27,GROUND-42,26,42);
        ctx.fillStyle='rgba(255,200,100,0.25)';ctx.fillRect(bx+29,GROUND-40,22,24);
        return;
      }

      // YPSILANTI colorful storefront
      if(b.specialType==='ypsi'){
        ctx.fillStyle=b.color;ctx.fillRect(bx,GROUND-120,b.w,120);
        ctx.fillStyle='rgba(200,220,255,0.22)';ctx.fillRect(bx+4,GROUND-78,b.w-8,48);
        ctx.strokeStyle='#333';ctx.lineWidth=2;ctx.strokeRect(bx+4,GROUND-78,b.w-8,48);
        ctx.strokeStyle='#444';ctx.lineWidth=1;
        ctx.beginPath();ctx.moveTo(bx+b.w/2,GROUND-78);ctx.lineTo(bx+b.w/2,GROUND-30);ctx.stroke();
        ctx.beginPath();ctx.moveTo(bx+4,GROUND-54);ctx.lineTo(bx+b.w-4,GROUND-54);ctx.stroke();
        ctx.fillStyle=b.awningCol;ctx.fillRect(bx,GROUND-84,b.w,8);
        ctx.fillStyle='#ffe066';
        for(let i=0;i<6;i++){
          const lx=bx+4+i*(b.w-8)/5;
          const ly=GROUND-121+Math.sin(i*1.3)*3;
          if(Math.sin(frame*0.04+i)>0){ctx.shadowBlur=5;ctx.shadowColor='#ffe066';}
          ctx.beginPath();ctx.arc(lx,ly,2,0,Math.PI*2);ctx.fill();ctx.shadowBlur=0;
        }
        for(let i=0;i<3;i++){
          ctx.fillStyle=Math.sin(frame*0.02+i*2.2)>0?'#ffe066':'#333';
          ctx.fillRect(bx+6+i*((b.w-12)/3),GROUND-113,b.w/4-4,16);
        }
        return;
      }

      // ST. ANDREWS HALL
      if(b.specialType==='standrews'){
        ctx.fillStyle='#2a1a10';ctx.fillRect(bx,GROUND-165,100,165);
        ctx.fillStyle='rgba(0,0,0,0.15)';
        for(let r=0;r<20;r++) for(let cc=0;cc<6;cc++){if((r+cc)%2===0)ctx.fillRect(bx+cc*16+(r%2)*8,GROUND-165+r*8,14,6);}
        ctx.fillStyle='#111';ctx.fillRect(bx+2,GROUND-118,96,26);
        ctx.fillStyle='#ffe066';
        for(let i=0;i<10;i++){if(Math.floor(frame/8+i)%2===0){ctx.beginPath();ctx.arc(bx+6+i*9,GROUND-107,3,0,Math.PI*2);ctx.fill();}}
        ctx.fillStyle='#fff';ctx.font='bold 7px "Press Start 2P"';ctx.textAlign='center';
        ctx.fillText('ST. ANDREWS',bx+50,GROUND-126);
        ctx.font='5px "Press Start 2P"';ctx.fillText('HALL',bx+50,GROUND-118);
        ctx.fillStyle='#111';
        ctx.beginPath();ctx.arc(bx+50,GROUND-42,22,Math.PI,0);ctx.lineTo(bx+72,GROUND);ctx.lineTo(bx+28,GROUND);ctx.closePath();ctx.fill();
        ctx.fillStyle='rgba(255,200,0,0.18)';
        ctx.beginPath();ctx.arc(bx+50,GROUND-42,20,Math.PI,0);ctx.lineTo(bx+70,GROUND-2);ctx.lineTo(bx+30,GROUND-2);ctx.closePath();ctx.fill();
        for(let i=0;i<4;i++){ctx.fillStyle=Math.sin(frame*0.02+i)>0?'#ffe066':'#111';ctx.fillRect(bx+8+i*22,GROUND-158,14,20);}
        return;
      }

      // CHECKER BAR
      if(b.specialType==='checker'){
        ctx.fillStyle='#1a1a1a';ctx.fillRect(bx,GROUND-105,88,105);
        ctx.strokeStyle='#333';ctx.lineWidth=2;ctx.strokeRect(bx,GROUND-105,88,105);
        const sq=8;
        for(let r=0;r<3;r++) for(let cc=0;cc<11;cc++){
          ctx.fillStyle=(r+cc)%2===0?'#fff':'#111';
          ctx.fillRect(bx+cc*sq,GROUND-105+r*sq,sq,sq);
        }
        ctx.fillStyle='#cc0000';
        ctx.shadowBlur=8;ctx.shadowColor='#ff0000';
        ctx.fillRect(bx+4,GROUND-76,80,20);ctx.shadowBlur=0;
        ctx.fillStyle='#fff';ctx.font='bold 6px "Press Start 2P"';ctx.textAlign='center';
        ctx.fillText('CHECKER BAR',bx+44,GROUND-63);
        ctx.fillStyle='rgba(255,120,0,0.4)';ctx.fillRect(bx+6,GROUND-45,32,32);ctx.fillRect(bx+50,GROUND-45,32,32);
        ctx.fillStyle='#111';ctx.fillRect(bx+30,GROUND-40,28,40);
        return;
      }

      // REN CEN
      if(b.specialType==='rencen'){
        ctx.fillStyle='#1a2a1a';ctx.fillRect(bx+20,GROUND-220,30,220);
        for(let i=0;i<4;i++){const offX=[0,50,0,50][i];ctx.fillStyle='#152315';ctx.fillRect(bx+offX,GROUND-145,20,145);}
        for(let r=0;r<8;r++) for(let cc=0;cc<2;cc++){
          ctx.fillStyle=Math.sin(frame*0.02+r+cc)>0?'#D4A017':'#0a1506';
          ctx.fillRect(bx+24+cc*12,GROUND-214+r*24,8,14);
        }
        ctx.fillStyle='#D4A017';ctx.font='6px "Press Start 2P"';ctx.textAlign='center';
        ctx.fillText('REN CEN',bx+35,GROUND-225);
        return;
      }

      // MEXICANTOWN buildings
      if(b.specialType==='mexican'){
        ctx.fillStyle=b.color;ctx.fillRect(bx,GROUND-b.h,b.w,b.h);
        ctx.fillStyle='rgba(0,0,0,0.18)';
        for(let r=0;r<Math.floor(b.h/8);r++) for(let cc=0;cc<Math.floor(b.w/16);cc++){if((r+cc)%2===0)ctx.fillRect(bx+cc*16+(r%2)*8,GROUND-b.h+r*8,14,6);}
        ctx.fillStyle=b.awningCol;ctx.fillRect(bx,GROUND-b.h*0.38,b.w,10);
        const flagCols=['#e74c3c','#f39c12','#2ecc71','#3498db','#9b59b6','#fff'];
        for(let i=0;i<8;i++){
          ctx.fillStyle=flagCols[i%flagCols.length];
          const fx=bx+4+i*(b.w-8)/7;
          const fy=GROUND-b.h+5+Math.sin(frame*0.03+i)*3;
          ctx.fillRect(fx,fy,8,12);
        }
        for(let r=0;r<b.wr;r++) for(let cc=0;cc<b.wc;cc++){
          const wx=bx+8+cc*17,wy=GROUND-b.h+20+r*22;
          if(wx+10<bx+b.w-4){ctx.fillStyle=Math.sin(frame*0.013+r+cc+b.x*0.01)>0?'#f39c12':'#050505';ctx.fillRect(wx,wy,10,10);}
        }
        return;
      }

      // GENERIC building
      ctx.fillStyle=b.color;ctx.fillRect(bx,GROUND-b.h,b.w,b.h);
      ctx.strokeStyle='#000';ctx.lineWidth=1;ctx.strokeRect(bx,GROUND-b.h,b.w,b.h);
      if(levelIdx===0&&b.w>58){
        ctx.fillStyle=b.awningCol||'#c0392b';ctx.fillRect(bx,GROUND-b.h*0.35,b.w,7);
        ctx.fillStyle='rgba(255,255,255,0.12)';ctx.fillRect(bx+4,GROUND-b.h*0.35+8,b.w-8,b.h*0.28);
        ctx.strokeStyle='rgba(0,0,0,0.25)';ctx.strokeRect(bx+4,GROUND-b.h*0.35+8,b.w-8,b.h*0.28);
      }
      const wc=cfg().windowColor;
      for(let r=0;r<b.wr;r++) for(let cc=0;cc<b.wc;cc++){
        const wx=bx+8+cc*17,wy=GROUND-b.h+20+r*22;
        if(wx+10<bx+b.w-4){
          const lit=Math.sin(frame*0.013+r*1.8+cc*0.9+b.x*0.01)>0;
          ctx.fillStyle=lit?wc:'#050505';
          if(lit){ctx.shadowBlur=4;ctx.shadowColor=wc;}
          ctx.fillRect(wx,wy,10,10);ctx.shadowBlur=0;
        }
      }
      ctx.fillStyle='#555';ctx.fillRect(bx+b.w/2-3,GROUND-b.h-12,6,12);
    }

    function drawStreet() {
      const c=cfg();
      ctx.fillStyle=c.streetColor;ctx.fillRect(0,GROUND,W,H-GROUND);
      ctx.fillStyle=c.groundColor;ctx.fillRect(0,GROUND+4,W,H-GROUND-4);
      ctx.fillStyle=c.groundLine;ctx.fillRect(0,GROUND,W,5);
      ctx.fillStyle=c.laneColor;
      const lY=GROUND+(H-GROUND)/2-2;
      for(let i=0;i<W;i+=56){const dx=((i-scrollX*0.5)%56+56)%56;ctx.fillRect(dx,lY,36,3);}
    }

    function drawHUD() {
      const c=cfg();
      ctx.fillStyle='rgba(0,0,0,0.65)';ctx.fillRect(0,0,W,58);
      ctx.fillStyle=C.gold;ctx.font='12px "Press Start 2P"';ctx.textAlign='left';
      ctx.fillText('SCORE:'+sc,12,22);
      ctx.fillStyle='#e74c3c';ctx.fillText('♥'.repeat(Math.max(0,lv)),12,44);
      ctx.fillStyle=C.cream;ctx.textAlign='center';
      ctx.fillText('LVL '+(levelIdx+1)+' · '+c.name,W/2,22);
      if(boss&&!boss.dead){
        ctx.fillStyle='#e74c3c';ctx.font='8px "Press Start 2P"';
        ctx.fillText('⚠ STOMP THE BOSS!',W/2,44);
      } else {
        const label=c.collectible==='taco'?'🌮':'🍕';
        ctx.fillStyle=C.goldL;ctx.textAlign='right';
        ctx.fillText(label+' '+pc+'/'+c.collectTarget,W-12,22);
        for(let i=0;i<c.collectTarget;i++){
          ctx.fillStyle=i<pc?'#FF8C00':'#222';
          ctx.fillRect(W-12-c.collectTarget*11+i*11,30,9,14);
        }
      }
      ctx.fillStyle=C.goldL;ctx.textAlign='right';ctx.font='9px "Press Start 2P"';
      ctx.fillText('BEST:'+highSc,W-12,54);
    }

    function drawTitle() {
      const g=ctx.createLinearGradient(0,0,0,H);g.addColorStop(0,'#0a1606');g.addColorStop(1,'#1e3a14');
      ctx.fillStyle=g;ctx.fillRect(0,0,W,H);
      for(let i=0;i<70;i++){const sx=(i*131+frame*0.3)%W,sy=(i*71)%(H*0.55);ctx.fillStyle=Math.sin(frame*0.04+i)>0.4?C.gold:'rgba(212,160,23,0.2)';ctx.fillRect(sx,sy,Math.sin(frame*0.06+i)>0.6?3:1,Math.sin(frame*0.06+i)>0.6?3:1);}
      ctx.fillStyle='#0d1a08';ctx.fillRect(0,GROUND,W,H-GROUND);
      ctx.fillStyle='#1e3314';ctx.fillRect(0,GROUND,W,5);
      ctx.fillStyle='rgba(0,0,0,0.88)';ctx.fillRect(W/2-290,H/2-185,580,368);
      ctx.strokeStyle=C.gold;ctx.lineWidth=4;ctx.strokeRect(W/2-290,H/2-185,580,368);
      ctx.strokeStyle=C.goldL;ctx.lineWidth=1.5;ctx.strokeRect(W/2-284,H/2-179,568,356);
      ctx.fillStyle=C.gold;ctx.font='20px "Press Start 2P"';ctx.textAlign='center';
      ctx.fillText('DETROIT PIZZA QUEST',W/2,H/2-135);
      ctx.fillStyle=C.goldL;ctx.font='11px "Press Start 2P"';ctx.fillText('— Team Cabin Edition —',W/2,H/2-103);
      ctx.fillStyle=C.cream;ctx.font='9px "Press Start 2P"';
      ctx.fillText('3 LEVELS · 3 BOSSES · 1 CITY',W/2,H/2-72);
      ctx.fillText('JUMP ON ENEMIES TO DEFEAT THEM',W/2,H/2-50);
      ctx.fillText('AVOID TRAFFIC CONES',W/2,H/2-28);
      ctx.fillText('COLLECT 16 SLICES TO FIGHT THE BOSS',W/2,H/2-6);
      ctx.fillStyle='rgba(212,160,23,0.55)';ctx.font='7px "Press Start 2P"';
      ctx.fillText('LVL1: YPSILANTI  ·  LVL2: DOWNTOWN DETROIT  ·  LVL3: MEXICANTOWN',W/2,H/2+22);
      ctx.fillText('BOSS1: LANDLORD  ·  BOSS2: RAT KING  ·  BOSS3: RECORD EXEC',W/2,H/2+44);
      if(Math.floor(frame/25)%2===0){ctx.fillStyle=C.greenL;ctx.font='11px "Press Start 2P"';ctx.fillText('[ PRESS ENTER TO CHOOSE PLAYER ]',W/2,H/2+88);}
      if(highSc>0){ctx.fillStyle=C.goldL;ctx.font='9px "Press Start 2P"';ctx.fillText('HIGH SCORE: '+highSc,W/2,H/2+118);}
    }

    function drawCharSelect() {
      const g=ctx.createLinearGradient(0,0,0,H);g.addColorStop(0,'#0a1606');g.addColorStop(1,'#1e3a14');
      ctx.fillStyle=g;ctx.fillRect(0,0,W,H);
      for(let i=0;i<50;i++){const sx=(i*137)%W,sy=(i*71)%(H*0.6);ctx.fillStyle=Math.sin(frame*0.04+i)>0.4?C.gold:'rgba(212,160,23,0.15)';ctx.fillRect(sx,sy,2,2);}
      ctx.fillStyle=C.gold;ctx.font='20px "Press Start 2P"';ctx.textAlign='center';
      ctx.fillText('CHOOSE YOUR PLAYER',W/2,52);
      const chars=[{name:'STEVE',role:'Bass & Vocals',desc:'Bearded groove machine'},{name:'MIKE',role:'Drums',desc:'Everybody loves Mike'},{name:'KYLE',role:'Guitar & Vocals',desc:'Tall guitar genius'}];
      const cardW=210,cardH=380,gap=18,startX=(W-(cardW*3+gap*2))/2;
      const topOffsets=[10,10,10],spriteHeights=[40,40,40];
      chars.forEach((ch,i)=>{
        const cx=startX+i*(cardW+gap),cy=72,isSel=selectedChar===i;
        ctx.fillStyle=isSel?'rgba(212,160,23,0.2)':'rgba(0,0,0,0.5)';ctx.fillRect(cx,cy,cardW,cardH);
        ctx.strokeStyle=isSel?C.gold:'rgba(212,160,23,0.3)';ctx.lineWidth=isSel?4:2;ctx.strokeRect(cx,cy,cardW,cardH);
        if(isSel){ctx.shadowBlur=20;ctx.shadowColor=C.gold;ctx.strokeRect(cx,cy,cardW,cardH);ctx.shadowBlur=0;}
        const scale=4,charAreaTop=cy+16,charAreaH=cardH-100;
        const spriteCenterY=charAreaTop+charAreaH/2;
        const spriteY=spriteCenterY-(spriteHeights[i]/2)*scale+topOffsets[i]*scale;
        const spriteX=cx+cardW/2-(32*scale)/2;
        ctx.save();ctx.translate(spriteX,spriteY);ctx.scale(scale,scale);
        drawCharSprite(ctx,i,0,0,22,C);
        ctx.restore();
        ctx.fillStyle=isSel?C.gold:C.cream;ctx.font=`${isSel?'13':'12'}px "Press Start 2P"`;ctx.textAlign='center';
        ctx.fillText(ch.name,cx+cardW/2,cy+cardH-62);
        ctx.fillStyle=C.goldL;ctx.font='9px "Press Start 2P"';ctx.fillText(ch.role,cx+cardW/2,cy+cardH-40);
        ctx.fillStyle='rgba(245,240,220,0.5)';ctx.font='8px "Press Start 2P"';ctx.fillText(ch.desc,cx+cardW/2,cy+cardH-18);
        if(isSel&&Math.floor(frame/20)%2===0){ctx.fillStyle=C.gold;ctx.font='18px serif';ctx.textAlign='center';ctx.fillText('▼',cx+cardW/2,cy-8);}
      });
      ctx.fillStyle=C.cream;ctx.font='11px "Press Start 2P"';ctx.textAlign='center';
      ctx.fillText('← → TO SELECT     ENTER TO CONFIRM',W/2,H-18);
    }

    function drawLevelTransition() {
      const c=cfg();
      if(c.daytime){
        const sg=ctx.createLinearGradient(0,0,0,H);sg.addColorStop(0,'#4a90d9');sg.addColorStop(1,'#87ceeb');
        ctx.fillStyle=sg;ctx.fillRect(0,0,W,H);
      } else {
        const sg=ctx.createLinearGradient(0,0,0,H);sg.addColorStop(0,c.skyTop);sg.addColorStop(1,c.skyBot);
        ctx.fillStyle=sg;ctx.fillRect(0,0,W,H);
      }
      ctx.fillStyle='rgba(0,0,0,0.82)';ctx.fillRect(W/2-260,H/2-130,520,260);
      ctx.strokeStyle=C.gold;ctx.lineWidth=4;ctx.strokeRect(W/2-260,H/2-130,520,260);
      ctx.fillStyle=C.gold;ctx.font='14px "Press Start 2P"';ctx.textAlign='center';
      ctx.fillText('LEVEL '+(levelIdx+1),W/2,H/2-88);
      ctx.fillStyle=C.cream;ctx.font='22px "Press Start 2P"';
      ctx.fillText(c.name,W/2,H/2-52);
      ctx.fillStyle=C.goldL;ctx.font='10px "Press Start 2P"';
      ctx.fillText(c.subtitle,W/2,H/2-22);
      ctx.fillStyle='rgba(245,240,220,0.7)';ctx.font='8px "Press Start 2P"';
      ctx.fillText('COLLECT 16 '+(c.collectible==='taco'?'TACOS':'PIZZA SLICES')+' · THEN FIGHT THE BOSS',W/2,H/2+18);
      if(Math.floor(frame/20)%2===0){ctx.fillStyle=C.greenL;ctx.font='11px "Press Start 2P"';ctx.fillText('GET READY...',W/2,H/2+65);}
    }

    function drawDead() {
      ctx.fillStyle='rgba(0,0,0,0.78)';ctx.fillRect(0,0,W,H);
      ctx.fillStyle='#e74c3c';ctx.font='26px "Press Start 2P"';ctx.textAlign='center';
      ctx.fillText(lv>0?'GOT WRECKED!':'GAME OVER',W/2,H/2-55);
      ctx.fillStyle=C.cream;ctx.font='13px "Press Start 2P"';
      ctx.fillText('SCORE: '+sc,W/2,H/2-10);
      if(lv>0){ctx.fillStyle=C.gold;ctx.fillText('LIVES LEFT: '+lv,W/2,H/2+25);}
      if(Math.floor(frame/28)%2===0){ctx.fillStyle=C.goldL;ctx.fillText(lv>0?'PRESS ENTER':'PRESS ENTER TO RETRY',W/2,H/2+65);}
    }

    function drawWin() {
      const g=ctx.createLinearGradient(0,0,0,H);g.addColorStop(0,'#0a1606');g.addColorStop(1,'#1e3a14');
      ctx.fillStyle=g;ctx.fillRect(0,0,W,H);
      for(let i=0;i<30;i++){ctx.fillStyle=[C.gold,'#e74c3c',C.cream,C.greenL][i%4];ctx.fillRect((i*137+frame*2.5)%W,(i*89+frame*1.5)%(H-60),8,8);}
      ctx.fillStyle='rgba(0,0,0,0.82)';ctx.fillRect(W/2-260,H/2-140,520,280);
      ctx.strokeStyle=C.gold;ctx.lineWidth=4;ctx.strokeRect(W/2-260,H/2-140,520,280);
      ctx.fillStyle=C.gold;ctx.font='17px "Press Start 2P"';ctx.textAlign='center';
      ctx.fillText('🍕 DETROIT CONQUERED! 🍕',W/2,H/2-100);
      ctx.fillStyle=C.cream;ctx.font='11px "Press Start 2P"';
      ctx.fillText('THE BAND FEASTS TONIGHT',W/2,H/2-65);
      ctx.fillText('ALL 3 LEVELS COMPLETE',W/2,H/2-38);
      ctx.fillText('SCORE: '+sc,W/2,H/2-8);
      if(sc>=highSc&&sc>0){ctx.fillStyle=C.goldL;ctx.fillText('✨ NEW HIGH SCORE! ✨',W/2,H/2+28);}
      if(Math.floor(frame/28)%2===0){ctx.fillStyle=C.goldL;ctx.font='11px "Press Start 2P"';ctx.fillText('PRESS ENTER TO PLAY AGAIN',W/2,H/2+75);}
    }

    let raf;
    function loop() {
      frame++;

      if(gState==='transition'){
        transitionTimer--;
        drawLevelTransition();
        if(transitionTimer<=0){gState='playing';sync();}
        raf=requestAnimationFrame(loop);return;
      }

      if(gState==='playing'){
        if(keys['ArrowLeft']||keys['KeyA']){pl.vx=-4.5;pl.face=-1;}
        else if(keys['ArrowRight']||keys['KeyD']){pl.vx=4.5;pl.face=1;}
        else pl.vx*=0.6;
        if((keys['ArrowUp']||keys['Space']||keys['KeyW'])&&pl.og)jump();
        pl.vy+=GRAVITY;pl.x+=pl.vx;pl.y+=pl.vy;
        if(pl.y+PH>=GROUND){pl.y=GROUND-PH;pl.vy=0;pl.og=true;}else pl.og=false;
        if(pl.x<20)pl.x=20;if(pl.x>W-PW-20)pl.x=W-PW-20;
        if(pl.inv>0)pl.inv--;
        if(pl.x>W*0.42){const s=pl.x-W*0.42;scrollX+=s;pl.x=W*0.42;}

        const c=cfg();
        if(!boss||boss.dead){
          spT++;if(spT>=c.spawnRate){spawnEnemy();spT=0;}
          piT++;if(piT>=70){spawnCollectible();piT=0;}
        }

        if(pc>=c.collectTarget&&!boss) triggerBoss();

        if(boss&&!boss.dead){
          boss.x+=boss.vx;
          if(boss.inv>0)boss.inv--;
          const bOx=boss.x-scrollX;
          if(bOx<80)boss.vx=Math.abs(boss.vx);
          if(bOx>W-boss.w-60)boss.vx=-Math.abs(boss.vx);
          const pb=pl.y+PH;
          const bOverlapX=pl.x<bOx+boss.w&&pl.x+PW>bOx;
          const stomping=pl.vy>0&&pb>=boss.y&&pb<=boss.y+18&&bOverlapX;
          if(stomping&&boss.inv===0){
            bossHits++;boss.inv=60;pl.vy=-11;sc+=500;sync();
            addParts(bOx+boss.w/2,boss.y,C.gold,20);
            if(bossHits>=bossMaxHits){
              boss.dead=true;boss.deadTimer=90;sc+=2000;sync();
              addParts(bOx+boss.w/2,boss.y+boss.h/2,'#FFD700',40);
            }
          }
          if(pl.inv===0&&bOverlapX&&pl.y<boss.y+boss.h&&pl.y+PH>boss.y&&!stomping){
            pl.inv=120;addParts(pl.x+PW/2,pl.y+PH/2,'#e74c3c',12);lv--;
            if(lv<=0){if(sc>highSc)highSc=sc;music.pause();gState='dead';sync();}
          }
        }

        if(boss&&boss.dead){
          boss.deadTimer--;
          if(boss.deadTimer<=0){
            if(levelIdx>=LEVELS.length-1){
              if(sc>highSc)highSc=sc;music.pause();gState='win';sync();
            } else {
              levelIdx++;pc=0;reset();transitionTimer=200;gState='transition';sync();
            }
          }
        }

        obs=obs.filter(o=>{
          o.x+=o.vx;
          const ox=o.x-scrollX;
          if(ox<-100)return false;
          if(o.dead){o.deadTimer--;return o.deadTimer>0;}
          const pb=pl.y+PH,ovX=pl.x<ox+o.w&&pl.x+PW>ox;
          const stomp=pl.vy>0&&pb>=o.y&&pb<=o.y+12&&ovX;
          if(stomp&&o.type!=='cone'){o.dead=true;o.deadTimer=30;pl.vy=-9;sc+=200;sync();addParts(ox+o.w/2,o.y,C.gold,10);return true;}
          if(pl.inv===0&&pl.x<ox+o.w&&pl.x+PW>ox&&pl.y<o.y+o.h&&pl.y+PH>o.y){
            pl.inv=100;addParts(pl.x+PW/2,pl.y+PH/2,'#e74c3c',12);lv--;
            if(lv<=0){if(sc>highSc)highSc=sc;music.pause();gState='dead';sync();}
          }
          return true;
        });

        pizzas=pizzas.filter(pz=>{
          if(pz.collected)return false;
          const ox=pz.x-scrollX;
          if(ox<-60)return false;
          const bob=Math.sin(frame*0.08+pz.bob)*6;
          if(pl.x<ox+28&&pl.x+PW>ox&&pl.y<pz.y+bob+28&&pl.y+PH>pz.y+bob){
            pz.collected=true;sc+=100;pc++;addParts(ox+14,pz.y+14,C.gold,16);sync();return false;
          }
          return true;
        });

        parts=parts.filter(p=>{p.x+=p.vx;p.y+=p.vy;p.vy+=0.2;p.life--;return p.life>0;});
        if(!blds.length||blds[blds.length-1].x-scrollX<W+250)
          blds.push(mkBld((blds[blds.length-1]?.x||200)+100+Math.random()*130));
        blds=blds.filter(b=>b.x-scrollX>-300);
      }

      if(gState==='title'){drawTitle();raf=requestAnimationFrame(loop);return;}
      if(gState==='charselect'){drawCharSelect();raf=requestAnimationFrame(loop);return;}
      if(gState==='win'){drawWin();raf=requestAnimationFrame(loop);return;}

      drawBackground();
      blds.forEach(b=>drawBuilding(b));
      drawStreet();

      obs.forEach(o=>drawEnemySprite(ctx,o,scrollX,C));
      pizzas.forEach(pz=>{
        const ox=pz.x-scrollX;
        const bob=Math.sin(frame*0.08+pz.bob)*6;
        const py=pz.y+bob;
        if(pz.type==='taco')drawTaco(ctx,ox,py,C);
        else drawPizzaSlice(ctx,ox,py,C);
      });

      drawBossSprite(ctx,boss,scrollX,bossHits,bossMaxHits,C);

      parts.forEach(p=>{ctx.globalAlpha=p.life/p.ml;ctx.fillStyle=p.col;ctx.fillRect(p.x-p.sz/2,p.y-p.sz/2,p.sz,p.sz);});
      ctx.globalAlpha=1;

      if(!(pl.inv>0&&Math.floor(pl.inv/5)%2===0)){
        ctx.save();
        if(pl.face===-1){ctx.translate(pl.x+PW,0);ctx.scale(-1,1);ctx.translate(-pl.x,0);}
        drawCharSprite(ctx,charIdx,pl.x,pl.y,PW,C);
        ctx.restore();
      }

      drawHUD();
      if(gState==='dead')drawDead();
      raf=requestAnimationFrame(loop);
    }

    const onDown=e=>{
      keys[e.code]=true;
      if(['Space','ArrowLeft','ArrowRight','ArrowUp'].includes(e.code))e.preventDefault();
      if(e.code==='Space'&&gState==='playing'){jump();return;}
      if(gState==='charselect'){
        if(e.code==='ArrowLeft'){selectedChar=(selectedChar+2)%3;sync();return;}
        if(e.code==='ArrowRight'){selectedChar=(selectedChar+1)%3;sync();return;}
      }
      if(e.code==='Enter'){
        if(gState==='title'){gState='charselect';sync();}
        else if(gState==='charselect'){charIdx=selectedChar;start();}
        else if(gState==='dead'){if(lv>0)respawn();else{gState='charselect';sync();}}
        else if(gState==='win'){gState='charselect';sync();}
      }
    };
    const onUp=e=>{keys[e.code]=false;};
    window.addEventListener('keydown',onDown);
    window.addEventListener('keyup',onUp);
    loop();

    gameRef.current={
      jump,start,
      tryAgain:()=>{if(lv>0)respawn();else{gState='charselect';sync();}},
      toCharSelect:()=>{gState='charselect';sync();},
      setChar:(i)=>{selectedChar=i;sync();},
      confirmChar:()=>{charIdx=selectedChar;start();},
      keys,
      getState:()=>gState,
      getSelectedChar:()=>selectedChar,
    };

    return()=>{
      cancelAnimationFrame(raf);
      window.removeEventListener('keydown',onDown);
      window.removeEventListener('keyup',onUp);
      music.pause();music.currentTime=0;
    };
  },[]);

  const enterFullscreen=()=>{if(window.innerWidth<=768)setIsFullscreen(true);};
  const exitFullscreen=()=>setIsFullscreen(false);

  const mb=(key,down)=>{
    const g=gameRef.current;if(!g)return;
    const st=g.getState?g.getState():uiState.state;
    if(key==='jump'){if(down&&st==='playing')g.jump();}
    else if(key==='start'){
      if(st==='title')g.toCharSelect?.();
      else if(st==='charselect')g.confirmChar?.();
      else if(st==='dead')g.tryAgain?.();
      else if(st==='win')g.toCharSelect?.();
    } else if(key==='ArrowLeft'&&down){
      if(st==='charselect')g.setChar?.(((g.getSelectedChar?.()??0)+2)%3);
      else g.keys['ArrowLeft']=true;
    } else if(key==='ArrowRight'&&down){
      if(st==='charselect')g.setChar?.(((g.getSelectedChar?.()??0)+1)%3);
      else g.keys['ArrowRight']=true;
    } else{g.keys[key]=down;}
  };

  const controlButtons=(
    <>
      <style>{`
        .tc-btn{-webkit-user-select:none;-moz-user-select:none;user-select:none;-webkit-touch-callout:none;-webkit-tap-highlight-color:transparent;touch-action:none;}
        .tc-btn:active{opacity:0.85;}
      `}</style>
      <div style={{display:'flex',alignItems:'center',justifyContent:'center',gap:'1rem',flexWrap:'wrap',padding:'0.5rem'}}>
        <div style={{display:'flex',gap:'0.6rem'}}>
          {[['◀','ArrowLeft',true],['▶','ArrowRight',true]].map(([lbl,key,hold])=>(
            <button key={key} className="tc-btn"
              style={{fontFamily:'"Press Start 2P"',fontSize:'1rem',background:C.gold,color:C.green,border:'none',width:76,height:66,cursor:'pointer',boxShadow:'3px 3px 0 #000'}}
              onTouchStart={e=>{e.preventDefault();mb(key,true);}}
              onTouchEnd={e=>{e.preventDefault();hold&&mb(key,false);}}
              onTouchCancel={e=>{e.preventDefault();hold&&mb(key,false);}}
              onContextMenu={e=>e.preventDefault()}
              onMouseDown={()=>mb(key,true)}
              onMouseUp={()=>hold&&mb(key,false)}
              onMouseLeave={()=>hold&&mb(key,false)}
            >{lbl}</button>
          ))}
        </div>
        <button className="tc-btn"
          style={{fontFamily:'"Press Start 2P"',fontSize:'0.7rem',background:'#e74c3c',color:'#fff',border:'none',width:86,height:66,cursor:'pointer',boxShadow:'3px 3px 0 #000'}}
          onTouchStart={e=>{e.preventDefault();mb('jump',true);}}
          onTouchEnd={e=>e.preventDefault()}
          onTouchCancel={e=>e.preventDefault()}
          onContextMenu={e=>e.preventDefault()}
          onMouseDown={()=>mb('jump',true)}
        >▲ JUMP</button>
        <button className="tc-btn"
          style={{fontFamily:'"Press Start 2P"',fontSize:'0.7rem',background:C.greenL,color:C.cream,border:'none',width:86,height:66,cursor:'pointer',boxShadow:'3px 3px 0 #000'}}
          onTouchStart={e=>{e.preventDefault();mb('start',true);}}
          onTouchEnd={e=>e.preventDefault()}
          onTouchCancel={e=>e.preventDefault()}
          onContextMenu={e=>e.preventDefault()}
          onMouseDown={()=>mb('start',true)}
        >START</button>
        {isFullscreen&&(
          <button className="tc-btn"
            style={{fontFamily:'"Press Start 2P"',fontSize:'0.55rem',background:'#333',color:C.cream,border:`2px solid ${C.goldD}`,width:66,height:66,cursor:'pointer',boxShadow:'3px 3px 0 #000'}}
            onTouchStart={e=>{e.preventDefault();exitFullscreen();}}
            onMouseDown={exitFullscreen}
          >✕ EXIT</button>
        )}
      </div>
    </>
  );

  if(isFullscreen){
    return(
      <div style={{position:'fixed',inset:0,zIndex:9999,background:'#000',display:'flex',flexDirection:'column'}}>
        <div style={{flex:1,display:'flex',alignItems:'stretch',overflow:'hidden'}}>
          <canvas ref={canvasRef} width={780} height={520} style={{width:'100%',height:'100%',display:'block',imageRendering:'pixelated',objectFit:'contain'}}/>
        </div>
        <div style={{background:'#0a1506',borderTop:`3px solid ${C.gold}`,paddingBottom:'env(safe-area-inset-bottom,0px)'}}>
          {controlButtons}
        </div>
      </div>
    );
  }

  return(
    <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:'1rem'}}>
      <div onClick={enterFullscreen} style={{border:`5px solid ${C.gold}`,boxShadow:`0 0 0 3px ${C.green},0 0 0 6px ${C.gold},8px 8px 0 6px #000`,background:'#000',width:'100%',maxWidth:780,cursor:'pointer',position:'relative'}}>
        <canvas ref={canvasRef} width={780} height={520} style={{width:'100%',display:'block',imageRendering:'pixelated'}}/>
        <div style={{position:'absolute',bottom:8,right:10,fontFamily:'"Press Start 2P"',fontSize:'0.4rem',color:'rgba(212,160,23,0.5)',pointerEvents:'none'}}>
          📱 TAP TO FULLSCREEN
        </div>
      </div>
      {controlButtons}
      <div style={{fontFamily:'"Press Start 2P"',fontSize:'0.4rem',color:'rgba(245,240,220,0.3)',textAlign:'center'}}>
        ← → MOVE &nbsp;|&nbsp; SPACE / ↑ JUMP &nbsp;|&nbsp; ENTER START
      </div>
    </div>
  );
}