import api from './api';

export const authService = {
  register: async (name, email, password) => {
    const response = await api.post('/auth/register', { name, email, password }, {
      loadingMessage: 'Creating your account...',
      showLoadingToast: true,
      skipErrorToast: true,
    });
    return response.data;
  },

  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password }, {
      loadingMessage: 'Signing you in...',
      showLoadingToast: true,
      skipErrorToast: true,
    });
    return response.data;
  },

  getMe: async () => {
    const response = await api.get('/auth/me', {
      skipAuthRedirect: true,
      skipErrorToast: true,
      showLoadingToast: false,
    });
    return response.data;
  },

  logout: async () => {
    const response = await api.post('/auth/logout', null, {
      showLoadingToast: false,
      skipErrorToast: true,
    });
    return response.data;
  },

  forgotPassword: async (email) => {
    const response = await api.post('/auth/forgot-password', { email }, {
      loadingMessage: 'Sending reset instructions...',
      showLoadingToast: true,
      successMessage: 'Check your email for reset instructions',
    });
    return response.data;
  },
};
