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
const MAX_HP = 100;
const ATTACK_RANGE = 50;
const ATTACK_DMG = 20;
const ATTACK_FRAMES = 16;
const BOSS_HP = 200;
const WEAPON_TYPES = ['gun','knife'];
const GLD = '#E2A820';
const GRN = '#1C3D12';
const GRN2 = '#2D4A1E';

export default function PizzaGame() {
  const canvasRef = useRef(null);
  const gameRef = useRef({});
  const [uiState, setUiState] = useState({ state:'title', score:0, hp:MAX_HP, pizza:0, level:1 });
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile('ontouchstart' in window || window.innerWidth <= 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const music = new Audio(SONG_FILE);
    music.loop = true; music.volume = SONG_VOLUME;

    let gState='title';
    let sc=0, pc=0, levelIdx=0;
    let frame=0, scrollX=0, spT=0, piT=0, wT=0, highSc=0;
    let obs=[], pizzas=[], weapons=[], parts=[], blds=[];
    let keys={}, charIdx=0, selectedChar=0;
    let boss=null, bossHp=BOSS_HP;
    let transitionTimer=0;
    let attackPressed=false;
    let heldWeapon=null, weaponCooldown=0;
    let punchLeg=0;

    const pl={x:80,y:GROUND-PH,vx:0,vy:0,og:true,face:1,inv:0,hp:MAX_HP,attacking:0,attackHit:[]};
    const sync=()=>setUiState({state:gState,score:sc,hp:pl.hp,pizza:pc,level:levelIdx+1});
    const cfg=()=>LEVELS[levelIdx];

    function reset() {
      Object.assign(pl,{x:80,y:GROUND-PH,vx:0,vy:0,og:true,inv:0,hp:MAX_HP,attacking:0,attackHit:[]});
      obs=[];pizzas=[];weapons=[];parts=[];blds=[];
      boss=null;bossHp=BOSS_HP;heldWeapon=null;weaponCooldown=0;punchLeg=0;
      scrollX=0;spT=0;piT=0;wT=0;
      for(let i=0;i<26;i++) blds.push(mkBld(i*160+200));
    }

    function start() {
      sc=0;pc=0;levelIdx=0;charIdx=selectedChar;
      reset();gState='playing';
      music.currentTime=0;music.play().catch(()=>{});sync();
    }

    function respawn() {
      Object.assign(pl,{x:80,y:GROUND-PH,vx:0,vy:0,og:true,inv:180,hp:MAX_HP,attacking:0,attackHit:[]});
      heldWeapon=null;charIdx=selectedChar;
      gState='playing';music.play().catch(()=>{});sync();
    }

    function jump() { if(pl.og){pl.vy=JUMP_POWER;pl.og=false;} }

    function attack() {
      if(pl.attacking>0) return;
      pl.attacking=ATTACK_FRAMES;
      pl.attackHit=[];
      punchLeg=(punchLeg+1)%4;
      if(heldWeapon&&weaponCooldown===0) fireWeapon();
      else doAttack();
    }

    function fireWeapon() {
      weaponCooldown=12;
      if(heldWeapon.type==='gun') {
        heldWeapon.ammo--;
        const by=pl.y+PH/2;
        addParts(pl.face===1?pl.x+PW:pl.x,by,'#ffe066',4);
        obs.forEach(o=>{
          if(o.dead)return;
          const ox=o.x-scrollX;
          const inLine=pl.face===1?ox>pl.x:ox+o.w<pl.x+PW;
          if(inLine&&o.y<by+12&&o.y+o.h>by-12){
            o.hp=(o.hp||2)-2;o.hitFlash=10;
            if(o.hp<=0){o.dead=true;o.deadTimer=30;sc+=300;addParts(ox+o.w/2,o.y,GLD,12);}
            sync();
          }
        });
        if(boss&&!boss.dead){
          const bOx=boss.x-scrollX;
          const inLine=pl.face===1?bOx>pl.x:bOx+boss.w<pl.x+PW;
          if(inLine&&boss.y<by+20&&boss.y+boss.h>by-20){
            bossHp=Math.max(0,bossHp-ATTACK_DMG*1.5);boss.hitFlash=10;
            sc+=200;addParts(bOx+boss.w/2,boss.y+boss.h/2,GLD,10);
            if(bossHp<=0){boss.dead=true;boss.deadTimer=90;sc+=3000;addParts(bOx+boss.w/2,boss.y+boss.h/2,'#FFD700',50);}
            sync();
          }
        }
      } else {
        heldWeapon.ammo--;
        doAttack(1.8);
      }
      if(heldWeapon&&heldWeapon.ammo<=0) heldWeapon=null;
    }

    function doAttack(dmgMult=1) {
      const ax=pl.face===1?pl.x+PW:pl.x-ATTACK_RANGE;
      const ay=pl.y;
      obs.forEach(o=>{
        if(o.dead||pl.attackHit.includes(o.id))return;
        const ox=o.x-scrollX;
        if(ox+o.w>ax&&ox<ax+ATTACK_RANGE&&o.y+o.h>ay&&o.y<ay+PH+10){
          o.hp=(o.hp||2)-Math.round(1*dmgMult);o.hitFlash=10;
          pl.attackHit.push(o.id);
          if(o.hp<=0){o.dead=true;o.deadTimer=30;sc+=200;addParts(ox+o.w/2,o.y,GLD,10);}
          else{o.vx=(pl.face===1?3:-3);addParts(ox+o.w/2,o.y+o.h/2,'#fff',4);}
          sync();
        }
      });
      if(boss&&!boss.dead&&boss.inv===0){
        const bOx=boss.x-scrollX;
        if(bOx+boss.w>ax&&bOx<ax+ATTACK_RANGE&&boss.y+boss.h>ay&&boss.y<ay+PH+10){
          bossHp=Math.max(0,bossHp-ATTACK_DMG*dmgMult);boss.inv=18;boss.hitFlash=10;
          sc+=100;addParts(bOx+boss.w/2,boss.y,GLD,10);
          if(bossHp<=0){boss.dead=true;boss.deadTimer=90;sc+=3000;addParts(bOx+boss.w/2,boss.y+boss.h/2,'#FFD700',50);}
          sync();
        }
      }
    }

    let eid=0;
    function mkBld(x) {
      const c=cfg();
      const awningCols=['#c0392b','#2980b9','#27ae60','#8e44ad','#e67e22'];
      let specialType=null;
      if(levelIdx===0){const r=Math.random();if(r<0.1)specialType='grove';else if(r<0.2)specialType='hyperion';else if(r<0.32)specialType='ypsi';}
      else if(levelIdx===1){const r=Math.random();if(r<0.1)specialType='standrews';else if(r<0.18)specialType='checker';else if(r<0.26)specialType='rencen';}
      else if(levelIdx===2){if(Math.random()<0.22)specialType='mexican';}
      return{x,w:55+Math.random()*85,h:70+Math.random()*160,
        color:c.buildingCols[Math.floor(Math.random()*c.buildingCols.length)],
        wc:Math.floor(Math.random()*4)+2,wr:Math.floor(Math.random()*3)+2,
        specialType,awningCol:awningCols[Math.floor(Math.random()*awningCols.length)]};
    }

    function spawnEnemy() {
      if(boss&&!boss.dead)return;
      const c=cfg();
      const r=Math.random();
      const type=r<0.15?'cone':r<0.38?'metermaid':r<0.62?'muscledude':r<0.8?'biker':'rat';
      const isRat=type==='rat',isCone=type==='cone';
      const geos={cone:{w:18,h:26},metermaid:{w:24,h:32},muscledude:{w:24,h:32},biker:{w:24,h:32},rat:{w:12,h:10}};
      const {w,h}=geos[type];
      const fromLeft=Math.random()<0.3;
      obs.push({
        id:eid++,type,
        x:isCone?(scrollX+W+40+Math.random()*200):(fromLeft?(scrollX-50):(scrollX+W+50)),
        y:GROUND-h,w,h,
        vx:isCone?0:(fromLeft?c.enemySpeed:-c.enemySpeed),
        at:0,dead:false,deadTimer:0,
        hp:type==='muscledude'||type==='biker'?3:isRat?1:2,
        hitFlash:0,
      });
    }

    function spawnCollectible() {
      if(boss&&!boss.dead)return;
      const fly=Math.random()<0.35;
      pizzas.push({
        x:scrollX+W+80,
        y:fly?GROUND-PH-55-Math.random()*55:GROUND-PH-2,
        bob:Math.random()*Math.PI*2,collected:false,type:cfg().collectible,
      });
    }

    function spawnWeapon() {
      if(boss&&!boss.dead)return;
      const type=WEAPON_TYPES[Math.floor(Math.random()*WEAPON_TYPES.length)];
      weapons.push({x:scrollX+W+100,y:GROUND-18,type,bob:Math.random()*Math.PI*2,collected:false});
    }

    function triggerBoss() {
      obs=[];pizzas=[];weapons=[];bossHp=BOSS_HP;
      const types=['landlord','ratking','recordexec'];
      boss={type:types[levelIdx],x:scrollX+W+100,y:GROUND-80,w:60,h:80,vx:-(1.8+levelIdx*0.4),at:0,inv:0,hitFlash:0,dead:false,deadTimer:0};
    }

    function addParts(x,y,col,n) {
      for(let i=0;i<n;i++) parts.push({x,y,vx:(Math.random()-0.5)*7,vy:(Math.random()-0.5)*7-2,life:50+Math.random()*20,ml:70,col,sz:3+Math.random()*4});
    }

    // ── WEAPON PICKUP DRAW
    function drawWeaponPickup(wp) {
      const ox=wp.x-scrollX;
      if(ox>W+60||ox<-60)return;
      const bob=Math.sin(frame*0.06+wp.bob)*4;
      const wy=wp.y+bob;
      if(wp.type==='gun'){
        ctx.fillStyle='#555';ctx.fillRect(ox,wy+4,12,6);
        ctx.fillStyle='#444';ctx.fillRect(ox+8,wy+2,4,4);
        ctx.fillStyle='#666';ctx.fillRect(ox+2,wy+8,4,4);
        ctx.fillStyle='#888';ctx.fillRect(ox+1,wy+4,2,3);
      } else {
        ctx.fillStyle='#aaa';ctx.fillRect(ox+2,wy+2,2,10);
        ctx.fillStyle='#ccc';ctx.fillRect(ox+3,wy+2,1,8);
        ctx.fillStyle='#8B4513';ctx.fillRect(ox,wy+10,5,4);
        ctx.fillStyle='#666';ctx.fillRect(ox-1,wy+9,7,2);
      }
      ctx.font='8px serif';ctx.textAlign='center';
      ctx.fillText(wp.type==='gun'?'🔫':'🔪',ox+6,wy-2);
    }

    // ── PUNCH / KICK ATTACK EFFECT
    function drawAttackEffect() {
      if(pl.attacking<=0) return;
      const prog=1-(pl.attacking/ATTACK_FRAMES);
      const swing=Math.sin(prog*Math.PI)*16;
      const isKick=punchLeg>=2;

      if(heldWeapon) {
        const wx=pl.face===1?pl.x+PW+2:pl.x-16;
        const wy=pl.y+PH/2-4;
        ctx.save();
        if(pl.face===-1){ctx.translate(wx+14,0);ctx.scale(-1,1);ctx.translate(-wx,0);}
        if(heldWeapon.type==='gun'){
          ctx.fillStyle='#555';ctx.fillRect(wx,wy+2,14,7);
          ctx.fillStyle='#444';ctx.fillRect(wx+10,wy,4,5);
          ctx.fillStyle='#666';ctx.fillRect(wx+2,wy+7,5,4);
          if(pl.attacking>ATTACK_FRAMES-4){
            ctx.fillStyle='rgba(255,220,0,0.9)';ctx.beginPath();ctx.arc(wx+14,wy+5,5,0,Math.PI*2);ctx.fill();
          }
          ctx.fillStyle=GLD;ctx.font='6px "Press Start 2P"';ctx.textAlign='center';
          ctx.fillText(heldWeapon.ammo,wx+7,wy-3);
        } else {
          ctx.fillStyle='#bbb';ctx.fillRect(wx,wy,3,12);
          ctx.fillStyle='#ddd';ctx.fillRect(wx+1,wy,1,10);
          ctx.fillStyle='#8B4513';ctx.fillRect(wx-1,wy+11,5,5);
          ctx.fillStyle=GLD;ctx.font='6px "Press Start 2P"';ctx.textAlign='center';
          ctx.fillText(heldWeapon.ammo,wx+3,wy-3);
        }
        ctx.restore();
        return;
      }

      ctx.save();
      if(pl.face===-1){ctx.translate(pl.x+PW,0);ctx.scale(-1,1);ctx.translate(-pl.x,0);}
      if(!isKick){
        // PUNCH — arm extends forward, alternates left/right fist
        const armY=pl.y+PH*0.3;
        ctx.fillStyle=punchLeg===0?'#c49060':'#b48050';
        ctx.fillRect(pl.x+PW,armY,swing*0.8,5);
        ctx.fillStyle='#b48050';
        ctx.fillRect(pl.x+PW+swing*0.8-1,armY-2,8,8);
        if(prog>0.45&&prog<0.8){
          ctx.fillStyle='rgba(255,255,100,0.8)';
          ctx.beginPath();ctx.arc(pl.x+PW+swing*0.8+7,armY+2,7,0,Math.PI*2);ctx.fill();
          ctx.fillStyle='rgba(255,200,0,0.4)';
          ctx.beginPath();ctx.arc(pl.x+PW+swing*0.8+7,armY+2,13,0,Math.PI*2);ctx.fill();
        }
      } else {
        // KICK — leg extends forward
        const legY=pl.y+PH*0.62;
        ctx.fillStyle='#1c1c2c';
        ctx.fillRect(pl.x+PW-2,legY,swing,6);
        ctx.fillStyle='#111';
        ctx.fillRect(pl.x+PW+swing-2,legY-3,12,9);
        if(prog>0.45&&prog<0.8){
          ctx.fillStyle='rgba(255,80,80,0.7)';
          ctx.beginPath();ctx.arc(pl.x+PW+swing+10,legY+2,8,0,Math.PI*2);ctx.fill();
          ctx.fillStyle='rgba(255,40,40,0.35)';
          ctx.beginPath();ctx.arc(pl.x+PW+swing+10,legY+2,14,0,Math.PI*2);ctx.fill();
        }
      }
      ctx.restore();
    }

    function drawBackground() {
      const c=cfg();
      if(c.daytime){
        const sg=ctx.createLinearGradient(0,0,0,GROUND);
        sg.addColorStop(0,'#4a90d9');sg.addColorStop(1,'#87ceeb');
        ctx.fillStyle=sg;ctx.fillRect(0,0,W,GROUND);
        ctx.fillStyle='#FFD700';ctx.beginPath();ctx.arc(W-90,55,26,0,Math.PI*2);ctx.fill();
        ctx.fillStyle='rgba(255,215,0,0.22)';ctx.beginPath();ctx.arc(W-90,55,38,0,Math.PI*2);ctx.fill();
        ctx.fillStyle='rgba(255,255,255,0.9)';
        [[100,70,32],[280,50,24],[460,80,28],[640,60,22]].forEach(([cx,cy,r])=>{
          const cloudX=((cx-scrollX*0.03+W*3)%(W+100))-50;
          ctx.beginPath();ctx.arc(cloudX,cy,r,0,Math.PI*2);ctx.fill();
          ctx.beginPath();ctx.arc(cloudX+r*0.6,cy+5,r*0.6,0,Math.PI*2);ctx.fill();
        });
      } else {
        const sg=ctx.createLinearGradient(0,0,0,GROUND);
        sg.addColorStop(0,c.skyTop);sg.addColorStop(1,c.skyBot);
        ctx.fillStyle=sg;ctx.fillRect(0,0,W,GROUND);
        for(let i=0;i<40;i++){
          const sx=((i*137+scrollX*0.07)%(W+40)+W+40)%(W+40),sy=(i*73)%(GROUND*0.5);
          ctx.fillStyle=Math.sin(frame*0.03+i)>0.4?c.starColor:'rgba(226,168,32,0.08)';
          ctx.fillRect(sx,sy,2,2);
        }
        ctx.fillStyle=c.moonColor;ctx.beginPath();ctx.arc(W-65,50,20,0,Math.PI*2);ctx.fill();
        ctx.fillStyle=c.skyTop;ctx.beginPath();ctx.arc(W-56,44,17,0,Math.PI*2);ctx.fill();
      }
      ctx.fillStyle=c.daytime?'rgba(80,120,60,0.5)':c.skyTop;
      for(let i=0;i<10;i++){const bx=((i*105-scrollX*0.1)%(W+200)+W+200)%(W+200)-100;ctx.fillRect(bx,GROUND-45-(i%4)*22,40+(i%3)*14,45+(i%4)*22);}
    }

    function drawBuilding(b) {
      const c=cfg();const bx=b.x-scrollX;
      if(bx>W+200||bx+b.w<-200)return;
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
        ctx.fillText('GROVE',bx+45,GROUND-120);ctx.font='5px "Press Start 2P"';ctx.fillText('STUDIOS',bx+45,GROUND-112);
        ctx.fillStyle='#ffe066';for(let i=0;i<6;i++){ctx.beginPath();ctx.arc(bx+8+i*14,GROUND-132+Math.sin(frame*0.04+i)*2,2,0,Math.PI*2);ctx.fill();}
        return;
      }
      if(b.specialType==='hyperion'){
        ctx.fillStyle='#4a3020';ctx.fillRect(bx,GROUND-110,80,110);
        ctx.strokeStyle='#2a1a10';ctx.lineWidth=2;ctx.strokeRect(bx,GROUND-110,80,110);
        ctx.fillStyle='rgba(255,200,100,0.4)';ctx.fillRect(bx+6,GROUND-85,68,50);
        ctx.fillStyle='#1a5a4a';ctx.fillRect(bx+4,GROUND-110,72,22);
        ctx.fillStyle='#fff';ctx.font='bold 7px "Press Start 2P"';ctx.textAlign='center';
        ctx.fillText('HYPERION',bx+40,GROUND-102);ctx.font='5px "Press Start 2P"';ctx.fillText('COFFEE',bx+40,GROUND-94);
        return;
      }
      if(b.specialType==='ypsi'){
        ctx.fillStyle=b.color;ctx.fillRect(bx,GROUND-120,b.w,120);
        ctx.fillStyle='rgba(200,220,255,0.22)';ctx.fillRect(bx+4,GROUND-78,b.w-8,48);
        ctx.strokeStyle='#333';ctx.lineWidth=2;ctx.strokeRect(bx+4,GROUND-78,b.w-8,48);
        ctx.fillStyle=b.awningCol;ctx.fillRect(bx,GROUND-84,b.w,8);
        ctx.fillStyle='#ffe066';
        for(let i=0;i<6;i++){
          const lx=bx+4+i*(b.w-8)/5,ly=GROUND-121+Math.sin(i*1.3)*3;
          if(Math.sin(frame*0.04+i)>0){ctx.shadowBlur=4;ctx.shadowColor='#ffe066';}
          ctx.beginPath();ctx.arc(lx,ly,2,0,Math.PI*2);ctx.fill();ctx.shadowBlur=0;
        }
        return;
      }
      if(b.specialType==='standrews'){
        ctx.fillStyle='#2a1a10';ctx.fillRect(bx,GROUND-165,100,165);
        ctx.fillStyle='rgba(0,0,0,0.15)';for(let r=0;r<18;r++) for(let cc=0;cc<6;cc++){if((r+cc)%2===0)ctx.fillRect(bx+cc*16+(r%2)*8,GROUND-165+r*8,14,6);}
        ctx.fillStyle='#111';ctx.fillRect(bx+2,GROUND-118,96,24);
        ctx.fillStyle='#ffe066';for(let i=0;i<10;i++){if(Math.floor(frame/8+i)%2===0){ctx.beginPath();ctx.arc(bx+6+i*9,GROUND-107,3,0,Math.PI*2);ctx.fill();}}
        ctx.fillStyle='#fff';ctx.font='bold 7px "Press Start 2P"';ctx.textAlign='center';
        ctx.fillText('ST. ANDREWS',bx+50,GROUND-126);ctx.font='5px "Press Start 2P"';ctx.fillText('HALL',bx+50,GROUND-118);
        for(let i=0;i<4;i++){ctx.fillStyle=Math.sin(frame*0.02+i)>0?'#ffe066':'#111';ctx.fillRect(bx+8+i*22,GROUND-158,14,20);}
        return;
      }
      if(b.specialType==='checker'){
        ctx.fillStyle='#1a1a1a';ctx.fillRect(bx,GROUND-105,88,105);
        ctx.strokeStyle='#333';ctx.lineWidth=2;ctx.strokeRect(bx,GROUND-105,88,105);
        const sq=8;for(let r=0;r<3;r++) for(let cc=0;cc<11;cc++){ctx.fillStyle=(r+cc)%2===0?'#fff':'#111';ctx.fillRect(bx+cc*sq,GROUND-105+r*sq,sq,sq);}
        ctx.fillStyle='#cc0000';ctx.shadowBlur=6;ctx.shadowColor='#ff0000';ctx.fillRect(bx+4,GROUND-76,80,18);ctx.shadowBlur=0;
        ctx.fillStyle='#fff';ctx.font='bold 6px "Press Start 2P"';ctx.textAlign='center';ctx.fillText('CHECKER BAR',bx+44,GROUND-63);
        return;
      }
      if(b.specialType==='rencen'){
        ctx.fillStyle='#1a2a1a';ctx.fillRect(bx+20,GROUND-220,30,220);
        for(let i=0;i<4;i++){const offX=[0,50,0,50][i];ctx.fillStyle='#152315';ctx.fillRect(bx+offX,GROUND-140,20,140);}
        for(let r=0;r<8;r++) for(let cc=0;cc<2;cc++){ctx.fillStyle=Math.sin(frame*0.02+r+cc)>0?GLD:'#0a1506';ctx.fillRect(bx+24+cc*12,GROUND-214+r*24,8,14);}
        ctx.fillStyle=GLD;ctx.font='6px "Press Start 2P"';ctx.textAlign='center';ctx.fillText('REN CEN',bx+35,GROUND-225);
        return;
      }
      if(b.specialType==='mexican'){
        ctx.fillStyle=b.color;ctx.fillRect(bx,GROUND-b.h,b.w,b.h);
        ctx.fillStyle='rgba(0,0,0,0.18)';for(let r=0;r<Math.floor(b.h/8);r++) for(let cc=0;cc<Math.floor(b.w/16);cc++){if((r+cc)%2===0)ctx.fillRect(bx+cc*16+(r%2)*8,GROUND-b.h+r*8,14,6);}
        ctx.fillStyle=b.awningCol;ctx.fillRect(bx,GROUND-b.h*0.38,b.w,9);
        const flagCols=['#e74c3c','#f39c12','#2ecc71','#3498db','#9b59b6','#fff'];
        for(let i=0;i<8;i++){ctx.fillStyle=flagCols[i%flagCols.length];ctx.fillRect(bx+4+i*(b.w-8)/7,GROUND-b.h+4+Math.sin(frame*0.03+i)*3,8,11);}
        for(let r=0;r<b.wr;r++) for(let cc=0;cc<b.wc;cc++){const wx=bx+8+cc*17,wy=GROUND-b.h+18+r*22;if(wx+10<bx+b.w-4){ctx.fillStyle=Math.sin(frame*0.013+r+cc+b.x*0.01)>0?'#f39c12':'#050505';ctx.fillRect(wx,wy,10,10);}}
        return;
      }
      ctx.fillStyle=b.color;ctx.fillRect(bx,GROUND-b.h,b.w,b.h);
      ctx.strokeStyle='#000';ctx.lineWidth=1;ctx.strokeRect(bx,GROUND-b.h,b.w,b.h);
      if(levelIdx===0&&b.w>58){ctx.fillStyle=b.awningCol||'#c0392b';ctx.fillRect(bx,GROUND-b.h*0.35,b.w,7);}
      const wc=cfg().windowColor;
      for(let r=0;r<b.wr;r++) for(let cc=0;cc<b.wc;cc++){
        const wx=bx+8+cc*17,wy=GROUND-b.h+20+r*22;
        if(wx+10<bx+b.w-4){const lit=Math.sin(frame*0.013+r*1.8+cc*0.9+b.x*0.01)>0;ctx.fillStyle=lit?wc:'#050505';if(lit){ctx.shadowBlur=4;ctx.shadowColor=wc;}ctx.fillRect(wx,wy,10,10);ctx.shadowBlur=0;}
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
      ctx.fillStyle='rgba(0,0,0,0.82)';ctx.fillRect(0,0,W,54);
      ctx.fillStyle=GLD;ctx.font='11px "Press Start 2P"';ctx.textAlign='left';ctx.fillText('SCORE:'+sc,12,18);
      if(highSc>0){ctx.fillStyle='#c8b830';ctx.font='8px "Press Start 2P"';ctx.fillText('BEST:'+highSc,12,34);}
      const hpW=160;
      ctx.fillStyle='#111';ctx.fillRect(W/2-hpW/2-2,8,hpW+4,16);
      const hpCol=pl.hp>60?'#2ecc71':pl.hp>30?'#f39c12':'#e74c3c';
      ctx.fillStyle=hpCol;ctx.fillRect(W/2-hpW/2,10,Math.max(0,hpW*(pl.hp/MAX_HP)),12);
      ctx.strokeStyle=GLD;ctx.lineWidth=1;ctx.strokeRect(W/2-hpW/2-2,8,hpW+4,16);
      ctx.fillStyle='#fff';ctx.font='7px "Press Start 2P"';ctx.textAlign='center';ctx.fillText('HP',W/2,22);
      ctx.fillStyle='#F5F0DC';ctx.font='8px "Press Start 2P"';ctx.fillText('LVL '+(levelIdx+1)+' · '+c.name,W/2,38);
      if(heldWeapon){ctx.fillStyle='#3498db';ctx.font='7px "Press Start 2P"';ctx.textAlign='left';ctx.fillText((heldWeapon.type==='gun'?'🔫':'🔪')+' x'+heldWeapon.ammo,14,50);}
      if(!boss||boss.dead){
        const label=c.collectible==='taco'?'🌮':'🍕';
        ctx.fillStyle='#c8b830';ctx.textAlign='right';ctx.font='10px "Press Start 2P"';
        ctx.fillText(label+' '+pc+'/'+c.collectTarget,W-12,18);
        for(let i=0;i<c.collectTarget;i++){ctx.fillStyle=i<pc?'#FF8C00':'#222';ctx.fillRect(W-12-c.collectTarget*11+i*11,26,9,12);}
      } else {
        const bhpW=200;
        ctx.fillStyle='#111';ctx.fillRect(W-bhpW-14,8,bhpW+4,16);
        ctx.fillStyle='#e74c3c';ctx.fillRect(W-bhpW-12,10,Math.max(0,bhpW*(bossHp/BOSS_HP)),12);
        ctx.strokeStyle=GLD;ctx.lineWidth=1;ctx.strokeRect(W-bhpW-14,8,bhpW+4,16);
        const bnames={landlord:'LANDLORD',ratking:'RAT KING',recordexec:'RECORD EXEC'};
        ctx.fillStyle='#fff';ctx.font='7px "Press Start 2P"';ctx.textAlign='right';ctx.fillText(boss?bnames[boss.type]:'BOSS',W-14,38);
      }
    }

    function drawTitle() {
      ctx.fillStyle=GRN;ctx.fillRect(0,0,W,H);
      for(let i=0;i<50;i++){const sx=(i*131+frame*0.3)%W,sy=(i*71)%(H*0.55);ctx.fillStyle=Math.sin(frame*0.04+i)>0.4?GLD:'rgba(226,168,32,0.1)';ctx.fillRect(sx,sy,Math.sin(frame*0.06+i)>0.6?3:1,Math.sin(frame*0.06+i)>0.6?3:1);}
      ctx.fillStyle='rgba(0,0,0,0.88)';ctx.fillRect(W/2-290,H/2-200,580,400);
      ctx.strokeStyle=GLD;ctx.lineWidth=4;ctx.strokeRect(W/2-290,H/2-200,580,400);
      ctx.strokeStyle='#c8b830';ctx.lineWidth=1.5;ctx.strokeRect(W/2-284,H/2-194,568,388);
      ctx.fillStyle=GLD;ctx.font='20px "Press Start 2P"';ctx.textAlign='center';ctx.fillText('DETROIT PIZZA QUEST',W/2,H/2-155);
      ctx.fillStyle='#c8b830';ctx.font='11px "Press Start 2P"';ctx.fillText('— Team Cabin Edition —',W/2,H/2-123);
      ctx.fillStyle='#F5F0DC';ctx.font='9px "Press Start 2P"';
      ctx.fillText('3 LEVELS · 3 BOSSES · 1 CITY',W/2,H/2-91);
      ctx.fillText('← → MOVE   SPACE JUMP   Z ATTACK',W/2,H/2-69);
      ctx.fillText('STOMP OR PUNCH OR KICK ENEMIES',W/2,H/2-47);
      ctx.fillText('PICK UP 🔫 GUNS & 🔪 KNIVES',W/2,H/2-25);
      ctx.fillText('COLLECT 16 SLICES → BOSS FIGHT',W/2,H/2-3);
      ctx.fillStyle='rgba(226,168,32,0.5)';ctx.font='7px "Press Start 2P"';
      ctx.fillText('LVL1: YPSILANTI · LVL2: DETROIT · LVL3: MEXICANTOWN',W/2,H/2+24);
      if(Math.floor(frame/25)%2===0){ctx.fillStyle='#4A7A30';ctx.font='11px "Press Start 2P"';ctx.fillText('[ PRESS ENTER TO CHOOSE PLAYER ]',W/2,H/2+72);}
      if(highSc>0){ctx.fillStyle='#c8b830';ctx.font='9px "Press Start 2P"';ctx.fillText('HIGH SCORE: '+highSc,W/2,H/2+106);}
    }

    function drawCharSelect() {
      ctx.fillStyle=GRN;ctx.fillRect(0,0,W,H);
      for(let i=0;i<50;i++){const sx=(i*137)%W,sy=(i*71)%(H*0.6);ctx.fillStyle=Math.sin(frame*0.04+i)>0.4?GLD:'rgba(226,168,32,0.08)';ctx.fillRect(sx,sy,2,2);}
      ctx.fillStyle=GLD;ctx.font='20px "Press Start 2P"';ctx.textAlign='center';ctx.fillText('CHOOSE YOUR PLAYER',W/2,52);
      const chars=[{name:'STEVE',role:'Bass & Vocals',desc:'Bearded groove machine'},{name:'MIKE',role:'Drums',desc:'Everybody loves Mike'},{name:'KYLE',role:'Guitar & Vocals',desc:'Tall guitar genius'}];
      const cardW=210,cardH=380,gap=18,startX=(W-(cardW*3+gap*2))/2;
      chars.forEach((ch,i)=>{
        const cx=startX+i*(cardW+gap),cy=72,isSel=selectedChar===i;
        ctx.fillStyle=isSel?'rgba(226,168,32,0.1)':'rgba(0,0,0,0.5)';ctx.fillRect(cx,cy,cardW,cardH);
        ctx.strokeStyle=isSel?GLD:'rgba(226,168,32,0.2)';ctx.lineWidth=isSel?4:2;ctx.strokeRect(cx,cy,cardW,cardH);
        if(isSel){ctx.shadowBlur=14;ctx.shadowColor=GLD;ctx.strokeRect(cx,cy,cardW,cardH);ctx.shadowBlur=0;}
        const scale=4,spriteX=cx+cardW/2-(32*scale)/2,spriteY=cy+40;
        ctx.save();ctx.translate(spriteX,spriteY);ctx.scale(scale,scale);
        drawCharSprite(ctx,i,0,0,22,{gold:GLD,goldL:'#c8b830',greenL:'#4A7A30',cream:'#F5F0DC'});
        ctx.restore();
        ctx.fillStyle=isSel?GLD:'#F5F0DC';ctx.font=`${isSel?'13':'12'}px "Press Start 2P"`;ctx.textAlign='center';ctx.fillText(ch.name,cx+cardW/2,cy+cardH-62);
        ctx.fillStyle='#c8b830';ctx.font='9px "Press Start 2P"';ctx.fillText(ch.role,cx+cardW/2,cy+cardH-40);
        ctx.fillStyle='rgba(245,240,220,0.5)';ctx.font='8px "Press Start 2P"';ctx.fillText(ch.desc,cx+cardW/2,cy+cardH-18);
        if(isSel&&Math.floor(frame/20)%2===0){ctx.fillStyle=GLD;ctx.font='18px serif';ctx.fillText('▼',cx+cardW/2,cy-8);}
      });
      ctx.fillStyle='#F5F0DC';ctx.font='11px "Press Start 2P"';ctx.textAlign='center';ctx.fillText('← → TO SELECT     ENTER TO CONFIRM',W/2,H-18);
    }

    function drawLevelTransition() {
      const c=cfg();
      if(c.daytime){const sg=ctx.createLinearGradient(0,0,0,H);sg.addColorStop(0,'#4a90d9');sg.addColorStop(1,'#87ceeb');ctx.fillStyle=sg;ctx.fillRect(0,0,W,H);}
      else{const sg=ctx.createLinearGradient(0,0,0,H);sg.addColorStop(0,c.skyTop);sg.addColorStop(1,c.skyBot);ctx.fillStyle=sg;ctx.fillRect(0,0,W,H);}
      ctx.fillStyle='rgba(0,0,0,0.85)';ctx.fillRect(W/2-260,H/2-130,520,260);
      ctx.strokeStyle=GLD;ctx.lineWidth=4;ctx.strokeRect(W/2-260,H/2-130,520,260);
      ctx.fillStyle=GLD;ctx.font='14px "Press Start 2P"';ctx.textAlign='center';ctx.fillText('LEVEL '+(levelIdx+1),W/2,H/2-88);
      ctx.fillStyle='#F5F0DC';ctx.font='22px "Press Start 2P"';ctx.fillText(c.name,W/2,H/2-52);
      ctx.fillStyle='#c8b830';ctx.font='10px "Press Start 2P"';ctx.fillText(c.subtitle,W/2,H/2-22);
      ctx.fillStyle='rgba(245,240,220,0.7)';ctx.font='8px "Press Start 2P"';
      ctx.fillText('COLLECT 16 '+(c.collectible==='taco'?'TACOS':'PIZZA SLICES')+' · THEN FIGHT THE BOSS',W/2,H/2+18);
      if(Math.floor(frame/20)%2===0){ctx.fillStyle='#4A7A30';ctx.font='11px "Press Start 2P"';ctx.fillText('GET READY...',W/2,H/2+65);}
    }

    function drawDead() {
      ctx.fillStyle='rgba(0,0,0,0.82)';ctx.fillRect(0,0,W,H);
      ctx.fillStyle='#e74c3c';ctx.font='26px "Press Start 2P"';ctx.textAlign='center';ctx.fillText('WRECKED!',W/2,H/2-55);
      ctx.fillStyle='#F5F0DC';ctx.font='13px "Press Start 2P"';ctx.fillText('SCORE: '+sc,W/2,H/2-10);
      if(Math.floor(frame/28)%2===0){ctx.fillStyle='#c8b830';ctx.fillText('PRESS ENTER TO RETRY',W/2,H/2+50);}
    }

    function drawWin() {
      ctx.fillStyle=GRN;ctx.fillRect(0,0,W,H);
      for(let i=0;i<30;i++){ctx.fillStyle=[GLD,'#e74c3c','#F5F0DC','#4A7A30'][i%4];ctx.fillRect((i*137+frame*2.5)%W,(i*89+frame*1.5)%(H-60),8,8);}
      ctx.fillStyle='rgba(0,0,0,0.85)';ctx.fillRect(W/2-260,H/2-140,520,280);
      ctx.strokeStyle=GLD;ctx.lineWidth=4;ctx.strokeRect(W/2-260,H/2-140,520,280);
      ctx.fillStyle=GLD;ctx.font='17px "Press Start 2P"';ctx.textAlign='center';ctx.fillText('🍕 DETROIT CONQUERED! 🍕',W/2,H/2-100);
      ctx.fillStyle='#F5F0DC';ctx.font='11px "Press Start 2P"';
      ctx.fillText('THE BAND FEASTS TONIGHT',W/2,H/2-65);
      ctx.fillText('ALL 3 LEVELS COMPLETE',W/2,H/2-38);
      ctx.fillText('SCORE: '+sc,W/2,H/2-8);
      if(sc>=highSc&&sc>0){ctx.fillStyle='#c8b830';ctx.fillText('✨ NEW HIGH SCORE! ✨',W/2,H/2+28);}
      if(Math.floor(frame/28)%2===0){ctx.fillStyle='#c8b830';ctx.font='11px "Press Start 2P"';ctx.fillText('PRESS ENTER TO PLAY AGAIN',W/2,H/2+75);}
    }

    let raf;
    function loop() {
      frame++;
      if(weaponCooldown>0) weaponCooldown--;

      if(gState==='transition'){
        transitionTimer--;drawLevelTransition();
        if(transitionTimer<=0){gState='playing';sync();}
        raf=requestAnimationFrame(loop);return;
      }

      if(gState==='playing'){
        // LEFT / RIGHT only — pure side-scroller
        if(keys['ArrowLeft']||keys['KeyA']){pl.vx=-4.5;pl.face=-1;}
        else if(keys['ArrowRight']||keys['KeyD']){pl.vx=4.5;pl.face=1;}
        else pl.vx*=0.6;

        if((keys['ArrowUp']||keys['Space']||keys['KeyW'])&&pl.og) jump();
        if((keys['KeyZ']||keys['KeyJ'])&&!attackPressed){attackPressed=true;attack();}
        if(!keys['KeyZ']&&!keys['KeyJ']) attackPressed=false;

        pl.vy+=GRAVITY;pl.x+=pl.vx;pl.y+=pl.vy;
        if(pl.y+PH>=GROUND){pl.y=GROUND-PH;pl.vy=0;pl.og=true;}else pl.og=false;
        if(pl.x<20)pl.x=20;if(pl.x>W-PW-20)pl.x=W-PW-20;
        if(pl.inv>0)pl.inv--;
        if(pl.attacking>0){pl.attacking--;if(pl.attacking===ATTACK_FRAMES-3)doAttack();}
        if(pl.x>W*0.42){const s=pl.x-W*0.42;scrollX+=s;pl.x=W*0.42;}

        const c=cfg();
        if(!boss||boss.dead){
          spT++;if(spT>=c.spawnRate){spawnEnemy();spT=0;}
          piT++;if(piT>=70){spawnCollectible();piT=0;}
          wT++;if(wT>=200){spawnWeapon();wT=0;}
        }
        if(pc>=c.collectTarget&&!boss) triggerBoss();

        // weapon pickup
        weapons=weapons.filter(wp=>{
          if(wp.collected)return false;
          const ox=wp.x-scrollX;if(ox<-80)return false;
          const bob=Math.sin(frame*0.06+wp.bob)*4;
          if(pl.x<ox+16&&pl.x+PW>ox&&pl.y<wp.y+bob+20&&pl.y+PH>wp.y+bob){
            wp.collected=true;heldWeapon={type:wp.type,ammo:wp.type==='gun'?8:5};
            addParts(ox+8,wp.y,'#3498db',10);return false;
          }
          return true;
        });

        // boss — bounces left/right at ground level
        if(boss&&!boss.dead){
          boss.x+=boss.vx;
          if(boss.inv>0)boss.inv--;if(boss.hitFlash>0)boss.hitFlash--;
          const bOx=boss.x-scrollX;
          if(bOx<80)boss.vx=Math.abs(boss.vx);
          if(bOx>W-boss.w-60)boss.vx=-Math.abs(boss.vx);
          const pb=pl.y+PH;
          const bOverlapX=pl.x<bOx+boss.w&&pl.x+PW>bOx;
          const stomping=pl.vy>0&&pb>=boss.y&&pb<=boss.y+18&&bOverlapX;
          if(stomping&&boss.inv===0){
            bossHp=Math.max(0,bossHp-30);boss.inv=50;boss.hitFlash=15;pl.vy=-11;sc+=300;
            addParts(bOx+boss.w/2,boss.y,GLD,18);
            if(bossHp<=0){boss.dead=true;boss.deadTimer=90;sc+=3000;addParts(bOx+boss.w/2,boss.y+boss.h/2,'#FFD700',50);}
            sync();
          }
          if(pl.inv===0&&bOverlapX&&pl.y<boss.y+boss.h&&pl.y+PH>boss.y&&!stomping){
            pl.hp=Math.max(0,pl.hp-8);pl.inv=80;addParts(pl.x+PW/2,pl.y+PH/2,'#e74c3c',10);
            if(pl.hp<=0){if(sc>highSc)highSc=sc;music.pause();gState='dead';sync();}sync();
          }
        }

        if(boss&&boss.dead){
          boss.deadTimer--;
          if(boss.deadTimer<=0){
            if(levelIdx>=LEVELS.length-1){if(sc>highSc)highSc=sc;music.pause();gState='win';sync();}
            else{levelIdx++;pc=0;reset();transitionTimer=200;gState='transition';sync();}
          }
        }

        // enemies — ground level, left/right only
        obs=obs.filter(o=>{
          if(o.hitFlash>0)o.hitFlash--;
          if(o.type==='cone'){
            const ox=o.x-scrollX;if(ox<-120)return false;
            if(o.dead){o.deadTimer--;return o.deadTimer>0;}
            if(pl.inv===0&&ox+o.w>pl.x&&ox<pl.x+PW&&o.y+o.h>pl.y&&o.y<pl.y+PH){
              pl.hp=Math.max(0,pl.hp-12);pl.inv=70;addParts(pl.x+PW/2,pl.y+PH/2,'#e74c3c',8);
              if(pl.hp<=0){if(sc>highSc)highSc=sc;music.pause();gState='dead';sync();}sync();
            }
            return true;
          }
          o.x+=o.vx;
          const ox=o.x-scrollX;
          if(ox<-120)return false;
          if(o.dead){o.deadTimer--;return o.deadTimer>0;}
          o.at++;
          // stomp detection
          if(!pl.og&&pl.vy>0){
            const pb=pl.y+PH;
            if(ox+o.w>pl.x&&ox<pl.x+PW&&pb>=o.y&&pb<=o.y+12){
              o.hp=(o.hp||2)-2;o.hitFlash=15;pl.vy=-10;sc+=200;
              addParts(ox+o.w/2,o.y,GLD,10);
              if(o.hp<=0){o.dead=true;o.deadTimer=30;}sync();return true;
            }
          }
          if(pl.inv===0&&ox+o.w>pl.x&&ox<pl.x+PW&&o.y+o.h>pl.y&&o.y<pl.y+PH){
            pl.hp=Math.max(0,pl.hp-10);pl.inv=70;addParts(pl.x+PW/2,pl.y+PH/2,'#e74c3c',8);
            if(pl.hp<=0){if(sc>highSc)highSc=sc;music.pause();gState='dead';sync();}sync();
          }
          return true;
        });

        pizzas=pizzas.filter(pz=>{
          if(pz.collected)return false;const ox=pz.x-scrollX;if(ox<-80)return false;
          const bob=Math.sin(frame*0.08+pz.bob)*6;
          if(pl.x<ox+28&&pl.x+PW>ox&&pl.y<pz.y+bob+28&&pl.y+PH>pz.y+bob){
            pz.collected=true;sc+=100;pc++;addParts(ox+14,pz.y+14,GLD,14);sync();return false;
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

      // draw weapons on ground
      weapons.forEach(wp=>{if(!wp.collected)drawWeaponPickup(wp);});

      // enemies
      obs.forEach(o=>{
        const ox=o.x-scrollX;
        if(o.dead){ctx.globalAlpha=Math.max(0,o.deadTimer/30);ctx.font='18px serif';ctx.textAlign='center';ctx.fillText('💀',ox+o.w/2,o.y+o.h-2);ctx.globalAlpha=1;return;}
        if(o.hitFlash>0&&Math.floor(o.hitFlash/3)%2===0){ctx.globalAlpha=0.5;ctx.fillStyle='#fff';ctx.fillRect(ox,o.y,o.w,o.h);ctx.globalAlpha=1;}
        drawEnemySprite(ctx,o,scrollX,{gold:GLD,goldL:'#c8b830',greenL:'#4A7A30',cream:'#F5F0DC'});
      });

      // collectibles
      pizzas.forEach(pz=>{
        const ox=pz.x-scrollX;const bob=Math.sin(frame*0.08+pz.bob)*6;
        if(pz.type==='taco')drawTaco(ctx,ox,pz.y+bob,{gold:GLD});
        else drawPizzaSlice(ctx,ox,pz.y+bob,{gold:GLD});
      });

      // boss
      if(boss&&(!boss.dead||boss.deadTimer>0)){
        const bOx=boss.x-scrollX;
        if(boss.hitFlash>0&&Math.floor(boss.hitFlash/3)%2===0){ctx.globalAlpha=0.4;ctx.fillStyle='#fff';ctx.fillRect(bOx,boss.y,boss.w,boss.h);ctx.globalAlpha=1;}
        drawBossSprite(ctx,boss,scrollX,Math.round((1-bossHp/BOSS_HP)*10),10,{gold:GLD,goldL:'#c8b830'});
      }

      // particles
      parts.forEach(p=>{ctx.globalAlpha=p.life/p.ml;ctx.fillStyle=p.col;ctx.fillRect(p.x-p.sz/2,p.y-p.sz/2,p.sz,p.sz);});
      ctx.globalAlpha=1;

      // player
      if(!(pl.inv>0&&Math.floor(pl.inv/5)%2===0)){
        ctx.save();
        if(pl.face===-1){ctx.translate(pl.x+PW,0);ctx.scale(-1,1);ctx.translate(-pl.x,0);}
        drawCharSprite(ctx,charIdx,pl.x,pl.y,PW,{gold:GLD,goldL:'#c8b830',greenL:'#4A7A30',cream:'#F5F0DC'});
        ctx.restore();
        drawAttackEffect();
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
        else if(gState==='dead'){respawn();}
        else if(gState==='win'){gState='charselect';sync();}
      }
    };
    const onUp=e=>{keys[e.code]=false;};
    window.addEventListener('keydown',onDown);
    window.addEventListener('keyup',onUp);
    loop();

    gameRef.current={
      jump,start,attack,
      tryAgain:respawn,
      toCharSelect:()=>{gState='charselect';sync();},
      setChar:(i)=>{selectedChar=i;sync();},
      confirmChar:()=>{charIdx=selectedChar;start();},
      keys,getState:()=>gState,getSelectedChar:()=>selectedChar,
    };

    return()=>{
      cancelAnimationFrame(raf);
      window.removeEventListener('keydown',onDown);
      window.removeEventListener('keyup',onUp);
      music.pause();music.currentTime=0;
    };
  },[]);

  // Fullscreen — works on BOTH mobile and desktop
  const enterFullscreen=()=>{
    document.documentElement.requestFullscreen().catch(()=>{});
    setIsFullscreen(true);
  };
  const exitFullscreen=()=>{
    if(document.fullscreenElement)document.exitFullscreen().catch(()=>{});
    setIsFullscreen(false);
  };
  useEffect(()=>{
    const fn=()=>{if(!document.fullscreenElement)setIsFullscreen(false);};
    document.addEventListener('fullscreenchange',fn);
    return()=>document.removeEventListener('fullscreenchange',fn);
  },[]);

  const mb=(key,down)=>{
    const g=gameRef.current;if(!g)return;
    const st=g.getState?g.getState():uiState.state;
    if(key==='jump'){if(down&&st==='playing')g.jump();}
    else if(key==='attack'){if(down&&st==='playing')g.attack();}
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

  const btnS=(bg,fg,w,h)=>({
    fontFamily:'"Press Start 2P"',fontSize:'0.6rem',
    background:bg,color:fg||'#fff',border:'none',borderRadius:4,
    cursor:'pointer',boxShadow:'0 4px 0 rgba(0,0,0,0.6)',
    display:'flex',alignItems:'center',justifyContent:'center',
    userSelect:'none',WebkitUserSelect:'none',
    WebkitTouchCallout:'none',touchAction:'none',
    width:w||72,height:h||72,
  });

  // directional button — hold support
  const dpadBtn=(lbl,key,w,h)=>(
    <button key={key} style={btnS(GLD,GRN,w||80,h||80)}
      onTouchStart={e=>{e.preventDefault();mb(key,true);}}
      onTouchEnd={e=>{e.preventDefault();mb(key,false);}}
      onTouchCancel={e=>{e.preventDefault();mb(key,false);}}
      onContextMenu={e=>e.preventDefault()}
      onMouseDown={()=>mb(key,true)}
      onMouseUp={()=>mb(key,false)}
      onMouseLeave={()=>mb(key,false)}
    >{lbl}</button>
  );

  const controlBar=(
    <div style={{
      background:GRN,
      borderTop:`3px solid ${GLD}`,
      padding:'10px 16px',
      paddingBottom:'max(10px,env(safe-area-inset-bottom))',
      display:'flex',flexDirection:'column',gap:8,
    }}>
      {/* top row — fullscreen + joystick toggle (mobile only) */}
      <div style={{display:'flex',justifyContent:'center',gap:8,flexWrap:'wrap'}}>
        <button style={{...btnS(isFullscreen?'#e74c3c':GRN2,'#F5F0DC',160,28),fontSize:'0.4rem',borderRadius:4,border:`1px solid ${GLD}`}}
          onMouseDown={isFullscreen?exitFullscreen:enterFullscreen}
          onTouchStart={e=>{e.preventDefault();isFullscreen?exitFullscreen():enterFullscreen();}}>
          {isFullscreen?'✕ EXIT FULLSCREEN':'⛶ FULLSCREEN'}
        </button>
      </div>

      {/* main control row: ◀  [START]  ▶  [ATK] [JUMP] */}
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',gap:8}}>

        {/* LEFT */}
        {dpadBtn('◀','ArrowLeft',80,80)}

        {/* center: START */}
        <div style={{display:'flex',flexDirection:'column',gap:6,alignItems:'center'}}>
          <button style={btnS(GRN2,'#F5F0DC',80,38)}
            onTouchStart={e=>{e.preventDefault();mb('start',true);}}
            onTouchEnd={e=>e.preventDefault()}
            onContextMenu={e=>e.preventDefault()}
            onMouseDown={()=>mb('start',true)}>
            <span style={{fontSize:'0.42rem'}}>START</span>
          </button>
          {!isMobile&&(
            <div style={{fontFamily:'"Press Start 2P"',fontSize:'0.26rem',color:`rgba(226,168,32,0.4)`,textAlign:'center',lineHeight:1.9}}>
              ←→ MOVE<br/>SPACE JUMP<br/>Z ATTACK
            </div>
          )}
        </div>

        {/* RIGHT */}
        {dpadBtn('▶','ArrowRight',80,80)}

        {/* action buttons */}
        <div style={{display:'flex',flexDirection:'column',gap:8}}>
          <button style={btnS('#8e44ad','#fff',88,62)}
            onTouchStart={e=>{e.preventDefault();mb('attack',true);}}
            onTouchEnd={e=>e.preventDefault()}
            onContextMenu={e=>e.preventDefault()}
            onMouseDown={()=>mb('attack',true)}>
            <span style={{fontSize:'0.52rem'}}>⚔ ATK</span>
          </button>
          <button style={btnS('#e74c3c','#fff',88,62)}
            onTouchStart={e=>{e.preventDefault();mb('jump',true);}}
            onTouchEnd={e=>e.preventDefault()}
            onContextMenu={e=>e.preventDefault()}
            onMouseDown={()=>mb('jump',true)}>
            <span style={{fontSize:'0.52rem'}}>▲ JUMP</span>
          </button>
        </div>

      </div>
    </div>
  );

  if(isFullscreen){
    return(
      <div style={{position:'fixed',inset:0,zIndex:9999,background:'#000',display:'flex',flexDirection:'column'}}>
        <div style={{flex:1,display:'flex',alignItems:'center',justifyContent:'center',background:'#000'}}>
          <canvas ref={canvasRef} width={780} height={520}
            style={{maxWidth:'100%',maxHeight:'100%',imageRendering:'pixelated',display:'block'}}/>
        </div>
        {controlBar}
      </div>
    );
  }

  return(
    <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:'0.5rem'}}>
      <div style={{
        border:`4px solid ${GLD}`,
        boxShadow:`4px 4px 0 #000`,
        background:'#000',width:'100%',maxWidth:780,
      }}>
        <canvas ref={canvasRef} width={780} height={520}
          style={{width:'100%',display:'block',imageRendering:'pixelated'}}/>
      </div>
      {controlBar}
      <div style={{fontFamily:'"Press Start 2P"',fontSize:'0.33rem',color:`rgba(226,168,32,0.3)`,textAlign:'center'}}>
        ←→ MOVE &nbsp;|&nbsp; SPACE JUMP &nbsp;|&nbsp; Z ATTACK &nbsp;|&nbsp; ENTER START
      </div>
    </div>
  );
}
