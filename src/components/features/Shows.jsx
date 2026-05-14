import SectionTitle from '../common/SectionTitle';
import { BOOKING_EMAIL, SHOWS } from '../../config/constants';
import { getSafeExternalUrl } from '../../utils/safeUrl';
import '../../styles/components/Shows.css';

function formatShowDate(value) {
  const date = new Date(value);

  return {
    month: date.toLocaleString('en-US', { month: 'short' }).toUpperCase(),
    day: String(date.getDate()).padStart(2, '0'),
    full: date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }),
  };
}

function isUpcomingShow(value) {
  const showDate = new Date(value);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return showDate >= today;
}

function ShowCard({ show }) {
  const { month, day, full } = formatShowDate(show.date);
  const links = [
    show.ticketUrl ? { label: 'Tickets', url: show.ticketUrl } : null,
    show.eventUrl ? { label: 'Event Info', url: show.eventUrl } : null,
    show.rsvpUrl ? { label: 'RSVP', url: show.rsvpUrl } : null,
  ].filter(Boolean).map((link) => ({ ...link, safeUrl: getSafeExternalUrl(link.url) })).filter((link) => link.safeUrl);

  return (
    <li
      className={`show-card ${show.featured ? 'show-card--featured' : ''}`}
      aria-label={`${full} at ${show.venue}`}
    >
      <div className="show-card__date">
        <span className="show-card__month">{month}</span>
        <span className="show-card__day">{day}</span>
      </div>
      <div>
        <p className="show-card__meta">{full}</p>
        <span className="show-card__venue">{show.venue}</span>
        <span className="show-card__details">
          {show.city}, {show.state}{show.details ? ` — ${show.details}` : ''}
        </span>
        {links.length > 0 && (
          <div className="show-card__links">
            {links.map((link) => (
              <a key={link.label} href={link.safeUrl} target="_blank" rel="noopener noreferrer" className="show-card__link">
                {link.label}
              </a>
            ))}
          </div>
        )}
      </div>
    </li>
  );
}

export default function Shows() {
  const upcomingShows = SHOWS.filter((show) => isUpcomingShow(show.date));
  const pastShows = SHOWS.filter((show) => !isUpcomingShow(show.date))
    .sort((a, b) => new Date(b.date) - new Date(a.date));
  const upcomingShowSchemas = upcomingShows.map((show) => ({
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: `Team Cabin at ${show.venue}`,
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    eventStatus: 'https://schema.org/EventScheduled',
    startDate: show.date,
    location: {
      '@type': 'Place',
      name: show.venue,
      address: {
        '@type': 'PostalAddress',
        addressLocality: show.city,
        addressRegion: show.state,
        addressCountry: 'US',
      },
    },
    performer: {
      '@type': 'MusicGroup',
      name: 'Team Cabin',
    },
    offers: show.ticketUrl
      ? {
          '@type': 'Offer',
          url: show.ticketUrl,
          availability: 'https://schema.org/InStock',
        }
      : undefined,
    url: show.eventUrl || show.ticketUrl,
    description: show.details,
  }));

  return (
    <section id="shows" className="shows" aria-label="Upcoming shows">
      <div className="shows__inner">
        <SectionTitle>UPCOMING SHOWS</SectionTitle>

        {upcomingShows.length > 0 ? (
          <ul className="shows__list" role="list">
            {upcomingShows.map((show) => (
              <ShowCard key={show.id} show={show} />
            ))}
          </ul>
        ) : (
          <div className="shows__empty">
            <p className="shows__empty-title">New dates coming soon.</p>
            <p className="shows__empty-copy">
              Follow the band for the next Detroit-area announcement or email{' '}
              <a href={`mailto:${BOOKING_EMAIL}?subject=Team%20Cabin%20Show%20Inquiry`}>
                {BOOKING_EMAIL}
              </a>{' '}
              for booking, venue, or press inquiries.
            </p>
          </div>
        )}

        {pastShows.length > 0 && (
          <>
            <SectionTitle as="h3" color="var(--color-gold-light)">RECENT SHOWS</SectionTitle>
            <ul className="shows__list shows__list--past" role="list">
              {pastShows.slice(0, 5).map((show) => (
                <ShowCard key={show.id} show={show} />
              ))}
            </ul>
          </>
        )}
      </div>

      {upcomingShowSchemas.length > 0 && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(upcomingShowSchemas) }} />
      )}
    </section>
  );
}
