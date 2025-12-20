/**
 * Text Chunker Agent (AGENT - 1)
 * ------------------
 * Responsibility:
 *  - Split long text into LLM-friendly chunks
 *  - Preserve sentence boundaries
 *  - Avoid cutting words abruptly
 *  - Safe for production usage
 */

function chunkText(
  text,
  options = {
    maxChunkSize: 1500, // kaam karne ke liye paid version 
    overlapSentences: 1
  }
) {
  if (!text || typeof text !== "string") {
    throw new Error("Invalid text input");
  }

  // Normalize text
  const cleanedText = text.replace(/\s+/g, " ").trim();

  // Split into sentences
  const sentences = cleanedText.match(/[^.!?]+[.!?]/g) || [];

  const chunks = [];
  let currentChunk = [];
  let currentLength = 0;

  for (let i = 0; i < sentences.length; i++) {
    const sentence = sentences[i];

    // If adding this sentence exceeds chunk size → finalize chunk
    if (currentLength + sentence.length > options.maxChunkSize) {
      chunks.push(currentChunk.join(" ").trim());

      // Overlap last N sentences
      currentChunk = currentChunk.slice(-options.overlapSentences);
      currentLength = currentChunk.join(" ").length;
    }

    currentChunk.push(sentence);
    currentLength += sentence.length;
  }

  // Push remaining chunk
  if (currentChunk.length > 0) {
    chunks.push(currentChunk.join(" ").trim());
  }

  return chunks;
}

module.exports = { chunkText };