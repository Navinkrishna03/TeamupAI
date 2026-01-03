require('dotenv').config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

async function checkModels() {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  try {
    console.log("🔑 Checking your API Key...");
    // 1. Just try to get the model
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    // 2. Try a simple "Hello"
    const result = await model.generateContent("Hello!");
    console.log("✅ SUCCESS! 'gemini-1.5-flash' is working.");
    console.log("Response:", result.response.text());
    
  } catch (error) {
    console.error("❌ 'gemini-1.5-flash' Failed:", error.message);
    
    // If that fails, let's try gemini-pro
    try {
        console.log("🔄 Trying 'gemini-pro' instead...");
        const model2 = genAI.getGenerativeModel({ model: "gemini-pro" });
        const result2 = await model2.generateContent("Hello!");
        console.log("✅ SUCCESS! 'gemini-pro' is working.");
    } catch (err2) {
        console.error("❌ 'gemini-pro' ALSO Failed:", err2.message);
        console.log("\n⚠️ DIAGNOSIS: If both failed with 404, your API Key might be invalid or your internet is blocking the connection.");
    }
  }
}

checkModels();