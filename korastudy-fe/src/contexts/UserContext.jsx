import React, { createContext, useContext, useState, useEffect } from 'react';
import authService from '../api/authService';

const UserContext = createContext();

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);

  // Initialize user from localStorage
  useEffect(() => {
    initializeUser();
  }, []);

  const initializeUser = () => {
    try {
      const storedToken = authService.getToken();
      const storedUser = authService.getCurrentUser();

      console.log('Initializing user - token:', storedToken, 'user:', storedUser); // Debug log

      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(storedUser);
      }
    } catch (error) {
      console.error('Error initializing user:', error);
      // Clear invalid data
      authService.logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    try {
      setLoading(true);
      const response = await authService.login(credentials);
      
      console.log('Login response:', response); // Debug log
      
      // Update state with proper user data
      const newToken = response.token || response.accessToken || response.data?.token;
      const userData = response.user || response.userInfo || response.data?.user || {
        username: credentials.username,
        email: response.email || credentials.email,
        fullName: response.fullName || response.name || credentials.username
      };
      
      console.log('Setting token:', newToken, 'user:', userData); // Debug log
      
      if (newToken) {
        setToken(newToken);
      }
      
      if (userData) {
        setUser(userData);
      }
      
      return response;
    } catch (error) {
      console.error('Login error in context:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setLoading(true);
      const response = await authService.register(userData);
      return response;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      setToken(null);
      // Redirect to login page
      window.location.href = '/';
    }
  };

  const updateProfile = async (userData) => {
    try {
      const response = await authService.updateProfile(userData);
      const updatedUser = response.user || response.userInfo || response.data?.user;
      if (updatedUser) {
        setUser(updatedUser);
      }
      return response;
    } catch (error) {
      throw error;
    }
  };

  const forgotPassword = async (email) => {
    try {
      const response = await authService.forgotPassword(email);
      return response;
    } catch (error) {
      throw error;
    }
  };

  const isAuthenticated = () => {
    const hasToken = !!token || !!authService.getToken();
    const hasUser = !!user || !!authService.getCurrentUser();
    console.log('isAuthenticated check - hasToken:', hasToken, 'hasUser:', hasUser, 'result:', hasToken && hasUser); // Debug log
    return hasToken && hasUser;
  };

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    updateProfile,
    forgotPassword,
    isAuthenticated
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};