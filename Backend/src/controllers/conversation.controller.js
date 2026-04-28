const Conversation = require("../models/conversation.model.js");

const createConversation = async (req, res) => {
  const { senderId, receiverId } = req.body;

   try {
    //  check existing conversation
    const existing = await Conversation.findOne({
      members: { $all: [senderId, receiverId] },
    });

    if (existing) {
      return res.status(200).json(existing);
    }

    // create new
    const newConv = await Conversation.create({
      members: [senderId, receiverId],
    });

    res.status(201).json(newConv);
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