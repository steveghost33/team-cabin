import TCLogo from '../common/TCLogo';
import { CHARS } from './Characters';
import { BAND_INFO, BOOKING_EMAIL, MEMBERS } from '../../config/constants';
import '../../styles/components/Hero.css';

export default function Hero() {
  return (
    <section id="home" className="hero" aria-label="Hero">
      <div className="hero__grid" aria-hidden="true" />

      <div className="hero__logo">
        <TCLogo size={200} />
      </div>

      <h1 className="hero__title">TEAM CABIN</h1>

      <p className="hero__subtitle">{BAND_INFO.shortDescription}</p>
      <p className="hero__description">
        {BAND_INFO.description} Based in {BAND_INFO.hometown}. Latest release: {BAND_INFO.latestRelease.title}.
      </p>

      <div className="hero__actions">
        <a className="hero__action hero__action--primary" href="#music">
          Listen Now
        </a>
        <a className="hero__action" href={`mailto:${BOOKING_EMAIL}?subject=Team%20Cabin%20Booking%20Inquiry`}>
          Booking / Press
        </a>
      </div>

      <div className="hero__characters" role="list">
        {MEMBERS.map((member, i) => {
          const Char = CHARS[member.charId];
          return (
            <div key={member.name} className="hero__character" role="listitem">
              <Char size={80} animate delay={`${i * 0.25}s`} />
              <span className="hero__character-name">{member.name}</span>
            </div>
          );
        })}
      </div>

      <div className="hero__scroll-hint" aria-label="Scroll down">▼ SCROLL DOWN ▼</div>
    </section>
  );
}
