const express = require("express");
const router = express.Router();

const identifyUser = require("../middleware/auth.middleware");

const {
  createConversation,
  getUserConversations,
  deleteConversation, // ✅ FIX
} = require("../controllers/conversation.controller");

// create chat
router.post("/", createConversation);

// get chats
router.get("/:userId", getUserConversations);

// delete chat
router.delete("/:id", identifyUser, deleteConversation);

module.exports = router;