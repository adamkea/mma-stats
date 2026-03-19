const { getFighterDetails } = require("../../server/scrapers/ufcstats");

module.exports = async (req, res) => {
  const { id } = req.query;

  try {
    const fighter = await getFighterDetails(id);
    if (!fighter.name) {
      return res.status(404).json({ error: "Fighter not found" });
    }
    res.json(fighter);
  } catch (err) {
    console.error("Fighter details error:", err.message);
    res.status(500).json({ error: "Failed to fetch fighter details" });
  }
};
