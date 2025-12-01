import React, { createContext, useContext, useEffect, useState } from 'react';
import { AuthAPI } from '../services/api';

const AuthContext = createContext(null);

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
          // Refresh token is in httpOnly cookie, no need to remove from localStorage
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    try {
      console.log('Attempting login to:', `${import.meta.env.VITE_API_BASE_URL || 'https://link-for-feedback--sidiqolasode5695-bddci582.leapcell.dev'}/api/auth/login`);
      const response = await AuthAPI.login({ email, password });
      console.log('Login response:', response);
      const { access_token, user } = response.data || {};
      
      if (access_token) {
        localStorage.setItem('access_token', access_token);
        // Refresh token is set as httpOnly cookie by backend
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
      // Backend reads refresh token from httpOnly cookie
      await AuthAPI.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('access_token');
      // Refresh token cookie is cleared by backend
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

  const googleLogin = async () => {
    try {
      const res = await AuthAPI.googleURL();
      window.location.href = res.data.url;
    } catch (error) {
      console.error('Google login error:', error);
      throw error;
    }
  };

  const handleOAuthCallback = async (accessToken, refreshToken) => {
    try {
      // Store tokens
      localStorage.setItem('access_token', accessToken);
      // Note: refresh token is also in httpOnly cookie from backend
      
      // Fetch user data
      const response = await AuthAPI.me();
      setUser(response.data);
      
      return { success: true };
    } catch (error) {
      console.error('OAuth callback processing error:', error);
      localStorage.removeItem('access_token');
      throw error;
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
    googleLogin,
    handleOAuthCallback,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};