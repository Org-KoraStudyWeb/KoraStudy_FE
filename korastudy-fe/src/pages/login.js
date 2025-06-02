import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
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
    console.log('Login data:', formData);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      
      <div className="flex flex-1 min-h-[calc(100vh-160px)] bg-gradient-to-br from-blue-50 via-cyan-50 to-slate-50">
        {/* Left Side - Login Form */}
        <div className="w-1/2 bg-gradient-to-br from-primary-500 via-secondary-400 to-secondary-500 rounded-r-custom relative flex flex-col items-center justify-center p-10 shadow-custom">
          {/* Login Card */}
          <div className="w-full max-w-md bg-white rounded-3xl p-10 shadow-card mt-15 mb-10">
            <h2 className="font-inter font-bold text-3xl text-gray-800 mb-8 text-center">
              Đăng nhập
            </h2>
            
            <form onSubmit={handleSubmit} className="w-full">
              {/* Email Field */}
              <div className="mb-5">
                <label htmlFor="email" className="block font-inter font-medium text-sm text-gray-700 mb-2">
                  Email:
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Nhập địa chỉ Email của bạn"
                  className="w-full h-11 bg-gray-50 border-2 border-gray-200 rounded-xl px-4 text-sm font-inter transition-all duration-300 outline-none focus:border-primary-500 focus:bg-white focus:shadow-[0_0_0_3px_rgba(52,188,249,0.1)] placeholder-gray-400"
                  required
                />
              </div>

              {/* Password Field */}
              <div className="mb-5">
                <label htmlFor="password" className="block font-inter font-medium text-sm text-gray-700 mb-2">
                  Password:
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Nhập mật khẩu của bạn"
                    className="w-full h-11 bg-gray-50 border-2 border-gray-200 rounded-xl px-4 pr-12 text-sm font-inter transition-all duration-300 outline-none focus:border-primary-500 focus:bg-white focus:shadow-[0_0_0_3px_rgba(52,188,249,0.1)] placeholder-gray-400"
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

              {/* Remember Me & Forgot Password */}
              <div className="flex justify-between items-center my-6">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="rememberMe"
                    name="rememberMe"
                    checked={formData.rememberMe}
                    onChange={handleInputChange}
                    className="w-4 h-4 border-2 border-gray-300 rounded cursor-pointer accent-primary-500"
                  />
                  <label htmlFor="rememberMe" className="font-inter text-sm text-gray-700 cursor-pointer">
                    Ghi nhớ
                  </label>
                </div>
                <Link to="/forgot-password" className="font-inter text-sm text-primary-500 hover:text-blue-600 hover:underline transition-colors duration-300">
                  Quên mật khẩu?
                </Link>
              </div>

              {/* Login Button */}
              <button 
                type="submit" 
                className="w-full h-12 bg-gradient-to-r from-primary-500 via-secondary-400 to-secondary-500 border-0 rounded-xl text-white font-inter font-semibold text-base cursor-pointer transition-all duration-300 mb-5 shadow-[0_4px_12px_rgba(52,188,249,0.3)] hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(52,188,249,0.4)]"
              >
                Đăng nhập
              </button>

              {/* Register Link */}
              <div className="text-center my-5">
                <span className="font-inter text-sm text-gray-500">Bạn chưa có tài khoản? </span>
                <Link to="/dang-ky" className="font-inter font-semibold text-sm text-primary-500 hover:text-blue-600 hover:underline transition-colors duration-300">
                  Đăng ký ngay
                </Link>
              </div>

              {/* Google Login */}
              <button 
                type="button" 
                className="w-full h-12 bg-white border-2 border-gray-200 rounded-xl flex items-center justify-center gap-3 cursor-pointer transition-all duration-300 my-5 hover:border-gray-300 hover:bg-gray-50"
              >
                <img src="/img_social/ic_google.png" alt="Google" className="w-5 h-5" />
                <span className="font-inter font-medium text-sm text-gray-700">Google</span>
              </button>
            </form>

            {/* Terms and Privacy */}
            <div className="text-center mt-8 pt-5 border-t border-gray-200">
              <Link to="/terms" className="font-inter text-xs text-gray-500 hover:text-primary-500 hover:underline transition-colors duration-300">
                Điều khoản dịch vụ
              </Link>
              <span className="font-inter text-xs text-gray-500 mx-1"> & </span>
              <Link to="/privacy" className="font-inter text-xs text-gray-500 hover:text-primary-500 hover:underline transition-colors duration-300">
                Chính sách bảo mật
              </Link>
            </div>
          </div>
        </div>

        {/* Right Side - Promotional Content */}
        <div className="w-1/2 bg-gradient-to-br from-blue-50 to-cyan-50 relative flex flex-col items-center justify-center px-15 py-10 overflow-hidden">
          {/* Background Gradients */}
          <div className="absolute -top-25 -left-25 w-75 h-75 gradient-bg-1 rounded-full"></div>
          <div className="absolute -bottom-25 -right-25 w-100 h-100 gradient-bg-2 rounded-full"></div>
          
          {/* Main Content */}
          <div className="text-center z-10 mb-10">
            <h1 className="font-inter font-bold text-5xl leading-tight text-gray-800 mb-5 gradient-text">
              Để tiếng Hàn<br />
              không còn là trở ngại
            </h1>
            <p className="font-inter text-lg leading-relaxed text-gray-500">
              Dễ dàng đạt được Level mong muốn với KoraStudy.com
            </p>
          </div>

          {/* Korean Architecture Illustration */}
          <div className="w-full max-w-lg z-10">
            <img 
              src="background.png" 
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

export default Login;
