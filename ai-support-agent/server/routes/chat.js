const express = require("express");
const { v4: uuidv4 } = require("uuid");
const authMiddleware = require("../middleware/authMiddleware");
const Chat = require("../models/Chat");
const { sendToOpenRouter } = require("../utils/ai");

const router = express.Router();

// POST /api/chat/send
router.post("/send", authMiddleware, async (req, res) => {
  try {
    const userId = (req.user && req.user.id) || req.userId;
    if (!userId) return res.status(401).json({ message: "Unauthorized: missing user id" });

    const { message, conversationId } = req.body;
    if (!message || typeof message !== "string" || message.trim().length === 0) {
      return res.status(400).json({ message: "Message is required" });
    }

    const convoId = conversationId || uuidv4();

    // Send to AI service
    const reply = await sendToOpenRouter(message);

    // Save in the DB
    let chat = await Chat.findOne({ userId, conversationId: convoId });
    if (!chat) {
      chat = new Chat({ userId, conversationId: convoId, messages: [] });
    }

    chat.messages.push({ role: "user", content: message });
    chat.messages.push({ role: "assistant", content: reply });

    await chat.save();

    return res.json({ conversationId: convoId, reply });
  } catch (err) {
    console.error(" Chat send error:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
});

// GET /api/chat/history → summary of chats
router.get("/history", authMiddleware, async (req, res) => {
  try {
    const userId = (req.user && req.user.id) || req.userId;
    if (!userId) return res.status(401).json({ message: "Unauthorized: missing user id" });

    const chats = await Chat.find({ userId }).sort({ updatedAt: -1 });

    const summary = chats.map((chat) => ({
      conversationId: chat.conversationId,
      lastMessage: chat.messages.length > 0 ? chat.messages[chat.messages.length - 1].content : "",
      updatedAt: chat.updatedAt,
    }));

    return res.json(summary);
  } catch (err) {
    console.error(" Chat history error:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
});

// GET /api/chat/history/:conversationId → full messages
router.get("/history/:conversationId", authMiddleware, async (req, res) => {
  try {
    const userId = (req.user && req.user.id) || req.userId;
    if (!userId) return res.status(401).json({ message: "Unauthorized: missing user id" });

    const { conversationId } = req.params;
    if (!conversationId) return res.status(400).json({ message: "conversationId required" });

    const chat = await Chat.findOne({ userId, conversationId });
    if (!chat) return res.json([]);

    return res.json(chat.messages);
  } catch (err) {
    console.error(" Chat history by ID error:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
});

// DELETE /api/chat/:conversationId → delete one conversation
router.delete("/:conversationId", authMiddleware, async (req, res) => {
  try {
    const userId = (req.user && req.user.id) || req.userId;
    if (!userId) return res.status(401).json({ message: "Unauthorized: missing user id" });

    const { conversationId } = req.params;

    
    const chat = await Chat.findOneAndDelete({ userId, conversationId });

    if (!chat) {
      return res.status(404).json({ message: "Conversation not found" });
    }

    return res.json({ message: "Conversation deleted" });
  } catch (err) {
    console.error(" Delete conversation error:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;
