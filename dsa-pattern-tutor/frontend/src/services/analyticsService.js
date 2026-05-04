import api from './api';

export const analyticsService = {
  getDashboard: async () => {
    const response = await api.get('/analytics/dashboard');
    return response.data;
  },

  getConfusionMatrix: async () => {
    const response = await api.get('/analytics/confusion-matrix');
    return response.data;
  },

  getWeakPatterns: async () => {
    const response = await api.get('/analytics/weak-patterns');
    return response.data;
  },

  getProgress: async () => {
    const response = await api.get('/analytics/progress');
    return response.data;
  },
};
