const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const reelsController = require("../controllers/reels.controller");
const authMiddleware = require("../middleware/auth.middleware");

// Make sure target directory exists
if (!fs.existsSync("uploads/reels/")) {
  fs.mkdirSync("uploads/reels/", { recursive: true });
}

// Multer Storage Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/reels/"),
  filename: (req, file, cb) =>
    cb(null, `reel_${Date.now()}${path.extname(file.originalname)}`),
});

const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB max for videos
  fileFilter: (req, file, cb) => {
    const allowed = /mp4|mov|webm|quicktime|mkv|avi/;
    const ok =
      allowed.test(path.extname(file.originalname).toLowerCase()) ||
      allowed.test(file.mimetype);
    ok ? cb(null, true) : cb(new Error("Sirf video formats (.mp4, .mov, .webm, .mkv, .avi) allowed hain!"));
  },
});

// GET /api/reels - Fetch all reels
router.get("/", authMiddleware, reelsController.getReelsController);

// POST /api/reels - Upload a new reel
router.post("/", authMiddleware, upload.single("video"), reelsController.createReelController);

// POST /api/reels/:id/like - Toggle like on a reel
router.post("/:id/like", authMiddleware, reelsController.toggleLikeReelController);

// POST /api/reels/:id/comment - Add comment to a reel
router.post("/:id/comment", authMiddleware, reelsController.addCommentReelController);

// DELETE /api/reels/:id - Delete a reel
router.delete("/:id", authMiddleware, reelsController.deleteReelController);

module.exports = router;
