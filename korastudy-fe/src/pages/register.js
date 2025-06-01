import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import './register.css';

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
    <div className="register-page">
      <NavBar />
      
      <div className="register-container">
        {/* Left Side - Registration Form */}
        <div className="register-left">
          {/* Registration Card */}
          <div className="register-card">
            <h2 className="register-title">Đăng ký</h2>
            
            <form onSubmit={handleSubmit} className="register-form">
              {/* Full Name Field */}
              <div className="form-group">
                <label htmlFor="fullName" className="form-label">Họ và tên:</label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  placeholder="Nhập họ và tên của bạn"
                  className="form-input"
                  required
                />
              </div>

              {/* Email Field */}
              <div className="form-group">
                <label htmlFor="email" className="form-label">Email:</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Nhập địa chỉ Email của bạn"
                  className="form-input"
                  required
                />
              </div>

              {/* Password Field */}
              <div className="form-group">
                <label htmlFor="password" className="form-label">Mật khẩu:</label>
                <div className="password-input-wrapper">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Nhập mật khẩu của bạn"
                    className="form-input password-input"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="password-toggle"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Confirm Password Field */}
              <div className="form-group">
                <label htmlFor="confirmPassword" className="form-label">Xác nhận mật khẩu:</label>
                <div className="password-input-wrapper">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="Nhập lại mật khẩu của bạn"
                    className="form-input password-input"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="password-toggle"
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Terms Agreement */}
              <div className="form-options">
                <div className="agree-terms">
                  <input
                    type="checkbox"
                    id="agreeTerms"
                    name="agreeTerms"
                    checked={formData.agreeTerms}
                    onChange={handleInputChange}
                    className="checkbox"
                    required
                  />
                  <label htmlFor="agreeTerms" className="checkbox-label">
                    Tôi đồng ý với{' '}
                    <Link to="/terms" className="terms-link-inline">
                      Điều khoản dịch vụ
                    </Link>
                    {' '}và{' '}
                    <Link to="/privacy" className="terms-link-inline">
                      Chính sách bảo mật
                    </Link>
                  </label>
                </div>
              </div>

              {/* Register Button */}
              <button type="submit" className="register-button">
                Đăng ký
              </button>

              {/* Login Link */}
              <div className="login-prompt">
                <span className="login-text">Đã có tài khoản? </span>
                <Link to="/dang-nhap" className="login-link">
                  Đăng nhập ngay
                </Link>
              </div>

              {/* Google Register */}
              <button type="button" className="google-register">
                <img src="/img_social/ic_google.png" alt="Google" className="google-icon" />
                <span>Đăng ký với Google</span>
              </button>
            </form>

            {/* Terms and Privacy */}
            <div className="terms-section">
              <Link to="/terms" className="terms-link">Điều khoản dịch vụ</Link>
              <span className="terms-separator"> & </span>
              <Link to="/privacy" className="terms-link">Chính sách bảo mật</Link>
            </div>
          </div>
        </div>

        {/* Right Side - Promotional Content */}
        <div className="register-right">
          {/* Background Gradients */}
          <div className="gradient-bg-1"></div>
          <div className="gradient-bg-2"></div>
          
          {/* Main Content */}
          <div className="promo-content">
            <div className="promo-text">
              <h1 className="promo-title">
                Để tiếng Hàn<br />
                không còn là trở ngại
              </h1>
              <p className="promo-subtitle">
                Dễ dàng đạt được Level mong muốn với KoraStudy.com
              </p>
            </div>
          </div>

          {/* Korean Architecture Illustration */}
          <div className="korean-architecture">
            <img src="kit.png" alt="Korean traditional architecture" />
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Register;
