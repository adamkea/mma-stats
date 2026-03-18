export function formatRecord(record) {
  if (!record) return "0-0-0";
  return `${record.wins}-${record.losses}-${record.draws}`;
}

export function getResultClass(result) {
  switch (result) {
    case "W":
      return "result-win";
    case "L":
      return "result-loss";
    default:
      return "result-nc";
  }
}

export function getResultLabel(result) {
  switch (result) {
    case "W":
      return "Win";
    case "L":
      return "Loss";
    case "D":
      return "Draw";
    case "NC":
      return "No Contest";
    default:
      return result || "N/A";
  }
}

export function getMethodCategory(method) {
  if (!method) return "other";
  const m = method.toUpperCase();
  if (m.includes("KO") || m.includes("TKO")) return "ko";
  if (m.includes("SUB")) return "sub";
  if (m.includes("DEC")) return "dec";
  return "other";
}

export function buildCareerSummary(fights) {
  const summary = {
    total: fights.length,
    wins: 0,
    losses: 0,
    draws: 0,
    nc: 0,
    koWins: 0,
    subWins: 0,
    decWins: 0,
    titleFights: 0,
  };

  for (const fight of fights) {
    if (fight.result === "W") {
      summary.wins++;
      const cat = getMethodCategory(fight.method);
      if (cat === "ko") summary.koWins++;
      else if (cat === "sub") summary.subWins++;
      else if (cat === "dec") summary.decWins++;
    } else if (fight.result === "L") {
      summary.losses++;
    } else if (fight.result === "D") {
      summary.draws++;
    } else {
      summary.nc++;
    }

    if (fight.event && fight.event.toLowerCase().includes("title")) {
      summary.titleFights++;
    }
  }

  return summary;
}

export function groupFightsByYear(fights) {
  const grouped = {};
  for (const fight of fights) {
    // Extract year from event name or use "Unknown"
    const yearMatch = fight.event && fight.event.match(/\b(19|20)\d{2}\b/);
    const year = yearMatch ? yearMatch[0] : "Unknown";
    if (!grouped[year]) grouped[year] = [];
    grouped[year].push(fight);
  }

  // Sort years descending
  return Object.entries(grouped).sort(([a], [b]) => {
    if (a === "Unknown") return 1;
    if (b === "Unknown") return -1;
    return parseInt(b) - parseInt(a);
  });
}
