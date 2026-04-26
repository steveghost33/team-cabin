import { useState } from 'react';
import TCLogo from '../common/TCLogo';
import { CHARS } from '../features/Characters';
import { MEMBERS, SOCIAL_LINKS } from '../../config/constants';
import Music from '../features/Music';
import Shows from '../features/Shows';
import Band from '../features/Band';
import GameSection from '../features/GameSection';
import '../../styles/components/MobileApp.css';

const PAGES = { HUB: 'hub', MUSIC: 'music', SHOWS: 'shows', BAND: 'band', GAME: 'game' };

const NAV_BUTTONS = [
  { id: PAGES.MUSIC, label: 'MUSIC',       icon: '♫' },
  { id: PAGES.SHOWS, label: 'SHOWS',       icon: '★' },
  { id: PAGES.BAND,  label: 'THE BAND',    icon: '◈' },
  { id: PAGES.GAME,  label: '🍕 PIZZA QUEST GAME', icon: null },
];

export default function MobileApp() {
  const [page, setPage] = useState(PAGES.HUB);

  if (page !== PAGES.HUB) {
    return (
      <div className="m-page">
        <header className="m-page-header">
          <button className="m-back-btn" onClick={() => setPage(PAGES.HUB)}>
            BACK
          </button>
        </header>
        <div className="m-page-body">
          {page === PAGES.MUSIC && <Music linksOnly />}
          {page === PAGES.SHOWS && <Shows />}
          {page === PAGES.BAND  && <Band />}
          {page === PAGES.GAME  && <GameSection />}
        </div>
      </div>
    );
  }

  return (
    <div className="m-hub">
      <div className="m-hub-grid" aria-hidden="true" />

      <div className="m-hub-top">
        <div className="m-hub-logo">
          <TCLogo size={80} />
        </div>
        <h1 className="m-hub-title">TEAM CABIN</h1>
        <p className="m-hub-subtitle">Detroit's finest three-piece 🍕</p>
        <div className="m-hub-chars">
          {MEMBERS.map((member, i) => {
            const Char = CHARS[member.charId];
            return (
              <div key={member.name} className="m-hub-char">
                <Char size={56} animate delay={`${i * 0.25}s`} />
                <span className="m-hub-char-name">{member.name}</span>
              </div>
            );
          })}
        </div>
      </div>

      <nav className="m-hub-nav" aria-label="Main navigation">
        {NAV_BUTTONS.map(btn => (
          <button key={btn.id} className="m-hub-nav-btn" onClick={() => setPage(btn.id)}>
            {btn.icon && <span className="m-hub-nav-icon">{btn.icon}</span>}
            <span className="m-hub-nav-label">{btn.label}</span>
          </button>
        ))}
      </nav>

      <footer className="m-hub-footer">
        <div className="m-hub-social">
          {SOCIAL_LINKS.map(link => (
            <a
              key={link.label}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={link.label}
              className="m-hub-social-link"
            >
              {link.label.split(' / ')[0]}
            </a>
          ))}
        </div>
        <p className="m-hub-copy">© 2026 TEAM CABIN · DETROIT, MI</p>
      </footer>
    </div>
  );
}
