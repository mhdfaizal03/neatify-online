const mongoose = require("mongoose");

const mediaSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
      unique: true,
    },
    size: {
      type: Number,
      required: true,
    },
    source: {
      type: String,
      default: "upload",
    },
  },
  {
    timestamps: true,
  }
);

const Media = mongoose.model("Media", mediaSchema);
module.exports = Media;
