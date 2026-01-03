const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  
  // PRIMARY & SECONDARY ROLES (Ownership)
  primaryRole: { type: String, required: true }, // e.g., "Backend Developer"
  secondaryRole: { type: String }, // e.g., "DevOps"
  
  // SKILLS (Supporting evidence)
  skills: { type: [String], required: true },
  
  // COMMITMENT METRICS (Risk Factors)
  availabilityHours: { type: Number, required: true }, // Hours per day
  canCommitFullDuration: { type: Boolean, default: true },
  
  // TRACKING
  joinedTeams: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Idea' }]
});

module.exports = mongoose.model('User', UserSchema);