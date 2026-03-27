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
  const canvasRef  = useRef(null);
  const engineRef  = useRef(null);
  const rafRef     = useRef(null);
  const frameRef   = useRef(0);
  const musicRef   = useRef(null);
  const pausedRef  = useRef(false);   // ref so game loop closure reads live value
  const mutedRef   = useRef(false);

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
    // Only fires on touchcancel (OS interrupt — notification, call, etc.).
    // We do NOT hook pointerup/touchend globally because those fire for the
    // JUMP button too, which would wipe ArrowRight mid-air.
    // setPointerCapture on each DirBtn already guarantees pointerup reaches
    // the correct button element, so no global pointerup hook is needed.
    const clearDirKeys = () => {
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
    if (['gameover', 'win', 'title', 'charselect'].includes(gameState.state)) {
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
    } else if (key === 'start') {
      if (st === 'title')           { engine.gState = 'charselect'; engine.sync(); }
      else if (st === 'charselect') { engine.charIdx = engine.selChar; engine.startGame(); }
      else if (st === 'gameover')   engine.startGame();
      else if (st === 'win')        { engine.gState = 'charselect'; engine.sync(); }
    } else if (key === 'left') {
      if (down) {
        if (st === 'charselect') { engine.selChar = (engine.selChar + 2) % 3; engine.sync(); }
        else {
          // always clear the opposite key first — prevents both-stuck scenario
          engine.keys['ArrowRight'] = false;
          engine.keys['ArrowLeft']  = true;
        }
      } else {
        engine.keys['ArrowLeft'] = false;
      }
    } else if (key === 'right') {
      if (down) {
        if (st === 'charselect') { engine.selChar = (engine.selChar + 1) % 3; engine.sync(); }
        else {
          engine.keys['ArrowLeft']  = false;
          engine.keys['ArrowRight'] = true;
        }
      } else {
        engine.keys['ArrowRight'] = false;
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
  // DirBtn uses Pointer Events + setPointerCapture so pointerup ALWAYS fires
  // on the originating element even if the finger slides off — no stuck keys.
  const DirBtn = ({ label, k }) => (
    <button
      style={{ ...base,
        fontSize: '1.5rem', background: GLD, color: GRN,
        borderRadius: 8, boxShadow: '0 5px 0 rgba(0,0,0,0.5)',
        width: 86, height: 86, touchAction: 'none',
      }}
      onPointerDown={e => {
        e.preventDefault();
        e.currentTarget.setPointerCapture(e.pointerId);
        mb(k, true);
      }}
      onPointerUp={e => {
        e.preventDefault();
        mb(k, false);
      }}
      onPointerCancel={e => {
        e.preventDefault();
        mb(k, false);
      }}
      onContextMenu={e => e.preventDefault()}
    >{label}</button>
  );

  const ActBtn = ({ label, k, bg, size = 100 }) => (
    <button
      style={{ ...base,
        fontSize: '0.72rem', background: bg || '#e74c3c', color: '#fff',
        borderRadius: '50%', boxShadow: '0 5px 0 rgba(0,0,0,0.5)',
        whiteSpace: 'pre-line', textAlign: 'center', lineHeight: 1.4,
        width: size, height: size, touchAction: 'none',
      }}
      onPointerDown={e => { e.preventDefault(); e.currentTarget.setPointerCapture(e.pointerId); mb(k, true); }}
      onPointerUp={e => e.preventDefault()}
      onPointerCancel={e => e.preventDefault()}
      onContextMenu={e => e.preventDefault()}
    >{label}</button>
  );

  const PillBtn = ({ label, onPress, active, activeColor }) => (
    <button
      style={{ ...base,
        fontSize: '0.44rem',
        background: active ? (activeColor || '#e67e22') : '#1a271a',
        color: active ? '#fff' : '#888',
        border: `2px solid ${active ? (activeColor || '#e67e22') : '#2e3e2e'}`,
        borderRadius: 20, padding: '9px 16px',
        boxShadow: '0 3px 0 rgba(0,0,0,0.45)',
        touchAction: 'none',
      }}
      onPointerDown={e => { e.preventDefault(); onPress(); }}
      onPointerUp={e => e.preventDefault()}
      onContextMenu={e => e.preventDefault()}
    >{label}</button>
  );

  const MobileControls = () => (
    <div style={{
      background: GRN,
      borderTop: `3px solid ${GLD}`,
      padding: '10px 14px 12px',
      paddingBottom: 'max(12px, env(safe-area-inset-bottom, 12px))',
      display: 'flex', flexDirection: 'column', gap: 8,
    }}>
      {/* Utility row */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 10 }}>
        <PillBtn label={isPaused ? '▶  RESUME' : '⏸  PAUSE'} onPress={handlePause} active={isPaused} activeColor='#e67e22' />
        <PillBtn label={isMuted ? '🔇  MUTED' : '🔊  MUSIC'} onPress={handleMute} active={isMuted} activeColor='#555' />
      </div>

      {/* Controls row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {/* D-pad */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
          <div style={{ display: 'flex', gap: 8 }}>
            <DirBtn label="◀" k="left" />
            <DirBtn label="▶" k="right" />
          </div>
          <span style={{ fontFamily: '"Press Start 2P"', fontSize: '0.3rem', color: 'rgba(226,168,32,0.5)' }}>MOVE</span>
        </div>

        {/* START */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
          <button
            style={{ ...base, fontSize: '0.48rem', background: '#252525', color: '#ccc',
              border: '2px solid #4a4a4a', borderRadius: 20, padding: '10px 22px',
              boxShadow: '0 4px 0 rgba(0,0,0,0.5)', touchAction: 'none',
            }}
            onPointerDown={e => { e.preventDefault(); mb('start', true); }}
            onPointerUp={e => e.preventDefault()}
            onContextMenu={e => e.preventDefault()}
          >START</button>
        </div>

        {/* JUMP */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
          <ActBtn label={'A\nJUMP'} k="jump" bg="#c0392b" size={100} />
          <span style={{ fontFamily: '"Press Start 2P"', fontSize: '0.3rem', color: 'rgba(226,168,32,0.5)' }}>JUMP</span>
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
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}>
      <div style={{
        position: 'relative',
        border: `4px solid ${GLD}`, boxShadow: `4px 4px 0 #000`,
        background: '#000', width: '100%', maxWidth: 780, alignSelf: 'center',
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
