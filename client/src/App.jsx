import { useFighterData } from "./hooks/useFighterData";
import FighterSearch from "./components/FighterSearch";
import FighterProfile from "./components/FighterProfile";
import StatsChart from "./components/StatsChart";
import Timeline from "./components/Timeline";
import EventsList from "./components/EventsList";

function App() {
  const { searchResults, fighter, loading, error, searchFighters, getFighter } = useFighterData();

  return (
    <>
      <header className="app-header">
        <h1>MMA Stats</h1>
        <p className="tagline">UFC fighter stats & fight history</p>
      </header>

      <main className="app-main">
        <FighterSearch
          onSearch={searchFighters}
          onSelect={getFighter}
          results={searchResults}
          loading={loading}
        />

        {error && <p className="error-msg">{error}</p>}
        {loading && !searchResults.length && <p className="loading-msg">Loading...</p>}

        {!fighter && <EventsList onSelectFighter={getFighter} />}

        {fighter && (
          <>
            <FighterProfile fighter={fighter} />
            <StatsChart fights={fighter.fights} />
            <Timeline fights={fighter.fights} />
          </>
        )}
      </main>

      <footer className="app-footer">
        <p>Data sourced from UFCStats.com</p>
      </footer>
    </>
  );
}

export default App;
