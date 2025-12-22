import React, { useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import './App.css';
import TextInput from './components/TextInput';
import ConceptQuiz from './components/ConceptQuiz';
import Scoreboard from './components/Scoreboard';
import LandingPage from './components/LandingPage';
import AboutUs from './components/AboutUs';
import ProcessPreview from './components/ProcessPreview';
import Login from './components/Login';
import Register from './components/Register';
import { generateQuiz } from './services/api';
import BlobCursor from './components/Blobcursor';
library.add(fas);

function App() {
  const [currentSection, setCurrentSection] = useState('landing'); // 'landing', 'login', 'register', 'input', 'quiz', 'scoreboard'
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
      console.log('Sending text to backend...', { textLength: text.length });

      // Send user input to backend as the first request
      const data = await generateQuiz(text.trim());

      console.log('Received response from backend:', data);

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
      console.error('Error processing text:', error);
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

  const handleBackToLanding = () => {
    setCurrentSection('landing');
  };

  const handleLoginSuccess = () => {
    setCurrentSection('input');
  };

  const handleRegisterSuccess = () => {
    setCurrentSection('input');
  };

  const handleLoginClick = () => {
    setCurrentSection('login');
  };

  const handleRegisterClick = () => {
    setCurrentSection('register');
  };

  const handleSwitchToLogin = () => {
    setCurrentSection('login');
  };

  const handleSwitchToRegister = () => {
    setCurrentSection('register');
  };

  return (
    <>
      <BlobCursor blobType="circle"
        fillColor="linear-gradient(135deg, #9f2bd4 0%, #7b1fa2 50%, #4a148c 100%)"
        trailCount={3}
        sizes={[45, 90, 35, 60]}
        innerSizes={[18, 38, 22, 28]}
        innerColor="radial-gradient(circle, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.4) 70%)"

        opacities={[0.6, 0.6, 0.6]}
        shadowColor="radial-gradient(circle, rgba(159,43,212,0.9) 0%, rgba(120,31,162,0.6) 70%)"
        shadowBlur={12}
        shadowOffsetX={8}
        shadowOffsetY={8}
        filterStdDeviation={35}
        useFilter={true}
        fastDuration={0.08}
        slowDuration={0.6}
        zIndex={9999} />

      {<div className="App">
        {currentSection === 'landing' && (
          <>
            <LandingPage
              onGetStarted={handleGetStarted}
              onLoginClick={handleLoginClick}
              onRegisterClick={handleRegisterClick}
            />
            <ProcessPreview />
            <AboutUs />
          </>
        )}

        {currentSection === 'login' && (
          <Login
            onLoginSuccess={handleLoginSuccess}
            onSwitchToRegister={handleSwitchToRegister}
            onBackToLanding={handleBackToLanding}
          />
        )}

        {currentSection === 'register' && (
          <Register
            onRegisterSuccess={handleRegisterSuccess}
            onSwitchToLogin={handleSwitchToLogin}
            onBackToLanding={handleBackToLanding}
          />
        )}

        {currentSection !== 'landing' && currentSection !== 'login' && currentSection !== 'register' && (
          <>
            <header className="app-header">
              <div className="header-content">
                <motion.h1
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <FontAwesomeIcon icon="fa-solid fa-brain" style={{ marginRight: '10px' }} /> LearnForge AI
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
                  <FontAwesomeIcon icon="fa-solid fa-arrow-left" style={{ marginRight: '6px' }} />
                  Back to Home
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
      }
    </>
  );
}



export default App;
