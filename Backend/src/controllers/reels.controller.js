const Reel = require("../models/Reel.model");
const fs = require("fs");
const path = require("path");

// Create a Reel
async function createReelController(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Video required hai" });
    }

    const reel = await Reel.create({
      user: req.user.id,
      videoUrl: `/uploads/reels/${req.file.filename}`,
      caption: req.body.caption || "",
    });

    await reel.populate("user", "username profileImage");
    res.status(201).json(reel);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

// Get all Reels
async function getReelsController(req, res) {
  try {
    const reels = await Reel.find()
      .populate("user", "username profileImage")
      .populate("comments.user", "username profileImage")
      .sort({ createdAt: -1 });

    const currentUserId = req.user.id;

    const formattedReels = reels.map((reel) => {
      const reelObj = reel.toObject();
      reelObj.likesCount = reel.likes ? reel.likes.length : 0;
      reelObj.isLiked = reel.likes ? reel.likes.some(id => id.toString() === currentUserId) : false;
      return reelObj;
    });

    res.json(formattedReels);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

// Toggle Like Reel
async function toggleLikeReelController(req, res) {
  try {
    const reel = await Reel.findById(req.params.id);
    if (!reel) return res.status(404).json({ message: "Reel nahi mili" });

    const userId = req.user.id;
    const isLiked = reel.likes.some(id => id.toString() === userId);

    if (isLiked) {
      // Unlike
      reel.likes = reel.likes.filter((id) => id.toString() !== userId);
    } else {
      // Like
      reel.likes.push(userId);
    }

    await reel.save();

    res.json({
      success: true,
      isLiked: !isLiked,
      likesCount: reel.likes.length,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

// Add Comment
async function addCommentReelController(req, res) {
  try {
    const { text } = req.body;
    if (!text || text.trim() === "") {
      return res.status(400).json({ message: "Comment empty nahi ho sakta" });
    }

    const reel = await Reel.findById(req.params.id);
    if (!reel) return res.status(404).json({ message: "Reel nahi mili" });

    reel.comments.push({
      user: req.user.id,
      text,
    });

    await reel.save();

    // Populate user details for the new comment
    await reel.populate("comments.user", "username profileImage");

    res.status(201).json(reel.comments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

// Delete Reel
async function deleteReelController(req, res) {
  try {
    const reel = await Reel.findById(req.params.id);
    if (!reel) return res.status(404).json({ message: "Reel nahi mili" });

    if (reel.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Aap ye Reel delete nahi kar sakte" });
    }

    // Try deleting local file
    if (reel.videoUrl) {
      const filePath = path.join(__dirname, "..", "..", reel.videoUrl);
      fs.unlink(filePath, (err) => {
        if (err) console.log("File deletion error (or file doesn't exist):", err);
      });
    }

    await reel.deleteOne();
    res.json({ message: "Reel delete ho gayi" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

module.exports = {
  createReelController,
  getReelsController,
  toggleLikeReelController,
  addCommentReelController,
  deleteReelController,
};
