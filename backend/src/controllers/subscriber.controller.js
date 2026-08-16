const mongoose = require("mongoose");
const Subscriber = require("../models/Subscriber");

class SubscriberController {
  async subscribe(req, res, next) {
    try {
      const { email, type } = req.body;

      if (!email) {
        return res.status(400).json({ error: "Email is required" });
      }

      if (mongoose.connection.readyState !== 1) {
        console.warn("Database not connected, returning mock success for subscription.");
        return res.status(201).json({ success: true, message: "Demo mode: Subscribed successfully" });
      }

      // Check if already subscribed
      const existing = await Subscriber.findOne({ email });
      if (existing) {
        return res.status(200).json({ success: true, message: "Already subscribed" });
      }

      await Subscriber.create({ email, type });
      res.status(201).json({ success: true, message: "Subscribed successfully" });
    } catch (error) {
      next(error);
    }
  }

  async getSubscribers(req, res, next) {
    try {
      if (mongoose.connection.readyState !== 1) {
        console.warn("Database not connected, returning empty subscribers list.");
        return res.status(200).json([]);
      }

      const subscribers = await Subscriber.find().sort("-createdAt");
      res.status(200).json(
        subscribers.map((s) => ({
          id: s._id.toString(),
          email: s.email,
          type: s.type || "newsletter",
          createdAt: s.createdAt,
        }))
      );
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new SubscriberController();
