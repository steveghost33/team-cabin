import { useState, useEffect } from 'react';
import TCLogo from './TCLogo';
import { C } from '../data/constants';

const links = [
  { id: 'music', l: 'Music' },
  { id: 'shows', l: 'Shows' },
  { id: 'band',  l: 'Band' },
  { id: 'game',  l: '🍕 Game' },
];

export default function Nav({ scrollTo }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  return (
    <>
      <style>{`
        .nav {
          position: fixed; top: 0; left: 0; right: 0; z-index: 900;
          transition: background 0.3s, box-shadow 0.3s;
          padding: 0 clamp(1rem, 4vw, 3rem);
        }
        .nav.scrolled {
          background: rgba(8,15,6,0.97);
          backdrop-filter: blur(12px);
          box-shadow: 0 1px 0 rgba(226,168,32,0.25);
        }
        .nav-inner {
          max-width: 1200px; margin: 0 auto;
          display: flex; align-items: center; justify-content: space-between;
          height: 68px;
        }
        .nav-logo { cursor: pointer; transition: opacity 0.2s; }
        .nav-logo:hover { opacity: 0.8; }
        .nav-links {
          display: flex; gap: 0.25rem; align-items: center;
        }
        .nav-btn {
          background: none; border: none; color: var(--cream-dim);
          font-family: var(--font-display); font-weight: 700;
          text-transform: uppercase; letter-spacing: 0.1em;
          font-size: 0.85rem; padding: 0.5rem 0.9rem;
          transition: color 0.15s; border-radius: 3px;
        }
        .nav-btn:hover { color: var(--gold); }
        .nav-cta {
          background: var(--gold); color: var(--green);
          font-family: var(--font-display); font-weight: 800;
          text-transform: uppercase; letter-spacing: 0.1em;
          font-size: 0.8rem; border: none; padding: 0.5rem 1.1rem;
          border-radius: 3px; transition: background 0.15s, transform 0.1s;
        }
        .nav-cta:hover { background: var(--gold-light); transform: translateY(-1px); }
        .nav-burger {
          display: none; background: none; border: none;
          color: var(--cream); font-size: 1.4rem; padding: 0.4rem;
        }
        @media (max-width: 640px) {
          .nav-links { display: none; }
          .nav-burger { display: block; }
        }
        .mobile-menu {
          position: fixed; top: 68px; left: 0; right: 0; z-index: 899;
          background: rgba(8,15,6,0.98); backdrop-filter: blur(12px);
          border-bottom: 1px solid rgba(226,168,32,0.2);
          display: flex; flex-direction: column; padding: 1rem;
          gap: 0.25rem;
        }
        .mobile-btn {
          background: none; border: none; color: var(--cream);
          font-family: var(--font-display); font-weight: 700;
          text-transform: uppercase; letter-spacing: 0.1em;
          font-size: 1.1rem; padding: 0.7rem 1rem; text-align: left;
          border-radius: 3px; transition: background 0.15s;
        }
        .mobile-btn:hover { background: rgba(226,168,32,0.08); color: var(--gold); }
      `}</style>

      <nav className={`nav${scrolled ? ' scrolled' : ''}`}>
        <div className="nav-inner">
          <div className="nav-logo" onClick={() => scrollTo('home')}>
            <TCLogo size={42} />
          </div>
          <div className="nav-links">
            {links.map(n => (
              <button key={n.id} className="nav-btn" onClick={() => scrollTo(n.id)}>{n.l}</button>
            ))}
          </div>
          <button className="nav-burger" onClick={() => setOpen(o => !o)} aria-label="Menu">
            {open ? '✕' : '☰'}
          </button>
        </div>
      </nav>

      {open && (
        <div className="mobile-menu">
          {links.map(n => (
            <button key={n.id} className="mobile-btn" onClick={() => { scrollTo(n.id); setOpen(false); }}>{n.l}</button>
          ))}
        </div>
      )}
    </>
  );
}
