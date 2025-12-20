//uncleand json ko clean json mai 
function cleanJson(text) {
  if (!text || typeof text !== "string") {
    return text;
  }

  return text
    .replace(/```json/gi, "")
    .replace(/```/g, "")
    .trim();
}

module.exports = { cleanJson };
