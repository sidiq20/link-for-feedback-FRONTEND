import React, { createContext, useContext, useEffect, useState } from 'react';
import { AuthAPI } from '../services/api';

const AuthContext = createContext({});

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

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('access_token');
      if (token) {
        try {
          const response = await AuthAPI.me();
          setUser(response.data);
        } catch (error) {
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    try {
      console.log('Attempting login to:', `${import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:5000'}/auth/login`);
      const response = await AuthAPI.login({ email, password });
      console.log('Login response:', response);
      const { access_token, refresh_token, user } = response.data || {};
      
      if (access_token) {
        localStorage.setItem('access_token', access_token);
        if (refresh_token) {
          localStorage.setItem('refresh_token', refresh_token);
        }
        setUser(user);
      }
      
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        message: error.response?.data?.error || error.message || `Network error: ${error.code || 'Connection failed'}`
      };
    }
  };

  const register = async (name, email, password) => {
    try {
      const response = await AuthAPI.register({ name, email, password });
      return {
         success: true,
          message: response.data?.message || 'Registration successful' 
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.error || error.message || 'Registration failed'
      };
    }
  };

  const logout = async () => {
    try {
      const refreshToken = localStorage.getItem('refresh_token');
      if (refreshToken) {
        await AuthAPI.logout({ refresh_token: refreshToken });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      setUser(null);
    }
  };

  const forgotPassword = async (email) => {
    try {
      const response = await AuthAPI.forgotPassword({ email });
      return { success: true, message: response.data.message };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.error || 'Password reset failed'
      };
    }
  };

  const resetPassword = async (token, password) => {
    try {
      const response = await AuthAPI.resetPassword({ token, password });
      return { success: true, message: response.data.message };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.error || 'Password reset failed'
      };
    }
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    forgotPassword,
    resetPassword,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};