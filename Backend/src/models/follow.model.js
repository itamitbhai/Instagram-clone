const mongoose = require("mongoose")

const followSchema = new mongoose.Schema({
  follower: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true
  },

  followee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true
  },

  status: {
    type: String,
    default: "accepted", // Insta style (no request system)
    enum: ["pending", "accepted", "rejected"]
  }

}, { timestamps: true })

followSchema.index({ follower: 1, followee: 1 }, { unique: true })

const followModel = mongoose.model("Follow", followSchema)

module.exports = followModel