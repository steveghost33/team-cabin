import { useEffect, useRef, useState } from 'react';
import { C } from '../data/constants';
import { LEVELS } from './game/levels.jsx';
import { drawCharSprite, drawPizzaSlice, drawTaco, drawEnemySprite, drawBossSprite, drawHealthItem } from './game/sprites.jsx';

const W = 780, H = 520;
const GROUND = H - 80;
const PW = 24, PH = 32;
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
  const gameRef   = useRef({});
  const [uiState, setUiState] = useState({ state:'title', lives:MAX_LIVES });
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile('ontouchstart' in window || window.innerWidth <= 768);
    check(); window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const music = new Audio(SONG_FILE); music.loop = true; music.volume = SONG_VOLUME;

    let gState = 'title';
    let sc = 0, pc = 0, levelIdx = 0, lives = MAX_LIVES;
    let frame = 0, scrollX = 0, spT = 0, piT = 0, hpT = 0, highSc = 0;
    let obs = [], pizzas = [], healthItems = [], parts = [], blds = [];
    let keys = {}, charIdx = 0, selectedChar = 0;
    let boss = null, bossHp = BOSS_MAX_HP;
    let transitionTimer = 0;
    let jumpPressed = false;

    const pl = { x:80, y:GROUND-PH, vx:0, vy:0, onGround:true, face:1, inv:0, hp:MAX_HP, dying:false, dyingTimer:0 };
    const sync = () => setUiState({ state:gState, lives });
    const cfg  = () => LEVELS[levelIdx];

    function resetLevel() {
      pl.x=80; pl.y=GROUND-PH; pl.vx=0; pl.vy=0; pl.onGround=true;
      pl.inv=120; pl.dying=false; pl.dyingTimer=0; pl.face=1;
      obs=[]; pizzas=[]; healthItems=[]; parts=[]; blds=[];
      boss=null; bossHp=BOSS_MAX_HP;
      scrollX=0; spT=0; piT=0; hpT=0;
      for (let i = 0; i < 28; i++) blds.push(mkBld(i*160+200));
    }
    function startGame() { sc=0; pc=0; levelIdx=0; lives=MAX_LIVES; pl.hp=MAX_HP; charIdx=selectedChar; resetLevel(); gState='playing'; music.currentTime=0; music.play().catch(()=>{}); sync(); }
    function respawn()   { pl.hp=MAX_HP; pc=0; charIdx=selectedChar; resetLevel(); gState='playing'; music.play().catch(()=>{}); sync(); }
    function jump()      { if (pl.onGround && !pl.dying) { pl.vy=JUMP_POWER; pl.onGround=false; } }
    function playerDie() { if (pl.dying || pl.inv>0) return; pl.dying=true; pl.dyingTimer=80; pl.vy=JUMP_POWER*0.8; music.pause(); }

    let eid = 0;
    function mkBld(x) {
      const c = cfg();
      const aw = c.awningCols[Math.floor(Math.random()*c.awningCols.length)];
      let sp = null;
      if (levelIdx===0) { const r=Math.random(); if(r<0.08)sp='grove'; else if(r<0.16)sp='hyperion'; else if(r<0.28)sp='ypsi_brick'; }
      if (levelIdx===1) { const r=Math.random(); if(r<0.08)sp='standrews'; else if(r<0.16)sp='checker'; else if(r<0.24)sp='rencen'; }
      if (levelIdx===2) { const r=Math.random(); if(r<0.1)sp='loving_touch'; else if(r<0.22)sp='ferndale_bar'; }
      return { x, w:60+Math.random()*90, h:80+Math.random()*170,
               color:c.buildingCols[Math.floor(Math.random()*c.buildingCols.length)],
               wc:Math.floor(Math.random()*4)+2, wr:Math.floor(Math.random()*4)+2,
               sp, aw, lit:Math.random()>0.4 };
    }

    function spawnEnemy() {
      if (boss && !boss.dead) return;
      const c = cfg(); const r = Math.random();
      let type;
      if      (levelIdx===0) type = r<0.2?'cone':r<0.55?'metermaid':'rat';
      else if (levelIdx===1) type = r<0.12?'cone':r<0.38?'metermaid':r<0.62?'muscledude':'rat';
      else                   type = r<0.08?'cone':r<0.28?'metermaid':r<0.52?'muscledude':r<0.74?'biker':'rat';
      const geo = {cone:{w:18,h:26},metermaid:{w:24,h:32},muscledude:{w:24,h:32},biker:{w:24,h:32},rat:{w:12,h:10}};
      const {w,h} = geo[type];
      obs.push({ id:eid++, type, x:scrollX+W+40+Math.random()*120, y:GROUND-h, w, h,
                 vx:type==='cone'?0:-(c.enemySpeed+Math.random()*0.8),
                 at:0, dead:false, deadTimer:0,
                 hp:type==='muscledude'||type==='biker'?3:type==='rat'?1:2, hitFlash:0 });
    }
    function spawnCollectible() {
      if (boss && !boss.dead) return;
      const air = Math.random()<0.4;
      pizzas.push({ x:scrollX+W+60+Math.random()*80, y:air?GROUND-PH-50-Math.random()*50:GROUND-PH-4,
                    bob:Math.random()*Math.PI*2, collected:false, type:cfg().collectible });
    }
    function spawnHealthItem() {
      if (boss && !boss.dead) return;
      healthItems.push({ x:scrollX+W+80+Math.random()*60, y:GROUND-PH-8, bob:Math.random()*Math.PI*2, collected:false });
    }
    function triggerBoss() {
      obs=[]; pizzas=[]; healthItems=[]; bossHp=BOSS_MAX_HP;
      const types=['landlord','ratking','recordexec'];
      boss = { type:types[levelIdx], x:scrollX+W+80, y:GROUND-80, w:60, h:80, vx:-(2.0+levelIdx*0.5), at:0, inv:0, hitFlash:0, dead:false, deadTimer:0 };
    }
    function addParts(x,y,col,n) { for(let i=0;i<n;i++) parts.push({x,y,vx:(Math.random()-0.5)*7,vy:(Math.random()-0.5)*7-2,life:50+Math.random()*20,ml:70,col,sz:2+Math.random()*4}); }

    // ── BACKGROUND DRAW ──────────────────────────────────────────────────

    function drawBg() {
      const c = cfg();

      if (levelIdx === 0) {
        // YPSILANTI — warm afternoon blue sky
        const sg = ctx.createLinearGradient(0,0,0,GROUND);
        sg.addColorStop(0,'#3a7ad4'); sg.addColorStop(0.6,'#6ab4f0'); sg.addColorStop(1,'#a0d4f8');
        ctx.fillStyle=sg; ctx.fillRect(0,0,W,GROUND);
        // sun
        ctx.fillStyle='#FFD700'; ctx.beginPath();ctx.arc(W-70,58,28,0,Math.PI*2);ctx.fill();
        ctx.fillStyle='rgba(255,220,80,0.18)'; ctx.beginPath();ctx.arc(W-70,58,46,0,Math.PI*2);ctx.fill();
        // clouds
        ctx.fillStyle='rgba(255,255,255,0.94)';
        [[80,55,35],[230,42,26],[410,65,30],[590,48,22],[720,72,20]].forEach(([cx,cy,r])=>{
          const cx2=((cx-scrollX*0.04+W*4)%(W+200))-100;
          ctx.beginPath();ctx.arc(cx2,cy,r,0,Math.PI*2);ctx.fill();
          ctx.beginPath();ctx.arc(cx2+r*0.7,cy+4,r*0.7,0,Math.PI*2);ctx.fill();
          ctx.beginPath();ctx.arc(cx2-r*0.5,cy+5,r*0.55,0,Math.PI*2);ctx.fill();
        });
        // far building silhouettes — warm brick
        ctx.fillStyle='rgba(160,90,50,0.22)';
        for(let i=0;i<8;i++){const bx=((i*148-scrollX*0.11)%(W+220)+W+220)%(W+220)-110;ctx.fillRect(bx,GROUND-58-(i%3)*28,55+(i%3)*18,58+(i%3)*28);}

      } else if (levelIdx === 1) {
        // DETROIT — deep night 2AM
        const sg = ctx.createLinearGradient(0,0,0,GROUND);
        sg.addColorStop(0,'#010306'); sg.addColorStop(0.75,'#050a10'); sg.addColorStop(1,'#080f18');
        ctx.fillStyle=sg; ctx.fillRect(0,0,W,GROUND);
        // stars
        for(let i=0;i<70;i++){
          const sx=((i*193+scrollX*0.06)%(W+50)+W+50)%(W+50), sy=(i*67)%(GROUND*0.5);
          const bright=Math.sin(frame*0.035+i*0.9)>0.35;
          ctx.fillStyle=bright?'rgba(180,210,255,0.85)':'rgba(120,160,210,0.25)';
          ctx.fillRect(sx,sy,bright?2:1,bright?2:1);
        }
        // moon
        ctx.fillStyle='#c8e0f4'; ctx.beginPath();ctx.arc(W-80,52,22,0,Math.PI*2);ctx.fill();
        ctx.fillStyle='#050a10'; ctx.beginPath();ctx.arc(W-69,46,19,0,Math.PI*2);ctx.fill();
        // city orange glow at horizon
        const glow=ctx.createLinearGradient(0,GROUND-70,0,GROUND);
        glow.addColorStop(0,'rgba(255,80,0,0)'); glow.addColorStop(1,'rgba(255,80,0,0.12)');
        ctx.fillStyle=glow; ctx.fillRect(0,GROUND-70,W,70);
        // dark building silhouettes
        ctx.fillStyle='rgba(3,6,14,0.88)';
        for(let i=0;i<12;i++){const bx=((i*112-scrollX*0.1)%(W+200)+W+200)%(W+200)-100;ctx.fillRect(bx,GROUND-80-(i%4)*40,48+(i%3)*22,80+(i%4)*40);}
        // neon window blobs on silhouettes
        for(let i=0;i<12;i++){const bx=((i*112-scrollX*0.1)%(W+200)+W+200)%(W+200)-100;
          for(let rr=0;rr<3;rr++)for(let cc=0;cc<3;cc++){
            if(Math.sin(frame*0.012+rr+cc+i*0.4)>0.2){
              ctx.fillStyle=(rr+cc)%2===0?'rgba(226,168,32,0.12)':'rgba(0,200,255,0.08)';
              ctx.fillRect(bx+6+cc*12,GROUND-70-(i%4)*40+rr*14,8,9);
            }
          }
        }

      } else {
        // FERNDALE — golden hour dusk
        const sg = ctx.createLinearGradient(0,0,0,GROUND);
        sg.addColorStop(0,'#0a0408'); sg.addColorStop(0.3,'#4a1808'); sg.addColorStop(0.7,'#c04010'); sg.addColorStop(1,'#e06820');
        ctx.fillStyle=sg; ctx.fillRect(0,0,W,GROUND);
        // large warm sun near horizon
        const sunGrad=ctx.createRadialGradient(100,GROUND-70,0,100,GROUND-70,60);
        sunGrad.addColorStop(0,'rgba(255,220,80,0.9)'); sunGrad.addColorStop(0.4,'rgba(255,140,30,0.4)'); sunGrad.addColorStop(1,'rgba(255,80,0,0)');
        ctx.fillStyle=sunGrad; ctx.fillRect(40,GROUND-130,120,130);
        ctx.fillStyle='#ffc840'; ctx.beginPath();ctx.arc(100,GROUND-70,28,0,Math.PI*2);ctx.fill();
        // silhouette buildings against orange sky
        ctx.fillStyle='rgba(12,4,18,0.82)';
        for(let i=0;i<10;i++){const bx=((i*128-scrollX*0.11)%(W+220)+W+220)%(W+220)-110;ctx.fillRect(bx,GROUND-68-(i%3)*32,52+(i%4)*18,68+(i%3)*32);}
        // warm window glows in silhouettes
        for(let i=0;i<10;i++){const bx=((i*128-scrollX*0.11)%(W+220)+W+220)%(W+220)-110;
          for(let rr=0;rr<2;rr++)for(let cc=0;cc<4;cc++){
            if(Math.sin(frame*0.02+rr*2+cc+i*0.5)>0){
              ctx.fillStyle='rgba(255,140,0,0.25)';
              ctx.fillRect(bx+5+cc*12,GROUND-58-(i%3)*32+rr*16,9,10);
            }
          }
        }
      }
    }

    function drawGround() {
      const c = cfg();
      ctx.fillStyle=c.groundTopColor; ctx.fillRect(0,GROUND,W,c.groundTopH);
      const gg=ctx.createLinearGradient(0,GROUND+c.groundTopH,0,H);
      gg.addColorStop(0,c.groundColor); gg.addColorStop(1,shade(c.groundColor,-25));
      ctx.fillStyle=gg; ctx.fillRect(0,GROUND+c.groundTopH,W,H-GROUND-c.groundTopH);

      if (levelIdx===0) {
        // grass tufts
        ctx.fillStyle='#4a8a30';
        for(let i=0;i<W;i+=10){const gx=((i-scrollX*0.5)%W+W)%W;ctx.fillRect(gx,GROUND,2,5+Math.round(Math.sin(gx*0.3))*2);}
        // sidewalk cracks
        ctx.strokeStyle='rgba(0,0,0,0.1)'; ctx.lineWidth=1;
        for(let i=0;i<W;i+=64){const lx=((i-scrollX*0.5)%W+W)%W;ctx.beginPath();ctx.moveTo(lx,GROUND+c.groundTopH);ctx.lineTo(lx,H);ctx.stroke();}
      } else if (levelIdx===1) {
        // metal grates
        ctx.strokeStyle='rgba(80,80,80,0.25)'; ctx.lineWidth=1;
        for(let i=0;i<W;i+=18){const lx=((i-scrollX*0.5)%W+W)%W;ctx.beginPath();ctx.moveTo(lx,GROUND);ctx.lineTo(lx,GROUND+c.groundTopH);ctx.stroke();}
        // road lane dashes
        ctx.fillStyle=c.laneColor;
        for(let i=0;i<W;i+=52){const dx=((i-scrollX*0.5)%52+52)%52;ctx.fillRect(dx,GROUND+(H-GROUND)/2,36,3);}
      } else {
        // terracotta tile grid
        ctx.strokeStyle='rgba(0,0,0,0.15)'; ctx.lineWidth=1;
        for(let i=0;i<W;i+=24){const lx=((i-scrollX*0.5)%W+W)%W;ctx.beginPath();ctx.moveTo(lx,GROUND);ctx.lineTo(lx,H);ctx.stroke();}
        for(let j=GROUND;j<H;j+=16){ctx.beginPath();ctx.moveTo(0,j);ctx.lineTo(W,j);ctx.stroke();}
        ctx.fillStyle=c.laneColor;
        for(let i=0;i<W;i+=52){const dx=((i-scrollX*0.5)%52+52)%52;ctx.fillRect(dx,GROUND+(H-GROUND)/2,36,3);}
      }
    }

    function shade(col, amt) {
      const n=parseInt(col.slice(1),16);
      const r=Math.min(255,Math.max(0,((n>>16)&0xff)+amt));
      const g=Math.min(255,Math.max(0,((n>>8)&0xff)+amt));
      const b=Math.min(255,Math.max(0,(n&0xff)+amt));
      return '#'+(r<<16|g<<8|b).toString(16).padStart(6,'0');
    }

    function drawBuilding(b) {
      const c = cfg(); const bx = b.x - scrollX;
      if (bx > W+220 || bx+b.w < -220) return;

      // Special buildings
      if (b.sp === 'grove') {
        ctx.fillStyle='#2c2824'; ctx.fillRect(bx,GROUND-135,92,135);
        ctx.fillStyle='rgba(160,210,255,0.22)'; ctx.fillRect(bx+8,GROUND-108,76,58);
        ctx.strokeStyle='#404040'; ctx.lineWidth=1;
        ctx.strokeRect(bx+8,GROUND-108,76,58);
        ctx.beginPath();ctx.moveTo(bx+46,GROUND-108);ctx.lineTo(bx+46,GROUND-50);ctx.stroke();
        ctx.beginPath();ctx.moveTo(bx+8,GROUND-79);ctx.lineTo(bx+84,GROUND-79);ctx.stroke();
        ctx.fillStyle='#8B1a18'; ctx.fillRect(bx+4,GROUND-133,84,22);
        ctx.fillStyle='#fff'; ctx.font='bold 7px "Press Start 2P"'; ctx.textAlign='center';
        ctx.fillText('GROVE',bx+46,GROUND-124); ctx.font='5px "Press Start 2P"'; ctx.fillText('STUDIOS',bx+46,GROUND-116);
        ctx.fillStyle='#ffe066';
        for(let i=0;i<6;i++){if(Math.sin(frame*0.04+i)>0){ctx.shadowBlur=4;ctx.shadowColor='#ffe066';}ctx.beginPath();ctx.arc(bx+8+i*14,GROUND-136+Math.sin(frame*0.04+i)*2,2,0,Math.PI*2);ctx.fill();ctx.shadowBlur=0;}
        return;
      }
      if (b.sp === 'hyperion') {
        ctx.fillStyle='#4a3520'; ctx.fillRect(bx,GROUND-115,82,115);
        ctx.fillStyle='rgba(255,200,100,0.3)'; ctx.fillRect(bx+6,GROUND-88,70,52);
        ctx.strokeStyle='#5a4030'; ctx.lineWidth=1; ctx.strokeRect(bx+6,GROUND-88,70,52);
        ctx.fillStyle='#1a5a4a'; ctx.fillRect(bx+4,GROUND-114,74,24);
        ctx.fillStyle='#fff'; ctx.font='bold 7px "Press Start 2P"'; ctx.textAlign='center';
        ctx.fillText('HYPERION',bx+41,GROUND-105); ctx.font='5px "Press Start 2P"'; ctx.fillText('COFFEE',bx+41,GROUND-97);
        return;
      }
      if (b.sp === 'ypsi_brick') {
        ctx.fillStyle='#b06040'; ctx.fillRect(bx,GROUND-b.h,b.w,b.h);
        ctx.fillStyle='rgba(0,0,0,0.08)';
        for(let row=0;row<Math.floor(b.h/8);row++) for(let cc=0;cc<Math.floor(b.w/16);cc++){if((row+cc)%2===0)ctx.fillRect(bx+cc*16+(row%2)*8,GROUND-b.h+row*8,14,6);}
        ctx.fillStyle=b.aw; ctx.fillRect(bx,GROUND-b.h*0.33,b.w,8);
        ctx.fillStyle='#ffe066';
        for(let i=0;i<5;i++){if(Math.sin(frame*0.04+i)>0){ctx.shadowBlur=3;ctx.shadowColor='#ffe066';}ctx.beginPath();ctx.arc(bx+6+i*(b.w-10)/4,GROUND-b.h*0.33-3+Math.sin(i)*2,1.5,0,Math.PI*2);ctx.fill();ctx.shadowBlur=0;}
        const wc=c.windowColor;
        for(let row=0;row<b.wr;row++) for(let cc=0;cc<b.wc;cc++){const wx=bx+6+cc*17,wy=GROUND-b.h+20+row*22;if(wx+10<bx+b.w-4){const lit=Math.sin(frame*0.015+row*1.8+cc*0.9+b.x*0.01)>0;ctx.fillStyle=lit?wc:'#1a0c0a';if(lit){ctx.shadowBlur=4;ctx.shadowColor=wc;}ctx.fillRect(wx,wy,10,10);ctx.shadowBlur=0;}}
        return;
      }
      if (b.sp === 'standrews') {
        ctx.fillStyle='#281810'; ctx.fillRect(bx,GROUND-168,102,168);
        ctx.fillStyle='rgba(0,0,0,0.1)'; for(let r=0;r<18;r++) for(let cc=0;cc<6;cc++){if((r+cc)%2===0)ctx.fillRect(bx+cc*16+(r%2)*8,GROUND-168+r*8,14,6);}
        ctx.fillStyle='#0a0a0a'; ctx.fillRect(bx+2,GROUND-120,98,26);
        ctx.fillStyle='#ffe066'; for(let i=0;i<10;i++){if(Math.floor(frame/8+i)%2===0){ctx.shadowBlur=4;ctx.shadowColor='#ffe066';ctx.beginPath();ctx.arc(bx+6+i*9,GROUND-109,3,0,Math.PI*2);ctx.fill();ctx.shadowBlur=0;}}
        ctx.fillStyle='#fff'; ctx.font='bold 7px "Press Start 2P"'; ctx.textAlign='center';
        ctx.fillText('ST. ANDREWS',bx+51,GROUND-128); ctx.font='5px "Press Start 2P"'; ctx.fillText('HALL',bx+51,GROUND-120);
        for(let i=0;i<4;i++){ctx.fillStyle=Math.sin(frame*0.02+i)>0?'#ffe066':'#0a0a0a';ctx.fillRect(bx+8+i*22,GROUND-162,15,22);}
        return;
      }
      if (b.sp === 'checker') {
        ctx.fillStyle='#0e0e0e'; ctx.fillRect(bx,GROUND-108,90,108);
        const sq=8; for(let r=0;r<3;r++) for(let cc=0;cc<11;cc++){ctx.fillStyle=(r+cc)%2===0?'#d8d8d8':'#0e0e0e';ctx.fillRect(bx+cc*sq,GROUND-108+r*sq,sq,sq);}
        ctx.fillStyle='#aa0000'; ctx.shadowBlur=8; ctx.shadowColor='#ff0000'; ctx.fillRect(bx+4,GROUND-78,82,20); ctx.shadowBlur=0;
        ctx.fillStyle='#fff'; ctx.font='bold 6px "Press Start 2P"'; ctx.textAlign='center'; ctx.fillText('CHECKER BAR',bx+45,GROUND-65);
        for(let r=0;r<2;r++) for(let cc=0;cc<5;cc++){ctx.fillStyle=Math.sin(frame*0.03+r+cc)>0?'rgba(226,168,32,0.65)':'rgba(0,120,210,0.45)';ctx.fillRect(bx+6+cc*16,GROUND-58+r*18,10,10);}
        return;
      }
      if (b.sp === 'rencen') {
        ctx.fillStyle='#081420'; ctx.fillRect(bx+20,GROUND-228,32,228);
        ctx.fillStyle='rgba(30,80,130,0.18)'; ctx.fillRect(bx+22,GROUND-228,18,228);
        for(let i=0;i<4;i++){const ox=[0,54,0,54][i];ctx.fillStyle='#060e18';ctx.fillRect(bx+ox,GROUND-148,22,148);}
        for(let row=0;row<11;row++) for(let cc=0;cc<2;cc++){const lit=Math.sin(frame*0.012+row+cc)>0;ctx.fillStyle=lit?GLD:'rgba(0,18,36,0.8)';if(lit){ctx.shadowBlur=4;ctx.shadowColor=GLD;}ctx.fillRect(bx+26+cc*12,GROUND-220+row*18,8,12);ctx.shadowBlur=0;}
        for(let row=0;row<5;row++) for(let cc=0;cc<1;cc++){const lit=Math.sin(frame*0.018+row)>0;ctx.fillStyle=lit?'rgba(0,200,255,0.55)':'rgba(0,40,60,0.3)';ctx.fillRect(bx+4+cc*50,GROUND-140+row*24,14,16);ctx.fillRect(bx+54+cc*50,GROUND-140+row*24,14,16);}
        if(Math.floor(frame/24)%2===0){ctx.fillStyle='#ff4444';ctx.shadowBlur=8;ctx.shadowColor='#ff0000';ctx.beginPath();ctx.arc(bx+36,GROUND-232,4,0,Math.PI*2);ctx.fill();ctx.shadowBlur=0;}
        ctx.fillStyle=GLD; ctx.font='6px "Press Start 2P"'; ctx.textAlign='center'; ctx.fillText('REN CEN',bx+36,GROUND-232);
        return;
      }
      if (b.sp === 'loving_touch') {
        // Ferndale venue — purple/teal
        ctx.fillStyle='#2a1040'; ctx.fillRect(bx,GROUND-130,85,130);
        ctx.fillStyle='rgba(160,60,220,0.12)'; ctx.fillRect(bx+4,GROUND-128,77,82);
        ctx.strokeStyle='#6a20a0'; ctx.lineWidth=2; ctx.strokeRect(bx,GROUND-130,85,130);
        ctx.fillStyle='#4a0080'; ctx.fillRect(bx+4,GROUND-128,77,22);
        ctx.fillStyle='#d080ff'; ctx.font='bold 7px "Press Start 2P"'; ctx.textAlign='center';
        ctx.fillText('LOVING',bx+42,GROUND-120); ctx.font='5px "Press Start 2P"'; ctx.fillText('TOUCH',bx+42,GROUND-112);
        // neon sign glow
        ctx.shadowBlur=12; ctx.shadowColor='#c060ff';
        ctx.strokeStyle='#c060ff'; ctx.lineWidth=2;
        ctx.beginPath();ctx.arc(bx+42,GROUND-95,18,0,Math.PI*2);ctx.stroke();
        ctx.shadowBlur=0;
        // windows with warm glow
        for(let r=0;r<2;r++) for(let cc=0;cc<3;cc++){ctx.fillStyle=Math.sin(frame*0.02+r+cc)>0?'rgba(255,160,20,0.6)':'rgba(100,20,160,0.3)';ctx.fillRect(bx+8+cc*22,GROUND-68+r*20,14,14);}
        return;
      }
      if (b.sp === 'ferndale_bar') {
        // hip Ferndale bar — teal/pink
        ctx.fillStyle='#0a2830'; ctx.fillRect(bx,GROUND-b.h,b.w,b.h);
        ctx.fillStyle=b.aw; ctx.fillRect(bx,GROUND-b.h*0.35,b.w,9);
        // checkerboard awning
        ctx.fillStyle='#fff';
        for(let i=0;i<Math.floor(b.w/8);i++){if(i%2===0)ctx.fillRect(bx+i*8,GROUND-b.h*0.35,8,9);}
        ctx.fillStyle='rgba(0,220,200,0.15)'; ctx.fillRect(bx+4,GROUND-b.h*0.35+9,b.w-8,b.h*0.35-9-10);
        // neon windows
        for(let row=0;row<b.wr;row++) for(let cc=0;cc<b.wc;cc++){const wx=bx+6+cc*17,wy=GROUND-b.h+20+row*22;if(wx+10<bx+b.w-4){const col=((row+cc)%2===0)?'rgba(0,220,180,0.7)':'rgba(255,60,120,0.6)';ctx.fillStyle=Math.sin(frame*0.018+row+cc+b.x*0.01)>0?col:'rgba(0,20,30,0.8)';ctx.fillRect(wx,wy,10,10);}}
        return;
      }

      // Generic building — different per level
      ctx.fillStyle = b.color; ctx.fillRect(bx,GROUND-b.h,b.w,b.h);

      if (levelIdx === 0) {
        // warm brick texture
        ctx.fillStyle='rgba(0,0,0,0.07)';
        for(let row=0;row<Math.floor(b.h/8);row++) for(let cc=0;cc<Math.floor(b.w/16);cc++){if((row+cc)%2===0)ctx.fillRect(bx+cc*16+(row%2)*8,GROUND-b.h+row*8,14,6);}
        if(b.w>55){ctx.fillStyle=b.aw;ctx.fillRect(bx,GROUND-b.h*0.33,b.w,8);}
        ctx.fillStyle=shade(b.color,-30); ctx.fillRect(bx,GROUND-b.h,b.w,6);
        const wc=c.windowColor;
        for(let row=0;row<b.wr;row++) for(let cc=0;cc<b.wc;cc++){const wx=bx+6+cc*17,wy=GROUND-b.h+20+row*22;if(wx+10<bx+b.w-4){const lit=Math.sin(frame*0.015+row*1.8+cc*0.9+b.x*0.01)>0;ctx.fillStyle=lit?wc:'#200808';if(lit){ctx.shadowBlur=4;ctx.shadowColor=wc;}ctx.fillRect(wx,wy,10,10);ctx.shadowBlur=0;}}

      } else if (levelIdx === 1) {
        // dark glass office
        ctx.fillStyle='rgba(20,50,100,0.2)'; ctx.fillRect(bx+2,GROUND-b.h+2,b.w-4,b.h-4);
        ctx.strokeStyle='rgba(20,40,70,0.4)'; ctx.lineWidth=1;
        for(let i=1;i<Math.floor(b.w/12);i++){ctx.beginPath();ctx.moveTo(bx+i*12,GROUND-b.h);ctx.lineTo(bx+i*12,GROUND);ctx.stroke();}
        for(let i=1;i<Math.floor(b.h/18);i++){ctx.beginPath();ctx.moveTo(bx,GROUND-b.h+i*18);ctx.lineTo(bx+b.w,GROUND-b.h+i*18);ctx.stroke();}
        const wc1=c.windowColor, wc2=c.windowColor2||'#00d4ff';
        for(let row=0;row<b.wr;row++) for(let cc=0;cc<b.wc;cc++){const wx=bx+5+cc*15,wy=GROUND-b.h+14+row*20;if(wx+10<bx+b.w-3){const lit=Math.sin(frame*0.012+row*1.5+cc*0.8+b.x*0.01)>0;const useBlue=(row+cc)%3===0;ctx.fillStyle=lit?(useBlue?wc2:wc1):'rgba(2,6,14,0.9)';if(lit){ctx.shadowBlur=5;ctx.shadowColor=useBlue?wc2:wc1;}ctx.fillRect(wx,wy,10,12);ctx.shadowBlur=0;}}
        if(Math.floor(frame/24)%2===0){ctx.fillStyle='#ff4040';ctx.shadowBlur=8;ctx.shadowColor='#ff0000';ctx.beginPath();ctx.arc(bx+b.w/2,GROUND-b.h-4,3,0,Math.PI*2);ctx.fill();ctx.shadowBlur=0;}

      } else {
        // Ferndale — colorful painted facades
        ctx.fillStyle='rgba(255,255,255,0.04)'; ctx.fillRect(bx+2,GROUND-b.h+2,b.w-4,b.h-4);
        ctx.fillStyle=b.aw; ctx.fillRect(bx,GROUND-b.h,b.w,7);
        if(b.w>60){ctx.fillStyle=shade(b.aw,20);ctx.fillRect(bx,GROUND-b.h*0.35,b.w,10);}
        const wc=c.windowColor, wc2=c.windowColor2||'#ff3860';
        for(let row=0;row<b.wr;row++) for(let cc=0;cc<b.wc;cc++){const wx=bx+6+cc*17,wy=GROUND-b.h+18+row*22;if(wx+10<bx+b.w-4){const lit=Math.sin(frame*0.015+row+cc+b.x*0.01)>0;const warm=(row+cc)%2===0;ctx.fillStyle=lit?(warm?wc:wc2):'#0a0410';if(lit){ctx.shadowBlur=4;ctx.shadowColor=warm?wc:wc2;}ctx.fillRect(wx,wy,10,10);ctx.shadowBlur=0;}}
      }
    }

    function drawHUD() {
      const c = cfg();
      ctx.fillStyle='rgba(0,0,0,0.84)'; ctx.fillRect(0,0,W,56);
      ctx.fillStyle=GLD; ctx.font='10px "Press Start 2P"'; ctx.textAlign='left'; ctx.fillText('SCORE:'+sc,12,17);
      if(highSc>0){ctx.fillStyle='#c8b830';ctx.font='7px "Press Start 2P"';ctx.fillText('BEST:'+highSc,12,31);}
      // level tag
      ctx.fillStyle='rgba(226,168,32,0.2)'; ctx.fillRect(W/2-90,4,180,22);
      ctx.fillStyle=GLD; ctx.font='8px "Press Start 2P"'; ctx.textAlign='center';
      ctx.fillText(c.name+' · '+c.timeLabel,W/2,18);
      // HP bar
      const hpW=160;
      ctx.fillStyle='#1a1a1a'; ctx.fillRect(W/2-hpW/2-2,28,hpW+4,16);
      const hpPct = pl.hp/MAX_HP;
      ctx.fillStyle=hpPct>0.5?'#2ecc71':hpPct>0.25?'#f39c12':'#e74c3c';
      ctx.fillRect(W/2-hpW/2,30,Math.max(0,hpW*hpPct),12);
      ctx.strokeStyle=GLD; ctx.lineWidth=1; ctx.strokeRect(W/2-hpW/2-2,28,hpW+4,16);
      ctx.fillStyle='rgba(255,255,255,0.7)'; ctx.font='7px "Press Start 2P"'; ctx.textAlign='center'; ctx.fillText('HP',W/2,41);
      // lives
      ctx.textAlign='left'; ctx.font='13px serif';
      for(let i=0;i<MAX_LIVES;i++){ctx.fillStyle=i<lives?'#e74c3c':'rgba(255,255,255,0.15)';ctx.fillText('❤',W/2+100+i*20,44);}
      // pizza counter / boss bar
      if (!boss||boss.dead) {
        const lbl=c.collectible==='taco'?'🌮':'🍕';
        ctx.fillStyle='#c8b830'; ctx.textAlign='right'; ctx.font='9px "Press Start 2P"';
        ctx.fillText(lbl+' '+pc+'/'+c.collectTarget,W-12,17);
        for(let i=0;i<c.collectTarget;i++){ctx.fillStyle=i<pc?'#FF8C00':'#2a2a2a';ctx.fillRect(W-12-c.collectTarget*10+i*10,26,8,10);}
      } else {
        const bhpW=200; const bpct=bossHp/BOSS_MAX_HP;
        ctx.fillStyle='#1a1a1a'; ctx.fillRect(W-bhpW-14,8,bhpW+4,16);
        ctx.fillStyle=bpct>0.5?'#2ecc71':bpct>0.25?'#f39c12':'#e74c3c';
        ctx.fillRect(W-bhpW-12,10,Math.max(0,bhpW*bpct),12);
        ctx.strokeStyle=GLD; ctx.lineWidth=1; ctx.strokeRect(W-bhpW-14,8,bhpW+4,16);
        const bnames={landlord:'LANDLORD',ratking:'RAT KING',recordexec:'RECORD EXEC'};
        ctx.fillStyle='#fff'; ctx.font='7px "Press Start 2P"'; ctx.textAlign='right';
        ctx.fillText(boss?bnames[boss.type]:'BOSS',W-14,36);
      }
    }

    function drawScreen(title, lines, blink, blinkColor='#4A7A30') {
      ctx.fillStyle='rgba(0,0,0,0.92)'; ctx.fillRect(0,0,W,H);
      ctx.strokeStyle=GLD; ctx.lineWidth=3; ctx.strokeRect(30,30,W-60,H-60);
      ctx.strokeStyle='rgba(226,168,32,0.2)'; ctx.lineWidth=1; ctx.strokeRect(36,36,W-72,H-72);
      ctx.fillStyle=GLD; ctx.font='22px "Press Start 2P"'; ctx.textAlign='center';
      ctx.fillText(title,W/2,H/2-lines.length*22-20);
      lines.forEach((l,i)=>{
        ctx.fillStyle=l.col||'#F5F0DC'; ctx.font=`${l.size||9}px "Press Start 2P"`;
        ctx.fillText(l.text,W/2,H/2-lines.length*22+20+i*26+(l.size||9)*1.2);
      });
      if(Math.floor(frame/26)%2===0){ctx.fillStyle=blinkColor;ctx.font='9px "Press Start 2P"';ctx.fillText(blink,W/2,H/2+lines.length*16+55);}
    }

    function drawTitle() {
      const c = cfg();
      // animated pixel bg matching level 1 sky
      const sg=ctx.createLinearGradient(0,0,0,H);sg.addColorStop(0,'#1C3D12');sg.addColorStop(1,'#0a1a08');
      ctx.fillStyle=sg; ctx.fillRect(0,0,W,H);
      for(let i=0;i<40;i++){const sx=(i*131+frame*0.3)%W,sy=(i*71)%(H*0.55);ctx.fillStyle=Math.sin(frame*0.04+i)>0.4?GLD:'rgba(226,168,32,0.08)';ctx.fillRect(sx,sy,Math.sin(frame*0.06+i)>0.6?3:1,Math.sin(frame*0.06+i)>0.6?3:1);}
      drawScreen('DETROIT PIZZA QUEST',[
        {text:'3 LEVELS · 3 BOSSES', col:'#c8b830'},
        {text:'YPSILANTI  ·  DETROIT  ·  FERNDALE', col:'rgba(200,184,48,0.6)', size:7},
        {text:'← → MOVE   SPACE/A JUMP', col:'#F5F0DC', size:8},
        {text:'STOMP ENEMIES · GRAB ❤ HEARTS', col:'#F5F0DC', size:8},
        {text:'16 SLICES → BOSS FIGHT · 3 LIVES', col:'rgba(245,240,220,0.6)', size:7},
      ],'[ PRESS ENTER TO CHOOSE PLAYER ]');
      if(highSc>0){ctx.fillStyle='#c8b830';ctx.font='8px "Press Start 2P"';ctx.textAlign='center';ctx.fillText('BEST: '+highSc,W/2,H-48);}
    }

    function drawCharSelect() {
      ctx.fillStyle=GRN; ctx.fillRect(0,0,W,H);
      for(let i=0;i<40;i++){const sx=(i*137)%W,sy=(i*71)%(H*0.6);ctx.fillStyle=Math.sin(frame*0.04+i)>0.4?GLD:'rgba(226,168,32,0.07)';ctx.fillRect(sx,sy,2,2);}
      ctx.fillStyle=GLD; ctx.font='18px "Press Start 2P"'; ctx.textAlign='center'; ctx.fillText('CHOOSE YOUR PLAYER',W/2,52);
      const chars=[{name:'STEVE',role:'Bass & Vocals'},{name:'MIKE',role:'Drums'},{name:'KYLE',role:'Guitar & Vocals'}];
      const cardW=210,cardH=380,gap=18,sx=(W-(cardW*3+gap*2))/2;
      chars.forEach((ch,i)=>{
        const cx=sx+i*(cardW+gap),cy=72,sel=selectedChar===i;
        ctx.fillStyle=sel?'rgba(226,168,32,0.1)':'rgba(0,0,0,0.5)'; ctx.fillRect(cx,cy,cardW,cardH);
        ctx.strokeStyle=sel?GLD:'rgba(226,168,32,0.2)'; ctx.lineWidth=sel?3:1; ctx.strokeRect(cx,cy,cardW,cardH);
        if(sel){ctx.shadowBlur=12;ctx.shadowColor=GLD;ctx.strokeRect(cx,cy,cardW,cardH);ctx.shadowBlur=0;}
        ctx.save();ctx.translate(cx+cardW/2-44,cy+40);ctx.scale(4,4);
        drawCharSprite(ctx,i,0,0,22,{gold:GLD});
        ctx.restore();
        ctx.fillStyle=sel?GLD:'#F5F0DC'; ctx.font=`${sel?12:11}px "Press Start 2P"`; ctx.textAlign='center'; ctx.fillText(ch.name,cx+cardW/2,cy+cardH-58);
        ctx.fillStyle='#c8b830'; ctx.font='8px "Press Start 2P"'; ctx.fillText(ch.role,cx+cardW/2,cy+cardH-36);
        if(sel&&Math.floor(frame/20)%2===0){ctx.fillStyle=GLD;ctx.font='16px serif';ctx.fillText('▼',cx+cardW/2,cy-8);}
      });
      ctx.fillStyle='#F5F0DC'; ctx.font='10px "Press Start 2P"'; ctx.textAlign='center';
      ctx.fillText('← → SELECT     ENTER CONFIRM',W/2,H-20);
    }

    function drawTransition() {
      const c=cfg();
      ctx.fillStyle=c.daytime?'#3a7ad4':c.skyTop||'#020306'; ctx.fillRect(0,0,W,H);
      ctx.fillStyle='rgba(0,0,0,0.88)'; ctx.fillRect(W/2-270,H/2-130,540,260);
      ctx.strokeStyle=GLD; ctx.lineWidth=3; ctx.strokeRect(W/2-270,H/2-130,540,260);
      ctx.fillStyle=GLD; ctx.font='12px "Press Start 2P"'; ctx.textAlign='center';
      ctx.fillText('LEVEL '+cfg().id,W/2,H/2-90);
      ctx.fillStyle='#F5F0DC'; ctx.font='20px "Press Start 2P"'; ctx.fillText(c.name,W/2,H/2-52);
      ctx.fillStyle='#c8b830'; ctx.font='9px "Press Start 2P"'; ctx.fillText(c.subtitle,W/2,H/2-24);
      ctx.fillStyle='rgba(245,240,220,0.6)'; ctx.font='7px "Press Start 2P"';
      ctx.fillText('COLLECT 16 '+(c.collectible==='taco'?'TACOS':'SLICES')+' THEN FIGHT THE BOSS',W/2,H/2+16);
      if(Math.floor(frame/20)%2===0){ctx.fillStyle='#4A7A30';ctx.font='10px "Press Start 2P"';ctx.fillText('GET READY...',W/2,H/2+60);}
    }

    function drawGameOver() {
      ctx.fillStyle=GRN; ctx.fillRect(0,0,W,H);
      drawScreen('GAME OVER',[
        {text:'SCORE: '+sc, col:GLD, size:13},
        sc>=highSc&&sc>0?{text:'✨ NEW HIGH SCORE ✨', col:'#c8b830'}:{text:'', col:'transparent'},
      ],'[ PRESS ENTER TO TRY AGAIN ]','#e74c3c');
    }

    function drawWin() {
      ctx.fillStyle=GRN; ctx.fillRect(0,0,W,H);
      for(let i=0;i<28;i++){ctx.fillStyle=[GLD,'#e74c3c','#F5F0DC','#4A7A30'][i%4];ctx.fillRect((i*137+frame*2.5)%W,(i*89+frame*1.5)%(H-60),8,8);}
      drawScreen('🍕 DETROIT CONQUERED',[
        {text:'ALL 3 LEVELS BEATEN!', col:'#c8b830'},
        {text:'SCORE: '+sc, col:GLD, size:13},
        sc>=highSc&&sc>0?{text:'NEW HIGH SCORE!', col:'#c8b830'}:{text:'THE BAND FEASTS TONIGHT', col:'rgba(245,240,220,0.6)', size:7},
      ],'[ PRESS ENTER TO PLAY AGAIN ]');
    }

    let raf;
    function loop() {
      frame++;

      if (gState==='transition') { transitionTimer--; drawTransition(); if(transitionTimer<=0){gState='playing';sync();} raf=requestAnimationFrame(loop); return; }

      if (gState==='playing') {
        if (keys['ArrowLeft']||keys['KeyA'])  { pl.vx=-MOVE_SPEED; pl.face=-1; }
        else if (keys['ArrowRight']||keys['KeyD']) { pl.vx=MOVE_SPEED; pl.face=1; }
        else pl.vx *= 0.55;

        if ((keys['ArrowUp']||keys['Space']||keys['KeyW']) && !jumpPressed) { jumpPressed=true; jump(); }
        if (!keys['ArrowUp']&&!keys['Space']&&!keys['KeyW']) jumpPressed=false;

        if (!pl.dying) {
          pl.vy+=GRAVITY; pl.x+=pl.vx; pl.y+=pl.vy;
          if (pl.y+PH>=GROUND) { pl.y=GROUND-PH; pl.vy=0; pl.onGround=true; } else pl.onGround=false;
          if (pl.x<20) pl.x=20; if (pl.x>W-PW-20) pl.x=W-PW-20;
          if (pl.inv>0) pl.inv--;
          if (pl.x>W*0.42) { const s=pl.x-W*0.42; scrollX+=s; pl.x=W*0.42; }
        } else {
          pl.vy+=GRAVITY*0.7; pl.y+=pl.vy; pl.x+=pl.vx*0.3;
          pl.dyingTimer--;
          if (pl.dyingTimer<=0) { lives--; if(lives<=0){if(sc>highSc)highSc=sc;music.pause();gState='gameover';sync();}else{respawn();} }
        }

        const c=cfg();
        if (!boss||boss.dead) {
          spT++; if(spT>=c.spawnRate){spawnEnemy();spT=0;}
          piT++; if(piT>=72){spawnCollectible();piT=0;}
          const hpRate=pl.hp<40?90:200; hpT++; if(hpT>=hpRate){spawnHealthItem();hpT=0;}
        }
        if (pc>=c.collectTarget&&!boss) triggerBoss();

        // boss
        if (boss&&!boss.dead) {
          boss.x+=boss.vx; if(boss.inv>0)boss.inv--; if(boss.hitFlash>0)boss.hitFlash--;
          const bOx=boss.x-scrollX;
          if(bOx<80)boss.vx=Math.abs(boss.vx); if(bOx>W-boss.w-60)boss.vx=-Math.abs(boss.vx);
          const pb=pl.y+PH, bOverX=pl.x<bOx+boss.w&&pl.x+PW>bOx;
          const stomp=pl.vy>0&&pb>=boss.y&&pb<=boss.y+20&&bOverX;
          if(stomp&&boss.inv===0&&!pl.dying){bossHp=Math.max(0,bossHp-40);boss.inv=50;boss.hitFlash=20;pl.vy=-12;sc+=400;addParts(bOx+boss.w/2,boss.y,GLD,18);if(bossHp<=0){boss.dead=true;boss.deadTimer=90;sc+=3000;addParts(bOx+boss.w/2,boss.y+boss.h/2,'#FFD700',50);}sync();}
          if(!pl.dying&&pl.inv===0&&bOverX&&pl.y<boss.y+boss.h&&pl.y+PH>boss.y&&!stomp){pl.hp=Math.max(0,pl.hp-15);pl.inv=80;addParts(pl.x+PW/2,pl.y+PH/2,'#e74c3c',8);if(pl.hp<=0)playerDie();sync();}
        }
        if(boss&&boss.dead){boss.deadTimer--;if(boss.deadTimer<=0){if(levelIdx>=LEVELS.length-1){if(sc>highSc)highSc=sc;music.pause();gState='win';sync();}else{levelIdx++;pc=0;pl.hp=MAX_HP;resetLevel();transitionTimer=220;gState='transition';sync();}}}

        obs=obs.filter(o=>{
          if(o.hitFlash>0)o.hitFlash--;
          if(o.type==='cone'){const ox=o.x-scrollX;if(ox<-120)return false;if(o.dead){o.deadTimer--;return o.deadTimer>0;}if(!pl.dying&&pl.inv===0&&ox+o.w>pl.x&&ox<pl.x+PW&&o.y+o.h>pl.y&&o.y<pl.y+PH){pl.hp=Math.max(0,pl.hp-15);pl.inv=80;addParts(pl.x+PW/2,pl.y+PH/2,'#e74c3c',6);if(pl.hp<=0)playerDie();sync();}return true;}
          o.x+=o.vx; const ox=o.x-scrollX; if(ox<-120)return false; if(o.dead){o.deadTimer--;return o.deadTimer>0;} o.at++;
          if(!pl.dying&&!pl.onGround&&pl.vy>0){const pb=pl.y+PH;if(ox+o.w>pl.x&&ox<pl.x+PW&&pb>=o.y&&pb<=o.y+14){o.hp=(o.hp||1)-1;o.hitFlash=12;pl.vy=-10;sc+=150;addParts(ox+o.w/2,o.y,GLD,8);if(o.hp<=0){o.dead=true;o.deadTimer=28;sc+=50;}sync();return true;}}
          if(!pl.dying&&pl.inv===0&&ox+o.w>pl.x&&ox<pl.x+PW&&o.y+o.h>pl.y&&o.y<pl.y+PH){pl.hp=Math.max(0,pl.hp-12);pl.inv=80;addParts(pl.x+PW/2,pl.y+PH/2,'#e74c3c',6);if(pl.hp<=0)playerDie();sync();}
          return true;
        });

        pizzas=pizzas.filter(pz=>{if(pz.collected)return false;const ox=pz.x-scrollX;if(ox<-80)return false;const bob=Math.sin(frame*0.08+pz.bob)*5;if(!pl.dying&&pl.x<ox+28&&pl.x+PW>ox&&pl.y<pz.y+bob+28&&pl.y+PH>pz.y+bob){pz.collected=true;sc+=100;pc++;addParts(ox+14,pz.y+14,GLD,12);sync();return false;}return true;});
        healthItems=healthItems.filter(h=>{if(h.collected)return false;const ox=h.x-scrollX;if(ox<-80)return false;const bob=Math.sin(frame*0.1+h.bob)*4;if(!pl.dying&&pl.x<ox+16&&pl.x+PW>ox&&pl.y<h.y+bob+16&&pl.y+PH>h.y+bob){h.collected=true;pl.hp=Math.min(MAX_HP,pl.hp+HP_HEAL);addParts(ox+8,h.y,'#e74c3c',14);sync();return false;}return true;});
        parts=parts.filter(p=>{p.x+=p.vx;p.y+=p.vy;p.vy+=0.2;p.life--;return p.life>0;});
        if(!blds.length||blds[blds.length-1].x-scrollX<W+300)blds.push(mkBld((blds[blds.length-1]?.x||200)+90+Math.random()*140));
        blds=blds.filter(b=>b.x-scrollX>-300);
      }

      if(gState==='title'){drawTitle();raf=requestAnimationFrame(loop);return;}
      if(gState==='charselect'){drawCharSelect();raf=requestAnimationFrame(loop);return;}
      if(gState==='win'){drawWin();raf=requestAnimationFrame(loop);return;}
      if(gState==='gameover'){drawGameOver();raf=requestAnimationFrame(loop);return;}

      // World
      drawBg(); blds.forEach(b=>drawBuilding(b)); drawGround();
      healthItems.forEach(h=>{if(!h.collected){const ox=h.x-scrollX;const bob=Math.sin(frame*0.1+h.bob)*4;drawHealthItem(ctx,ox,h.y+bob);}});
      pizzas.forEach(pz=>{const ox=pz.x-scrollX;const bob=Math.sin(frame*0.08+pz.bob)*5;if(pz.type==='taco')drawTaco(ctx,ox,pz.y+bob,{gold:GLD});else drawPizzaSlice(ctx,ox,pz.y+bob,{gold:GLD});});
      obs.forEach(o=>{const ox=o.x-scrollX;if(o.dead){ctx.globalAlpha=Math.max(0,o.deadTimer/28);ctx.font='18px serif';ctx.textAlign='center';ctx.fillText('💀',ox+o.w/2,o.y+o.h-2);ctx.globalAlpha=1;return;}if(o.hitFlash>0&&Math.floor(o.hitFlash/3)%2===0){ctx.globalAlpha=0.45;ctx.fillStyle='#fff';ctx.fillRect(ox,o.y,o.w,o.h);ctx.globalAlpha=1;}drawEnemySprite(ctx,o,scrollX,{gold:GLD});});
      if(boss&&(!boss.dead||boss.deadTimer>0)){const bOx=boss.x-scrollX;if(boss.hitFlash>0&&Math.floor(boss.hitFlash/3)%2===0){ctx.globalAlpha=0.4;ctx.fillStyle='#fff';ctx.fillRect(bOx,boss.y,boss.w,boss.h);ctx.globalAlpha=1;}drawBossSprite(ctx,boss,scrollX,bossHp,BOSS_MAX_HP,{gold:GLD});}
      parts.forEach(p=>{ctx.globalAlpha=p.life/p.ml;ctx.fillStyle=p.col;ctx.fillRect(p.x-p.sz/2,p.y-p.sz/2,p.sz,p.sz);});ctx.globalAlpha=1;

      // Player
      const showPl=!pl.dying||(Math.floor(pl.dyingTimer/6)%2===0);
      if(showPl&&!(pl.inv>0&&Math.floor(pl.inv/5)%2===0)){
        ctx.save();
        if(pl.face===-1){ctx.translate(pl.x+PW,0);ctx.scale(-1,1);ctx.translate(-pl.x,0);}
        // squash/stretch
        if(!pl.onGround&&pl.vy<-2){ctx.translate(pl.x+PW/2,pl.y+PH);ctx.scale(0.85,1.2);ctx.translate(-pl.x-PW/2,-pl.y-PH);}
        else if(pl.onGround&&Math.abs(pl.vy)>3){ctx.translate(pl.x+PW/2,pl.y+PH);ctx.scale(1.15,0.88);ctx.translate(-pl.x-PW/2,-pl.y-PH);}
        drawCharSprite(ctx,charIdx,pl.x,pl.y,PW,{gold:GLD});
        ctx.restore();
      }

      drawHUD();
      raf=requestAnimationFrame(loop);
    }

    const onDown=e=>{
      keys[e.code]=true;
      if(['Space','ArrowLeft','ArrowRight','ArrowUp'].includes(e.code))e.preventDefault();
      if(e.code==='Space'&&gState==='playing'){jump();return;}
      if(gState==='charselect'){if(e.code==='ArrowLeft'){selectedChar=(selectedChar+2)%3;sync();return;}if(e.code==='ArrowRight'){selectedChar=(selectedChar+1)%3;sync();return;}}
      if(e.code==='Enter'){if(gState==='title'){gState='charselect';sync();}else if(gState==='charselect'){charIdx=selectedChar;startGame();}else if(gState==='gameover'){startGame();}else if(gState==='win'){gState='charselect';sync();}}
    };
    const onUp=e=>{keys[e.code]=false;};
    window.addEventListener('keydown',onDown); window.addEventListener('keyup',onUp);
    loop();
    gameRef.current={jump,startGame,toCharSelect:()=>{gState='charselect';sync();},setChar:(i)=>{selectedChar=i;sync();},confirmChar:()=>{charIdx=selectedChar;startGame();},keys,getState:()=>gState,getSelectedChar:()=>selectedChar};
    return()=>{cancelAnimationFrame(raf);window.removeEventListener('keydown',onDown);window.removeEventListener('keyup',onUp);music.pause();music.currentTime=0;};
  },[]);

  const enterFS=()=>{document.documentElement.requestFullscreen().catch(()=>{});setIsFullscreen(true);};
  const exitFS=()=>{if(document.fullscreenElement)document.exitFullscreen().catch(()=>{});setIsFullscreen(false);};
  useEffect(()=>{const fn=()=>{if(!document.fullscreenElement)setIsFullscreen(false);};document.addEventListener('fullscreenchange',fn);return()=>document.removeEventListener('fullscreenchange',fn);},[]);

  const mb=(key,down)=>{
    const g=gameRef.current;if(!g)return;
    const st=g.getState?g.getState():uiState.state;
    if(key==='jump'){if(down&&st==='playing')g.jump();}
    else if(key==='start'){if(st==='title')g.toCharSelect?.();else if(st==='charselect')g.confirmChar?.();else if(st==='gameover')g.startGame?.();else if(st==='win')g.toCharSelect?.();}
    else if(key==='ArrowLeft'&&down){if(st==='charselect')g.setChar?.(((g.getSelectedChar?.()??0)+2)%3);else g.keys['ArrowLeft']=true;}
    else if(key==='ArrowRight'&&down){if(st==='charselect')g.setChar?.(((g.getSelectedChar?.()??0)+1)%3);else g.keys['ArrowRight']=true;}
    else{g.keys[key]=down;}
  };

  const holdBtn=(lbl,key,bg,fg,w,h)=>(
    <button style={{fontFamily:'var(--font-pixel)',fontSize:'0.7rem',background:bg,color:fg||'#fff',border:'none',borderRadius:6,cursor:'pointer',boxShadow:'0 5px 0 rgba(0,0,0,0.5)',userSelect:'none',WebkitUserSelect:'none',WebkitTouchCallout:'none',touchAction:'none',width:w||82,height:h||82,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}
      onTouchStart={e=>{e.preventDefault();mb(key,true);}} onTouchEnd={e=>{e.preventDefault();mb(key,false);}} onTouchCancel={e=>{e.preventDefault();mb(key,false);}}
      onContextMenu={e=>e.preventDefault()} onMouseDown={()=>mb(key,true)} onMouseUp={()=>mb(key,false)} onMouseLeave={()=>mb(key,false)}>{lbl}</button>
  );
  const tapBtn=(lbl,key,bg,fg,w,h)=>(
    <button style={{fontFamily:'var(--font-pixel)',fontSize:'0.75rem',background:bg,color:fg||'#fff',border:'none',borderRadius:50,cursor:'pointer',boxShadow:'0 5px 0 rgba(0,0,0,0.5)',userSelect:'none',WebkitUserSelect:'none',WebkitTouchCallout:'none',touchAction:'none',width:w||96,height:h||96,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}
      onTouchStart={e=>{e.preventDefault();mb(key,true);}} onTouchEnd={e=>e.preventDefault()} onContextMenu={e=>e.preventDefault()} onMouseDown={()=>mb(key,true)}>{lbl}</button>
  );

  const controls=(
    <div style={{background:GRN,borderTop:`2px solid ${GLD}`,padding:'10px 16px',paddingBottom:'max(10px,env(safe-area-inset-bottom))'}}>
      <div style={{display:'flex',justifyContent:'center',marginBottom:8}}>
        <button style={{fontFamily:'var(--font-pixel)',fontSize:'0.35rem',background:isFullscreen?'#e74c3c':GRN2,color:'#F5F0DC',border:`1px solid ${GLD}`,borderRadius:4,cursor:'pointer',padding:'5px 14px',boxShadow:'2px 2px 0 rgba(0,0,0,0.5)'}}
          onMouseDown={isFullscreen?exitFS:enterFS} onTouchStart={e=>{e.preventDefault();isFullscreen?exitFS():enterFS();}}>
          {isFullscreen?'✕ EXIT FULLSCREEN':'⛶ FULLSCREEN'}
        </button>
      </div>
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',gap:8}}>
        <div style={{display:'flex',gap:8}}>
          {holdBtn('◀','ArrowLeft',GLD,GRN,82,82)}
          {holdBtn('▶','ArrowRight',GLD,GRN,82,82)}
        </div>
        <div style={{display:'flex',flexDirection:'column',gap:6,alignItems:'center'}}>
          <button style={{fontFamily:'var(--font-pixel)',fontSize:'0.35rem',background:'#333',color:'#F5F0DC',border:'1px solid #555',borderRadius:16,cursor:'pointer',padding:'6px 14px',boxShadow:'0 3px 0 rgba(0,0,0,0.5)',userSelect:'none',WebkitUserSelect:'none',touchAction:'none'}}
            onTouchStart={e=>{e.preventDefault();mb('start',true);}} onTouchEnd={e=>e.preventDefault()} onContextMenu={e=>e.preventDefault()} onMouseDown={()=>mb('start',true)}>START</button>
          {!isMobile&&<div style={{fontFamily:'var(--font-pixel)',fontSize:'0.22rem',color:'rgba(226,168,32,0.35)',textAlign:'center',lineHeight:2.2}}>{'← → MOVE\nSPACE JUMP'}</div>}
        </div>
        {tapBtn('A\nJUMP','jump','#e74c3c','#fff',96,96)}
      </div>
      <div style={{display:'flex',justifyContent:'flex-end',marginTop:4}}>
        <span style={{fontFamily:'var(--font-pixel)',fontSize:'0.22rem',color:'rgba(226,168,32,0.3)'}}>A = JUMP · STOMP ENEMIES</span>
      </div>
    </div>
  );

  if(isFullscreen) return(
    <div style={{position:'fixed',inset:0,zIndex:9999,background:'#000',display:'flex',flexDirection:'column'}}>
      <div style={{flex:1,display:'flex',alignItems:'center',justifyContent:'center',background:'#000'}}>
        <canvas ref={canvasRef} width={780} height={520} style={{maxWidth:'100%',maxHeight:'100%',imageRendering:'pixelated',display:'block'}}/>
      </div>
      {controls}
    </div>
  );

  return(
    <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:'0.5rem'}}>
      <div style={{border:`2px solid ${GLD}`,background:'#000',width:'100%',maxWidth:780,boxShadow:`0 8px 40px rgba(0,0,0,0.6)`}}>
        <canvas ref={canvasRef} width={780} height={520} style={{width:'100%',display:'block',imageRendering:'pixelated'}}/>
      </div>
      {controls}
      <p style={{fontFamily:'var(--font-pixel)',fontSize:'0.28rem',color:'rgba(226,168,32,0.28)',textAlign:'center'}}>
        ← → MOVE &nbsp;·&nbsp; SPACE JUMP &nbsp;·&nbsp; STOMP ENEMIES &nbsp;·&nbsp; ENTER START
      </p>
    </div>
  );
}
