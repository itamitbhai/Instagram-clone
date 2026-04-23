const Conversation = require("../models/conversation.model.js");

const createConversation = async (req, res) => {
  try {
    const { senderId, receiverId } = req.body;

    // check existing
    let convo = await Conversation.findOne({
      members: { $all: [senderId, receiverId] },
    });

    if (!convo) {
      convo = await Conversation.create({
        members: [senderId, receiverId],
      });
    }

    res.json(convo);
  } catch (err) {
    res.status(500).json(err.message);
  }
};

const getUserConversations = async (req, res) => {
  try {
    const convos = await Conversation.find({
      members: { $in: [req.params.userId] },
    }).sort({ updatedAt: -1 });

    res.json(convos);
  } catch (err) {
    res.status(500).json(err.message);
  }
};

module.exports = {
  createConversation,
  getUserConversations,
};