import { useState } from "react";
import { getResultClass, getResultLabel, getMethodCategory } from "../utils/formatStats";

export default function FightCard({ fight }) {
  const [expanded, setExpanded] = useState(false);
  const resultClass = getResultClass(fight.result);
  const methodCat = getMethodCategory(fight.method);

  return (
    <div className={`fight-card ${resultClass}`} onClick={() => setExpanded(!expanded)}>
      <div className="fight-card-header">
        <span className={`fight-result ${resultClass}`}>{getResultLabel(fight.result)}</span>
        <span className="fight-opponent">vs. {fight.opponent || "Unknown"}</span>
        <span className={`fight-method method-${methodCat}`}>{fight.method || "N/A"}</span>
        <span className="fight-round">R{fight.round || "?"} {fight.time || ""}</span>
      </div>

      {expanded && (
        <div className="fight-card-details">
          <p className="fight-event">{fight.event || "Unknown Event"}</p>
          {fight.method && (
            <p className="fight-method-detail">Method: {fight.method}</p>
          )}
        </div>
      )}
    </div>
  );
}
