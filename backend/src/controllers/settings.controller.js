const Settings = require("../models/Settings");

const formatSettings = (s) => ({
  freeShippingThreshold: s.freeShippingThreshold || 999,
  weekendKitIds: s.weekendKitIds || [1, 2, 4, 7],
  highlightProductId: s.highlightProductId || 3,
  storeName: s.storeName || "Neatify",
  announcement: s.announcement || "Premium vehicle care, made simple.",
  announcementSub: s.announcementSub || "Free shipping on orders above ₹999.",
});

class SettingsController {
  async getSettings(req, res, next) {
    try {
      let settings = await Settings.findOne();
      if (!settings) {
        settings = new Settings();
      }
      res.status(200).json(formatSettings(settings));
    } catch (error) {
      next(error);
    }
  }

  async updateSettings(req, res, next) {
    try {
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
      } = req.body;

      if (freeShippingThreshold !== undefined) settings.freeShippingThreshold = freeShippingThreshold;
      if (weekendKitIds !== undefined) settings.weekendKitIds = weekendKitIds;
      if (highlightProductId !== undefined) settings.highlightProductId = highlightProductId;
      if (storeName !== undefined) settings.storeName = storeName;
      if (announcement !== undefined) settings.announcement = announcement;
      if (announcementSub !== undefined) settings.announcementSub = announcementSub;

      await settings.save();
      res.status(200).json(formatSettings(settings));
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new SettingsController();
