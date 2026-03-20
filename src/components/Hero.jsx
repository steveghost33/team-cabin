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
      background: 'linear-gradient(180deg,#1C3D12 0%,#2D4A1E 60%,#3D5A2A 100%)',
    }}>
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: `
          repeating-linear-gradient(0deg,transparent,transparent 15px,rgba(28,61,18,0.4) 15px,rgba(28,61,18,0.4) 16px),
          repeating-linear-gradient(90deg,transparent,transparent 15px,rgba(28,61,18,0.4) 15px,rgba(28,61,18,0.4) 16px)
        `,
        backgroundSize: '16px 16px',
        pointerEvents: 'none',
      }} />

      <div style={{ animation: 'float 4s ease-in-out infinite', marginBottom: '2rem' }}>
        <TCLogo size={160} />
      </div>

      <h1 style={{
        fontFamily: '"Press Start 2P"',
        fontSize: 'clamp(1.2rem, 4vw, 2.8rem)',
        color: '#E2A820',
        animation: 'glow 2.5s ease-in-out infinite',
        letterSpacing: '0.1em', textAlign: 'center', marginBottom: '0.6rem',
        textShadow: '4px 4px 0 #1C3D12',
      }}>TEAM CABIN</h1>

      <p style={{
        fontFamily: '"Press Start 2P"', fontSize: 'clamp(0.38rem, 1.1vw, 0.6rem)',
        color: '#c8b830', letterSpacing: '0.1em', marginBottom: '3rem', textAlign: 'center',
        textShadow: '2px 2px 0 #1C3D12',
      }}>DETROIT'S FINEST THREE-PIECE 🍕</p>

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
              <div style={{
                border: `3px solid #E2A820`,
                boxShadow: `4px 4px 0 #000`,
                background: '#1C3D12',
                padding: 6,
                position: 'relative',
              }}>
                <div style={{ position:'absolute', top:-2, left:-2, width:6, height:6, background:'#E2A820' }} />
                <div style={{ position:'absolute', top:-2, right:-2, width:6, height:6, background:'#E2A820' }} />
                <div style={{ position:'absolute', bottom:-2, left:-2, width:6, height:6, background:'#E2A820' }} />
                <div style={{ position:'absolute', bottom:-2, right:-2, width:6, height:6, background:'#E2A820' }} />
                <Char size={80} animate delay={`${i * 0.25}s`} />
              </div>
              <div style={{
                background: '#E2A820', color: '#1C3D12',
                fontFamily: '"Press Start 2P"', fontSize: '0.5rem',
                padding: '3px 8px',
                boxShadow: '2px 2px 0 #000',
              }}>{m.name}</div>
            </div>
          );
        })}
      </div>

      <div style={{
        fontFamily: '"Press Start 2P"', fontSize: '0.45rem',
        color: '#E2A820', animation: 'blink 1s step-end infinite',
        letterSpacing: '0.1em', textShadow: '2px 2px 0 #000',
      }}>▼ SCROLL DOWN ▼</div>
    </section>
  );
}