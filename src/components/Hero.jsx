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
      position: 'relative', overflow: 'hidden',
      background: '#0a0a0a',
    }}>
      {/* pixel grid bg */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: `
          repeating-linear-gradient(0deg,transparent,transparent 15px,rgba(212,160,23,0.06) 15px,rgba(212,160,23,0.06) 16px),
          repeating-linear-gradient(90deg,transparent,transparent 15px,rgba(212,160,23,0.06) 15px,rgba(212,160,23,0.06) 16px)
        `,
        backgroundSize: '16px 16px',
        pointerEvents: 'none',
      }} />
      {/* red side bars — BroForce style */}
      <div style={{ position:'absolute', left:0, top:0, bottom:0, width:6, background:'#c0392b' }} />
      <div style={{ position:'absolute', right:0, top:0, bottom:0, width:6, background:'#c0392b' }} />

      {/* TC Logo */}
      <div style={{ animation: 'float 4s ease-in-out infinite', marginBottom: '2rem' }}>
        <TCLogo size={160} />
      </div>

      {/* Band name */}
      <h1 style={{
        fontFamily: '"Press Start 2P"',
        fontSize: 'clamp(1.2rem, 4vw, 2.8rem)',
        color: C.gold,
        animation: 'glow 2.5s ease-in-out infinite',
        letterSpacing: '0.1em', textAlign: 'center', marginBottom: '0.6rem',
        textShadow: '4px 4px 0 #000',
      }}>TEAM CABIN</h1>

      <p style={{
        fontFamily: '"Press Start 2P"', fontSize: 'clamp(0.4rem, 1.2vw, 0.65rem)',
        color: C.goldL, letterSpacing: '0.1em', marginBottom: '3rem', textAlign: 'center',
        textShadow: '2px 2px 0 #000',
      }}>DETROIT'S FINEST THREE-PIECE 🍕</p>

      {/* Characters in BroForce portrait boxes */}
      <div style={{
        display: 'flex',
        gap: 'clamp(1rem, 4vw, 3rem)',
        justifyContent: 'center',
        alignItems: 'flex-end',
        marginBottom: '2.5rem',
      }}>
        {MEMBERS.map((m, i) => {
          const Char = CHARS[m.charId];
          return (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
              {/* Portrait box */}
              <div style={{
                border: `3px solid ${C.gold}`,
                boxShadow: `4px 4px 0 #000`,
                background: '#111',
                padding: 6,
                position: 'relative',
              }}>
                {/* corner pixels */}
                <div style={{ position:'absolute', top:-1, left:-1, width:5, height:5, background:C.gold }} />
                <div style={{ position:'absolute', top:-1, right:-1, width:5, height:5, background:C.gold }} />
                <div style={{ position:'absolute', bottom:-1, left:-1, width:5, height:5, background:C.gold }} />
                <div style={{ position:'absolute', bottom:-1, right:-1, width:5, height:5, background:C.gold }} />
                <Char size={80} animate delay={`${i * 0.25}s`} />
              </div>
              {/* name tag */}
              <div style={{
                background: C.gold, color: '#0a0a0a',
                fontFamily: '"Press Start 2P"', fontSize: '0.5rem',
                padding: '3px 8px',
                boxShadow: '2px 2px 0 #000',
                letterSpacing: '0.05em',
              }}>{m.name}</div>
            </div>
          );
        })}
      </div>

      <div style={{
        fontFamily: '"Press Start 2P"', fontSize: '0.45rem',
        color: '#e74c3c', animation: 'blink 1s step-end infinite',
        letterSpacing: '0.1em',
        textShadow: '2px 2px 0 #000',
      }}>▼ SCROLL DOWN ▼</div>
    </section>
  );
}