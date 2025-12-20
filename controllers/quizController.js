const { chunkText } = require("../services/textChunker"); //Agent - 1
const { extractConcepts } = require("../src/agents/conceptAgent"); //Agent - 2
const { buildHierarchy } = require("../src/agents/hierarchyAgent"); //Agent - 3
const { generateQuizQuestions } = require("../src/agents/quizGeneratorAgent"); //Agent - 4
const { validateQuiz } = require("../src/agents/ValidatorAgent"); //Agent - 5
const { generateAnswers } = require("../src/agents/answerGeneratorAgent"); //Agent - 6
const { generateExpertExplanation } = require("../src/agents/expertExplanationAgent"); //Agent - 7

async function generateQuiz(req, res) {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ error: "Text is required" });
    }

   
    // AGENT - 1 : CHUNK GENERATOR

    const chunks = chunkText(text);

    // AGENT - 2 : CONCEPT EXTRACTOR
    
    const concepts = await extractConcepts(chunks);

    //AGENT - 3 : hierarchy generator
    const hierarchy = await buildHierarchy(concepts);

    //AGENTIC - LOOP 
    let quiz = null;
    let validation = null;
    let attempts = 0;
    const MAX_ATTEMPTS = 3; //Prevent infinte loop

    do {
    
     quiz = await generateQuizQuestions(hierarchy); //AGENT - 4 Quiz Generator
      validation = await validateQuiz(quiz); //AGENT - 5 VALIDATOR 
      attempts++
      console.log("Quiz validation:", validation);

    } while (!validation.isValid && attempts < MAX_ATTEMPTS);

    //AGENT - 6 ANSWER GENERATOR
    const answers = await generateAnswers(quiz);

    //AGENT - 7 EXPERT EXPLANATION
    const explanation = await generateExpertExplanation({
  hierarchy,
  concepts,
  quiz
});




 return res.json({
  message: "Learning package generated successfully",
  hierarchy,
  quiz,
  answers,
  explanation
});


  } catch (error) {
    console.error("❌ Controller Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

module.exports = { generateQuiz };
