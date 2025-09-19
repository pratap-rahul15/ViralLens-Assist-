const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema(
  { 
    role: { type: String, enum: ["user", "assistant"], required: true },
    content: { type: String, required: true },
  },
  { timestamps: true }
);

const ChatSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    conversationId: { type: String, required: true },
    messages: [MessageSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Chat", ChatSchema);
