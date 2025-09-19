const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  conversationId: { type: String, required: true },
  role: { type: String, enum: ['user', 'assistant'], required: true },
  text: { type: String, required: true }
}, { timestamps: true });   

module.exports = mongoose.model('Message', messageSchema);
