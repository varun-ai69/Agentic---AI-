import React, { useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import './App.css';
import TextInput from './components/TextInput';
import ConceptQuiz from './components/ConceptQuiz';
import Scoreboard from './components/Scoreboard';
import LandingPage from './components/LandingPage';
import AboutUs from './components/AboutUs';
import ProcessPreview from './components/ProcessPreview';

function App() {
  const [currentSection, setCurrentSection] = useState('landing'); // 'landing', 'input', 'quiz', 'scoreboard'
  const [quizData, setQuizData] = useState(null);
  const [userAnswers, setUserAnswers] = useState({});
  const [score, setScore] = useState(0);

  const handleTextSubmit = async (text) => {
    try {
      // API call to backend for processing text
      const response = await fetch('YOUR_BACKEND_API/process-text', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: text }),
      });

      const data = await response.json();
      setQuizData(data);
      setCurrentSection('quiz');
    } catch (error) {
      console.error('Error processing text:', error);
      alert('Failed to process text. Please try again.');
    }
  };

  const handleQuizSubmit = (answers) => {
    setUserAnswers(answers);
    
    // Calculate score
    let correctCount = 0;
    quizData.quiz.forEach((question, index) => {
      if (answers[index] === question.correctAnswer) {
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
              <TextInput onSubmit={handleTextSubmit} />
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
