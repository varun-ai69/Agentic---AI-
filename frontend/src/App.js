import React, { useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import './App.css';
import TextInput from './components/TextInput';
import ConceptQuiz from './components/ConceptQuiz';
import Scoreboard from './components/Scoreboard';
import LandingPage from './components/LandingPage';
import AboutUs from './components/AboutUs';
import ProcessPreview from './components/ProcessPreview';
import { generateQuiz } from './services/api';

function App() {
  const [currentSection, setCurrentSection] = useState('landing'); // 'landing', 'input', 'quiz', 'scoreboard'
  const [quizData, setQuizData] = useState(null);
  const [userAnswers, setUserAnswers] = useState({});
  const [score, setScore] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleTextSubmit = async (text) => {
    // Validate input
    if (!text || text.trim().length < 50) {
      alert('Please enter at least 50 characters of educational text.');
      return;
    }

    setIsProcessing(true);
    
    try {
      console.log('📤 Sending text to backend...', { textLength: text.length });
      
      // Send user input to backend as the first request
      const data = await generateQuiz(text.trim());
      
      console.log('✅ Received response from backend:', data);
      
      // Map backend response to frontend structure
      setQuizData({
        hierarchy: data.hierarchy || [],
        concepts: data.concepts || [],
        quiz: data.quiz || [],
        answers: data.answers || [],
        explanation: data.explanation || {}
      });
      
      setCurrentSection('quiz');
    } catch (error) {
      console.error('❌ Error processing text:', error);
      alert(error.message || 'Failed to process text. Please try again. Make sure the backend is running on http://localhost:3000');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleQuizSubmit = (answers) => {
    setUserAnswers(answers);
    
    // Calculate score
    let correctCount = 0;
    quizData.quiz.forEach((question, index) => {
      // Handle both string and object correct answers
      const correctAnswer = typeof question.correctAnswer === 'string' 
        ? question.correctAnswer 
        : question.correctAnswer || question.correct_answer;
      
      const userAnswer = answers[index];
      
      // Normalize answers for comparison
      const normalizedCorrect = correctAnswer?.trim().toLowerCase() || '';
      const normalizedUser = userAnswer?.trim().toLowerCase() || '';
      
      if (normalizedUser === normalizedCorrect) {
        correctCount++;
      }
    });
    
    setScore(correctCount);
    setCurrentSection('scoreboard');
  };

  const handleRetry = () => {
    setCurrentSection('input');
    setQuizData(null);
    setUserAnswers({});
    setScore(0);
  };

  const handleReviewConcepts = () => {
    setCurrentSection('quiz');
  };

  const handleGetStarted = () => {
    setCurrentSection('input');
  };

  return (
    <div className="App">
      {currentSection === 'landing' && (
        <>
          <LandingPage onGetStarted={handleGetStarted} />
          <ProcessPreview />
          <AboutUs />
        </>
      )}

      {currentSection !== 'landing' && (
        <>
          <header className="app-header">
            <div className="header-content">
              <motion.h1
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                🧠 ConceptForge AI
              </motion.h1>
              <motion.p 
                className="header-subtitle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                AI-Powered Learning & Assessment Platform
              </motion.p>
              <button 
                className="back-home-btn"
                onClick={() => setCurrentSection('landing')}
              >
                ← Back to Home
              </button>
            </div>
          </header>

          <main className="app-main">
            {currentSection === 'input' && (
              <TextInput onSubmit={handleTextSubmit} isLoading={isProcessing} />
            )}

            {currentSection === 'quiz' && quizData && (
              <ConceptQuiz 
                concepts={quizData.concepts} 
                quiz={quizData.quiz}
                onSubmit={handleQuizSubmit}
              />
            )}

            {currentSection === 'scoreboard' && (
              <Scoreboard 
                score={score}
                totalQuestions={quizData.quiz.length}
                quiz={quizData.quiz}
                userAnswers={userAnswers}
                onRetry={handleRetry}
                onReviewConcepts={handleReviewConcepts}
              />
            )}
          </main>
        </>
      )}
    </div>
  );
}

export default App;
