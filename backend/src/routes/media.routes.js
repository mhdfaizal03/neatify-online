const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const mediaController = require("../controllers/media.controller");
const { protect, adminOnly } = require("../middleware/auth");

// Configure Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, "../../../frontend/public/assets/uploads");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

router.get("/", protect, adminOnly, mediaController.getMedia);
router.post("/upload", protect, adminOnly, upload.single("image"), mediaController.uploadMedia);
router.delete("/", protect, adminOnly, mediaController.deleteMedia);

module.exports = router;
