import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { authService } from '../services/authService';
import { useToast } from '../components/Toast';

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

const saveAuthToken = (token) => {
  if (token) {
    localStorage.setItem('token', token);
  }
};

const getStoredAuthToken = () => {
  const token = localStorage.getItem('token');

  if (token && token !== 'undefined' && token !== 'null') {
    return token;
  }

  if (token) {
    localStorage.removeItem('token');
  }

  return null;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const toast = useToast();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const checkAuth = useCallback(async () => {
    if (!getStoredAuthToken()) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const data = await authService.getMe();
      setUser(data.user);
    } catch {
      localStorage.removeItem('token');
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

 const login = async (email, password) => {
  try {
    setError(null);

    const data = await authService.login(email, password);

    // ✅ Save token
    saveAuthToken(data.token);

    // ✅ Set user
    setUser(data.user);

    toast.success(`Welcome back, ${data.user.name}`);
    return { success: true };

  } catch (err) {
    const message = getAuthErrorMessage(err, 'Login failed');
    setError(message);
    toast.error(message);
    return { success: false, error: message };
  }
};
  const register = async (name, email, password) => {
    try {
      setError(null);
      const data = await authService.register(name, email, password);
      saveAuthToken(data.token);
      setUser(data.user);
      toast.success('Account created successfully');
      return { success: true };
    } catch (err) {
      const message = getAuthErrorMessage(err, 'Registration failed');
      setError(message);
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch {
      // Local logout should still succeed if the session has already expired.
    } finally {
      localStorage.removeItem('token');
      setUser(null);
      toast.success('Logged out successfully');
    }
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
