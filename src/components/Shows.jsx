import { C, SHOWS } from '../data/constants';

export default function Shows() {
  return (
    <>
      <style>{`
        .shows {
          background: var(--green);
          padding: clamp(4rem,8vw,8rem) 0;
        }
        .shows-inner {
          max-width: 1200px; margin: 0 auto;
          padding: 0 clamp(1rem,4vw,3rem);
        }
        .shows-list { display: flex; flex-direction: column; gap: 0; margin-top: clamp(2rem,4vw,3.5rem); }
        .show-row {
          display: grid;
          grid-template-columns: 80px 1fr auto;
          align-items: center; gap: 2rem;
          padding: 1.5rem 0;
          border-bottom: 1px solid rgba(255,255,255,0.08);
          transition: background 0.15s;
          cursor: default;
        }
        .show-row:first-child { border-top: 1px solid rgba(255,255,255,0.08); }
        .show-row.feat { background: rgba(226,168,32,0.05); }
        .show-row:hover { background: rgba(255,255,255,0.03); }
        .show-date {
          text-align: center;
          border-right: 1px solid rgba(255,255,255,0.1);
          padding-right: 2rem;
        }
        .show-month {
          font-family: var(--font-display);
          font-weight: 700; font-size: 0.7rem;
          text-transform: uppercase; letter-spacing: 0.15em;
          color: var(--gold); display: block;
        }
        .show-day {
          font-family: var(--font-display);
          font-weight: 900; font-size: 2.5rem;
          color: var(--cream); line-height: 1;
        }
        .show-venue {
          font-family: var(--font-display);
          font-weight: 700; font-size: clamp(1.2rem,2.5vw,1.8rem);
          text-transform: uppercase; color: var(--cream);
          display: block; margin-bottom: 0.25rem;
        }
        .show-details {
          font-family: var(--font-body);
          font-size: 0.85rem; color: var(--cream-dim);
        }
        .show-details .loc { color: var(--gold-light); }
        .show-ticket {
          display: inline-block;
          background: var(--gold);
          color: var(--green);
          font-family: var(--font-display);
          font-weight: 800; font-size: 0.75rem;
          text-transform: uppercase; letter-spacing: 0.12em;
          padding: 0.6rem 1.2rem; border-radius: 2px;
          text-decoration: none;
          transition: background 0.15s, transform 0.1s;
          white-space: nowrap;
        }
        .show-ticket:hover { background: var(--gold-light); transform: translateY(-2px); }
        .show-ticket.secondary {
          background: transparent; color: var(--gold);
          border: 1.5px solid var(--gold);
        }
        .show-ticket.secondary:hover { background: rgba(226,168,32,0.1); }
        @media (max-width: 560px) {
          .show-row { grid-template-columns: 60px 1fr; gap: 1rem; }
          .show-ticket-wrap { grid-column: 1 / -1; }
          .show-date { border-right: none; padding-right: 0; }
        }
      `}</style>

      <section id="shows" className="shows">
        <div className="shows-inner">
          <div className="section-header">
            <h2 className="section-title">Upcoming <span className="accent">Shows</span></h2>
            <div className="section-rule" />
          </div>
          <div className="shows-list">
            {SHOWS.map((s, i) => (
              <div key={i} className={`show-row${s.feat ? ' feat' : ''}`}>
                <div className="show-date">
                  <span className="show-month">{s.mo}</span>
                  <span className="show-day">{s.d}</span>
                </div>
                <div>
                  <span className="show-venue">{s.v}</span>
                  <span className="show-details">
                    <span className="loc">{s.loc}</span> — {s.t}
                  </span>
                </div>
                <div className="show-ticket-wrap">
                  <a href={s.ticketUrl} className={`show-ticket${s.feat ? '' : ' secondary'}`}>
                    Tickets →
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
