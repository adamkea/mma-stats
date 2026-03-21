import { useState, useEffect, useCallback } from "react";

const API_BASE = import.meta.env.VITE_API_URL || "/api";

export function useEvents() {
  const [events, setEvents] = useState(null);
  const [eventDetail, setEventDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchEvents() {
      try {
        const res = await fetch(`${API_BASE}/events`);
        if (!res.ok) throw new Error("Failed to load events");
        const data = await res.json();
        setEvents(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchEvents();
  }, []);

  const getEventDetails = useCallback(async (id) => {
    setDetailLoading(true);
    try {
      const res = await fetch(`${API_BASE}/events/${id}`);
      if (!res.ok) throw new Error("Failed to load event");
      const data = await res.json();
      setEventDetail(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setDetailLoading(false);
    }
  }, []);

  return { events, eventDetail, loading, detailLoading, error, getEventDetails };
}
