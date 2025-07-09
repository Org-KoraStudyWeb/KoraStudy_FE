import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast'; // Add this import
import { UserProvider } from './contexts/UserContext';
import { ThemeProvider } from './contexts/ThemeContext';

// Import components
import Home from './pages/Home';
import ExamTest from './pages/Exam/exam-test';
import ExamResults from './pages/Exam/exam-results';
import Login from './pages/auth/login';
import Register from './pages/auth/register';
import ForgotPassword from './pages/auth/forgot-password';
import Profile from './pages/profile';

function App() {
  return (
    <ThemeProvider>
      <UserProvider>
        <Router>
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
            
            {/* ...existing routes... */}
            
            {/* Catch all route */}
            <Route path="*" element={<div>Page Not Found</div>} />
          </Routes>
          
          {/* Add Toaster component */}
          <Toaster 
            position="top-right"
            reverseOrder={false}
            gutter={8}
            containerClassName=""
            containerStyle={{}}
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
              success: {
                duration: 3000,
                theme: {
                  primary: 'green',
                  secondary: 'black',
                },
              },
            }}
          />
        </Router>
      </UserProvider>
    </ThemeProvider>
  );
}

export default App;