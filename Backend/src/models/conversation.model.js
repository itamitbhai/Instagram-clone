const mongoose = require("mongoose");

const conversationSchema = new mongoose.Schema(
  {
    members: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "users",
        },
      ],
      required: true,
      validate: [
        {
          validator: function (arr) {
            return arr.length === 2;
          },
          message: "Conversation must have exactly 2 members",
        },
        {
          validator: function (arr) {
            return String(arr[0]) !== String(arr[1]);
          },
          message: "Members must be different users",
        },
      ],
    },

    lastMessage: {
      text: String,
      senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Conversation", conversationSchema);