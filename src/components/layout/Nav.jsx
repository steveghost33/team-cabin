import TCLogo from '../common/TCLogo';
import { NAV_LINKS } from '../../config/constants';
import '../../styles/components/Nav.css';

export default function Nav({ scrollTo }) {
  const handleLogoKeyDown = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      scrollTo('home');
    }
  };

  return (
    <nav className="nav" role="navigation" aria-label="Main navigation">
      <div className="nav__container">
        <button
          type="button"
          className="nav__logo"
          onClick={() => scrollTo('home')}
          aria-label="Go to top"
          onKeyDown={handleLogoKeyDown}
        >
          <TCLogo size={48} />
        </button>

        <div className="nav__links">
          {NAV_LINKS.map((link) => (
            <button
              key={link.id}
              type="button"
              className="nav__link"
              onClick={() => scrollTo(link.id)}
              aria-label={`Go to ${link.label} section`}
            >
              {link.label}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}
