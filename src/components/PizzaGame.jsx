// ─────────────────────────────────────────────
//  PizzaGame.jsx
//  Thin React shell — canvas + controls only.
//  All logic lives in game/GameEngine.js
//  All drawing lives in game/renderer.js
// ─────────────────────────────────────────────
import { useEffect, useRef, useState, useCallback } from 'react';
import { GameEngine } from './game/GameEngine.js';
import { renderFrame } from './game/renderer.js';
import { GLD, GRN, GRN2, CREAM } from './game/constants.js';

export default function PizzaGame() {
  const canvasRef          = useRef(null);
  const engineRef          = useRef(null);
  const rafRef             = useRef(null);
  const frameRef           = useRef(0);
  const musicRef           = useRef(null);
  const pausedRef          = useRef(false);   // ref so game loop closure reads live value
  const mutedRef           = useRef(false);
  // Tracks which pointer IDs are currently held on direction buttons.
  // When React re-renders, button elements remount and lose setPointerCapture —
  // the global listener below catches the stray pointerup and clears the key.
  const activeDirPointers  = useRef({});

  const [gameState, setGameState] = useState({ state: 'title', score: 0, lives: 3, pizza: 0, hp: 100, level: 1 });
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMobile, setIsMobile]   = useState(false);
  const [isPaused, setIsPaused]   = useState(false);
  const [isMuted,  setIsMuted]    = useState(false);

  // ── DETECT MOBILE ────────────────────────────
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 768 || 'ontouchstart' in window);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // ── FULLSCREEN LISTENER ──────────────────────
  useEffect(() => {
    const handler = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handler);
    return () => document.removeEventListener('fullscreenchange', handler);
  }, []);

  // ── MAIN GAME LOOP ───────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const engine = new GameEngine((state) => setGameState(s => ({ ...s, ...state })));
    engineRef.current = engine;

    const music = new Audio('/kylesong.mp3');
    music.loop = true;
    music.volume = 0.5;
    musicRef.current = music;

    // wrap startGame to reset pause + play music
    const origStart = engine.startGame.bind(engine);
    engine.startGame = () => {
      origStart();
      pausedRef.current = false;
      setIsPaused(false);
      if (!mutedRef.current) { music.currentTime = 0; music.play().catch(() => {}); }
    };

    // wrap respawn to resume music
    const origRespawn = engine.respawn.bind(engine);
    engine.respawn = () => {
      origRespawn();
      if (!mutedRef.current && !pausedRef.current) music.play().catch(() => {});
    };

    // keyboard handler
    const onDown = (e) => {
      if (['Space','ArrowLeft','ArrowRight','ArrowUp'].includes(e.code)) e.preventDefault();

      // pause: P or Escape
      if (e.code === 'Escape' || e.code === 'KeyP') {
        if (engine.gState === 'playing') {
          const next = !pausedRef.current;
          pausedRef.current = next;
          setIsPaused(next);
          if (next) music.pause();
          else if (!mutedRef.current) music.play().catch(() => {});
        }
        return;
      }
      // mute: M
      if (e.code === 'KeyM') {
        const next = !mutedRef.current;
        mutedRef.current = next;
        setIsMuted(next);
        if (next) {
          music.volume = 0;
        } else {
          music.volume = 0.5;
          if (engine.gState === 'playing' && !pausedRef.current) music.play().catch(() => {});
        }
        return;
      }
      if (!pausedRef.current) engine.handleKey(e.code, true);
    };
    const onUp = (e) => { if (!pausedRef.current) engine.handleKey(e.code, false); };
    window.addEventListener('keydown', onDown);
    window.addEventListener('keyup', onUp);

    // ── DELTA-TIME GAME LOOP ──────────────────────
    // One physics tick per animation frame, scaled by dt so motion is
    // identical at 30 Hz, 60 Hz, 90 Hz, 120 Hz — perfectly smooth everywhere.
    //   dt = 1.0  → 60 fps (baseline)
    //   dt = 0.5  → 120 fps  (half step, twice as often)
    //   dt = 2.0  → 30 fps   (double step, half as often)
    const TARGET_MS = 1000 / 60;
    let lastTime = 0;

    function loop(now) {
      if (lastTime === 0) lastTime = now;
      // cap at ~4 frames so a tab-switch doesn't launch the player off-screen
      const elapsed = Math.min(now - lastTime, TARGET_MS * 4);
      lastTime = now;
      const dt = elapsed / TARGET_MS;

      if (!pausedRef.current) {
        engine.tick(dt);
        frameRef.current += dt;
      }

      renderFrame(ctx, engine, frameRef.current);

      if (pausedRef.current) {
        ctx.fillStyle = 'rgba(0,0,0,0.62)';
        ctx.fillRect(0, 0, 780, 520);
        ctx.fillStyle = GLD;
        ctx.font = '22px "Press Start 2P"';
        ctx.textAlign = 'center';
        ctx.fillText('PAUSED', 390, 242);
        ctx.fillStyle = CREAM;
        ctx.font = '8px "Press Start 2P"';
        ctx.fillText('PRESS P · ESC · OR TAP RESUME', 390, 276);
      }

      rafRef.current = requestAnimationFrame(loop);
    }
    requestAnimationFrame(loop);

    // ── DIRECTION-KEY SAFETY NET ──────────────────
    // React re-renders recreate button elements, losing setPointerCapture.
    // We track every direction-button pointer ID in activeDirPointers so that
    // even if the element remounts between pointerdown and pointerup, the global
    // listener here catches the orphaned pointerup and releases the key.
    const onGlobalPointerEnd = (e) => {
      if (activeDirPointers.current[e.pointerId] !== undefined) {
        delete activeDirPointers.current[e.pointerId];
        engine.keys['ArrowLeft']  = false;
        engine.keys['ArrowRight'] = false;
      }
    };
    window.addEventListener('pointerup',     onGlobalPointerEnd, { passive: true });
    window.addEventListener('pointercancel', onGlobalPointerEnd, { passive: true });
    // Also keep touchcancel for OS interrupts (call screen, notification, etc.)
    const clearDirKeys = () => {
      activeDirPointers.current = {};
      engine.keys['ArrowLeft']  = false;
      engine.keys['ArrowRight'] = false;
    };
    window.addEventListener('touchcancel', clearDirKeys, { passive: true });

    // stop music when tab is hidden, resume when tab returns
    const onVisibility = () => {
      if (document.hidden) {
        music.pause();
      } else if (engine.gState === 'playing' && !pausedRef.current && !mutedRef.current) {
        music.play().catch(() => {});
      }
    };
    document.addEventListener('visibilitychange', onVisibility);

    // stop music when canvas scrolls out of view (≥85% must be visible)
    // resume automatically when it scrolls back in
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) {
          music.pause();
        } else if (engine.gState === 'playing' && !pausedRef.current && !mutedRef.current) {
          music.play().catch(() => {});
        }
      },
      { threshold: 0.85 }
    );
    observer.observe(canvas);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('keydown', onDown);
      window.removeEventListener('keyup', onUp);
      window.removeEventListener('pointerup',     onGlobalPointerEnd);
      window.removeEventListener('pointercancel', onGlobalPointerEnd);
      window.removeEventListener('touchcancel', clearDirKeys);
      document.removeEventListener('visibilitychange', onVisibility);
      observer.disconnect();
      music.pause();
    };
  }, []);

  // stop music when game ends or goes back to menus
  useEffect(() => {
    const music = musicRef.current;
    if (!music) return;
    if (['gameover', 'win', 'title', 'charselect', 'initials'].includes(gameState.state)) {
      music.pause();
      music.currentTime = 0;
      pausedRef.current = false;
      setIsPaused(false);
    }
  }, [gameState.state]);

  // ── FULLSCREEN ───────────────────────────────
  const enterFullscreen = useCallback(async () => {
    try {
      const el = document.documentElement;
      if (el.requestFullscreen) await el.requestFullscreen();
      else if (el.webkitRequestFullscreen) await el.webkitRequestFullscreen();
      setIsFullscreen(true);
    } catch { setIsFullscreen(true); }
  }, []);

  const exitFullscreen = useCallback(async () => {
    try { if (document.fullscreenElement) await document.exitFullscreen(); } catch {}
    setIsFullscreen(false);
  }, []);

  // ── PAUSE / MUTE HANDLERS ────────────────────
  const handlePause = useCallback(() => {
    const engine = engineRef.current;
    const music  = musicRef.current;
    if (!engine || engine.gState !== 'playing') return;
    const next = !pausedRef.current;
    pausedRef.current = next;
    setIsPaused(next);
    if (music) { if (next) music.pause(); else if (!mutedRef.current) music.play().catch(() => {}); }
  }, []);

  const handleMute = useCallback(() => {
    const music  = musicRef.current;
    const engine = engineRef.current;
    if (!music) return;
    const next = !mutedRef.current;
    mutedRef.current = next;
    setIsMuted(next);
    if (next) {
      music.volume = 0;
    } else {
      music.volume = 0.5;
      if (engine && engine.gState === 'playing' && !pausedRef.current) music.play().catch(() => {});
    }
  }, []);

  // ── TOUCH / CLICK HANDLER ────────────────────
  const mb = useCallback((key, down) => {
    const engine = engineRef.current;
    if (!engine) return;
    const st = engine.gState;

    if (key === 'pause') { if (down) handlePause(); return; }
    if (key === 'mute')  { if (down) handleMute();  return; }
    if (key === 'fs')    { if (down) { isFullscreen ? exitFullscreen() : enterFullscreen(); } return; }

    if (pausedRef.current) return; // block gameplay while paused

    if (key === 'jump') {
      if (down && st === 'playing') engine.jump();
      else if (down && st === 'initials') engine.handleKey('Enter', true);
      else if (down && st === 'levelintro') engine.handleKey('Enter', true);
    } else if (key === 'start') {
      if (st === 'levelintro')      engine.handleKey('Enter', true);
      else if (st === 'title')      { engine.gState = 'initials'; engine.sync(); }
      else if (st === 'initials')   engine.handleKey('Enter', true);
      else if (st === 'charselect') { engine.charIdx = engine.selChar; engine.startGame(); }
      else if (st === 'gameover')   { engine.gState = 'charselect'; engine.sync(); }
      else if (st === 'win')        { engine.gState = 'charselect'; engine.sync(); }
    } else if (key === 'left') {
      if (down) {
        if (st === 'charselect') { engine.selChar = (engine.selChar + 2) % 3; engine.sync(); }
        else if (st === 'initials') engine.handleKey('ArrowLeft', true);
        else {
          // always clear the opposite key first — prevents both-stuck scenario
          engine.keys['ArrowRight'] = false;
          engine.keys['ArrowLeft']  = true;
        }
      } else {
        if (st !== 'initials') engine.keys['ArrowLeft'] = false;
      }
    } else if (key === 'right') {
      if (down) {
        if (st === 'charselect') { engine.selChar = (engine.selChar + 1) % 3; engine.sync(); }
        else if (st === 'initials') engine.handleKey('ArrowRight', true);
        else {
          engine.keys['ArrowLeft']  = false;
          engine.keys['ArrowRight'] = true;
        }
      } else {
        if (st !== 'initials') engine.keys['ArrowRight'] = false;
      }
    }
  }, [handlePause, handleMute, isFullscreen, enterFullscreen, exitFullscreen]);

  // ── SHARED BASE STYLE ───────────────────────
  const base = {
    fontFamily: '"Press Start 2P"',
    border: 'none', cursor: 'pointer',
    userSelect: 'none', WebkitUserSelect: 'none',
    WebkitTouchCallout: 'none', touchAction: 'none',
    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  };

  // ── FULLSCREEN OVERLAY BUTTON ────────────────
  const FsBtn = () => (
    <button
      style={{
        position: 'absolute', bottom: 6, right: 6, zIndex: 20,
        background: 'rgba(0,0,0,0.65)', color: GLD,
        border: `1px solid rgba(226,168,32,0.4)`,
        borderRadius: 5, padding: '3px 8px',
        fontFamily: '"Press Start 2P"', fontSize: '0.65rem',
        cursor: 'pointer', lineHeight: 1,
        userSelect: 'none', touchAction: 'none',
      }}
      onTouchStart={e => { e.preventDefault(); isFullscreen ? exitFullscreen() : enterFullscreen(); }}
      onTouchEnd={e => e.preventDefault()}
      onContextMenu={e => e.preventDefault()}
      onMouseDown={() => isFullscreen ? exitFullscreen() : enterFullscreen()}
    >{isFullscreen ? '⊠' : '⛶'}</button>
  );

  // ── DESKTOP CONTROLS ────────────────────────
  // Visual keyboard keycap (non-interactive display)
  const Key = ({ label, w = 44, h = 44 }) => (
    <div style={{
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      background: 'linear-gradient(to bottom, #eaeaea, #c8c8c8)',
      color: '#111',
      border: '1px solid #999',
      borderBottom: '4px solid #777',
      borderRadius: 6,
      minWidth: w, height: h,
      padding: '0 8px',
      fontFamily: '"Press Start 2P"',
      fontSize: w > 80 ? '0.55rem' : '0.6rem',
      boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.7), 0 2px 3px rgba(0,0,0,0.35)',
      userSelect: 'none',
      whiteSpace: 'nowrap',
    }}>{label}</div>
  );

  // Clickable keycap (PAUSE, MUTE — same look, but interactive)
  const ClickKey = ({ label, onPress, active, activeColor = '#e67e22' }) => (
    <button
      style={{
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        background: active
          ? `linear-gradient(to bottom, ${activeColor}dd, ${activeColor})`
          : 'linear-gradient(to bottom, #eaeaea, #c8c8c8)',
        color: active ? '#fff' : '#111',
        border: `1px solid ${active ? activeColor : '#999'}`,
        borderBottom: `4px solid ${active ? '#a04808' : '#777'}`,
        borderRadius: 6,
        height: 44, padding: '0 18px',
        fontFamily: '"Press Start 2P"', fontSize: '0.55rem',
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.4), 0 2px 3px rgba(0,0,0,0.35)',
        cursor: 'pointer', userSelect: 'none', whiteSpace: 'nowrap',
      }}
      onMouseDown={onPress}
    >{label}</button>
  );

  // One labelled key group
  const KeyGroup = ({ children, label }) => (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 7 }}>
      {children}
      <span style={{ fontFamily: '"Press Start 2P"', fontSize: '0.5rem', color: GLD, letterSpacing: 1 }}>
        {label}
      </span>
    </div>
  );

  const DesktopControls = () => (
    <div style={{
      background: GRN,
      borderTop: `3px solid ${GLD}`,
      padding: '14px 28px 16px',
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14,
    }}>
      {/* Row 1 — clickable utility keys */}
      <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
        <ClickKey
          label={isPaused ? '▶  RESUME' : '⏸  PAUSE'}
          onPress={handlePause}
          active={isPaused}
          activeColor='#e67e22'
        />
        <ClickKey
          label={isMuted ? '🔇  MUTED' : '🔊  MUSIC ON'}
          onPress={handleMute}
          active={isMuted}
          activeColor='#555'
        />
      </div>

      {/* Row 2 — visual keyboard map */}
      <div style={{ display: 'flex', gap: 28, alignItems: 'flex-start', flexWrap: 'wrap', justifyContent: 'center' }}>
        <KeyGroup label="MOVE LEFT / RIGHT">
          <div style={{ display: 'flex', gap: 6 }}>
            <Key label="←" />
            <Key label="→" />
          </div>
        </KeyGroup>

        <KeyGroup label="JUMP">
          <Key label="SPACE BAR" w={148} />
        </KeyGroup>

        <KeyGroup label="START / CONFIRM">
          <Key label="ENTER" w={88} />
        </KeyGroup>

        <KeyGroup label="PAUSE">
          <div style={{ display: 'flex', gap: 6 }}>
            <Key label="P" />
            <Key label="ESC" w={60} />
          </div>
        </KeyGroup>

        <KeyGroup label="MUTE MUSIC">
          <Key label="M" />
        </KeyGroup>
      </div>
    </div>
  );

  // ── MOBILE CONTROLS ──────────────────────────
  // Console-style button helpers — all use setPointerCapture for reliable release.

  // D-pad: a proper controller cross shape.
  // The left arm and right arm are separate touch targets inside a shared cross layout.
  const dpadArm = {
    ...base,
    touchAction: 'none',
    background: 'linear-gradient(180deg, #2e3148 0%, #1c1e2c 100%)',
    border: '1.5px solid #3a3d54',
    color: 'rgba(255,255,255,0.9)',
    fontSize: '1.6rem',
    userSelect: 'none',
    WebkitUserSelect: 'none',
  };

  // horizontal arms (left / right) — wide rectangles
  const dpadH = { ...dpadArm, width: 72, height: 48, borderRadius: 10 };

  const DPad = () => (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0, touchAction: 'none' }}>
      {/* main row: LEFT  ·  center nub  ·  RIGHT */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 0 }}>

        {/* LEFT arm */}
        <button
          style={{
            ...dpadH,
            borderRadius: '10px 4px 4px 10px',
            boxShadow: '0 5px 0 #0b0c14, inset 0 1px 0 rgba(255,255,255,0.1)',
            justifyContent: 'flex-start',
            paddingLeft: 14,
          }}
          onPointerDown={e => { e.preventDefault(); e.currentTarget.setPointerCapture(e.pointerId); activeDirPointers.current[e.pointerId] = 'left'; mb('left', true); }}
          onPointerUp={e => { e.preventDefault(); delete activeDirPointers.current[e.pointerId]; mb('left', false); }}
          onPointerCancel={e => { e.preventDefault(); delete activeDirPointers.current[e.pointerId]; mb('left', false); }}
          onContextMenu={e => e.preventDefault()}
        >
          {/* bold SVG triangle arrow */}
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
            <polygon points="4,11 16,3 16,19" fill="rgba(255,255,255,0.85)" />
          </svg>
        </button>

        {/* center nub */}
        <div style={{
          width: 28, height: 28,
          background: 'radial-gradient(circle, #252838, #181a26)',
          border: '1.5px solid #3a3d54',
          borderRadius: 4,
          flexShrink: 0,
          zIndex: 1,
        }} />

        {/* RIGHT arm */}
        <button
          style={{
            ...dpadH,
            borderRadius: '4px 10px 10px 4px',
            boxShadow: '0 5px 0 #0b0c14, inset 0 1px 0 rgba(255,255,255,0.1)',
            justifyContent: 'flex-end',
            paddingRight: 14,
          }}
          onPointerDown={e => { e.preventDefault(); e.currentTarget.setPointerCapture(e.pointerId); activeDirPointers.current[e.pointerId] = 'right'; mb('right', true); }}
          onPointerUp={e => { e.preventDefault(); delete activeDirPointers.current[e.pointerId]; mb('right', false); }}
          onPointerCancel={e => { e.preventDefault(); delete activeDirPointers.current[e.pointerId]; mb('right', false); }}
          onContextMenu={e => e.preventDefault()}
        >
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
            <polygon points="18,11 6,3 6,19" fill="rgba(255,255,255,0.85)" />
          </svg>
        </button>

      </div>
      <span style={{ fontFamily: '"Press Start 2P"', fontSize: '0.25rem', color: 'rgba(255,255,255,0.18)', marginTop: 5, letterSpacing: 2 }}>MOVE</span>
    </div>
  );

  // Large round action button — convex dome like a console face button
  const ActBtn = ({ label, k, btnColor = '#c0392b', shadowColor = '#7a1010', size = 96 }) => (
    <button
      style={{
        ...base,
        width: size, height: size,
        borderRadius: '50%',
        touchAction: 'none',
        flexDirection: 'column',
        gap: 2,
        color: '#fff',
        background: `radial-gradient(circle at 38% 32%, ${btnColor}ee, ${shadowColor}cc)`,
        boxShadow: [
          `0 7px 0 ${shadowColor}`,
          '0 10px 18px rgba(0,0,0,0.65)',
          'inset 0 2px 2px rgba(255,255,255,0.25)',
          'inset 0 -2px 4px rgba(0,0,0,0.35)',
        ].join(', '),
        border: `1.5px solid ${shadowColor}`,
      }}
      onPointerDown={e => { e.preventDefault(); e.currentTarget.setPointerCapture(e.pointerId); mb(k, true); }}
      onPointerUp={e => e.preventDefault()}
      onPointerCancel={e => e.preventDefault()}
      onContextMenu={e => e.preventDefault()}
    >
      <span style={{ fontFamily: '"Press Start 2P"', fontSize: '1rem', lineHeight: 1 }}>A</span>
      <span style={{ fontFamily: '"Press Start 2P"', fontSize: '0.38rem', opacity: 0.8, lineHeight: 1 }}>JUMP</span>
    </button>
  );

  // Small oval utility button — like SELECT / MENU on a real controller
  const UtilBtn = ({ label, onPress, active, activeColor = '#e67e22' }) => (
    <button
      style={{
        ...base,
        fontFamily: '"Press Start 2P"',
        fontSize: '0.36rem',
        color: active ? '#fff' : 'rgba(255,255,255,0.5)',
        height: 28,
        padding: '0 14px',
        borderRadius: 14,
        touchAction: 'none',
        background: active
          ? `linear-gradient(180deg, ${activeColor}cc, ${activeColor})`
          : 'linear-gradient(180deg, #2e3145, #1e2235)',
        boxShadow: active
          ? `0 3px 0 ${activeColor}88, 0 4px 8px rgba(0,0,0,0.5)`
          : '0 3px 0 #0d0e18, 0 4px 8px rgba(0,0,0,0.4)',
        border: `1px solid ${active ? activeColor : '#353850'}`,
      }}
      onPointerDown={e => { e.preventDefault(); onPress(); }}
      onPointerUp={e => e.preventDefault()}
      onContextMenu={e => e.preventDefault()}
    >{label}</button>
  );

  // Small oval START button — classic NES/SNES center button style
  const StartBtn = () => (
    <button
      style={{
        ...base,
        fontFamily: '"Press Start 2P"',
        fontSize: '0.4rem',
        color: 'rgba(255,255,255,0.7)',
        height: 32,
        padding: '0 18px',
        borderRadius: 16,
        touchAction: 'none',
        background: 'linear-gradient(180deg, #363a50, #22253a)',
        boxShadow: [
          '0 4px 0 #0d0e18',
          '0 5px 10px rgba(0,0,0,0.55)',
          'inset 0 1px 0 rgba(255,255,255,0.1)',
        ].join(', '),
        border: '1px solid #40435a',
        letterSpacing: 1,
      }}
      onPointerDown={e => { e.preventDefault(); mb('start', true); }}
      onPointerUp={e => e.preventDefault()}
      onContextMenu={e => e.preventDefault()}
    >START</button>
  );

  const MobileControls = () => (
    <div style={{
      background: 'linear-gradient(180deg, #1a1c28 0%, #13141e 100%)',
      borderTop: `2px solid #2a2d40`,
      paddingTop: 10,
      paddingBottom: 'max(14px, env(safe-area-inset-bottom, 14px))',
      paddingLeft: 16,
      paddingRight: 16,
      display: 'flex',
      flexDirection: 'column',
      gap: 10,
    }}>
      {/* Utility row — small, centered, like controller menu buttons */}
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 10 }}>
        <UtilBtn label={isPaused ? '▶ RESUME' : '⏸ PAUSE'} onPress={handlePause} active={isPaused} activeColor='#e67e22' />
        <UtilBtn label={isMuted  ? '🔇 MUTED' : '🔊 MUSIC'} onPress={handleMute}  active={isMuted}  activeColor='#555566' />
      </div>

      {/* Main control row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 4 }}>

        {/* Left — proper d-pad cross */}
        <DPad />

        {/* Center — START */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
          <StartBtn />
        </div>

        {/* Right — A (JUMP) face button */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5 }}>
          <ActBtn k="jump" btnColor='#d63031' shadowColor='#6b0f0f' size={96} />
        </div>

      </div>
    </div>
  );

  const Controls = isMobile ? MobileControls : DesktopControls;

  // ── FULLSCREEN LAYOUT ───────────────────────
  if (isFullscreen) {
    return (
      <div style={{ position: 'fixed', inset: 0, zIndex: 9999, background: '#000', display: 'flex', flexDirection: 'column' }}>
        <div style={{ flex: 1, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', background: '#000' }}>
          <canvas
            ref={canvasRef}
            width={780} height={520}
            style={{ maxWidth: '100%', maxHeight: '100%', imageRendering: 'pixelated', display: 'block' }}
          />
          <FsBtn />
        </div>
        <Controls />
      </div>
    );
  }

  // ── NORMAL LAYOUT ───────────────────────────
  // On mobile: the canvas wrapper is 120vw wide (overflows 10vw each side)
  // and the outer div clips it. This makes the game 20% larger without
  // changing the internal canvas resolution — characters are visibly bigger.
  // HUD elements are shifted 82–95 px inward to stay in the visible safe zone.
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'stretch',
      overflow: isMobile ? 'hidden' : 'visible',
    }}>
      <div style={{
        position: 'relative',
        background: '#000',
        ...(isMobile ? {
          width: '120vw',
          marginLeft: '-10vw',
        } : {
          border: `4px solid ${GLD}`,
          boxShadow: `4px 4px 0 #000`,
          width: '100%',
          maxWidth: 780,
          alignSelf: 'center',
        }),
      }}>
        <canvas
          ref={canvasRef}
          width={780} height={520}
          style={{ width: '100%', display: 'block', imageRendering: 'pixelated' }}
        />
        <FsBtn />
      </div>
      <Controls />
    </div>
  );
}
