import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useUser();
  const location = useLocation();

  // Show loading while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-dark-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Đang tải...</p>
        </div>
      </div>
    );
  }

  // If not authenticated, redirect to login with return URL
  if (!isAuthenticated()) {
    return <Navigate to="/dang-nhap" state={{ from: location }} replace />;
  }

  // If authenticated, render the protected component
  return children;
};

export default ProtectedRoute;