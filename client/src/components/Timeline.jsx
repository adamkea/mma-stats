import { groupFightsByYear } from "../utils/formatStats";
import FightCard from "./FightCard";

export default function Timeline({ fights }) {
  if (!fights || fights.length === 0) {
    return <p className="no-fights">No fight history available.</p>;
  }

  const grouped = groupFightsByYear(fights);

  return (
    <div className="timeline">
      {grouped.map(([year, yearFights]) => (
        <div key={year} className="timeline-year">
          <h3 className="year-label">{year}</h3>
          <div className="year-fights">
            {yearFights.map((fight, i) => (
              <FightCard key={`${year}-${i}`} fight={fight} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
