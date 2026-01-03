const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Import Models
const User = require('./models/User');
const Idea = require('./models/Idea');
const Application = require('./models/Application');

// --- USAGE TRACKING ---
const UsageSchema = new mongoose.Schema({
  date: { type: String, default: () => new Date().toISOString().split('T')[0] },
  apiCalls: { type: Number, default: 0 }
});
const Usage = mongoose.model('Usage', UsageSchema);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// --- DB CONNECTION ---
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.error("❌ MongoDB Error:", err));

// --- GEMINI SETUP ---
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

const checkAndTrackUsage = async () => {
  const today = new Date().toISOString().split('T')[0];
  let usage = await Usage.findOne({ date: today });
  if (!usage) { usage = new Usage({ date: today }); await usage.save(); }
  if (usage.apiCalls >= 60) throw new Error("DAILY_QUOTA_REACHED");
  usage.apiCalls += 1;
  await usage.save();
};

// ==========================================
// 🚀 ROUTES
// ==========================================

// 1. REGISTER / LOGIN (User & Admin)
app.post('/api/register', async (req, res) => {
  try {
    const { email, password, name, skills } = req.body;

    // --- ADMIN LOGIN CHECK ---
    if (email === 'admin@teamup.ai') {
      if (password === 'admin@123') {
        // Find or create admin user dummy entry
        let adminUser = await User.findOne({ email });
        if (!adminUser) {
            adminUser = new User({ name: 'Administrator', email, skills: ['Admin'] });
            await adminUser.save();
        }
        return res.status(200).json({ message: "Welcome Back, Admin.", user: adminUser, isAdmin: true });
      } else {
        return res.status(401).json({ error: "Invalid Admin Password." });
      }
    }

    // --- NORMAL USER REGISTRATION ---
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already exists." });
    }
    const newUser = new User(req.body);
    await newUser.save();
    res.status(201).json({ message: "Profile Created", user: newUser });
  } catch (error) { res.status(500).json({ error: "Error processing request" }); }
});

// 2. POST IDEA
app.post('/api/ideas', async (req, res) => {
  try {
    await checkAndTrackUsage();
    const { title, problemStatement, expectedOutcome, rolesNeeded, createdBy, tags } = req.body;
    
    const prompt = `Analyze idea: ${title}. Rate clarity (0-100) & 1 sentence feedback. JSON: {"score": 80, "feedback": "..."}`;
    const result = await model.generateContent(prompt);
    const aiAnalysis = JSON.parse(result.response.text().replace(/```json/g, "").replace(/```/g, "").trim());

    const newIdea = new Idea({ title, problemStatement, expectedOutcome, rolesNeeded, tags, createdBy, clarityScore: aiAnalysis.score });
    await newIdea.save();
    res.status(201).json({ idea: newIdea, feedback: aiAnalysis.feedback });
  } catch (error) { 
    if(error.message === "DAILY_QUOTA_REACHED") return res.status(429).json({ error: "Daily Limit Reached" });
    res.status(500).json({ error: "Post failed" }); 
  }
});

// 3. GET IDEAS
app.get('/api/ideas', async (req, res) => {
  try { const ideas = await Idea.find().sort({ createdAt: -1 }); res.json(ideas); }
  catch (error) { res.status(500).json({ error: "Fetch failed" }); }
});

// 4. APPLY
app.post('/api/apply', async (req, res) => {
  try { const newApp = new Application(req.body); await newApp.save(); res.status(201).json({ message: "Sent!" }); }
  catch (error) { res.status(500).json({ error: "Application failed" }); }
});

// 5. RISK ANALYSIS
app.post('/api/analyze-risk', async (req, res) => {
  try {
    await checkAndTrackUsage();
    const { ideaId } = req.body;
    const idea = await Idea.findById(ideaId);
    const prompt = `Analyze risk for "${idea.title}". JSON: {"riskLevel": "HIGH", "reason": "Reason"}`;
    const result = await model.generateContent(prompt);
    const riskAnalysis = JSON.parse(result.response.text().replace(/```json/g, "").replace(/```/g, "").trim());
    
    idea.teamRiskAnalysis = riskAnalysis;
    await idea.save();
    res.json(riskAnalysis);
  } catch (error) { res.status(500).json({ error: "Risk analysis failed" }); }
});

// --- ADMIN ROUTES ---

// 6. GET ALL DATA
app.get('/api/admin/data', async (req, res) => {
  try {
    const users = await User.find();
    const ideas = await Idea.find();
    res.json({ users, ideas });
  } catch (error) { res.status(500).json({ error: "Fetch failed" }); }
});

// 7. GET STATS
app.get('/api/admin/stats', async (req, res) => {
  try {
    const userCount = await User.countDocuments();
    const ideaCount = await Idea.countDocuments();
    const today = new Date().toISOString().split('T')[0];
    const usage = await Usage.findOne({ date: today });
    res.json({ users: userCount, ideas: ideaCount, apiCallsToday: usage ? usage.apiCalls : 0 });
  } catch (error) { res.status(500).json({ error: "Stats failed" }); }
});

// 8. DELETE DATA
app.delete('/api/admin/delete/:type/:id', async (req, res) => {
  try {
    const { type, id } = req.params;
    if (type === 'user') { await User.findByIdAndDelete(id); }
    else if (type === 'idea') { await Idea.findByIdAndDelete(id); }
    res.json({ message: "Deleted successfully" });
  } catch (error) { res.status(500).json({ error: "Delete failed" }); }
});

app.listen(PORT, () => { console.log(`Server running on ${PORT}`); });