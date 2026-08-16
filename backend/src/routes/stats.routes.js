const express = require("express");
const router = express.Router();
const statsController = require("../controllers/stats.controller");
const { protect, adminOnly } = require("../middleware/auth");

router.get("/", protect, adminOnly, statsController.getStats);

module.exports = router;
