const mongoose = require("mongoose");
const Conversation = require("../models/conversation.model.js");
const Message = require("../models/Message.model.js"); 
require("../models/user.model.js");

const createConversation = async (req, res) => {
  try {
    const { senderId, receiverId } = req.body;

    console.log("📩 BODY:", req.body);

    //  validation
    if (!senderId || !receiverId) {
      return res.status(400).json({
        message: "Missing senderId or receiverId",
      });
    }

    //  prevent self chat
    if (String(senderId) === String(receiverId)) {
      return res.status(400).json({
        message: "Cannot message yourself",
      });
    }

    // convert to ObjectId (MOST IMPORTANT FIX)
    const senderObj = new mongoose.Types.ObjectId(senderId);
    const receiverObj = new mongoose.Types.ObjectId(receiverId);

    //  check existing conversation
    const existing = await Conversation.findOne({
      members: { $all: [senderObj, receiverObj] },
    });

    if (existing) {
      const populatedExisting = await Conversation.findById(existing._id)
        .populate("members", "username profileImage");

      return res.status(200).json(populatedExisting);
    }

    // create new conversation
    const newConv = await Conversation.create({
      members: [senderObj, receiverObj],
    });

    const populatedConv = await Conversation.findById(newConv._id)
      .populate("members", "username profileImage");

    return res.status(201).json(populatedConv);

  } catch (err) {
    console.log(" CREATE CONVO ERROR:", err); 
    return res.status(500).json({
      message: err.message,
    });
  }
};

//GET USER CONVERSATIONS
const getUserConversations = async (req, res) => {
  try {
    const convos = await Conversation.find({
      members: { $in: [req.params.userId] },
    })
      .populate("members", "username profileImage")
      .sort({ updatedAt: -1 });

    res.json(convos);
  } catch (err) {
    console.log(" GET CONVO ERROR:", err);
    res.status(500).json({
      message: err.message,
    });
  }
};

// MARK AS SEEN
const markSeen = async (req, res) => {
  try {
    await Message.updateMany(
      { conversationId: req.params.conversationId },
      { $set: { seen: true } }
    );

    res.status(200).json({
      message: "Messages marked as seen",
    });

  } catch (err) {
    console.log(" SEEN ERROR:", err);
    res.status(500).json({
      message: err.message,
    });
  }
};

module.exports = {
  createConversation,
  getUserConversations,
  markSeen,
};