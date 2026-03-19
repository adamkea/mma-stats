import { useState, useEffect, useRef } from "react";
import { formatRecord } from "../utils/formatStats";

export default function FighterSearch({ onSearch, onSelect, results, loading }) {
  const [query, setQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const wrapperRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (query.trim().length >= 2) {
        onSearch(query);
        setShowDropdown(true);
      } else {
        setShowDropdown(false);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [query, onSearch]);

  useEffect(() => {
    function handleClickOutside(e) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleSelect(id) {
    setShowDropdown(false);
    setQuery("");
    onSelect(id);
  }

  return (
    <div className="fighter-search" ref={wrapperRef}>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => query.trim().length >= 2 && results.length > 0 && setShowDropdown(true)}
        placeholder="Search fighter (e.g. Jon Jones)"
        className="search-input search-input-full"
      />

      {showDropdown && (
        <ul className="search-dropdown">
          {loading && (
            <li className="search-dropdown-msg">Searching...</li>
          )}
          {!loading && results.length === 0 && (
            <li className="search-dropdown-msg">No fighters found</li>
          )}
          {!loading && results.map((f) => (
            <li key={f.id} className="search-result-item" onClick={() => handleSelect(f.id)}>
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
