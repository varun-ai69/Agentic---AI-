import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import './AboutUs.css';

function AboutUs() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.3 });

  const features = [
    {
      icon: '🎯',
      title: 'Smart Decomposition',
      description: 'AI breaks down complex texts into digestible hierarchical concepts'
    },
    {
      icon: '🔍',
      title: 'Intelligent Ranking',
      description: 'Questions automatically ranked by difficulty for optimal learning'
    },
    {
      icon: '✅',
      title: 'Self-Validation',
      description: 'Built-in logic checks ensure quiz quality and accuracy'
    },
    {
      icon: '📈',
      title: 'Instant Feedback',
      description: 'Detailed explanations help you understand mistakes immediately'
    }
  ];

  return (
    <section className="about-us" ref={ref}>
      <motion.div
        className="about-container"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.8 }}
      >
        <motion.h2
          className="about-title"
          initial={{ opacity: 0, y: -30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: -30 }}
          transition={{ duration: 0.6 }}
        >
          About ConceptForge AI
        </motion.h2>

        <motion.p
          className="about-description"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          ConceptForge AI is an autonomous knowledge extraction and quiz generation platform 
          that transforms educational content into structured learning experiences. Using advanced 
          AI algorithms, we decompose complex texts, organize concepts hierarchically, and create 
          personalized assessments to enhance your learning journey.
        </motion.p>

        <motion.div
          className="features-grid"
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.2
              }
            }
          }}
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="feature-card"
              variants={{
                hidden: { opacity: 0, y: 50 },
                visible: { opacity: 1, y: 0 }
              }}
              whileHover={{ 
                scale: 1.05,
                boxShadow: "0 15px 40px rgba(139, 92, 246, 0.3)"
              }}
              transition={{ duration: 0.3 }}
            >
              <motion.div
                className="feature-icon"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
              >
                {feature.icon}
              </motion.div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          className="mission-section"
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          <h3>Our Mission</h3>
          <p>
            We believe learning should be efficient, personalized, and engaging. ConceptForge AI 
            empowers students, educators, and lifelong learners by automating the creation of 
            structured study materials and assessments, allowing you to focus on what matters most - 
            understanding and mastering new concepts.
          </p>
        </motion.div>
      </motion.div>
    </section>
  );
}

export default AboutUs;
