import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert('Mật khẩu xác nhận không khớp!');
      return;
    }
    if (!formData.agreeTerms) {
      alert('Vui lòng đồng ý với điều khoản dịch vụ!');
      return;
    }
    console.log('Register data:', formData);
  };

  return (
    <div className="min-h-screen flex flex-col font-inter">
      <NavBar />
      
      <div className="flex flex-1 min-h-[calc(100vh-160px)] bg-gradient-to-br from-blue-50 via-cyan-50 to-slate-50">
        {/* Left Side - Registration Form */}
        <div className="w-full lg:w-1/2 bg-gradient-to-br from-primary-500 via-secondary-400 to-secondary-500 lg:rounded-r-[150px] relative flex flex-col items-center justify-center p-6 lg:p-10 shadow-[0_20px_40px_rgba(52,188,249,0.3)]">
          {/* Registration Card */}
          <div className="w-full max-w-[420px] bg-white rounded-[20px] p-6 lg:p-10 shadow-[0_10px_30px_rgba(0,0,0,0.1)] my-5">
            <h2 className="font-bold text-2xl lg:text-3xl text-gray-800 mb-6 lg:mb-8 text-center">
              Đăng ký
            </h2>
            
            <form onSubmit={handleSubmit} className="w-full space-y-4 lg:space-y-5">
              {/* Full Name Field */}
              <div>
                <label htmlFor="fullName" className="block font-medium text-sm text-gray-700 mb-1.5">
                  Họ và tên:
                </label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  placeholder="Nhập họ và tên của bạn"
                  className="w-full h-11 bg-gray-50 border-2 border-gray-200 rounded-xl px-4 text-sm transition-all duration-300 outline-none focus:border-primary-500 focus:bg-white focus:shadow-[0_0_0_3px_rgba(52,188,249,0.1)] placeholder-gray-400"
                  required
                />
              </div>

              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block font-medium text-sm text-gray-700 mb-1.5">
                  Email:
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Nhập địa chỉ Email của bạn"
                  className="w-full h-11 bg-gray-50 border-2 border-gray-200 rounded-xl px-4 text-sm transition-all duration-300 outline-none focus:border-primary-500 focus:bg-white focus:shadow-[0_0_0_3px_rgba(52,188,249,0.1)] placeholder-gray-400"
                  required
                />
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block font-medium text-sm text-gray-700 mb-1.5">
                  Mật khẩu:
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Nhập mật khẩu của bạn"
                    className="w-full h-11 bg-gray-50 border-2 border-gray-200 rounded-xl px-4 pr-12 text-sm transition-all duration-300 outline-none focus:border-primary-500 focus:bg-white focus:shadow-[0_0_0_3px_rgba(52,188,249,0.1)] placeholder-gray-400"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-primary-500 transition-colors duration-300"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Confirm Password Field */}
              <div>
                <label htmlFor="confirmPassword" className="block font-medium text-sm text-gray-700 mb-1.5">
                  Xác nhận mật khẩu:
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="Nhập lại mật khẩu của bạn"
                    className="w-full h-11 bg-gray-50 border-2 border-gray-200 rounded-xl px-4 pr-12 text-sm transition-all duration-300 outline-none focus:border-primary-500 focus:bg-white focus:shadow-[0_0_0_3px_rgba(52,188,249,0.1)] placeholder-gray-400"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-primary-500 transition-colors duration-300"
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Terms Agreement */}
              <div className="my-5">
                <div className="flex items-start gap-2">
                  <input
                    type="checkbox"
                    id="agreeTerms"
                    name="agreeTerms"
                    checked={formData.agreeTerms}
                    onChange={handleInputChange}
                    className="w-[18px] h-[18px] border-2 border-gray-300 rounded cursor-pointer accent-primary-500 mt-0.5 flex-shrink-0"
                    required
                  />
                  <label htmlFor="agreeTerms" className="text-[13px] text-gray-700 cursor-pointer leading-[1.4]">
                    Tôi đồng ý với{' '}
                    <Link to="/terms" className="text-primary-500 font-medium hover:underline">
                      Điều khoản dịch vụ
                    </Link>
                    {' '}và{' '}
                    <Link to="/privacy" className="text-primary-500 font-medium hover:underline">
                      Chính sách bảo mật
                    </Link>
                  </label>
                </div>
              </div>

              {/* Register Button */}
              <button 
                type="submit" 
                className="w-full h-12 bg-gradient-to-r from-primary-500 via-secondary-400 to-secondary-500 border-0 rounded-xl text-white font-semibold text-base cursor-pointer transition-all duration-300 mb-5 shadow-[0_4px_12px_rgba(52,188,249,0.3)] hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(52,188,249,0.4)]"
              >
                Đăng ký
              </button>

              {/* Login Link */}
              <div className="text-center my-5">
                <span className="text-sm text-gray-500">Đã có tài khoản? </span>
                <Link to="/dang-nhap" className="font-semibold text-sm text-primary-500 hover:text-blue-600 hover:underline transition-colors duration-300">
                  Đăng nhập ngay
                </Link>
              </div>

              {/* Google Register */}
              <button 
                type="button" 
                className="w-full h-12 bg-white border-2 border-gray-200 rounded-xl flex items-center justify-center gap-3 cursor-pointer transition-all duration-300 my-5 hover:border-gray-300 hover:bg-gray-50"
              >
                <img src="/img_social/ic_google.png" alt="Google" className="w-5 h-5" />
                <span className="font-medium text-sm text-gray-700">Đăng ký với Google</span>
              </button>
            </form>

            {/* Terms and Privacy */}
            <div className="text-center mt-6 pt-5 border-t border-gray-200">
              <Link to="/terms" className="text-xs text-gray-500 hover:text-primary-500 hover:underline transition-colors duration-300">
                Điều khoản dịch vụ
              </Link>
              <span className="text-xs text-gray-500 mx-1"> & </span>
              <Link to="/privacy" className="text-xs text-gray-500 hover:text-primary-500 hover:underline transition-colors duration-300">
                Chính sách bảo mật
              </Link>
            </div>
          </div>
        </div>

        {/* Right Side - Promotional Content */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-50 to-cyan-50 relative flex-col items-center justify-center px-10 py-15 overflow-hidden">
          {/* Background Gradients */}
          <div className="absolute -top-[100px] -left-[100px] w-[300px] h-[300px] gradient-bg-1 rounded-full"></div>
          <div className="absolute -bottom-[100px] -right-[100px] w-[400px] h-[400px] gradient-bg-2 rounded-full"></div>
          
          {/* Main Content */}
          <div className="text-center z-10 mb-10">
            <h1 className="font-bold text-[42px] leading-[1.2] text-gray-800 mb-5 gradient-text">
              Để tiếng Hàn<br />
              không còn là trở ngại
            </h1>
            <p className="text-lg leading-[1.6] text-gray-500 m-0">
              Dễ dàng đạt được Level mong muốn với KoraStudy.com
            </p>
          </div>

          {/* Korean Architecture Illustration */}
          <div className="w-full max-w-[500px] z-10">
            <img 
              src="kit.png" 
              alt="Korean traditional architecture" 
              className="w-full h-auto object-contain drop-shadow-[0_10px_30px_rgba(0,0,0,0.1)]"
            />
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Register;
