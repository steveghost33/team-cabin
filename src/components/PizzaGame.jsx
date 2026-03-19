import { useEffect, useRef, useState } from 'react';
import { C } from '../data/constants';

const W = 780;
const H = 520;
const GROUND = H - 80;
const PW = 24;
const PH = 32;
const PIZZAS_PER_LEVEL = 12;
const GRAVITY = 0.65;
const JUMP_POWER = -13;
const SONG_FILE = '/kylesong.mp3';
const SONG_VOLUME = 0.5;

const LEVEL_CONFIG = [
  {
    id: 1,
    name: 'FERNDALE DIY',
    subtitle: 'Near The Loving Touch',
    skyTop: '#0a0612',
    skyBot: '#1a0a2e',
    groundColor: '#1a1a2e',
    groundLine: '#4a3f6b',
    streetColor: '#0d0d1a',
    laneColor: '#6a4fc7',
    buildingCols: ['#1a0a2e', '#2a1045', '#0d0820', '#3a1a5e'],
    windowColor: '#c084fc',
    moonColor: '#e0c0ff',
    spawnRate: 130,
    enemySpeed: 2.5,
    collectible: 'pizza',
  },
  {
    id: 2,
    name: 'ST. ANDREWS / REN CEN',
    subtitle: 'Downtown Detroit',
    skyTop: '#050d03',
    skyBot: '#112009',
    groundColor: '#0c0c0c',
    groundLine: '#1e3314',
    streetColor: '#0c0c0c',
    laneColor: '#D4A017',
    buildingCols: ['#162b10', '#1e3314', '#0f2008', '#243c17'],
    windowColor: '#D4A017',
    moonColor: '#fffde7',
    spawnRate: 100,
    enemySpeed: 3.2,
    collectible: 'pizza',
  },
  {
    id: 3,
    name: 'MEXICANTOWN',
    subtitle: 'Vernor & Bagley',
    skyTop: '#1a0500',
    skyBot: '#3d1200',
    groundColor: '#1a0800',
    groundLine: '#8B4513',
    streetColor: '#1a0800',
    laneColor: '#e74c3c',
    buildingCols: ['#3d1200', '#5c1a00', '#2a0d00', '#6b2300'],
    windowColor: '#f39c12',
    moonColor: '#ffd700',
    spawnRate: 75,
    enemySpeed: 4.0,
    collectible: 'taco',
  },
];

export default function PizzaGame() {
  const canvasRef = useRef(null);
  const gameRef = useRef({});
  const [uiState, setUiState] = useState({ state: 'title', score: 0, lives: 3, pizza: 0, level: 1 });
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const music = new Audio(SONG_FILE);
    music.loop = true;
    music.volume = SONG_VOLUME;

    let gState = 'title';
    let sc = 0, lv = 3, pc = 0, currentLevel = 1;
    let frame = 0, scrollX = 0, spT = 0, piT = 0, highSc = 0;
    let obs = [], pizzas = [], parts = [], blds = [];
    let keys = {}, charIdx = 0, selectedChar = 0;
    let boss = null, bossHits = 0, bossMaxHits = 5;
    let levelTransition = 0; // countdown for level transition screen

    const pl = { x: 80, y: GROUND - PH, vx: 0, vy: 0, og: true, face: 1, inv: 0 };
    const sync = () => setUiState({ state: gState, score: sc, lives: lv, pizza: pc, level: currentLevel });

    function getLvlCfg() { return LEVEL_CONFIG[currentLevel - 1]; }

    function reset() {
      Object.assign(pl, { x: 80, y: GROUND - PH, vx: 0, vy: 0, og: true, inv: 0 });
      obs = []; pizzas = []; parts = []; blds = [];
      boss = null; bossHits = 0;
      scrollX = 0; spT = 0; piT = 0;
      for (let i = 0; i < 26; i++) blds.push(mkBld(i * 160 + 200));
    }

    function start() {
      sc = 0; lv = 3; pc = 0; currentLevel = 1;
      charIdx = selectedChar;
      reset();
      gState = 'playing';
      music.currentTime = 0;
      music.play().catch(() => {});
      sync();
    }

    function respawn() {
      Object.assign(pl, { x: 80, y: GROUND - PH, vx: 0, vy: 0, og: true, inv: 180 });
      charIdx = selectedChar;
      gState = 'playing';
      music.play().catch(() => {});
      sync();
    }

    function jump() {
      if (pl.og) { pl.vy = JUMP_POWER; pl.og = false; }
    }

    function startBoss() {
      const cfg = getLvlCfg();
      bossMaxHits = 5 + currentLevel * 2;
      bossHits = 0;
      const bossTypes = ['landlord', 'ratking', 'recordexec'];
      boss = {
        type: bossTypes[currentLevel - 1],
        x: W + 100,
        y: GROUND - 80,
        w: 60,
        h: 80,
        vx: -(1.5 + currentLevel * 0.3),
        at: 0,
        inv: 0,
        dead: false,
        deadTimer: 0,
      };
    }

    function advanceLevel() {
      if (currentLevel >= 3) {
        if (sc > highSc) highSc = sc;
        gState = 'win';
        music.pause();
        sync();
        return;
      }
      currentLevel++;
      pc = 0;
      reset();
      levelTransition = 180;
      gState = 'leveltransition';
      sync();
    }

    function mkBld(x) {
      const cfg = getLvlCfg();
      return {
        x,
        w: 50 + Math.random() * 90,
        h: 70 + Math.random() * 160,
        color: cfg.buildingCols[Math.floor(Math.random() * cfg.buildingCols.length)],
        wc: Math.floor(Math.random() * 4) + 2,
        wr: Math.floor(Math.random() * 3) + 2,
        special: currentLevel === 2 && Math.random() < 0.15 ? 'rencen' : null,
      };
    }

    function spawnObs() {
      const cfg = getLvlCfg();
      // no regular enemies during boss fight
      if (boss && !boss.dead) return;
      const r = Math.random();
      const type = r < 0.28 ? 'cone' : r < 0.55 ? 'metermaid' : r < 0.78 ? 'muscledude' : 'rat';
      const geo = {
        cone: { w: 18, h: 26, gy: GROUND - 26 },
        metermaid: { w: 22, h: 38, gy: GROUND - 38 },
        muscledude: { w: 28, h: 40, gy: GROUND - 40 },
        rat: { w: 20, h: 16, gy: GROUND - 16 },
      }[type];
      obs.push({ type, x: W + scrollX + 80, y: geo.gy, w: geo.w, h: geo.h, vx: -(cfg.enemySpeed + currentLevel * 0.2), at: 0, dead: false, deadTimer: 0 });
    }

    function spawnPizza() {
      const fly = Math.random() < 0.4;
      pizzas.push({
        x: W + scrollX + 80,
        y: fly ? GROUND - PH - 50 - Math.random() * 60 : GROUND - PH - 4,
        bob: Math.random() * Math.PI * 2,
        collected: false,
        type: getLvlCfg().collectible,
      });
    }

    function addParts(x, y, col, n) {
      for (let i = 0; i < n; i++)
        parts.push({ x, y, vx: (Math.random() - 0.5) * 7, vy: (Math.random() - 0.5) * 7 - 2, life: 50 + Math.random() * 20, ml: 70, col, sz: 3 + Math.random() * 4 });
    }

    // ════════════════════════════════════
    //  DRAW FUNCTIONS
    // ════════════════════════════════════

    function drawBld(b, cx) {
      const cfg = getLvlCfg();
      const bx = b.x - cx;
      if (bx > W + 200 || bx + b.w < -200) return;

      // Ren Cen special building (level 2)
      if (b.special === 'rencen') {
        // central tower
        ctx.fillStyle = '#1a2a1a';
        ctx.fillRect(bx + 20, GROUND - 220, 30, 220);
        // 4 corner cylinders
        for (let i = 0; i < 4; i++) {
          const offX = [0, 50, 0, 50][i], offY = [0, 0, 80, 80][i];
          ctx.fillStyle = '#152315';
          ctx.fillRect(bx + offX, GROUND - 140 + offY, 20, 140 - offY);
        }
        // windows on central tower
        for (let r = 0; r < 8; r++) for (let c = 0; c < 2; c++) {
          ctx.fillStyle = Math.sin(frame * 0.02 + r + c) > 0 ? '#D4A017' : '#0a1506';
          ctx.fillRect(bx + 24 + c * 12, GROUND - 210 + r * 24, 8, 14);
        }
        return;
      }

      ctx.fillStyle = b.color;
      ctx.fillRect(bx, GROUND - b.h, b.w, b.h);
      ctx.strokeStyle = '#000'; ctx.lineWidth = 1;
      ctx.strokeRect(bx, GROUND - b.h, b.w, b.h);

      // Level 1: purple neon sign on some buildings
      if (currentLevel === 1 && b.w > 80) {
        ctx.fillStyle = 'rgba(192,132,252,0.8)';
        ctx.fillRect(bx + 5, GROUND - b.h + 8, b.w - 10, 6);
        ctx.shadowBlur = 8; ctx.shadowColor = '#c084fc';
        ctx.fillRect(bx + 5, GROUND - b.h + 8, b.w - 10, 6);
        ctx.shadowBlur = 0;
      }

      // Level 3: colorful Mexican-style decorations
      if (currentLevel === 3) {
        const bannerCols = ['#e74c3c', '#f39c12', '#2ecc71', '#3498db', '#9b59b6'];
        for (let i = 0; i < 5; i++) {
          ctx.fillStyle = bannerCols[i % bannerCols.length];
          ctx.fillRect(bx + 4 + i * 10, GROUND - b.h + 5, 8, 12);
        }
      }

      for (let r = 0; r < b.wr; r++) for (let c = 0; c < b.wc; c++) {
        const wx = bx + 8 + c * 17, wy = GROUND - b.h + 20 + r * 22;
        if (wx + 10 < bx + b.w - 4) {
          const lit = Math.sin(frame * 0.013 + r * 1.8 + c * 0.9 + b.x * 0.01) > 0;
          ctx.fillStyle = lit ? cfg.windowColor : '#050505';
          if (lit) { ctx.shadowBlur = 4; ctx.shadowColor = cfg.windowColor; }
          ctx.fillRect(wx, wy, 10, 10);
          ctx.shadowBlur = 0;
        }
      }
      ctx.fillStyle = '#555';
      ctx.fillRect(bx + b.w / 2 - 3, GROUND - b.h - 12, 6, 12);
    }

    function drawPlayer() {
      const px = pl.x, py = pl.y;
      if (pl.inv > 0 && Math.floor(pl.inv / 5) % 2 === 0) return;
      ctx.save();
      if (pl.face === -1) { ctx.translate(px + PW, 0); ctx.scale(-1, 1); ctx.translate(-px, 0); }
      drawCharSprite(charIdx, px, py, PW, PH);
      ctx.restore();
    }

    // Higher resolution character sprites
    function drawCharSprite(idx, px, py, pw, ph) {
      if (idx === 0) {
        // STEVE — plaid flannel, beard, glasses
        // boots
        ctx.fillStyle = '#3d2b1f'; ctx.fillRect(px, py + 28, 9, 4); ctx.fillRect(px + 14, py + 28, 9, 4);
        ctx.fillStyle = '#2a1a0f'; ctx.fillRect(px - 1, py + 30, 10, 2); ctx.fillRect(px + 13, py + 30, 10, 2);
        // jeans
        ctx.fillStyle = '#2c3e6b'; ctx.fillRect(px + 1, py + 16, 8, 13); ctx.fillRect(px + 14, py + 16, 8, 13);
        ctx.fillStyle = '#1a2a4a'; ctx.fillRect(px + 4, py + 16, 2, 13); ctx.fillRect(px + 17, py + 16, 2, 13);
        // plaid shirt body
        ctx.fillStyle = '#848688'; ctx.fillRect(px - 1, py + 5, pw + 2, 12);
        // plaid lines vertical
        ctx.fillStyle = 'rgba(60,62,64,0.6)';
        [px + 2, px + 6, px + 10, px + 14, px + 18].forEach(x => ctx.fillRect(x, py + 5, 2, 12));
        // plaid lines horizontal
        ctx.fillStyle = 'rgba(60,62,64,0.5)';
        [py + 7, py + 10, py + 13].forEach(y => ctx.fillRect(px - 1, y, pw + 2, 2));
        // plaid color accent (green)
        ctx.fillStyle = 'rgba(74,96,48,0.4)';
        ctx.fillRect(px + 6, py + 5, 4, 12);
        // shirt collar
        ctx.fillStyle = '#6a6c6e'; ctx.fillRect(px + 8, py + 5, 6, 3);
        // arms
        ctx.fillStyle = '#848688'; ctx.fillRect(px - 5, py + 5, 5, 11); ctx.fillRect(px + pw, py + 5, 5, 11);
        // hands
        ctx.fillStyle = '#d4a574'; ctx.fillRect(px - 5, py + 14, 5, 4); ctx.fillRect(px + pw, py + 14, 5, 4);
        // neck
        ctx.fillStyle = '#d4a574'; ctx.fillRect(px + 9, py - 1, 5, 7);
        // head
        ctx.fillStyle = '#d4a574'; ctx.fillRect(px + 4, py - 11, 16, 12);
        // hair (brown, messy)
        ctx.fillStyle = '#5c3d1a'; ctx.fillRect(px + 4, py - 11, 16, 4);
        ctx.fillRect(px + 3, py - 10, 3, 6);
        ctx.fillRect(px + 18, py - 10, 3, 5);
        // beard (thick)
        ctx.fillStyle = '#8a6535'; ctx.fillRect(px + 4, py + 0, 16, 4);
        ctx.fillRect(px + 3, py - 2, 3, 5); ctx.fillRect(px + 18, py - 2, 2, 5);
        ctx.fillStyle = 'rgba(138,101,53,0.6)'; ctx.fillRect(px + 5, py - 4, 13, 3);
        // glasses frames
        ctx.strokeStyle = '#4a3a1a'; ctx.lineWidth = 1.5;
        ctx.strokeRect(px + 5, py - 8, 5, 5); ctx.strokeRect(px + 13, py - 8, 5, 5);
        // glasses bridge
        ctx.fillStyle = '#4a3a1a'; ctx.fillRect(px + 10, py - 6, 3, 1);
        // eyes behind glasses
        ctx.fillStyle = '#1a1a1a'; ctx.fillRect(px + 7, py - 7, 2, 2); ctx.fillRect(px + 15, py - 7, 2, 2);
        // glasses shine
        ctx.fillStyle = 'rgba(255,255,255,0.4)'; ctx.fillRect(px + 6, py - 8, 2, 1); ctx.fillRect(px + 14, py - 8, 2, 1);

      } else if (idx === 1) {
        // MIKE — solid grey hoodie, no hat, short hair, beard
        // shoes
        ctx.fillStyle = '#111'; ctx.fillRect(px, py + 28, 9, 4); ctx.fillRect(px + 14, py + 28, 9, 4);
        ctx.fillStyle = '#fff'; ctx.fillRect(px, py + 30, 9, 1); ctx.fillRect(px + 14, py + 30, 9, 1);
        // pants (maroon)
        ctx.fillStyle = '#7B2D3A'; ctx.fillRect(px + 1, py + 16, 8, 13); ctx.fillRect(px + 14, py + 16, 8, 13);
        ctx.fillStyle = '#5a1e28'; ctx.fillRect(px + 4, py + 16, 2, 13); ctx.fillRect(px + 17, py + 16, 2, 13);
        // hoodie body (solid medium grey)
        ctx.fillStyle = '#7a7a7a'; ctx.fillRect(px - 1, py + 5, pw + 2, 12);
        // hoodie pocket
        ctx.fillStyle = '#6a6a6a'; ctx.fillRect(px + 5, py + 12, 13, 5);
        ctx.fillStyle = '#5a5a5a'; ctx.fillRect(px + 10, py + 12, 2, 5);
        // hoodie front seam
        ctx.fillStyle = '#6a6a6a'; ctx.fillRect(px + 10, py + 5, 2, 12);
        // hoodie hood behind head
        ctx.fillStyle = '#6a6a6a'; ctx.fillRect(px + 2, py - 2, pw - 2, 5);
        // arms
        ctx.fillStyle = '#7a7a7a'; ctx.fillRect(px - 5, py + 5, 5, 13); ctx.fillRect(px + pw, py + 5, 5, 13);
        // cuffs
        ctx.fillStyle = '#5a5a5a'; ctx.fillRect(px - 5, py + 16, 5, 2); ctx.fillRect(px + pw, py + 16, 5, 2);
        // hands
        ctx.fillStyle = '#c49a6c'; ctx.fillRect(px - 5, py + 17, 5, 4); ctx.fillRect(px + pw, py + 17, 5, 4);
        // neck
        ctx.fillStyle = '#c49a6c'; ctx.fillRect(px + 9, py - 1, 5, 7);
        // head
        ctx.fillStyle = '#c49a6c'; ctx.fillRect(px + 4, py - 11, 16, 12);
        // short dark hair (no hat)
        ctx.fillStyle = '#1a0f05'; ctx.fillRect(px + 4, py - 11, 16, 5);
        ctx.fillRect(px + 3, py - 10, 3, 4);
        ctx.fillRect(px + 19, py - 10, 2, 4);
        // sideburns/fade
        ctx.fillStyle = '#2a1a0a'; ctx.fillRect(px + 4, py - 7, 2, 5); ctx.fillRect(px + 18, py - 7, 2, 5);
        // beard (short, dark)
        ctx.fillStyle = '#2a1a0a'; ctx.fillRect(px + 5, py - 1, 13, 3);
        ctx.fillRect(px + 4, py - 3, 3, 4); ctx.fillRect(px + 17, py - 3, 2, 4);
        // eyes
        ctx.fillStyle = '#1a1a1a'; ctx.fillRect(px + 7, py - 7, 3, 3); ctx.fillRect(px + 14, py - 7, 3, 3);
        // eye whites
        ctx.fillStyle = '#fff'; ctx.fillRect(px + 7, py - 7, 1, 1); ctx.fillRect(px + 14, py - 7, 1, 1);
        // smile
        ctx.fillStyle = '#8B4513'; ctx.fillRect(px + 8, py - 3, 7, 1);

      } else {
        // KYLE — green Patagonia-style zip fleece, long-ish brown hair, glasses
        // boots (brown hiking)
        ctx.fillStyle = '#6B4C2A'; ctx.fillRect(px, py + 28, 9, 4); ctx.fillRect(px + 14, py + 28, 9, 4);
        ctx.fillStyle = '#4a3020'; ctx.fillRect(px - 1, py + 30, 10, 2); ctx.fillRect(px + 13, py + 30, 10, 2);
        // dark pants
        ctx.fillStyle = '#283040'; ctx.fillRect(px + 1, py + 16, 8, 13); ctx.fillRect(px + 14, py + 16, 8, 13);
        ctx.fillStyle = '#1a2030'; ctx.fillRect(px + 4, py + 16, 2, 13); ctx.fillRect(px + 17, py + 16, 2, 13);
        // fleece body (green)
        ctx.fillStyle = '#3D5A2A'; ctx.fillRect(px - 1, py + 5, pw + 2, 12);
        // zip line
        ctx.fillStyle = '#2D4A1E'; ctx.fillRect(px + 10, py + 5, 2, 12);
        // zip pull
        ctx.fillStyle = '#aaa'; ctx.fillRect(px + 9, py + 8, 4, 2);
        // Patagonia-style chest patch
        ctx.fillStyle = '#2D4A1E'; ctx.fillRect(px + 3, py + 6, 6, 5);
        ctx.fillStyle = '#4a7a30'; ctx.fillRect(px + 4, py + 7, 4, 3);
        // fleece texture lines
        ctx.fillStyle = 'rgba(45,74,30,0.5)';
        [py + 8, py + 11, py + 14].forEach(y => ctx.fillRect(px - 1, y, pw + 2, 1));
        // arms
        ctx.fillStyle = '#3D5A2A'; ctx.fillRect(px - 5, py + 5, 5, 12); ctx.fillRect(px + pw, py + 5, 5, 12);
        // hands
        ctx.fillStyle = '#d4b07a'; ctx.fillRect(px - 5, py + 15, 5, 4); ctx.fillRect(px + pw, py + 15, 5, 4);
        // neck
        ctx.fillStyle = '#d4b07a'; ctx.fillRect(px + 9, py - 1, 5, 7);
        // head (slightly taller for longer face)
        ctx.fillStyle = '#d4b07a'; ctx.fillRect(px + 4, py - 12, 16, 13);
        // longish brown hair
        ctx.fillStyle = '#6B4C2A';
        ctx.fillRect(px + 4, py - 12, 16, 5); // top
        ctx.fillRect(px + 3, py - 11, 3, 9);  // left side long
        ctx.fillRect(px + 18, py - 11, 3, 8); // right side
        ctx.fillRect(px + 4, py - 8, 2, 6);   // left inner
        ctx.fillRect(px + 18, py - 8, 2, 5);  // right inner
        // glasses
        ctx.strokeStyle = '#5c4020'; ctx.lineWidth = 1.5;
        ctx.strokeRect(px + 5, py - 8, 5, 5); ctx.strokeRect(px + 13, py - 8, 5, 5);
        ctx.fillStyle = '#5c4020'; ctx.fillRect(px + 10, py - 6, 3, 1);
        // eyes
        ctx.fillStyle = '#1a1a1a'; ctx.fillRect(px + 7, py - 7, 2, 2); ctx.fillRect(px + 15, py - 7, 2, 2);
        ctx.fillStyle = 'rgba(255,255,255,0.4)'; ctx.fillRect(px + 6, py - 8, 2, 1); ctx.fillRect(px + 14, py - 8, 2, 1);
        // subtle stubble
        ctx.fillStyle = 'rgba(100,70,30,0.4)'; ctx.fillRect(px + 5, py - 1, 13, 3);
      }
    }

    function drawCharOnCanvas(idx, px, py) {
      drawCharSprite(idx, px, py, 22, 30);
    }

    function drawCollectible(pz) {
      const ox = pz.x - scrollX;
      const bob = Math.sin(frame * 0.08 + pz.bob) * 6;
      const py = pz.y + bob;
      if (ox > W + 60 || ox < -60) return;

      if (pz.type === 'taco') {
        // TACO
        // shell
        ctx.fillStyle = '#D4A017';
        ctx.beginPath(); ctx.ellipse(ox + 14, py + 18, 14, 8, 0, 0, Math.PI); ctx.fill();
        ctx.fillStyle = '#b8860b';
        ctx.beginPath(); ctx.ellipse(ox + 14, py + 18, 14, 8, 0, 0, Math.PI); ctx.stroke();
        // lettuce
        ctx.fillStyle = '#2ecc71';
        ctx.fillRect(ox + 4, py + 10, 20, 6);
        ctx.fillStyle = '#27ae60';
        [ox+4, ox+8, ox+12, ox+16, ox+20].forEach(x => ctx.fillRect(x, py+8, 3, 5));
        // meat
        ctx.fillStyle = '#8B4513'; ctx.fillRect(ox + 5, py + 12, 18, 4);
        // cheese
        ctx.fillStyle = '#FFD700'; ctx.fillRect(ox + 6, py + 11, 16, 3);
        // tomato
        ctx.fillStyle = '#e74c3c';
        [ox+7, ox+13, ox+18].forEach(x => { ctx.beginPath(); ctx.arc(x, py+13, 2, 0, Math.PI*2); ctx.fill(); });
        ctx.fillStyle = C.gold; ctx.font = '13px "Press Start 2P"'; ctx.textAlign = 'center';
        ctx.fillText('+100', ox + 14, py - 6);
      } else {
        // PIZZA SLICE (triangle shape)
        const tipX = ox + 14, tipY = py + 2;
        const leftX = ox, leftY = py + 26;
        const rightX = ox + 28, rightY = py + 26;

        // crust (outer edge)
        ctx.fillStyle = '#C8860A';
        ctx.beginPath(); ctx.moveTo(tipX, tipY); ctx.lineTo(leftX, leftY); ctx.lineTo(rightX, rightY); ctx.closePath(); ctx.fill();

        // cheese layer
        ctx.fillStyle = '#FFD966';
        ctx.beginPath(); ctx.moveTo(tipX, tipY + 4); ctx.lineTo(leftX + 3, leftY - 2); ctx.lineTo(rightX - 3, rightY - 2); ctx.closePath(); ctx.fill();

        // sauce
        ctx.fillStyle = '#C0392B';
        ctx.beginPath(); ctx.moveTo(tipX, tipY + 7); ctx.lineTo(leftX + 5, leftY - 3); ctx.lineTo(rightX - 5, rightY - 3); ctx.closePath(); ctx.fill();

        // crust bumps along bottom
        ctx.fillStyle = '#b8750a';
        [leftX+1, leftX+6, leftX+12, leftX+18, leftX+24].forEach(x => {
          ctx.beginPath(); ctx.arc(x, leftY, 3, 0, Math.PI*2); ctx.fill();
        });

        // pepperoni
        ctx.fillStyle = '#8B0000';
        [[tipX-2, tipY+10], [tipX+5, tipY+15], [tipX-6, tipY+17]].forEach(([cx,cy]) => {
          ctx.beginPath(); ctx.arc(cx, cy, 3, 0, Math.PI*2); ctx.fill();
        });
        // pepperoni shine
        ctx.fillStyle = 'rgba(255,80,80,0.4)';
        [[tipX-2, tipY+10], [tipX+5, tipY+15], [tipX-6, tipY+17]].forEach(([cx,cy]) => {
          ctx.beginPath(); ctx.arc(cx-1, cy-1, 1, 0, Math.PI*2); ctx.fill();
        });

        // cheese blobs
        ctx.fillStyle = '#FFE680';
        [[tipX+3, tipY+12], [tipX-5, tipY+14], [tipX+6, tipY+18]].forEach(([cx,cy]) => {
          ctx.fillRect(cx-2, cy-2, 4, 4);
        });

        // glow
        ctx.shadowBlur = 8; ctx.shadowColor = '#FF8C00';
        ctx.strokeStyle = 'rgba(255,140,0,0.3)'; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(tipX, tipY); ctx.lineTo(leftX, leftY); ctx.lineTo(rightX, rightY); ctx.closePath(); ctx.stroke();
        ctx.shadowBlur = 0;

        ctx.fillStyle = C.gold; ctx.font = '13px "Press Start 2P"'; ctx.textAlign = 'center';
        ctx.fillText('+100', ox + 14, py - 6);
      }
    }

    function drawEnemy(o) {
      const ox = o.x - scrollX, oy = o.y;
      if (ox > W + 80 || ox + o.w < -80) return;
      if (o.dead) {
        ctx.globalAlpha = Math.max(0, o.deadTimer / 30);
        ctx.fillStyle = '#555'; ctx.fillRect(ox, oy + o.h - 4, o.w, 4);
        ctx.fillStyle = '#fff'; ctx.font = '24px serif'; ctx.textAlign = 'center';
        ctx.fillText('💀', ox + o.w / 2, oy + o.h - 6);
        ctx.globalAlpha = 1; return;
      }
      o.at++;
      const walk = Math.sin(o.at * 0.2) * 2;
      if (o.type === 'cone') {
        ctx.fillStyle = '#FF6600'; ctx.beginPath(); ctx.moveTo(ox+9,oy); ctx.lineTo(ox,oy+26); ctx.lineTo(ox+18,oy+26); ctx.closePath(); ctx.fill();
        ctx.fillStyle = '#fff'; ctx.fillRect(ox+3,oy+9,12,4);
        ctx.fillStyle = '#FF8C00'; ctx.fillRect(ox+4,oy+15,10,3);
        ctx.fillStyle = '#444'; ctx.fillRect(ox-2,oy+24,22,4);
        ctx.fillStyle = 'rgba(255,220,0,0.5)'; ctx.fillRect(ox-4,oy+22,26,3);
      } else if (o.type === 'metermaid') {
        ctx.fillStyle = '#1a4a1a'; ctx.fillRect(ox+3,oy+22,7,14+walk); ctx.fillRect(ox+12,oy+22,7,14-walk);
        ctx.fillStyle = '#111'; ctx.fillRect(ox+1,oy+34,9,4); ctx.fillRect(ox+11,oy+34,9,4);
        ctx.fillStyle = '#1a6c1a'; ctx.fillRect(ox,oy+6,22,17);
        ctx.fillStyle = C.gold; ctx.fillRect(ox+8,oy+10,6,4);
        ctx.fillStyle = '#fff'; ctx.fillRect(ox+9,oy+11,4,2);
        ctx.fillStyle = '#c8855a'; ctx.fillRect(ox+5,oy-4,12,11);
        ctx.fillStyle = '#1a4a1a'; ctx.fillRect(ox+3,oy-8,16,6);
        ctx.fillStyle = C.gold; ctx.fillRect(ox+6,oy-7,10,3);
        ctx.fillStyle = '#1a1a1a'; ctx.fillRect(ox+7,oy,3,3); ctx.fillRect(ox+12,oy,3,3);
        ctx.fillStyle = '#1a1a1a'; ctx.fillRect(ox+7,oy-2,3,1); ctx.fillRect(ox+12,oy-2,3,1);
      } else if (o.type === 'muscledude') {
        ctx.fillStyle = '#333'; ctx.fillRect(ox+3,oy+28,9,10+walk); ctx.fillRect(ox+16,oy+28,9,10-walk);
        ctx.fillStyle = '#111'; ctx.fillRect(ox+1,oy+36,11,4); ctx.fillRect(ox+15,oy+36,11,4);
        ctx.fillStyle = '#8B0000'; ctx.fillRect(ox,oy+10,28,20);
        ctx.fillStyle = '#c8855a'; ctx.fillRect(ox-6,oy+10,8,14); ctx.fillRect(ox+26,oy+10,8,14);
        ctx.fillStyle = '#a07045'; ctx.fillRect(ox-7,oy+22,9,6); ctx.fillRect(ox+26,oy+22,9,6);
        ctx.fillStyle = '#c8855a'; ctx.fillRect(ox+10,oy+5,8,7); ctx.fillRect(ox+6,oy-6,16,13);
        ctx.fillStyle = '#1a1a1a'; ctx.fillRect(ox+8,oy-2,3,3); ctx.fillRect(ox+17,oy-2,3,3);
        ctx.fillStyle = '#8B0000'; ctx.fillRect(ox+8,oy-4,3,2); ctx.fillRect(ox+17,oy-4,3,2);
        ctx.fillStyle = '#fff'; ctx.font = '11px "Press Start 2P"'; ctx.textAlign = 'center';
        ctx.fillText('NO', ox+14, oy+20); ctx.fillText('PKG', ox+14, oy+27);
      } else {
        ctx.strokeStyle = '#a07050'; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(ox,oy+10); ctx.quadraticCurveTo(ox-8,oy+20,ox-14,oy+8); ctx.stroke();
        ctx.fillStyle = '#888'; ctx.beginPath(); ctx.ellipse(ox+10,oy+8,10,8,0,0,Math.PI*2); ctx.fill();
        ctx.fillStyle = '#999'; ctx.beginPath(); ctx.ellipse(ox+19,oy+4,6,5,0,0,Math.PI*2); ctx.fill();
        ctx.fillStyle = '#c87070'; ctx.beginPath(); ctx.ellipse(ox+19,oy-2,3,3,0,0,Math.PI*2); ctx.fill();
        ctx.fillStyle = '#f00'; ctx.fillRect(ox+21,oy+2,2,2);
        ctx.fillStyle = '#777'; ctx.fillRect(ox+4,oy+14+walk,4,4); ctx.fillRect(ox+12,oy+14-walk,4,4);
        ctx.fillStyle = '#FF8C00'; ctx.fillRect(ox+22,oy+5,5,4);
        ctx.fillStyle = '#C0392B'; ctx.fillRect(ox+23,oy+6,3,2);
      }
    }

    function drawBoss() {
      if (!boss) return;
      const ox = boss.x - scrollX, oy = boss.y;
      if (ox > W + 200 || ox + boss.w < -100) return;

      if (boss.dead) {
        ctx.globalAlpha = Math.max(0, boss.deadTimer / 60);
        ctx.font = '48px serif'; ctx.textAlign = 'center';
        ctx.fillText('💀', ox + boss.w/2, oy + boss.h/2);
        ctx.globalAlpha = 1; return;
      }

      boss.at++;
      const bob = Math.sin(boss.at * 0.05) * 3;
      const angry = boss.inv > 0;

      if (boss.type === 'landlord') {
        // LANDLORD — fat guy in suit with eviction notice
        const bx = ox, by = oy + bob;
        // feet
        ctx.fillStyle = '#111'; ctx.fillRect(bx+5,by+70,16,8); ctx.fillRect(bx+35,by+70,16,8);
        // legs
        ctx.fillStyle = '#1a1a3a'; ctx.fillRect(bx+8,by+50,14,22); ctx.fillRect(bx+34,by+50,14,22);
        // fat body in grey suit
        ctx.fillStyle = angry?'#8B0000':'#4a4a6a';
        ctx.fillRect(bx,by+20,boss.w,32);
        // suit lapels
        ctx.fillStyle = '#fff'; ctx.fillRect(bx+18,by+20,6,12); ctx.fillRect(bx+14,by+20,5,8);
        // tie
        ctx.fillStyle = '#e74c3c'; ctx.fillRect(bx+22,by+22,4,14);
        // arms
        ctx.fillStyle = angry?'#8B0000':'#4a4a6a';
        ctx.fillRect(bx-8,by+20,10,20); ctx.fillRect(bx+boss.w-2,by+20,10,20);
        // hands
        ctx.fillStyle = '#c8a070'; ctx.fillRect(bx-8,by+38,10,8); ctx.fillRect(bx+boss.w-2,by+38,10,8);
        // eviction paper in right hand
        ctx.fillStyle = '#fff'; ctx.fillRect(bx+boss.w+4,by+36,14,18);
        ctx.fillStyle = '#333'; ctx.font = '5px sans-serif'; ctx.textAlign = 'center';
        ctx.fillText('EVICT', bx+boss.w+11, by+46);
        // head (big, red-faced)
        ctx.fillStyle = angry?'#d4604a':'#d4905a';
        ctx.fillRect(bx+12,by-10,36,32);
        // jowls
        ctx.fillStyle = angry?'#c45040':'#c4804a';
        ctx.fillRect(bx+8,by+10,8,14); ctx.fillRect(bx+44,by+10,8,14);
        // hair (bald on top, side fringe)
        ctx.fillStyle = '#5c3d1a'; ctx.fillRect(bx+10,by-10,6,8); ctx.fillRect(bx+44,by-10,6,8);
        // mean eyes
        ctx.fillStyle = '#1a1a1a'; ctx.fillRect(bx+17,by,8,6); ctx.fillRect(bx+35,by,8,6);
        ctx.fillStyle = '#fff'; ctx.fillRect(bx+18,by+1,3,3); ctx.fillRect(bx+36,by+1,3,3);
        // angry eyebrows
        ctx.fillStyle = '#5c3d1a'; ctx.lineWidth = 3;
        if (angry) {
          ctx.strokeStyle = '#5c3d1a';
          ctx.beginPath(); ctx.moveTo(bx+16,by-3); ctx.lineTo(bx+26,by+1); ctx.stroke();
          ctx.beginPath(); ctx.moveTo(bx+44,by-3); ctx.lineTo(bx+34,by+1); ctx.stroke();
        } else {
          ctx.fillRect(bx+16,by-2,10,3); ctx.fillRect(bx+34,by-2,10,3);
        }
        // mustache
        ctx.fillStyle = '#5c3d1a'; ctx.fillRect(bx+18,by+8,24,5);
        // mouth (frown)
        ctx.fillStyle = '#8B2000'; ctx.fillRect(bx+20,by+14,20,4);
        // HP bar
        ctx.fillStyle = 'rgba(0,0,0,0.6)'; ctx.fillRect(ox-5, oy-24, boss.w+10, 10);
        ctx.fillStyle = '#e74c3c'; ctx.fillRect(ox-4, oy-23, Math.max(0,(boss.w+8)*((bossMaxHits-bossHits)/bossMaxHits)), 8);
        ctx.strokeStyle = C.gold; ctx.lineWidth = 1; ctx.strokeRect(ox-5, oy-24, boss.w+10, 10);
        ctx.fillStyle = C.gold; ctx.font = '7px "Press Start 2P"'; ctx.textAlign = 'center';
        ctx.fillText('LANDLORD', ox+boss.w/2, oy-27);

      } else if (boss.type === 'ratking') {
        // RAT KING — giant rat with a crown
        const bx = ox, by = oy + bob;
        const scale = 2.5;
        // tail
        ctx.strokeStyle = '#a07050'; ctx.lineWidth = 5;
        ctx.beginPath(); ctx.moveTo(bx,by+60); ctx.quadraticCurveTo(bx-30,by+80,bx-45,by+55); ctx.stroke();
        // body
        ctx.fillStyle = '#888';
        ctx.beginPath(); ctx.ellipse(bx+30,by+45,28,22,0,0,Math.PI*2); ctx.fill();
        // belly
        ctx.fillStyle = '#aaa';
        ctx.beginPath(); ctx.ellipse(bx+30,by+48,16,14,0,0,Math.PI*2); ctx.fill();
        // legs
        ctx.fillStyle = '#777'; ctx.fillRect(bx+10,by+60,12,16); ctx.fillRect(bx+36,by+60,12,16);
        ctx.fillStyle = '#666'; ctx.fillRect(bx+8,by+74,14,6); ctx.fillRect(bx+34,by+74,14,6);
        // arms holding pizza
        ctx.fillStyle = '#777'; ctx.fillRect(bx-4,by+35,12,18); ctx.fillRect(bx+48,by+35,12,18);
        // pizza slice in right hand
        ctx.fillStyle = '#C8860A';
        ctx.beginPath(); ctx.moveTo(bx+60,by+34); ctx.lineTo(bx+50,by+52); ctx.lineTo(bx+70,by+52); ctx.closePath(); ctx.fill();
        ctx.fillStyle = '#C0392B';
        ctx.beginPath(); ctx.moveTo(bx+60,by+38); ctx.lineTo(bx+53,by+50); ctx.lineTo(bx+67,by+50); ctx.closePath(); ctx.fill();
        // head
        ctx.fillStyle = '#999';
        ctx.beginPath(); ctx.ellipse(bx+30,by+16,22,18,0,0,Math.PI*2); ctx.fill();
        // snout
        ctx.fillStyle = '#bbb';
        ctx.beginPath(); ctx.ellipse(bx+38,by+22,10,8,0.3,0,Math.PI*2); ctx.fill();
        // nostrils
        ctx.fillStyle = '#c87070'; ctx.fillRect(bx+35,by+20,3,3); ctx.fillRect(bx+40,by+20,3,3);
        // red eyes
        ctx.fillStyle = '#cc0000';
        ctx.beginPath(); ctx.arc(bx+20,by+12,5,0,Math.PI*2); ctx.fill();
        ctx.beginPath(); ctx.arc(bx+36,by+10,5,0,Math.PI*2); ctx.fill();
        ctx.fillStyle = '#ff4444';
        ctx.beginPath(); ctx.arc(bx+19,by+11,2,0,Math.PI*2); ctx.fill();
        ctx.beginPath(); ctx.arc(bx+35,by+9,2,0,Math.PI*2); ctx.fill();
        // ears
        ctx.fillStyle = '#c87070';
        ctx.beginPath(); ctx.ellipse(bx+12,by+4,8,10,0,0,Math.PI*2); ctx.fill();
        ctx.beginPath(); ctx.ellipse(bx+40,by+2,8,10,0,0,Math.PI*2); ctx.fill();
        ctx.fillStyle = '#e89090';
        ctx.beginPath(); ctx.ellipse(bx+12,by+4,5,7,0,0,Math.PI*2); ctx.fill();
        ctx.beginPath(); ctx.ellipse(bx+40,by+2,5,7,0,0,Math.PI*2); ctx.fill();
        // CROWN
        ctx.fillStyle = '#FFD700';
        ctx.fillRect(bx+12,by-16,36,12);
        // crown points
        [[bx+12,by-28],[bx+22,by-24],[bx+30,by-30],[bx+38,by-24],[bx+46,by-28]].forEach(([cx,cy])=>{
          ctx.beginPath(); ctx.moveTo(cx,by-16); ctx.lineTo(cx+6,cy); ctx.lineTo(cx+12,by-16); ctx.closePath(); ctx.fill();
        });
        // crown gems
        ctx.fillStyle = '#e74c3c'; ctx.beginPath(); ctx.arc(bx+18,by-10,3,0,Math.PI*2); ctx.fill();
        ctx.fillStyle = '#3498db'; ctx.beginPath(); ctx.arc(bx+30,by-10,3,0,Math.PI*2); ctx.fill();
        ctx.fillStyle = '#2ecc71'; ctx.beginPath(); ctx.arc(bx+42,by-10,3,0,Math.PI*2); ctx.fill();
        // HP bar
        ctx.fillStyle = 'rgba(0,0,0,0.6)'; ctx.fillRect(ox-5, oy-24, boss.w+10, 10);
        ctx.fillStyle = '#e74c3c'; ctx.fillRect(ox-4, oy-23, Math.max(0,(boss.w+8)*((bossMaxHits-bossHits)/bossMaxHits)), 8);
        ctx.strokeStyle = C.gold; ctx.lineWidth = 1; ctx.strokeRect(ox-5, oy-24, boss.w+10, 10);
        ctx.fillStyle = C.gold; ctx.font = '7px "Press Start 2P"'; ctx.textAlign = 'center';
        ctx.fillText('RAT KING', ox+boss.w/2, oy-27);

      } else {
        // SLEAZY RECORD EXEC — slick suit, sunglasses, contract
        const bx = ox, by = oy + bob;
        // shoes (pointed)
        ctx.fillStyle = '#111'; ctx.fillRect(bx+4,by+72,14,6); ctx.fillRect(bx+34,by+72,14,6);
        ctx.fillRect(bx+2,by+74,5,3); ctx.fillRect(bx+46,by+74,5,3);
        // pants (sharp black)
        ctx.fillStyle = '#1a1a1a'; ctx.fillRect(bx+8,by+50,12,24); ctx.fillRect(bx+36,by+50,12,24);
        ctx.fillStyle = '#2a2a2a'; ctx.fillRect(bx+13,by+50,2,24); ctx.fillRect(bx+41,by+50,2,24);
        // slick suit (burgundy)
        ctx.fillStyle = angry?'#5a0020':'#6a0030';
        ctx.fillRect(bx,by+18,boss.w,34);
        // suit shine
        ctx.fillStyle = 'rgba(255,255,255,0.08)'; ctx.fillRect(bx+2,by+18,8,34);
        // white shirt
        ctx.fillStyle = '#f0f0f0'; ctx.fillRect(bx+20,by+18,16,12);
        // gold chain
        ctx.fillStyle = '#FFD700';
        ctx.beginPath(); ctx.arc(bx+28,by+26,8,0,Math.PI); ctx.stroke();
        ctx.lineWidth = 2; ctx.strokeStyle = '#FFD700';
        ctx.beginPath(); ctx.arc(bx+28,by+28,6,0,Math.PI); ctx.stroke();
        // lapels
        ctx.fillStyle = angry?'#4a0018':'#5a0028';
        ctx.fillRect(bx+14,by+18,8,14); ctx.fillRect(bx+34,by+18,8,14);
        // arms
        ctx.fillStyle = angry?'#5a0020':'#6a0030';
        ctx.fillRect(bx-8,by+18,10,22); ctx.fillRect(bx+boss.w-2,by+18,10,22);
        // hands
        ctx.fillStyle = '#c8a070'; ctx.fillRect(bx-8,by+38,10,8); ctx.fillRect(bx+boss.w-2,by+38,10,8);
        // contract in left hand
        ctx.fillStyle = '#fff'; ctx.fillRect(bx-14,by+34,16,22);
        ctx.fillStyle = '#aaa'; ctx.lineWidth = 1;
        [by+38,by+42,by+46,by+50].forEach(y=>{ ctx.fillStyle='#ccc'; ctx.fillRect(bx-12,y,12,1); });
        ctx.fillStyle = '#e74c3c'; ctx.font = '5px sans-serif'; ctx.textAlign = 'center';
        ctx.fillText('SIGN', bx-6, by+37);
        ctx.fillText('HERE', bx-6, by+42);
        // pen in right hand
        ctx.fillStyle = '#FFD700'; ctx.fillRect(bx+boss.w+4,by+35,3,16);
        ctx.fillStyle = '#111'; ctx.fillRect(bx+boss.w+4,by+49,3,4);
        // head
        ctx.fillStyle = '#c8a070'; ctx.fillRect(bx+12,by-8,32,28);
        // slick hair (black, gelled back)
        ctx.fillStyle = '#0a0a0a'; ctx.fillRect(bx+12,by-8,32,10);
        ctx.fillRect(bx+10,by-6,4,12); ctx.fillRect(bx+42,by-6,4,10);
        // hair shine
        ctx.fillStyle = 'rgba(255,255,255,0.2)'; ctx.fillRect(bx+16,by-7,10,3);
        // sunglasses (big, dark)
        ctx.fillStyle = '#111'; ctx.fillRect(bx+14,by+2,12,8); ctx.fillRect(bx+30,by+2,12,8);
        ctx.fillStyle = '#222'; ctx.fillRect(bx+14,by+2,12,8); ctx.fillRect(bx+30,by+2,12,8);
        ctx.fillStyle = '#333'; ctx.fillRect(bx+26,by+4,4,3);
        ctx.strokeStyle = '#888'; ctx.lineWidth = 1;
        ctx.strokeRect(bx+14,by+2,12,8); ctx.strokeRect(bx+30,by+2,12,8);
        // sunglasses shine
        ctx.fillStyle = 'rgba(255,255,255,0.15)'; ctx.fillRect(bx+15,by+3,4,2); ctx.fillRect(bx+31,by+3,4,2);
        // smug smile
        ctx.fillStyle = '#8B4513';
        ctx.beginPath(); ctx.arc(bx+28,by+16,8,0,Math.PI); ctx.fill();
        ctx.fillStyle = '#c8a070'; ctx.fillRect(bx+21,by+16,14,5);
        // teeth
        ctx.fillStyle = '#fff'; ctx.fillRect(bx+23,by+16,4,4); ctx.fillRect(bx+28,by+16,4,4); ctx.fillRect(bx+33,by+16,3,4);
        // HP bar
        ctx.fillStyle = 'rgba(0,0,0,0.6)'; ctx.fillRect(ox-5, oy-24, boss.w+10, 10);
        ctx.fillStyle = '#e74c3c'; ctx.fillRect(ox-4, oy-23, Math.max(0,(boss.w+8)*((bossMaxHits-bossHits)/bossMaxHits)), 8);
        ctx.strokeStyle = C.gold; ctx.lineWidth = 1; ctx.strokeRect(ox-5, oy-24, boss.w+10, 10);
        ctx.fillStyle = C.gold; ctx.font = '7px "Press Start 2P"'; ctx.textAlign = 'center';
        ctx.fillText('RECORD EXEC', ox+boss.w/2, oy-27);
      }
    }

    function drawHUD() {
      const cfg = getLvlCfg();
      ctx.fillStyle = 'rgba(0,0,0,0.6)'; ctx.fillRect(0,0,W,56);
      ctx.fillStyle = C.gold; ctx.font = '13px "Press Start 2P"'; ctx.textAlign = 'left';
      ctx.fillText('SCORE:'+sc, 12, 22);
      ctx.fillStyle = '#e74c3c'; ctx.fillText('♥'.repeat(lv), 12, 44);
      ctx.fillStyle = C.cream; ctx.textAlign = 'center'; ctx.fillText('LVL '+currentLevel+' — '+cfg.name, W/2, 22);
      const label = cfg.collectible === 'taco' ? '🌮' : '🍕';
      ctx.fillStyle = C.goldL; ctx.textAlign = 'right';
      ctx.fillText(label+' '+pc+'/'+PIZZAS_PER_LEVEL, W-12, 22);
      if (boss && !boss.dead) {
        ctx.fillStyle = C.gold; ctx.font = '9px "Press Start 2P"'; ctx.textAlign = 'center';
        ctx.fillText('⚠ BOSS FIGHT — STOMP IT!', W/2, 44);
      } else {
        for (let i=0;i<PIZZAS_PER_LEVEL;i++){
          ctx.fillStyle=i<pc?'#FF8C00':'#222';
          ctx.fillRect(W-12-PIZZAS_PER_LEVEL*12+i*12,28,10,16);
        }
      }
    }

    function drawSky() {
      const cfg = getLvlCfg();
      const sg = ctx.createLinearGradient(0,0,0,GROUND);
      sg.addColorStop(0, cfg.skyTop); sg.addColorStop(1, cfg.skyBot);
      ctx.fillStyle = sg; ctx.fillRect(0,0,W,GROUND);

      // stars
      for (let i=0;i<40;i++) {
        const sx=((i*137+scrollX*0.07)%(W+40)+W+40)%(W+40), sy=(i*73)%(GROUND*0.5);
        ctx.fillStyle = Math.sin(frame*0.03+i)>0.4?cfg.moonColor:'rgba(212,160,23,0.15)';
        ctx.fillRect(sx,sy,2,2);
      }

      // moon
      ctx.fillStyle = cfg.moonColor;
      ctx.beginPath(); ctx.arc(W-65,50,20,0,Math.PI*2); ctx.fill();
      ctx.fillStyle = cfg.skyTop;
      ctx.beginPath(); ctx.arc(W-56,44,17,0,Math.PI*2); ctx.fill();

      // Level 1: purple neon glow on horizon
      if (currentLevel === 1) {
        const ng = ctx.createLinearGradient(0, GROUND-40, 0, GROUND);
        ng.addColorStop(0, 'rgba(192,132,252,0)');
        ng.addColorStop(1, 'rgba(192,132,252,0.15)');
        ctx.fillStyle = ng; ctx.fillRect(0, GROUND-40, W, 40);
      }

      // Level 3: warm orange glow
      if (currentLevel === 3) {
        const ng = ctx.createLinearGradient(0, GROUND-50, 0, GROUND);
        ng.addColorStop(0, 'rgba(231,76,60,0)');
        ng.addColorStop(1, 'rgba(231,76,60,0.2)');
        ctx.fillStyle = ng; ctx.fillRect(0, GROUND-50, W, 50);
      }
    }

    function drawStreet() {
      const cfg = getLvlCfg();
      ctx.fillStyle = cfg.streetColor; ctx.fillRect(0,GROUND,W,H-GROUND);
      ctx.fillStyle = cfg.groundColor; ctx.fillRect(0,GROUND+4,W,H-GROUND-4);
      ctx.fillStyle = cfg.groundLine; ctx.fillRect(0,GROUND,W,5);
      ctx.fillStyle = cfg.laneColor;
      const lY = GROUND+(H-GROUND)/2-2;
      for (let i=0;i<W;i+=56) {
        const dx=((i-scrollX*0.5)%56+56)%56;
        ctx.fillRect(dx,lY,36,3);
      }
    }

    function drawTitle() {
      const g=ctx.createLinearGradient(0,0,0,H); g.addColorStop(0,'#0a1606'); g.addColorStop(1,'#1e3a14');
      ctx.fillStyle=g; ctx.fillRect(0,0,W,H);
      for(let i=0;i<70;i++){const sx=(i*131+frame*0.3)%W,sy=(i*71)%(H*0.55);ctx.fillStyle=Math.sin(frame*0.04+i)>0.4?C.gold:'rgba(212,160,23,0.2)';ctx.fillRect(sx,sy,Math.sin(frame*0.06+i)>0.6?3:1,Math.sin(frame*0.06+i)>0.6?3:1);}
      ctx.fillStyle='#0d1a08'; ctx.fillRect(0,GROUND,W,H-GROUND);
      ctx.fillStyle='#1e3314'; ctx.fillRect(0,GROUND,W,5);
      ctx.fillStyle='rgba(0,0,0,0.88)'; ctx.fillRect(W/2-280,H/2-170,560,340);
      ctx.strokeStyle=C.gold; ctx.lineWidth=4; ctx.strokeRect(W/2-280,H/2-170,560,340);
      ctx.strokeStyle=C.goldL; ctx.lineWidth=1.5; ctx.strokeRect(W/2-274,H/2-164,548,328);
      ctx.fillStyle=C.gold; ctx.font='20px "Press Start 2P"'; ctx.textAlign='center';
      ctx.fillText('DETROIT PIZZA QUEST',W/2,H/2-115);
      ctx.fillStyle=C.goldL; ctx.font='11px "Press Start 2P"'; ctx.fillText('— Team Cabin Edition —',W/2,H/2-83);
      ctx.fillStyle=C.cream; ctx.font='9px "Press Start 2P"';
      ctx.fillText('3 LEVELS · 3 BOSSES · 1 CITY',W/2,H/2-50);
      ctx.fillText('JUMP ON ENEMIES TO DEFEAT THEM!',W/2,H/2-28);
      ctx.fillText('AVOID THE TRAFFIC CONES!',W/2,H/2-6);
      ctx.fillText('COLLECT PIZZA SLICES TO ADVANCE!',W/2,H/2+16);
      ctx.fillStyle='rgba(212,160,23,0.6)'; ctx.font='8px "Press Start 2P"';
      ctx.fillText('LVL 1: FERNDALE DIY  ·  LVL 2: DOWNTOWN DETROIT  ·  LVL 3: MEXICANTOWN',W/2,H/2+44);
      if(Math.floor(frame/25)%2===0){ctx.fillStyle=C.greenL;ctx.font='11px "Press Start 2P"';ctx.fillText('[ PRESS ENTER TO CHOOSE PLAYER ]',W/2,H/2+88);}
      if(highSc>0){ctx.fillStyle=C.goldL;ctx.font='9px "Press Start 2P"';ctx.fillText('HIGH SCORE: '+highSc,W/2,H/2+118);}
    }

    function drawCharSelect() {
      const g=ctx.createLinearGradient(0,0,0,H); g.addColorStop(0,'#0a1606'); g.addColorStop(1,'#1e3a14');
      ctx.fillStyle=g; ctx.fillRect(0,0,W,H);
      for(let i=0;i<50;i++){const sx=(i*137)%W,sy=(i*71)%(H*0.6);ctx.fillStyle=Math.sin(frame*0.04+i)>0.4?C.gold:'rgba(212,160,23,0.15)';ctx.fillRect(sx,sy,2,2);}
      ctx.fillStyle=C.gold; ctx.font='20px "Press Start 2P"'; ctx.textAlign='center';
      ctx.fillText('CHOOSE YOUR PLAYER',W/2,52);
      const chars=[{name:'STEVE',role:'Bass & Vocals',desc:'Bearded groove machine'},{name:'MIKE',role:'Drums',desc:'Everybody loves Mike'},{name:'KYLE',role:'Guitar & Vocals',desc:'Tall guitar genius'}];
      const cardW=210,cardH=380,gap=18,startX=(W-(cardW*3+gap*2))/2;
      const topOffsets=[12,10,13],spriteHeights=[42,40,44];
      chars.forEach((ch,i)=>{
        const cx=startX+i*(cardW+gap),cy=72,isSel=selectedChar===i;
        ctx.fillStyle=isSel?'rgba(212,160,23,0.2)':'rgba(0,0,0,0.5)'; ctx.fillRect(cx,cy,cardW,cardH);
        ctx.strokeStyle=isSel?C.gold:'rgba(212,160,23,0.3)'; ctx.lineWidth=isSel?4:2; ctx.strokeRect(cx,cy,cardW,cardH);
        if(isSel){ctx.shadowBlur=20;ctx.shadowColor=C.gold;ctx.strokeRect(cx,cy,cardW,cardH);ctx.shadowBlur=0;}
        const scale=4,charAreaTop=cy+16,charAreaH=cardH-100;
        const spriteCenterY=charAreaTop+charAreaH/2;
        const spriteY=spriteCenterY-(spriteHeights[i]/2)*scale+topOffsets[i]*scale;
        const spriteX=cx+cardW/2-(32*scale)/2;
        ctx.save(); ctx.translate(spriteX,spriteY); ctx.scale(scale,scale); drawCharOnCanvas(i,0,0); ctx.restore();
        ctx.fillStyle=isSel?C.gold:C.cream; ctx.font=`${isSel?'13':'12'}px "Press Start 2P"`; ctx.textAlign='center';
        ctx.fillText(ch.name,cx+cardW/2,cy+cardH-62);
        ctx.fillStyle=C.goldL; ctx.font='9px "Press Start 2P"'; ctx.fillText(ch.role,cx+cardW/2,cy+cardH-40);
        ctx.fillStyle='rgba(245,240,220,0.5)'; ctx.font='8px "Press Start 2P"'; ctx.fillText(ch.desc,cx+cardW/2,cy+cardH-18);
        if(isSel&&Math.floor(frame/20)%2===0){ctx.fillStyle=C.gold;ctx.font='18px serif';ctx.textAlign='center';ctx.fillText('▼',cx+cardW/2,cy-8);}
      });
      ctx.fillStyle=C.cream; ctx.font='11px "Press Start 2P"'; ctx.textAlign='center';
      ctx.fillText('← → TO SELECT     ENTER TO CONFIRM',W/2,H-18);
    }

    function drawLevelTransition() {
      const cfg = getLvlCfg();
      const sg=ctx.createLinearGradient(0,0,0,H); sg.addColorStop(0,cfg.skyTop); sg.addColorStop(1,cfg.skyBot);
      ctx.fillStyle=sg; ctx.fillRect(0,0,W,H);
      ctx.fillStyle='rgba(0,0,0,0.75)'; ctx.fillRect(W/2-240,H/2-120,480,240);
      ctx.strokeStyle=C.gold; ctx.lineWidth=4; ctx.strokeRect(W/2-240,H/2-120,480,240);
      ctx.fillStyle=C.gold; ctx.font='16px "Press Start 2P"'; ctx.textAlign='center';
      ctx.fillText('LEVEL '+currentLevel, W/2, H/2-75);
      ctx.fillStyle=C.cream; ctx.font='20px "Press Start 2P"';
      ctx.fillText(cfg.name, W/2, H/2-40);
      ctx.fillStyle=C.goldL; ctx.font='10px "Press Start 2P"';
      ctx.fillText(cfg.subtitle, W/2, H/2-12);
      ctx.fillStyle='rgba(245,240,220,0.7)'; ctx.font='8px "Press Start 2P"';
      ctx.fillText('COLLECT '+PIZZAS_PER_LEVEL+(cfg.collectible==='taco'?' TACOS':' PIZZA SLICES')+' TO REACH THE BOSS', W/2, H/2+24);
      if(Math.floor(frame/20)%2===0){
        ctx.fillStyle=C.greenL; ctx.font='10px "Press Start 2P"';
        ctx.fillText('GET READY...', W/2, H/2+70);
      }
    }

    function drawDead() {
      ctx.fillStyle='rgba(0,0,0,0.78)'; ctx.fillRect(0,0,W,H);
      ctx.fillStyle='#e74c3c'; ctx.font='26px "Press Start 2P"'; ctx.textAlign='center';
      ctx.fillText(lv>0?'GOT WRECKED!':'GAME OVER',W/2,H/2-55);
      ctx.fillStyle=C.cream; ctx.font='13px "Press Start 2P"';
      ctx.fillText('SCORE: '+sc,W/2,H/2-10);
      if(lv>0){ctx.fillStyle=C.gold;ctx.fillText('LIVES LEFT: '+lv,W/2,H/2+25);}
      if(Math.floor(frame/28)%2===0){ctx.fillStyle=C.goldL;ctx.fillText(lv>0?'PRESS ENTER':'PRESS ENTER TO RETRY',W/2,H/2+65);}
    }

    function drawWin() {
      const g=ctx.createLinearGradient(0,0,0,H); g.addColorStop(0,'#0a1606'); g.addColorStop(1,'#1e3a14');
      ctx.fillStyle=g; ctx.fillRect(0,0,W,H);
      for(let i=0;i<30;i++){ctx.fillStyle=[C.gold,'#e74c3c',C.cream,C.greenL][i%4];ctx.fillRect((i*137+frame*2.5)%W,(i*89+frame*1.5)%(H-60),8,8);}
      ctx.fillStyle='rgba(0,0,0,0.8)'; ctx.fillRect(W/2-240,H/2-130,480,260);
      ctx.strokeStyle=C.gold; ctx.lineWidth=4; ctx.strokeRect(W/2-240,H/2-130,480,260);
      ctx.fillStyle=C.gold; ctx.font='18px "Press Start 2P"'; ctx.textAlign='center';
      ctx.fillText('🍕 DETROIT CONQUERED! 🍕',W/2,H/2-88);
      ctx.fillStyle=C.cream; ctx.font='11px "Press Start 2P"';
      ctx.fillText('THE BAND FEASTS TONIGHT',W/2,H/2-55);
      ctx.fillText('YOU BEAT ALL 3 LEVELS!',W/2,H/2-28);
      ctx.fillText('SCORE: '+sc,W/2,H/2+5);
      if(sc>=highSc&&sc>0){ctx.fillStyle=C.goldL;ctx.fillText('✨ NEW HIGH SCORE! ✨',W/2,H/2+35);}
      if(Math.floor(frame/28)%2===0){ctx.fillStyle=C.goldL;ctx.font='11px "Press Start 2P"';ctx.fillText('PRESS ENTER TO PLAY AGAIN',W/2,H/2+80);}
    }

    // ════════════════════════════════════
    //  MAIN LOOP
    // ════════════════════════════════════
    let raf;
    function loop() {
      frame++;
      const cfg = getLvlCfg();

      // ── LEVEL TRANSITION COUNTDOWN ──
      if (gState === 'leveltransition') {
        levelTransition--;
        drawLevelTransition();
        if (levelTransition <= 0) { gState = 'playing'; sync(); }
        raf = requestAnimationFrame(loop); return;
      }

      if (gState === 'playing') {
        // movement
        if(keys['ArrowLeft']||keys['KeyA']){pl.vx=-4.5;pl.face=-1;}
        else if(keys['ArrowRight']||keys['KeyD']){pl.vx=4.5;pl.face=1;}
        else pl.vx*=0.6;
        if((keys['ArrowUp']||keys['Space']||keys['KeyW'])&&pl.og) jump();
        pl.vy+=GRAVITY; pl.x+=pl.vx; pl.y+=pl.vy;
        if(pl.y+PH>=GROUND){pl.y=GROUND-PH;pl.vy=0;pl.og=true;}else pl.og=false;
        if(pl.x<20)pl.x=20; if(pl.x>W-PW-20)pl.x=W-PW-20;
        if(pl.inv>0)pl.inv--;
        if(pl.x>W*0.42){const s=pl.x-W*0.42;scrollX+=s;pl.x=W*0.42;}

        // spawn enemies (not during boss)
        if (!boss || boss.dead) {
          spT++; if(spT>=Math.max(40,cfg.spawnRate)){spawnObs();spT=0;}
        }
        // spawn collectibles (not during boss)
        if (!boss || boss.dead) {
          piT++; if(piT>=70){spawnPizza();piT=0;}
        }

        // trigger boss when enough collected
        if (pc >= PIZZAS_PER_LEVEL && !boss) {
          startBoss();
          obs = []; // clear regular enemies
        }

        // ── BOSS LOGIC ──
        if (boss && !boss.dead) {
          boss.x += boss.vx;
          boss.at++;
          if (boss.inv > 0) boss.inv--;

          // boss bounces back and forth
          const bossOx = boss.x - scrollX;
          if (bossOx < 60) { boss.vx = Math.abs(boss.vx); }
          if (bossOx > W - boss.w - 40) { boss.vx = -Math.abs(boss.vx); }

          // stomp boss
          const playerBottom = pl.y + PH;
          const bossOxCur = boss.x - scrollX;
          const overlapX = pl.x < bossOxCur+boss.w && pl.x+PW > bossOxCur;
          const fallingInto = pl.vy>0 && playerBottom>=boss.y && playerBottom<=boss.y+16 && overlapX;
          if (fallingInto && boss.inv===0) {
            bossHits++;
            boss.inv = 60;
            pl.vy = -11;
            sc += 500; sync();
            addParts(bossOxCur+boss.w/2, boss.y, C.gold, 20);
            if (bossHits >= bossMaxHits) {
              boss.dead = true; boss.deadTimer = 90;
              sc += 2000; sync();
              addParts(bossOxCur+boss.w/2, boss.y+boss.h/2, '#FFD700', 40);
            }
          }

          // boss hurts player
          if (pl.inv===0 && overlapX && pl.y < boss.y+boss.h && pl.y+PH > boss.y && !fallingInto) {
            pl.inv=120; addParts(pl.x+PW/2,pl.y+PH/2,'#e74c3c',12); lv--;
            if(lv<=0){if(sc>highSc)highSc=sc; music.pause(); gState='dead'; sync();}
          }

        } else if (boss && boss.dead) {
          boss.deadTimer--;
          if (boss.deadTimer <= 0) {
            advanceLevel();
          }
        }

        // regular enemies
        obs=obs.filter(o=>{
          o.x+=o.vx;
          const ox=o.x-scrollX;
          if(ox<-100)return false;
          if(o.dead){o.deadTimer--;return o.deadTimer>0;}
          const playerBottom=pl.y+PH,overlapX=pl.x<ox+o.w&&pl.x+PW>ox;
          const fallingInto=pl.vy>0&&playerBottom>=o.y&&playerBottom<=o.y+12&&overlapX;
          if(fallingInto&&o.type!=='cone'){o.dead=true;o.deadTimer=30;pl.vy=-9;sc+=200;sync();addParts(ox+o.w/2,o.y,C.gold,10);return true;}
          if(pl.inv===0){
            if(pl.x<ox+o.w&&pl.x+PW>ox&&pl.y<o.y+o.h&&pl.y+PH>o.y){
              pl.inv=100;addParts(pl.x+PW/2,pl.y+PH/2,'#e74c3c',12);lv--;
              if(lv<=0){if(sc>highSc)highSc=sc; music.pause(); gState='dead';sync();}
            }
          }
          return true;
        });

        // collectibles
        pizzas=pizzas.filter(pz=>{
          if(pz.collected)return false;
          const ox=pz.x-scrollX;
          if(ox<-60)return false;
          const bob=Math.sin(frame*0.08+pz.bob)*6;
          if(pl.x<ox+28&&pl.x+PW>ox&&pl.y<pz.y+bob+28&&pl.y+PH>pz.y+bob){
            pz.collected=true;sc+=100;pc++;
            addParts(ox+14,pz.y+14,C.gold,16);
            sync();return false;
          }
          return true;
        });

        parts=parts.filter(p=>{p.x+=p.vx;p.y+=p.vy;p.vy+=0.2;p.life--;return p.life>0;});
        if(!blds.length||blds[blds.length-1].x-scrollX<W+250)
          blds.push(mkBld((blds[blds.length-1]?.x||200)+100+Math.random()*130));
        blds=blds.filter(b=>b.x-scrollX>-300);
      }

      // ── DRAW ──
      if(gState==='title'){drawTitle();raf=requestAnimationFrame(loop);return;}
      if(gState==='charselect'){drawCharSelect();raf=requestAnimationFrame(loop);return;}
      if(gState==='win'){drawWin();raf=requestAnimationFrame(loop);return;}

      drawSky();

      // far bg silhouette
      ctx.fillStyle = cfg.skyTop;
      for(let i=0;i<10;i++){const bx=((i*105-scrollX*0.1)%(W+200)+W+200)%(W+200)-100;ctx.fillRect(bx,GROUND-45-(i%4)*22,40+(i%3)*14,45+(i%4)*22);}

      blds.forEach(b=>drawBld(b,scrollX));
      drawStreet();

      obs.forEach(o=>drawEnemy(o));
      pizzas.forEach(pz=>drawCollectible(pz));
      if (boss) drawBoss();

      parts.forEach(p=>{ctx.globalAlpha=p.life/p.ml;ctx.fillStyle=p.col;ctx.fillRect(p.x-p.sz/2,p.y-p.sz/2,p.sz,p.sz);});
      ctx.globalAlpha=1;

      drawPlayer();
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

    return ()=>{
      cancelAnimationFrame(raf);
      window.removeEventListener('keydown',onDown);
      window.removeEventListener('keyup',onUp);
      music.pause();
      music.currentTime=0;
    };
  },[]);

  const enterFullscreen = () => { if(window.innerWidth<=768) setIsFullscreen(true); };
  const exitFullscreen = () => setIsFullscreen(false);

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

  if (isFullscreen) {
    return (
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

  return (
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