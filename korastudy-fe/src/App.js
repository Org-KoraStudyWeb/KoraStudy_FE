import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

// Import contexts - Fixed import path
import { ThemeProvider } from './contexts/ThemeContext';

// Import components
import NavBar from './components/NavBar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';

// Import pages
import Home from './pages/home';
import Courses from './pages/Course/courses';
import CourseDetail from './pages/Course/course-details';

// Import auth pages
import Login from './pages/auth/login';
import Register from './pages/auth/register';
import ForgotPassword from './pages/auth/forgot-password';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <ScrollToTop />
        <div className="App bg-white dark:bg-dark-900 min-h-screen transition-colors duration-300">
          <Routes>
            <Route path="/" element={<><NavBar /><Home /><Footer /></>} />
            <Route path="/courses" element={<><NavBar /><Courses /><Footer /></>} />
            <Route path="/course/:courseId" element={<><NavBar /><CourseDetail /><Footer /></>} />
            <Route path="/dang-nhap" element={<Login />} />
            <Route path="/dang-ky" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/tai-lieu" element={<><NavBar /><TaiLieu /><Footer /></>} />
            <Route path="/ly-thuyet" element={<><NavBar /><LyThuyet /><Footer /></>} />
            <Route path="/lo-trinh" element={<><NavBar /><LoTrinh /><Footer /></>} />
            <Route path="/luyen-tap-topik" element={<><NavBar /><LuyenTapTopik /><Footer /></>} />
            <Route path="/topik1" element={<><NavBar /><Topik1 /><Footer /></>} />
            <Route path="/topik2" element={<><NavBar /><Topik2 /><Footer /></>} />
            <Route path="/topik-esp" element={<><NavBar /><TopikESP /><Footer /></>} />
            <Route path="/de-thi" element={<><NavBar /><DeThi /><Footer /></>} />
            <Route path="/de-thi/topik1" element={<><NavBar /><DeThiTopik1 /><Footer /></>} />
            <Route path="/de-thi/topik2" element={<><NavBar /><DeThiTopik2 /><Footer /></>} />
            <Route path="/de-thi/topik-esp" element={<><NavBar /><DeThiTopikESP /><Footer /></>} />
            <Route path="/nang-cap" element={<><NavBar /><NangCap /><Footer /></>} />
            <Route path="/about" element={<><NavBar /><About /><Footer /></>} />
            <Route path="/terms" element={<><NavBar /><Terms /><Footer /></>} />
            <Route path="/privacy" element={<><NavBar /><Privacy /><Footer /></>} />
            <Route path="/lien-he" element={<><NavBar /><Contact /><Footer /></>} />
          </Routes>
        </div>
      </Router>
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
const DeThi = () => <div className="min-h-[60vh] p-10 bg-white dark:bg-dark-900 text-gray-900 dark:text-gray-100">Đề thi</div>;
const DeThiTopik1 = () => <div className="min-h-[60vh] p-10 bg-white dark:bg-dark-900 text-gray-900 dark:text-gray-100">Đề thi TOPIK 1</div>;
const DeThiTopik2 = () => <div className="min-h-[60vh] p-10 bg-white dark:bg-dark-900 text-gray-900 dark:text-gray-100">Đề thi TOPIK 2</div>;
const DeThiTopikESP = () => <div className="min-h-[60vh] p-10 bg-white dark:bg-dark-900 text-gray-900 dark:text-gray-100">Đề thi TOPIK ESP</div>;
const NangCap = () => <div className="min-h-[60vh] p-10 bg-white dark:bg-dark-900 text-gray-900 dark:text-gray-100">Nâng cấp</div>;
const About = () => <div className="min-h-[60vh] p-10 bg-white dark:bg-dark-900 text-gray-900 dark:text-gray-100">Về KoraStudy</div>;
const Terms = () => <div className="min-h-[60vh] p-10 bg-white dark:bg-dark-900 text-gray-900 dark:text-gray-100">Điều khoản dịch vụ</div>;
const Privacy = () => <div className="min-h-[60vh] p-10 bg-white dark:bg-dark-900 text-gray-900 dark:text-gray-100">Chính sách bảo mật</div>;
const Contact = () => <div className="min-h-[60vh] p-10 bg-white dark:bg-dark-900 text-gray-900 dark:text-gray-100">Liên hệ</div>;

export default App;
