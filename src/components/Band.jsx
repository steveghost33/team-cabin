import SectionTitle from './SectionTitle';
import { CharLeft, CharMid, CharRight } from './Characters';
import { C, MEMBERS } from '../data/constants';

const CHARS = [CharLeft, CharMid, CharRight];

export default function Band() {
  return (
    <section id="band" style={{ padding: '5rem 2rem', maxWidth: 1100, margin: '0 auto' }}>
      <SectionTitle>THE BAND</SectionTitle>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(270px, 1fr))',
        gap: '1.5rem',
      }}>
        {MEMBERS.map((m, i) => {
          const Char = CHARS[m.charId];
          return (
            <div key={i} style={{
              border: `3px solid rgba(212,160,23,0.3)`,
              background: '#111',
              boxShadow: '4px 4px 0 #000',
              display: 'flex', flexDirection: 'column', alignItems: 'center',
              overflow: 'hidden',
              transition: 'transform 0.08s, box-shadow 0.08s, border-color 0.08s',
            }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translate(-4px,-4px)';
                e.currentTarget.style.boxShadow = `7px 7px 0 #000`;
                e.currentTarget.style.borderColor = C.gold;
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = '';
                e.currentTarget.style.boxShadow = '4px 4px 0 #000';
                e.currentTarget.style.borderColor = 'rgba(212,160,23,0.3)';
              }}
            >
              {/* Character portrait — full width, dark bg */}
              <div style={{
                background: '#0a0a0a',
                width: '100%',
                display: 'flex', justifyContent: 'center', alignItems: 'center',
                padding: '2rem 1rem',
                borderBottom: `3px solid rgba(212,160,23,0.2)`,
                position: 'relative',
              }}>
                {/* pixel grid bg in portrait */}
                <div style={{
                  position: 'absolute', inset: 0,
                  backgroundImage: `
                    repeating-linear-gradient(0deg,transparent,transparent 7px,rgba(212,160,23,0.04) 7px,rgba(212,160,23,0.04) 8px),
                    repeating-linear-gradient(90deg,transparent,transparent 7px,rgba(212,160,23,0.04) 7px,rgba(212,160,23,0.04) 8px)
                  `,
                  backgroundSize: '8px 8px',
                  pointerEvents: 'none',
                }} />
                <Char size={100} animate delay={`${i * 0.3}s`} />
              </div>

              {/* Info */}
              <div style={{ padding: '1.2rem 1.5rem', width: '100%', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                {/* Name bar */}
                <div style={{
                  background: C.gold, color: '#0a0a0a',
                  fontFamily: '"Press Start 2P"', fontSize: '0.6rem',
                  padding: '5px 8px',
                  boxShadow: '2px 2px 0 #000',
                  textAlign: 'center', letterSpacing: '0.05em',
                }}>{m.name}</div>

                <div style={{
                  fontFamily: '"Press Start 2P"', fontSize: '0.38rem',
                  color: C.goldL, textAlign: 'center', letterSpacing: '0.05em',
                }}>{m.role}</div>

                {/* divider */}
                <div style={{ height: 2, background: `repeating-linear-gradient(90deg,${C.goldD} 0,${C.goldD} 6px,transparent 6px,transparent 12px)` }} />

                <p style={{
                  fontFamily: '"VT323"', fontSize: '1.1rem',
                  color: 'rgba(245,240,220,0.7)', textAlign: 'center', lineHeight: 1.5,
                }}>{m.bio}</p>

                <div style={{
                  fontFamily: '"Press Start 2P"', fontSize: '0.3rem',
                  color: C.greenL, textAlign: 'center',
                  border: `1px solid rgba(74,122,48,0.4)`,
                  padding: '4px 6px',
                  background: 'rgba(74,122,48,0.08)',
                }}>🍕 {m.pizza}</div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}