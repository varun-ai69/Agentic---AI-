import React, { useState } from 'react';
import './ConceptQuiz.css';

function ConceptQuiz({ concepts, quiz, onSubmit }) {
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showExplanation, setShowExplanation] = useState(true);

  const handleAnswerSelect = (questionIndex, answer) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [questionIndex]: answer
    });
  };

  const handleSubmit = () => {
    if (Object.keys(selectedAnswers).length < quiz.length) {
      alert('Please answer all questions before submitting!');
      return;
    }
    onSubmit(selectedAnswers);
  };

  const getDifficultyBadge = (difficulty) => {
    const badges = {
      easy: { icon: '🟢', label: 'Easy', class: 'easy' },
      medium: { icon: '🟡', label: 'Medium', class: 'medium' },
      hard: { icon: '🔴', label: 'Hard', class: 'hard' }
    };
    const badge = badges[difficulty.toLowerCase()] || { icon: '⚪', label: difficulty, class: 'default' };
    return badge;
  };

  const answeredCount = Object.keys(selectedAnswers).length;
  const progress = (answeredCount / quiz.length) * 100;

  return (
    <div className="concept-quiz-container">
      {/* Concepts Section */}
      {showExplanation && (
        <div className="concepts-section">
          <div className="section-header">
            <h2>📖 Key Concepts Extracted</h2>
            <button 
              className="toggle-btn"
              onClick={() => setShowExplanation(false)}
            >
              <span>Hide Concepts</span>
            </button>
          </div>
          
          <div className="concepts-hierarchy">
            {concepts.map((concept, index) => (
              <div key={index} className={`concept-card level-${concept.level || 1}`}>
                <div className="concept-header">
                  <span className="concept-number">Concept {index + 1}</span>
                  {concept.level && <span className="concept-level">Level {concept.level}</span>}
                </div>
                <h3>{concept.title}</h3>
                <p>{concept.explanation}</p>
                {concept.subConcepts && concept.subConcepts.length > 0 && (
                  <div className="sub-concepts-wrapper">
                    <h4>Key Points:</h4>
                    <ul className="sub-concepts">
                      {concept.subConcepts.map((sub, subIndex) => (
                        <li key={subIndex}>{sub}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {!showExplanation && (
        <button 
          className="show-concepts-btn"
          onClick={() => setShowExplanation(true)}
        >
          📖 Show Concepts Again
        </button>
      )}

      {/* Quiz Section */}
      <div className="quiz-section">
        <div className="quiz-header">
          <div>
            <h2>✍️ Quiz Time</h2>
            <p className="quiz-instruction">
              Answer all {quiz.length} questions below and submit to see your score!
            </p>
          </div>
          <div className="progress-info">
            <span className="progress-text">{answeredCount}/{quiz.length} Answered</span>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${progress}%` }}></div>
            </div>
          </div>
        </div>

        <div className="questions-grid">
          {quiz.map((question, qIndex) => {
            const difficulty = getDifficultyBadge(question.difficulty);
            return (
              <div key={qIndex} className="question-card">
                <div className="question-header">
                  <span className="question-number">Question {qIndex + 1}</span>
                  <span className={`difficulty-badge ${difficulty.class}`}>
                    {difficulty.icon} {difficulty.label}
                  </span>
                </div>
                
                <h3 className="question-text">{question.question}</h3>
                
                <div className="options-container">
                  {question.options.map((option, oIndex) => (
                    <label 
                      key={oIndex} 
                      className={`option-label ${selectedAnswers[qIndex] === option ? 'selected' : ''}`}
                    >
                      <input
                        type="radio"
                        name={`question-${qIndex}`}
                        value={option}
                        checked={selectedAnswers[qIndex] === option}
                        onChange={() => handleAnswerSelect(qIndex, option)}
                      />
                      <span className="option-content">
                        <span className="option-letter">{String.fromCharCode(65 + oIndex)}</span>
                        <span className="option-text">{option}</span>
                      </span>
                      {selectedAnswers[qIndex] === option && (
                        <span className="check-mark">✓</span>
                      )}
                    </label>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        <div className="submit-section">
          <button 
            className="submit-quiz-btn"
            onClick={handleSubmit}
            disabled={Object.keys(selectedAnswers).length < quiz.length}
          >
            🎯 Submit Quiz & See Results
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConceptQuiz;
