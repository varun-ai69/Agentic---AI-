import React from 'react';
import './Scoreboard.css';

function Scoreboard({ score, totalQuestions, quiz, userAnswers, onRetry, onReviewConcepts }) {
  const percentage = ((score / totalQuestions) * 100).toFixed(1);
  
  const wrongAnswers = quiz.filter((q, index) => {
    const correctAnswer = typeof q.correctAnswer === 'string' 
      ? q.correctAnswer 
      : q.correct_answer || q.correctAnswer;
    const userAnswer = userAnswers[index];
    
    const normalizedCorrect = correctAnswer?.trim().toLowerCase() || '';
    const normalizedUser = userAnswer?.trim().toLowerCase() || '';
    
    return normalizedUser !== normalizedCorrect;
  });

  const getScoreMessage = () => {
    if (percentage >= 90) return { text: 'Outstanding! You\'ve mastered this topic!', class: 'excellent' };
    if (percentage >= 70) return { text: 'Great job! You have a solid understanding!', class: 'good' };
    if (percentage >= 50) return { text: 'Good effort! Review the concepts to improve!', class: 'average' };
    return { text: 'Keep learning! Practice makes perfect!', class: 'needs-improvement' };
  };

  const scoreMessage = getScoreMessage();

  return (
    <div className="scoreboard-container">
      <div className="score-card">
        <h2>📊 Your Results</h2>
        
        <div className="score-display">
          <div className={`score-circle ${scoreMessage.class}`}>
            <span className="score-number">{score}<span className="total">/{totalQuestions}</span></span>
            <span className="score-percentage">{percentage}%</span>
          </div>
          <p className={`score-message ${scoreMessage.class}`}>{scoreMessage.text}</p>
        </div>

        <div className="stats-grid">
          <div className="stat-box correct">
            <div className="stat-icon">✅</div>
            <div className="stat-content">
              <span className="stat-label">Correct Answers</span>
              <span className="stat-value">{score}</span>
            </div>
          </div>
          <div className="stat-box incorrect">
            <div className="stat-icon">❌</div>
            <div className="stat-content">
              <span className="stat-label">Incorrect Answers</span>
              <span className="stat-value">{totalQuestions - score}</span>
            </div>
          </div>
          <div className="stat-box accuracy">
            <div className="stat-icon">🎯</div>
            <div className="stat-content">
              <span className="stat-label">Accuracy</span>
              <span className="stat-value">{percentage}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Wrong Answers Review */}
      {wrongAnswers.length > 0 && (
        <div className="review-section">
          <h3>📝 Review Your Mistakes</h3>
          <p className="review-subtitle">Learn from these {wrongAnswers.length} incorrect answer{wrongAnswers.length > 1 ? 's' : ''}</p>
          
          {quiz.map((question, index) => {
            const correctAnswer = typeof question.correctAnswer === 'string' 
              ? question.correctAnswer 
              : question.correct_answer || question.correctAnswer;
            const userAnswer = userAnswers[index];
            
            const normalizedCorrect = correctAnswer?.trim().toLowerCase() || '';
            const normalizedUser = userAnswer?.trim().toLowerCase() || '';
            
            const isWrong = normalizedUser !== normalizedCorrect;
            if (!isWrong) return null;

            return (
              <div key={index} className="review-card">
                <div className="review-header">
                  <span className="question-number">Question {index + 1}</span>
                  <span className="wrong-badge">❌ Incorrect</span>
                </div>
                
                <h4 className="review-question">{question.question}</h4>
                
                <div className="answer-comparison">
                  <div className="your-answer">
                    <div className="answer-header">
                      <span className="answer-icon">👤</span>
                      <strong>Your Answer</strong>
                    </div>
                    <p className="answer-text wrong">{userAnswers[index]}</p>
                  </div>
                  
                  <div className="correct-answer">
                    <div className="answer-header">
                      <span className="answer-icon">✓</span>
                      <strong>Correct Answer</strong>
                    </div>
                    <p className="answer-text correct">{correctAnswer}</p>
                  </div>
                </div>

                {question.explanation && (
                  <div className="explanation">
                    <div className="explanation-header">
                      <span className="bulb-icon">💡</span>
                      <strong>Explanation</strong>
                    </div>
                    <p>{question.explanation}</p>
                  </div>
                )}
              </div>
            );
          })}

          <button className="understand-again-btn" onClick={onReviewConcepts}>
            🔄 Do you want to understand this topic again?
          </button>
        </div>
      )}

      {wrongAnswers.length === 0 && (
        <div className="perfect-score">
          <div className="trophy-icon">🏆</div>
          <h3>Perfect Score!</h3>
          <p>You answered all {totalQuestions} questions correctly. Excellent work!</p>
        </div>
      )}

      <div className="action-buttons">
        <button className="retry-btn" onClick={onRetry}>
          🔁 Try New Text
        </button>
      </div>
    </div>
  );
}

export default Scoreboard;
