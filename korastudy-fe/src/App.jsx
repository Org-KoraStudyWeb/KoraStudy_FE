import React from 'react';
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
// Import pages
import Home from '@pages/home.jsx';
import Courses from '@pages/Course/courses.jsx';
import CourseDetail from '@/pages/Course/course-details.jsx';
import Profile from '@/pages/profile.jsx';
// Import auth pages
import LoginPage from './pages/auth/LoginPage';
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
import Blog from '@pages/blog/blog.jsx';
import BlogPost from '@pages/blog/blog-post.jsx';
// Import Blog pages
import PostEditor from './pages/blog/PostEditor';
import PostDetail from './pages/blog/PostDetail';
// Import FlashCard pages
import FlashCard from '@pages/FlashCard/flash-card.jsx';
import FlashCardPractice from '@pages/FlashCard/flash-card-practice.jsx';
import CreateWordList from '@pages/FlashCard/create-word-list.jsx';
import EditWordList from '@pages/FlashCard/edit-word-list.jsx';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <ThemeProvider>
      <UserProvider>
        <Router>
          <ScrollToTop />
          {/* Thêm ToastContainer */}
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="colored"
          />

          <div className="App bg-white dark:bg-dark-900 min-h-screen transition-colors duration-300">
            <Routes>
              {/* Layout cho các trang công khai */}
              <Route path="/" element={<><NavBar /><Outlet /><Footer /></>}>
                <Route index element={<Home />} />
                <Route path="courses" element={<Courses />} />
                <Route path="course/:courseId" element={<CourseDetail />} />
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
                <Route path="de-thi/:examId" element={<ExamDetail />} />
                <Route path="exam/:id" element={<ExamDetail />} />
                <Route path="exam/:id/take" element={<ExamTest />} />
                <Route path="exam/:id/results" element={<ExamResults />} />
                <Route path="de-thi" element={<Exams />} />
                
                {/* Blog routes - public access */}
                <Route path="blog" element={<Blog />} />
                <Route path="blog/:id" element={<PostDetail />} />
              </Route>

              {/* FlashCard routes - some protected, some public */}
              <Route path="/flash-card/practice/:topicId" element={<><NavBar /><FlashCardPractice /><Footer /></>} />
              <Route path="/flash-card/practice/user/:listId" element={<><NavBar /><FlashCardPractice /><Footer /></>} />
              
              {/* Protected FlashCard routes */}
              <Route element={<ProtectedRoute />}>
                <Route path="/flash-card/create" element={<><NavBar /><CreateWordList /><Footer /></>} />
                <Route path="/flash-card/edit/:setId" element={<><NavBar /><EditWordList /><Footer /></>} />
              </Route>

              {/* Protected Blog routes - require login */}
              <Route element={<ProtectedRoute />}>
                <Route path="/blog/create" element={<><NavBar /><PostEditor /><Footer /></>} />
                <Route path="/blog/edit/:id" element={<><NavBar /><PostEditor /><Footer /></>} />
              </Route>

              {/* Trang xác thực */}
              <Route path="/dang-nhap" element={<LoginPage />} />
              <Route path="/dang-ky" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />

              {/* Các trang yêu cầu đăng nhập */}
              <Route element={<ProtectedRoute />}>
                <Route path="/profile" element={<><NavBar /><Profile /><Footer /></>} />
              </Route>
            </Routes>
          </div>
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