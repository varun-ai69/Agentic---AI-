import React from 'react';
import { motion } from 'framer-motion';
import './LandingPage.css';

function LandingPage({ onGetStarted }) {
  return (
    <div className="landing-page">
      <div className="hero-section">
        <motion.div
          className="hero-content"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.h1
            className="hero-title"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            🧠 ConceptForge AI
          </motion.h1>
          
          <motion.p
            className="hero-description"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            Transform any educational text into structured knowledge and personalized quizzes
          </motion.p>

          <motion.div
            className="hero-features"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            <div className="feature-tag">📖 Smart Extraction</div>
            <div className="feature-tag">🎯 Auto Quiz Generation</div>
            <div className="feature-tag">📊 Instant Feedback</div>
          </motion.div>

          <motion.button
            className="cta-button"
            onClick={onGetStarted}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            whileHover={{ scale: 1.05, boxShadow: "0 15px 40px rgba(139, 92, 246, 0.6)" }}
            whileTap={{ scale: 0.95 }}
          >
            Get Started →
          </motion.button>
        </motion.div>

        <motion.div
          className="hero-visual"
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
        >
          <div className="floating-card card-1">
            <span className="card-icon">📚</span>
            <p>Educational Text</p>
          </div>
          <div className="floating-card card-2">
            <span className="card-icon">🤖</span>
            <p>AI Processing</p>
          </div>
          <div className="floating-card card-3">
            <span className="card-icon">✨</span>
            <p>Quiz Ready!</p>
          </div>
        </motion.div>
      </div>

      <motion.div
        className="scroll-indicator"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.6 }}
      >
        <span>Scroll to explore</span>
        <motion.div
          className="scroll-arrow"
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        >
          ↓
        </motion.div>
      </motion.div>
    </div>
  );
}

export default LandingPage;
