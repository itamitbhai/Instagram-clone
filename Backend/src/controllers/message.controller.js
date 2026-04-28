const mongoose = require("mongoose");
const Message = require("../models/Message.model.js");
const Conversation = require("../models/conversation.model.js");


// ✅ SEND MESSAGE
const sendMessage = async (req, res) => {
  try {
    const { conversationId, senderId, text } = req.body;

    // 🔥 validation
    if (!conversationId || !senderId || !text) {
      return res.status(400).json({ error: "Missing fields" });
    }

    const message = await Message.create({
      conversationId,
      senderId,
      text,
    });

    // ✅ update last message
    await Conversation.findByIdAndUpdate(conversationId, {
      lastMessage: {
        text,
        senderId,
      },
    });

    res.status(201).json(message);

  } catch (err) {
    console.log("❌ SEND ERROR:", err);
    res.status(500).json(err.message);
  }
};


// ✅ GET MESSAGES (🔥 FIXED)
const getMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;

    console.log("📩 conversationId:", conversationId);

    // 🔥 ObjectId validation
    if (!mongoose.Types.ObjectId.isValid(conversationId)) {
      return res.status(400).json({ error: "Invalid conversationId" });
    }

    const messages = await Message.find({
      conversationId: new mongoose.Types.ObjectId(conversationId),
    }).sort({ createdAt: 1 });

    res.status(200).json(messages);

  } catch (err) {
    console.log("❌ GET ERROR:", err);
    res.status(500).json(err.message);
  }
};


// ✅ MARK AS SEEN
const markSeen = async (req, res) => {
  try {
    const { conversationId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(conversationId)) {
      return res.status(400).json({ error: "Invalid conversationId" });
    }

    await Message.updateMany(
      { conversationId: new mongoose.Types.ObjectId(conversationId), seen: false },
      { seen: true }
    );

    res.json({ message: "Seen updated" });

  } catch (err) {
    console.log("❌ SEEN ERROR:", err);
    res.status(500).json(err.message);
  }
};


module.exports = {
  sendMessage,
  getMessages,
  markSeen,
};