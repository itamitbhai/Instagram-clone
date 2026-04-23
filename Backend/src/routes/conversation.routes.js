const express = require("express");
const router = express.Router();

const {
  createConversation,
  getUserConversations,
} = require("../controllers/conversation.controller");

router.post("/", createConversation);
router.get("/:userId", getUserConversations);

module.exports = router;