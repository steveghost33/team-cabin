import { useEffect, useRef } from 'react';
import { drawHeroArt } from './game/pixelArt.js';

// Canvas-rendered hero using the game's pixel art — stays in sync with in-game appearance.
// The grid is 32×48 px at size=2; CSS scales it to the requested display height.
export function GameChar({ charIdx = 0, size = 96, animate = true, delay = '0s' }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, 32, 48);
    drawHeroArt(ctx, charIdx, 0, 0);
  }, [charIdx]);

  const displayH = size;
  const displayW = Math.round(size * (32 / 48));

  return (
    <canvas
      ref={canvasRef}
      width={32}
      height={48}
      style={{
        imageRendering: 'pixelated',
        display: 'block',
        width: displayW,
        height: displayH,
        animation: animate ? `bob 1.3s ease-in-out ${delay} infinite` : 'none',
      }}
    />
  );
}
