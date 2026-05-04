import api from './api';

export const attemptService = {
  createAttempt: async (attemptData) => {
    const response = await api.post('/attempts', attemptData);
    return response.data;
  },

  getAttemptHistory: async (params = {}) => {
    const response = await api.get('/attempts', { params });
    return response.data;
  },

  getUserStats: async () => {
    const response = await api.get('/attempts/stats');
    return response.data;
  },
};
