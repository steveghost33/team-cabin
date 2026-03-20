import TCLogo from './TCLogo';
import { CharLeft, CharMid, CharRight } from './Characters';
import { C, MEMBERS } from '../data/constants';

const CHARS = [CharLeft, CharMid, CharRight];

export default function Hero() {
  return (
    <>
      <style>{`
        .hero {
          min-height: 100vh;
          background: var(--black);
          display: flex; flex-direction: column;
          position: relative; overflow: hidden;
          padding-top: 68px;
        }
        .hero-bg {
          position: absolute; inset: 0;
          background:
            radial-gradient(ellipse 80% 60% at 60% 40%, rgba(226,168,32,0.07) 0%, transparent 70%),
            radial-gradient(ellipse 50% 40% at 20% 80%, rgba(28,61,18,0.6) 0%, transparent 60%);
        }
        .hero-noise {
          position: absolute; inset: 0; opacity: 0.03;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
          background-size: 256px;
        }
        .hero-content {
          position: relative; z-index: 1;
          flex: 1; display: flex; flex-direction: column;
          justify-content: center;
          padding: clamp(3rem,8vw,6rem) clamp(1rem,4vw,3rem) 0;
          max-width: 1200px; margin: 0 auto; width: 100%;
        }
        .hero-eyebrow {
          font-family: var(--font-display);
          font-weight: 700; font-size: 0.8rem;
          text-transform: uppercase; letter-spacing: 0.2em;
          color: var(--gold); margin-bottom: 1.5rem;
          display: flex; align-items: center; gap: 0.75rem;
          animation: slide-right 0.6s ease both;
        }
        .hero-eyebrow::before {
          content: ''; display: block; width: 32px; height: 2px;
          background: var(--gold);
        }
        .hero-headline {
          font-family: var(--font-display);
          font-weight: 900; font-style: italic;
          font-size: clamp(5rem, 14vw, 14rem);
          line-height: 0.88; color: var(--cream);
          text-transform: uppercase; letter-spacing: -0.02em;
          animation: float-up 0.7s 0.1s ease both;
        }
        .hero-headline span { color: var(--gold); }
        .hero-sub {
          font-family: var(--font-body);
          font-size: clamp(1rem, 2vw, 1.25rem);
          color: var(--cream-dim); margin-top: 1.5rem;
          max-width: 480px; line-height: 1.5;
          animation: float-up 0.7s 0.2s ease both;
        }
        .hero-chars {
          position: relative; z-index: 1;
          display: flex; align-items: flex-end; justify-content: center;
          gap: clamp(2rem, 5vw, 5rem);
          padding: 3rem clamp(1rem,4vw,3rem) 0;
          max-width: 1200px; margin: 0 auto; width: 100%;
          animation: float-up 0.8s 0.3s ease both;
        }
        .hero-char-wrap {
          display: flex; flex-direction: column; align-items: center; gap: 0.75rem;
        }
        .hero-char-box {
          background: rgba(28,61,18,0.5);
          border: 2px solid rgba(226,168,32,0.35);
          padding: clamp(8px,2vw,16px);
          transition: border-color 0.2s, transform 0.2s;
        }
        .hero-char-box:hover {
          border-color: var(--gold);
          transform: translateY(-4px);
        }
        .hero-char-name {
          font-family: var(--font-display);
          font-weight: 800; font-size: clamp(0.85rem, 1.5vw, 1.1rem);
          text-transform: uppercase; letter-spacing: 0.12em;
          color: var(--gold);
        }
        .hero-char-role {
          font-family: var(--font-body);
          font-size: 0.8rem; color: var(--cream-dim);
          letter-spacing: 0.05em;
        }
        .hero-scroll {
          position: relative; z-index: 1;
          text-align: center; padding: 2rem;
          font-family: var(--font-display);
          font-size: 0.7rem; letter-spacing: 0.18em;
          color: rgba(226,168,32,0.5);
          text-transform: uppercase;
          animation: blink 2s step-end infinite;
        }
        .hero-logo-bg {
          position: absolute; right: -5%; bottom: 10%; z-index: 0;
          opacity: 0.04; pointer-events: none;
          width: clamp(200px, 40vw, 500px);
        }
        @media (max-width: 640px) {
          .hero-headline { font-size: clamp(4rem, 18vw, 7rem); }
          .hero-char-box svg { width: 64px !important; height: 64px !important; }
        }
      `}</style>

      <section id="home" className="hero">
        <div className="hero-bg" />
        <div className="hero-noise" />
        <div className="hero-logo-bg"><TCLogo size={500} /></div>

        <div className="hero-content">
          <p className="hero-eyebrow">Detroit, Michigan</p>
          <h1 className="hero-headline">
            Team<br/><span>Cabin</span>
          </h1>
          <p className="hero-sub">
            Three-piece rock band. Bass, drums, guitar. Playing Detroit, Ypsilanti, and everywhere in between.
          </p>
        </div>

        <div className="hero-chars">
          {MEMBERS.map((m, i) => {
            const Char = CHARS[m.charId];
            return (
              <div key={i} className="hero-char-wrap">
                <div className="hero-char-box">
                  <Char size={90} animate delay={`${i * 0.2}s`} />
                </div>
                <span className="hero-char-name">{m.name}</span>
                <span className="hero-char-role">{m.role}</span>
              </div>
            );
          })}
        </div>

        <p className="hero-scroll">↓ Scroll</p>
      </section>
    </>
  );
}
