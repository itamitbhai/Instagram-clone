const mongoose = require("mongoose");

const StorySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    media: {
      type: String, // local path to the image or video
      required: true,
    },
    mediaType: {
      type: String,
      enum: ["image", "video"],
      default: "image",
    },
    caption: {
      type: String,
      default: "",
      maxlength: 200,
    },
    viewers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
      },
    ],
    expiresAt: {
      type: Date,
      default: () => new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
      index: true, // queried on every feed fetch (expiresAt > now) and by the cleanup job
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Story", StorySchema);
