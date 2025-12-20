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

    // Check if GEMINI_API_KEY is set
    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your_api_key_here') {
      return res.status(400).json({ 
        error: "GEMINI_API_KEY is not configured. Please set it in backend/.env file" 
      });
    }

    console.log("📝 Processing text...");
    
    // AGENT - 1 : CHUNK GENERATOR
    console.log("Stage 1: Chunking text...");
    const chunks = chunkText(text);
    console.log(`✅ Created ${chunks.length} chunks`);

    // AGENT - 2 : CONCEPT EXTRACTOR
    console.log("Stage 2: Extracting concepts...");
    const concepts = await extractConcepts(chunks);
    console.log(`✅ Extracted ${concepts.length} concepts`);

    // Validate concepts were extracted successfully
    if (!concepts || concepts.length === 0) {
      return res.status(500).json({ 
        error: "Failed to extract concepts from the text. This could be due to:\n" +
               "1. Invalid or expired GEMINI_API_KEY\n" +
               "2. API model not available in your region\n" +
               "3. Text content too short or not educational\n" +
               "Please check your API key and try again with a longer educational text."
      });
    }

    //AGENT - 3 : hierarchy generator
    console.log("Stage 3: Building hierarchy...");
    const hierarchy = await buildHierarchy(concepts);
    console.log(`✅ Hierarchy built`);

    //AGENTIC - LOOP 
    let quiz = null;
    let validation = null;
    let attempts = 0;
    const MAX_ATTEMPTS = 3; //Prevent infinte loop

    console.log("Stage 4: Generating quiz questions...");
    do {
     quiz = await generateQuizQuestions(hierarchy); //AGENT - 4 Quiz Generator
      validation = await validateQuiz(quiz); //AGENT - 5 VALIDATOR 
      attempts++
      console.log(`Attempt ${attempts}: Quiz validation:`, validation);

    } while (!validation.isValid && attempts < MAX_ATTEMPTS);

    if (!quiz) {
      return res.status(500).json({ error: "Failed to generate valid quiz after maximum attempts" });
    }

    //AGENT - 6 ANSWER GENERATOR
    console.log("Stage 5: Generating answers...");
    const answers = await generateAnswers(quiz);
    console.log(`✅ Generated ${answers.length} answers`);

    //AGENT - 7 EXPERT EXPLANATION
    console.log("Stage 6: Generating expert explanation...");
    const explanation = await generateExpertExplanation({
      hierarchy,
      concepts,
      quiz
    });
    console.log(`✅ Expert explanation generated`);

    // Transform concepts array into frontend-expected format
    // Frontend expects: [{ title, explanation, level?, subConcepts? }]
    const formattedConcepts = concepts.map((concept, index) => {
      // Try to find explanation from expert explanation
      const conceptExplanation = explanation?.concept_explanations?.find(
        ce => ce.concept && ce.concept.toLowerCase().includes(concept.toLowerCase())
      );
      
      // Determine level from hierarchy (simplified - can be enhanced)
      let level = 1;
      if (hierarchy?.children) {
        const findLevel = (node, targetConcept, currentLevel = 1) => {
          if (node.name && node.name.toLowerCase().includes(targetConcept.toLowerCase())) {
            return currentLevel;
          }
          if (node.children && Array.isArray(node.children)) {
            for (const child of node.children) {
              const found = findLevel(child, targetConcept, currentLevel + 1);
              if (found) return found;
            }
          }
          return null;
        };
        const foundLevel = findLevel(hierarchy, concept);
        if (foundLevel) level = foundLevel;
      }

      return {
        title: concept,
        explanation: conceptExplanation?.explanation || `Key concept: ${concept}`,
        level: level,
        subConcepts: [] // Can be populated from hierarchy if needed
      };
    });

    // Transform quiz from { easy: [], medium: [], hard: [] } to flat array
    // and merge with answers
    const answerMap = {};
    if (answers?.answers && Array.isArray(answers.answers)) {
      answers.answers.forEach(ans => {
        answerMap[ans.id] = ans;
      });
    }

    const formattedQuiz = [];
    const difficulties = ['easy', 'medium', 'hard'];
    
    difficulties.forEach(difficulty => {
      if (quiz[difficulty] && Array.isArray(quiz[difficulty])) {
        quiz[difficulty].forEach(question => {
          const answer = answerMap[question.id];
          formattedQuiz.push({
            id: question.id,
            question: question.question,
            options: question.options || [],
            difficulty: difficulty,
            correctAnswer: answer?.answer || '',
            explanation: answer?.explanation || ''
          });
        });
      }
    });

    return res.json({
      message: "Learning package generated successfully",
      hierarchy,
      concepts: formattedConcepts,
      quiz: formattedQuiz,
      answers,
      explanation
    });

  } catch (error) {
    console.error("❌ Controller Error:", error.message);
    console.error("Full error:", error);
    res.status(500).json({ error: error.message || "Internal Server Error" });
  }
}

module.exports = { generateQuiz };
