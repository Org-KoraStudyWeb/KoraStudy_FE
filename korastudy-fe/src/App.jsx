import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
// Import contexts - Fixed import path
import { ThemeProvider } from '@contexts/ThemeContext.jsx';
import { UserProvider } from '@contexts/UserContext.jsx';
// Import components
import NavBar from '@components/NavBar.jsx';
import Footer from '@components/Footer.jsx';
import ScrollToTop from '@components/ScrollToTop.jsx';
// Import pages
import Home from '@pages/home.jsx';
import Courses from '@pages/Course/courses.jsx';
import CourseDetail from '@/pages/Course/course-details.jsx';
import Profile from '@/pages/profile.jsx';
// Import auth pages
import LoginPage from './pages/auth/LoginPage';
import Register from '@pages/auth/register.jsx';
import ForgotPassword from '@pages/auth/forgot-password.jsx';
// Import exam pages
import Exams from '@pages/Exam/exam.jsx';
import ExamDetail from '@pages/Exam/exam-detail.jsx';
import ExamTest from '@pages/Exam/exam-test.jsx'; 
import ExamResults from '@pages/Exam/exam-results.jsx';
import LearningPath from '@pages/LearningPath/learning-path.jsx';
// Import About page
import About from '@pages/about.jsx';
import Blog from '@pages/blog/blog.jsx';
import BlogPost from '@pages/blog/blog-post.jsx';

import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <ThemeProvider>
      <UserProvider>
        <Router>
          <ScrollToTop />
          <div className="App bg-white dark:bg-dark-900 min-h-screen transition-colors duration-300">
            <Routes>
              {/* Auth routes - no navbar/footer */}
              <Route path="/dang-nhap" element={<LoginPage />} />
              <Route path="/dang-ky" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />

              {/* Exam routes - some with navbar/footer, some without */}
              <Route path="/exam" element={<><NavBar /><Exams /><Footer /></>} />
              <Route path="/exam/:id" element={<ExamDetail />} />
              <Route path="/exam/:id/test" element={<ExamTest />} /> {/* No navbar/footer for test */}
              <Route path="/exam/:id/result" element={<ExamResults />} /> {/* No navbar/footer for results */}
              
              {/* Legacy exam routes for compatibility */}
              <Route path="/de-thi" element={<><NavBar /><Exams /><Footer /></>} />
              <Route path="/de-thi/:examId" element={<><NavBar /><ExamDetail /><Footer /></>} />

              {/* Protected routes */}
              <Route 
                path="/profile" 
                element={
                  <ProtectedRoute>
                    <><NavBar /><Profile /><Footer /></>
                  </ProtectedRoute>
                } 
              />

              {/* Public routes with navbar/footer */}
              <Route path="/" element={<><NavBar /><Home /><Footer /></>} />
              <Route path="/courses" element={<><NavBar /><Courses /><Footer /></>} />
              <Route path="/course/:courseId" element={<><NavBar /><CourseDetail /><Footer /></>} />
              
              <Route path="/tai-lieu" element={<><NavBar /><TaiLieu /><Footer /></>} />
              <Route path="/ly-thuyet" element={<><NavBar /><LyThuyet /><Footer /></>} />
              <Route path="/lo-trinh" element={<><NavBar /><LearningPath /><Footer /></>} />

              <Route path="/topik1" element={<><NavBar /><Topik1 /><Footer /></>} />
              <Route path="/topik2" element={<><NavBar /><Topik2 /><Footer /></>} />
              <Route path="/topik-esp" element={<><NavBar /><TopikESP /><Footer /></>} />
              <Route path="/nang-cap" element={<><NavBar /><NangCap /><Footer /></>} />
              
              <Route path="/about" element={<><NavBar /><About /><Footer /></>} />
              <Route path="/terms" element={<><NavBar /><Terms /><Footer /></>} />
              <Route path="/privacy" element={<><NavBar /><Privacy /><Footer /></>} />
              <Route path="/lien-he" element={<><NavBar /><Contact /><Footer /></>} />
              
              <Route path="/blog" element={<><NavBar /><Blog /><Footer /></>} />
              <Route path="/blog/:postId" element={<><NavBar /><BlogPost /><Footer /></>} />
            </Routes>
          </div>
        </Router>
      </UserProvider>
    </ThemeProvider>
  );
}

// Temporary placeholder components with dark mode support
const TaiLieu = () => <div className="min-h-[60vh] p-10 bg-white dark:bg-dark-900 text-gray-900 dark:text-gray-100">Tài liệu</div>;
const LyThuyet = () => <div className="min-h-[60vh] p-10 bg-white dark:bg-dark-900 text-gray-900 dark:text-gray-100">Lý thuyết</div>;
const LoTrinh = () => <div className="min-h-[60vh] p-10 bg-white dark:bg-dark-900 text-gray-900 dark:text-gray-100">Lộ trình</div>;
const LuyenTapTopik = () => <div className="min-h-[60vh] p-10 bg-white dark:bg-dark-900 text-gray-900 dark:text-gray-100">Luyện tập TOPIK</div>;
const Topik1 = () => <div className="min-h-[60vh] p-10 bg-white dark:bg-dark-900 text-gray-900 dark:text-gray-100">TOPIK 1</div>;
const Topik2 = () => <div className="min-h-[60vh] p-10 bg-white dark:bg-dark-900 text-gray-900 dark:text-gray-100">TOPIK 2</div>;
const TopikESP = () => <div className="min-h-[60vh] p-10 bg-white dark:bg-dark-900 text-gray-900 dark:text-gray-100">TOPIK ESP</div>;
const NangCap = () => <div className="min-h-[60vh] p-10 bg-white dark:bg-dark-900 text-gray-900 dark:text-gray-100">Nâng cấp</div>;
const Terms = () => <div className="min-h-[60vh] p-10 bg-white dark:bg-dark-900 text-gray-900 dark:text-gray-100">Điều khoản dịch vụ</div>;
const Privacy = () => <div className="min-h-[60vh] p-10 bg-white dark:bg-dark-900 text-gray-900 dark:text-gray-100">Chính sách bảo mật</div>;
const Contact = () => <div className="min-h-[60vh] p-10 bg-white dark:bg-dark-900 text-gray-900 dark:text-gray-100">Liên hệ</div>;

export default App;