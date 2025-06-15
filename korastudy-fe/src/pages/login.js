import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, EyeOff, XCircle, CheckCircle } from 'lucide-react';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // Email validation function
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    
    setFormData(prev => ({
      ...prev,
      [name]: newValue
    }));

    // Clear errors when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }

    // Real-time validation for email
    if (name === 'email') {
      validateField(name, newValue);
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));
    validateField(name, formData[name]);
  };

  const validateField = (name, value) => {
    let error = '';

    switch (name) {
      case 'email':
        if (!value) {
          error = 'Vui lòng nhập địa chỉ email';
        } else if (!validateEmail(value)) {
          error = 'Địa chỉ email không hợp lệ';
        }
        break;

      case 'password':
        if (!value) {
          error = 'Vui lòng nhập mật khẩu';
        }
        break;

      default:
        break;
    }

    setErrors(prev => ({
      ...prev,
      [name]: error
    }));

    return error === '';
  };

  const validateForm = () => {
    const fields = ['email', 'password'];
    let isValid = true;

    fields.forEach(field => {
      const fieldIsValid = validateField(field, formData[field]);
      if (!fieldIsValid) {
        isValid = false;
      }
    });

    // Mark all fields as touched
    const touchedFields = {};
    fields.forEach(field => {
      touchedFields[field] = true;
    });
    setTouched(touchedFields);

    return isValid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      console.log('Login data:', formData);
      // Here you would typically send the data to your backend
      alert('Đăng nhập thành công!');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-dark-900">
      <NavBar />
      
      <div className="flex flex-1 min-h-[calc(100vh-160px)]">
        {/* Mobile: Single column, Desktop: Two columns */}
        <div className="w-full lg:w-1/2 bg-gradient-to-br from-primary-500 via-secondary-400 to-secondary-500 flex flex-col items-center justify-center p-4 lg:p-10 lg:rounded-r-custom relative shadow-custom">
          {/* Login Card */}
          <div className="w-full max-w-md bg-white dark:bg-dark-800 rounded-3xl p-6 lg:p-10 shadow-card my-4 lg:my-10">
            <h2 className="font-inter font-bold text-2xl lg:text-3xl text-gray-800 dark:text-gray-200 mb-6 lg:mb-8 text-center">
              Đăng nhập
            </h2>
            
            <form onSubmit={handleSubmit} className="w-full">
              {/* Email Field */}
              <div className="mb-4 lg:mb-5">
                <label htmlFor="email" className="block font-inter font-medium text-sm text-gray-700 dark:text-gray-300 mb-2">
                  Email:
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  placeholder="Nhập địa chỉ Email của bạn"
                  className={`w-full h-12 lg:h-11 bg-gray-50 dark:bg-dark-700 border-2 rounded-xl px-4 text-sm font-inter transition-all duration-300 outline-none placeholder-gray-400 dark:placeholder-gray-500 text-gray-900 dark:text-gray-100 ${
                    errors.email && touched.email
                      ? 'border-red-500 focus:border-red-500 focus:shadow-[0_0_0_3px_rgba(239,68,68,0.1)]'
                      : 'border-gray-200 dark:border-dark-600 focus:border-primary-500 focus:bg-white dark:focus:bg-dark-600 focus:shadow-[0_0_0_3px_rgba(52,188,249,0.1)]'
                  }`}
                  required
                />
                {errors.email && touched.email && (
                  <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                    <XCircle size={12} />
                    {errors.email}
                  </p>
                )}
                {!errors.email && touched.email && validateEmail(formData.email) && (
                  <p className="text-green-500 text-xs mt-1 flex items-center gap-1">
                    <CheckCircle size={12} />
                    Email hợp lệ
                  </p>
                )}
              </div>

              {/* Password Field */}
              <div className="mb-4 lg:mb-5">
                <label htmlFor="password" className="block font-inter font-medium text-sm text-gray-700 dark:text-gray-300 mb-2">
                  Mật khẩu:
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    placeholder="Nhập mật khẩu của bạn"
                    className={`w-full h-12 lg:h-11 bg-gray-50 dark:bg-dark-700 border-2 rounded-xl px-4 pr-12 text-sm font-inter transition-all duration-300 outline-none placeholder-gray-400 dark:placeholder-gray-500 text-gray-900 dark:text-gray-100 ${
                      errors.password && touched.password
                        ? 'border-red-500 focus:border-red-500 focus:shadow-[0_0_0_3px_rgba(239,68,68,0.1)]'
                        : 'border-gray-200 dark:border-dark-600 focus:border-primary-500 focus:bg-white dark:focus:bg-dark-600 focus:shadow-[0_0_0_3px_rgba(52,188,249,0.1)]'
                    }`}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-primary-500 transition-colors duration-300"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.password && touched.password && (
                  <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                    <XCircle size={12} />
                    {errors.password}
                  </p>
                )}
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 my-4 lg:my-6">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="rememberMe"
                    name="rememberMe"
                    checked={formData.rememberMe}
                    onChange={handleInputChange}
                    className="w-4 h-4 border-2 border-gray-300 dark:border-dark-600 rounded cursor-pointer accent-primary-500"
                  />
                  <label htmlFor="rememberMe" className="font-inter text-sm text-gray-700 dark:text-gray-300 cursor-pointer">
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
                className="w-full h-12 lg:h-12 bg-gradient-to-r from-primary-500 via-secondary-400 to-secondary-500 border-0 rounded-xl text-white font-inter font-semibold text-base cursor-pointer transition-all duration-300 mb-4 lg:mb-5 shadow-[0_4px_12px_rgba(52,188,249,0.3)] hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(52,188,249,0.4)] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:transform-none"
                disabled={Object.values(errors).some(error => error !== '')}
              >
                Đăng nhập
              </button>

              {/* Register Link */}
              <div className="text-center my-4 lg:my-5">
                <span className="font-inter text-sm text-gray-500 dark:text-gray-400">Bạn chưa có tài khoản? </span>
                <Link to="/dang-ky" className="font-inter font-semibold text-sm text-primary-500 hover:text-blue-600 hover:underline transition-colors duration-300">
                  Đăng ký ngay
                </Link>
              </div>

              {/* Google Login */}
              <button 
                type="button" 
                className="w-full h-12 bg-white dark:bg-dark-700 border-2 border-gray-200 dark:border-dark-600 rounded-xl flex items-center justify-center gap-3 cursor-pointer transition-all duration-300 my-4 lg:my-5 hover:border-gray-300 dark:hover:border-dark-500 hover:bg-gray-50 dark:hover:bg-dark-600"
              >
                <img src="/img_social/ic_google.png" alt="Google" className="w-5 h-5" />
                <span className="font-inter font-medium text-sm text-gray-700 dark:text-gray-300">Google</span>
              </button>
            </form>

            {/* Terms and Privacy */}
            <div className="text-center mt-6 lg:mt-8 pt-4 lg:pt-5 border-t border-gray-200 dark:border-dark-600">
              <Link to="/terms" className="font-inter text-xs text-gray-500 dark:text-gray-400 hover:text-primary-500 hover:underline transition-colors duration-300">
                Điều khoản dịch vụ
              </Link>
              <span className="font-inter text-xs text-gray-500 dark:text-gray-400 mx-1"> & </span>
              <Link to="/privacy" className="font-inter text-xs text-gray-500 dark:text-gray-400 hover:text-primary-500 hover:underline transition-colors duration-300">
                Chính sách bảo mật
              </Link>
            </div>
          </div>
        </div>

        {/* Right Side - Promotional Content (Hidden on mobile) */}
        <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-dark-800 dark:to-dark-700 relative flex-col items-center justify-center px-15 py-10 overflow-hidden">
          {/* Background Gradients */}
          <div className="absolute -top-25 -left-25 w-75 h-75 gradient-bg-1 rounded-full"></div>
          <div className="absolute -bottom-25 -right-25 w-100 h-100 gradient-bg-2 rounded-full"></div>
          
          {/* Main Content */}
          <div className="text-center z-10 mb-10">
            <h1 className="font-inter font-bold text-5xl leading-tight text-gray-800 dark:text-gray-200 mb-5 gradient-text">
              Để tiếng Hàn<br />
              không còn là trở ngại
            </h1>
            <p className="font-inter text-lg leading-relaxed text-gray-500 dark:text-gray-400">
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
