import TCLogo from './TCLogo';
import { CharLeft, CharMid, CharRight } from './Characters';
import { C, MEMBERS } from '../data/constants';

const CHARS = [CharLeft, CharMid, CharRight];

export default function Hero() {
  return (
    <section id="home" style={{
      minHeight: '90vh',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      padding: '4rem 2rem',
      background: C.green,
    }}>
      {/* TC Logo */}
      <div style={{ animation: 'float 4s ease-in-out infinite', marginBottom: '2rem', filter: `drop-shadow(0 0 20px ${C.gold})` }}>
        <TCLogo size={160} />
      </div>

      {/* Band name */}
      <h1 style={{
        fontFamily: '"Press Start 2P"',
        fontSize: 'clamp(1.2rem, 4vw, 2.8rem)',
        color: C.gold,
        animation: 'glow 2.5s ease-in-out infinite',
        letterSpacing: '0.1em', textAlign: 'center', marginBottom: '0.6rem',
        textShadow: `4px 4px 0 ${C.green}`,
      }}>TEAM CABIN</h1>

      <p style={{
        fontFamily: '"Press Start 2P"', fontSize: 'clamp(0.38rem, 1.1vw, 0.58rem)',
        color: C.goldL, letterSpacing: '0.08em', marginBottom: '3rem', textAlign: 'center',
      }}>DETROIT'S FINEST THREE-PIECE 🍕</p>

      {/* Characters in pixel portrait boxes */}
      <div style={{
        display: 'flex',
        gap: 'clamp(1.2rem, 4vw, 3.5rem)',
        justifyContent: 'center',
        alignItems: 'flex-end',
        marginBottom: '2.5rem',
      }}>
        {MEMBERS.map((m, i) => {
          const Char = CHARS[m.charId];
          return (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
              {/* Portrait box — gold border, darker green bg */}
              <div style={{
                border: `3px solid ${C.gold}`,
                boxShadow: `4px 4px 0 #000`,
                background: '#152e0e',
                padding: 8,
                position: 'relative',
              }}>
                {/* corner pixel accents */}
                <div style={{ position:'absolute', top:-2, left:-2, width:6, height:6, background:C.gold }} />
                <div style={{ position:'absolute', top:-2, right:-2, width:6, height:6, background:C.gold }} />
                <div style={{ position:'absolute', bottom:-2, left:-2, width:6, height:6, background:C.gold }} />
                <div style={{ position:'absolute', bottom:-2, right:-2, width:6, height:6, background:C.gold }} />
                <Char size={80} animate delay={`${i * 0.25}s`} />
              </div>
              {/* name tag */}
              <div style={{
                background: C.gold, color: C.green,
                fontFamily: '"Press Start 2P"', fontSize: '0.5rem',
                padding: '3px 8px',
                boxShadow: '2px 2px 0 #000',
              }}>{m.name}</div>
              <div style={{
                fontFamily: '"Press Start 2P"', fontSize: '0.3rem',
                color: C.goldL,
              }}>{m.role}</div>
            </div>
          );
        })}
      </div>

      <div style={{
        fontFamily: '"Press Start 2P"', fontSize: '0.45rem',
        color: C.gold, animation: 'blink 1s step-end infinite',
        letterSpacing: '0.08em',
      }}>▼ SCROLL DOWN ▼</div>
    </section>
  );
}
