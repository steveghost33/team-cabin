import TCLogo from './TCLogo';
import { C, SOCIAL_LINKS } from '../data/constants';

export default function Footer() {
  return (
    <>
      <style>{`
        .footer {
          background: var(--black);
          border-top: 1px solid rgba(255,255,255,0.06);
          padding: 3rem 0;
        }
        .footer-inner {
          max-width: 1200px; margin: 0 auto;
          padding: 0 clamp(1rem,4vw,3rem);
          display: flex; flex-direction: column; align-items: center;
          gap: 2rem; text-align: center;
        }
        .footer-social {
          display: flex; flex-wrap: wrap; gap: 0.25rem;
          justify-content: center;
        }
        .footer-link {
          font-family: var(--font-display); font-weight: 700;
          font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.12em;
          color: var(--cream-dim); text-decoration: none;
          padding: 0.4rem 0.8rem; border-radius: 2px;
          transition: color 0.15s, background 0.15s;
        }
        .footer-link:hover { color: var(--gold); background: rgba(226,168,32,0.06); }
        .footer-copy {
          font-family: var(--font-body); font-size: 0.78rem;
          color: rgba(200,192,160,0.35);
        }
        .footer-tagline {
          font-family: var(--font-body); font-size: 0.8rem;
          color: rgba(200,192,160,0.3); font-style: italic;
        }
      `}</style>

      <footer className="footer">
        <div className="footer-inner">
          <TCLogo size={64} />
          <div className="footer-social">
            {SOCIAL_LINKS.map(l => (
              <a key={l.label} href={l.url} className="footer-link">{l.label}</a>
            ))}
          </div>
          <p className="footer-copy">© 2026 Team Cabin · Detroit, MI · All rights reserved</p>
          <p className="footer-tagline">No pizza was harmed in the making of this website.</p>
        </div>
      </footer>
    </>
  );
}
