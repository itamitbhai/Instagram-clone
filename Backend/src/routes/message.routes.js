const express = require("express");
const router = express.Router();

const {
  sendMessage,
  getMessages,
  markSeen,
} = require("../controllers/message.controller");

router.post("/", sendMessage);
router.get("/:conversationId", getMessages);
router.put("/seen/:conversationId", markSeen);

module.exports = router;