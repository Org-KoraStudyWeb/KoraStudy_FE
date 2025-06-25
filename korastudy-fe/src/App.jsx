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
import Login from '@pages/auth/login.jsx';
import Register from '@pages/auth/register.jsx';
import ForgotPassword from '@pages/auth/forgot-password.jsx';
// Import other pages
import Exams from '@pages/Exam/exam.jsx';
import ExamDetail from '@pages/Exam/exam-detail.jsx';
import ExamTest from '@pages/Exam/exam-test.jsx'; 
import ExamResults from '@pages/Exam/exam-results.jsx';
import LearningPath from '@pages/LearningPath/learning-path.jsx';
// Import About page
import About from '@pages/about.jsx';


function App() {
  return (
    <ThemeProvider>
      <UserProvider>
        <Router>
          <ScrollToTop />
          <div className="App bg-white dark:bg-dark-900 min-h-screen transition-colors duration-300">
            <Routes>
              <Route path="/" element={<><NavBar /><Home /><Footer /></>} />
              <Route path="/courses" element={<><NavBar /><Courses /><Footer /></>} />
              <Route path="/course/:courseId" element={<><NavBar /><CourseDetail /><Footer /></>} />
              <Route path="/profile" element={<><NavBar /><Profile /><Footer /></>} />
              <Route path="/dang-nhap" element={<Login />} />
              <Route path="/dang-ky" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/tai-lieu" element={<><NavBar /><TaiLieu /><Footer /></>} />
              <Route path="/ly-thuyet" element={<><NavBar /><LyThuyet /><Footer /></>} />
              <Route path="/lo-trinh" element={<LearningPath />} />

              <Route path="/luyen-tap-topik" element={<><NavBar /><LuyenTapTopik /><Footer /></>} />
              <Route path="/topik1" element={<><NavBar /><Topik1 /><Footer /></>} />
              <Route path="/topik2" element={<><NavBar /><Topik2 /><Footer /></>} />
              <Route path="/topik-esp" element={<><NavBar /><TopikESP /><Footer /></>} />
              <Route path="/nang-cap" element={<><NavBar /><NangCap /><Footer /></>} />
              {/* Sửa route cho About page - Sử dụng component About đã import */}
              <Route path="/about" element={<About />} />
              <Route path="/terms" element={<><NavBar /><Terms /><Footer /></>} />
              <Route path="/privacy" element={<><NavBar /><Privacy /><Footer /></>} />
              <Route path="/lien-he" element={<><NavBar /><Contact /><Footer /></>} />
              <Route path="/de-thi" element={<Exams />}/>
              <Route path="/de-thi/:examId" element={<><NavBar /><ExamDetail /><Footer /></>} />
              <Route path="/exam/:id" element={<ExamDetail />} />
              <Route path="/exam/:id/take" element={<ExamTest />} />
              <Route path="/exam/:id/results" element={<ExamResults />} />  
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
// Xóa component About tạm thời ở đây vì đã import từ file riêng
const Terms = () => <div className="min-h-[60vh] p-10 bg-white dark:bg-dark-900 text-gray-900 dark:text-gray-100">Điều khoản dịch vụ</div>;
const Privacy = () => <div className="min-h-[60vh] p-10 bg-white dark:bg-dark-900 text-gray-900 dark:text-gray-100">Chính sách bảo mật</div>;
const Contact = () => <div className="min-h-[60vh] p-10 bg-white dark:bg-dark-900 text-gray-900 dark:text-gray-100">Liên hệ</div>;

export default App;