import TCLogo from '../common/TCLogo';
import { SOCIAL_LINKS } from '../../config/constants';
import { getSafeExternalUrl } from '../../utils/safeUrl';
import '../../styles/components/Footer.css';

const ICONS = {
  Instagram: () => (
    <svg viewBox="0 0 16 16" width="32" height="32" style={{ imageRendering: 'pixelated' }} aria-hidden="true">
      <rect x="2" y="2" width="12" height="12" fill="currentColor" />
      <rect x="3" y="1" width="10" height="1" fill="currentColor" />
      <rect x="3" y="14" width="10" height="1" fill="currentColor" />
      <rect x="1" y="3" width="1" height="10" fill="currentColor" />
      <rect x="14" y="3" width="1" height="10" fill="currentColor" />
      <rect x="3" y="3" width="10" height="10" fill="#030a02" />
      <rect x="5" y="4" width="6" height="1" fill="currentColor" />
      <rect x="5" y="11" width="6" height="1" fill="currentColor" />
      <rect x="4" y="5" width="1" height="6" fill="currentColor" />
      <rect x="11" y="5" width="1" height="6" fill="currentColor" />
      <rect x="5" y="5" width="6" height="6" fill="#030a02" />
      <rect x="6" y="6" width="4" height="4" fill="currentColor" />
      <rect x="7" y="7" width="2" height="2" fill="#030a02" />
      <rect x="11" y="4" width="1" height="1" fill="currentColor" />
    </svg>
  ),
  Facebook: () => (
    <svg viewBox="0 0 16 16" width="32" height="32" style={{ imageRendering: 'pixelated' }} aria-hidden="true">
      <rect x="6" y="2" width="5" height="1" fill="currentColor" />
      <rect x="5" y="3" width="1" height="2" fill="currentColor" />
      <rect x="6" y="3" width="4" height="1" fill="currentColor" />
      <rect x="5" y="5" width="7" height="2" fill="currentColor" />
      <rect x="5" y="7" width="3" height="7" fill="currentColor" />
    </svg>
  ),
  YouTube: () => (
    <svg viewBox="0 0 16 16" width="32" height="32" style={{ imageRendering: 'pixelated' }} aria-hidden="true">
      <rect x="1"  y="4"  width="14" height="8" fill="currentColor" />
      <rect x="2"  y="3"  width="12" height="1" fill="currentColor" />
      <rect x="2"  y="12" width="12" height="1" fill="currentColor" />
      <rect x="2"  y="5"  width="12" height="6" fill="#030a02" />
      <rect x="6"  y="6"  width="1" height="4" fill="currentColor" />
      <rect x="7"  y="7"  width="1" height="2" fill="currentColor" />
      <rect x="8"  y="7"  width="1" height="2" fill="currentColor" />
      <rect x="9"  y="7"  width="1" height="2" fill="currentColor" />
      <rect x="10" y="8"  width="1" height="1" fill="currentColor" />
    </svg>
  ),
};

function SocialIcon({ label, url }) {
  const IconComp = ICONS[label];
  const safeUrl = getSafeExternalUrl(url);

  if (!safeUrl) {
    return null;
  }

  return (
    <a
      href={safeUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="social-icon"
    >
      {IconComp && <IconComp />}
      <span className="social-icon__label">{label}</span>
    </a>
  );
}

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__logo">
        <TCLogo size={120} />
      </div>

      <nav className="footer__social" aria-label="Social media links">
        {SOCIAL_LINKS.map((link) => (
          <SocialIcon key={link.label} label={link.label} url={link.url} />
        ))}
      </nav>

      <p className="footer__copyright">
        © 2026 TEAM CABIN · DETROIT, MI · ALL RIGHTS RESERVED
      </p>
      <p className="footer__tagline">
        No pizza was harmed in the making of this website 🍕
      </p>
    </footer>
  );
}
