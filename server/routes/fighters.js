const express = require("express");
const { searchFighters, getFighterDetails } = require("../scrapers/ufcstats");

const router = express.Router();

// GET /api/fighters/search?q=conor+mcgregor
router.get("/search", async (req, res) => {
  const { q } = req.query;
  if (!q || q.trim().length < 2) {
    return res.status(400).json({ error: "Query must be at least 2 characters" });
  }

  try {
    const fighters = await searchFighters(q.trim());
    res.json({ results: fighters });
  } catch (err) {
    console.error("Search error:", err.message);
    res.status(500).json({ error: "Failed to search fighters" });
  }
});

// GET /api/fighters/:id
router.get("/:id", async (req, res) => {
  const { id } = req.params;

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
});

module.exports = router;
