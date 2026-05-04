import axios from 'axios';
import { toast } from '../components/Toast';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

const LOADING_TOAST_DELAY = 600;

const getErrorMessage = (error) => {
  return (
    error.response?.data?.message ||
    error.response?.data?.error ||
    error.message ||
    'Something went wrong'
  );
};

// Request interceptor to add token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    const method = config.method?.toLowerCase();
    const shouldShowLoadingToast =
      config.showLoadingToast ?? (method === 'get' && !config.skipAuthRedirect);

    if (shouldShowLoadingToast) {
      config.loadingToastTimer = window.setTimeout(() => {
        config.loadingToastId = toast.loading(config.loadingMessage || 'Loading data...');
      }, LOADING_TOAST_DELAY);
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => {
    if (response.config.loadingToastTimer) {
      window.clearTimeout(response.config.loadingToastTimer);
    }

    if (response.config.loadingToastId) {
      toast.dismiss(response.config.loadingToastId);
    }

    if (response.config.successMessage) {
      toast.success(response.config.successMessage);
    }

    return response;
  },
  (error) => {
    if (error.config?.loadingToastTimer) {
      window.clearTimeout(error.config.loadingToastTimer);
    }

    if (error.config?.loadingToastId) {
      toast.dismiss(error.config.loadingToastId);
    }

    if (error.response?.status === 401 && !error.config?.skipAuthRedirect) {
      localStorage.removeItem('token');
      if (!window.location.pathname.startsWith('/login')) {
        window.location.href = '/login';
      }
    }

    if (!error.config?.skipErrorToast) {
      toast.error(getErrorMessage(error));
    }

    return Promise.reject(error);
  }
);

export default api;
