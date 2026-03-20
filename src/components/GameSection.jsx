import PizzaGame from './PizzaGame';
import { C } from '../data/constants';

export default function GameSection() {
  return (
    <>
      <style>{`
        .game-section {
          background: var(--black);
          padding: clamp(4rem,8vw,8rem) 0;
          border-top: 1px solid rgba(226,168,32,0.2);
        }
        .game-inner {
          max-width: 1200px; margin: 0 auto;
          padding: 0 clamp(1rem,4vw,3rem);
        }
        .game-intro {
          display: grid; grid-template-columns: 1fr 1fr;
          gap: 3rem; align-items: end;
          margin-bottom: 2.5rem;
        }
        .game-desc {
          font-family: var(--font-body);
          font-size: 0.95rem; line-height: 1.7;
          color: var(--cream-dim);
        }
        .game-desc strong { color: var(--gold); font-weight: 600; }
        .game-controls {
          display: flex; flex-wrap: wrap; gap: 0.5rem;
          justify-content: flex-end; align-items: center;
        }
        .ctrl-tag {
          font-family: var(--font-display); font-weight: 700;
          text-transform: uppercase; letter-spacing: 0.1em;
          font-size: 0.7rem;
          background: rgba(226,168,32,0.1);
          color: var(--gold);
          border: 1px solid rgba(226,168,32,0.25);
          padding: 0.3rem 0.7rem; border-radius: 2px;
        }
        @media (max-width: 640px) {
          .game-intro { grid-template-columns: 1fr; gap: 1.5rem; }
          .game-controls { justify-content: flex-start; }
        }
      `}</style>

      <section id="game" className="game-section">
        <div className="game-inner">
          <div className="section-header">
            <h2 className="section-title">🍕 <span className="accent">Pizza</span> Quest</h2>
            <div className="section-rule" />
          </div>
          <div className="game-intro">
            <p className="game-desc">
              Guide the guys through <strong>Ypsilanti</strong>, <strong>Detroit</strong>, and <strong>Ferndale</strong> — collecting pizza slices, stomping enemies, and taking down the boss at each level. 3 lives, health pickups, and a boss fight at 16 slices.
            </p>
            <div className="game-controls">
              <span className="ctrl-tag">← → Move</span>
              <span className="ctrl-tag">A / Space = Jump</span>
              <span className="ctrl-tag">Stomp enemies</span>
              <span className="ctrl-tag">❤ Grab hearts</span>
              <span className="ctrl-tag">3 lives</span>
            </div>
          </div>
          <PizzaGame />
        </div>
      </section>
    </>
  );
}
