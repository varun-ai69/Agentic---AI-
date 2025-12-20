const { callGemini } = require("../../services/geminiService"); //AGENT - 6 
const { cleanJson } = require("../../utils/jsonCleaner");
/**
 * Answer Generator Agent (AGENT - 6)
 * ---------------------------------
 * Input  : Quiz JSON
 * Output : Answers + explanations mapped by question ID
 *
 * Designed for hidden-answer UX
 * Single API call (free-tier safe)
 */

async function generateAnswers(quiz) {
  if (!quiz || typeof quiz !== "object") {
    throw new Error("Invalid quiz input for answer generator");
  }

  const prompt = `
You are an expert educator.

TASK:
Generate correct answers for the following quiz questions.

RULES:
- Do NOT modify the questions
- Do NOT change question IDs
- Answers must be accurate and concise
- Provide a short explanation for each answer
- Return ONLY valid JSON
- No markdown
- No extra text

OUTPUT FORMAT:
{
  "answers": [
    {
      "id": "E1",
      "answer": "",
      "explanation": ""
    }
  ]
}

QUIZ:
${JSON.stringify(quiz, null, 2)}
`;

  let rawResponse;
  try {
    rawResponse = await callGemini(prompt);
  } catch (err) {
    console.error("❌ Gemini call failed in answer generator agent");
    throw err;
  }

  try {
      const cleaned = cleanJson(rawResponse);
    const parsed = JSON.parse(cleaned);
    return parsed;
  } catch (err) {
    console.error("❌ Answer JSON parse failed:", rawResponse);
    throw new Error("Invalid answer JSON");
  }
}

module.exports = { generateAnswers };
