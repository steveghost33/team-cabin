import { useEffect, useState } from 'react';
import TCLogo from '../common/TCLogo';
import { CHARS } from '../features/Characters';
import { BAND_INFO, BOOKING_EMAIL, MEMBERS, SOCIAL_LINKS } from '../../config/constants';
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
  const [bandcampScale, setBandcampScale] = useState(1);

  useEffect(() => {
    const updateBandcampScale = () => {
      const horizontalPadding = 32;
      const frameAllowance = 4;
      const availableWidth = Math.max(320, window.innerWidth - horizontalPadding - frameAllowance);
      setBandcampScale(Math.min(1, availableWidth / 400));
    };

    updateBandcampScale();
    window.addEventListener('resize', updateBandcampScale);

    return () => window.removeEventListener('resize', updateBandcampScale);
  }, []);

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
        <p className="m-hub-subtitle">{BAND_INFO.shortDescription}</p>
        {BAND_INFO.description && (
          <p className="m-hub-description">
            {BAND_INFO.description}
          </p>
        )}
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

      <div
        className="m-hub-bandcamp"
        style={{
          '--bandcamp-scale': bandcampScale,
          '--bandcamp-visible-width': `${400 * bandcampScale}px`,
          '--bandcamp-visible-height': `${120 * bandcampScale}px`,
        }}
      >
        <div className="m-hub-bandcamp-frame">
          <div className="m-hub-bandcamp-shell">
            <iframe
              className="m-hub-bandcamp-embed"
              src="https://bandcamp.com/EmbeddedPlayer/album=3306975666/size=large/bgcol=333333/linkcol=e99708/tracklist=false/artwork=small/transparent=true/"
              title="Tall Bike by Team Cabin"
              loading="lazy"
              seamless
            >
              <a href="https://teamcabin.bandcamp.com/album/tall-bike">
                Tall Bike by Team Cabin
              </a>
            </iframe>
          </div>
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
        <a className="m-hub-contact" href={`mailto:${BOOKING_EMAIL}?subject=Team%20Cabin%20Booking%20Inquiry`}>
          For Booking/Press: {BOOKING_EMAIL}
        </a>
      </footer>
    </div>
  );
}
