import React from 'react';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import './ProcessPreview.css';

function ProcessPreview() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.3 });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3
      }
    }
  };

  const stepVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  return (
    <section className="process-preview" ref={ref}>
      <motion.div
        className="process-container"
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        variants={containerVariants}
      >
        <motion.h2
          className="process-title"
          initial={{ opacity: 0, y: -30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: -30 }}
          transition={{ duration: 0.6 }}
        >
          How It Works
        </motion.h2>

        <div className="process-steps">
          {/* Step 1: Input */}
          <motion.div className="process-step" variants={stepVariants}>
            <div className="step-number">1</div>
            <div className="step-content">
              <h3>📝 Input Your Text</h3>
              <p>Paste any educational content - articles, notes, textbooks</p>
              <motion.div
                className="step-preview input-preview"
                whileHover={{ scale: 1.05 }}
              >
                <div className="preview-textarea">
                  <div className="preview-line"></div>
                  <div className="preview-line short"></div>
                  <div className="preview-line"></div>
                  <div className="preview-line medium"></div>
                </div>
              </motion.div>
            </div>
            <motion.div
              className="step-arrow"
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
              transition={{ delay: 0.5 }}
            >
              →
            </motion.div>
          </motion.div>

          {/* Step 2: AI Processing */}
          <motion.div className="process-step" variants={stepVariants}>
            <div className="step-number">2</div>
            <div className="step-content">
              <h3>🤖 AI Extracts Concepts</h3>
              <p>Hierarchical organization & key point identification</p>
              <motion.div
                className="step-preview ai-preview"
                whileHover={{ scale: 1.05 }}
              >
                <motion.div
                  className="ai-brain"
                  animate={{
                    rotate: [0, 360],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                >
                  🧠
                </motion.div>
                <div className="processing-dots">
                  <motion.span
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1.5, repeat: Infinity, delay: 0 }}
                  >●</motion.span>
                  <motion.span
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
                  >●</motion.span>
                  <motion.span
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1.5, repeat: Infinity, delay: 1 }}
                  >●</motion.span>
                </div>
              </motion.div>
            </div>
            <motion.div
              className="step-arrow"
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
              transition={{ delay: 0.8 }}
            >
              →
            </motion.div>
          </motion.div>

          {/* Step 3: Concepts Display */}
          <motion.div className="process-step" variants={stepVariants}>
            <div className="step-number">3</div>
            <div className="step-content">
              <h3>📖 Review Concepts</h3>
              <p>Structured learning material with hierarchies</p>
              <motion.div
                className="step-preview concepts-preview"
                whileHover={{ scale: 1.05 }}
              >
                <div className="concept-card-preview">
                  <div className="concept-title-bar"></div>
                  <div className="concept-content-bar"></div>
                  <div className="concept-content-bar short"></div>
                </div>
                <div className="concept-card-preview small">
                  <div className="concept-title-bar"></div>
                  <div className="concept-content-bar"></div>
                </div>
              </motion.div>
            </div>
            <motion.div
              className="step-arrow"
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
              transition={{ delay: 1.1 }}
            >
              →
            </motion.div>
          </motion.div>

          {/* Step 4: Quiz */}
          <motion.div className="process-step" variants={stepVariants}>
            <div className="step-number">4</div>
            <div className="step-content">
              <h3>✍️ Take the Quiz</h3>
              <p>10 questions ranked by difficulty</p>
              <motion.div
                className="step-preview quiz-preview"
                whileHover={{ scale: 1.05 }}
              >
                <div className="quiz-question-preview">
                  <div className="question-bar"></div>
                  <div className="options-preview">
                    <div className="option-bar"></div>
                    <div className="option-bar"></div>
                    <div className="option-bar selected"></div>
                    <div className="option-bar"></div>
                  </div>
                </div>
              </motion.div>
            </div>
            <motion.div
              className="step-arrow"
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
              transition={{ delay: 1.4 }}
            >
              →
            </motion.div>
          </motion.div>

          {/* Step 5: Results */}
          <motion.div className="process-step" variants={stepVariants}>
            <div className="step-number">5</div>
            <div className="step-content">
              <h3>📊 Get Results</h3>
              <p>Detailed feedback & explanations</p>
              <motion.div
                className="step-preview results-preview"
                whileHover={{ scale: 1.05 }}
              >
                <motion.div
                  className="score-circle-preview"
                  animate={{
                    rotate: [0, 360]
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                >
                  <span>85%</span>
                </motion.div>
                <div className="stats-preview">
                  <div className="stat-bar correct"></div>
                  <div className="stat-bar incorrect"></div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}

export default ProcessPreview;
