const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function findWorkingModel() {
  console.log("🔑 Testing your API Key with different models...\n");

  // These are the 3 most common model names. We will try them one by one.
  const candidates = ["gemini-1.5-flash", "gemini-pro", "gemini-1.0-pro"];

  for (const modelName of candidates) {
    process.stdout.write(`👉 Trying model: "${modelName}"... `);
    try {
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent("Hello, are you there?");
      console.log("✅ SUCCESS! It worked!");
      console.log(`\n🎉 SOLUTION: Go to index.js and change the model name to: "${modelName}"`);
      return; // Stop the script, we found the winner
    } catch (error) {
      console.log("❌ Failed (404 Not Found)");
    }
  }
  
  console.log("\n⚠️ ALL FAILED. This means your API Key might be invalid or the API is not enabled in your Google Cloud Console.");
}

findWorkingModel();