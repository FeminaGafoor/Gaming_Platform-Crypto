import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - add auth token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handle errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Unauthorized - clear token and redirect to login
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Authentication APIs
export const authAPI = {
  register: (data) => api.post('/api/auth/register', data),
  login: (data) => api.post('/api/auth/login', data),
};

// Agent APIs
export const agentAPI = {
  getDashboard: () => api.get('/api/agent/dashboard'),
  getPlayers: (params) => api.get('/api/agent/players', { params }),
  createPlayer: (data) => api.post('/api/agent/players', data),
  togglePlayerStatus: (playerId) => api.put(`/api/agent/players/${playerId}/toggle-status`),
  getCommissions: (params) => api.get('/api/agent/commissions', { params }),
  getWithdrawals: () => api.get('/api/agent/withdrawals'),
  requestWithdrawal: (data) => api.post('/api/agent/withdrawals', data),
};

// Affiliate APIs
export const affiliateAPI = {
  getDashboard: () => api.get('/api/affiliate/dashboard'),
  getReferralLink: () => api.get('/api/affiliate/referral-link'),
  getClicks: (params) => api.get('/api/affiliate/clicks', { params }),
  getConversions: (params) => api.get('/api/affiliate/conversions', { params }),
  getCommissions: (params) => api.get('/api/affiliate/commissions', { params }),
  getWithdrawals: () => api.get('/api/affiliate/withdrawals'),
  requestWithdrawal: (data) => api.post('/api/affiliate/withdrawals', data),
  getMarketingAssets: () => api.get('/api/affiliate/marketing-assets'),
  getPerformanceReport: (data) => api.post('/api/affiliate/performance-report', data),
};

export default api;