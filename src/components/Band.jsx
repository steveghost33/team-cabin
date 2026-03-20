import { CharLeft, CharMid, CharRight } from './Characters';
import { C, MEMBERS } from '../data/constants';

const CHARS = [CharLeft, CharMid, CharRight];

export default function Band() {
  return (
    <>
      <style>{`
        .band {
          background: var(--off-black);
          padding: clamp(4rem,8vw,8rem) 0;
        }
        .band-inner {
          max-width: 1200px; margin: 0 auto;
          padding: 0 clamp(1rem,4vw,3rem);
        }
        .band-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 2px;
          margin-top: clamp(2rem,4vw,3.5rem);
        }
        .band-card {
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.06);
          display: flex; flex-direction: column;
          transition: border-color 0.2s, background 0.2s;
          overflow: hidden;
        }
        .band-card:hover {
          border-color: rgba(226,168,32,0.4);
          background: rgba(255,255,255,0.04);
        }
        .band-portrait {
          background: var(--green);
          display: flex; justify-content: center; align-items: flex-end;
          padding: 3rem 2rem 0;
          min-height: 180px;
          position: relative;
          overflow: hidden;
        }
        .band-portrait::after {
          content: '';
          position: absolute; bottom: 0; left: 0; right: 0; height: 40px;
          background: linear-gradient(transparent, rgba(0,0,0,0.3));
        }
        .band-portrait-num {
          position: absolute; top: 1.5rem; left: 1.5rem;
          font-family: var(--font-display); font-weight: 900; font-size: 5rem;
          color: rgba(226,168,32,0.08); line-height: 1; pointer-events: none;
        }
        .band-info {
          padding: 1.5rem 2rem 2rem;
          display: flex; flex-direction: column; gap: 0.75rem;
          flex: 1;
        }
        .band-name {
          font-family: var(--font-display); font-weight: 900;
          font-size: 1.8rem; text-transform: uppercase;
          color: var(--cream); letter-spacing: 0.02em;
          line-height: 1;
        }
        .band-role {
          font-family: var(--font-display); font-weight: 700;
          font-size: 0.75rem; text-transform: uppercase;
          letter-spacing: 0.16em; color: var(--gold);
        }
        .band-divider {
          height: 1px;
          background: rgba(255,255,255,0.08);
        }
        .band-bio {
          font-family: var(--font-body);
          font-size: 0.92rem; line-height: 1.65;
          color: var(--cream-dim);
        }
        .band-pizza {
          display: flex; align-items: center; gap: 0.5rem;
          font-family: var(--font-body); font-size: 0.8rem;
          color: rgba(200,200,180,0.5); margin-top: auto; padding-top: 0.5rem;
          border-top: 1px solid rgba(255,255,255,0.04);
        }
        .band-pizza-label {
          font-family: var(--font-display); font-weight: 700;
          text-transform: uppercase; letter-spacing: 0.1em;
          font-size: 0.65rem; color: var(--gold-dark);
        }
      `}</style>

      <section id="band" className="band">
        <div className="band-inner">
          <div className="section-header">
            <h2 className="section-title">The <span className="accent">Band</span></h2>
            <div className="section-rule" />
          </div>
          <div className="band-grid">
            {MEMBERS.map((m, i) => {
              const Char = CHARS[m.charId];
              return (
                <div key={i} className="band-card">
                  <div className="band-portrait">
                    <span className="band-portrait-num">0{i+1}</span>
                    <Char size={110} animate delay={`${i * 0.3}s`} />
                  </div>
                  <div className="band-info">
                    <div>
                      <div className="band-role">{m.role}</div>
                      <div className="band-name">{m.name}</div>
                    </div>
                    <div className="band-divider" />
                    <p className="band-bio">{m.bio}</p>
                    <div className="band-pizza">
                      <span className="band-pizza-label">🍕 Pizza order:</span>
                      <span>{m.pizza}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
