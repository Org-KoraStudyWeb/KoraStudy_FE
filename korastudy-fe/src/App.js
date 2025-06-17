import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar';
import Footer from './components/Footer';
import Home from './pages/home';
import Courses from './pages/courses';
import CourseDetail from './pages/course-details';
import Login from './pages/login';
import Register from './pages/register';
import ForgotPassword from './pages/forgot-password';
import Exams from './pages/exam';
import ExamDetail from './pages/exam-detail';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
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
          {/* <Route path="/de-thi" element={<><NavBar /><DeThi /><Footer /></>} />
          <Route path="/de-thi/topik1" element={<><NavBar /><DeThiTopik1 /><Footer /></>} />
          <Route path="/de-thi/topik2" element={<><NavBar /><DeThiTopik2 /><Footer /></>} /> */}
          <Route path="/de-thi/topik-esp" element={<><NavBar /><DeThiTopikESP /><Footer /></>} />
          <Route path="/nang-cap" element={<><NavBar /><NangCap /><Footer /></>} />
          <Route path="/about" element={<><NavBar /><About /><Footer /></>} />
          <Route path="/terms" element={<><NavBar /><Terms /><Footer /></>} />
          <Route path="/privacy" element={<><NavBar /><Privacy /><Footer /></>} />
          <Route path="/lien-he" element={<><NavBar /><Contact /><Footer /></>} />
          <Route path="/de-thi" element={<Exams />}/>
           <Route path="/de-thi/:examId" element={<><NavBar /><ExamDetail /><Footer /></>} />
        </Routes>
      </div>
    </Router>
  );
}

// Temporary placeholder components
const TaiLieu = () => <div style={{minHeight: '60vh', padding: '40px'}}>Tài liệu</div>;
const LyThuyet = () => <div style={{minHeight: '60vh', padding: '40px'}}>Lý thuyết</div>;
const LoTrinh = () => <div style={{minHeight: '60vh', padding: '40px'}}>Lộ trình</div>;
const LuyenTapTopik = () => <div style={{minHeight: '60vh', padding: '40px'}}>Luyện tập TOPIK</div>;
const Topik1 = () => <div style={{minHeight: '60vh', padding: '40px'}}>TOPIK 1</div>;
const Topik2 = () => <div style={{minHeight: '60vh', padding: '40px'}}>TOPIK 2</div>;
const TopikESP = () => <div style={{minHeight: '60vh', padding: '40px'}}>TOPIK ESP</div>;
const DeThi = () => <div style={{minHeight: '60vh', padding: '40px'}}>Đề thi</div>;
const DeThiTopik1 = () => <div style={{minHeight: '60vh', padding: '40px'}}>Đề thi TOPIK 1</div>;
const DeThiTopik2 = () => <div style={{minHeight: '60vh', padding: '40px'}}>Đề thi TOPIK 2</div>;
const DeThiTopikESP = () => <div style={{minHeight: '60vh', padding: '40px'}}>Đề thi TOPIK ESP</div>;
const NangCap = () => <div style={{minHeight: '60vh', padding: '40px'}}>Nâng cấp</div>;
const About = () => <div style={{minHeight: '60vh', padding: '40px'}}>Về StudyKora</div>;
const Terms = () => <div style={{minHeight: '60vh', padding: '40px'}}>Điều khoản dịch vụ</div>;
const Privacy = () => <div style={{minHeight: '60vh', padding: '40px'}}>Chính sách bảo mật</div>;
const Contact = () => <div style={{minHeight: '60vh', padding: '40px'}}>Liên hệ</div>;

export default App;
