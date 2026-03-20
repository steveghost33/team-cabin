export default function Ticker() {
  const items = [
    'Team Cabin', '🍕', 'Detroit Michigan', '★', 'Bass · Drums · Guitar',
    '★', 'Rock & Roll', '🍕', 'Est. in a basement somewhere',
    '★', 'Team Cabin', '🍕', 'Playing shows now',
  ];
  const text = items.join('   ');

  return (
    <>
      <style>{`
        .ticker {
          background: var(--gold);
          color: var(--green);
          overflow: hidden;
          border-top: 2px solid var(--gold-dark);
          border-bottom: 2px solid var(--gold-dark);
          padding: 0.6rem 0;
          white-space: nowrap;
        }
        .ticker-inner {
          display: inline-block;
          animation: ticker 28s linear infinite;
          font-family: var(--font-display);
          font-weight: 800; font-size: 0.85rem;
          text-transform: uppercase; letter-spacing: 0.14em;
        }
        .ticker-inner span { padding: 0 1.5rem; }
      `}</style>
      <div className="ticker" aria-hidden="true">
        <div className="ticker-inner">
          <span>{text}</span>
          <span>{text}</span>
        </div>
      </div>
    </>
  );
}
