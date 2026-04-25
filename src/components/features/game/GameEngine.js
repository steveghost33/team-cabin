import {
  W, H, GROUND, PW, PH,
  GRAVITY, JUMP_POWER, MOVE_SPEED,
  MAX_HP, HP_REGEN, MAX_LIVES, PIZZA_TO_BOSS,
  GLD, LEVELS
} from './constants.js';

export class GameEngine {
  constructor(onSync) {
    this.onSync = onSync;    // callback to update React state
    this.reset();
  }

  reset() {
    this.gState = 'title';
    this.sc = 0;
    this.lives = MAX_LIVES;
    this.pc = 0;               // pizza count
    this.lvlIdx = 0;           // current level index
    this.frame = 0;
    this.scrollX = 0;
    this.spT = 0;              // spawn timer
    this.piT = 0;              // pizza timer
    this.hpT = 0;              // heart timer
    this.highSc = 0;
    this.obs = [];
    this.pizzas = [];
    this.hearts = [];
    this.parts = [];
    this.blds = [];
    this.cars = [];
    this.carT = 0;
    this.boss = null;
    this.bossDeadTimer = 0;
    this.nextLvlTimer = 0;
    this.groveX = 0;
    this.halesBarks = [];
    this.halesBarkT = 0;
    this.walkingIn = false;
    this.keys = {};
    this.charIdx = 0;
    this.selChar = 0;
    this.jumpPressed = false;
    this.eid = 0;
    this.initials = ['A', 'A', 'A'];
    this.initialsPos = 0;

    this.pl = {
      x: 80, y: GROUND - PH,
      vx: 0, vy: 0,
      og: true,          // on ground
      face: 1,
      inv: 0,            // invincibility frames
      hp: MAX_HP,
      dying: false,
      dyingTimer: 0,
      dyingLaunched: false,
    };
  }

  get lvl() { return LEVELS[this.lvlIdx]; }

  sync() {
    this.onSync({
      state: this.gState,
      score: this.sc,
      lives: this.lives,
      pizza: this.pc,
      hp: this.pl.hp,
      maxHp: MAX_HP,
      level: this.lvlIdx + 1,
      levelName: this.lvl.name,
      highScore: this.highSc,
      boss: this.boss ? { hp: this.boss.hp, maxHp: this.boss.maxHp, label: this.boss.label } : null,
      pizzaTarget: PIZZA_TO_BOSS,
      initials: this.initials.join(''),
      initialsPos: this.initialsPos,
    });
  }

  startGame() {
    this.sc = 0; this.lives = MAX_LIVES; this.lvlIdx = 0; this.pc = 0;
    this.charIdx = this.selChar;
    this._resetLevel();
    this.gState = 'levelintro';
    this.introTimer = 260;   // ~4.3 s at 60 Hz
    this.sync();
  }

  respawn() {
    this.pl.hp = MAX_HP;
    this.pl.x = 80; this.pl.y = GROUND - PH;
    this.pl.vx = 0; this.pl.vy = 0;
    this.pl.og = true; this.pl.inv = 180;
    this.pl.dying = false; this.pl.dyingTimer = 0; this.pl.dyingLaunched = false;
    this.charIdx = this.selChar;
    this.gState = 'playing';
    this.sync();
  }

  _resetLevel() {
    const pl = this.pl;
    pl.x = 80; pl.y = GROUND - PH;
    pl.vx = 0; pl.vy = 0;
    pl.og = true; pl.inv = 60; pl.hp = MAX_HP;
    pl.dying = false; pl.dyingTimer = 0; pl.dyingLaunched = false;
    this.obs = []; this.pizzas = []; this.hearts = [];
    this.parts = []; this.blds = []; this.cars = []; this.carT = 0;
    this.boss = null;
    this.groveX = 0; this.walkingIn = false;
    this.halesBarks = []; this.halesBarkT = 0;
    this.scrollX = 0; this.spT = 0; this.piT = 0; this.hpT = 0; this.pc = 0;
    this.keys = {};         // clear any stuck keys from previous screens
    for (let i = 0; i < 26; i++) this.blds.push(this._mkBld(i * 165 + 200));
  }

  _mkBld(x) {
    const lvl = this.lvl;
    const cols = lvl.buildingCols;
    return {
      x, w: 50 + Math.random() * 90,
      h: 70 + Math.random() * 165,
      color: cols[Math.floor(Math.random() * cols.length)],
      wc: Math.floor(Math.random() * 4) + 2,
      wr: Math.floor(Math.random() * 3) + 2,
    };
  }

  jump() {
    const pl = this.pl;
    if (pl.og && !pl.dying) { pl.vy = JUMP_POWER; pl.og = false; }
  }

  _spawnEnemy() {
    if (this.boss) return;
    const lvl = this.lvl;
    const types = lvl.enemyTypes;
    const type = types[Math.floor(Math.random() * types.length)];
    const geo = {
      cone: { w: 18, h: 26 }, metermaid: { w: 22, h: 38 },
      muscledude: { w: 28, h: 40 }, rat: { w: 20, h: 16 }, biker: { w: 26, h: 40 },
    }[type];
    const speed = lvl.enemySpeed + Math.random() * 0.8;
    this.obs.push({
      id: this.eid++, type,
      x: this.scrollX + W + 80,
      y: GROUND - geo.h, w: geo.w, h: geo.h,
      vx: -(speed), at: 0,
      dead: false, deadTimer: 0,
      hp: 1,
    });
  }

  _spawnPizza() {
    if (this.boss) return;
    // prevent clustering: skip if last pizza is within 280 world-px
    const spawnX = this.scrollX + W + 80;
    const last = this.pizzas[this.pizzas.length - 1];
    if (last && spawnX - last.x < 280) return;
    const fly = Math.random() < 0.38;
    this.pizzas.push({
      x: spawnX,
      y: fly ? GROUND - PH - 48 - Math.random() * 55 : GROUND - PH - 4,
      bob: Math.random() * Math.PI * 2,
      collected: false,
    });
  }

  _spawnHeart() {
    if (this.boss) return;
    this.hearts.push({
      x: this.scrollX + W + 90,
      y: GROUND - PH - 6,
      bob: Math.random() * Math.PI * 2,
      collected: false,
    });
  }

  _triggerBoss() {
    this.obs = []; this.pizzas = []; this.hearts = [];
    const bossDefs = {
      landlord: { w: 60, h: 82, maxHp: 200, label: 'LANDLORD', speed: 1.8 },
      ratking:  { w: 62, h: 92, maxHp: 280, label: 'RAT KING', speed: 2.2 },
      recordexec: { w: 60, h: 82, maxHp: 340, label: 'RECORD EXEC', speed: 2.8 },
    };
    const def = bossDefs[this.lvl.boss];
    this.boss = {
      type: this.lvl.boss, ...def,
      x: this.scrollX + W + 80, y: GROUND - def.h,
      vx: -def.speed, hp: def.maxHp,
      inv: 0, hitFlash: 0,
      dead: false,
    };
    this.sync();
  }

  _addParts(x, y, col, n) {
    for (let i = 0; i < n; i++) this.parts.push({
      x, y,
      vx: (Math.random() - 0.5) * 7,
      vy: (Math.random() - 0.5) * 7 - 2,
      life: 50 + Math.random() * 20, ml: 70,
      col, sz: 3 + Math.random() * 4,
    });
  }

  // dt = elapsed ms / 16.667  (1.0 at 60 Hz, 0.5 at 120 Hz, 2.0 at 30 Hz)
  // Every per-frame accumulation is multiplied by dt so physics are identical
  // at any display refresh rate.  Instantaneous resets (jump impulse, etc.)
  // are NOT multiplied — they are velocity assignments, not accumulations.
  tick(dt = 1) {
    this.frame += dt;
    const { pl, lvl } = this;

    // ── LEVEL INTRO TIMER ─────────────────────
    if (this.gState === 'levelintro') {
      this.introTimer -= dt;
      if (this.introTimer <= 0) { this.gState = 'playing'; this.sync(); }
      return;
    }

    // ── LEVEL UP TIMER ────────────────────────
    if (this.gState === 'levelup') {
      this.nextLvlTimer -= dt;
      if (this.nextLvlTimer <= 0) {
        this.gState = 'levelintro';
        this.introTimer = 260;
        this.sync();
      }
      return;
    }

    if (this.gState !== 'playing') return;

    // ── DYING animation ───────────────────────
    // Phase 1 (dyingTimer 120→80): freeze in place, scale up
    // Phase 2 (dyingTimer 80→0):  launch upward, spin, fall
    if (pl.dying) {
      pl.dyingTimer -= dt;
      if (!pl.dyingLaunched && pl.dyingTimer <= 80) {
        pl.dyingLaunched = true;
        pl.vx = 0;
        pl.vy = -14;
      }
      if (pl.dyingLaunched) {
        pl.vy += GRAVITY * dt;
        pl.y  += pl.vy * dt;
      }
      if (pl.dyingTimer <= 0) {
        this.lives--;
        if (this.lives <= 0) {
          if (this.sc > this.highSc) this.highSc = this.sc;
          this.gState = 'gameover';
          this.sync();
        } else {
          this.respawn();
        }
      }
      return;
    }

    // ── MOVEMENT ──────────────────────────────
    // vx is a target velocity, not an accumulation → no dt on the assignment.
    // Position update below DOES use dt.
    if (this.keys['ArrowLeft'])       { pl.vx = -MOVE_SPEED; pl.face = -1; }
    else if (this.keys['ArrowRight']) { pl.vx =  MOVE_SPEED; pl.face =  1; }
    else {
      // frame-rate-independent friction: same result at any hz
      pl.vx *= Math.pow(0.5, dt);
      if (Math.abs(pl.vx) < 0.05) pl.vx = 0;
    }

    // auto-walk into Grove Studios — override player input
    if (this.walkingIn) { pl.vx = MOVE_SPEED * 0.9; pl.face = 1; }

    if ((this.keys['ArrowUp'] || this.keys['Space'] || this.keys['KeyW']) && !this.jumpPressed) {
      this.jumpPressed = true;
      this.jump();
    }
    if (!this.keys['ArrowUp'] && !this.keys['Space'] && !this.keys['KeyW']) {
      this.jumpPressed = false;
    }

    pl.vy += GRAVITY * dt;
    pl.x  += pl.vx  * dt;
    pl.y  += pl.vy  * dt;

    if (pl.y + PH >= GROUND) { pl.y = GROUND - PH; pl.vy = 0; pl.og = true; } else pl.og = false;
    if (pl.x < 10)           pl.x = 10;
    if (pl.x > W - PW - 10) pl.x = W - PW - 10;
    pl.inv = Math.max(0, pl.inv - dt);

    // scroll camera — lock during active boss fight, but allow when boss is dead (e.g. Grove walk-in)
    if (!(this.boss && !this.boss.dead) && pl.x > W * 0.42) { const d = pl.x - W * 0.42; this.scrollX += d; pl.x = W * 0.42; }

    // ── SPAWNING ──────────────────────────────
    if (!this.boss) {
      this.spT += dt;
      if (this.spT >= lvl.spawnRate) { this._spawnEnemy(); this.spT = 0; }
      this.piT += dt;
      if (this.piT >= lvl.pizzaRate) { this._spawnPizza(); this.piT = 0; }
      this.hpT += dt;
      if (this.hpT >= lvl.heartRate) { this._spawnHeart(); this.hpT = 0; }
      // Ferndale cars — spawn periodically on level 2
      if (this.lvlIdx === 1) {
        this.carT += dt;
        if (this.carT >= 320) {
          this.cars.push({ x: this.scrollX + W + 80, y: GROUND - 26, w: 64, h: 26, vx: -5.5 });
          this.carT = 0;
        }
      }
    }

    if (this.pc >= PIZZA_TO_BOSS && !this.boss) this._triggerBoss();

    // ── BOSS LOGIC ────────────────────────────
    if (this.boss && !this.boss.dead) {
      const b = this.boss;
      b.x += b.vx * dt;
      b.inv     = Math.max(0, b.inv     - dt);
      b.hitFlash = Math.max(0, b.hitFlash - dt);
      const bOx = b.x - this.scrollX;

      // bounce — keep boss away from screen edges so player isn't cornered
      if (bOx < 140)          b.vx =  Math.abs(b.vx);
      if (bOx > W - b.w - 140) b.vx = -Math.abs(b.vx);

      // stomp boss
      const pb = pl.y + PH;
      const overlapX = pl.x + PW > bOx && pl.x < bOx + b.w;
      const stomping = pl.vy > 0 && pb >= b.y && pb <= b.y + 18 && overlapX;

      if (stomping && b.inv <= 0) {
        b.hp -= 40; b.inv = 50; b.hitFlash = 20;
        pl.vy = -12;            // impulse — no dt, keep horizontal momentum
        this.sc += 500;
        this._addParts(bOx + b.w/2, b.y, GLD, 18);
        if (b.hp <= 0) {
          b.dead = true; this.sc += 2000;
          if (this.lvlIdx === 0) {
            // place Grove Studios ahead and auto-walk player in
            this.groveX = this.scrollX + W + 60;
            this.walkingIn = true;
            this.bossDeadTimer = 600; // long timeout — walk-in will trigger transition early
          } else if (this.lvlIdx === 1) {
            this.bossDeadTimer = 360; // Ferndale: hold for PugFest celebration
          } else {
            this.bossDeadTimer = 120;
          }
        }
        this.sync();
      } else if (pl.inv <= 0 && overlapX && pl.y < b.y + b.h && pl.y + PH > b.y && !stomping) {
        pl.hp -= 18;
        pl.inv = 80;
        this._addParts(pl.x + PW/2, pl.y + PH/2, '#e74c3c', 10);
        if (pl.hp <= 0) this._die();
        this.sync();
      }
    }

    if (this.boss && this.boss.dead) {
      // level 0: check if player has reached the Grove Studios door
      if (this.walkingIn && this.groveX > 0) {
        const doorScreenX = this.groveX - this.scrollX + 12;
        if (doorScreenX <= pl.x + PW) {
          this.walkingIn = false;
          this.bossDeadTimer = 0;
        }
      }

      this.bossDeadTimer -= dt;
      if (this.bossDeadTimer <= 0) {
        if (this.lvlIdx < LEVELS.length - 1) {
          this.lvlIdx++;
          this._resetLevel();
          this.gState = 'levelup';
          this.nextLvlTimer = 180;
          this.sync();
        } else {
          if (this.sc > this.highSc) this.highSc = this.sc;
          this.gState = 'win';
          this.sync();
        }
      }
    }

    // ── ENEMIES ───────────────────────────────
    this.obs = this.obs.filter(o => {
      const ox = o.x - this.scrollX;
      if (ox < -120) return false;
      if (o.dead) { o.deadTimer -= dt; return o.deadTimer > 0; }
      o.x  += o.vx * dt;
      o.at += dt;

      // stomp — use half enemy height as window so taller enemies in later levels register correctly
      if (!pl.og && pl.vy > 0) {
        const pb = pl.y + PH;
        const stompZone = o.y + Math.max(16, o.h * 0.52);
        if (ox + o.w > pl.x && ox < pl.x + PW && pb >= o.y && pb <= stompZone) {
          if (o.type === 'cone') {
            // cones are indestructible — bounce player back and deal damage
            if (pl.inv <= 0) {
              pl.hp -= 15;
              pl.inv = 60;
              this._addParts(ox + o.w/2, o.y, '#FF6600', 8);
              if (pl.hp <= 0) this._die();
              this.sync();
            }
            pl.vy = -8;   // bounce off, keep horizontal momentum
            return true;
          }
          o.hp--;
          if (o.hp <= 0) {
            o.dead = true; o.deadTimer = 30;
            this.sc += 200;
            this._addParts(ox + o.w/2, o.y, GLD, 10);
            this.sync();
          }
          pl.vy = -10;  // bounce impulse only — keep horizontal momentum
          return true;
        }
      }
      // hurt player
      if (pl.inv <= 0 && ox + o.w > pl.x && ox < pl.x + PW && o.y + o.h > pl.y && o.y < pl.y + PH) {
        pl.hp -= 12;
        pl.inv = 70;
        this._addParts(pl.x + PW/2, pl.y + PH/2, '#e74c3c', 8);
        if (pl.hp <= 0) this._die();
        this.sync();
      }
      return true;
    });

    // ── FERNDALE CARS ─────────────────────────
    this.cars = this.cars.filter(car => {
      const cx = car.x - this.scrollX;
      if (cx < -90) return false;
      car.x += car.vx * dt;
      if (pl.inv <= 0 && cx + car.w > pl.x && cx < pl.x + PW &&
          car.y + car.h > pl.y && car.y < pl.y + PH) {
        const pb = pl.y + PH;
        const clearing = pb <= car.y + 5 && pl.vy >= 0;
        if (!clearing) {
          pl.hp -= 22;
          pl.inv = 90;
          pl.vx = (pl.x < cx + car.w / 2 ? -1 : 1) * 5;
          this._addParts(pl.x + PW / 2, pl.y + PH / 2, '#e74c3c', 12);
          if (pl.hp <= 0) this._die();
          this.sync();
        }
      }
      return true;
    });

    // ── PIZZAS ────────────────────────────────
    this.pizzas = this.pizzas.filter(pz => {
      if (pz.collected) return false;
      const ox = pz.x - this.scrollX;
      if (ox < -80) return false;
      const oy = pz.y + Math.sin(this.frame * 0.08 + pz.bob) * 5;
      if (pl.x < ox + 28 && pl.x + PW > ox && pl.y < oy + 28 && pl.y + PH > oy) {
        pz.collected = true;
        this.sc += 100; this.pc++;
        this._addParts(ox + 14, pz.y, GLD, 12);
        this.sync();
        return false;
      }
      return true;
    });

    // ── HEARTS ────────────────────────────────
    this.hearts = this.hearts.filter(h => {
      if (h.collected) return false;
      const ox = h.x - this.scrollX;
      if (ox < -60) return false;
      const oy = h.y + Math.sin(this.frame * 0.1 + h.bob) * 4;
      if (pl.x < ox + 16 && pl.x + PW > ox && pl.y < oy + 16 && pl.y + PH > oy) {
        h.collected = true;
        pl.hp = Math.min(MAX_HP, pl.hp + HP_REGEN);
        this._addParts(ox + 8, h.y, '#e74c3c', 8);
        this.sync();
        return false;
      }
      return true;
    });

    // ── PARTICLES ─────────────────────────────
    this.parts = this.parts.filter(p => {
      p.x    += p.vx  * dt;
      p.y    += p.vy  * dt;
      p.vy   += 0.2   * dt;
      p.life -= dt;
      return p.life > 0;
    });

    // ── HALE'S KITCHEN BARKS (Ypsilanti only) ────
    if (this.lvlIdx === 0) {
      const HALES_X = 3800; // world x of the property
      const plWorldX = pl.x + this.scrollX;
      const distToHales = Math.abs(plWorldX - HALES_X);

      // tick existing barks
      this.halesBarks = this.halesBarks.filter(b => {
        b.x += b.vx * dt;
        b.life -= dt;
        const bsx = b.x - this.scrollX;
        if (bsx < -80) return false;
        // collision with player — bark hitbox
        if (pl.inv <= 0 &&
            bsx + b.w > pl.x && bsx < pl.x + PW &&
            b.y + b.h > pl.y && b.y < pl.y + PH) {
          pl.hp -= 8;
          pl.inv = 55;
          this._addParts(pl.x + PW / 2, pl.y + PH / 2, '#FF8C00', 6);
          if (pl.hp <= 0) this._die();
          this.sync();
          return false;
        }
        return b.life > 0;
      });

      // spawn new barks when player is close and no boss
      if (distToHales < 400 && !this.boss) {
        this.halesBarkT -= dt;
        if (this.halesBarkT <= 0) {
          this.halesBarkT = 75 + Math.floor(Math.random() * 50);
          // two dogs at fixed yard positions
          const dogWorldPositions = [HALES_X + 40, HALES_X + 160];
          dogWorldPositions.forEach(dogWX => {
            const dsx = dogWX - this.scrollX;
            if (dsx > -20 && dsx < W + 20) {
              this.halesBarks.push({
                x: dogWX,
                y: GROUND - 48,
                vx: plWorldX < dogWX ? -3.8 : 3.8, // bark toward player
                w: 28, h: 18,
                life: 180,
              });
            }
          });
        }
      }
    }

    // ── BUILDINGS ─────────────────────────────
    if (!this.blds.length || this.blds[this.blds.length-1].x - this.scrollX < W + 300) {
      this.blds.push(this._mkBld((this.blds[this.blds.length-1]?.x || 200) + 100 + Math.random() * 120));
    }
    this.blds = this.blds.filter(b => b.x - this.scrollX > -300);
  }

  _die() {
    const pl = this.pl;
    pl.dying = true;
    pl.dyingTimer = 120;   // 40 frames freeze + 80 frames launch
    pl.dyingLaunched = false;
    pl.vx = 0;
    pl.vy = 0;
  }

  handleKey(code, down) {
    this.keys[code] = down;
    if (!down) return;
    if (code === 'Space' && this.gState === 'playing') { this.jump(); return; }

    // ── SKIP LEVEL INTRO ──────────────────────────
    if (this.gState === 'levelintro') {
      this.introTimer = 0;
      return;
    }

    // ── INITIALS ENTRY ────────────────────────────
    if (this.gState === 'initials') {
      const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
      if (code === 'ArrowLeft' || code === 'ArrowUp') {
        const cur = CHARS.indexOf(this.initials[this.initialsPos]);
        this.initials[this.initialsPos] = CHARS[(cur - 1 + CHARS.length) % CHARS.length];
        this.sync();
      } else if (code === 'ArrowRight' || code === 'ArrowDown') {
        const cur = CHARS.indexOf(this.initials[this.initialsPos]);
        this.initials[this.initialsPos] = CHARS[(cur + 1) % CHARS.length];
        this.sync();
      } else if (code === 'Enter' || code === 'Space') {
        if (this.initialsPos < 2) {
          this.initialsPos++;
          this.sync();
        } else {
          this.initialsPos = 0;
          this.gState = 'charselect';
          this.sync();
        }
      }
      return;
    }

    if (this.gState === 'charselect') {
      if (code === 'ArrowLeft') { this.selChar = (this.selChar + 2) % 3; this.sync(); }
      if (code === 'ArrowRight') { this.selChar = (this.selChar + 1) % 3; this.sync(); }
    }
    if (code === 'Enter') {
      if (this.gState === 'title') { this.gState = 'initials'; this.sync(); }
      else if (this.gState === 'charselect') { this.charIdx = this.selChar; this.startGame(); }
      else if (this.gState === 'gameover') { this.gState = 'charselect'; this.sync(); }
      else if (this.gState === 'dead') {
        if (this.lives > 0) this.respawn(); else { this.gState = 'charselect'; this.sync(); }
      }
      else if (this.gState === 'win') { this.gState = 'charselect'; this.sync(); }
    }
  }
}
