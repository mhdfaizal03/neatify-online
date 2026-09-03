const mongoose = require("mongoose");
const Settings = require("../models/Settings");
const { defaultSettings } = require("../config/constants");

class SettingsController {
  async getSettings(req, res, next) {
    try {
      if (mongoose.connection.readyState === 0) {
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
      if (mongoose.connection.readyState === 0) {
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
        whatsappNumber,
        supportPhone,
      } = req.body;

      const normalizePhone = (value, fallback) => {
        if (value === undefined) return fallback;
        const normalized = String(value).replace(/\D/g, "");
        if (normalized.length < 10 || normalized.length > 15) {
          const error = new Error("Enter a valid WhatsApp number with country code.");
          error.statusCode = 400;
          throw error;
        }
        return normalized;
      };

      if (freeShippingThreshold !== undefined) settings.freeShippingThreshold = freeShippingThreshold;
      if (weekendKitIds !== undefined) settings.weekendKitIds = weekendKitIds;
      if (highlightProductId !== undefined) settings.highlightProductId = highlightProductId;
      if (storeName !== undefined) settings.storeName = storeName;
      if (announcement !== undefined) settings.announcement = announcement;
      if (announcementSub !== undefined) settings.announcementSub = announcementSub;
      if (marqueeKeywords !== undefined) settings.marqueeKeywords = marqueeKeywords;
      if (whatsappNumber !== undefined) settings.whatsappNumber = normalizePhone(whatsappNumber, settings.whatsappNumber);
      if (supportPhone !== undefined) settings.supportPhone = supportPhone;

      await settings.save();
      res.status(200).json(settings);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new SettingsController();
