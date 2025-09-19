import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import './App.css';
// Import react-toastify
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// Import contexts - Fixed import path
import { ThemeProvider } from '@contexts/ThemeContext.jsx';
import { UserProvider } from '@contexts/UserContext.jsx';
// Import components
import NavBar from '@components/NavBar.jsx';
import Footer from '@components/Footer.jsx';
import ScrollToTop from '@components/ScrollToTop.jsx';
// Import websocket service
import websocketService from './api/websocketService';
// Import pages
import Home from '@pages/home.jsx';
import Courses from '@pages/Course/courses.jsx';
import CoursesNew from '@pages/Course/CoursesNew.jsx';
import MyCourses from '@pages/Course/my-courses.jsx';

import CourseDetail from '@/pages/Course/course-details.jsx';
import CourseDetailNew from '@/pages/Course/CourseDetailNew.jsx';
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
import CreatePost from './pages/blog/CreatePost';
// Import Blog pages
import EditPost from './pages/blog/EditPost';
import PostDetail from './pages/blog/PostDetail';
// Import FlashCard pages
import FlashCard from '@pages/FlashCard/flash-card.jsx';
import FlashCardPractice from '@pages/FlashCard/flash-card-practice.jsx';
import CreateWordList from '@pages/FlashCard/create-word-list.jsx';
import EditWordList from '@pages/FlashCard/edit-word-list.jsx';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  // Kết nối WebSocket khi ứng dụng khởi động nếu người dùng đã đăng nhập
  useEffect(() => {
    // Kết nối WebSocket nếu đã đăng nhập
    if (localStorage.getItem('authToken')) {
      websocketService.connect()
        .then(() => {
          console.log('WebSocket kết nối thành công khi khởi động ứng dụng');
        })
        .catch(error => {
          console.error('Không thể kết nối WebSocket khi khởi động:', error);
        });
    }
    
    // Clean up khi unmount
    return () => {
      websocketService.disconnect();
    };
  }, []);
  
  return (
    <ThemeProvider>
      <UserProvider>
        <Router>
          <ScrollToTop />
          <div className="App bg-white dark:bg-dark-900 min-h-screen transition-colors duration-300">
            <Routes>
              {/* Layout cho các trang công khai */}
              <Route path="/" element={<><NavBar /><Outlet /><Footer /></>}>
                <Route index element={<Home />} />
                <Route path="courses" element={<CoursesNew />} />
                <Route path="courses-old" element={<Courses />} />
                <Route path="course/:courseId" element={<CourseDetailNew />} />
                <Route path="course-old/:courseId" element={<CourseDetail />} />
                <Route path="flash-card" element={<FlashCard />} />
                <Route path="ly-thuyet" element={<LyThuyet />} />
                <Route path="lo-trinh" element={<LearningPath />} />
                <Route path="topik1" element={<Topik1 />} />
                <Route path="topik2" element={<Topik2 />} />
                <Route path="topik-esp" element={<TopikESP />} />
                <Route path="nang-cap" element={<NangCap />} />
                <Route path="about" element={<About />} />
                <Route path="terms" element={<Terms />} />
                <Route path="privacy" element={<Privacy />} />
                <Route path="lien-he" element={<Contact />} />
                
                {/* Blog routes - chỉ đọc công khai */}
                <Route path="blog/:id" element={<PostDetail />} />
                <Route path="blog" element={<Blog />} />
              </Route>

              {/* FlashCard routes - chỉ luyện tập công khai */}
              <Route path="/flash-card/practice/:topicId" element={<><NavBar /><FlashCardPractice /><Footer /></>} />

              {/* Trang xác thực */}
              <Route path="/dang-nhap" element={<LoginPage />} />
              <Route path="/dang-ky" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              {/* Trang khóa học của tôi - yêu cầu đăng nhập */}
              <Route element={<ProtectedRoute />}>
                <Route path="/my-courses" element={<><NavBar /><MyCourses /><Footer /></>} />
              </Route>

              {/* Chỉ giữ trang profile cơ bản */}
              <Route element={<ProtectedRoute />}>
                <Route path="/profile" element={<><NavBar /><Profile /><Footer /></>} />
              </Route>
            </Routes>
          </div>
          
          {/* Đặt ToastContainer bên ngoài Router nhưng vẫn trong các Provider */}
          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="colored"
          />
        </Router>
      </UserProvider>
    </ThemeProvider>
  );
}

// Temporary placeholder components with dark mode support
const LyThuyet = () => <div className="min-h-[60vh] p-10 bg-white dark:bg-dark-900 text-gray-900 dark:text-gray-100">Lý thuyết</div>;
const LoTrinh = () => <div className="min-h-[60vh] p-10 bg-white dark:bg-dark-900 text-gray-900 dark:text-gray-100">Lộ trình</div>;
const LuyenTapTopik = () => <div className="min-h-[60vh] p-10 bg-white dark:bg-dark-900 text-gray-900 dark:text-gray-100">Luyện tập TOPIK</div>;
const Topik1 = () => <div className="min-h-[60vh] p-10 bg-white dark:bg-dark-900 text-gray-900 dark:text-gray-100">TOPIK I</div>;
const Topik2 = () => <div className="min-h-[60vh] p-10 bg-white dark:bg-dark-900 text-gray-900 dark:text-gray-100">TOPIK II</div>;
const TopikESP = () => <div className="min-h-[60vh] p-10 bg-white dark:bg-dark-900 text-gray-900 dark:text-gray-100">TOPIK ESP</div>;
const NangCap = () => <div className="min-h-[60vh] p-10 bg-white dark:bg-dark-900 text-gray-900 dark:text-gray-100">Nâng cấp</div>;
const Terms = () => <div className="min-h-[60vh] p-10 bg-white dark:bg-dark-900 text-gray-900 dark:text-gray-100">Điều khoản dịch vụ</div>;
const Privacy = () => <div className="min-h-[60vh] p-10 bg-white dark:bg-dark-900 text-gray-900 dark:text-gray-100">Chính sách bảo mật</div>;
const Contact = () => <div className="min-h-[60vh] p-10 bg-white dark:bg-dark-900 text-gray-900 dark:text-gray-100">Liên hệ</div>;

export default App;