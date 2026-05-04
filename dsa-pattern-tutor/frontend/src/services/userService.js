import api from './api';

export const userService = {
  getProfile: async () => {
    const response = await api.get('/users/profile', {
      loadingMessage: 'Loading profile...',
    });
    return response.data;
  },

  updateProfile: async (profileData) => {
    const response = await api.put('/users/profile', profileData, {
      loadingMessage: 'Saving profile...',
      showLoadingToast: true,
      successMessage: 'Profile updated successfully',
    });
    return response.data;
  },

  getLeaderboard: async (params = {}) => {
    const response = await api.get('/users/leaderboard', {
      params,
      loadingMessage: 'Loading leaderboard...',
    });
    return response.data;
  },
};
