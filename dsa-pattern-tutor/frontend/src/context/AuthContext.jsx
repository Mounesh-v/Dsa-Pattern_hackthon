import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

const getAuthErrorMessage = (err, fallback) => {
  if (err.response?.data?.message) {
    return err.response.data.message;
  }

  if (err.request) {
    return 'Cannot reach the backend API. Make sure the backend server is running.';
  }

  return fallback;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const data = await authService.getMe();
        setUser(data.user);
      } catch (err) {
        localStorage.removeItem('token');
        setUser(null);
      }
    }
    setLoading(false);
  };

  const login = async (email, password) => {
    try {
      setError(null);
      const data = await authService.login(email, password);
      localStorage.setItem('token', data.token);
      setUser(data.user);
      return { success: true };
    } catch (err) {
      const message = getAuthErrorMessage(err, 'Login failed');
      setError(message);
      return { success: false, error: message };
    }
  };

  const register = async (name, email, password) => {
    try {
      setError(null);
      const data = await authService.register(name, email, password);
      localStorage.setItem('token', data.token);
      setUser(data.user);
      return { success: true };
    } catch (err) {
      const message = getAuthErrorMessage(err, 'Registration failed');
      setError(message);
      return { success: false, error: message };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
