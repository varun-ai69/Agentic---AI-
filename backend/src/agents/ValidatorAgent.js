const { callGemini } = require("../../services/geminiService"); //AGENT - 5
const { cleanJson } = require("../../utils/jsonCleaner");
/**
 * Quiz Validator Agent (AGENT - 5)
 * --------------------------------
 * Input  : Quiz JSON
 * Output : Validation result
 *
 * Decides whether quiz quality is acceptable
 */

async function validateQuiz(quiz) {
  if (!quiz || typeof quiz !== "object") {
    throw new Error("Invalid quiz input for validator");
  }

  const prompt = `
You are an expert educational evaluator.

TASK:
Evaluate the quality and correctness of the quiz below.

VALIDATION CRITERIA:
1. Easy questions → definitions / basics
2. Medium questions → application / comparison
3. Hard questions → reasoning / trade-offs
4. No duplicate questions
5. All questions must relate to the topic
6. Difficulty levels must be logically correct

OUTPUT FORMAT (STRICT JSON ONLY):
{
  "isValid": true,
  "issues": []
}

OR

{
  "isValid": false,
  "issues": ["issue1", "issue2"]
}

QUIZ:
${JSON.stringify(quiz, null, 2)}
`;

  let rawResponse;
  try {
    rawResponse = await callGemini(prompt);
  } catch (err) {
    console.error("❌ Gemini call failed in quiz validator agent");
    throw err;
  }

  try {
    const cleaned = cleanJson(rawResponse);
    const validation = JSON.parse(cleaned);
    return validation;
  } catch (err) {
    console.error("❌ Validation JSON parse failed:", rawResponse);
    throw new Error("Invalid validation JSON");
  }
}

module.exports = { validateQuiz };
