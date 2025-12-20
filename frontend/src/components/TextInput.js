import React, { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './TextInput.css';

function TextInput({ onSubmit }) {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const textareaRef = useRef(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 500) + 'px';
    }
  }, [text]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (text.trim().length < 50) {
      alert('Please enter at least 50 characters of educational text.');
      return;
    }

    setLoading(true);
    await onSubmit(text);
    setLoading(false);
  };

  return (
    <div className="text-input-container">
      <div className="input-card">
        <div className="card-header">
          <h2><FontAwesomeIcon icon="fa-solid fa-book" style={{marginRight: '8px'}} /> Enter Educational Text</h2>
          <p className="description">
            Paste your educational content below. Our AI will extract key concepts, 
            organize them hierarchically, and generate a personalized quiz for you.
          </p>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="textarea-wrapper">
            <textarea
              ref={textareaRef}
              className="text-area"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Paste your educational text here... (minimum 50 characters)&#10;&#10;Example: Machine learning is a subset of artificial intelligence that enables computers to learn from data without being explicitly programmed..."
              disabled={loading}
            />
          </div>
          
          <div className="input-footer">
            <div className="footer-info">
              <span className={`char-count ${text.length >= 50 ? 'valid' : ''}`}>
                {text.length} / 50 characters
              </span>
              {text.length >= 50 && <span className="valid-indicator"><FontAwesomeIcon icon="fa-solid fa-circle-check" style={{marginRight: '4px'}} /> Ready</span>}
            </div>
            <button 
              type="submit" 
              className="submit-btn"
              disabled={loading || text.trim().length < 50}
            >
              {loading ? (
                <>
                  <span className="spinner"></span>
                  Processing...
                </>
              ) : (
                <>
                  <FontAwesomeIcon icon="fa-solid fa-wand-magic-sparkles" style={{marginRight: '6px'}} />
                  Extract & Generate Quiz
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default TextInput;
