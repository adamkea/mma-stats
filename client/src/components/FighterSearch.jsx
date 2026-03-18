import { useState } from "react";
import { formatRecord } from "../utils/formatStats";

export default function FighterSearch({ onSearch, onSelect, results, loading }) {
  const [query, setQuery] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    onSearch(query);
  }

  return (
    <div className="fighter-search">
      <form onSubmit={handleSubmit} className="search-form">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search fighter (e.g. Jon Jones)"
          className="search-input"
        />
        <button type="submit" disabled={loading || query.trim().length < 2} className="search-btn">
          {loading ? "Searching..." : "Search"}
        </button>
      </form>

      {results.length > 0 && (
        <ul className="search-results">
          {results.map((f) => (
            <li key={f.id} className="search-result-item" onClick={() => onSelect(f.id)}>
              <span className="result-name">{f.name}</span>
              {f.nickname && <span className="result-nickname">"{f.nickname}"</span>}
              <span className="result-record">{formatRecord(f.record)}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
