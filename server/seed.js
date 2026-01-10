const mongoose = require('mongoose');
require('dotenv').config();

// IMPORT MODELS (Adjust paths if needed)
const User = require('./models/User');
const Idea = require('./models/Idea');
const Application = require('./models/Application');

// DATABASE CONNECTION
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected for Seeding"))
  .catch(err => console.error("❌ DB Error:", err));

const seedDB = async () => {
  try {
    console.log("🧹 Clearing old data...");
    await User.deleteMany({});
    await Idea.deleteMany({});
    await Application.deleteMany({});

    console.log("🌱 Seeding The 'Perfect Demo' Scenario...");

    // 1. CREATE USERS
    // Sarah (The Presenter/Founder)
    const sarah = await new User({
      name: "Sarah Jenkins",
      email: "sarah@demo.com",
      password: "123", // Simple password for demo
      primaryRole: "Frontend Developer",
      availabilityHours: 25,
      skills: ["React", "Figma", "CSS"]
    }).save();

    // The "Problem" Teammates (They cause High Risk)
    const alex = await new User({
      name: "Alex Designer",
      email: "alex@test.com",
      primaryRole: "Designer",
      availabilityHours: 10,
      skills: ["Figma", "Photoshop"]
    }).save();

    const sam = await new User({
      name: "Sam Researcher",
      email: "sam@test.com",
      primaryRole: "Product Manager",
      availabilityHours: 5,
      skills: ["Research", "User Testing"]
    }).save();

    // The "Savior" (Mike - Backend Dev)
    const mike = await new User({
      name: "Mike Builder",
      email: "mike@test.com",
      primaryRole: "Backend Developer",
      availabilityHours: 30,
      skills: ["Node.js", "MongoDB", "Python"]
    }).save();

    console.log("✅ Users Created: Sarah, Alex, Sam, Mike");

    // 2. CREATE THE IDEA (High Clarity Score)
    const idea = await new Idea({
      title: "AI Study Buddy",
      problemStatement: "Students struggle to organize lecture notes into study guides. Current tools are manual and slow.",
      expectedOutcome: "A React-based web app that uses Gemini API to turn PDF notes into quizzes automatically.",
      rolesNeeded: [
        { roleName: "Frontend Developer" },
        { roleName: "Backend Developer" }, // This is the missing piece!
        { roleName: "Designer" }
      ],
      createdBy: sarah.name,
      clarityScore: 92, // High clarity to show that Idea isn't the problem
      tags: ["Education", "AI", "Student Tool"]
    }).save();

    console.log("✅ Idea Created: AI Study Buddy");

    // 3. CREATE APPLICATIONS (The Setup)
    
    // Accepted Members (Creating the HIGH RISK Scenario)
    // Sarah (Owner) is implied.
    // Alex (Designer) -> Accepted
    await new Application({
      ideaId: idea._id,
      userId: alex._id,
      userName: alex.name,
      applyingForRole: "Designer",
      message: "I can make the UI look great!",
      status: "accepted"
    }).save();

    // Sam (PM) -> Accepted
    await new Application({
      ideaId: idea._id,
      userId: sam._id,
      userName: sam.name,
      applyingForRole: "Product Manager", // Mismatch! We needed a Backend Dev
      message: "I'll handle the roadmap.",
      status: "accepted"
    }).save();

    // PENDING Application (The "Fix")
    // Mike (Backend) -> Pending (Waiting for Sarah to accept during demo)
    await new Application({
      ideaId: idea._id,
      userId: mike._id,
      userName: mike.name,
      applyingForRole: "Backend Developer",
      message: "I have 3 years of Node.js experience. I can build the API.",
      status: "pending" // IMPORTANT: Pending so you can click "Accept" live
    }).save();

    console.log("✅ Applications Created: 2 Accepted (Risk), 1 Pending (Fix)");

    // 4. PRE-CALCULATE HIGH RISK REPORT (For the initial "Wow")
    // We inject a "High Risk" report so the first view is instant
    idea.teamRiskAnalysis = {
      riskLevel: "High",
      reason: "Critical Gap: No Backend Developer found. Frontend and Design roles are filled, but without a Backend Developer, the 'Gemini API' feature cannot be implemented.",
      similarTeams: 87,
      failureRate: "78%",
      commonPitfall: "Missing Backend Developer",
      successProjection: "12% chance of submission"
    };
    await idea.save();

    console.log("✅ High Risk Report Cached");
    console.log("🎉 SEED COMPLETE! Log in with: sarah@demo.com");
    process.exit();

  } catch (error) {
    console.error("Seed Failed:", error);
    process.exit(1);
  }
};

seedDB();