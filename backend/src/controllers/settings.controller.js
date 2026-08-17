const mongoose = require("mongoose");
const Settings = require("../models/Settings");
const { defaultSettings } = require("../config/constants");

class SettingsController {
  async getSettings(req, res, next) {
    try {
      if (mongoose.connection.readyState !== 1) {
        console.warn("Database not connected, returning fallback settings.");
        return res.status(200).json(defaultSettings);
      }

      let settings = await Settings.findOne();
      if (!settings) {
        settings = new Settings();
      }
      res.status(200).json(settings);
    } catch (error) {
      next(error);
    }
  }

  async updateSettings(req, res, next) {
    try {
      if (mongoose.connection.readyState !== 1) {
        return res.status(400).json({ error: "Database not connected. Cannot perform write operations." });
      }

      let settings = await Settings.findOne();
      if (!settings) {
        settings = new Settings();
      }

      const {
        freeShippingThreshold,
        weekendKitIds,
        highlightProductId,
        storeName,
        announcement,
        announcementSub,
        marqueeKeywords,
      } = req.body;

      if (freeShippingThreshold !== undefined) settings.freeShippingThreshold = freeShippingThreshold;
      if (weekendKitIds !== undefined) settings.weekendKitIds = weekendKitIds;
      if (highlightProductId !== undefined) settings.highlightProductId = highlightProductId;
      if (storeName !== undefined) settings.storeName = storeName;
      if (announcement !== undefined) settings.announcement = announcement;
      if (announcementSub !== undefined) settings.announcementSub = announcementSub;
      if (marqueeKeywords !== undefined) settings.marqueeKeywords = marqueeKeywords;

      await settings.save();
      res.status(200).json(settings);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new SettingsController();
