const { getEventDetails } = require("../../server/scrapers/ufcstats");

module.exports = async (req, res) => {
  const { id } = req.query;
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
};
