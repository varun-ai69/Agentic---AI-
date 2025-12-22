import React from 'react';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faUserPlus } from '@fortawesome/free-solid-svg-icons';
import './LandingPage.css';
import BlurText from './BlurText';

function LandingPage({ onGetStarted, onLoginClick, onRegisterClick }) {
  const handleLoop = (loopCount) => {
    console.log(`Animation loop ${loopCount} completed`);
  };

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
              <BlurText
                text="LearnForge AI"
                delay={100}  // Slightly slower than before
                animateBy="letters"  // Changed from "words" to "letters"
                direction="top"
                loop={true}
                onLoop={handleLoop}
                className="hero-title-text"
                stepDuration={0.5}  // Slower animation
              />
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
              <div className="feature-tag"><FontAwesomeIcon icon="fa-solid fa-book" style={{marginRight: '6px'}} /> Smart Extraction</div>
              <div className="feature-tag"><FontAwesomeIcon icon="fa-solid fa-bullseye" style={{marginRight: '6px'}} /> Auto Quiz Generation</div>
              <div className="feature-tag"><FontAwesomeIcon icon="fa-solid fa-chart-bar" style={{marginRight: '6px'}} /> Instant Feedback</div>
            </motion.div>

            <motion.button
              className="cta-button"
              onClick={onGetStarted}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              whileHover={{ scale: 1.05, boxShadow: "0 15px 40px rgba(122, 162, 247, 0.35)" }}
              whileTap={{ scale: 0.95 }}
            >
              Get Started →
            </motion.button>

            <motion.div
              className="auth-buttons-group"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.6 }}
            >
              <button className="auth-btn login-btn" onClick={onLoginClick}>
                <FontAwesomeIcon icon={faUser} style={{marginRight: '6px'}} />
                Login
              </button>
              <button className="auth-btn register-btn" onClick={onRegisterClick}>
                <FontAwesomeIcon icon={faUserPlus} style={{marginRight: '6px'}} />
                Register
              </button>
            </motion.div>
          </motion.div>

          <motion.div
            className="hero-visual"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            <div className="floating-card card-1">
              <span className="card-icon"><FontAwesomeIcon icon="fa-solid fa-book" size="2x" /></span>
              <p>Educational Text</p>
            </div>
            <div className="floating-card card-2">
              <span className="card-icon"><FontAwesomeIcon icon="fa-solid fa-robot" size="2x" /></span>
              <p>AI Processing</p>
            </div>
            <div className="floating-card card-3">
              <span className="card-icon"><FontAwesomeIcon icon="fa-solid fa-wand-magic-sparkles" size="2x" /></span>
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
