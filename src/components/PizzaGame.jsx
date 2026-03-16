// ─────────────────────────────────────
//  PizzaGame.jsx
//  Detroit Pizza Quest — the full game.
//
//  GAME SETTINGS you might want to tweak:
//    W, H          — canvas resolution
//    WIN           — pizzas needed to win
//    GRAVITY       — how fast the player falls
//    JUMP_POWER    — how high the player jumps
//    SPAWN_RATE    — enemy spawn frequency
//    PIZZA_RATE    — pizza spawn frequency
//    ENEMY_SPEED   — base enemy scroll speed
// ─────────────────────────────────────
import { useEffect, useRef, useState } from 'react';
import { C } from '../data/constants';

// ── GAME SETTINGS ──────────────────────
const W           = 780;   // canvas width  (px)
const H           = 520;   // canvas height (px)
const GROUND      = H - 80;
const PW          = 24;    // player width
const PH          = 32;    // player height
const WIN         = 16;    // pizzas to win
const GRAVITY     = 0.65;
const JUMP_POWER  = -13;
const SPAWN_RATE  = 130;   // frames between enemy spawns (lower = harder)
const PIZZA_RATE  = 85;    // frames between pizza spawns
const ENEMY_SPEED = 2.5;   // base speed (increases with level)
// ───────────────────────────────────────

export default function PizzaGame() {
  const canvasRef = useRef(null);
  const gameRef   = useRef({});
  const [uiState, setUiState] = useState({ state: 'title', score: 0, lives: 3, pizza: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    // ── game state variables ──
    let gState = 'title', sc = 0, lv = 3, pc = 0, lvl = 1;
    let frame = 0, scrollX = 0, spT = 0, piT = 0, highSc = 0;
    let obs = [], pizzas = [], parts = [], blds = [];
    let keys = {}, charIdx = 0, selectedChar = 0;

    const pl = { x: 80, y: GROUND - PH, vx: 0, vy: 0, og: true, face: 1, inv: 0 };

    const sync = () => setUiState({ state: gState, score: sc, lives: lv, pizza: pc });

    // ── lifecycle helpers ──
    function reset() {
      Object.assign(pl, { x: 80, y: GROUND - PH, vx: 0, vy: 0, og: true, inv: 0 });
      obs = []; pizzas = []; parts = []; blds = [];
      scrollX = 0; spT = 0; piT = 0;
      for (let i = 0; i < 26; i++) blds.push(mkBld(i * 160 + 200));
    }

    function start() {
      sc = 0; lv = 3; lvl = 1; pc = 0;
      charIdx = selectedChar;
      reset();
      gState = 'playing';
      sync();
    }

    function respawn() {
      Object.assign(pl, { x: 80, y: GROUND - PH, vx: 0, vy: 0, og: true, inv: 180 });
      charIdx = selectedChar;
      gState = 'playing';
      sync();
    }

    function jump() {
      if (pl.og) { pl.vy = JUMP_POWER; pl.og = false; }
    }

    // ── world generation ──
    function mkBld(x) {
      const cols = ['#162b10', '#1e3314', '#0f2008', '#243c17'];
      return {
        x,
        w: 50 + Math.random() * 90,
        h: 70 + Math.random() * 160,
        color: cols[Math.floor(Math.random() * 4)],
        wc: Math.floor(Math.random() * 4) + 2,
        wr: Math.floor(Math.random() * 3) + 2,
      };
    }

    // ── spawners ──
    // Enemy types:  metermaid / muscledude / rat  → stompable
    //               cone                          → hazard only
    function spawnObs() {
      const r = Math.random();
      const type =
        r < 0.28 ? 'cone' :
        r < 0.55 ? 'metermaid' :
        r < 0.78 ? 'muscledude' : 'rat';

      const geo = {
        cone:       { w: 18, h: 26, gy: GROUND - 26 },
        metermaid:  { w: 22, h: 38, gy: GROUND - 38 },
        muscledude: { w: 28, h: 40, gy: GROUND - 40 },
        rat:        { w: 20, h: 16, gy: GROUND - 16 },
      }[type];

      obs.push({
        type, x: W + scrollX + 80,
        y: geo.gy, w: geo.w, h: geo.h,
        vx: -(ENEMY_SPEED + lvl * 0.3),
        at: 0, dead: false, deadTimer: 0,
      });
    }

    function spawnPizza() {
      const fly = Math.random() < 0.4;
      pizzas.push({
        x: W + scrollX + 80,
        y: fly ? GROUND - PH - 50 - Math.random() * 60 : GROUND - PH - 4,
        bob: Math.random() * Math.PI * 2,
        collected: false,
      });
    }

    function addParts(x, y, col, n) {
      for (let i = 0; i < n; i++)
        parts.push({
          x, y,
          vx: (Math.random() - 0.5) * 7,
          vy: (Math.random() - 0.5) * 7 - 2,
          life: 50 + Math.random() * 20, ml: 70, col,
          sz: 3 + Math.random() * 4,
        });
    }

    // ════════════════════════════════════
    //  DRAW FUNCTIONS
    // ════════════════════════════════════

    function drawBld(b, cx) {
      const bx = b.x - cx;
      if (bx > W + 200 || bx + b.w < -200) return;
      ctx.fillStyle = b.color;
      ctx.fillRect(bx, GROUND - b.h, b.w, b.h);
      ctx.strokeStyle = '#0a1506'; ctx.lineWidth = 1;
      ctx.strokeRect(bx, GROUND - b.h, b.w, b.h);
      for (let r = 0; r < b.wr; r++) {
        for (let c = 0; c < b.wc; c++) {
          const wx = bx + 8 + c * 17, wy = GROUND - b.h + 10 + r * 19;
          if (wx + 10 < bx + b.w - 4) {
            const lit = Math.sin(frame * 0.013 + r * 1.8 + c * 0.9 + b.x * 0.01) > 0;
            ctx.fillStyle = lit ? C.gold : '#091505';
            ctx.fillRect(wx, wy, 10, 10);
          }
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

      if (charIdx === 0) {
        // STEVE — plaid shirt
        ctx.fillStyle = '#111';    ctx.fillRect(px, py + 26, 8, 4); ctx.fillRect(px + 13, py + 26, 8, 4);
        ctx.fillStyle = '#1c1c2c'; ctx.fillRect(px + 1, py + 16, 7, 11); ctx.fillRect(px + 13, py + 16, 7, 11);
        ctx.fillStyle = '#848688'; ctx.fillRect(px - 1, py + 5, PW + 2, 12);
        ctx.fillStyle = 'rgba(70,72,74,0.5)';
        [px + 3, px + 9, px + 15].forEach(x => ctx.fillRect(x, py + 5, 2, 12));
        [py + 8, py + 12].forEach(y => ctx.fillRect(px - 1, y, PW + 2, 2));
        ctx.fillStyle = '#4a6030'; ctx.fillRect(px + 8, py + 5, 6, 4);
        ctx.fillStyle = '#848688'; ctx.fillRect(px - 5, py + 5, 5, 10); ctx.fillRect(px + PW, py + 5, 5, 10);
        ctx.fillStyle = '#e0c090'; ctx.fillRect(px - 5, py + 14, 5, 3); ctx.fillRect(px + PW, py + 14, 5, 3);
        ctx.fillStyle = '#e0c090'; ctx.fillRect(px + 3, py - 10, 16, 13);
        ctx.fillStyle = 'rgba(138,112,69,0.35)'; ctx.fillRect(px + 3, py - 10, 16, 3);
        ctx.fillStyle = '#8a7045'; ctx.fillRect(px + 3, py + 1, 16, 3); ctx.fillRect(px + 4, py - 1, 3, 3); ctx.fillRect(px + 15, py - 1, 3, 3);
        ctx.fillStyle = '#1a1a1a'; ctx.fillRect(px + 6, py - 6, 3, 3); ctx.fillRect(px + 13, py - 6, 3, 3);
        ctx.strokeStyle = '#7a6535'; ctx.lineWidth = 1;
        ctx.strokeRect(px + 5, py - 7, 5, 5); ctx.strokeRect(px + 12, py - 7, 5, 5);
        ctx.fillStyle = '#7a6535'; ctx.fillRect(px + 10, py - 5, 2, 1);

      } else if (charIdx === 1) {
        // MIKE — grey hoodie + snapback
        ctx.fillStyle = '#111';    ctx.fillRect(px, py + 26, 8, 4);
        ctx.fillStyle = 'rgba(220,220,220,0.6)'; ctx.fillRect(px + 14, py + 28, 7, 2);
        ctx.fillStyle = '#7B2D3A'; ctx.fillRect(px + 1, py + 16, 7, 11); ctx.fillRect(px + 13, py + 16, 7, 11);
        ctx.fillStyle = '#9a9a9a'; ctx.fillRect(px - 1, py + 5, PW + 2, 11);
        ctx.fillStyle = '#888';    ctx.fillRect(px + 3, py + 12, 16, 4);
        ctx.fillStyle = '#ccc';    ctx.fillRect(px + 4, py + 6, 3, 5); ctx.fillRect(px + 7, py + 7, 2, 3);
                                   ctx.fillRect(px + 9, py + 6, 3, 5); ctx.fillRect(px + 12, py + 7, 2, 3);
        ctx.fillStyle = '#777';    ctx.fillRect(px + 8, py + 5, 1, 6); ctx.fillRect(px + 12, py + 5, 1, 6);
        ctx.fillStyle = '#9a9a9a'; ctx.fillRect(px - 5, py + 5, 5, 12); ctx.fillRect(px + PW, py + 5, 5, 12);
        ctx.fillStyle = '#c49a6c'; ctx.fillRect(px - 5, py + 16, 5, 3); ctx.fillRect(px + PW, py + 16, 5, 3);
        ctx.fillStyle = '#c49a6c'; ctx.fillRect(px + 3, py - 10, 16, 13);
        ctx.fillStyle = '#2a1a0a'; ctx.fillRect(px + 3, py + 1, 16, 4); ctx.fillRect(px + 4, py - 1, 3, 3); ctx.fillRect(px + 15, py - 1, 3, 3);
        ctx.fillStyle = '#111';    ctx.fillRect(px + 6, py - 6, 3, 3); ctx.fillRect(px + 13, py - 6, 3, 3);
        ctx.fillStyle = '#1f1f1f'; ctx.fillRect(px + 1, py - 12, PW, 4); ctx.fillRect(px + 3, py - 18, 16, 7);
        ctx.fillStyle = '#333';    ctx.fillRect(px + 1, py - 14, PW, 1);

      } else {
        // KYLE — green zip fleece
        ctx.fillStyle = '#5D4037'; ctx.fillRect(px, py + 26, 8, 4); ctx.fillRect(px + 13, py + 26, 8, 4);
        ctx.fillStyle = '#283040'; ctx.fillRect(px + 1, py + 16, 7, 11); ctx.fillRect(px + 13, py + 16, 7, 11);
        ctx.fillStyle = '#3D5A2A'; ctx.fillRect(px - 1, py + 5, PW + 2, 12);
        ctx.fillStyle = '#2D4A1E'; ctx.fillRect(px + 10, py + 5, 2, 12); ctx.fillRect(px + 7, py + 4, 8, 3);
        ctx.fillStyle = '#3D5A2A'; ctx.fillRect(px - 5, py + 5, 5, 12); ctx.fillRect(px + PW, py + 5, 5, 12);
        ctx.fillStyle = '#E0C090'; ctx.fillRect(px - 5, py + 16, 5, 3); ctx.fillRect(px + PW, py + 16, 5, 3);
        ctx.fillStyle = '#E0C090'; ctx.fillRect(px + 3, py - 10, 16, 13);
        ctx.fillStyle = '#6B4C2A'; ctx.fillRect(px + 3, py - 10, 16, 3); ctx.fillRect(px + 1, py - 9, 3, 7); ctx.fillRect(px + 18, py - 9, 3, 7);
        ctx.fillStyle = '#1a1a1a'; ctx.fillRect(px + 6, py - 6, 3, 3); ctx.fillRect(px + 13, py - 6, 3, 3);
        ctx.strokeStyle = '#6B4C2A'; ctx.lineWidth = 1;
        ctx.strokeRect(px + 5, py - 7, 5, 5); ctx.strokeRect(px + 12, py - 7, 5, 5);
        ctx.fillStyle = '#6B4C2A'; ctx.fillRect(px + 10, py - 5, 2, 1);
      }
      ctx.restore();
    }

    // ── draw character for char-select screen (called with ctx.scale applied) ──
    function drawCharOnCanvas(idx, px, py) {
      const PW2 = 22;
      if (idx === 0) {
        ctx.fillStyle = '#111';    ctx.fillRect(px, py + 26, 8, 4); ctx.fillRect(px + 13, py + 26, 8, 4);
        ctx.fillStyle = '#1c1c2c'; ctx.fillRect(px + 1, py + 16, 7, 11); ctx.fillRect(px + 13, py + 16, 7, 11);
        ctx.fillStyle = '#848688'; ctx.fillRect(px - 1, py + 5, PW2 + 2, 12);
        ctx.fillStyle = 'rgba(70,72,74,0.5)';
        [px + 3, px + 9, px + 15].forEach(x => ctx.fillRect(x, py + 5, 2, 12));
        [py + 8, py + 12].forEach(y => ctx.fillRect(px - 1, y, PW2 + 2, 2));
        ctx.fillStyle = '#4a6030'; ctx.fillRect(px + 8, py + 5, 6, 4);
        ctx.fillStyle = '#848688'; ctx.fillRect(px - 5, py + 5, 5, 10); ctx.fillRect(px + PW2, py + 5, 5, 10);
        ctx.fillStyle = '#e0c090'; ctx.fillRect(px - 5, py + 14, 5, 3); ctx.fillRect(px + PW2, py + 14, 5, 3);
        ctx.fillStyle = '#e0c090'; ctx.fillRect(px + 3, py - 10, 16, 13);
        ctx.fillStyle = 'rgba(138,112,69,0.35)'; ctx.fillRect(px + 3, py - 10, 16, 3);
        ctx.fillStyle = '#8a7045'; ctx.fillRect(px + 3, py + 1, 16, 3); ctx.fillRect(px + 4, py - 1, 3, 3); ctx.fillRect(px + 15, py - 1, 3, 3);
        ctx.fillStyle = '#1a1a1a'; ctx.fillRect(px + 6, py - 6, 3, 3); ctx.fillRect(px + 13, py - 6, 3, 3);
        ctx.strokeStyle = '#7a6535'; ctx.lineWidth = 1;
        ctx.strokeRect(px + 5, py - 7, 5, 5); ctx.strokeRect(px + 12, py - 7, 5, 5);
        ctx.fillStyle = '#7a6535'; ctx.fillRect(px + 10, py - 5, 2, 1);
      } else if (idx === 1) {
        ctx.fillStyle = '#111';    ctx.fillRect(px, py + 26, 8, 4);
        ctx.fillStyle = 'rgba(220,220,220,0.6)'; ctx.fillRect(px + 14, py + 28, 7, 2);
        ctx.fillStyle = '#7B2D3A'; ctx.fillRect(px + 1, py + 16, 7, 11); ctx.fillRect(px + 13, py + 16, 7, 11);
        ctx.fillStyle = '#9a9a9a'; ctx.fillRect(px - 1, py + 5, PW2 + 2, 11);
        ctx.fillStyle = '#888';    ctx.fillRect(px + 3, py + 12, 16, 4);
        ctx.fillStyle = '#ccc';    ctx.fillRect(px + 4, py + 6, 3, 5); ctx.fillRect(px + 7, py + 7, 2, 3); ctx.fillRect(px + 9, py + 6, 3, 5); ctx.fillRect(px + 12, py + 7, 2, 3);
        ctx.fillStyle = '#777';    ctx.fillRect(px + 8, py + 5, 1, 6); ctx.fillRect(px + 12, py + 5, 1, 6);
        ctx.fillStyle = '#9a9a9a'; ctx.fillRect(px - 5, py + 5, 5, 12); ctx.fillRect(px + PW2, py + 5, 5, 12);
        ctx.fillStyle = '#c49a6c'; ctx.fillRect(px - 5, py + 16, 5, 3); ctx.fillRect(px + PW2, py + 16, 5, 3);
        ctx.fillStyle = '#c49a6c'; ctx.fillRect(px + 3, py - 10, 16, 13);
        ctx.fillStyle = '#2a1a0a'; ctx.fillRect(px + 3, py + 1, 16, 4); ctx.fillRect(px + 4, py - 1, 3, 3); ctx.fillRect(px + 15, py - 1, 3, 3);
        ctx.fillStyle = '#111';    ctx.fillRect(px + 6, py - 6, 3, 3); ctx.fillRect(px + 13, py - 6, 3, 3);
        ctx.fillStyle = '#1f1f1f'; ctx.fillRect(px + 1, py - 12, PW2, 4); ctx.fillRect(px + 3, py - 18, 16, 7);
        ctx.fillStyle = '#333';    ctx.fillRect(px + 1, py - 14, PW2, 1);
      } else {
        ctx.fillStyle = '#5D4037'; ctx.fillRect(px, py + 26, 8, 4); ctx.fillRect(px + 13, py + 26, 8, 4);
        ctx.fillStyle = '#283040'; ctx.fillRect(px + 1, py + 16, 7, 11); ctx.fillRect(px + 13, py + 16, 7, 11);
        ctx.fillStyle = '#3D5A2A'; ctx.fillRect(px - 1, py + 5, PW2 + 2, 12);
        ctx.fillStyle = '#2D4A1E'; ctx.fillRect(px + 10, py + 5, 2, 12); ctx.fillRect(px + 7, py + 4, 8, 3);
        ctx.fillStyle = '#3D5A2A'; ctx.fillRect(px - 5, py + 5, 5, 12); ctx.fillRect(px + PW2, py + 5, 5, 12);
        ctx.fillStyle = '#E0C090'; ctx.fillRect(px - 5, py + 16, 5, 3); ctx.fillRect(px + PW2, py + 16, 5, 3);
        ctx.fillStyle = '#E0C090'; ctx.fillRect(px + 3, py - 10, 16, 13);
        ctx.fillStyle = '#6B4C2A'; ctx.fillRect(px + 3, py - 10, 16, 3); ctx.fillRect(px + 1, py - 9, 3, 7); ctx.fillRect(px + 18, py - 9, 3, 7);
        ctx.fillStyle = '#1a1a1a'; ctx.fillRect(px + 6, py - 6, 3, 3); ctx.fillRect(px + 13, py - 6, 3, 3);
        ctx.strokeStyle = '#6B4C2A'; ctx.lineWidth = 1;
        ctx.strokeRect(px + 5, py - 7, 5, 5); ctx.strokeRect(px + 12, py - 7, 5, 5);
        ctx.fillStyle = '#6B4C2A'; ctx.fillRect(px + 10, py - 5, 2, 1);
      }
    }

    function drawEnemy(o) {
      const ox = o.x - scrollX, oy = o.y;
      if (ox > W + 80 || ox + o.w < -80) return;

      if (o.dead) {
        ctx.globalAlpha = Math.max(0, o.deadTimer / 30);
        ctx.fillStyle = o.type === 'cone' ? '#FF6600' : o.type === 'metermaid' ? '#1a5c1a' : o.type === 'muscledude' ? '#8B0000' : '#555';
        ctx.fillRect(ox, oy + o.h - 4, o.w, 4);
        ctx.fillStyle = '#fff'; ctx.font = '24px serif'; ctx.textAlign = 'center';
        ctx.fillText('💀', ox + o.w / 2, oy + o.h - 6);
        ctx.globalAlpha = 1;
        return;
      }

      o.at++;
      const walk = Math.sin(o.at * 0.2) * 2;

      if (o.type === 'cone') {
        ctx.fillStyle = '#FF6600';
        ctx.beginPath(); ctx.moveTo(ox + 9, oy); ctx.lineTo(ox, oy + 26); ctx.lineTo(ox + 18, oy + 26); ctx.closePath(); ctx.fill();
        ctx.fillStyle = '#fff';    ctx.fillRect(ox + 3, oy + 9, 12, 4);
        ctx.fillStyle = '#FF8C00'; ctx.fillRect(ox + 4, oy + 15, 10, 3);
        ctx.fillStyle = '#444';    ctx.fillRect(ox - 2, oy + 24, 22, 4);
        ctx.fillStyle = 'rgba(255,220,0,0.5)'; ctx.fillRect(ox - 4, oy + 22, 26, 3);

      } else if (o.type === 'metermaid') {
        ctx.fillStyle = '#1a4a1a'; ctx.fillRect(ox + 3, oy + 22, 7, 14 + walk); ctx.fillRect(ox + 12, oy + 22, 7, 14 - walk);
        ctx.fillStyle = '#111';    ctx.fillRect(ox + 1, oy + 34, 9, 4); ctx.fillRect(ox + 11, oy + 34, 9, 4);
        ctx.fillStyle = '#1a6c1a'; ctx.fillRect(ox, oy + 6, 22, 17);
        ctx.fillStyle = C.gold;    ctx.fillRect(ox + 8, oy + 10, 6, 4);
        ctx.fillStyle = '#fff';    ctx.fillRect(ox + 9, oy + 11, 4, 2);
        ctx.fillStyle = '#c8855a'; ctx.fillRect(ox + 5, oy - 4, 12, 11);
        ctx.fillStyle = '#1a4a1a'; ctx.fillRect(ox + 3, oy - 8, 16, 6);
        ctx.fillStyle = C.gold;    ctx.fillRect(ox + 6, oy - 7, 10, 3);
        ctx.fillStyle = '#1a1a1a'; ctx.fillRect(ox + 7, oy, 3, 3); ctx.fillRect(ox + 12, oy, 3, 3);
        ctx.fillStyle = '#fff';    ctx.fillRect(ox + 14, oy + 10, 7, 5);
        ctx.fillStyle = '#333';    ctx.fillRect(ox + 15, oy + 11, 5, 1); ctx.fillRect(ox + 15, oy + 13, 5, 1);
        ctx.fillStyle = '#1a1a1a'; ctx.fillRect(ox + 7, oy - 2, 3, 1); ctx.fillRect(ox + 12, oy - 2, 3, 1);

      } else if (o.type === 'muscledude') {
        ctx.fillStyle = '#333';    ctx.fillRect(ox + 3, oy + 28, 9, 10 + walk); ctx.fillRect(ox + 16, oy + 28, 9, 10 - walk);
        ctx.fillStyle = '#111';    ctx.fillRect(ox + 1, oy + 36, 11, 4); ctx.fillRect(ox + 15, oy + 36, 11, 4);
        ctx.fillStyle = '#8B0000'; ctx.fillRect(ox, oy + 10, 28, 20);
        ctx.fillStyle = '#c8855a'; ctx.fillRect(ox - 6, oy + 10, 8, 14); ctx.fillRect(ox + 26, oy + 10, 8, 14);
        ctx.fillStyle = '#a07045'; ctx.fillRect(ox - 7, oy + 22, 9, 6); ctx.fillRect(ox + 26, oy + 22, 9, 6);
        ctx.fillStyle = '#c8855a'; ctx.fillRect(ox + 10, oy + 5, 8, 7);
        ctx.fillStyle = '#c8855a'; ctx.fillRect(ox + 6, oy - 6, 16, 13);
        ctx.fillStyle = 'rgba(60,40,20,0.5)'; ctx.fillRect(ox + 7, oy + 4, 14, 3);
        ctx.fillStyle = '#1a1a1a'; ctx.fillRect(ox + 8, oy - 2, 3, 3); ctx.fillRect(ox + 17, oy - 2, 3, 3);
        ctx.fillStyle = '#8B0000'; ctx.fillRect(ox + 8, oy - 4, 3, 2); ctx.fillRect(ox + 17, oy - 4, 3, 2);
        ctx.fillStyle = '#fff';    ctx.font = '11px "Press Start 2P"'; ctx.textAlign = 'center';
        ctx.fillText('NO', ox + 14, oy + 20); ctx.fillText('PKG', ox + 14, oy + 27);

      } else { // rat
        ctx.strokeStyle = '#a07050'; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(ox, oy + 10); ctx.quadraticCurveTo(ox - 8, oy + 20, ox - 14, oy + 8); ctx.stroke();
        ctx.fillStyle = '#888';   ctx.beginPath(); ctx.ellipse(ox + 10, oy + 8, 10, 8, 0, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#999';   ctx.beginPath(); ctx.ellipse(ox + 19, oy + 4, 6, 5, 0, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#c87070'; ctx.beginPath(); ctx.ellipse(ox + 19, oy - 2, 3, 3, 0, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#f00';   ctx.fillRect(ox + 21, oy + 2, 2, 2);
        ctx.fillStyle = '#777';   ctx.fillRect(ox + 4, oy + 14 + walk, 4, 4); ctx.fillRect(ox + 12, oy + 14 - walk, 4, 4);
        ctx.fillStyle = '#FF8C00'; ctx.fillRect(ox + 22, oy + 5, 5, 4);
        ctx.fillStyle = '#C0392B'; ctx.fillRect(ox + 23, oy + 6, 3, 2);
      }
    }

    function drawPizza(pz) {
      const ox = pz.x - scrollX;
      const bob = Math.sin(frame * 0.08 + pz.bob) * 6;
      const py = pz.y + bob;
      if (ox > W + 60 || ox < -60) return;

      ctx.fillStyle = '#C8860A'; ctx.beginPath(); ctx.arc(ox + 14, py + 14, 14, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#FFD966'; ctx.beginPath(); ctx.arc(ox + 14, py + 14, 11, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#C0392B'; ctx.beginPath(); ctx.arc(ox + 14, py + 14, 8.5, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#FFE680';
      [[10, 10], [18, 10], [14, 16], [8, 15], [19, 17]].forEach(([dx, dy]) => ctx.fillRect(ox + dx - 1, py + dy - 1, 3, 3));
      ctx.fillStyle = '#8B0000';
      [[9, 9], [18, 8], [12, 16], [20, 14], [14, 11]].forEach(([dx, dy]) => { ctx.beginPath(); ctx.arc(ox + dx, py + dy, 3, 0, Math.PI * 2); ctx.fill(); });
      ctx.fillStyle = 'rgba(255,80,80,0.35)';
      [[9, 8], [18, 7], [12, 15]].forEach(([dx, dy]) => { ctx.beginPath(); ctx.arc(ox + dx - 1, py + dy - 1, 1.5, 0, Math.PI * 2); ctx.fill(); });
      ctx.fillStyle = '#B87008';
      [[4, 14], [24, 14], [14, 4], [7, 7], [21, 7], [7, 21], [21, 21]].forEach(([dx, dy]) => ctx.fillRect(ox + dx - 1, py + dy - 1, 3, 3));
      ctx.shadowBlur = 10; ctx.shadowColor = '#FF8C00';
      ctx.beginPath(); ctx.arc(ox + 14, py + 14, 14, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(255,140,0,0.4)'; ctx.lineWidth = 2; ctx.stroke();
      ctx.shadowBlur = 0;
      ctx.fillStyle = C.gold; ctx.font = '13px "Press Start 2P"'; ctx.textAlign = 'center';
      ctx.fillText('+100', ox + 14, py - 6);
    }

    function drawHUD() {
      ctx.fillStyle = 'rgba(0,0,0,0.6)'; ctx.fillRect(0, 0, W, 56);
      ctx.fillStyle = C.gold; ctx.font = '13px "Press Start 2P"'; ctx.textAlign = 'left';
      ctx.fillText('SCORE:' + sc, 12, 22);
      ctx.fillStyle = '#e74c3c'; ctx.fillText('♥'.repeat(lv), 12, 44);
      ctx.fillStyle = C.cream; ctx.textAlign = 'center'; ctx.fillText('BEST:' + highSc, W / 2, 22);
      ctx.fillStyle = C.goldL; ctx.textAlign = 'right'; ctx.fillText('🍕 ' + pc + '/' + WIN, W - 12, 22);
      for (let i = 0; i < WIN; i++) {
        ctx.fillStyle = i < pc ? '#FF8C00' : '#222';
        ctx.fillRect(W - 12 - WIN * 13 + i * 13, 28, 11, 16);
      }
      ctx.fillStyle = 'rgba(255,255,255,0.35)'; ctx.font = '9px "Press Start 2P"'; ctx.textAlign = 'center';
      ctx.fillText('STOMP ENEMIES FROM ABOVE | AVOID CONES', W / 2, 53);
    }

    function drawTitle() {
      const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#0a1606'); g.addColorStop(1, '#1e3a14');
      ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
      for (let i = 0; i < 70; i++) {
        const sx = (i * 131 + frame * 0.3) % W, sy = (i * 71) % (H * 0.55);
        ctx.fillStyle = Math.sin(frame * 0.04 + i) > 0.4 ? C.gold : 'rgba(212,160,23,0.2)';
        ctx.fillRect(sx, sy, Math.sin(frame * 0.06 + i) > 0.6 ? 3 : 1, Math.sin(frame * 0.06 + i) > 0.6 ? 3 : 1);
      }
      ctx.fillStyle = '#0d1a08'; ctx.fillRect(0, GROUND, W, H - GROUND);
      ctx.fillStyle = '#1e3314'; ctx.fillRect(0, GROUND, W, 5);
      ctx.fillStyle = 'rgba(0,0,0,0.88)'; ctx.fillRect(W / 2 - 280, H / 2 - 155, 560, 318);
      ctx.strokeStyle = C.gold; ctx.lineWidth = 4; ctx.strokeRect(W / 2 - 280, H / 2 - 155, 560, 318);
      ctx.strokeStyle = C.goldL; ctx.lineWidth = 1.5; ctx.strokeRect(W / 2 - 274, H / 2 - 149, 548, 306);
      ctx.fillStyle = C.gold; ctx.font = '20px "Press Start 2P"'; ctx.textAlign = 'center';
      ctx.fillText('DETROIT PIZZA QUEST', W / 2, H / 2 - 100);
      ctx.fillStyle = C.goldL; ctx.font = '11px "Press Start 2P"'; ctx.fillText('— Team Cabin Edition —', W / 2, H / 2 - 68);
      ctx.fillStyle = C.cream; ctx.font = '9px "Press Start 2P"';
      ctx.fillText('JUMP ON ENEMIES TO DEFEAT THEM!', W / 2, H / 2 - 30);
      ctx.fillText('AVOID THE TRAFFIC CONES!', W / 2, H / 2 - 6);
      ctx.fillText('COLLECT 16 PIZZA SLICES TO WIN!', W / 2, H / 2 + 20);
      if (Math.floor(frame / 25) % 2 === 0) {
        ctx.fillStyle = C.greenL; ctx.font = '11px "Press Start 2P"';
        ctx.fillText('[ PRESS ENTER TO CHOOSE PLAYER ]', W / 2, H / 2 + 72);
      }
      if (highSc > 0) {
        ctx.fillStyle = C.goldL; ctx.font = '9px "Press Start 2P"';
        ctx.fillText('HIGH SCORE: ' + highSc, W / 2, H / 2 + 108);
      }
    }

    function drawCharSelect() {
      const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#0a1606'); g.addColorStop(1, '#1e3a14');
      ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
      for (let i = 0; i < 50; i++) {
        const sx = (i * 137) % W, sy = (i * 71) % (H * 0.6);
        ctx.fillStyle = Math.sin(frame * 0.04 + i) > 0.4 ? C.gold : 'rgba(212,160,23,0.15)';
        ctx.fillRect(sx, sy, 2, 2);
      }

      ctx.fillStyle = C.gold; ctx.font = '20px "Press Start 2P"'; ctx.textAlign = 'center';
      ctx.fillText('CHOOSE YOUR PLAYER', W / 2, 52);

      const chars = [
        { name: 'STEVE', role: 'Bass & Vocals', desc: 'Bearded groove machine' },
        { name: 'MIKE',  role: 'Drums',         desc: 'Everybody loves Mike' },
        { name: 'KYLE',  role: 'Guitar & Vocals', desc: 'Tall guitar genius' },
      ];
      const cardW = 210, cardH = 380, gap = 18;
      const startX = (W - (cardW * 3 + gap * 2)) / 2;

      // Bounding box offsets for each character (in their 32-unit coordinate space)
      const topOffsets    = [10, 18, 10];  // head px above py=0
      const spriteHeights = [40, 48, 40];  // total sprite height

      chars.forEach((ch, i) => {
        const cx = startX + i * (cardW + gap);
        const cy = 72;
        const isSel = selectedChar === i;

        ctx.fillStyle = isSel ? 'rgba(212,160,23,0.2)' : 'rgba(0,0,0,0.5)';
        ctx.fillRect(cx, cy, cardW, cardH);
        ctx.strokeStyle = isSel ? C.gold : 'rgba(212,160,23,0.3)';
        ctx.lineWidth = isSel ? 4 : 2;
        ctx.strokeRect(cx, cy, cardW, cardH);
        if (isSel) { ctx.shadowBlur = 20; ctx.shadowColor = C.gold; ctx.strokeRect(cx, cy, cardW, cardH); ctx.shadowBlur = 0; }

        const scale = 4;
        const charAreaTop = cy + 16;
        const charAreaH = cardH - 100;
        const spriteCenterY = charAreaTop + charAreaH / 2;
        const spriteY = spriteCenterY - (spriteHeights[i] / 2) * scale + topOffsets[i] * scale;
        const spriteX = cx + cardW / 2 - (32 * scale) / 2;

        ctx.save();
        ctx.translate(spriteX, spriteY);
        ctx.scale(scale, scale);
        drawCharOnCanvas(i, 0, 0);
        ctx.restore();

        ctx.fillStyle = isSel ? C.gold : C.cream;
        ctx.font = `${isSel ? '13' : '12'}px "Press Start 2P"`;
        ctx.textAlign = 'center';
        ctx.fillText(ch.name, cx + cardW / 2, cy + cardH - 62);
        ctx.fillStyle = C.goldL; ctx.font = '9px "Press Start 2P"';
        ctx.fillText(ch.role, cx + cardW / 2, cy + cardH - 40);
        ctx.fillStyle = 'rgba(245,240,220,0.5)'; ctx.font = '8px "Press Start 2P"';
        ctx.fillText(ch.desc, cx + cardW / 2, cy + cardH - 18);

        if (isSel && Math.floor(frame / 20) % 2 === 0) {
          ctx.fillStyle = C.gold; ctx.font = '18px serif'; ctx.textAlign = 'center';
          ctx.fillText('▼', cx + cardW / 2, cy - 8);
        }
      });

      ctx.fillStyle = C.cream; ctx.font = '11px "Press Start 2P"'; ctx.textAlign = 'center';
      ctx.fillText('← → TO SELECT     ENTER TO CONFIRM', W / 2, H - 18);
    }

    function drawDead() {
      ctx.fillStyle = 'rgba(0,0,0,0.78)'; ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = '#e74c3c'; ctx.font = '26px "Press Start 2P"'; ctx.textAlign = 'center';
      ctx.fillText(lv > 0 ? 'GOT WRECKED!' : 'GAME OVER', W / 2, H / 2 - 55);
      ctx.fillStyle = C.cream; ctx.font = '13px "Press Start 2P"';
      ctx.fillText('SCORE: ' + sc, W / 2, H / 2 - 10);
      if (lv > 0) { ctx.fillStyle = C.gold; ctx.fillText('LIVES LEFT: ' + lv, W / 2, H / 2 + 25); }
      if (Math.floor(frame / 28) % 2 === 0) {
        ctx.fillStyle = C.goldL;
        ctx.fillText(lv > 0 ? 'PRESS ENTER' : 'PRESS ENTER TO RETRY', W / 2, H / 2 + 65);
      }
    }

    function drawWin() {
      const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#0a1606'); g.addColorStop(1, '#1e3a14');
      ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
      for (let i = 0; i < 30; i++) {
        ctx.fillStyle = [C.gold, '#e74c3c', C.cream, C.greenL][i % 4];
        ctx.fillRect((i * 137 + frame * 2.5) % W, (i * 89 + frame * 1.5) % (H - 60), 8, 8);
      }
      ctx.fillStyle = 'rgba(0,0,0,0.8)'; ctx.fillRect(W / 2 - 220, H / 2 - 110, 440, 225);
      ctx.strokeStyle = C.gold; ctx.lineWidth = 4; ctx.strokeRect(W / 2 - 220, H / 2 - 110, 440, 225);
      ctx.fillStyle = C.gold; ctx.font = '22px "Press Start 2P"'; ctx.textAlign = 'center';
      ctx.fillText('🍕 PIZZA FOUND! 🍕', W / 2, H / 2 - 65);
      ctx.fillStyle = C.cream; ctx.font = '13px "Press Start 2P"';
      ctx.fillText('THE BAND FEASTS TONIGHT', W / 2, H / 2 - 25);
      ctx.fillText('SCORE: ' + sc, W / 2, H / 2 + 15);
      if (sc >= highSc && sc > 0) { ctx.fillStyle = C.goldL; ctx.fillText('✨ NEW HIGH SCORE! ✨', W / 2, H / 2 + 45); }
      if (Math.floor(frame / 28) % 2 === 0) {
        ctx.fillStyle = C.goldL; ctx.font = '11px "Press Start 2P"';
        ctx.fillText('PRESS ENTER TO PLAY AGAIN', W / 2, H / 2 + 90);
      }
    }

    // ════════════════════════════════════
    //  MAIN LOOP
    // ════════════════════════════════════
    let raf;
    function loop() {
      frame++;

      // ── UPDATE ──
      if (gState === 'playing') {
        if (keys['ArrowLeft'] || keys['KeyA'])       { pl.vx = -4.5; pl.face = -1; }
        else if (keys['ArrowRight'] || keys['KeyD']) { pl.vx =  4.5; pl.face =  1; }
        else pl.vx *= 0.6;

        if ((keys['ArrowUp'] || keys['Space'] || keys['KeyW']) && pl.og) jump();

        pl.vy += GRAVITY;
        pl.x += pl.vx; pl.y += pl.vy;
        if (pl.y + PH >= GROUND) { pl.y = GROUND - PH; pl.vy = 0; pl.og = true; } else pl.og = false;
        if (pl.x < 20)       pl.x = 20;
        if (pl.x > W - PW - 20) pl.x = W - PW - 20;
        if (pl.inv > 0) pl.inv--;

        if (pl.x > W * 0.42) { const s = pl.x - W * 0.42; scrollX += s; pl.x = W * 0.42; }

        spT++; if (spT >= Math.max(60, SPAWN_RATE - lvl * 6)) { spawnObs(); spT = 0; }
        piT++; if (piT >= PIZZA_RATE) { spawnPizza(); piT = 0; }

        obs = obs.filter(o => {
          o.x += o.vx;
          const ox = o.x - scrollX;
          if (ox < -100) return false;
          if (o.dead) { o.deadTimer--; return o.deadTimer > 0; }

          const playerBottom = pl.y + PH;
          const overlapX = pl.x < ox + o.w && pl.x + PW > ox;
          const fallingInto = pl.vy > 0 && playerBottom >= o.y && playerBottom <= o.y + 12 && overlapX;

          if (fallingInto && o.type !== 'cone') {
            o.dead = true; o.deadTimer = 30;
            pl.vy = -9;
            sc += 200; sync();
            addParts(ox + o.w / 2, o.y, C.gold, 10);
            return true;
          }

          if (pl.inv === 0) {
            if (pl.x < ox + o.w && pl.x + PW > ox && pl.y < o.y + o.h && pl.y + PH > o.y) {
              pl.inv = 100;
              addParts(pl.x + PW / 2, pl.y + PH / 2, '#e74c3c', 12);
              lv--;
              if (lv <= 0) { if (sc > highSc) highSc = sc; }
              gState = 'dead'; sync();
            }
          }
          return true;
        });

        pizzas = pizzas.filter(pz => {
          if (pz.collected) return false;
          const ox = pz.x - scrollX;
          if (ox < -60) return false;
          const bob = Math.sin(frame * 0.08 + pz.bob) * 6;
          if (pl.x < ox + 28 && pl.x + PW > ox && pl.y < pz.y + bob + 28 && pl.y + PH > pz.y + bob) {
            pz.collected = true;
            sc += 100; pc++;
            addParts(ox + 14, pz.y + 14, C.gold, 16);
            if (pc >= WIN) { if (sc > highSc) highSc = sc; gState = 'win'; }
            sync(); return false;
          }
          return true;
        });

        parts = parts.filter(p => { p.x += p.vx; p.y += p.vy; p.vy += 0.2; p.life--; return p.life > 0; });

        if (!blds.length || blds[blds.length - 1].x - scrollX < W + 250)
          blds.push(mkBld((blds[blds.length - 1]?.x || 200) + 100 + Math.random() * 130));
        blds = blds.filter(b => b.x - scrollX > -300);

        if (sc > lvl * 400) lvl++;
      }

      // ── DRAW ──
      if (gState === 'title')      { drawTitle();      raf = requestAnimationFrame(loop); return; }
      if (gState === 'charselect') { drawCharSelect(); raf = requestAnimationFrame(loop); return; }
      if (gState === 'win')        { drawWin();        raf = requestAnimationFrame(loop); return; }

      // sky gradient
      const sg = ctx.createLinearGradient(0, 0, 0, GROUND);
      sg.addColorStop(0, '#050d03'); sg.addColorStop(1, '#112009');
      ctx.fillStyle = sg; ctx.fillRect(0, 0, W, GROUND);

      // stars
      for (let i = 0; i < 40; i++) {
        const sx = ((i * 137 + scrollX * 0.07) % (W + 40) + W + 40) % (W + 40);
        const sy = (i * 73) % (GROUND * 0.5);
        ctx.fillStyle = Math.sin(frame * 0.03 + i) > 0.4 ? C.goldL : 'rgba(212,160,23,0.2)';
        ctx.fillRect(sx, sy, 2, 2);
      }

      // moon
      ctx.fillStyle = '#fffde7'; ctx.beginPath(); ctx.arc(W - 65, 50, 20, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#050d03'; ctx.beginPath(); ctx.arc(W - 56, 44, 17, 0, Math.PI * 2); ctx.fill();

      // far bg
      ctx.fillStyle = '#091505';
      for (let i = 0; i < 10; i++) {
        const bx = ((i * 105 - scrollX * 0.1) % (W + 200) + W + 200) % (W + 200) - 100;
        ctx.fillRect(bx, GROUND - 45 - (i % 4) * 22, 40 + (i % 3) * 14, 45 + (i % 4) * 22);
      }

      blds.forEach(b => drawBld(b, scrollX));

      // street
      ctx.fillStyle = '#0c0c0c'; ctx.fillRect(0, GROUND, W, H - GROUND);
      ctx.fillStyle = '#111';    ctx.fillRect(0, GROUND + 4, W, H - GROUND - 4);
      ctx.fillStyle = '#1e3314'; ctx.fillRect(0, GROUND, W, 5);

      // lane dashes
      ctx.fillStyle = C.gold;
      const lY = GROUND + (H - GROUND) / 2 - 2;
      for (let i = 0; i < W; i += 56) {
        const dx = ((i - scrollX * 0.5) % 56 + 56) % 56;
        ctx.fillRect(dx, lY, 36, 3);
      }

      obs.forEach(o => drawEnemy(o));
      pizzas.forEach(pz => drawPizza(pz));

      parts.forEach(p => {
        ctx.globalAlpha = p.life / p.ml;
        ctx.fillStyle = p.col;
        ctx.fillRect(p.x - p.sz / 2, p.y - p.sz / 2, p.sz, p.sz);
      });
      ctx.globalAlpha = 1;

      drawPlayer();
      drawHUD();
      if (gState === 'dead') drawDead();

      raf = requestAnimationFrame(loop);
    }

    // ── KEY HANDLERS ──
    const onDown = e => {
      keys[e.code] = true;
      if (['Space', 'ArrowLeft', 'ArrowRight', 'ArrowUp'].includes(e.code)) e.preventDefault();

      if (e.code === 'Space' && gState === 'playing') { jump(); return; }

      if (gState === 'charselect') {
        if (e.code === 'ArrowLeft')  { selectedChar = (selectedChar + 2) % 3; sync(); return; }
        if (e.code === 'ArrowRight') { selectedChar = (selectedChar + 1) % 3; sync(); return; }
      }

      if (e.code === 'Enter') {
        if      (gState === 'title')      { gState = 'charselect'; sync(); }
        else if (gState === 'charselect') { charIdx = selectedChar; start(); }
        else if (gState === 'dead')       { if (lv > 0) respawn(); else { gState = 'charselect'; sync(); } }
        else if (gState === 'win')        { gState = 'charselect'; sync(); }
      }
    };
    const onUp = e => { keys[e.code] = false; };
    window.addEventListener('keydown', onDown);
    window.addEventListener('keyup', onUp);

    loop();

    gameRef.current = {
      jump,
      start,
      tryAgain:       () => { if (lv > 0) respawn(); else { gState = 'charselect'; sync(); } },
      toCharSelect:   () => { gState = 'charselect'; sync(); },
      setChar:        (i) => { selectedChar = i; sync(); },
      confirmChar:    () => { charIdx = selectedChar; start(); },
      keys,
      getState:       () => gState,
      getSelectedChar:() => selectedChar,
    };

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('keydown', onDown);
      window.removeEventListener('keyup', onUp);
    };
  }, []);

  // ── mobile button handler ──
  const mb = (key, down) => {
    const g = gameRef.current; if (!g) return;
    const st = g.getState ? g.getState() : uiState.state;

    if (key === 'jump') {
      if (down && st === 'playing') g.jump();
    } else if (key === 'start') {
      if      (st === 'title')      g.toCharSelect?.();
      else if (st === 'charselect') g.confirmChar?.();
      else if (st === 'dead')       g.tryAgain?.();
      else if (st === 'win')        g.toCharSelect?.();
    } else if (key === 'ArrowLeft' && down) {
      if (st === 'charselect') g.setChar?.((( g.getSelectedChar?.() ?? 0) + 2) % 3);
      else g.keys['ArrowLeft'] = true;
    } else if (key === 'ArrowRight' && down) {
      if (st === 'charselect') g.setChar?.(((g.getSelectedChar?.() ?? 0) + 1) % 3);
      else g.keys['ArrowRight'] = true;
    } else {
      g.keys[key] = down;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
      {/* Canvas */}
      <div
        style={{
          border: `5px solid ${C.gold}`,
          boxShadow: `0 0 0 3px ${C.green}, 0 0 0 6px ${C.gold}, 8px 8px 0 6px #000`,
          background: '#000',
          width: '100%',
          maxWidth: 780,
        }}
      >
        <canvas
          ref={canvasRef}
          width={780}
          height={520}
          style={{ width: '100%', display: 'block', imageRendering: 'pixelated' }}
        />
      </div>

      {/* Mobile controls */}
      {/* noSelectStyle kills iOS text-selection callout on long-press */}
      <style>{`
        .tc-btn {
          -webkit-user-select: none;
          -moz-user-select: none;
          user-select: none;
          -webkit-touch-callout: none;
          -webkit-tap-highlight-color: transparent;
          touch-action: none;
        }
        .tc-btn:active { opacity: 0.85; }
      `}</style>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1.5rem', flexWrap: 'wrap', marginTop: '0.75rem' }}>
        {/* ◀ ▶ movement */}
        <div style={{ display: 'flex', gap: '0.6rem' }}>
          {[['◀', 'ArrowLeft', true], ['▶', 'ArrowRight', true]].map(([lbl, key, hold]) => (
            <button
              key={key}
              className="tc-btn"
              style={{ fontFamily: '"Press Start 2P"', fontSize: '1rem', background: C.gold, color: C.green, border: 'none', width: 76, height: 66, cursor: 'pointer', boxShadow: '3px 3px 0 #000' }}
              onTouchStart={e => { e.preventDefault(); mb(key, true); }}
              onTouchEnd={e => { e.preventDefault(); hold && mb(key, false); }}
              onTouchCancel={e => { e.preventDefault(); hold && mb(key, false); }}
              onContextMenu={e => e.preventDefault()}
              onMouseDown={() => mb(key, true)}
              onMouseUp={() => hold && mb(key, false)}
              onMouseLeave={() => hold && mb(key, false)}
            >{lbl}</button>
          ))}
        </div>

        {/* JUMP */}
        <button
          className="tc-btn"
          style={{ fontFamily: '"Press Start 2P"', fontSize: '0.7rem', background: '#e74c3c', color: '#fff', border: 'none', width: 86, height: 66, cursor: 'pointer', boxShadow: '3px 3px 0 #000' }}
          onTouchStart={e => { e.preventDefault(); mb('jump', true); }}
          onTouchEnd={e => e.preventDefault()}
          onTouchCancel={e => e.preventDefault()}
          onContextMenu={e => e.preventDefault()}
          onMouseDown={() => mb('jump', true)}
        >▲ JUMP</button>

        {/* START */}
        <button
          className="tc-btn"
          style={{ fontFamily: '"Press Start 2P"', fontSize: '0.7rem', background: C.greenL, color: C.cream, border: 'none', width: 86, height: 66, cursor: 'pointer', boxShadow: '3px 3px 0 #000' }}
          onTouchStart={e => { e.preventDefault(); mb('start', true); }}
          onTouchEnd={e => e.preventDefault()}
          onTouchCancel={e => e.preventDefault()}
          onContextMenu={e => e.preventDefault()}
          onMouseDown={() => mb('start', true)}
        >START</button>
      </div>

      <div style={{ fontFamily: '"Press Start 2P"', fontSize: '0.4rem', color: 'rgba(245,240,220,0.3)', textAlign: 'center' }}>
        ← → MOVE &nbsp;|&nbsp; SPACE / ↑ JUMP &nbsp;|&nbsp; ENTER START
      </div>
    </div>
  );
}
