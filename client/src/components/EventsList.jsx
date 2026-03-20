import { useState } from "react";
import { useEvents } from "../hooks/useEvents";

export default function EventsList({ onSelectFighter }) {
  const { events, eventDetail, loading, detailLoading, error, getEventDetails } = useEvents();
  const [expandedId, setExpandedId] = useState(null);

  function handleToggle(id) {
    if (expandedId === id) {
      setExpandedId(null);
      return;
    }
    setExpandedId(id);
    getEventDetails(id);
  }

  if (loading) {
    return <p className="loading-msg">Loading events...</p>;
  }

  if (error) {
    return <p className="error-msg">Could not load events</p>;
  }

  if (!events) return null;

  const hasUpcoming = events.upcoming && events.upcoming.length > 0;
  const hasCompleted = events.completed && events.completed.length > 0;

  if (!hasUpcoming && !hasCompleted) return null;

  return (
    <div className="events-section">
      {hasUpcoming && (
        <div className="events-group">
          <h2 className="events-group-title">Upcoming Events</h2>
          <div className="events-list">
            {events.upcoming.map((ev) => (
              <EventCard
                key={ev.id}
                event={ev}
                expanded={expandedId === ev.id}
                detail={expandedId === ev.id ? eventDetail : null}
                detailLoading={expandedId === ev.id && detailLoading}
                onToggle={() => handleToggle(ev.id)}
                onSelectFighter={onSelectFighter}
                upcoming
              />
            ))}
          </div>
        </div>
      )}

      {hasCompleted && (
        <div className="events-group">
          <h2 className="events-group-title">Recent Events</h2>
          <div className="events-list">
            {events.completed.map((ev) => (
              <EventCard
                key={ev.id}
                event={ev}
                expanded={expandedId === ev.id}
                detail={expandedId === ev.id ? eventDetail : null}
                detailLoading={expandedId === ev.id && detailLoading}
                onToggle={() => handleToggle(ev.id)}
                onSelectFighter={onSelectFighter}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function EventCard({ event, expanded, detail, detailLoading, onToggle, onSelectFighter, upcoming }) {
  return (
    <div className={`event-card ${upcoming ? "event-card--upcoming" : ""} ${expanded ? "event-card--expanded" : ""}`}>
      <button className="event-card-header" onClick={onToggle} aria-expanded={expanded}>
        <div className="event-card-info">
          <span className="event-name">{event.name}</span>
          {event.date && <span className="event-date">{event.date}</span>}
          {event.location && <span className="event-location">{event.location}</span>}
        </div>
        <span className="event-toggle-icon">{expanded ? "▲" : "▼"}</span>
      </button>

      {expanded && (
        <div className="event-card-body">
          {detailLoading && <p className="loading-msg">Loading fight card...</p>}
          {!detailLoading && detail && detail.fights && detail.fights.length > 0 && (
            <ul className="fight-card-list">
              {detail.fights.map((fight, i) => (
                <li key={i} className="fight-card-row">
                  <button
                    className="fighter-link"
                    onClick={() => onSelectFighter(fight.fighter1.id)}
                    disabled={!fight.fighter1.id}
                  >
                    {fight.fighter1.name}
                  </button>
                  <span className="vs-label">vs</span>
                  <button
                    className="fighter-link"
                    onClick={() => onSelectFighter(fight.fighter2.id)}
                    disabled={!fight.fighter2.id}
                  >
                    {fight.fighter2.name}
                  </button>
                  {fight.weightClass && (
                    <span className="weight-class">{fight.weightClass}</span>
                  )}
                </li>
              ))}
            </ul>
          )}
          {!detailLoading && detail && detail.fights && detail.fights.length === 0 && (
            <p className="loading-msg">Fight card not yet announced</p>
          )}
        </div>
      )}
    </div>
  );
}
