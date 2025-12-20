const { callGemini } = require("../../services/geminiService"); //AGENT - 4
const { cleanJson } = require("../../utils/jsonCleaner");
/**
 * Quiz Generator Agent (AGENT - 4)
 * --------------------------------
 * Input  : Concept hierarchy (JSON)
 * Output : Difficulty-wise quiz questions
 *
 * Design goals:
 *  - Single API call (free-tier safe)
 *  - Clear difficulty separation
 *  - Answer generation handled later
 */

async function generateQuizQuestions(hierarchy) {
  if (!hierarchy || typeof hierarchy !== "object") {
    throw new Error("Invalid hierarchy input for quiz generator");
  }

  const prompt = `
You are an expert educational assessment designer.

TASK:
Generate quiz questions based on the following concept hierarchy.

RULES:
- Return ONLY valid JSON
- NO explanations
- NO answers
- NO markdown
- Questions must be conceptually correct
- Difficulty must be logically assigned

OUTPUT FORMAT:
{
  "easy": [
    {
      "id": "E1",
      "question": "",
      "type": "mcq",
      "options": []
    }
  ],
  "medium": [
    {
      "id": "M1",
      "question": "",
      "type": "short"
    }
  ],
  "hard": [
    {
      "id": "H1",
      "question": "",
      "type": "short"
    }
  ]
}

DIFFICULTY LOGIC:
- Easy   → definitions, basic understanding
- Medium → comparisons, applications
- Hard   → reasoning, trade-offs, deeper insights

CONCEPT HIERARCHY:
${JSON.stringify(hierarchy, null, 2)}
`;

  let rawResponse;
  try {
    rawResponse = await callGemini(prompt);
  } catch (err) {
    console.error("❌ Gemini call failed in quiz generator agent");
    throw err;
  }

  try {
    const cleaned = cleanJson(rawResponse);
    const quiz = JSON.parse(cleaned);
    return quiz;
  } catch (err) {
    console.error("❌ Quiz JSON parse failed:", rawResponse);
    throw new Error("Invalid quiz JSON");
  }
}

module.exports = { generateQuizQuestions };
