const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const path = require("path");
const logger = require("./config/logger");
const errorHandler = require("./middleware/error");
const connectDB = require("./config/db");

// Connect to MongoDB
connectDB();

const app = express();

// Security and utility middleware
app.use(
  helmet({
    contentSecurityPolicy: false, // Turn off CSP for CDN scripts/styles easily
  })
);
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// HTTP Request Logging
app.use(
  morgan("combined", {
    stream: { write: (message) => logger.info(message.trim()) },
  })
);

// Serve uploads / assets statically (redundancy for direct app runs)
app.use("/assets", express.static(path.join(__dirname, "../../assets")));

// Health check route
app.get("/api/health", (req, res) => {
  res.status(200).json({ success: true, message: "Neatify API is running" });
});

// Main routing
app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/account", require("./routes/user.routes"));
app.use("/api/products", require("./routes/product.routes"));
app.use("/api/orders", require("./routes/order.routes"));
app.use("/api/subscribers", require("./routes/subscriber.routes"));
app.use("/api/settings", require("./routes/settings.routes"));
app.use("/api/media", require("./routes/media.routes"));
app.use("/api/stats", require("./routes/stats.routes"));

// 404 handler for API routes
app.use("/api/*", (req, res) => {
  res.status(404).json({ success: false, message: "API endpoint not found" });
});

// Error handling middleware
app.use(errorHandler);

module.exports = app;
