const mongoose = require('mongoose');

const IdeaSchema = new mongoose.Schema({
  // THE PITCH
  title: { type: String, required: true },
  problemStatement: { type: String, required: true }, // "Why this matters"
  expectedOutcome: { type: String, required: true }, // "MVP Goal"
  
  // TEAM STRUCTURE (The "Slots")
  rolesNeeded: [{
    roleName: { type: String, required: true }, // e.g., "Frontend (React)"
    isFilled: { type: Boolean, default: false },
    filledBy: { type: String, default: null } // User Name
  }],
  
  // META DATA
  tags: { type: [String] },
  createdBy: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },

  // AI INTELLIGENCE FIELDS
  clarityScore: { type: Number, default: 0 }, // 0-100
  teamRiskAnalysis: { 
    riskLevel: { type: String, default: "High" }, // Low, Medium, High
    reason: { type: String, default: "Team not formed yet." }
  }
});

module.exports = mongoose.model('Idea', IdeaSchema);