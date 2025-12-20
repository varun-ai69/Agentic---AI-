const { callGemini } = require("../../services/geminiService");
const { cleanJson } = require("../../utils/jsonCleaner");

/**
 * Expert Explanation Agent (AGENT - 7)
 * -----------------------------------
 * Explains the topic like a human teacher
 * aligned with hierarchy + quiz questions
 */

async function generateExpertExplanation({ hierarchy, concepts, quiz }) {
  if (!hierarchy || !concepts || !quiz) {
    throw new Error("Missing input for expert explanation agent");
  }

  const prompt = `
You are an expert teacher explaining a topic to a beginner.

GOAL:
Explain the topic in a clear, simple, and structured way.

INPUT CONTEXT:
- Topic hierarchy
- Key concepts
- Quiz questions students will attempt

RULES:
- Explain from basics to advanced
- Use simple language
- Match explanations with quiz topics
- Use real-world analogies where helpful
- No markdown
- No emojis
- No extra commentary
- Return ONLY valid JSON

OUTPUT FORMAT:
{
  "title": "",
  "overview": "",
  "concept_explanations": [
    {
      "concept": "",
      "explanation": ""
    }
  ],
  "quiz_alignment": [
    {
      "question_id": "",
      "related_explanation": ""
    }
  ],
  "final_summary": ""
}

HIERARCHY:
${JSON.stringify(hierarchy, null, 2)}

CONCEPTS:
${JSON.stringify(concepts)}

QUIZ:
${JSON.stringify(quiz, null, 2)}
`;

  let rawResponse;
  try {
    rawResponse = await callGemini(prompt);
  } catch (err) {
    console.error("❌ Gemini call failed in expert explanation agent");
    throw err;
  }

  try {
    const cleaned = cleanJson(rawResponse);
    return JSON.parse(cleaned);
  } catch (err) {
    console.error("❌ Expert explanation JSON parse failed:", rawResponse);
    throw new Error("Invalid expert explanation JSON");
  }
}

module.exports = { generateExpertExplanation };
