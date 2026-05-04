import api from './api';

export const userService = {
  getProfile: async () => {
    const response = await api.get('/users/profile');
    return response.data;
  },

  updateProfile: async (profileData) => {
    const response = await api.put('/users/profile', profileData);
    return response.data;
  },

  getLeaderboard: async (params = {}) => {
    const response = await api.get('/users/leaderboard', { params });
    return response.data;
  },
};
