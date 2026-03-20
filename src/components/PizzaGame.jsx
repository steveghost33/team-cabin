import { useEffect, useRef, useState } from 'react';
import { C } from '../data/constants';
import { LEVELS } from './game/levels.jsx';
import { drawCharSprite, drawPizzaSlice, drawTaco, drawEnemySprite, drawBossSprite, drawHealthItem } from './game/sprites.jsx';

const W = 780;
const H = 520;
const GROUND = H - 80;
const PW = 24;
const PH = 32;
const GRAVITY = 0.68;
const JUMP_POWER = -14;
const MOVE_SPEED = 4.2;
const SONG_FILE = '/kylesong.mp3';
const SONG_VOLUME = 0.5;
const MAX_HP = 100;
const HP_HEAL = 30;
const BOSS_MAX_HP = 240;
const MAX_LIVES = 3;
const GLD = '#E2A820';
const GRN = '#1C3D12';
const GRN2 = '#2D4A1E';

export default function PizzaGame() {
  const canvasRef = useRef(null);
  const gameRef  = useRef({});
  const [uiState, setUiState] = useState({ state:'title', score:0, hp:MAX_HP, pizza:0, level:1, lives:MAX_LIVES });
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(()=>{
    const check=()=>setIsMobile('ontouchstart' in window||window.innerWidth<=768);
    check(); window.addEventListener('resize',check);
    return()=>window.removeEventListener('resize',check);
  },[]);

  useEffect(()=>{
    const canvas=canvasRef.current; if(!canvas) return;
    const ctx=canvas.getContext('2d');
    const music=new Audio(SONG_FILE); music.loop=true; music.volume=SONG_VOLUME;

    let gState='title';
    let sc=0, pc=0, levelIdx=0, lives=MAX_LIVES;
    let frame=0, scrollX=0, spT=0, piT=0, hpT=0, highSc=0;
    let obs=[], pizzas=[], healthItems=[], parts=[], blds=[];
    let keys={}, charIdx=0, selectedChar=0;
    let boss=null, bossHp=BOSS_MAX_HP;
    let transitionTimer=0;
    let jumpPressed=false;
    let deathTimer=0;

    const pl={x:80,y:GROUND-PH,vx:0,vy:0,onGround:true,face:1,inv:0,hp:MAX_HP,dying:false,dyingTimer:0};
    const sync=()=>setUiState({state:gState,score:sc,hp:pl.hp,pizza:pc,level:levelIdx+1,lives});
    const cfg=()=>LEVELS[levelIdx];

    function resetLevel(){
      pl.x=80;pl.y=GROUND-PH;pl.vx=0;pl.vy=0;pl.onGround=true;
      pl.inv=120;pl.dying=false;pl.dyingTimer=0;pl.face=1;
      obs=[];pizzas=[];healthItems=[];parts=[];blds=[];
      boss=null;bossHp=BOSS_MAX_HP;
      scrollX=0;spT=0;piT=0;hpT=0;
      for(let i=0;i<28;i++) blds.push(mkBld(i*160+200));
    }
    function startGame(){sc=0;pc=0;levelIdx=0;lives=MAX_LIVES;pl.hp=MAX_HP;charIdx=selectedChar;resetLevel();gState='playing';music.currentTime=0;music.play().catch(()=>{});sync();}
    function respawn(){
      pl.hp=MAX_HP;pc=0;charIdx=selectedChar;
      resetLevel();gState='playing';music.play().catch(()=>{});sync();
    }
    function jump(){if(pl.onGround&&!pl.dying){pl.vy=JUMP_POWER;pl.onGround=false;}}

    function playerDie(){
      if(pl.dying||pl.inv>0) return;
      pl.dying=true;pl.dyingTimer=80;pl.vy=JUMP_POWER*0.8;
      music.pause();
    }

    let eid=0;
    function mkBld(x){
      const c=cfg();
      const awning=c.awningCols[Math.floor(Math.random()*c.awningCols.length)];
      let specialType=null;
      if(levelIdx===0){const r=Math.random();if(r<0.08)specialType='grove';else if(r<0.16)specialType='hyperion';else if(r<0.28)specialType='ypsi';}
      else if(levelIdx===1){const r=Math.random();if(r<0.08)specialType='standrews';else if(r<0.16)specialType='checker';else if(r<0.24)specialType='rencen';}
      else if(levelIdx===2){if(Math.random()<0.25)specialType='mexican';}
      return{x,w:60+Math.random()*90,h:80+Math.random()*170,
        color:c.buildingCols[Math.floor(Math.random()*c.buildingCols.length)],
        wc:Math.floor(Math.random()*4)+2,wr:Math.floor(Math.random()*4)+2,
        specialType,awningCol:awning,
        lit:Math.random()>0.5};
    }

    // Enemies ALWAYS spawn from the RIGHT (in front of character moving right)
    function spawnEnemy(){
      if(boss&&!boss.dead) return;
      const c=cfg();
      const r=Math.random();
      // Level 1: mostly cones and metermaids; Level 2: adds bikers; Level 3: all types faster
      let type;
      if(levelIdx===0) type=r<0.25?'cone':r<0.6?'metermaid':'rat';
      else if(levelIdx===1) type=r<0.15?'cone':r<0.4?'metermaid':r<0.65?'muscledude':'rat';
      else type=r<0.1?'cone':r<0.3?'metermaid':r<0.55?'muscledude':r<0.75?'biker':'rat';

      const isRat=type==='rat', isCone=type==='cone';
      const geos={cone:{w:18,h:26},metermaid:{w:24,h:32},muscledude:{w:24,h:32},biker:{w:24,h:32},rat:{w:12,h:10}};
      const {w,h}=geos[type];

      // ALWAYS spawn from the right side (ahead of player)
      const spawnX = scrollX + W + 40 + Math.random()*120;

      obs.push({id:eid++,type,
        x: spawnX,
        y: GROUND-h,
        w, h,
        vx: isCone ? 0 : -(c.enemySpeed + Math.random()*0.8),
        at:0, dead:false, deadTimer:0,
        hp: type==='muscledude'||type==='biker' ? 3 : isRat ? 1 : 2,
        hitFlash:0,
      });
    }

    function spawnCollectible(){
      if(boss&&!boss.dead) return;
      // Some float in air (jump required), some on ground
      const airborne = Math.random()<0.4;
      const yPos = airborne ? GROUND-PH-50-Math.random()*50 : GROUND-PH-4;
      pizzas.push({x:scrollX+W+60+Math.random()*80, y:yPos,
        bob:Math.random()*Math.PI*2, collected:false, type:cfg().collectible});
    }

    function spawnHealthItem(){
      if(boss&&!boss.dead) return;
      healthItems.push({x:scrollX+W+80+Math.random()*60, y:GROUND-PH-8,
        bob:Math.random()*Math.PI*2, collected:false});
    }

    function triggerBoss(){
      obs=[];pizzas=[];healthItems=[];bossHp=BOSS_MAX_HP;
      const types=['landlord','ratking','recordexec'];
      boss={type:types[levelIdx],x:scrollX+W+80,y:GROUND-80,w:60,h:80,
        vx:-(2.0+levelIdx*0.5), at:0, inv:0, hitFlash:0, dead:false, deadTimer:0};
    }

    function addParts(x,y,col,n){
      for(let i=0;i<n;i++) parts.push({x,y,vx:(Math.random()-0.5)*7,vy:(Math.random()-0.5)*7-2,life:50+Math.random()*20,ml:70,col,sz:2+Math.random()*4});
    }

    // ── LEVEL DRAWING ─────────────────────────────────────────────────

    function drawBackground(){
      const c=cfg();

      if(c.daytime){
        // LEVEL 1 — bright blue sky with gradient
        const sg=ctx.createLinearGradient(0,0,0,GROUND);
        sg.addColorStop(0,'#3a7ad9'); sg.addColorStop(0.6,'#6ab0f5'); sg.addColorStop(1,'#a8d8f8');
        ctx.fillStyle=sg; ctx.fillRect(0,0,W,GROUND);
        // sun
        ctx.fillStyle='#FFD700';ctx.beginPath();ctx.arc(W-80,60,28,0,Math.PI*2);ctx.fill();
        ctx.fillStyle='rgba(255,215,0,0.2)';ctx.beginPath();ctx.arc(W-80,60,42,0,Math.PI*2);ctx.fill();
        // clouds — white fluffy
        ctx.fillStyle='rgba(255,255,255,0.95)';
        [[80,55,36],[240,40,28],[420,65,32],[600,45,26],[720,70,22]].forEach(([cx,cy,r])=>{
          const cloudX=((cx-scrollX*0.04+W*4)%(W+200))-100;
          ctx.beginPath();ctx.arc(cloudX,cy,r,0,Math.PI*2);ctx.fill();
          ctx.beginPath();ctx.arc(cloudX+r*0.7,cy+4,r*0.7,0,Math.PI*2);ctx.fill();
          ctx.beginPath();ctx.arc(cloudX-r*0.5,cy+6,r*0.55,0,Math.PI*2);ctx.fill();
        });
        // far buildings silhouette — warm orange brick
        ctx.fillStyle='rgba(160,80,50,0.3)';
        for(let i=0;i<8;i++){const bx=((i*140-scrollX*0.12)%(W+200)+W+200)%(W+200)-100;ctx.fillRect(bx,GROUND-60-(i%3)*30,55+(i%3)*20,60+(i%3)*30);}

      } else if(levelIdx===1){
        // LEVEL 2 — dark night sky, city glow at horizon
        const sg=ctx.createLinearGradient(0,0,0,GROUND);
        sg.addColorStop(0,'#04080f'); sg.addColorStop(0.7,'#080f1a'); sg.addColorStop(1,'#0a1520');
        ctx.fillStyle=sg; ctx.fillRect(0,0,W,GROUND);
        // stars
        for(let i=0;i<60;i++){
          const sx=((i*197+scrollX*0.06)%(W+40)+W+40)%(W+40), sy=(i*67)%(GROUND*0.55);
          const bright=Math.sin(frame*0.04+i*0.7)>0.3;
          ctx.fillStyle=bright?'rgba(200,220,255,0.9)':'rgba(150,180,220,0.3)';
          ctx.fillRect(sx,sy,bright?2:1,bright?2:1);
        }
        // moon
        ctx.fillStyle='#d0e8ff';ctx.beginPath();ctx.arc(W-70,50,22,0,Math.PI*2);ctx.fill();
        ctx.fillStyle='#0a1520';ctx.beginPath();ctx.arc(W-60,44,19,0,Math.PI*2);ctx.fill();
        // city orange glow at horizon
        const glow=ctx.createLinearGradient(0,GROUND-60,0,GROUND);
        glow.addColorStop(0,'rgba(226,100,0,0)');glow.addColorStop(1,'rgba(226,100,0,0.15)');
        ctx.fillStyle=glow;ctx.fillRect(0,GROUND-60,W,60);
        // dark building silhouettes far bg
        ctx.fillStyle='rgba(5,12,25,0.8)';
        for(let i=0;i<10;i++){const bx=((i*120-scrollX*0.1)%(W+200)+W+200)%(W+200)-100;ctx.fillRect(bx,GROUND-80-(i%4)*40,45+(i%3)*25,80+(i%4)*40);}
        // neon window glows on silhouettes
        ctx.fillStyle='rgba(226,168,32,0.15)';
        for(let i=0;i<10;i++){const bx=((i*120-scrollX*0.1)%(W+200)+W+200)%(W+200)-100;for(let r=0;r<3;r++)for(let cc=0;cc<3;cc++){if(Math.sin(frame*0.01+r+cc+i*0.3)>0){ctx.fillRect(bx+6+cc*12,GROUND-65-(i%4)*40+r*16,6,8);}}}

      } else {
        // LEVEL 3 — warm dusk/sunset orange
        const sg=ctx.createLinearGradient(0,0,0,GROUND);
        sg.addColorStop(0,'#1a0800'); sg.addColorStop(0.4,'#6b2a00'); sg.addColorStop(0.8,'#c05010'); sg.addColorStop(1,'#e08030');
        ctx.fillStyle=sg; ctx.fillRect(0,0,W,GROUND);
        // large warm moon/sun near horizon
        ctx.fillStyle='#ffd080';ctx.beginPath();ctx.arc(120,GROUND-80,35,0,Math.PI*2);ctx.fill();
        ctx.fillStyle='rgba(255,200,80,0.2)';ctx.beginPath();ctx.arc(120,GROUND-80,55,0,Math.PI*2);ctx.fill();
        // silhouette far buildings — dark
        ctx.fillStyle='rgba(20,8,0,0.85)';
        for(let i=0;i<9;i++){const bx=((i*130-scrollX*0.11)%(W+220)+W+220)%(W+220)-110;ctx.fillRect(bx,GROUND-70-(i%3)*35,50+(i%4)*20,70+(i%3)*35);}
        // papel picado silhouettes far
        ctx.fillStyle='rgba(231,76,60,0.2)';
        for(let i=0;i<14;i++){const bx=((i*52-scrollX*0.08)%(W+100)+W+100)%(W+100)-50;ctx.fillRect(bx,20+Math.sin(i*0.8)*6,18,12);}
      }
    }

    function drawGround(){
      const c=cfg();
      // grass/ground top strip
      ctx.fillStyle=c.groundTop;
      ctx.fillRect(0,GROUND,W,c.groundTopH);
      // main ground
      const gh=H-GROUND-c.groundTopH;
      const gg=ctx.createLinearGradient(0,GROUND+c.groundTopH,0,H);
      gg.addColorStop(0,c.groundColor);gg.addColorStop(1,shadeColor(c.groundColor,-30));
      ctx.fillStyle=gg;ctx.fillRect(0,GROUND+c.groundTopH,W,gh);

      if(levelIdx===0){
        // grass texture — small green tufts
        ctx.fillStyle='#3a7a2a';
        for(let i=0;i<W;i+=12){const gx=((i-scrollX*0.5)%W+W)%W;ctx.fillRect(gx,GROUND,2,6);ctx.fillRect(gx+4,GROUND,2,4);ctx.fillRect(gx+8,GROUND,2,5);}
        // sidewalk cracks
        ctx.strokeStyle='rgba(0,0,0,0.15)';ctx.lineWidth=1;
        for(let i=0;i<W;i+=60){const lx=((i-scrollX*0.5)%W+W)%W;ctx.beginPath();ctx.moveTo(lx,GROUND+c.groundTopH);ctx.lineTo(lx,H);ctx.stroke();}
      } else if(levelIdx===1){
        // metal grates
        ctx.strokeStyle='rgba(100,100,100,0.3)';ctx.lineWidth=1;
        for(let i=0;i<W;i+=20){const lx=((i-scrollX*0.5)%W+W)%W;ctx.beginPath();ctx.moveTo(lx,GROUND);ctx.lineTo(lx,GROUND+c.groundTopH);ctx.stroke();}
        // lane dashes
        ctx.fillStyle=c.laneColor;
        for(let i=0;i<W;i+=52){const dx=((i-scrollX*0.5)%52+52)%52;ctx.fillRect(dx,GROUND+(H-GROUND)/2,36,3);}
      } else {
        // decorative tiles
        ctx.fillStyle='rgba(255,255,255,0.07)';
        for(let r=0;r<3;r++)for(let i=0;i<W;i+=28){const tx=((i-scrollX*0.5)%(W+28)+W+28)%(W+28)-28;ctx.fillRect(tx,GROUND+c.groundTopH+r*12,24,10);}
        ctx.fillStyle=c.laneColor;
        for(let i=0;i<W;i+=52){const dx=((i-scrollX*0.5)%52+52)%52;ctx.fillRect(dx,GROUND+(H-GROUND)/2,36,3);}
      }

      // level 3 papel picado banners strung across
      if(levelIdx===2){
        const flagCols=['#e74c3c','#f39c12','#2ecc71','#3498db','#9b59b6','#fff','#e74c3c','#f39c12'];
        ctx.strokeStyle='rgba(180,120,80,0.6)';ctx.lineWidth=1;
        ctx.beginPath();ctx.moveTo(0,GROUND-110+Math.sin(frame*0.01)*3);ctx.lineTo(W,GROUND-100+Math.sin(frame*0.01+1)*3);ctx.stroke();
        for(let i=0;i<16;i++){
          const fx=((i*50-scrollX*0.5)%(W+80)+W+80)%(W+80)-40;
          const fy=GROUND-108+Math.sin((i+frame*0.01)*0.7)*5;
          ctx.fillStyle=flagCols[i%flagCols.length];
          ctx.beginPath();ctx.moveTo(fx,fy);ctx.lineTo(fx-8,fy+14);ctx.lineTo(fx+8,fy+14);ctx.closePath();ctx.fill();
        }
      }
    }

    function shadeColor(col,amt){
      const n=parseInt(col.slice(1),16);
      const r=Math.min(255,Math.max(0,((n>>16)&0xff)+amt));
      const g=Math.min(255,Math.max(0,((n>>8)&0xff)+amt));
      const b=Math.min(255,Math.max(0,(n&0xff)+amt));
      return'#'+(r<<16|g<<8|b).toString(16).padStart(6,'0');
    }

    function drawBuilding(b){
      const c=cfg(); const bx=b.x-scrollX;
      if(bx>W+200||bx+b.w<-200) return;

      if(b.specialType==='grove'){
        ctx.fillStyle='#2d2a28';ctx.fillRect(bx,GROUND-135,92,135);
        ctx.strokeStyle='#1a1714';ctx.lineWidth=2;ctx.strokeRect(bx,GROUND-135,92,135);
        ctx.fillStyle='rgba(150,200,255,0.25)';ctx.fillRect(bx+8,GROUND-108,76,58);
        ctx.strokeStyle='#444';ctx.lineWidth=1;ctx.strokeRect(bx+8,GROUND-108,76,58);
        ctx.beginPath();ctx.moveTo(bx+46,GROUND-108);ctx.lineTo(bx+46,GROUND-50);ctx.stroke();
        ctx.beginPath();ctx.moveTo(bx+8,GROUND-79);ctx.lineTo(bx+84,GROUND-79);ctx.stroke();
        ctx.fillStyle='#8B1a1a';ctx.fillRect(bx+4,GROUND-133,84,22);
        ctx.fillStyle='#fff';ctx.font='bold 7px "Press Start 2P"';ctx.textAlign='center';
        ctx.fillText('GROVE',bx+46,GROUND-124);ctx.font='5px "Press Start 2P"';ctx.fillText('STUDIOS',bx+46,GROUND-116);
        ctx.fillStyle='#ffe066';for(let i=0;i<6;i++){if(Math.sin(frame*0.04+i)>0){ctx.shadowBlur=4;ctx.shadowColor='#ffe066';}ctx.beginPath();ctx.arc(bx+8+i*14,GROUND-136+Math.sin(frame*0.04+i)*2,2,0,Math.PI*2);ctx.fill();ctx.shadowBlur=0;}
        return;
      }
      if(b.specialType==='hyperion'){
        ctx.fillStyle='#4a3520';ctx.fillRect(bx,GROUND-115,82,115);
        ctx.strokeStyle='#2a1a10';ctx.lineWidth=2;ctx.strokeRect(bx,GROUND-115,82,115);
        ctx.fillStyle='rgba(255,200,100,0.35)';ctx.fillRect(bx+6,GROUND-88,70,52);
        ctx.strokeStyle='#5a4030';ctx.lineWidth=1;ctx.strokeRect(bx+6,GROUND-88,70,52);
        ctx.beginPath();ctx.moveTo(bx+41,GROUND-88);ctx.lineTo(bx+41,GROUND-36);ctx.stroke();
        ctx.beginPath();ctx.moveTo(bx+6,GROUND-62);ctx.lineTo(bx+76,GROUND-62);ctx.stroke();
        ctx.fillStyle='#1a5a4a';ctx.fillRect(bx+4,GROUND-114,74,24);
        ctx.fillStyle='#fff';ctx.font='bold 7px "Press Start 2P"';ctx.textAlign='center';
        ctx.fillText('HYPERION',bx+41,GROUND-105);ctx.font='5px "Press Start 2P"';ctx.fillText('COFFEE',bx+41,GROUND-97);
        return;
      }
      if(b.specialType==='ypsi'){
        // red brick storefront with awning
        ctx.fillStyle='#8B3a2a';ctx.fillRect(bx,GROUND-b.h,b.w,b.h);
        // brick texture
        ctx.fillStyle='rgba(0,0,0,0.1)';
        for(let row=0;row<Math.floor(b.h/8);row++)for(let cc=0;cc<Math.floor(b.w/16);cc++){if((row+cc)%2===0)ctx.fillRect(bx+cc*16+(row%2)*8,GROUND-b.h+row*8,14,6);}
        ctx.fillStyle=b.awningCol;ctx.fillRect(bx,GROUND-b.h*0.35,b.w,9);
        ctx.fillStyle='rgba(200,220,255,0.2)';ctx.fillRect(bx+4,GROUND-72,b.w-8,44);
        ctx.strokeStyle='rgba(0,0,0,0.3)';ctx.lineWidth=1;ctx.strokeRect(bx+4,GROUND-72,b.w-8,44);
        // string lights
        ctx.fillStyle='#ffe066';
        for(let i=0;i<6;i++){const lx=bx+4+i*(b.w-8)/5,ly=GROUND-b.h*0.35-3+Math.sin(i*1.3)*2;if(Math.sin(frame*0.04+i)>0){ctx.shadowBlur=4;ctx.shadowColor='#ffe066';}ctx.beginPath();ctx.arc(lx,ly,2,0,Math.PI*2);ctx.fill();ctx.shadowBlur=0;}
        return;
      }
      if(b.specialType==='standrews'){
        ctx.fillStyle='#2a1a10';ctx.fillRect(bx,GROUND-168,102,168);
        // brick
        ctx.fillStyle='rgba(0,0,0,0.12)';for(let r=0;r<18;r++)for(let cc=0;cc<6;cc++){if((r+cc)%2===0)ctx.fillRect(bx+cc*16+(r%2)*8,GROUND-168+r*8,14,6);}
        ctx.fillStyle='#0d0d0d';ctx.fillRect(bx+2,GROUND-120,98,26);
        ctx.fillStyle='#ffe066';for(let i=0;i<10;i++){if(Math.floor(frame/8+i)%2===0){ctx.shadowBlur=4;ctx.shadowColor='#ffe066';ctx.beginPath();ctx.arc(bx+6+i*9,GROUND-109,3,0,Math.PI*2);ctx.fill();ctx.shadowBlur=0;}}
        ctx.fillStyle='#fff';ctx.font='bold 7px "Press Start 2P"';ctx.textAlign='center';ctx.fillText('ST. ANDREWS',bx+51,GROUND-128);ctx.font='5px "Press Start 2P"';ctx.fillText('HALL',bx+51,GROUND-120);
        for(let i=0;i<4;i++){ctx.fillStyle=Math.sin(frame*0.02+i)>0?'#ffe066':'#0d0d0d';ctx.fillRect(bx+8+i*22,GROUND-162,15,22);}
        return;
      }
      if(b.specialType==='checker'){
        ctx.fillStyle='#111';ctx.fillRect(bx,GROUND-108,90,108);
        const sq=8;for(let r=0;r<3;r++)for(let cc=0;cc<11;cc++){ctx.fillStyle=(r+cc)%2===0?'#ddd':'#111';ctx.fillRect(bx+cc*sq,GROUND-108+r*sq,sq,sq);}
        ctx.fillStyle='#aa0000';ctx.shadowBlur=8;ctx.shadowColor='#ff0000';ctx.fillRect(bx+4,GROUND-78,82,20);ctx.shadowBlur=0;
        ctx.fillStyle='#fff';ctx.font='bold 6px "Press Start 2P"';ctx.textAlign='center';ctx.fillText('CHECKER BAR',bx+45,GROUND-65);
        // neon glow windows
        for(let r=0;r<2;r++)for(let cc=0;cc<5;cc++){ctx.fillStyle=Math.sin(frame*0.03+r+cc)>0?'rgba(226,168,32,0.7)':'rgba(0,100,200,0.5)';ctx.fillRect(bx+6+cc*16,GROUND-58+r*18,10,10);}
        return;
      }
      if(b.specialType==='rencen'){
        // tall glass towers
        ctx.fillStyle='#0d1a2a';ctx.fillRect(bx+22,GROUND-225,32,225);
        // glass reflections
        ctx.fillStyle='rgba(50,100,150,0.2)';ctx.fillRect(bx+24,GROUND-225,16,225);
        for(let i=0;i<4;i++){const offX=[0,54,0,54][i];ctx.fillStyle='#091420';ctx.fillRect(bx+offX,GROUND-145,22,145);}
        // lit windows
        for(let r=0;r<10;r++)for(let cc=0;cc<2;cc++){
          const lit=Math.sin(frame*0.015+r+cc)>0;
          ctx.fillStyle=lit?GLD:'rgba(0,20,40,0.8)';
          if(lit){ctx.shadowBlur=4;ctx.shadowColor=GLD;}
          ctx.fillRect(bx+26+cc*12,GROUND-218+r*20,8,12);ctx.shadowBlur=0;
        }
        // neon blue on side towers
        for(let r=0;r<5;r++)for(let cc=0;cc<1;cc++){ctx.fillStyle=Math.sin(frame*0.02+r)>0?'rgba(0,200,255,0.6)':'rgba(0,50,80,0.4)';ctx.fillRect(bx+4+cc*50,GROUND-138+r*24,14,16);ctx.fillRect(bx+54+cc*50,GROUND-138+r*24,14,16);}
        ctx.fillStyle=GLD;ctx.font='6px "Press Start 2P"';ctx.textAlign='center';ctx.fillText('REN CEN',bx+36,GROUND-230);
        return;
      }
      if(b.specialType==='mexican'){
        // colorful Mexican architecture
        ctx.fillStyle=b.color;ctx.fillRect(bx,GROUND-b.h,b.w,b.h);
        // decorative plaster texture
        ctx.fillStyle='rgba(255,255,255,0.06)';ctx.fillRect(bx+2,GROUND-b.h+2,b.w-4,b.h-4);
        // arched doorway
        ctx.fillStyle=shadeColor(b.color,-40);ctx.fillRect(bx+b.w/2-8,GROUND-44,16,44);
        ctx.beginPath();ctx.arc(bx+b.w/2,GROUND-44,8,Math.PI,0,false);ctx.fill();
        // colored awning
        ctx.fillStyle=b.awningCol;ctx.fillRect(bx,GROUND-b.h*0.38,b.w,10);
        ctx.strokeStyle='rgba(0,0,0,0.2)';ctx.lineWidth=1;
        for(let i=0;i<Math.floor(b.w/8);i++){ctx.beginPath();ctx.moveTo(bx+i*8,GROUND-b.h*0.38);ctx.lineTo(bx+i*8+4,GROUND-b.h*0.38+10);ctx.stroke();}
        // windows — arched
        for(let r=0;r<b.wr;r++)for(let cc=0;cc<b.wc;cc++){
          const wx=bx+8+cc*17, wy=GROUND-b.h+20+r*22;
          if(wx+12<bx+b.w-4&&wy>GROUND-b.h+5){
            ctx.fillStyle=Math.sin(frame*0.015+r+cc+b.x*0.01)>0?'#f39c12':'#1a0800';
            ctx.fillRect(wx,wy+4,10,8);
            ctx.beginPath();ctx.arc(wx+5,wy+4,5,Math.PI,0,false);ctx.fill();
          }
        }
        // papel picado hanging from building
        const flagCols=['#e74c3c','#f39c12','#2ecc71','#3498db','#9b59b6','#fff'];
        for(let i=0;i<Math.floor(b.w/10);i++){ctx.fillStyle=flagCols[i%flagCols.length];ctx.fillRect(bx+i*10+2,GROUND-b.h+2+Math.sin(i*0.9)*3,7,10);}
        return;
      }

      // Generic building — DIFFERENT look per level
      if(levelIdx===0){
        // warm brick with color variety
        ctx.fillStyle=b.color;ctx.fillRect(bx,GROUND-b.h,b.w,b.h);
        // brick rows
        ctx.fillStyle='rgba(0,0,0,0.08)';
        for(let row=0;row<Math.floor(b.h/8);row++)for(let cc=0;cc<Math.floor(b.w/16);cc++){if((row+cc)%2===0)ctx.fillRect(bx+cc*16+(row%2)*8,GROUND-b.h+row*8,14,6);}
        if(b.w>55){ctx.fillStyle=b.awningCol;ctx.fillRect(bx,GROUND-b.h*0.33,b.w,8);}
        const wc=cfg().windowColor;
        for(let r=0;r<b.wr;r++)for(let cc=0;cc<b.wc;cc++){
          const wx=bx+6+cc*17,wy=GROUND-b.h+20+r*22;
          if(wx+10<bx+b.w-4){const lit=Math.sin(frame*0.015+r*1.8+cc*0.9+b.x*0.01)>0;ctx.fillStyle=lit?wc:'#200808';if(lit){ctx.shadowBlur=4;ctx.shadowColor=wc;}ctx.fillRect(wx,wy,10,10);ctx.shadowBlur=0;}
        }
        // roof detail
        ctx.fillStyle=cfg().roofColor||shadeColor(b.color,-30);ctx.fillRect(bx,GROUND-b.h,b.w,6);

      } else if(levelIdx===1){
        // glass/steel office building
        ctx.fillStyle=b.color;ctx.fillRect(bx,GROUND-b.h,b.w,b.h);
        // glass panels
        ctx.fillStyle='rgba(40,80,120,0.3)';ctx.fillRect(bx+2,GROUND-b.h+2,b.w-4,b.h-4);
        // vertical steel lines
        ctx.strokeStyle='rgba(20,40,60,0.5)';ctx.lineWidth=1;
        for(let i=1;i<Math.floor(b.w/12);i++){ctx.beginPath();ctx.moveTo(bx+i*12,GROUND-b.h);ctx.lineTo(bx+i*12,GROUND);ctx.stroke();}
        // horizontal floors
        for(let i=1;i<Math.floor(b.h/18);i++){ctx.beginPath();ctx.moveTo(bx,GROUND-b.h+i*18);ctx.lineTo(bx+b.w,GROUND-b.h+i*18);ctx.stroke();}
        // neon windows alternating gold/blue
        const wc1=cfg().windowColor, wc2=cfg().windowColor2||'#40e0ff';
        for(let r=0;r<b.wr;r++)for(let cc=0;cc<b.wc;cc++){
          const wx=bx+5+cc*15,wy=GROUND-b.h+14+r*20;
          if(wx+10<bx+b.w-3){
            const lit=Math.sin(frame*0.012+r*1.5+cc*0.8+b.x*0.01)>0;
            const useBlue=(r+cc)%3===0;
            ctx.fillStyle=lit?(useBlue?wc2:wc1):'#030810';
            if(lit){ctx.shadowBlur=5;ctx.shadowColor=useBlue?wc2:wc1;}
            ctx.fillRect(wx,wy,10,12);ctx.shadowBlur=0;
          }
        }
        // rooftop light
        if(Math.floor(frame/20)%2===0){ctx.fillStyle='#ff4444';ctx.shadowBlur=8;ctx.shadowColor='#ff0000';ctx.beginPath();ctx.arc(bx+b.w/2,GROUND-b.h-4,4,0,Math.PI*2);ctx.fill();ctx.shadowBlur=0;}

      } else {
        // colorful painted plaster — Mexicantown
        ctx.fillStyle=b.color;ctx.fillRect(bx,GROUND-b.h,b.w,b.h);
        ctx.fillStyle='rgba(255,255,255,0.05)';ctx.fillRect(bx+2,GROUND-b.h+2,b.w-4,b.h-4);
        // colored top band
        ctx.fillStyle=b.awningCol;ctx.fillRect(bx,GROUND-b.h,b.w,8);
        ctx.fillStyle=shadeColor(b.awningCol,-20);ctx.fillRect(bx,GROUND-b.h,b.w,4);
        // arched windows
        const wc=cfg().windowColor;
        for(let r=0;r<b.wr;r++)for(let cc=0;cc<b.wc;cc++){
          const wx=bx+7+cc*18,wy=GROUND-b.h+18+r*24;
          if(wx+12<bx+b.w-4){
            const lit=Math.sin(frame*0.015+r+cc+b.x*0.01)>0;
            ctx.fillStyle=lit?wc:'#1a0800';
            ctx.fillRect(wx,wy+5,11,9);
            ctx.beginPath();ctx.arc(wx+5.5,wy+5,5.5,Math.PI,0,false);ctx.fill();
          }
        }
      }
    }

    function drawHUD(){
      const c=cfg();
      ctx.fillStyle='rgba(0,0,0,0.85)';ctx.fillRect(0,0,W,56);
      // score
      ctx.fillStyle=GLD;ctx.font='11px "Press Start 2P"';ctx.textAlign='left';ctx.fillText('SCORE:'+sc,12,18);
      if(highSc>0){ctx.fillStyle='#c8b830';ctx.font='8px "Press Start 2P"';ctx.fillText('BEST:'+highSc,12,34);}
      // HP bar — center
      const hpW=160;
      ctx.fillStyle='#222';ctx.fillRect(W/2-hpW/2-2,8,hpW+4,16);
      const hpPct=pl.hp/MAX_HP;
      const hpCol=hpPct>0.5?'#2ecc71':hpPct>0.25?'#f39c12':'#e74c3c';
      ctx.fillStyle=hpCol;ctx.fillRect(W/2-hpW/2,10,Math.max(0,hpW*hpPct),12);
      ctx.strokeStyle=GLD;ctx.lineWidth=1;ctx.strokeRect(W/2-hpW/2-2,8,hpW+4,16);
      ctx.fillStyle='#fff';ctx.font='7px "Press Start 2P"';ctx.textAlign='center';ctx.fillText('HP',W/2,22);
      ctx.fillStyle='#F5F0DC';ctx.font='8px "Press Start 2P"';ctx.fillText('LVL '+(levelIdx+1)+' · '+c.name,W/2,38);
      // lives — pixel hearts right of center
      ctx.fillStyle='#e74c3c';ctx.font='12px "Press Start 2P"';ctx.textAlign='left';
      ctx.fillText('❤'.repeat(lives)+'🖤'.repeat(Math.max(0,MAX_LIVES-lives)),W/2+100,22);
      // pizza counter
      if(!boss||boss.dead){
        const label=c.collectible==='taco'?'🌮':'🍕';
        ctx.fillStyle='#c8b830';ctx.textAlign='right';ctx.font='10px "Press Start 2P"';
        ctx.fillText(label+' '+pc+'/'+c.collectTarget,W-12,18);
        for(let i=0;i<c.collectTarget;i++){ctx.fillStyle=i<pc?'#FF8C00':'#333';ctx.fillRect(W-12-c.collectTarget*10+i*10,26,8,10);}
      } else {
        // boss HP bar
        const bhpW=200;
        ctx.fillStyle='#222';ctx.fillRect(W-bhpW-14,8,bhpW+4,16);
        const bpct=bossHp/BOSS_MAX_HP;
        ctx.fillStyle=bpct>0.5?'#2ecc71':bpct>0.25?'#f39c12':'#e74c3c';
        ctx.fillRect(W-bhpW-12,10,Math.max(0,bhpW*bpct),12);
        ctx.strokeStyle=GLD;ctx.lineWidth=1;ctx.strokeRect(W-bhpW-14,8,bhpW+4,16);
        const bnames={landlord:'LANDLORD',ratking:'RAT KING',recordexec:'RECORD EXEC'};
        ctx.fillStyle='#fff';ctx.font='7px "Press Start 2P"';ctx.textAlign='right';
        ctx.fillText(boss?bnames[boss.type]:'BOSS',W-14,38);
      }
    }

    function drawTitle(){
      ctx.fillStyle=GRN;ctx.fillRect(0,0,W,H);
      for(let i=0;i<50;i++){const sx=(i*131+frame*0.3)%W,sy=(i*71)%(H*0.55);ctx.fillStyle=Math.sin(frame*0.04+i)>0.4?GLD:'rgba(226,168,32,0.08)';ctx.fillRect(sx,sy,Math.sin(frame*0.06+i)>0.6?3:1,Math.sin(frame*0.06+i)>0.6?3:1);}
      ctx.fillStyle='rgba(0,0,0,0.9)';ctx.fillRect(W/2-300,H/2-210,600,420);
      ctx.strokeStyle=GLD;ctx.lineWidth=4;ctx.strokeRect(W/2-300,H/2-210,600,420);
      ctx.fillStyle=GLD;ctx.font='20px "Press Start 2P"';ctx.textAlign='center';ctx.fillText('DETROIT PIZZA QUEST',W/2,H/2-165);
      ctx.fillStyle='#c8b830';ctx.font='11px "Press Start 2P"';ctx.fillText('— Team Cabin Edition —',W/2,H/2-133);
      ctx.fillStyle='#F5F0DC';ctx.font='9px "Press Start 2P"';
      ctx.fillText('3 LEVELS · 3 BOSSES · 1 CITY',W/2,H/2-100);
      ctx.fillText('← → MOVE     JUMP BUTTON / SPACE',W/2,H/2-76);
      ctx.fillText('STOMP ENEMIES TO DEFEAT THEM',W/2,H/2-52);
      ctx.fillText('COLLECT 16 SLICES → BOSS FIGHT',W/2,H/2-28);
      ctx.fillText('GRAB ❤ HEARTS FOR HEALTH',W/2,H/2-4);
      ctx.fillStyle='rgba(226,168,32,0.45)';ctx.font='7px "Press Start 2P"';
      ctx.fillText('❤❤❤ 3 LIVES · FULL HP EACH RESPAWN',W/2,H/2+24);
      ctx.fillText('LVL1: YPSILANTI · LVL2: DETROIT · LVL3: MEXICANTOWN',W/2,H/2+44);
      if(Math.floor(frame/25)%2===0){ctx.fillStyle='#4A7A30';ctx.font='11px "Press Start 2P"';ctx.fillText('[ PRESS ENTER TO CHOOSE PLAYER ]',W/2,H/2+84);}
      if(highSc>0){ctx.fillStyle='#c8b830';ctx.font='9px "Press Start 2P"';ctx.fillText('HIGH SCORE: '+highSc,W/2,H/2+114);}
    }

    function drawCharSelect(){
      ctx.fillStyle=GRN;ctx.fillRect(0,0,W,H);
      for(let i=0;i<40;i++){const sx=(i*137)%W,sy=(i*71)%(H*0.6);ctx.fillStyle=Math.sin(frame*0.04+i)>0.4?GLD:'rgba(226,168,32,0.07)';ctx.fillRect(sx,sy,2,2);}
      ctx.fillStyle=GLD;ctx.font='20px "Press Start 2P"';ctx.textAlign='center';ctx.fillText('CHOOSE YOUR PLAYER',W/2,52);
      const chars=[{name:'STEVE',role:'Bass & Vocals',desc:'Bearded groove machine'},{name:'MIKE',role:'Drums',desc:'Everybody loves Mike'},{name:'KYLE',role:'Guitar & Vocals',desc:'Tall guitar genius'}];
      const cardW=210,cardH=380,gap=18,startX=(W-(cardW*3+gap*2))/2;
      chars.forEach((ch,i)=>{
        const cx=startX+i*(cardW+gap),cy=72,isSel=selectedChar===i;
        ctx.fillStyle=isSel?'rgba(226,168,32,0.1)':'rgba(0,0,0,0.55)';ctx.fillRect(cx,cy,cardW,cardH);
        ctx.strokeStyle=isSel?GLD:'rgba(226,168,32,0.2)';ctx.lineWidth=isSel?4:2;ctx.strokeRect(cx,cy,cardW,cardH);
        if(isSel){ctx.shadowBlur=14;ctx.shadowColor=GLD;ctx.strokeRect(cx,cy,cardW,cardH);ctx.shadowBlur=0;}
        ctx.save();ctx.translate(cx+cardW/2-44,cy+40);ctx.scale(4,4);
        drawCharSprite(ctx,i,0,0,22,{gold:GLD});
        ctx.restore();
        ctx.fillStyle=isSel?GLD:'#F5F0DC';ctx.font=`${isSel?'13':'12'}px "Press Start 2P"`;ctx.textAlign='center';ctx.fillText(ch.name,cx+cardW/2,cy+cardH-62);
        ctx.fillStyle='#c8b830';ctx.font='9px "Press Start 2P"';ctx.fillText(ch.role,cx+cardW/2,cy+cardH-40);
        ctx.fillStyle='rgba(245,240,220,0.5)';ctx.font='8px "Press Start 2P"';ctx.fillText(ch.desc,cx+cardW/2,cy+cardH-18);
        if(isSel&&Math.floor(frame/20)%2===0){ctx.fillStyle=GLD;ctx.font='18px serif';ctx.fillText('▼',cx+cardW/2,cy-8);}
      });
      ctx.fillStyle='#F5F0DC';ctx.font='11px "Press Start 2P"';ctx.textAlign='center';ctx.fillText('← → TO SELECT     ENTER TO CONFIRM',W/2,H-18);
    }

    function drawLevelTransition(){
      const c=cfg();
      ctx.fillStyle=c.daytime?'#3a7ad9':c.skyTop||'#050d03';ctx.fillRect(0,0,W,H);
      ctx.fillStyle='rgba(0,0,0,0.85)';ctx.fillRect(W/2-260,H/2-130,520,260);
      ctx.strokeStyle=GLD;ctx.lineWidth=4;ctx.strokeRect(W/2-260,H/2-130,520,260);
      ctx.fillStyle=GLD;ctx.font='14px "Press Start 2P"';ctx.textAlign='center';ctx.fillText('LEVEL '+(levelIdx+1),W/2,H/2-88);
      ctx.fillStyle='#F5F0DC';ctx.font='22px "Press Start 2P"';ctx.fillText(c.name,W/2,H/2-52);
      ctx.fillStyle='#c8b830';ctx.font='10px "Press Start 2P"';ctx.fillText(c.subtitle,W/2,H/2-22);
      ctx.fillStyle='rgba(245,240,220,0.7)';ctx.font='8px "Press Start 2P"';
      ctx.fillText('COLLECT 16 '+(c.collectible==='taco'?'TACOS':'PIZZA SLICES')+' · THEN FIGHT THE BOSS',W/2,H/2+18);
      if(Math.floor(frame/20)%2===0){ctx.fillStyle='#4A7A30';ctx.font='11px "Press Start 2P"';ctx.fillText('GET READY...',W/2,H/2+65);}
    }

    function drawGameOver(){
      ctx.fillStyle='rgba(0,0,0,0.88)';ctx.fillRect(0,0,W,H);
      ctx.fillStyle='#e74c3c';ctx.font='28px "Press Start 2P"';ctx.textAlign='center';ctx.fillText('GAME OVER',W/2,H/2-70);
      ctx.fillStyle='#F5F0DC';ctx.font='13px "Press Start 2P"';ctx.fillText('SCORE: '+sc,W/2,H/2-30);
      if(sc>=highSc&&sc>0){ctx.fillStyle='#c8b830';ctx.fillText('NEW HIGH SCORE!',W/2,H/2);} 
      if(Math.floor(frame/28)%2===0){ctx.fillStyle=GLD;ctx.font='11px "Press Start 2P"';ctx.fillText('PRESS ENTER TO TRY AGAIN',W/2,H/2+55);}
    }

    function drawWin(){
      ctx.fillStyle=GRN;ctx.fillRect(0,0,W,H);
      for(let i=0;i<30;i++){ctx.fillStyle=[GLD,'#e74c3c','#F5F0DC','#4A7A30'][i%4];ctx.fillRect((i*137+frame*2.5)%W,(i*89+frame*1.5)%(H-60),8,8);}
      ctx.fillStyle='rgba(0,0,0,0.85)';ctx.fillRect(W/2-270,H/2-145,540,290);
      ctx.strokeStyle=GLD;ctx.lineWidth=4;ctx.strokeRect(W/2-270,H/2-145,540,290);
      ctx.fillStyle=GLD;ctx.font='17px "Press Start 2P"';ctx.textAlign='center';ctx.fillText('🍕 DETROIT CONQUERED! 🍕',W/2,H/2-105);
      ctx.fillStyle='#F5F0DC';ctx.font='11px "Press Start 2P"';
      ctx.fillText('THE BAND FEASTS TONIGHT',W/2,H/2-70);ctx.fillText('ALL 3 LEVELS COMPLETE',W/2,H/2-43);ctx.fillText('SCORE: '+sc,W/2,H/2-13);
      if(sc>=highSc&&sc>0){ctx.fillStyle='#c8b830';ctx.fillText('✨ NEW HIGH SCORE! ✨',W/2,H/2+25);}
      if(Math.floor(frame/28)%2===0){ctx.fillStyle='#c8b830';ctx.font='11px "Press Start 2P"';ctx.fillText('PRESS ENTER TO PLAY AGAIN',W/2,H/2+72);}
    }

    let raf;
    function loop(){
      frame++;

      if(gState==='transition'){
        transitionTimer--;drawLevelTransition();
        if(transitionTimer<=0){gState='playing';sync();}
        raf=requestAnimationFrame(loop);return;
      }

      if(gState==='playing'){
        // movement — left/right only
        if(keys['ArrowLeft']||keys['KeyA']){pl.vx=-MOVE_SPEED;pl.face=-1;}
        else if(keys['ArrowRight']||keys['KeyD']){pl.vx=MOVE_SPEED;pl.face=1;}
        else pl.vx*=0.55;

        // jump
        if((keys['ArrowUp']||keys['Space']||keys['KeyW'])&&!jumpPressed){
          jumpPressed=true;jump();
        }
        if(!keys['ArrowUp']&&!keys['Space']&&!keys['KeyW']) jumpPressed=false;

        if(!pl.dying){
          pl.vy+=GRAVITY;
          pl.x+=pl.vx;pl.y+=pl.vy;
          if(pl.y+PH>=GROUND){pl.y=GROUND-PH;pl.vy=0;pl.onGround=true;}
          else pl.onGround=false;
          if(pl.x<20)pl.x=20; if(pl.x>W-PW-20)pl.x=W-PW-20;
          if(pl.inv>0)pl.inv--;
          // scroll
          if(pl.x>W*0.42){const s=pl.x-W*0.42;scrollX+=s;pl.x=W*0.42;}
        } else {
          // dying animation — bounce up then fall
          pl.vy+=GRAVITY*0.7;pl.y+=pl.vy;pl.x+=pl.vx*0.3;
          pl.dyingTimer--;
          if(pl.dyingTimer<=0){
            lives--;
            if(lives<=0){
              if(sc>highSc)highSc=sc;
              music.pause();gState='gameover';sync();
            } else {
              respawn();
            }
          }
        }

        const c=cfg();
        if(!boss||boss.dead){
          spT++;if(spT>=c.spawnRate){spawnEnemy();spT=0;}
          piT++;if(piT>=72){spawnCollectible();piT=0;}
          // health items spawn roughly every ~15s, more frequently when low HP
          const hpRate=pl.hp<40?90:180;
          hpT++;if(hpT>=hpRate){spawnHealthItem();hpT=0;}
        }
        if(pc>=c.collectTarget&&!boss) triggerBoss();

        // boss — bounces left/right
        if(boss&&!boss.dead){
          boss.x+=boss.vx;
          if(boss.inv>0)boss.inv--;if(boss.hitFlash>0)boss.hitFlash--;
          const bOx=boss.x-scrollX;
          if(bOx<80)boss.vx=Math.abs(boss.vx);
          if(bOx>W-boss.w-60)boss.vx=-Math.abs(boss.vx);
          // stomp boss
          const pb=pl.y+PH; const bOverlapX=pl.x<bOx+boss.w&&pl.x+PW>bOx;
          const stomping=pl.vy>0&&pb>=boss.y&&pb<=boss.y+20&&bOverlapX;
          if(stomping&&boss.inv===0&&!pl.dying){
            bossHp=Math.max(0,bossHp-40);boss.inv=50;boss.hitFlash=20;pl.vy=-12;sc+=400;
            addParts(bOx+boss.w/2,boss.y,GLD,18);
            if(bossHp<=0){boss.dead=true;boss.deadTimer=90;sc+=3000;addParts(bOx+boss.w/2,boss.y+boss.h/2,'#FFD700',50);}
            sync();
          }
          if(!pl.dying&&pl.inv===0&&bOverlapX&&pl.y<boss.y+boss.h&&pl.y+PH>boss.y&&!stomping){
            pl.hp=Math.max(0,pl.hp-15);pl.inv=80;addParts(pl.x+PW/2,pl.y+PH/2,'#e74c3c',8);
            if(pl.hp<=0)playerDie();
            sync();
          }
        }
        if(boss&&boss.dead){
          boss.deadTimer--;
          if(boss.deadTimer<=0){
            if(levelIdx>=LEVELS.length-1){if(sc>highSc)highSc=sc;music.pause();gState='win';sync();}
            else{levelIdx++;pc=0;pl.hp=MAX_HP;resetLevel();transitionTimer=220;gState='transition';sync();}
          }
        }

        // enemies — walk from right, stomp to kill
        obs=obs.filter(o=>{
          if(o.hitFlash>0)o.hitFlash--;
          if(o.type==='cone'){
            const ox=o.x-scrollX;if(ox<-120)return false;
            if(o.dead){o.deadTimer--;return o.deadTimer>0;}
            if(!pl.dying&&pl.inv===0&&ox+o.w>pl.x&&ox<pl.x+PW&&o.y+o.h>pl.y&&o.y<pl.y+PH){
              pl.hp=Math.max(0,pl.hp-15);pl.inv=80;addParts(pl.x+PW/2,pl.y+PH/2,'#e74c3c',6);
              if(pl.hp<=0)playerDie();sync();
            }
            return true;
          }
          o.x+=o.vx; const ox=o.x-scrollX;
          if(ox<-120)return false;
          if(o.dead){o.deadTimer--;return o.deadTimer>0;}
          o.at++;
          // stomp — only way to defeat enemies (Super Mario style)
          if(!pl.dying&&!pl.onGround&&pl.vy>0){
            const pb=pl.y+PH;
            if(ox+o.w>pl.x&&ox<pl.x+PW&&pb>=o.y&&pb<=o.y+14){
              o.hp=(o.hp||1)-1;o.hitFlash=12;pl.vy=-10;
              sc+=150;addParts(ox+o.w/2,o.y,GLD,8);
              if(o.hp<=0){o.dead=true;o.deadTimer=28;sc+=50;}
              sync();return true;
            }
          }
          if(!pl.dying&&pl.inv===0&&ox+o.w>pl.x&&ox<pl.x+PW&&o.y+o.h>pl.y&&o.y<pl.y+PH){
            pl.hp=Math.max(0,pl.hp-12);pl.inv=80;addParts(pl.x+PW/2,pl.y+PH/2,'#e74c3c',6);
            if(pl.hp<=0)playerDie();sync();
          }
          return true;
        });

        // pizza collection
        pizzas=pizzas.filter(pz=>{
          if(pz.collected)return false;const ox=pz.x-scrollX;if(ox<-80)return false;
          const bob=Math.sin(frame*0.08+pz.bob)*5;
          if(!pl.dying&&pl.x<ox+28&&pl.x+PW>ox&&pl.y<pz.y+bob+28&&pl.y+PH>pz.y+bob){
            pz.collected=true;sc+=100;pc++;addParts(ox+14,pz.y+14,GLD,12);sync();return false;
          }
          return true;
        });

        // health pickup
        healthItems=healthItems.filter(h=>{
          if(h.collected)return false;const ox=h.x-scrollX;if(ox<-80)return false;
          const bob=Math.sin(frame*0.1+h.bob)*4;
          if(!pl.dying&&pl.x<ox+16&&pl.x+PW>ox&&pl.y<h.y+bob+16&&pl.y+PH>h.y+bob){
            h.collected=true;pl.hp=Math.min(MAX_HP,pl.hp+HP_HEAL);
            addParts(ox+8,h.y,'#e74c3c',14);sync();return false;
          }
          return true;
        });

        parts=parts.filter(p=>{p.x+=p.vx;p.y+=p.vy;p.vy+=0.2;p.life--;return p.life>0;});
        if(!blds.length||blds[blds.length-1].x-scrollX<W+300)
          blds.push(mkBld((blds[blds.length-1]?.x||200)+90+Math.random()*140));
        blds=blds.filter(b=>b.x-scrollX>-300);
      }

      if(gState==='title'){drawTitle();raf=requestAnimationFrame(loop);return;}
      if(gState==='charselect'){drawCharSelect();raf=requestAnimationFrame(loop);return;}
      if(gState==='win'){drawWin();raf=requestAnimationFrame(loop);return;}
      if(gState==='gameover'){drawGameOver();raf=requestAnimationFrame(loop);return;}

      // draw world
      drawBackground();
      blds.forEach(b=>drawBuilding(b));
      drawGround();

      // health items
      healthItems.forEach(h=>{
        if(!h.collected){const ox=h.x-scrollX;const bob=Math.sin(frame*0.1+h.bob)*4;drawHealthItem(ctx,ox,h.y+bob);}
      });

      // collectibles
      pizzas.forEach(pz=>{
        const ox=pz.x-scrollX;const bob=Math.sin(frame*0.08+pz.bob)*5;
        if(pz.type==='taco')drawTaco(ctx,ox,pz.y+bob,{gold:GLD});
        else drawPizzaSlice(ctx,ox,pz.y+bob,{gold:GLD});
      });

      // enemies
      obs.forEach(o=>{
        const ox=o.x-scrollX;
        if(o.dead){ctx.globalAlpha=Math.max(0,o.deadTimer/28);ctx.font='18px serif';ctx.textAlign='center';ctx.fillText('💀',ox+o.w/2,o.y+o.h-2);ctx.globalAlpha=1;return;}
        if(o.hitFlash>0&&Math.floor(o.hitFlash/3)%2===0){ctx.globalAlpha=0.5;ctx.fillStyle='#fff';ctx.fillRect(ox,o.y,o.w,o.h);ctx.globalAlpha=1;}
        drawEnemySprite(ctx,o,scrollX,{gold:GLD});
      });

      // boss
      if(boss&&(!boss.dead||boss.deadTimer>0)){
        const bOx=boss.x-scrollX;
        if(boss.hitFlash>0&&Math.floor(boss.hitFlash/3)%2===0){ctx.globalAlpha=0.4;ctx.fillStyle='#fff';ctx.fillRect(bOx,boss.y,boss.w,boss.h);ctx.globalAlpha=1;}
        drawBossSprite(ctx,boss,scrollX,bossHp,BOSS_MAX_HP,{gold:GLD});
      }

      // particles
      parts.forEach(p=>{ctx.globalAlpha=p.life/p.ml;ctx.fillStyle=p.col;ctx.fillRect(p.x-p.sz/2,p.y-p.sz/2,p.sz,p.sz);});
      ctx.globalAlpha=1;

      // player
      const showPlayer=!pl.dying||(Math.floor(pl.dyingTimer/6)%2===0);
      if(showPlayer&&!(pl.inv>0&&Math.floor(pl.inv/5)%2===0)){
        ctx.save();
        if(pl.face===-1){ctx.translate(pl.x+PW,0);ctx.scale(-1,1);ctx.translate(-pl.x,0);}
        // slight squash on landing, stretch on jump
        if(!pl.onGround&&pl.vy<-2){ctx.translate(pl.x+PW/2,pl.y+PH);ctx.scale(0.85,1.2);ctx.translate(-pl.x-PW/2,-pl.y-PH);}
        else if(pl.onGround&&Math.abs(pl.vy)>3){ctx.translate(pl.x+PW/2,pl.y+PH);ctx.scale(1.2,0.85);ctx.translate(-pl.x-PW/2,-pl.y-PH);}
        drawCharSprite(ctx,charIdx,pl.x,pl.y,PW,{gold:GLD});
        ctx.restore();
      }

      drawHUD();
      if(gState==='dead'){}  // handled by dying timer above
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
        else if(gState==='charselect'){charIdx=selectedChar;startGame();}
        else if(gState==='gameover'){startGame();}
        else if(gState==='win'){gState='charselect';sync();}
      }
    };
    const onUp=e=>{keys[e.code]=false;};
    window.addEventListener('keydown',onDown); window.addEventListener('keyup',onUp);
    loop();

    gameRef.current={jump,startGame,toCharSelect:()=>{gState='charselect';sync();},setChar:(i)=>{selectedChar=i;sync();},confirmChar:()=>{charIdx=selectedChar;startGame();},keys,getState:()=>gState,getSelectedChar:()=>selectedChar};
    return()=>{cancelAnimationFrame(raf);window.removeEventListener('keydown',onDown);window.removeEventListener('keyup',onUp);music.pause();music.currentTime=0;};
  },[]);

  const enterFullscreen=()=>{document.documentElement.requestFullscreen().catch(()=>{});setIsFullscreen(true);};
  const exitFullscreen=()=>{if(document.fullscreenElement)document.exitFullscreen().catch(()=>{});setIsFullscreen(false);};
  useEffect(()=>{const fn=()=>{if(!document.fullscreenElement)setIsFullscreen(false);};document.addEventListener('fullscreenchange',fn);return()=>document.removeEventListener('fullscreenchange',fn);},[]);

  const mb=(key,down)=>{
    const g=gameRef.current;if(!g)return;
    const st=g.getState?g.getState():uiState.state;
    if(key==='jump'){if(down&&st==='playing')g.jump();}
    else if(key==='start'){
      if(st==='title')g.toCharSelect?.();
      else if(st==='charselect')g.confirmChar?.();
      else if(st==='gameover')g.startGame?.();
      else if(st==='win')g.toCharSelect?.();
    } else if(key==='ArrowLeft'&&down){
      if(st==='charselect')g.setChar?.(((g.getSelectedChar?.()??0)+2)%3);
      else g.keys['ArrowLeft']=true;
    } else if(key==='ArrowRight'&&down){
      if(st==='charselect')g.setChar?.(((g.getSelectedChar?.()??0)+1)%3);
      else g.keys['ArrowRight']=true;
    } else{g.keys[key]=down;}
  };

  const holdBtn=(label,key,bg,fg,w,h)=>(
    <button key={key}
      style={{fontFamily:'"Press Start 2P"',fontSize:'0.75rem',background:bg,color:fg||'#fff',border:'none',
        borderRadius:8,cursor:'pointer',boxShadow:'0 5px 0 rgba(0,0,0,0.5)',
        userSelect:'none',WebkitUserSelect:'none',WebkitTouchCallout:'none',touchAction:'none',
        width:w||80,height:h||80,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}
      onTouchStart={e=>{e.preventDefault();mb(key,true);}}
      onTouchEnd={e=>{e.preventDefault();mb(key,false);}}
      onTouchCancel={e=>{e.preventDefault();mb(key,false);}}
      onContextMenu={e=>e.preventDefault()}
      onMouseDown={()=>mb(key,true)}
      onMouseUp={()=>mb(key,false)}
      onMouseLeave={()=>mb(key,false)}
    >{label}</button>
  );

  const tapBtn=(label,key,bg,fg,w,h)=>(
    <button key={key}
      style={{fontFamily:'"Press Start 2P"',fontSize:'0.75rem',background:bg,color:fg||'#fff',border:'none',
        borderRadius:50,cursor:'pointer',boxShadow:'0 5px 0 rgba(0,0,0,0.5)',
        userSelect:'none',WebkitUserSelect:'none',WebkitTouchCallout:'none',touchAction:'none',
        width:w||90,height:h||90,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}
      onTouchStart={e=>{e.preventDefault();mb(key,true);}}
      onTouchEnd={e=>e.preventDefault()}
      onContextMenu={e=>e.preventDefault()}
      onMouseDown={()=>mb(key,true)}
    >{label}</button>
  );

  const controlBar=(
    <div style={{background:GRN,borderTop:`3px solid ${GLD}`,padding:'12px 16px',paddingBottom:'max(12px,env(safe-area-inset-bottom))'}}>
      {/* fullscreen */}
      <div style={{display:'flex',justifyContent:'center',marginBottom:10}}>
        <button style={{fontFamily:'"Press Start 2P"',fontSize:'0.38rem',background:isFullscreen?'#e74c3c':GRN2,color:'#F5F0DC',border:`1px solid ${GLD}`,borderRadius:4,cursor:'pointer',padding:'5px 14px',boxShadow:'2px 2px 0 #000'}}
          onMouseDown={isFullscreen?exitFullscreen:enterFullscreen}
          onTouchStart={e=>{e.preventDefault();isFullscreen?exitFullscreen():enterFullscreen();}}>
          {isFullscreen?'✕ EXIT FULLSCREEN':'⛶ FULLSCREEN'}
        </button>
      </div>

      {/* NES layout — ◀ ▶ left, START center, JUMP right (big round A button) */}
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',gap:8}}>

        {/* directional — left and right only */}
        <div style={{display:'flex',gap:8}}>
          {holdBtn('◀','ArrowLeft',GLD,GRN,82,82)}
          {holdBtn('▶','ArrowRight',GLD,GRN,82,82)}
        </div>

        {/* START */}
        <div style={{display:'flex',flexDirection:'column',gap:6,alignItems:'center'}}>
          <button style={{fontFamily:'"Press Start 2P"',fontSize:'0.38rem',background:'#444',color:'#F5F0DC',border:'1px solid #666',borderRadius:16,cursor:'pointer',padding:'6px 14px',boxShadow:'0 3px 0 rgba(0,0,0,0.5)',userSelect:'none',WebkitUserSelect:'none',touchAction:'none'}}
            onTouchStart={e=>{e.preventDefault();mb('start',true);}} onTouchEnd={e=>e.preventDefault()}
            onContextMenu={e=>e.preventDefault()} onMouseDown={()=>mb('start',true)}>START</button>
          {!isMobile&&<div style={{fontFamily:'"Press Start 2P"',fontSize:'0.24rem',color:'rgba(226,168,32,0.35)',textAlign:'center',lineHeight:2.2}}>← → MOVE{'\n'}SPACE JUMP</div>}
        </div>

        {/* JUMP — big round A button, NES style */}
        {tapBtn('A\nJUMP','jump','#e74c3c','#fff',96,96)}

      </div>

      <div style={{display:'flex',justifyContent:'flex-end',marginTop:4}}>
        <span style={{fontFamily:'"Press Start 2P"',fontSize:'0.26rem',color:'rgba(226,168,32,0.35)'}}>A = JUMP</span>
      </div>
    </div>
  );

  if(isFullscreen){
    return(
      <div style={{position:'fixed',inset:0,zIndex:9999,background:'#000',display:'flex',flexDirection:'column'}}>
        <div style={{flex:1,display:'flex',alignItems:'center',justifyContent:'center',background:'#000'}}>
          <canvas ref={canvasRef} width={780} height={520} style={{maxWidth:'100%',maxHeight:'100%',imageRendering:'pixelated',display:'block'}}/>
        </div>
        {controlBar}
      </div>
    );
  }

  return(
    <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:'0.5rem'}}>
      <div style={{border:`4px solid ${GLD}`,boxShadow:`4px 4px 0 #000`,background:'#000',width:'100%',maxWidth:780}}>
        <canvas ref={canvasRef} width={780} height={520} style={{width:'100%',display:'block',imageRendering:'pixelated'}}/>
      </div>
      {controlBar}
      <div style={{fontFamily:'"Press Start 2P"',fontSize:'0.3rem',color:'rgba(226,168,32,0.3)',textAlign:'center'}}>
        ← → MOVE &nbsp;|&nbsp; SPACE / A JUMP &nbsp;|&nbsp; ENTER START
      </div>
    </div>
  );
}
