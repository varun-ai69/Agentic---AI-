const { callGemini } = require("../../services/geminiService");
const { cleanJson } = require("../../utils/jsonCleaner");


/**
 * Concept Extraction Agent (AGENT - 2)
 * -----------------------
 * Input  : Array of text chunks
 * Output : Clean, unique list of key concepts
 *
 * Design goals:
 *  - Strict JSON output
 *  - Deduplication
 *  - Noise filtering
 *  - Gemini-safe parsing
 */

async function extractConcepts(chunks) {
  if (!Array.isArray(chunks) || chunks.length === 0) {
    throw new Error("Invalid chunks input for concept extraction");
  }

  const conceptSet = new Set();

  for (let i = 0; i < chunks.length; i++) {
    const chunk = chunks[i];

    const prompt = `
Extract the MOST IMPORTANT educational concepts from the text below.

STRICT RULES:
- Return ONLY a valid JSON array of strings
- Each concept must be 1 to 4 words
- Concepts must be general and reusable (not full sentences)
- No explanations
- No numbering
- No markdown
- No extra text

EXAMPLE OUTPUT:
["Machine Learning", "Overfitting", "Regularization"]

TEXT:
"""${chunk}"""
`;

    let rawResponse;
    try {
      rawResponse = await callGemini(prompt);
    } catch (err) {
      console.error(`❌ Gemini call failed on chunk ${i}:`, err.message);
      // If this is the first chunk and it fails, log a more helpful error
      if (i === 0 && chunks.length === 1) {
        console.error("⚠️ This might be due to an invalid model name or API key. Check your GEMINI_API_KEY and model configuration.");
      }
      continue;
    }

    // --- SAFETY PARSING (VERY IMPORTANT) ---
    let parsedConcepts;
    try {
      // Gemini sometimes adds whitespace or newlines
      const cleaned = cleanJson(rawResponse);

      parsedConcepts = JSON.parse(cleaned);

      if (!Array.isArray(parsedConcepts)) {
        throw new Error("Response is not an array");
      }

    } catch (parseError) {
      console.error("❌ Concept JSON parse failed:", rawResponse);
      continue;
    }

    // --- FILTER + NORMALIZE ---
    parsedConcepts.forEach((concept) => {
      if (
        typeof concept === "string" &&
        concept.length > 1 &&
        concept.length < 50
      ) {
        conceptSet.add(concept.trim());
      }
    });
  }

  return Array.from(conceptSet);
}

module.exports = { extractConcepts };
