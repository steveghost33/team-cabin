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

  const [gameState, setGameState] = useState({ state: 'title', score: 0, lives: 3, pizza: 0, hp: 100, level: 1 });
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMobile, setIsMobile]   = useState(false);

  // detect mobile
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 768 || 'ontouchstart' in window);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // fullscreen change listener
  useEffect(() => {
    const handler = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handler);
    return () => document.removeEventListener('fullscreenchange', handler);
  }, []);

  // main game loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    // init engine
    const engine = new GameEngine((state) => setGameState(s => ({ ...s, ...state })));
    engineRef.current = engine;

    // audio
    const music = new Audio('/kylesong.mp3');
    music.loop = true;
    music.volume = 0.5;

    const origStart = engine.startGame.bind(engine);
    engine.startGame = () => {
      origStart();
      music.currentTime = 0;
      music.play().catch(() => {});
    };
    const origRespawn = engine.respawn.bind(engine);
    engine.respawn = () => {
      origRespawn();
      music.play().catch(() => {});
    };

    // keyboard
    const onDown = (e) => {
      if (['Space','ArrowLeft','ArrowRight','ArrowUp'].includes(e.code)) e.preventDefault();
      engine.handleKey(e.code, true);
    };
    const onUp = (e) => engine.handleKey(e.code, false);
    window.addEventListener('keydown', onDown);
    window.addEventListener('keyup', onUp);

    // loop
    function loop() {
      engine.tick();
      frameRef.current++;
      renderFrame(ctx, engine, frameRef.current);
      rafRef.current = requestAnimationFrame(loop);
    }
    loop();

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('keydown', onDown);
      window.removeEventListener('keyup', onUp);
      music.pause();
    };
  }, []);

  // ── FULLSCREEN ──────────────────────────────
  const enterFullscreen = useCallback(async () => {
    try {
      // Try real browser fullscreen first (works on desktop + Android)
      const el = document.documentElement;
      if (el.requestFullscreen) await el.requestFullscreen();
      else if (el.webkitRequestFullscreen) await el.webkitRequestFullscreen();
      setIsFullscreen(true);
    } catch {
      // iOS Safari doesn't support requestFullscreen — fall back to CSS fullscreen
      setIsFullscreen(true);
    }
  }, []);

  const exitFullscreen = useCallback(async () => {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
    } catch {}
    setIsFullscreen(false);
  }, []);

  // ── MOBILE BUTTON HANDLER ───────────────────
  const mb = useCallback((key, down) => {
    const engine = engineRef.current;
    if (!engine) return;
    const st = engine.gState;

    if (key === 'jump') {
      if (down && st === 'playing') engine.jump();
    } else if (key === 'start') {
      if (st === 'title')      { engine.gState = 'charselect'; engine.sync(); }
      else if (st === 'charselect') { engine.charIdx = engine.selChar; engine.startGame(); }
      else if (st === 'gameover')   engine.startGame();
      else if (st === 'win')        { engine.gState = 'charselect'; engine.sync(); }
    } else if (key === 'left' && down) {
      if (st === 'charselect') { engine.selChar = (engine.selChar + 2) % 3; engine.sync(); }
      else engine.keys['ArrowLeft'] = true;
    } else if (key === 'right' && down) {
      if (st === 'charselect') { engine.selChar = (engine.selChar + 1) % 3; engine.sync(); }
      else engine.keys['ArrowRight'] = true;
    } else if (key === 'left' && !down) {
      engine.keys['ArrowLeft'] = false;
    } else if (key === 'right' && !down) {
      engine.keys['ArrowRight'] = false;
    }
  }, []);

  // ── BUTTON COMPONENTS ──────────────────────
  // Hold button (directional — fires on press, releases on lift)
  const HoldBtn = ({ label, k, style }) => (
    <button
      style={{
        fontFamily: '"Press Start 2P"',
        fontSize: isMobile ? '1.2rem' : '1rem',
        background: GLD,
        color: GRN,
        border: 'none',
        borderRadius: 10,
        cursor: 'pointer',
        boxShadow: `0 6px 0 rgba(0,0,0,0.5)`,
        userSelect: 'none',
        WebkitUserSelect: 'none',
        WebkitTouchCallout: 'none',
        touchAction: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        width: isMobile ? 90 : 80,
        height: isMobile ? 90 : 76,
        ...style,
      }}
      onTouchStart={e => { e.preventDefault(); mb(k, true); }}
      onTouchEnd={e => { e.preventDefault(); mb(k, false); }}
      onTouchCancel={e => { e.preventDefault(); mb(k, false); }}
      onContextMenu={e => e.preventDefault()}
      onMouseDown={() => mb(k, true)}
      onMouseUp={() => mb(k, false)}
      onMouseLeave={() => mb(k, false)}
    >
      {label}
    </button>
  );

  // Tap button (action — fires once on press)
  const TapBtn = ({ label, k, bg, size, style }) => (
    <button
      style={{
        fontFamily: '"Press Start 2P"',
        fontSize: isMobile ? '0.85rem' : '0.75rem',
        background: bg || '#e74c3c',
        color: '#fff',
        border: 'none',
        borderRadius: '50%',
        cursor: 'pointer',
        boxShadow: `0 6px 0 rgba(0,0,0,0.5)`,
        userSelect: 'none',
        WebkitUserSelect: 'none',
        WebkitTouchCallout: 'none',
        touchAction: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        whiteSpace: 'pre-line',
        textAlign: 'center',
        lineHeight: 1.3,
        width: size || (isMobile ? 100 : 88),
        height: size || (isMobile ? 100 : 88),
        ...style,
      }}
      onTouchStart={e => { e.preventDefault(); mb(k, true); }}
      onTouchEnd={e => e.preventDefault()}
      onContextMenu={e => e.preventDefault()}
      onMouseDown={() => mb(k, true)}
    >
      {label}
    </button>
  );

  // ── CONTROL BAR ─────────────────────────────
  const ControlBar = () => (
    <div style={{
      background: GRN,
      borderTop: `3px solid ${GLD}`,
      padding: isMobile ? '14px 16px' : '10px 16px',
      paddingBottom: 'max(14px, env(safe-area-inset-bottom, 14px))',
      display: 'flex',
      flexDirection: 'column',
      gap: 10,
    }}>
      {/* fullscreen toggle row */}
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <button
          style={{
            fontFamily: '"Press Start 2P"',
            fontSize: '0.55rem',
            background: isFullscreen ? '#c0392b' : GRN2,
            color: CREAM,
            border: `2px solid ${GLD}`,
            borderRadius: 6,
            padding: '7px 18px',
            cursor: 'pointer',
            boxShadow: '2px 2px 0 #000',
            userSelect: 'none',
            WebkitUserSelect: 'none',
            touchAction: 'none',
          }}
          onMouseDown={isFullscreen ? exitFullscreen : enterFullscreen}
          onTouchStart={e => { e.preventDefault(); isFullscreen ? exitFullscreen() : enterFullscreen(); }}
        >
          {isFullscreen ? '✕  EXIT FULLSCREEN' : '⛶  FULLSCREEN'}
        </button>
      </div>

      {/* NES layout: ◀  ▶  |  START  |  A(JUMP) */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 12,
      }}>
        {/* D-pad: left + right only */}
        <div style={{ display: 'flex', gap: 10 }}>
          <HoldBtn label="◀" k="left" />
          <HoldBtn label="▶" k="right" />
        </div>

        {/* center: START pill + hint */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
          <button
            style={{
              fontFamily: '"Press Start 2P"',
              fontSize: '0.55rem',
              background: '#2a2a2a',
              color: '#ddd',
              border: '2px solid #555',
              borderRadius: 20,
              padding: '8px 18px',
              cursor: 'pointer',
              boxShadow: '0 4px 0 rgba(0,0,0,0.5)',
              userSelect: 'none',
              WebkitUserSelect: 'none',
              touchAction: 'none',
            }}
            onTouchStart={e => { e.preventDefault(); mb('start', true); }}
            onTouchEnd={e => e.preventDefault()}
            onContextMenu={e => e.preventDefault()}
            onMouseDown={() => mb('start', true)}
          >
            START
          </button>
          {!isMobile && (
            <div style={{
              fontFamily: '"Press Start 2P"',
              fontSize: '0.28rem',
              color: 'rgba(226,168,32,0.35)',
              textAlign: 'center',
              lineHeight: 2.2,
            }}>
              ← → MOVE{'\n'}SPACE JUMP
            </div>
          )}
        </div>

        {/* A = JUMP — big round red button */}
        <TapBtn label={'A\nJUMP'} k="jump" bg="#e74c3c"
          size={isMobile ? 108 : 94} />
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <span style={{
          fontFamily: '"Press Start 2P"', fontSize: '0.28rem',
          color: 'rgba(226,168,32,0.32)',
        }}>
          A = JUMP
        </span>
      </div>
    </div>
  );

  // ── FULLSCREEN LAYOUT ───────────────────────
  if (isFullscreen) {
    return (
      <div style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: '#000',
        display: 'flex', flexDirection: 'column',
      }}>
        <div style={{
          flex: 1,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          overflow: 'hidden', background: '#000',
        }}>
          <canvas
            ref={canvasRef}
            width={780}
            height={520}
            style={{
              maxWidth: '100%',
              maxHeight: '100%',
              imageRendering: 'pixelated',
              display: 'block',
              objectFit: 'contain',
            }}
          />
        </div>
        <ControlBar />
      </div>
    );
  }

  // ── NORMAL LAYOUT ───────────────────────────
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'stretch', gap: '0.5rem' }}>
      <div style={{
        border: `4px solid ${GLD}`,
        boxShadow: `4px 4px 0 #000`,
        background: '#000',
        width: '100%',
        maxWidth: 780,
        alignSelf: 'center',
      }}>
        <canvas
          ref={canvasRef}
          width={780}
          height={520}
          style={{ width: '100%', display: 'block', imageRendering: 'pixelated' }}
        />
      </div>
      <ControlBar />
      <p style={{
        fontFamily: '"Press Start 2P"',
        fontSize: '0.3rem',
        color: 'rgba(226,168,32,0.25)',
        textAlign: 'center',
      }}>
        ← → MOVE &nbsp;|&nbsp; SPACE / A = JUMP &nbsp;|&nbsp; ENTER = START
      </p>
    </div>
  );
}
