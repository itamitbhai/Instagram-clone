const Message = require("../models/Message.model.js");
const Conversation = require("../models/conversation.model.js");

const sendMessage = async (req, res) => {
  try {
    const { conversationId, senderId, text } = req.body;

    const message = await Message.create({
      conversationId,
      senderId,
      text,
    });

    // update last message
    await Conversation.findByIdAndUpdate(conversationId, {
      lastMessage: {
        text,
        senderId,
      },
    });

    res.status(201).json(message);
  } catch (err) {
    res.status(500).json(err.message);
  }
};

const getMessages = async (req, res) => {
  try {
    const messages = await Message.find({
      conversationId: req.params.conversationId,
    }).sort({ createdAt: 1 });

    res.json(messages);
  } catch (err) {
    res.status(500).json(err.message);
  }
};

// seen update
const markSeen = async (req, res) => {
  try {
    await Message.updateMany(
      { conversationId: req.params.conversationId, seen: false },
      { seen: true }
    );

    res.json({ message: "Seen updated" });
  } catch (err) {
    res.status(500).json(err.message);
  }
};

module.exports = {
  sendMessage,
  getMessages,
  markSeen,
};