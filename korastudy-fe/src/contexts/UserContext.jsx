import React, { createContext, useContext, useState, useEffect } from 'react';

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
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Mock user data - in real app, this would come from API
  const mockUser = {
    id: 1,
    fullName: 'Minji Kim',
    email: 'minji.kim@example.com',
    avatar: null,
    preferences: {
      testLevel: 'TOPIK II',
      interfaceLanguage: 'Korean',
      darkMode: false
    },
    testHistory: [
      {
        id: 1,
        testName: 'TOPIK I - Mock Test 1',
        score: 85,
        level: 'Level 2',
        date: '2024-01-15',
        totalQuestions: 70,
        correctAnswers: 60
      },
      {
        id: 2,
        testName: 'TOPIK II - Practice Test',
        score: 78,
        level: 'Level 4',
        date: '2024-01-10',
        totalQuestions: 50,
        correctAnswers: 39
      },
      {
        id: 3,
        testName: 'Grammar Test - Advanced',
        score: 92,
        level: 'Advanced',
        date: '2024-01-05',
        totalQuestions: 30,
        correctAnswers: 28
      }
    ],
    badges: [
      { id: 1, name: 'First Test Completed', icon: '🎯', earned: true },
      { id: 2, name: 'Grammar Master', icon: '📚', earned: true },
      { id: 3, name: 'TOPIK Champion', icon: '🏆', earned: false }
    ],
    stats: {
      totalTests: 15,
      averageScore: 82,
      studyStreak: 7,
      totalStudyHours: 45
    }
  };

  useEffect(() => {
    // Simulate checking authentication status
    const checkAuth = () => {
      const token = localStorage.getItem('authToken');
      if (token) {
        setUser(mockUser);
        setIsAuthenticated(true);
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = (userData, token) => {
    localStorage.setItem('authToken', token);
    setUser(userData || mockUser);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setUser(null);
    setIsAuthenticated(false);
  };

  const updateProfile = (updatedData) => {
    setUser(prev => ({
      ...prev,
      ...updatedData
    }));
  };

  const updatePreferences = (preferences) => {
    setUser(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        ...preferences
      }
    }));
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    logout,
    updateProfile,
    updatePreferences
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};
