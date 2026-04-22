import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
dotenv.config();

async function check() {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  try {
    // Attempt to list models to see what's available
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GEMINI_API_KEY}`;
    const resp = await fetch(url);
    const data = await resp.json();
    console.log('Available Models:', data.models?.map(m => m.name));
  } catch (e) {
    console.log('Error listing models:', e.message);
  }
}

check();
