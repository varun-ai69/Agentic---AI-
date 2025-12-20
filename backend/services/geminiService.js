const { GoogleGenerativeAI } = require("@google/generative-ai");

const client = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

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
    const model = client.getGenerativeModel({
      model: "gemini-3-flash-preview"
    });

    // Combine system + user prompt (Gemini style)
    const finalPrompt = `${SYSTEM_PROMPT}\n\n${userPrompt}`;

    const result = await model.generateContent(finalPrompt);
    const response = await result.response;

    return response.text();

  } catch (error) {
    console.error("❌ Gemini API Error:", error);
    throw error;
  }
}

module.exports = { callGemini };
