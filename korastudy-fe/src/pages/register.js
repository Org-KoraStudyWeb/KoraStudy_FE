import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, EyeOff, CheckCircle, XCircle } from 'lucide-react';
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
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // Email validation function
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Password validation function
  const validatePassword = (password) => {
    const validations = {
      length: password.length >= 10,
      uppercase: /[A-Z]/.test(password),
      number: /\d/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    };
    
    return {
      isValid: Object.values(validations).every(Boolean),
      validations
    };
  };

  // Get password strength
  const getPasswordStrength = (password) => {
    const { validations } = validatePassword(password);
    const score = Object.values(validations).filter(Boolean).length;
    
    if (score === 0) return { strength: 'none', color: 'gray', text: '' };
    if (score <= 2) return { strength: 'weak', color: 'red', text: 'Yếu' };
    if (score === 3) return { strength: 'medium', color: 'yellow', text: 'Trung bình' };
    return { strength: 'strong', color: 'green', text: 'Mạnh' };
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

    // Real-time validation
    validateField(name, newValue);
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
      case 'fullName':
        if (!value.trim()) {
          error = 'Vui lòng nhập họ và tên';
        } else if (value.trim().length < 2) {
          error = 'Họ và tên phải có ít nhất 2 ký tự';
        }
        break;

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
        } else {
          const { isValid } = validatePassword(value);
          if (!isValid) {
            error = 'Mật khẩu không đáp ứng yêu cầu bảo mật';
          }
        }
        break;

      case 'confirmPassword':
        if (!value) {
          error = 'Vui lòng xác nhận mật khẩu';
        } else if (value !== formData.password) {
          error = 'Mật khẩu xác nhận không khớp';
        }
        break;

      case 'agreeTerms':
        if (!value) {
          error = 'Vui lòng đồng ý với điều khoản dịch vụ';
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
    const fields = ['fullName', 'email', 'password', 'confirmPassword', 'agreeTerms'];
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
      console.log('Register data:', formData);
      // Here you would typically send the data to your backend
      alert('Đăng ký thành công!');
    }
  };

  const passwordStrength = getPasswordStrength(formData.password);
  const passwordValidation = validatePassword(formData.password);

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      
      <div className="flex flex-1 min-h-[calc(100vh-160px)] bg-gradient-to-br from-blue-50 via-cyan-50 to-slate-50">
        {/* Left Side - Registration Form */}
        <div className="w-1/2 bg-gradient-to-br from-primary-500 via-secondary-400 to-secondary-500 rounded-r-custom relative flex flex-col items-center justify-center p-10 shadow-custom">
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
                  onBlur={handleBlur}
                  placeholder="Nhập họ và tên của bạn"
                  className={`w-full h-11 bg-gray-50 border-2 rounded-xl px-4 text-sm transition-all duration-300 outline-none placeholder-gray-400 ${
                    errors.fullName && touched.fullName
                      ? 'border-red-500 focus:border-red-500 focus:shadow-[0_0_0_3px_rgba(239,68,68,0.1)]'
                      : 'border-gray-200 focus:border-primary-500 focus:bg-white focus:shadow-[0_0_0_3px_rgba(52,188,249,0.1)]'
                  }`}
                  required
                />
                {errors.fullName && touched.fullName && (
                  <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                    <XCircle size={12} />
                    {errors.fullName}
                  </p>
                )}
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
                  onBlur={handleBlur}
                  placeholder="Nhập địa chỉ Email của bạn"
                  className={`w-full h-11 bg-gray-50 border-2 rounded-xl px-4 text-sm transition-all duration-300 outline-none placeholder-gray-400 ${
                    errors.email && touched.email
                      ? 'border-red-500 focus:border-red-500 focus:shadow-[0_0_0_3px_rgba(239,68,68,0.1)]'
                      : 'border-gray-200 focus:border-primary-500 focus:bg-white focus:shadow-[0_0_0_3px_rgba(52,188,249,0.1)]'
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
                    onBlur={handleBlur}
                    placeholder="Nhập mật khẩu của bạn"
                    className={`w-full h-11 bg-gray-50 border-2 rounded-xl px-4 pr-12 text-sm transition-all duration-300 outline-none placeholder-gray-400 ${
                      errors.password && touched.password
                        ? 'border-red-500 focus:border-red-500 focus:shadow-[0_0_0_3px_rgba(239,68,68,0.1)]'
                        : 'border-gray-200 focus:border-primary-500 focus:bg-white focus:shadow-[0_0_0_3px_rgba(52,188,249,0.1)]'
                    }`}
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

                {/* Password Strength Indicator */}
                {formData.password && (
                  <div className="mt-2">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all duration-300 ${
                            passwordStrength.strength === 'weak' ? 'bg-red-500 w-1/4' :
                            passwordStrength.strength === 'medium' ? 'bg-yellow-500 w-2/4' :
                            passwordStrength.strength === 'strong' ? 'bg-green-500 w-full' : 'w-0'
                          }`}
                        ></div>
                      </div>
                      {passwordStrength.text && (
                        <span className={`text-xs font-medium text-${passwordStrength.color}-500`}>
                          {passwordStrength.text}
                        </span>
                      )}
                    </div>

                    {/* Password Requirements */}
                    <div className="space-y-1">
                      <div className={`flex items-center gap-2 text-xs ${
                        passwordValidation.validations.length ? 'text-green-500' : 'text-gray-500'
                      }`}>
                        {passwordValidation.validations.length ? <CheckCircle size={12} /> : <XCircle size={12} />}
                        <span>Ít nhất 10 ký tự</span>
                      </div>
                      <div className={`flex items-center gap-2 text-xs ${
                        passwordValidation.validations.uppercase ? 'text-green-500' : 'text-gray-500'
                      }`}>
                        {passwordValidation.validations.uppercase ? <CheckCircle size={12} /> : <XCircle size={12} />}
                        <span>Có chữ hoa</span>
                      </div>
                      <div className={`flex items-center gap-2 text-xs ${
                        passwordValidation.validations.number ? 'text-green-500' : 'text-gray-500'
                      }`}>
                        {passwordValidation.validations.number ? <CheckCircle size={12} /> : <XCircle size={12} />}
                        <span>Có số</span>
                      </div>
                      <div className={`flex items-center gap-2 text-xs ${
                        passwordValidation.validations.special ? 'text-green-500' : 'text-gray-500'
                      }`}>
                        {passwordValidation.validations.special ? <CheckCircle size={12} /> : <XCircle size={12} />}
                        <span>Có ký tự đặc biệt</span>
                      </div>
                    </div>
                  </div>
                )}

                {errors.password && touched.password && (
                  <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                    <XCircle size={12} />
                    {errors.password}
                  </p>
                )}
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
                    onBlur={handleBlur}
                    placeholder="Nhập lại mật khẩu của bạn"
                    className={`w-full h-11 bg-gray-50 border-2 rounded-xl px-4 pr-12 text-sm transition-all duration-300 outline-none placeholder-gray-400 ${
                      errors.confirmPassword && touched.confirmPassword
                        ? 'border-red-500 focus:border-red-500 focus:shadow-[0_0_0_3px_rgba(239,68,68,0.1)]'
                        : 'border-gray-200 focus:border-primary-500 focus:bg-white focus:shadow-[0_0_0_3px_rgba(52,188,249,0.1)]'
                    }`}
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
                {errors.confirmPassword && touched.confirmPassword && (
                  <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                    <XCircle size={12} />
                    {errors.confirmPassword}
                  </p>
                )}
                {!errors.confirmPassword && touched.confirmPassword && formData.confirmPassword && formData.password === formData.confirmPassword && (
                  <p className="text-green-500 text-xs mt-1 flex items-center gap-1">
                    <CheckCircle size={12} />
                    Mật khẩu khớp
                  </p>
                )}
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
                    onBlur={handleBlur}
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
                {errors.agreeTerms && touched.agreeTerms && (
                  <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                    <XCircle size={12} />
                    {errors.agreeTerms}
                  </p>
                )}
              </div>

              {/* Register Button */}
              <button 
                type="submit" 
                className="w-full h-12 bg-gradient-to-r from-primary-500 via-secondary-400 to-secondary-500 border-0 rounded-xl text-white font-semibold text-base cursor-pointer transition-all duration-300 mb-5 shadow-[0_4px_12px_rgba(52,188,249,0.3)] hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(52,188,249,0.4)] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:transform-none"
                disabled={Object.values(errors).some(error => error !== '') || !formData.agreeTerms}
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

export default Register;
