const express = require("express");
const router = express.Router();

const identifyUser = require("../middleware/auth.middleware");

const {
  sendMessage,
  getMessages,
  markSeen,
  deleteMessage, 
} = require("../controllers/message.controller");

router.post("/", sendMessage);
router.get("/:conversationId", getMessages);
router.put("/seen/:conversationId", markSeen);

// 🗑️ DELETE MESSAGE
router.delete("/:id", identifyUser, deleteMessage);

module.exports = router;