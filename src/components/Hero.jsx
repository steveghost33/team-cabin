// ─────────────────────────────────────
//  Hero.jsx
//  Full-screen hero section with the
//  TC logo, band name, and pixel characters.
// ─────────────────────────────────────
import TCLogo from './TCLogo';
import { CharLeft, CharMid, CharRight } from './Characters';
import { C, MEMBERS } from '../data/constants';

const CHARS = [CharLeft, CharMid, CharRight];

export default function Hero() {
  return (
    <section
      id="home"
      style={{
        minHeight: '90vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '4rem 2rem',
        position: 'relative',
        overflow: 'hidden',
        background: 'linear-gradient(180deg,#060f04 0%,#0d1f09 55%,#1e3314 100%)',
      }}
    >
      {/* Grid background */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `
            repeating-linear-gradient(0deg,transparent,transparent 39px,rgba(45,74,30,0.25) 40px),
            repeating-linear-gradient(90deg,transparent,transparent 39px,rgba(45,74,30,0.25) 40px)
          `,
          backgroundSize: '40px 40px',
          pointerEvents: 'none',
        }}
      />

      {/* TC Logo */}
      <div
        style={{
          animation: 'float 4s ease-in-out infinite',
          marginBottom: '2rem',
          filter: `drop-shadow(0 0 28px ${C.gold})`,
        }}
      >
        <TCLogo size={200} />
      </div>

      {/* Band name */}
      <h1
        style={{
          fontFamily: '"Press Start 2P"',
          fontSize: 'clamp(1.4rem, 5vw, 3.2rem)',
          color: C.gold,
          animation: 'glow 2.5s ease-in-out infinite',
          letterSpacing: '0.08em',
          textAlign: 'center',
          marginBottom: '0.8rem',
        }}
      >
        TEAM CABIN
      </h1>

      <p
        style={{
          fontFamily: '"VT323"',
          fontSize: 'clamp(1.2rem, 3vw, 2rem)',
          color: C.goldL,
          letterSpacing: '0.1em',
          marginBottom: '3rem',
          textAlign: 'center',
        }}
      >
        Detroit's finest three-piece 🍕
      </p>

      {/* Pixel characters */}
      <div
        style={{
          display: 'flex',
          gap: 'clamp(2rem, 6vw, 5rem)',
          justifyContent: 'center',
          alignItems: 'flex-end',
          marginBottom: '2.5rem',
        }}
      >
        {MEMBERS.map((m, i) => {
          const Char = CHARS[m.charId];
          return (
            <div
              key={i}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.6rem' }}
            >
              <Char size={80} animate delay={`${i * 0.25}s`} />
              <span
                style={{
                  fontFamily: '"VT323"',
                  fontSize: '0.95rem',
                  color: C.goldL,
                  letterSpacing: '0.1em',
                  textAlign: 'center',
                }}
              >
                {m.name}
              </span>
            </div>
          );
        })}
      </div>

      {/* Scroll hint */}
      <div
        style={{
          fontFamily: '"Press Start 2P"',
          fontSize: '0.5rem',
          color: C.gold,
          animation: 'blink 1s step-end infinite',
          letterSpacing: '0.1em',
        }}
      >
        ▼ SCROLL DOWN ▼
      </div>
    </section>
  );
}
