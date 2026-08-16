const express = require("express");
const router = express.Router();
const subscriberController = require("../controllers/subscriber.controller");
const { protect, adminOnly } = require("../middleware/auth");

router.post("/", subscriberController.subscribe);
router.get("/", protect, adminOnly, subscriberController.getSubscribers);

module.exports = router;
