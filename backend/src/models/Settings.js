const mongoose = require("mongoose");

const settingsSchema = new mongoose.Schema(
  {
    freeShippingThreshold: {
      type: Number,
      default: 999,
    },
    weekendKitIds: {
      type: [Number],
      default: [1, 2, 4, 7],
    },
    highlightProductId: {
      type: Number,
      default: 3,
    },
    storeName: {
      type: String,
      default: "Neatify",
    },
    announcement: {
      type: String,
      default: "Premium vehicle care, made simple.",
    },
    announcementSub: {
      type: String,
      default: "Free shipping on orders above ₹999.",
    },
    marqueeKeywords: {
      type: [String],
      default: [
        "DEEP DIRT LIFT",
        "PAINT-SAFE FORMULA",
        "THICK CLINGING FOAM",
        "CRYSTAL GLOSS FINISH",
        "pH-NEUTRAL & WAX-SAFE",
        "STREAK-FREE EVERY TIME"
      ]
    },
    whatsappNumber: {
      type: String,
      default: "918113001959",
    },
    supportPhone: {
      type: String,
      default: "+91 8113001959",
    }
  },
  {
    timestamps: true,
  }
);

const Settings = mongoose.model("Settings", settingsSchema);
module.exports = Settings;
