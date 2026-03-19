const { searchFighters } = require("../../server/scrapers/ufcstats");

module.exports = async (req, res) => {
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
};
