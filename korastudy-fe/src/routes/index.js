import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Import all pages
import Home from '../pages/Home';
import ExamTest from '../pages/Exam/exam-test';
import ExamResults from '../pages/Exam/exam-results';
import Login from '../pages/auth/login';
import Register from '../pages/auth/register';
import ForgotPassword from '../pages/auth/forgot-password';
import Profile from '../pages/profile';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Home */}
      <Route path="/" element={<Home />} />
      
      {/* Auth Routes */}
      <Route path="/dang-nhap" element={<Login />} />
      <Route path="/dang-ky" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      
      {/* Profile */}
      <Route path="/profile" element={<Profile />} />
      
      {/* Exam Routes */}
      <Route path="/exam/:id/test" element={<ExamTest />} />
      <Route path="/exam/:id/result" element={<ExamResults />} />
      
      {/* Catch all route */}
      <Route path="*" element={<div>Page Not Found</div>} />
    </Routes>
  );
};

export default AppRoutes;
