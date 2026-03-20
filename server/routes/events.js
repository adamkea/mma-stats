const express = require("express");
const { getEvents, getEventDetails } = require("../scrapers/ufcstats");

const router = express.Router();

// GET /api/events
router.get("/", async (_req, res) => {
  try {
    const events = await getEvents();
    res.json(events);
  } catch (err) {
    console.error("Events error:", err.message);
    res.status(500).json({ error: "Failed to fetch events" });
  }
});

// GET /api/events/:id
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const event = await getEventDetails(id);
    if (!event.name) {
      return res.status(404).json({ error: "Event not found" });
    }
    res.json(event);
  } catch (err) {
    console.error("Event details error:", err.message);
    res.status(500).json({ error: "Failed to fetch event details" });
  }
});

module.exports = router;
