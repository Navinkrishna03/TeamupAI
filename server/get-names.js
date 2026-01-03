require('dotenv').config();

const API_KEY = process.env.GEMINI_API_KEY;
const URL = `https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`;

async function listMyModels() {
  console.log("📡 Connecting to Google Servers to fetch model names...");
  
  try {
    const response = await fetch(URL);
    const data = await response.json();

    if (data.error) {
      console.error("❌ API Key Error:", data.error.message);
      return;
    }

    if (!data.models) {
      console.log("⚠️ No models found. This is strange.");
      return;
    }

    console.log("\n✅ SUCCESS! Here are the EXACT names you can use:");
    console.log("------------------------------------------------");
    
    // Filter for "generateContent" models (the ones we need for chat/matching)
    const chatModels = data.models.filter(m => m.supportedGenerationMethods.includes("generateContent"));
    
    chatModels.forEach(model => {
      // We strip the "models/" prefix to show you the clean name
      console.log(`Model: ${model.name.replace("models/", "")}`);
    });

    console.log("------------------------------------------------");
    console.log("👉 Copy one of the names above into your index.js file.");

  } catch (error) {
    console.error("Network Error:", error);
  }
}

listMyModels();