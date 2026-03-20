import { useEffect, useRef, useState } from 'react';
import { C } from '../data/constants';
import { LEVELS } from './game/levels.jsx';
import { drawCharSprite, drawPizzaSlice, drawTaco, drawEnemySprite, drawBossSprite } from './game/sprites.jsx';

const W = 780;
const H = 520;
const GROUND_TOP = H - 200;
const GROUND_BOT = H - 80;
const LANE_H = GROUND_BOT - GROUND_TOP;
const PW = 24;
const PH = 32;
const GRAVITY = 0.55;
const JUMP_POWER = -12;
const SONG_FILE = '/kylesong.mp3';
const SONG_VOLUME = 0.5;
const MAX_HP = 100;
const ATTACK_RANGE = 52;
const ATTACK_DMG = 20;
const ATTACK_FRAMES = 16;
const BOSS_HP = 220;

// Weapons
const WEAPON_TYPES = ['gun','knife'];

export default function PizzaGame() {
  const canvasRef = useRef(null);
  const gameRef = useRef({});
  const [uiState, setUiState] = useState({ state:'title', score:0, hp:MAX_HP, pizza:0, level:1 });
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [useJoystick, setUseJoystick] = useState(false);
  const joystickRef = useRef({ active:false, startX:0, startY:0, dx:0, dy:0 });

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768 || 'ontouchstart' in window);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const music = new Audio(SONG_FILE);
    music.loop = true;
    music.volume = SONG_VOLUME;

    let gState='title';
    let sc=0, pc=0, levelIdx=0;
    let frame=0, scrollX=0, spT=0, piT=0, wT=0, highSc=0;
    let obs=[], pizzas=[], weapons=[], parts=[], blds=[];
    let keys={}, charIdx=0, selectedChar=0;
    let boss=null, bossHp=BOSS_HP;
    let transitionTimer=0;
    let attackPressed=false;

    // Weapon system
    let heldWeapon=null; // {type, ammo}
    let weaponCooldown=0;

    const pl={
      x:120, y:GROUND_BOT-PH,
      vx:0, vy:0, airborne:false,
      face:1, inv:0, hp:MAX_HP,
      attacking:0, attackFrame:0, // attackFrame cycles punch/kick
      attackHit:[],
      combo:0, comboTimer:0,
      punchLeg:0, // alternates 0=right punch, 1=left punch, 2=right kick, 3=left kick
    };

    const sync=()=>setUiState({state:gState,score:sc,hp:pl.hp,pizza:pc,level:levelIdx+1});
    const cfg=()=>LEVELS[levelIdx];

    function reset() {
      Object.assign(pl,{x:120,y:GROUND_BOT-PH,vx:0,vy:0,airborne:false,inv:0,hp:MAX_HP,attacking:0,attackFrame:0,attackHit:[],combo:0,comboTimer:0,punchLeg:0});
      obs=[];pizzas=[];weapons=[];parts=[];blds=[];
      boss=null;bossHp=BOSS_HP;heldWeapon=null;weaponCooldown=0;
      scrollX=0;spT=0;piT=0;wT=0;
      for(let i=0;i<30;i++) blds.push(mkBld(i*140+200));
    }

    function start() {
      sc=0;pc=0;levelIdx=0;charIdx=selectedChar;
      reset();gState='playing';
      music.currentTime=0;music.play().catch(()=>{});sync();
    }

    function respawn() {
      Object.assign(pl,{x:120,y:GROUND_BOT-PH,vx:0,vy:0,airborne:false,inv:200,hp:MAX_HP,attacking:0,attackFrame:0,attackHit:[],combo:0,comboTimer:0,punchLeg:0});
      heldWeapon=null;charIdx=selectedChar;
      gState='playing';music.play().catch(()=>{});sync();
    }

    function jump() { if(!pl.airborne){pl.vy=JUMP_POWER;pl.airborne=true;} }

    function attack() {
      if(pl.attacking>0) return;
      pl.attacking=ATTACK_FRAMES;
      pl.attackHit=[];
      pl.punchLeg=(pl.punchLeg+1)%4; // cycle through punch/kick animations
      if(heldWeapon) {
        fireWeapon();
      } else {
        doMeleeHit();
      }
    }

    function fireWeapon() {
      if(!heldWeapon||weaponCooldown>0) return;
      if(heldWeapon.type==='gun') {
        weaponCooldown=12;
        heldWeapon.ammo--;
        // gun bullet travels across screen
        const bx=pl.face===1?pl.x+PW:pl.x;
        const by=pl.y+PH/2;
        addParts(bx,by,'#ffe066',3);
        // instant hit check across whole lane
        obs.forEach(o=>{
          if(o.dead) return;
          const ox=o.x-scrollX;
          if(pl.face===1?ox>pl.x:ox<pl.x+PW){
            if(o.y<by+10&&o.y+o.h>by-10){
              o.hp=(o.hp||2)-2;o.hitFlash=10;
              if(o.hp<=0){o.dead=true;o.deadTimer=30;sc+=300+pl.combo*50;pl.combo++;pl.comboTimer=90;addParts(ox+o.w/2,o.y,C.gold,12);}
              sync();
            }
          }
        });
        if(boss&&!boss.dead){
          const bOx=boss.x-scrollX;
          const inLine=pl.face===1?bOx>pl.x:bOx<pl.x+PW;
          if(inLine&&boss.y<by+20&&boss.y+boss.h>by-20){
            bossHp=Math.max(0,bossHp-ATTACK_DMG*1.5);boss.hitFlash=10;
            sc+=200;addParts(bOx+boss.w/2,boss.y+boss.h/2,C.gold,10);
            if(bossHp<=0){boss.dead=true;boss.deadTimer=90;sc+=3000;addParts(bOx+boss.w/2,boss.y+boss.h/2,'#FFD700',50);}
            sync();
          }
        }
        if(heldWeapon.ammo<=0) heldWeapon=null;
      } else if(heldWeapon.type==='knife') {
        weaponCooldown=8;
        heldWeapon.ammo--;
        doMeleeHit(1.8); // knife does more damage
        if(heldWeapon.ammo<=0) heldWeapon=null;
      }
    }

    function doMeleeHit(dmgMult=1) {
      const ax=pl.face===1?pl.x+PW:pl.x-ATTACK_RANGE;
      const ay=pl.y;
      obs.forEach(o=>{
        if(o.dead||pl.attackHit.includes(o.id)) return;
        const ox=o.x-scrollX;
        if(ox+o.w>ax&&ox<ax+ATTACK_RANGE&&o.y+o.h>ay&&o.y<ay+PH+10){
          o.hp=(o.hp||2)-Math.round(1*dmgMult);
          o.hitFlash=10;pl.attackHit.push(o.id);
          if(o.hp<=0){
            o.dead=true;o.deadTimer=30;
            sc+=200+pl.combo*50;pl.combo++;pl.comboTimer=90;
            addParts(ox+o.w/2,o.y,C.gold,10);
          } else {
            o.vx=(pl.face===1?3:-3);
            addParts(ox+o.w/2,o.y+o.h/2,'#fff',4);
          }
          sync();
        }
      });
      if(boss&&!boss.dead&&boss.inv===0){
        const bOx=boss.x-scrollX;
        if(bOx+boss.w>ax&&bOx<ax+ATTACK_RANGE&&boss.y+boss.h>ay&&boss.y<ay+PH+10){
          bossHp=Math.max(0,bossHp-ATTACK_DMG*dmgMult);boss.inv=18;boss.hitFlash=10;
          sc+=100;pl.combo++;pl.comboTimer=90;
          addParts(bOx+boss.w/2,boss.y,C.gold,12);
          if(bossHp<=0){boss.dead=true;boss.deadTimer=90;sc+=3000;addParts(bOx+boss.w/2,boss.y+boss.h/2,'#FFD700',50);}
          sync();
        }
      }
    }

    let enemyId=0;
    function mkBld(x) {
      const c=cfg();
      const awningCols=['#c0392b','#2980b9','#27ae60','#8e44ad','#e67e22'];
      let specialType=null;
      if(levelIdx===0){const r=Math.random();if(r<0.1)specialType='grove';else if(r<0.2)specialType='hyperion';else if(r<0.32)specialType='ypsi';}
      else if(levelIdx===1){const r=Math.random();if(r<0.1)specialType='standrews';else if(r<0.18)specialType='checker';else if(r<0.26)specialType='rencen';}
      else if(levelIdx===2){if(Math.random()<0.22)specialType='mexican';}
      return {x,w:55+Math.random()*85,h:80+Math.random()*140,color:c.buildingCols[Math.floor(Math.random()*c.buildingCols.length)],wc:Math.floor(Math.random()*4)+2,wr:Math.floor(Math.random()*3)+2,specialType,awningCol:awningCols[Math.floor(Math.random()*awningCols.length)]};
    }

    function spawnEnemy() {
      if(boss&&!boss.dead) return;
      const c=cfg();
      const r=Math.random();
      // rats are smaller, others are similar size to player
      const type=r<0.15?'cone':r<0.38?'metermaid':r<0.62?'muscledude':r<0.82?'biker':'rat';
      const laneY=GROUND_TOP+20+Math.random()*(LANE_H-60);
      const fromLeft=Math.random()<0.3;
      const isRat=type==='rat';
      const isCone=type==='cone';
      // rats are smaller, enemies are player-sized
      const ew=isRat?12:(isCone?18:24);
      const eh=isRat?10:(isCone?26:32);
      obs.push({
        id:enemyId++,type,
        x:isCone?(scrollX+W+40+Math.random()*200):(fromLeft?(scrollX-60):(scrollX+W+60)),
        y:laneY,w:ew,h:eh,
        vx:isCone?0:(fromLeft?c.enemySpeed:-c.enemySpeed),
        vy:0,at:0,dead:false,deadTimer:0,
        hp:type==='muscledude'||type==='biker'?3:isRat?1:2,
        hitFlash:0,
      });
    }

    function spawnCollectible() {
      if(boss&&!boss.dead) return;
      const laneY=GROUND_TOP+30+Math.random()*(LANE_H-60);
      pizzas.push({x:scrollX+W+80,y:laneY,bob:Math.random()*Math.PI*2,collected:false,type:cfg().collectible});
    }

    function spawnWeapon() {
      if(boss&&!boss.dead) return;
      const laneY=GROUND_TOP+40+Math.random()*(LANE_H-70);
      const type=WEAPON_TYPES[Math.floor(Math.random()*WEAPON_TYPES.length)];
      weapons.push({x:scrollX+W+120,y:laneY,type,bob:Math.random()*Math.PI*2,collected:false});
    }

    function triggerBoss() {
      obs=[];pizzas=[];weapons=[];
      bossHp=BOSS_HP;
      const types=['landlord','ratking','recordexec'];
      boss={type:types[levelIdx],x:scrollX+W+100,y:GROUND_TOP+LANE_H/2-40,w:70,h:90,vx:-(1.5+levelIdx*0.3),vy:0,at:0,inv:0,hitFlash:0,dead:false,deadTimer:0};
    }

    function addParts(x,y,col,n) {
      for(let i=0;i<n;i++) parts.push({x,y,vx:(Math.random()-0.5)*7,vy:(Math.random()-0.5)*6-2,life:40+Math.random()*20,ml:60,col,sz:3+Math.random()*4});
    }

    function drawShadow(x,y,w,scale=1) {
      ctx.fillStyle='rgba(0,0,0,0.2)';
      ctx.beginPath();ctx.ellipse(x+w/2,GROUND_BOT-2,w*0.5*scale,4*scale,0,0,Math.PI*2);ctx.fill();
    }

    // ── DRAW WEAPON ON GROUND
    function drawWeaponPickup(wp) {
      const ox=wp.x-scrollX;
      if(ox>W+60||ox<-60) return;
      const bob=Math.sin(frame*0.06+wp.bob)*4;
      const wy=wp.y+bob;
      ctx.save();
      if(wp.type==='gun') {
        // pixel gun
        ctx.fillStyle='#555'; ctx.fillRect(ox,wy+4,12,6);
        ctx.fillStyle='#444'; ctx.fillRect(ox+8,wy+2,4,4);
        ctx.fillStyle='#666'; ctx.fillRect(ox+2,wy+8,4,4);
        ctx.fillStyle='#888'; ctx.fillRect(ox+1,wy+4,2,3);
      } else {
        // pixel knife
        ctx.fillStyle='#aaa'; ctx.fillRect(ox+2,wy+2,2,10);
        ctx.fillStyle='#ccc'; ctx.fillRect(ox+3,wy+2,1,8);
        ctx.fillStyle='#8B4513'; ctx.fillRect(ox,wy+10,5,4);
        ctx.fillStyle='#666'; ctx.fillRect(ox-1,wy+9,7,2);
      }
      // glow
      ctx.fillStyle='rgba(52,152,219,0.6)';
      ctx.font='8px "Press Start 2P"';ctx.textAlign='center';
      ctx.fillText(wp.type==='gun'?'🔫':'🔪',ox+6,wy-2);
      ctx.restore();
    }

    // ── DRAW WEAPON HELD
    function drawHeldWeapon() {
      if(!heldWeapon) return;
      const wx=pl.face===1?pl.x+PW+2:pl.x-14;
      const wy=pl.y+PH/2-4;
      ctx.save();
      if(pl.face===-1){ctx.translate(wx+12,0);ctx.scale(-1,1);ctx.translate(-wx,0);}
      if(heldWeapon.type==='gun') {
        ctx.fillStyle='#555'; ctx.fillRect(wx,wy+2,14,7);
        ctx.fillStyle='#444'; ctx.fillRect(wx+10,wy,4,4);
        ctx.fillStyle='#666'; ctx.fillRect(wx+2,wy+7,5,4);
        ctx.fillStyle='#888'; ctx.fillRect(wx+1,wy+2,2,4);
        // muzzle flash during attack
        if(pl.attacking>ATTACK_FRAMES-4){
          ctx.fillStyle='rgba(255,220,0,0.9)';
          ctx.beginPath();ctx.arc(wx+14,wy+5,5,0,Math.PI*2);ctx.fill();
        }
        // ammo count
        ctx.fillStyle='#ffe066';ctx.font='6px "Press Start 2P"';ctx.textAlign='center';
        ctx.fillText(heldWeapon.ammo,wx+7,wy-2);
      } else {
        // knife held — rotated when attacking
        const angle=pl.attacking>0?0.8:0.3;
        ctx.translate(wx+3,wy+6);ctx.rotate(angle);ctx.translate(-3,-6);
        ctx.fillStyle='#bbb'; ctx.fillRect(0,0,3,12);
        ctx.fillStyle='#ddd'; ctx.fillRect(1,0,1,10);
        ctx.fillStyle='#8B4513'; ctx.fillRect(-1,11,5,5);
        ctx.fillStyle='#777'; ctx.fillRect(-2,10,7,2);
        ctx.fillStyle='#ffe066';ctx.font='6px "Press Start 2P"';ctx.textAlign='center';
        ctx.fillText(heldWeapon.ammo,3,-4);
      }
      ctx.restore();
    }

    // ── DRAW PLAYER with punch/kick animation
    function drawPlayer() {
      if(pl.inv>0&&Math.floor(pl.inv/5)%2===0) return;
      ctx.save();
      if(pl.face===-1){ctx.translate(pl.x+PW,0);ctx.scale(-1,1);ctx.translate(-pl.x,0);}

      const isAtk=pl.attacking>0;
      const atkProg=isAtk?(ATTACK_FRAMES-pl.attacking)/ATTACK_FRAMES:0;
      const limbSwing=isAtk?Math.sin(atkProg*Math.PI)*14:Math.sin(frame*0.18)*4;
      const punchKick=pl.punchLeg%4; // 0=right punch,1=left punch,2=right kick,3=left kick

      // draw base character
      drawCharSprite(ctx, charIdx, pl.x, pl.y, PW, C);

      // draw attack limb overlay
      if(isAtk&&atkProg<0.9){
        ctx.strokeStyle='rgba(255,255,255,0.5)';ctx.lineWidth=2;
        if(punchKick===0||punchKick===1){
          // PUNCH — arm extends forward
          const armX=pl.x+(punchKick===0?PW+2:pl.x-8);
          const armY=pl.y+PH*0.35;
          ctx.fillStyle=punchKick===0?'#e0c090':'#c49a6c';
          ctx.fillRect(pl.x+PW,armY,limbSwing*0.8,5);
          // fist
          ctx.fillStyle='#c49060';
          ctx.fillRect(pl.x+PW+limbSwing*0.8-1,armY-1,7,7);
          // impact flash
          if(atkProg>0.5&&atkProg<0.8){
            ctx.fillStyle='rgba(255,255,100,0.7)';
            ctx.beginPath();ctx.arc(pl.x+PW+limbSwing*0.8+6,armY+3,6,0,Math.PI*2);ctx.fill();
          }
        } else {
          // KICK — leg extends forward  
          const legY=pl.y+PH*0.65;
          ctx.fillStyle='#1c1c2c';
          ctx.fillRect(pl.x+PW-2,legY,limbSwing*0.9,6);
          // foot/shoe
          ctx.fillStyle='#111';
          ctx.fillRect(pl.x+PW+limbSwing*0.9-2,legY-2,10,8);
          if(atkProg>0.5&&atkProg<0.8){
            ctx.fillStyle='rgba(255,100,100,0.6)';
            ctx.beginPath();ctx.arc(pl.x+PW+limbSwing*0.9+8,legY+2,7,0,Math.PI*2);ctx.fill();
          }
        }
      }
      ctx.restore();
      drawHeldWeapon();
    }

    function drawBackground() {
      const c=cfg();
      if(c.daytime){
        const sg=ctx.createLinearGradient(0,0,0,GROUND_TOP);
        sg.addColorStop(0,'#4a90d9');sg.addColorStop(1,'#87ceeb');
        ctx.fillStyle=sg;ctx.fillRect(0,0,W,GROUND_TOP);
        ctx.fillStyle='#FFD700';ctx.beginPath();ctx.arc(W-90,55,26,0,Math.PI*2);ctx.fill();
        ctx.fillStyle='rgba(255,215,0,0.22)';ctx.beginPath();ctx.arc(W-90,55,38,0,Math.PI*2);ctx.fill();
        ctx.fillStyle='rgba(255,255,255,0.9)';
        [[100,70,32],[280,50,24],[460,80,28],[640,60,22]].forEach(([cx,cy,r])=>{
          const cloudX=((cx-scrollX*0.03+W*3)%(W+100))-50;
          ctx.beginPath();ctx.arc(cloudX,cy,r,0,Math.PI*2);ctx.fill();
          ctx.beginPath();ctx.arc(cloudX+r*0.6,cy+5,r*0.6,0,Math.PI*2);ctx.fill();
        });
      } else {
        const sg=ctx.createLinearGradient(0,0,0,GROUND_TOP);
        sg.addColorStop(0,c.skyTop);sg.addColorStop(1,c.skyBot);
        ctx.fillStyle=sg;ctx.fillRect(0,0,W,GROUND_TOP);
        for(let i=0;i<40;i++){
          const sx=((i*137+scrollX*0.05)%(W+40)+W+40)%(W+40),sy=(i*73)%(GROUND_TOP*0.8);
          ctx.fillStyle=Math.sin(frame*0.03+i)>0.4?c.starColor:'rgba(212,160,23,0.1)';
          ctx.fillRect(sx,sy,2,2);
        }
        ctx.fillStyle=c.moonColor;ctx.beginPath();ctx.arc(W-65,45,18,0,Math.PI*2);ctx.fill();
        ctx.fillStyle=c.skyTop;ctx.beginPath();ctx.arc(W-56,39,15,0,Math.PI*2);ctx.fill();
      }
      const farCol=c.daytime?'rgba(80,120,60,0.5)':c.skyTop;
      ctx.fillStyle=farCol;
      for(let i=0;i<10;i++){const bx=((i*105-scrollX*0.1)%(W+200)+W+200)%(W+200)-100;ctx.fillRect(bx,GROUND_TOP-45-(i%4)*22,40+(i%3)*14,45+(i%4)*22);}
    }

    function drawLane() {
      const c=cfg();
      ctx.fillStyle=c.daytime?'#c8b89a':c.groundColor;ctx.fillRect(0,GROUND_TOP,W,8);
      const floorGrad=ctx.createLinearGradient(0,GROUND_TOP,0,GROUND_BOT);
      if(c.daytime){floorGrad.addColorStop(0,'#d4c4a0');floorGrad.addColorStop(0.5,'#b8a880');floorGrad.addColorStop(1,'#a09060');}
      else if(levelIdx===1){floorGrad.addColorStop(0,'#1a2a1a');floorGrad.addColorStop(1,'#0a120a');}
      else if(levelIdx===2){floorGrad.addColorStop(0,'#3a1a08');floorGrad.addColorStop(1,'#1a0a04');}
      else{floorGrad.addColorStop(0,'#1a1a2e');floorGrad.addColorStop(1,'#0d0d1a');}
      ctx.fillStyle=floorGrad;ctx.fillRect(0,GROUND_TOP+8,W,LANE_H-8);
      ctx.strokeStyle=c.daytime?'rgba(0,0,0,0.07)':'rgba(255,255,255,0.03)';ctx.lineWidth=1;
      for(let row=0;row<8;row++){const y=GROUND_TOP+8+row*(LANE_H-8)/8;ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(W,y);ctx.stroke();}
      ctx.fillStyle=c.groundLine;ctx.fillRect(0,GROUND_BOT-4,W,6);
      ctx.fillStyle=c.streetColor||'#111';ctx.fillRect(0,GROUND_BOT+2,W,H-GROUND_BOT-2);
      ctx.fillStyle=c.laneColor;
      for(let i=0;i<W;i+=56){const dx=((i-scrollX*0.6)%56+56)%56;ctx.fillRect(dx,GROUND_BOT+12,36,3);}
    }

    function drawBuilding(b) {
      const c=cfg();const bx=b.x-scrollX*0.85;
      if(bx>W+200||bx+b.w<-200) return;
      if(b.specialType==='grove'){
        ctx.fillStyle='#2a2a2a';ctx.fillRect(bx,GROUND_TOP-110,90,110);
        ctx.strokeStyle='#444';ctx.lineWidth=2;ctx.strokeRect(bx,GROUND_TOP-110,90,110);
        ctx.fillStyle='rgba(150,200,255,0.3)';ctx.fillRect(bx+8,GROUND_TOP-88,74,52);
        ctx.fillStyle='#cc0000';ctx.fillRect(bx+4,GROUND_TOP-110,82,20);
        ctx.fillStyle='#fff';ctx.font='bold 7px "Press Start 2P"';ctx.textAlign='center';
        ctx.fillText('GROVE',bx+45,GROUND_TOP-102);ctx.font='5px "Press Start 2P"';ctx.fillText('STUDIOS',bx+45,GROUND_TOP-94);
        ctx.fillStyle='#ffe066';for(let i=0;i<6;i++){ctx.beginPath();ctx.arc(bx+8+i*14,GROUND_TOP-113+Math.sin(frame*0.04+i)*2,2,0,Math.PI*2);ctx.fill();}
        return;
      }
      if(b.specialType==='hyperion'){
        ctx.fillStyle='#4a3020';ctx.fillRect(bx,GROUND_TOP-100,80,100);
        ctx.fillStyle='rgba(255,200,100,0.4)';ctx.fillRect(bx+6,GROUND_TOP-78,68,48);
        ctx.fillStyle='#1a5a4a';ctx.fillRect(bx+4,GROUND_TOP-100,72,22);
        ctx.fillStyle='#fff';ctx.font='bold 7px "Press Start 2P"';ctx.textAlign='center';
        ctx.fillText('HYPERION',bx+40,GROUND_TOP-92);ctx.font='5px "Press Start 2P"';ctx.fillText('COFFEE',bx+40,GROUND_TOP-84);
        return;
      }
      if(b.specialType==='ypsi'){
        ctx.fillStyle=b.color;ctx.fillRect(bx,GROUND_TOP-110,b.w,110);
        ctx.fillStyle='rgba(200,220,255,0.22)';ctx.fillRect(bx+4,GROUND_TOP-72,b.w-8,46);
        ctx.strokeStyle='#333';ctx.lineWidth=2;ctx.strokeRect(bx+4,GROUND_TOP-72,b.w-8,46);
        ctx.fillStyle=b.awningCol;ctx.fillRect(bx,GROUND_TOP-78,b.w,8);
        ctx.fillStyle='#ffe066';
        for(let i=0;i<6;i++){
          const lx=bx+4+i*(b.w-8)/5,ly=GROUND_TOP-112+Math.sin(i*1.3)*3;
          if(Math.sin(frame*0.04+i)>0){ctx.shadowBlur=4;ctx.shadowColor='#ffe066';}
          ctx.beginPath();ctx.arc(lx,ly,2,0,Math.PI*2);ctx.fill();ctx.shadowBlur=0;
        }
        return;
      }
      if(b.specialType==='standrews'){
        ctx.fillStyle='#2a1a10';ctx.fillRect(bx,GROUND_TOP-155,100,155);
        ctx.fillStyle='rgba(0,0,0,0.15)';
        for(let r=0;r<18;r++) for(let cc=0;cc<6;cc++){if((r+cc)%2===0)ctx.fillRect(bx+cc*16+(r%2)*8,GROUND_TOP-155+r*8,14,6);}
        ctx.fillStyle='#111';ctx.fillRect(bx+2,GROUND_TOP-110,96,24);
        ctx.fillStyle='#ffe066';for(let i=0;i<10;i++){if(Math.floor(frame/8+i)%2===0){ctx.beginPath();ctx.arc(bx+6+i*9,GROUND_TOP-100,3,0,Math.PI*2);ctx.fill();}}
        ctx.fillStyle='#fff';ctx.font='bold 7px "Press Start 2P"';ctx.textAlign='center';
        ctx.fillText('ST. ANDREWS',bx+50,GROUND_TOP-118);ctx.font='5px "Press Start 2P"';ctx.fillText('HALL',bx+50,GROUND_TOP-110);
        for(let i=0;i<4;i++){ctx.fillStyle=Math.sin(frame*0.02+i)>0?'#ffe066':'#111';ctx.fillRect(bx+8+i*22,GROUND_TOP-148,14,20);}
        return;
      }
      if(b.specialType==='checker'){
        ctx.fillStyle='#1a1a1a';ctx.fillRect(bx,GROUND_TOP-100,88,100);
        const sq=8;for(let r=0;r<3;r++) for(let cc=0;cc<11;cc++){ctx.fillStyle=(r+cc)%2===0?'#fff':'#111';ctx.fillRect(bx+cc*sq,GROUND_TOP-100+r*sq,sq,sq);}
        ctx.fillStyle='#cc0000';ctx.shadowBlur=6;ctx.shadowColor='#ff0000';ctx.fillRect(bx+4,GROUND_TOP-72,80,18);ctx.shadowBlur=0;
        ctx.fillStyle='#fff';ctx.font='bold 6px "Press Start 2P"';ctx.textAlign='center';ctx.fillText('CHECKER BAR',bx+44,GROUND_TOP-60);
        return;
      }
      if(b.specialType==='rencen'){
        ctx.fillStyle='#1a2a1a';ctx.fillRect(bx+20,GROUND_TOP-210,30,210);
        for(let i=0;i<4;i++){const offX=[0,50,0,50][i];ctx.fillStyle='#152315';ctx.fillRect(bx+offX,GROUND_TOP-140,20,140);}
        for(let r=0;r<8;r++) for(let cc=0;cc<2;cc++){ctx.fillStyle=Math.sin(frame*0.02+r+cc)>0?'#D4A017':'#0a1506';ctx.fillRect(bx+24+cc*12,GROUND_TOP-204+r*24,8,14);}
        ctx.fillStyle='#D4A017';ctx.font='6px "Press Start 2P"';ctx.textAlign='center';ctx.fillText('REN CEN',bx+35,GROUND_TOP-215);
        return;
      }
      if(b.specialType==='mexican'){
        ctx.fillStyle=b.color;ctx.fillRect(bx,GROUND_TOP-b.h,b.w,b.h);
        ctx.fillStyle='rgba(0,0,0,0.18)';
        for(let r=0;r<Math.floor(b.h/8);r++) for(let cc=0;cc<Math.floor(b.w/16);cc++){if((r+cc)%2===0)ctx.fillRect(bx+cc*16+(r%2)*8,GROUND_TOP-b.h+r*8,14,6);}
        ctx.fillStyle=b.awningCol;ctx.fillRect(bx,GROUND_TOP-b.h*0.38,b.w,9);
        const flagCols=['#e74c3c','#f39c12','#2ecc71','#3498db','#9b59b6','#fff'];
        for(let i=0;i<8;i++){ctx.fillStyle=flagCols[i%flagCols.length];ctx.fillRect(bx+4+i*(b.w-8)/7,GROUND_TOP-b.h+4+Math.sin(frame*0.03+i)*3,8,11);}
        for(let r=0;r<b.wr;r++) for(let cc=0;cc<b.wc;cc++){const wx=bx+8+cc*17,wy=GROUND_TOP-b.h+18+r*22;if(wx+10<bx+b.w-4){ctx.fillStyle=Math.sin(frame*0.013+r+cc+b.x*0.01)>0?'#f39c12':'#050505';ctx.fillRect(wx,wy,10,10);}}
        return;
      }
      ctx.fillStyle=b.color;ctx.fillRect(bx,GROUND_TOP-b.h,b.w,b.h);
      ctx.strokeStyle='#000';ctx.lineWidth=1;ctx.strokeRect(bx,GROUND_TOP-b.h,b.w,b.h);
      if(levelIdx===0&&b.w>58){ctx.fillStyle=b.awningCol||'#c0392b';ctx.fillRect(bx,GROUND_TOP-b.h*0.35,b.w,7);}
      const wc=cfg().windowColor;
      for(let r=0;r<b.wr;r++) for(let cc=0;cc<b.wc;cc++){
        const wx=bx+8+cc*17,wy=GROUND_TOP-b.h+18+r*22;
        if(wx+10<bx+b.w-4){const lit=Math.sin(frame*0.013+r*1.8+cc*0.9+b.x*0.01)>0;ctx.fillStyle=lit?wc:'#050505';if(lit){ctx.shadowBlur=4;ctx.shadowColor=wc;}ctx.fillRect(wx,wy,10,10);ctx.shadowBlur=0;}
      }
    }

    function drawHUD() {
      const c=cfg();
      ctx.fillStyle='rgba(0,0,0,0.8)';ctx.fillRect(0,0,W,52);
      ctx.fillStyle='#E2A820';ctx.font='11px "Press Start 2P"';ctx.textAlign='left';ctx.fillText('SCORE:'+sc,12,18);
      if(highSc>0){ctx.fillStyle='#c8b830';ctx.font='8px "Press Start 2P"';ctx.fillText('BEST:'+highSc,12,34);}
      const hpW=160;
      ctx.fillStyle='#111';ctx.fillRect(W/2-hpW/2-2,8,hpW+4,16);
      const hpCol=pl.hp>60?'#2ecc71':pl.hp>30?'#f39c12':'#e74c3c';
      ctx.fillStyle=hpCol;ctx.fillRect(W/2-hpW/2,10,Math.max(0,hpW*(pl.hp/MAX_HP)),12);
      ctx.strokeStyle='#E2A820';ctx.lineWidth=1;ctx.strokeRect(W/2-hpW/2-2,8,hpW+4,16);
      ctx.fillStyle='#fff';ctx.font='7px "Press Start 2P"';ctx.textAlign='center';ctx.fillText('HP',W/2,22);
      ctx.fillStyle='#F5F0DC';ctx.font='8px "Press Start 2P"';ctx.fillText('LVL '+(levelIdx+1)+' · '+c.name,W/2,38);
      // weapon indicator
      if(heldWeapon){
        ctx.fillStyle='#3498db';ctx.font='7px "Press Start 2P"';ctx.textAlign='left';
        ctx.fillText((heldWeapon.type==='gun'?'🔫':'🔪')+' x'+heldWeapon.ammo,12,48);
      }
      if(!boss||boss.dead){
        const label=c.collectible==='taco'?'🌮':'🍕';
        ctx.fillStyle='#c8b830';ctx.textAlign='right';ctx.font='10px "Press Start 2P"';
        ctx.fillText(label+' '+pc+'/'+c.collectTarget,W-12,18);
        for(let i=0;i<c.collectTarget;i++){ctx.fillStyle=i<pc?'#FF8C00':'#222';ctx.fillRect(W-12-c.collectTarget*11+i*11,26,9,12);}
      } else {
        const bhpW=200;
        ctx.fillStyle='#111';ctx.fillRect(W-bhpW-14,8,bhpW+4,16);
        ctx.fillStyle='#e74c3c';ctx.fillRect(W-bhpW-12,10,Math.max(0,bhpW*(bossHp/BOSS_HP)),12);
        ctx.strokeStyle='#E2A820';ctx.lineWidth=1;ctx.strokeRect(W-bhpW-14,8,bhpW+4,16);
        const bnames={landlord:'LANDLORD',ratking:'RAT KING',recordexec:'RECORD EXEC'};
        ctx.fillStyle='#fff';ctx.font='7px "Press Start 2P"';ctx.textAlign='right';ctx.fillText(boss?bnames[boss.type]:'BOSS',W-14,38);
      }
      if(pl.combo>1&&pl.comboTimer>0){
        ctx.globalAlpha=Math.min(1,pl.comboTimer/20);
        ctx.fillStyle='#E2A820';ctx.font='14px "Press Start 2P"';ctx.textAlign='left';
        ctx.fillText(pl.combo+'x COMBO!',14,H-30);ctx.globalAlpha=1;
      }
    }

    function drawTitle() {
      ctx.fillStyle='#1C3D12';ctx.fillRect(0,0,W,H);
      for(let i=0;i<50;i++){const sx=(i*131+frame*0.3)%W,sy=(i*71)%(H*0.55);ctx.fillStyle=Math.sin(frame*0.04+i)>0.4?'#E2A820':'rgba(226,168,32,0.15)';ctx.fillRect(sx,sy,Math.sin(frame*0.06+i)>0.6?3:1,Math.sin(frame*0.06+i)>0.6?3:1);}
      ctx.fillStyle='rgba(0,0,0,0.85)';ctx.fillRect(W/2-290,H/2-195,580,388);
      ctx.strokeStyle='#E2A820';ctx.lineWidth=4;ctx.strokeRect(W/2-290,H/2-195,580,388);
      ctx.strokeStyle='#c8b830';ctx.lineWidth=1.5;ctx.strokeRect(W/2-284,H/2-189,568,376);
      ctx.fillStyle='#E2A820';ctx.font='20px "Press Start 2P"';ctx.textAlign='center';ctx.fillText('DETROIT PIZZA QUEST',W/2,H/2-148);
      ctx.fillStyle='#c8b830';ctx.font='11px "Press Start 2P"';ctx.fillText('— Team Cabin Edition —',W/2,H/2-116);
      ctx.fillStyle='#F5F0DC';ctx.font='9px "Press Start 2P"';
      ctx.fillText('3 LEVELS · 3 BOSSES · 1 CITY',W/2,H/2-84);
      ctx.fillText('ATTACK OR STOMP ENEMIES',W/2,H/2-62);
      ctx.fillText('PICK UP 🔫 GUNS & 🔪 KNIVES',W/2,H/2-40);
      ctx.fillText('COLLECT 16 SLICES → TRIGGER BOSS',W/2,H/2-4);
      ctx.fillStyle='rgba(226,168,32,0.5)';ctx.font='7px "Press Start 2P"';
      ctx.fillText('LVL1: YPSILANTI · LVL2: DETROIT · LVL3: MEXICANTOWN',W/2,H/2+24);
      if(Math.floor(frame/25)%2===0){ctx.fillStyle='#4A7A30';ctx.font='11px "Press Start 2P"';ctx.fillText('[ PRESS ENTER TO CHOOSE PLAYER ]',W/2,H/2+72);}
      if(highSc>0){ctx.fillStyle='#c8b830';ctx.font='9px "Press Start 2P"';ctx.fillText('HIGH SCORE: '+highSc,W/2,H/2+102);}
    }

    function drawCharSelect() {
      ctx.fillStyle='#1C3D12';ctx.fillRect(0,0,W,H);
      for(let i=0;i<50;i++){const sx=(i*137)%W,sy=(i*71)%(H*0.6);ctx.fillStyle=Math.sin(frame*0.04+i)>0.4?'#E2A820':'rgba(226,168,32,0.12)';ctx.fillRect(sx,sy,2,2);}
      ctx.fillStyle='#E2A820';ctx.font='20px "Press Start 2P"';ctx.textAlign='center';ctx.fillText('CHOOSE YOUR PLAYER',W/2,52);
      const chars=[{name:'STEVE',role:'Bass & Vocals',desc:'Bearded groove machine'},{name:'MIKE',role:'Drums',desc:'Everybody loves Mike'},{name:'KYLE',role:'Guitar & Vocals',desc:'Tall guitar genius'}];
      const cardW=210,cardH=380,gap=18,startX=(W-(cardW*3+gap*2))/2;
      chars.forEach((ch,i)=>{
        const cx=startX+i*(cardW+gap),cy=72,isSel=selectedChar===i;
        ctx.fillStyle=isSel?'rgba(226,168,32,0.15)':'rgba(0,0,0,0.5)';ctx.fillRect(cx,cy,cardW,cardH);
        ctx.strokeStyle=isSel?'#E2A820':'rgba(226,168,32,0.3)';ctx.lineWidth=isSel?4:2;ctx.strokeRect(cx,cy,cardW,cardH);
        if(isSel){ctx.shadowBlur=16;ctx.shadowColor='#E2A820';ctx.strokeRect(cx,cy,cardW,cardH);ctx.shadowBlur=0;}
        const scale=4;
        const spriteX=cx+cardW/2-(32*scale)/2;
        const spriteY=cy+40;
        ctx.save();ctx.translate(spriteX,spriteY);ctx.scale(scale,scale);drawCharSprite(ctx,i,0,0,22,C);ctx.restore();
        ctx.fillStyle=isSel?'#E2A820':'#F5F0DC';ctx.font=`${isSel?'13':'12'}px "Press Start 2P"`;ctx.textAlign='center';ctx.fillText(ch.name,cx+cardW/2,cy+cardH-62);
        ctx.fillStyle='#c8b830';ctx.font='9px "Press Start 2P"';ctx.fillText(ch.role,cx+cardW/2,cy+cardH-40);
        ctx.fillStyle='rgba(245,240,220,0.5)';ctx.font='8px "Press Start 2P"';ctx.fillText(ch.desc,cx+cardW/2,cy+cardH-18);
        if(isSel&&Math.floor(frame/20)%2===0){ctx.fillStyle='#E2A820';ctx.font='18px serif';ctx.fillText('▼',cx+cardW/2,cy-8);}
      });
      ctx.fillStyle='#F5F0DC';ctx.font='11px "Press Start 2P"';ctx.textAlign='center';ctx.fillText('← → TO SELECT     ENTER TO CONFIRM',W/2,H-18);
    }

    function drawLevelTransition() {
      const c=cfg();
      if(c.daytime){const sg=ctx.createLinearGradient(0,0,0,H);sg.addColorStop(0,'#4a90d9');sg.addColorStop(1,'#87ceeb');ctx.fillStyle=sg;ctx.fillRect(0,0,W,H);}
      else{const sg=ctx.createLinearGradient(0,0,0,H);sg.addColorStop(0,c.skyTop);sg.addColorStop(1,c.skyBot);ctx.fillStyle=sg;ctx.fillRect(0,0,W,H);}
      ctx.fillStyle='rgba(0,0,0,0.82)';ctx.fillRect(W/2-260,H/2-130,520,260);
      ctx.strokeStyle='#E2A820';ctx.lineWidth=4;ctx.strokeRect(W/2-260,H/2-130,520,260);
      ctx.fillStyle='#E2A820';ctx.font='14px "Press Start 2P"';ctx.textAlign='center';ctx.fillText('LEVEL '+(levelIdx+1),W/2,H/2-88);
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
      ctx.fillStyle='#1C3D12';ctx.fillRect(0,0,W,H);
      for(let i=0;i<30;i++){ctx.fillStyle=['#E2A820','#e74c3c','#F5F0DC','#4A7A30'][i%4];ctx.fillRect((i*137+frame*2.5)%W,(i*89+frame*1.5)%(H-60),8,8);}
      ctx.fillStyle='rgba(0,0,0,0.82)';ctx.fillRect(W/2-260,H/2-140,520,280);
      ctx.strokeStyle='#E2A820';ctx.lineWidth=4;ctx.strokeRect(W/2-260,H/2-140,520,280);
      ctx.fillStyle='#E2A820';ctx.font='17px "Press Start 2P"';ctx.textAlign='center';ctx.fillText('🍕 DETROIT CONQUERED! 🍕',W/2,H/2-100);
      ctx.fillStyle='#F5F0DC';ctx.font='11px "Press Start 2P"';
      ctx.fillText('THE BAND FEASTS TONIGHT',W/2,H/2-65);ctx.fillText('ALL 3 LEVELS COMPLETE',W/2,H/2-38);ctx.fillText('SCORE: '+sc,W/2,H/2-8);
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
        const joy=joystickRef.current;
        const joySpd=4.5;
        let joyX=0,joyY=0;
        if(joy.active){const dist=Math.sqrt(joy.dx*joy.dx+joy.dy*joy.dy);if(dist>8){joyX=joy.dx/Math.max(dist,40)*joySpd;joyY=joy.dy/Math.max(dist,40)*3;}}

        const spd=4.5;
        if(keys['ArrowLeft']||keys['KeyA']||joyX<-0.5){pl.vx=-spd;pl.face=-1;}
        else if(keys['ArrowRight']||keys['KeyD']||joyX>0.5){pl.vx=spd;pl.face=1;}
        else pl.vx*=0.5;
        if(keys['ArrowUp']||keys['KeyW']||(joyY<-0.5&&!pl.airborne)){pl.y=Math.max(GROUND_TOP+4,pl.y-3);}
        if(keys['ArrowDown']||keys['KeyS']||joyY>0.5){pl.y=Math.min(GROUND_BOT-PH,pl.y+3);}
        if(keys['Space']&&!pl.airborne) jump();
        if((keys['KeyZ']||keys['KeyJ'])&&!attackPressed){attackPressed=true;attack();}
        if(!keys['KeyZ']&&!keys['KeyJ']) attackPressed=false;

        pl.x+=pl.vx;
        if(pl.airborne){pl.vy+=GRAVITY;pl.y+=pl.vy;}
        const floorY=GROUND_BOT-PH;
        if(pl.airborne&&pl.y>=floorY){pl.y=floorY;pl.vy=0;pl.airborne=false;}
        if(pl.x<40)pl.x=40;if(pl.x>W-PW-40)pl.x=W-PW-40;
        if(pl.x>W*0.45){const s=pl.x-W*0.45;scrollX+=s;pl.x=W*0.45;}
        if(pl.inv>0)pl.inv--;
        if(pl.attacking>0){pl.attacking--;if(pl.attacking===ATTACK_FRAMES-3)doMeleeHit();}
        if(pl.comboTimer>0){pl.comboTimer--;if(pl.comboTimer===0)pl.combo=0;}

        const c=cfg();
        if(!boss||boss.dead){
          spT++;if(spT>=c.spawnRate){spawnEnemy();spT=0;}
          piT++;if(piT>=65){spawnCollectible();piT=0;}
          wT++;if(wT>=180){spawnWeapon();wT=0;} // weapon every 3 seconds
        }
        if(pc>=c.collectTarget&&!boss) triggerBoss();

        // weapon pickup
        weapons=weapons.filter(wp=>{
          if(wp.collected) return false;
          const ox=wp.x-scrollX;
          if(ox<-80) return false;
          const bob=Math.sin(frame*0.06+wp.bob)*4;
          if(pl.x<ox+16&&pl.x+PW>ox&&pl.y<wp.y+bob+20&&pl.y+PH>wp.y+bob){
            wp.collected=true;
            heldWeapon={type:wp.type,ammo:wp.type==='gun'?8:5};
            addParts(ox+8,wp.y,'#3498db',10);
            return false;
          }
          return true;
        });

        // boss AI
        if(boss&&!boss.dead){
          boss.at++;if(boss.inv>0)boss.inv--;if(boss.hitFlash>0)boss.hitFlash--;
          const bOx=boss.x-scrollX;
          const dx=pl.x-bOx,dy=pl.y-boss.y;
          const dist=Math.sqrt(dx*dx+dy*dy);
          const sp2=1.4+levelIdx*0.3;
          if(dist>5){boss.x+=dx/dist*sp2;boss.y+=dy/dist*sp2;}
          if(bOx<60)boss.x=scrollX+60;if(bOx>W-boss.w-60)boss.x=scrollX+W-boss.w-60;
          boss.y=Math.max(GROUND_TOP+10,Math.min(GROUND_BOT-boss.h,boss.y));
          if(pl.inv===0&&bOx+boss.w>pl.x&&bOx<pl.x+PW&&boss.y+boss.h>pl.y&&boss.y<pl.y+PH){
            pl.hp=Math.max(0,pl.hp-8);pl.inv=80;addParts(pl.x+PW/2,pl.y+PH/2,'#e74c3c',10);
            if(pl.hp<=0){if(sc>highSc)highSc=sc;music.pause();gState='dead';sync();}sync();
          }
          if(pl.airborne&&pl.vy>0){
            if(bOx+boss.w>pl.x&&bOx<pl.x+PW&&boss.y+10>pl.y+PH&&boss.y<pl.y+PH+10&&boss.inv===0){
              bossHp=Math.max(0,bossHp-30);boss.inv=40;boss.hitFlash=15;pl.vy=-10;sc+=300;
              pl.combo++;pl.comboTimer=90;addParts(bOx+boss.w/2,boss.y,C.gold,18);
              if(bossHp<=0){boss.dead=true;boss.deadTimer=90;sc+=3000;addParts(bOx+boss.w/2,boss.y+boss.h/2,'#FFD700',50);}
              sync();
            }
          }
        }

        if(boss&&boss.dead){
          boss.deadTimer--;
          if(boss.deadTimer<=0){
            if(levelIdx>=LEVELS.length-1){if(sc>highSc)highSc=sc;music.pause();gState='win';sync();}
            else{levelIdx++;pc=0;reset();transitionTimer=200;gState='transition';sync();}
          }
        }

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
          const oScreenX=o.x-scrollX;
          if(oScreenX<-120||oScreenX>W+120) return false;
          if(o.dead){o.deadTimer--;return o.deadTimer>0;}
          const oDy=pl.y-o.y;if(Math.abs(oDy)>4)o.y+=oDy>0?1.2:-1.2;
          o.y=Math.max(GROUND_TOP+4,Math.min(GROUND_BOT-o.h,o.y));
          o.vx=oScreenX>pl.x?-Math.abs(o.vx):Math.abs(o.vx);o.at++;
          if(pl.airborne&&pl.vy>0){
            if(oScreenX+o.w>pl.x&&oScreenX<pl.x+PW&&o.y+8>pl.y+PH&&o.y<pl.y+PH+8){
              o.hp=(o.hp||2)-2;o.hitFlash=15;pl.vy=-9;sc+=200+pl.combo*50;pl.combo++;pl.comboTimer=90;
              addParts(oScreenX+o.w/2,o.y,C.gold,10);
              if(o.hp<=0){o.dead=true;o.deadTimer=30;}sync();return true;
            }
          }
          if(pl.inv===0&&oScreenX+o.w>pl.x&&oScreenX<pl.x+PW&&o.y+o.h>pl.y&&o.y<pl.y+PH){
            pl.hp=Math.max(0,pl.hp-10);pl.inv=70;addParts(pl.x+PW/2,pl.y+PH/2,'#e74c3c',8);
            if(pl.hp<=0){if(sc>highSc)highSc=sc;music.pause();gState='dead';sync();}sync();
          }
          return true;
        });

        pizzas=pizzas.filter(pz=>{
          if(pz.collected)return false;const ox=pz.x-scrollX;if(ox<-80)return false;
          const bob=Math.sin(frame*0.08+pz.bob)*6;
          if(pl.x<ox+28&&pl.x+PW>ox&&pl.y<pz.y+bob+28&&pl.y+PH>pz.y+bob){
            pz.collected=true;sc+=100;pc++;addParts(ox+14,pz.y+14,C.gold,14);sync();return false;
          }
          return true;
        });

        parts=parts.filter(p=>{p.x+=p.vx;p.y+=p.vy;p.vy+=0.18;p.life--;return p.life>0;});
        if(!blds.length||blds[blds.length-1].x-scrollX*0.85<W+250)
          blds.push(mkBld((blds[blds.length-1]?.x||200)+110+Math.random()*120));
        blds=blds.filter(b=>b.x-scrollX*0.85>-300);
      }

      if(gState==='title'){drawTitle();raf=requestAnimationFrame(loop);return;}
      if(gState==='charselect'){drawCharSelect();raf=requestAnimationFrame(loop);return;}
      if(gState==='win'){drawWin();raf=requestAnimationFrame(loop);return;}

      drawBackground();blds.forEach(b=>drawBuilding(b));drawLane();

      // depth sort
      const drawables=[];
      obs.forEach(o=>{if(!o.dead||o.deadTimer>0)drawables.push({type:'enemy',o,y:o.y+o.h});});
      pizzas.forEach(pz=>{if(!pz.collected)drawables.push({type:'pizza',pz,y:pz.y+24});});
      weapons.forEach(wp=>{if(!wp.collected)drawables.push({type:'weapon',wp,y:wp.y+16});});
      if(boss&&(!boss.dead||boss.deadTimer>0))drawables.push({type:'boss',y:boss.y+boss.h});
      drawables.push({type:'player',y:pl.y+PH});
      drawables.sort((a,b)=>a.y-b.y);

      drawables.forEach(d=>{
        if(d.type==='enemy'){
          const o=d.o;const ox=o.x-scrollX;
          if(o.dead){ctx.globalAlpha=Math.max(0,o.deadTimer/30);ctx.font='18px serif';ctx.textAlign='center';ctx.fillText('💀',ox+o.w/2,o.y+o.h-2);ctx.globalAlpha=1;return;}
          drawShadow(ox,o.y,o.w,o.type==='rat'?0.6:1);
          if(o.hitFlash>0&&Math.floor(o.hitFlash/3)%2===0){ctx.globalAlpha=0.5;ctx.fillStyle='#fff';ctx.fillRect(ox,o.y,o.w,o.h);ctx.globalAlpha=1;}
          drawEnemySprite(ctx,o,scrollX,C);
        } else if(d.type==='pizza'){
          const pz=d.pz;const ox=pz.x-scrollX;const bob=Math.sin(frame*0.08+pz.bob)*6;
          if(pz.type==='taco')drawTaco(ctx,ox,pz.y+bob,C);else drawPizzaSlice(ctx,ox,pz.y+bob,C);
        } else if(d.type==='weapon'){
          drawWeaponPickup(d.wp);
        } else if(d.type==='boss'){
          const bOx=boss.x-scrollX;
          drawShadow(bOx,boss.y,boss.w);
          if(boss.hitFlash>0&&Math.floor(boss.hitFlash/3)%2===0){ctx.globalAlpha=0.4;ctx.fillStyle='#fff';ctx.fillRect(bOx,boss.y,boss.w,boss.h);ctx.globalAlpha=1;}
          drawBossSprite(ctx,boss,scrollX,Math.round((1-bossHp/BOSS_HP)*10),10,C);
        } else if(d.type==='player'){
          drawShadow(pl.x,pl.y,PW);
          drawPlayer();
        }
      });

      parts.forEach(p=>{ctx.globalAlpha=p.life/p.ml;ctx.fillStyle=p.col;ctx.fillRect(p.x-p.sz/2,p.y-p.sz/2,p.sz,p.sz);});
      ctx.globalAlpha=1;
      drawHUD();
      if(gState==='dead')drawDead();
      raf=requestAnimationFrame(loop);
    }

    const onDown=e=>{
      keys[e.code]=true;
      if(['Space','ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(e.code))e.preventDefault();
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
      tryAgain:()=>respawn(),
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

  // Fullscreen — works on both mobile AND desktop
  const enterFullscreen = () => {
    const el = canvasRef.current?.parentElement?.parentElement;
    if(el?.requestFullscreen) {
      el.requestFullscreen().catch(()=>{});
    }
    setIsFullscreen(true);
  };
  const exitFullscreen = () => {
    if(document.fullscreenElement) document.exitFullscreen().catch(()=>{});
    setIsFullscreen(false);
  };

  useEffect(() => {
    const onFSChange = () => { if(!document.fullscreenElement) setIsFullscreen(false); };
    document.addEventListener('fullscreenchange', onFSChange);
    return () => document.removeEventListener('fullscreenchange', onFSChange);
  }, []);

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

  const handleJoyStart=(e)=>{e.preventDefault();const t=e.touches[0];joystickRef.current={active:true,startX:t.clientX,startY:t.clientY,dx:0,dy:0};};
  const handleJoyMove=(e)=>{e.preventDefault();const joy=joystickRef.current;if(!joy.active)return;const t=e.touches[0];joy.dx=t.clientX-joy.startX;joy.dy=t.clientY-joy.startY;};
  const handleJoyEnd=(e)=>{e.preventDefault();joystickRef.current={active:false,startX:0,startY:0,dx:0,dy:0};const g=gameRef.current;if(g){g.keys['ArrowLeft']=false;g.keys['ArrowRight']=false;}};

  const btnS=(bg,fg='#fff',w=72,h=72)=>({
    fontFamily:'"Press Start 2P"',fontSize:'0.6rem',
    background:bg,color:fg,border:'none',borderRadius:4,
    cursor:'pointer',boxShadow:'0 4px 0 rgba(0,0,0,0.6)',
    display:'flex',alignItems:'center',justifyContent:'center',
    userSelect:'none',WebkitUserSelect:'none',
    WebkitTouchCallout:'none',touchAction:'none',
    width:w,height:h,
  });

  const dpadBtn=(lbl,key,hold,w=64,h=64)=>(
    <button key={key} style={btnS('#E2A820','#1C3D12',w,h)}
      onTouchStart={e=>{e.preventDefault();mb(key,true);}}
      onTouchEnd={e=>{e.preventDefault();hold&&mb(key,false);}}
      onTouchCancel={e=>{e.preventDefault();hold&&mb(key,false);}}
      onContextMenu={e=>e.preventDefault()}
      onMouseDown={()=>mb(key,true)}
      onMouseUp={()=>hold&&mb(key,false)}
      onMouseLeave={()=>hold&&mb(key,false)}
    >{lbl}</button>
  );

  const dpadControls=(
    <div style={{display:'grid',gridTemplateColumns:'64px 64px 64px',gridTemplateRows:'64px 64px 64px',gap:4}}>
      <div/>{dpadBtn('▲','ArrowUp',true)}<div/>
      {dpadBtn('◀','ArrowLeft',true)}
      <div style={{width:64,height:64,background:'rgba(0,0,0,0.3)',borderRadius:4}}/>
      {dpadBtn('▶','ArrowRight',true)}
      <div/>{dpadBtn('▼','ArrowDown',true)}<div/>
    </div>
  );

  const joystickControl=(
    <div style={{width:140,height:140,background:'rgba(0,0,0,0.3)',borderRadius:'50%',border:`3px solid #E2A820`,display:'flex',alignItems:'center',justifyContent:'center',position:'relative',touchAction:'none',cursor:'pointer'}}
      onTouchStart={handleJoyStart} onTouchMove={handleJoyMove} onTouchEnd={handleJoyEnd}>
      <div style={{width:52,height:52,background:'#E2A820',borderRadius:'50%',boxShadow:'0 4px 0 rgba(0,0,0,0.5)',pointerEvents:'none'}}/>
      <div style={{position:'absolute',top:6,fontFamily:'"Press Start 2P"',fontSize:'0.35rem',color:'rgba(255,255,255,0.4)'}}>MOVE</div>
    </div>
  );

  const controlButtons=(
    <div style={{background:'#1C3D12',borderTop:`3px solid #E2A820`,padding:'10px 12px',paddingBottom:'max(10px,env(safe-area-inset-bottom))'}}>
      {/* Toggle row — joystick only on mobile */}
      <div style={{display:'flex',justifyContent:'center',marginBottom:8,gap:8,alignItems:'center'}}>
        {isMobile&&(
          <>
            <button style={{...btnS(useJoystick?'#c8b830':'#2D4A1E','#F5F0DC',90,26),fontSize:'0.42rem',borderRadius:4,border:`1px solid #E2A820`}}
              onMouseDown={()=>setUseJoystick(false)} onTouchStart={e=>{e.preventDefault();setUseJoystick(false);}}>D-PAD</button>
            <button style={{...btnS(useJoystick?'#E2A820':'#2D4A1E','#F5F0DC',90,26),fontSize:'0.42rem',borderRadius:4,border:`1px solid #E2A820`}}
              onMouseDown={()=>setUseJoystick(true)} onTouchStart={e=>{e.preventDefault();setUseJoystick(true);}}>STICK</button>
          </>
        )}
        <button style={{...btnS(isFullscreen?'#e74c3c':'#2D4A1E','#F5F0DC',isFullscreen?100:120,26),fontSize:'0.42rem',borderRadius:4,border:`1px solid #E2A820`}}
          onMouseDown={isFullscreen?exitFullscreen:enterFullscreen}
          onTouchStart={e=>{e.preventDefault();isFullscreen?exitFullscreen():enterFullscreen();}}>
          {isFullscreen?'✕ EXIT FS':'⛶ FULLSCREEN'}
        </button>
        {isFullscreen&&(
          <button style={{...btnS('#e74c3c','#fff',80,26),fontSize:'0.42rem',borderRadius:4}}
            onMouseDown={exitFullscreen} onTouchStart={e=>{e.preventDefault();exitFullscreen();}}>✕ EXIT</button>
        )}
      </div>
      {/* Main controls */}
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',gap:8}}>
        {isMobile?(useJoystick?joystickControl:dpadControls):dpadControls}
        <div style={{display:'flex',flexDirection:'column',gap:6,alignItems:'center'}}>
          <button style={btnS('#3D5A2A','#E2A820',80,56)}
            onTouchStart={e=>{e.preventDefault();mb('start',true);}} onTouchEnd={e=>e.preventDefault()}
            onContextMenu={e=>e.preventDefault()} onMouseDown={()=>mb('start',true)}>START</button>
        </div>
        <div style={{display:'flex',flexDirection:'column',gap:6}}>
          <button style={btnS('#8e44ad','#fff',86,60)}
            onTouchStart={e=>{e.preventDefault();mb('attack',true);}} onTouchEnd={e=>e.preventDefault()}
            onContextMenu={e=>e.preventDefault()} onMouseDown={()=>mb('attack',true)}>⚔ ATK</button>
          <button style={btnS('#e74c3c','#fff',86,60)}
            onTouchStart={e=>{e.preventDefault();mb('jump',true);}} onTouchEnd={e=>e.preventDefault()}
            onContextMenu={e=>e.preventDefault()} onMouseDown={()=>mb('jump',true)}>▲ JUMP</button>
        </div>
      </div>
    </div>
  );

  if(isFullscreen){
    return(
      <div style={{position:'fixed',inset:0,zIndex:9999,background:'#000',display:'flex',flexDirection:'column'}}>
        <div style={{flex:1,display:'flex',alignItems:'stretch',overflow:'hidden'}}>
          <canvas ref={canvasRef} width={780} height={520} style={{width:'100%',height:'100%',display:'block',imageRendering:'pixelated',objectFit:'contain'}}/>
        </div>
        {controlButtons}
      </div>
    );
  }

  return(
    <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:'0.5rem'}}>
      <div style={{border:`4px solid #E2A820`,boxShadow:`4px 4px 0 #000`,background:'#000',width:'100%',maxWidth:780,position:'relative'}}>
        <canvas ref={canvasRef} width={780} height={520} style={{width:'100%',display:'block',imageRendering:'pixelated'}}/>
      </div>
      {controlButtons}
      <div style={{fontFamily:'"Press Start 2P"',fontSize:'0.38rem',color:'rgba(226,168,32,0.35)',textAlign:'center'}}>
        WASD/ARROWS MOVE &nbsp;|&nbsp; SPACE JUMP &nbsp;|&nbsp; Z/J ATTACK &nbsp;|&nbsp; ENTER START
      </div>
    </div>
  );
}