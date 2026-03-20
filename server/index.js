const express = require("express");
const cors = require("cors");
require("dotenv").config({ path: "../.env" });

const fightersRouter = require("./routes/fighters");
const eventsRouter = require("./routes/events");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use("/api/fighters", fightersRouter);
app.use("/api/events", eventsRouter);

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
