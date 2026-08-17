const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
const Media = require("../models/Media");
const { defaultProducts } = require("../config/constants");

class MediaController {
  async getMedia(req, res, next) {
    try {
      if (mongoose.connection.readyState === 0) {
        console.warn("Database not connected, returning fallback media list.");
        const fallbackMedia = defaultProducts.map((p) => ({
          id: String(p.id),
          name: p.name + " Image",
          url: p.image,
          size: 102400,
          source: "system",
        }));
        return res.status(200).json(fallbackMedia);
      }

      const mediaList = await Media.find().sort("-createdAt");
      res.status(200).json(
        mediaList.map((m) => ({
          id: m._id.toString(),
          name: m.name,
          url: m.url,
          size: m.size || 0,
          source: m.source || "upload",
        }))
      );
    } catch (error) {
      next(error);
    }
  }

  async uploadMedia(req, res, next) {
    try {
      if (mongoose.connection.readyState === 0) {
        return res.status(400).json({ error: "Database not connected. Cannot perform upload operations." });
      }

      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      const urlPath = `assets/uploads/${req.file.filename}`;

      const media = await Media.create({
        name: req.file.originalname,
        url: urlPath,
        size: req.file.size,
        source: "upload",
      });

      res.status(201).json({
        id: media._id.toString(),
        name: media.name,
        url: media.url,
        size: media.size,
        source: media.source,
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteMedia(req, res, next) {
    try {
      if (mongoose.connection.readyState === 0) {
        return res.status(400).json({ error: "Database not connected. Cannot perform write operations." });
      }

      const { url } = req.body;
      if (!url) {
        return res.status(400).json({ error: "URL is required" });
      }

      const media = await Media.findOne({ url });
      if (!media) {
        return res.status(404).json({ error: "Media entry not found in database" });
      }

      if (media.source === "upload") {
        const filePath = path.join(__dirname, "../../../frontend/public/", url);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }

      await Media.deleteOne({ _id: media._id });
      res.status(200).json({ success: true, message: "Media deleted successfully" });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new MediaController();
