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

    // game loop — always render, skip tick when paused, draw pause overlay on top
    function loop() {
      if (!pausedRef.current) {
        engine.tick();
        frameRef.current++;
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
    loop();

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
    } else if (key === 'left' && down) {
      if (st === 'charselect') { engine.selChar = (engine.selChar + 2) % 3; engine.sync(); }
      else engine.keys['ArrowLeft'] = true;
    } else if (key === 'right' && down) {
      if (st === 'charselect') { engine.selChar = (engine.selChar + 1) % 3; engine.sync(); }
      else engine.keys['ArrowRight'] = true;
    } else if (key === 'left'  && !down) { engine.keys['ArrowLeft']  = false; }
      else if (key === 'right' && !down) { engine.keys['ArrowRight'] = false; }
  }, [handlePause, handleMute, isFullscreen, enterFullscreen, exitFullscreen]);

  // ── SHARED BUTTON BASE STYLE ─────────────────
  const base = {
    fontFamily: '"Press Start 2P"',
    border: 'none', cursor: 'pointer',
    userSelect: 'none', WebkitUserSelect: 'none',
    WebkitTouchCallout: 'none', touchAction: 'none',
    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  };

  // D-pad direction button (hold)
  const DirBtn = ({ label, k }) => (
    <button
      style={{ ...base,
        fontSize: isMobile ? '1.5rem' : '1.1rem',
        background: GLD, color: GRN,
        borderRadius: 8,
        boxShadow: '0 5px 0 rgba(0,0,0,0.5)',
        width: isMobile ? 86 : 70, height: isMobile ? 86 : 70,
      }}
      onTouchStart={e => { e.preventDefault(); mb(k, true); }}
      onTouchEnd={e => { e.preventDefault(); mb(k, false); }}
      onTouchCancel={e => { e.preventDefault(); mb(k, false); }}
      onContextMenu={e => e.preventDefault()}
      onMouseDown={() => mb(k, true)}
      onMouseUp={() => mb(k, false)}
      onMouseLeave={() => mb(k, false)}
    >{label}</button>
  );

  // Round action button (tap)
  const ActBtn = ({ label, k, bg, size }) => (
    <button
      style={{ ...base,
        fontSize: isMobile ? '0.72rem' : '0.6rem',
        background: bg || '#e74c3c', color: '#fff',
        borderRadius: '50%',
        boxShadow: '0 5px 0 rgba(0,0,0,0.5)',
        whiteSpace: 'pre-line', textAlign: 'center', lineHeight: 1.4,
        width: size || (isMobile ? 100 : 86), height: size || (isMobile ? 100 : 86),
      }}
      onTouchStart={e => { e.preventDefault(); mb(k, true); }}
      onTouchEnd={e => e.preventDefault()}
      onContextMenu={e => e.preventDefault()}
      onMouseDown={() => mb(k, true)}
    >{label}</button>
  );

  // Small pill utility button
  const PillBtn = ({ label, onPress, active, activeColor }) => (
    <button
      style={{ ...base,
        fontSize: isMobile ? '0.44rem' : '0.38rem',
        background: active ? (activeColor || '#e67e22') : '#1a271a',
        color: active ? '#fff' : '#888',
        border: `2px solid ${active ? (activeColor || '#e67e22') : '#2e3e2e'}`,
        borderRadius: 20,
        padding: isMobile ? '9px 16px' : '7px 13px',
        boxShadow: '0 3px 0 rgba(0,0,0,0.45)',
      }}
      onTouchStart={e => { e.preventDefault(); onPress(); }}
      onTouchEnd={e => e.preventDefault()}
      onContextMenu={e => e.preventDefault()}
      onMouseDown={onPress}
    >{label}</button>
  );

  // Fullscreen overlay button (bottom-right of canvas)
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

  // label under a button
  const BtnLabel = ({ text }) => (
    <span style={{ fontFamily: '"Press Start 2P"', fontSize: '0.28rem', color: 'rgba(226,168,32,0.45)', marginTop: 2 }}>
      {text}
    </span>
  );

  // ── CONTROL BAR ─────────────────────────────
  const ControlBar = () => (
    <div style={{
      background: GRN,
      borderTop: `3px solid ${GLD}`,
      padding: isMobile ? '10px 14px 12px' : '8px 20px 10px',
      paddingBottom: `max(${isMobile ? '12px' : '10px'}, env(safe-area-inset-bottom, ${isMobile ? '12px' : '10px'}))`,
      display: 'flex', flexDirection: 'column', gap: 8,
    }}>

      {/* ── Utility row: PAUSE + MUTE ── */}
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 10 }}>
        <PillBtn
          label={isPaused ? '▶  RESUME' : '⏸  PAUSE'}
          onPress={handlePause}
          active={isPaused}
          activeColor='#e67e22'
        />
        <PillBtn
          label={isMuted ? '🔇  MUTED' : '🔊  MUSIC'}
          onPress={handleMute}
          active={isMuted}
          activeColor='#555'
        />
      </div>

      {/* ── Controls row ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>

        {/* Left: D-pad */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
          <div style={{ display: 'flex', gap: 8 }}>
            <DirBtn label="◀" k="left" />
            <DirBtn label="▶" k="right" />
          </div>
          <BtnLabel text="MOVE" />
        </div>

        {/* Center: START + keyboard hint (desktop only) */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
          <button
            style={{ ...base,
              fontSize: '0.48rem',
              background: '#252525', color: '#ccc',
              border: '2px solid #4a4a4a',
              borderRadius: 20,
              padding: isMobile ? '10px 22px' : '8px 20px',
              boxShadow: '0 4px 0 rgba(0,0,0,0.5)',
            }}
            onTouchStart={e => { e.preventDefault(); mb('start', true); }}
            onTouchEnd={e => e.preventDefault()}
            onContextMenu={e => e.preventDefault()}
            onMouseDown={() => mb('start', true)}
          >START</button>
          {!isMobile && (
            <div style={{ fontFamily: '"Press Start 2P"', fontSize: '0.26rem', color: 'rgba(226,168,32,0.32)', textAlign: 'center', lineHeight: 2.1 }}>
              ← → MOVE &nbsp;·&nbsp; SPACE JUMP<br />
              P / ESC = PAUSE &nbsp;·&nbsp; M = MUTE
            </div>
          )}
        </div>

        {/* Right: JUMP */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
          <ActBtn label={'A\nJUMP'} k="jump" bg="#c0392b" size={isMobile ? 100 : 86} />
          <BtnLabel text="JUMP" />
        </div>
      </div>
    </div>
  );

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
        <ControlBar />
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
      <ControlBar />
    </div>
  );
}
