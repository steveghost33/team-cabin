import { C, MUSIC_LINKS } from '../data/constants';

export default function Music() {
  return (
    <>
      <style>{`
        .music {
          background: var(--off-black);
          padding: clamp(4rem,8vw,8rem) 0;
        }
        .music-inner {
          max-width: 1200px; margin: 0 auto;
          padding: 0 clamp(1rem,4vw,3rem);
        }
        .section-header {
          display: flex; align-items: baseline; gap: 1.5rem;
          margin-bottom: clamp(2rem,4vw,3.5rem);
        }
        .section-title {
          font-family: var(--font-display);
          font-weight: 900; font-style: italic;
          font-size: clamp(2.5rem,6vw,5rem);
          text-transform: uppercase; line-height: 1;
          color: var(--cream);
        }
        .section-title .accent { color: var(--gold); }
        .section-rule {
          flex: 1; height: 2px;
          background: linear-gradient(90deg, rgba(226,168,32,0.5) 0%, transparent 100%);
        }
        .music-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 1px;
          border: 1px solid rgba(255,255,255,0.06);
          background: rgba(255,255,255,0.06);
        }
        .music-link {
          display: flex; align-items: center; gap: 1rem;
          padding: 1.25rem 1.5rem;
          background: var(--off-black);
          text-decoration: none;
          transition: background 0.15s, transform 0.1s;
          position: relative; overflow: hidden;
        }
        .music-link::before {
          content: ''; position: absolute; left: 0; top: 0; bottom: 0;
          width: 3px; background: var(--link-color);
          transform: scaleY(0); transform-origin: bottom;
          transition: transform 0.2s;
        }
        .music-link:hover { background: rgba(255,255,255,0.04); }
        .music-link:hover::before { transform: scaleY(1); }
        .music-icon {
          font-size: 1.5rem; flex-shrink: 0;
          filter: drop-shadow(0 0 6px var(--link-color));
        }
        .music-name {
          font-family: var(--font-display);
          font-weight: 700; text-transform: uppercase;
          letter-spacing: 0.08em; font-size: 0.82rem;
          color: var(--link-color);
        }
        .music-action {
          font-family: var(--font-body);
          font-size: 0.8rem; color: var(--cream-dim);
          margin-top: 2px;
        }
      `}</style>

      <section id="music" className="music">
        <div className="music-inner">
          <div className="section-header">
            <h2 className="section-title">Stream <span className="accent">Our</span> Music</h2>
            <div className="section-rule" />
          </div>
          <div className="music-grid">
            {MUSIC_LINKS.map(m => (
              <a key={m.name} href={m.url} target="_blank" rel="noopener noreferrer"
                className="music-link"
                style={{ '--link-color': m.color }}>
                <span className="music-icon">{m.icon}</span>
                <div>
                  <div className="music-name">{m.name}</div>
                  <div className="music-action">Listen now →</div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
