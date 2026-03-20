const { getEvents } = require("../../server/scrapers/ufcstats");

module.exports = async (_req, res) => {
  try {
    const events = await getEvents();
    res.json(events);
  } catch (err) {
    console.error("Events error:", err.message);
    res.status(500).json({ error: "Failed to fetch events" });
  }
};
