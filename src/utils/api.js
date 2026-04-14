const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

function handleAuthError(status) {
  if (status === 401 || status === 403) {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  }
}

// Auth
export const authAPI = {
  login: async (credentials) => {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Login failed');
    return data;
  },
  signup: async (userData) => {
    const res = await fetch(`${API_BASE_URL}/auth/signup`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Signup failed');
    return data;
  },
};

// Submissions
export const submissionsAPI = {
  submitAiScore: async (score, topic, difficulty, totalQuestions, reviewData) => {
    const res = await fetch(`${API_BASE_URL}/submissions/save-ai-score`, {
      method: 'POST', headers: getAuthHeaders(),
      body: JSON.stringify({ score, topic, difficulty, totalQuestions, reviewData }),
    });
    const data = await res.json();
    if (!res.ok) { handleAuthError(res.status); throw new Error(data.message || 'Failed to save score'); }
    return data;
  },
  getMySubmissions: async () => {
    const res = await fetch(`${API_BASE_URL}/submissions/me`, { headers: getAuthHeaders() });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to fetch submissions');
    return data;
  },
};

// AI
export const aiAPI = {
  generateQuestions: async (topic, difficulty = 'medium', amount = 10) => {
    const res = await fetch(`${API_BASE_URL}/ai/generate-questions`, {
      method: 'POST', headers: getAuthHeaders(),
      body: JSON.stringify({ topic, difficulty, amount }),
    });
    const data = await res.json();
    if (!res.ok) { handleAuthError(res.status); throw new Error(data.message || 'Failed to generate questions'); }
    return data;
  },
  getExplanation: async (question, correct_answer, user_answer) => {
    const res = await fetch(`${API_BASE_URL}/ai/get-explanation`, {
      method: 'POST', headers: getAuthHeaders(),
      body: JSON.stringify({ question, correct_answer, user_answer }),
    });
    const data = await res.json();
    if (!res.ok) { handleAuthError(res.status); throw new Error(data.message || 'Failed to get explanation'); }
    return data;
  },
};

// Leaderboard
export const leaderboardAPI = {
  getLeaderboard: async () => {
    const res = await fetch(`${API_BASE_URL}/leaderboard`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to fetch leaderboard');
    return data;
  },
};
