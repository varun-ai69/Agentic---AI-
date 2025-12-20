// API Service for backend communication
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

/**
 * Generate quiz from educational text
 * @param {string} text - Educational text to process
 * @returns {Promise<Object>} - Quiz data with hierarchy, concepts, questions, etc.
 */
export async function generateQuiz(text) {
  try {
    const response = await fetch(`${API_BASE_URL}/quiz/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || `Backend error: ${response.statusText}`);
    }

    const data = await response.json();
    
    // Normalize the response structure
    return {
      hierarchy: data.hierarchy || [],
      concepts: data.concepts || [],
      quiz: data.quiz || [],
      answers: data.answers || [],
      explanation: data.explanation || {},
      message: data.message
    };
  } catch (error) {
    console.error('API Error:', error);
    // Handle network errors (backend not running, CORS issues, etc.)
    if (error.message === 'Failed to fetch' || error.name === 'TypeError') {
      throw new Error('Unable to connect to backend server. Please make sure the backend is running on http://localhost:3000');
    }
    throw error;
  }
}

/**
 * Health check for backend
 * @returns {Promise<boolean>} - True if backend is healthy
 */
export async function checkBackendHealth() {
  try {
    const response = await fetch(`${API_BASE_URL}/health`);
    return response.ok;
  } catch (error) {
    console.error('Backend health check failed:', error);
    return false;
  }
}

export default {
  generateQuiz,
  checkBackendHealth
};
