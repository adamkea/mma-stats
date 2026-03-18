import { formatRecord, buildCareerSummary } from "../utils/formatStats";

export default function FighterProfile({ fighter }) {
  if (!fighter) return null;

  const summary = buildCareerSummary(fighter.fights || []);

  return (
    <div className="fighter-profile">
      <div className="profile-header">
        <h2 className="profile-name">{fighter.name}</h2>
        {fighter.nickname && <p className="profile-nickname">"{fighter.nickname}"</p>}
        <p className="profile-record">{formatRecord(fighter.record)}</p>
      </div>

      <div className="career-summary">
        <div className="stat-box">
          <span className="stat-value">{summary.total}</span>
          <span className="stat-label">Fights</span>
        </div>
        <div className="stat-box">
          <span className="stat-value">{summary.koWins}</span>
          <span className="stat-label">KO Wins</span>
        </div>
        <div className="stat-box">
          <span className="stat-value">{summary.subWins}</span>
          <span className="stat-label">SUB Wins</span>
        </div>
        <div className="stat-box">
          <span className="stat-value">{summary.decWins}</span>
          <span className="stat-label">DEC Wins</span>
        </div>
        <div className="stat-box">
          <span className="stat-value">{summary.titleFights}</span>
          <span className="stat-label">Title Fights</span>
        </div>
      </div>

      {fighter.stats && Object.keys(fighter.stats).length > 0 && (
        <div className="physical-stats">
          {Object.entries(fighter.stats).map(([key, val]) => (
            <span key={key} className="phys-stat">
              {key.replace(/_/g, " ")}: <strong>{val}</strong>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
