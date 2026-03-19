import { useState, useCallback } from "react";

const API_BASE = import.meta.env.VITE_API_URL || "/api";

export function useFighterData() {
  const [searchResults, setSearchResults] = useState([]);
  const [fighter, setFighter] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const searchFighters = useCallback(async (query) => {
    if (!query || query.trim().length < 2) return;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${API_BASE}/fighters/search?q=${encodeURIComponent(query)}`);
      if (!res.ok) throw new Error("Search failed");
      const data = await res.json();
      setSearchResults(data.results);
    } catch (err) {
      setError(err.message);
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const getFighter = useCallback(async (id) => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${API_BASE}/fighters/${id}`);
      if (!res.ok) throw new Error("Failed to load fighter");
      const data = await res.json();
      setFighter(data);
    } catch (err) {
      setError(err.message);
      setFighter(null);
    } finally {
      setLoading(false);
    }
  }, []);

  return { searchResults, fighter, loading, error, searchFighters, getFighter };
}
