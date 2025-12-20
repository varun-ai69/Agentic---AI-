const { GoogleGenerativeAI } = require("@google/generative-ai");

/**
 * Gemini Service
 * 
 * IMPORTANT: Make sure you have a .env file in the backend folder with:
 * GEMINI_API_KEY=your_actual_api_key_here
 * 
 * Get your API key from: https://makersuite.google.com/app/apikey
 */

// Get API key dynamically to ensure dotenv has loaded
function getApiKey() {
  const apiKey = process.env.GEMINI_API_KEY;
  
  if (!apiKey) {
    console.warn("⚠️ WARNING: GEMINI_API_KEY not found in environment variables!");
    console.warn("⚠️ Make sure you have created a .env file in the backend folder with:");
    console.warn("⚠️ GEMINI_API_KEY=your_actual_api_key_here");
  }
  
  return apiKey;
}

// Initialize client lazily to ensure API key is available
function getClient() {
  const apiKey = getApiKey();
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured. Please add it to backend/.env file");
  }
  return new GoogleGenerativeAI(apiKey);
}

const SYSTEM_PROMPT = `
You are an expert educational assistant.
Follow instructions strictly.
Return ONLY the output requested.
Do NOT add explanations unless explicitly asked.
If JSON is requested, return valid JSON only.
`;

/**
 * Generic Gemini call
 * All agents will use this
 */
async function callGemini(userPrompt) {
  try {
    // Get API key and client dynamically
    const apiKey = getApiKey();
    
    // Validate API key
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not configured. Please add it to backend/.env file");
    }
    
    if (apiKey.trim() === '' || apiKey === 'your_api_key_here' || apiKey === 'your_actual_api_key_here') {
      throw new Error("GEMINI_API_KEY is set to a placeholder value. Please replace it with your actual API key in backend/.env file");
    }
    
    // Basic validation - Gemini API keys typically start with "AI" or are longer strings
    if (apiKey.length < 20) {
      console.warn("⚠️ WARNING: API key seems too short. Please verify your GEMINI_API_KEY is correct.");
    }

    const client = getClient();

    // Use gemini-pro as default (most stable and widely available)
    // Can be overridden with GEMINI_MODEL environment variable
    // Alternative models: "gemini-1.5-pro", "gemini-1.5-flash" (if available in your region)
    const modelName = process.env.GEMINI_MODEL || "gemini-pro";
    const model = client.getGenerativeModel({
      model: modelName
    });

    // Combine system + user prompt (Gemini style)
    const finalPrompt = `${SYSTEM_PROMPT}\n\n${userPrompt}`;

    const result = await model.generateContent(finalPrompt);
    const response = await result.response;

    return response.text();

  } catch (error) {
    console.error("❌ Gemini API Error:", error.message);
    throw error;
  }
}

module.exports = { callGemini };
