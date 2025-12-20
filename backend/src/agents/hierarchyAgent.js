const { callGemini } = require("../../services/geminiService"); // AGENT - 3
const { cleanJson } = require("../../utils/jsonCleaner");
/**
 * Hierarchy Builder Agent (AGENT - 3)
 * ----------------------------------
 * Input  : Flat list of concepts
 * Output : Hierarchical tree structure (JSON)
 *
 * Design goals:
 *  - Single API call (free-tier safe)
 *  - Strict JSON output
 *  - Visualization ready
 */

async function buildHierarchy(concepts) {
  if (!Array.isArray(concepts) || concepts.length === 0) {
    throw new Error("Invalid concepts input for hierarchy agent");
  }

  const prompt = `
You are an expert educator and curriculum designer.

TASK:
Organize the following concepts into a clear hierarchical structure.

RULES:
- Return ONLY valid JSON
- Use this exact structure:
{
  "root": "Main Topic",
  "children": [
    {
      "name": "Sub Topic",
      "children": []
    }
  ]
}
- Choose the most general concept as root
- Each child must logically belong to its parent
- No explanations
- No markdown
- No extra text

CONCEPT LIST:
${concepts.map(c => `- ${c}`).join("\n")}
`;

  let rawResponse;
  try {
    rawResponse = await callGemini(prompt);
  } catch (err) {
    console.error("❌ Gemini call failed in hierarchy agent");
    throw err;
  }

  try {
    const cleaned = cleanJson(rawResponse);
    const hierarchy = JSON.parse(cleaned);
    return hierarchy;
  } catch (err) {
    console.error("❌ Hierarchy JSON parse failed:", rawResponse);
    throw new Error("Invalid hierarchy JSON");
  }
}

module.exports = { buildHierarchy };
