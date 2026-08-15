const path = require("path");
const express = require("express");
const app = require("./src/app");
const logger = require("./src/config/logger");

const PORT = process.env.PORT || 3000;
const FRONTEND_DIR = path.join(__dirname, "../frontend/dist");

// Serve React Frontend (Production)
app.use(express.static(FRONTEND_DIR));
app.use("/assets", express.static(path.join(__dirname, "../assets")));

// Fallback all other non-API routes to React Router
app.get("*", (req, res, next) => {
  if (req.originalUrl.startsWith("/api")) {
    return next();
  }
  res.sendFile(path.join(FRONTEND_DIR, "index.html"));
});

if (require.main === module) {
  app.listen(PORT, () => {
    logger.info(`Neatify API running on port ${PORT}`);
  });
}

// Exported for serverless platforms (Vercel)
module.exports = app;
