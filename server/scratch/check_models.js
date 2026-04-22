import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
dotenv.config();

async function listModels() {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  try {
    // There isn't a direct listModels in the SDK easily available without a lot of setup,
    // but we can try a simple generation with a few different names.
    const models = ['gemini-1.5-flash', 'gemini-1.5-flash-latest', 'gemini-pro', 'gemini-1.5-pro'];
    for (const m of models) {
      try {
        const model = genAI.getGenerativeModel({ model: m });
        const result = await model.generateContent('ping');
        console.log(`✅ Model ${m} works!`);
        process.exit(0);
      } catch (e) {
        console.log(`❌ Model ${m} failed: ${e.message}`);
      }
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

listModels();
