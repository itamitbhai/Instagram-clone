const fs = require("fs");
const path = require("path");
const Story = require("../models/Story.model");

const CHECK_INTERVAL_MS = 5 * 60 * 1000; // 5 minutes

// MongoDB's TTL index only removes the document — it never touches the
// uploaded file on disk, so expired stories left the image/video behind
// forever. This job deletes the file and the doc together, so nothing
// is ever orphaned.
async function sweepExpiredStories() {
  const expired = await Story.find({ expiresAt: { $lte: new Date() } }).select("media");

  for (const story of expired) {
    if (story.media) {
      const filePath = path.join(__dirname, "..", "..", story.media);
      fs.unlink(filePath, (err) => {
        if (err && err.code !== "ENOENT") {
          console.error("Story file cleanup failed:", filePath, err.message);
        }
      });
    }
    await story.deleteOne();
  }

  if (expired.length > 0) {
    console.log(`🧹 Story cleanup: removed ${expired.length} expired stor${expired.length === 1 ? "y" : "ies"} (doc + file)`);
  }
}

function startStoryCleanupJob() {
  sweepExpiredStories().catch((err) => console.error("Story cleanup error:", err.message));
  setInterval(() => {
    sweepExpiredStories().catch((err) => console.error("Story cleanup error:", err.message));
  }, CHECK_INTERVAL_MS);
}

module.exports = { startStoryCleanupJob, sweepExpiredStories };
