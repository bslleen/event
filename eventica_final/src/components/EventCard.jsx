import React from 'react';

const IconCal  = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>;
const IconPin  = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>;
const IconClk  = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>;
const IconUser = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;
const IconLink = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>;

function fmtDate(d) {
  if (!d) return '';
  return new Date(d).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default function EventCard({ event, actions }) {
  const img = event.photos?.[0];
  return (
    <div className="event-card">
      {img
        ? <img src={img} alt={event.title} className="event-card-img" onError={e => { e.target.style.display = 'none'; }} />
        : <div className="event-card-img-placeholder">🎉</div>
      }
      <div className="event-card-body">
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
          <div className="event-card-title">{event.title}</div>
          {event.status && (
            <span className={`badge badge-${event.status}`}>
              {event.status === 'approved' ? '✓' : event.status === 'pending' ? '⏳' : '✗'} {event.status}
            </span>
          )}
        </div>
        <div className="event-card-description">{event.description}</div>
        <div className="event-card-meta">
          <div className="event-meta-item"><IconCal />  {fmtDate(event.date)}</div>
          {event.time     && <div className="event-meta-item"><IconClk />  {event.time}</div>}
          {event.location && <div className="event-meta-item"><IconPin />  {event.location}</div>}
          {event.organizerName && <div className="event-meta-item"><IconUser /> {event.organizerName}</div>}
        </div>
      </div>
      <div className="event-card-footer">
        {event.registrationLink
          ? <a href={event.registrationLink} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-sm"><IconLink /> Register</a>
          : <span />
        }
        {actions && <div style={{ display: 'flex', gap: 8 }}>{actions}</div>}
      </div>
    </div>
  );
}
