const mongoose = require("mongoose");

const conversationSchema = new mongoose.Schema(
  {
    members: [String], // [user1, user2]

    lastMessage: {
      text: String,
      senderId: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("conversation", conversationSchema)