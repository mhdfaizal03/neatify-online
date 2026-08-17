const mongoose = require("mongoose");
require("dotenv").config({ path: "backend/.env" });

console.log("Connecting to:", process.env.MONGO_URI.substring(0, 25) + "...");
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Successfully connected to MongoDB!");
    process.exit(0);
  })
  .catch(err => {
    console.error("Connection failed:", err.message);
    process.exit(1);
  });
