# 🥊 Octagon Rewind

> A visual UFC/MMA fighter career timeline web app built with React.

Search any fighter and explore their full fight history — win/loss results, finish methods, round-by-round stats, takedowns, strike accuracy, control time, and opponent details — all laid out in a clean, chronological timeline.

---

## Features

- Fighter search with instant profile display
- Chronological fight timeline grouped by year
- Per-fight expandable stats (strikes, takedowns, control time)
- Win/Loss/NC colour coding with method breakdown (KO, SUB, Decision)
- Title fight indicators
- Career summary (total fights, KO wins, submission wins, title fights)
- Responsive dark UI

---

## Tech Stack

| Layer | Tech |
|---|---|
| Frontend | React 18 + plain CSS |
| Charts (v2) | Recharts |
| Backend | Node.js + Express |
| Scraping | Cheerio / Puppeteer |
| Data Source | ufcstats.com |
| Caching | Node in-memory / Redis (optional) |

---

## Project Structure

```
octagon-rewind/
├── client/                   # React frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── FighterSearch.jsx
│   │   │   ├── FighterProfile.jsx
│   │   │   ├── Timeline.jsx
│   │   │   ├── FightCard.jsx
│   │   │   └── StatsChart.jsx
│   │   ├── hooks/
│   │   │   └── useFighterData.js
│   │   ├── utils/
│   │   │   └── formatStats.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
│
├── server/                   # Express API + scraper
│   ├── routes/
│   │   └── fighters.js
│   ├── scrapers/
│   │   └── ufcstats.js
│   ├── cache/
│   │   └── store.js
│   └── index.js
│
├── README.md
└── .env.example
```

---

## Getting Started

### Prerequisites

- Node.js v18+
- npm or yarn

### Installation

```bash
# Clone the repo
git clone https://github.com/yourusername/octagon-rewind.git
cd octagon-rewind

# Install server dependencies
cd server && npm install

# Install client dependencies
cd ../client && npm install
```

### Running Locally

```bash
# Start the backend (from /server)
npm run dev

# Start the frontend (from /client)
npm run dev
```

The app will be available at `http://localhost:5173` and the API at `http://localhost:3000`.

---

## Data Source

Fight data is scraped from [ufcstats.com](http://www.ufcstats.com), which is the official statistical database used by the UFC. No API key is required.

Each fight returns:

- Result (W / L / NC) and method (KO, TKO, SUB, DEC)
- Round and finish time
- Significant strikes landed/attempted
- Takedowns landed/attempted
- Control time
- Opponent name, record at time of fight, and ranking

> **Note:** Scraping should be done responsibly — cache results aggressively and avoid hammering the source. A full fighter cache refresh is recommended rather than per-request scraping.

### Alternative / Supplementary Data Sources

| Source | What it offers | Cost |
|---|---|---|
| [ufcstats.com](http://ufcstats.com) | Full fight stats, round-by-round | Free (scrape) |
| [Sherdog](https://www.sherdog.com) | Fighter records, broader MMA coverage | Free (scrape) |
| [etr-dev/UFC-API](https://github.com/etr-dev/UFC-API) | Event details, betting odds | Free / self-host |
| [FightingTomatoes API](https://fightingtomatoes.com/API) | Past fight ratings | Free (200 req/mo) |
| [SportsDataIO MMA API](https://sportsdata.io/mma-ufc-api) | Full stats + live data | Free trial → paid |
| [Sportradar MMA API](https://developer.sportradar.com/mma/reference/mma-overview) | Live + historical, schedules | Free trial → paid |
| Kaggle UFC datasets | Bulk historical data (CSV) | Free |

---

## Roadmap

### v1 — Core (current prototype)
- [x] Fighter search
- [x] Profile header with record summary
- [x] Year-grouped fight timeline
- [x] Expandable fight cards with stats
- [x] Win/Loss/NC colour coding
- [x] Title fight badges

### v2 — Enhanced Stats
- [ ] Career stat trend charts (Recharts)
- [ ] Strike accuracy radar chart
- [ ] Win method breakdown pie chart
- [ ] Activity heatmap by year

### v3 — Advanced Features
- [ ] Fighter comparison mode (side-by-side timelines)
- [ ] Filter timeline by method, year, result
- [ ] Win/loss streak highlighting
- [ ] Autocomplete search from full fighter index
- [ ] Share a fighter's timeline via URL (e.g. `/fighter/jon-jones`)

### v4 — Live & Social
- [ ] Live event results (via SportsDataIO or Sportradar trial)
- [ ] Upcoming fights shown on timeline
- [ ] Bookmark / save favourite fighters

---

## Contributing

Pull requests are welcome. For major changes, open an issue first to discuss what you'd like to change.

1. Fork the repo
2. Create a feature branch (`git checkout -b feature/comparison-mode`)
3. Commit your changes (`git commit -m 'Add comparison mode'`)
4. Push to the branch (`git push origin feature/comparison-mode`)
5. Open a Pull Request

---

## License

[MIT](LICENSE)

---

> Built with React · Data from ufcstats.com · Inspired by the sport of MMA
