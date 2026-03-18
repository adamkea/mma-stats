import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { buildCareerSummary } from "../utils/formatStats";

const COLORS = { ko: "#e74c3c", sub: "#3498db", dec: "#2ecc71", other: "#95a5a6" };

export default function StatsChart({ fights }) {
  if (!fights || fights.length === 0) return null;

  const summary = buildCareerSummary(fights);
  const data = [
    { name: "KO/TKO", value: summary.koWins },
    { name: "Submission", value: summary.subWins },
    { name: "Decision", value: summary.decWins },
    { name: "Other", value: summary.wins - summary.koWins - summary.subWins - summary.decWins },
  ].filter((d) => d.value > 0);

  if (data.length === 0) return null;

  const colorKeys = ["ko", "sub", "dec", "other"];

  return (
    <div className="stats-chart">
      <h3>Win Method Breakdown</h3>
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
            {data.map((_entry, index) => (
              <Cell key={index} fill={COLORS[colorKeys[index]]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
