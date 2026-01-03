const mongoose = require('mongoose');

const ApplicationSchema = new mongoose.Schema({
  ideaId: { type: mongoose.Schema.Types.ObjectId, ref: 'Idea', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  userName: { type: String, required: true },
  
  applyingForRole: { type: String, required: true }, // Which slot they want
  message: { type: String }, // "Why me?"
  status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' }
});

module.exports = mongoose.model('Application', ApplicationSchema);