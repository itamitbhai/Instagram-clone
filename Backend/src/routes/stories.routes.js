const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const Story = require("../models/Story.model");
const authMiddleware = require("../middleware/auth.middleware"); // tumhara existing auth middleware

// ── Multer config ──────────────────────────────────────────────
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/stories/"),
  filename: (req, file, cb) =>
    cb(null, `story_${Date.now()}${path.extname(file.originalname)}`),
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|webp/;
    const ok =
      allowed.test(path.extname(file.originalname).toLowerCase()) &&
      allowed.test(file.mimetype);
    ok ? cb(null, true) : cb(new Error("Sirf images allowed hain!"));
  },
});

// ── POST /api/stories — story upload karo ──────────────────────
router.post("/", authMiddleware, upload.single("image"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "Image required hai" });

    const story = await Story.create({
      user: req.user.id,
      image: `/uploads/stories/${req.file.filename}`,
      caption: req.body.caption || "",
    });

    await story.populate("user", "username profileImage");
    res.status(201).json(story);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── GET /api/stories/feed — followed users ki stories ──────────
router.get("/feed", authMiddleware, async (req, res) => {
  try {
    // Query Follow collection to get all users whom the current user follows
    const followModel = require("../models/follow.model");
    const followingDocs = await followModel.find({
      follower: req.user.id,
      status: "accepted"
    }).select("followee");

    const followedIds = followingDocs.map(doc => doc.followee);
    const userIds = [...followedIds, req.user.id];

    const stories = await Story.find({
      user: { $in: userIds },
      expiresAt: { $gt: new Date() },
    })
      .populate("user", "username profileImage")
      .sort({ createdAt: -1 });

    // Group by user
    const grouped = {};
    stories.forEach((story) => {
      if (!story.user) return;
      const uid = story.user._id.toString();
      if (!grouped[uid]) {
        grouped[uid] = {
          user: story.user,
          stories: [],
          hasUnviewed: false,
        };
      }
      grouped[uid].stories.push(story);
      if (!story.viewers.includes(req.user.id)) {
        grouped[uid].hasUnviewed = true;
      }
    });

    res.json(Object.values(grouped));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── GET /api/stories/user/:userId — kisi user ki saari stories ─
router.get("/user/:userId", authMiddleware, async (req, res) => {
  try {
    const stories = await Story.find({
      user: req.params.userId,
      expiresAt: { $gt: new Date() },
    })
      .populate("user", "username profileImage")
      .sort({ createdAt: 1 });

    res.json(stories);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── PUT /api/stories/:id/view — story view mark karo ───────────
router.put("/:id/view", authMiddleware, async (req, res) => {
  try {
    await Story.findByIdAndUpdate(req.params.id, {
      $addToSet: { viewers: req.user.id },
    });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── DELETE /api/stories/:id — apni story delete karo ──────────
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const story = await Story.findById(req.params.id);
    if (!story) return res.status(404).json({ message: "Story nahi mili" });
    if (story.user.toString() !== req.user.id)
      return res.status(403).json({ message: "Ye teri story nahi hai" });

    await story.deleteOne();
    res.json({ message: "Story delete ho gayi" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;