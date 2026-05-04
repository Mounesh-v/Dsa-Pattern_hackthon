import api from './api';

export const analyticsService = {
  getDashboard: async () => {
    const response = await api.get('/analytics/dashboard', {
      loadingMessage: 'Loading dashboard...',
    });
    return response.data;
  },

  getConfusionMatrix: async () => {
    const response = await api.get('/analytics/confusion-matrix', {
      loadingMessage: 'Loading confusion matrix...',
    });
    return response.data;
  },

  getWeakPatterns: async () => {
    const response = await api.get('/analytics/weak-patterns', {
      loadingMessage: 'Loading weak patterns...',
    });
    return response.data;
  },

  getProgress: async () => {
    const response = await api.get('/analytics/progress', {
      loadingMessage: 'Loading progress...',
    });
    return response.data;
  },
};
