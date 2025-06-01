import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import './login.css';

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
    <div className="login-page">
      <NavBar />
      
      <div className="login-container">
        {/* Left Side - Login Form */}
        <div className="login-left">
          {/* Logo Section */}
          {/* <div className="logo-section">
            <div className="logo-content">
              <h1 className="logo-text">KoraStudy</h1>
              <div className="logo-icon">
                <img src="/api/placeholder/40/40" alt="KoraStudy Icon" />
              </div>
            </div>
          </div> */}

          {/* Login Card */}
          <div className="login-card">
            <h2 className="login-title">Đăng nhập</h2>
            
            <form onSubmit={handleSubmit} className="login-form">
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
                <label htmlFor="password" className="form-label">Password:</label>
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

              {/* Remember Me & Forgot Password */}
              <div className="form-options">
                <div className="remember-me">
                  <input
                    type="checkbox"
                    id="rememberMe"
                    name="rememberMe"
                    checked={formData.rememberMe}
                    onChange={handleInputChange}
                    className="checkbox"
                  />
                  <label htmlFor="rememberMe" className="checkbox-label">
                    Ghi nhớ
                  </label>
                </div>
                <Link to="/forgot-password" className="forgot-password">
                  Quên mật khẩu?
                </Link>
              </div>

              {/* Login Button */}
              <button type="submit" className="login-button">
                Đăng nhập
              </button>

              {/* Register Link */}
              <div className="register-prompt">
                <span className="register-text">Bạn chưa có tài khoản? </span>
                <Link to="/dang-ky" className="register-link">
                  Đăng ký ngay
                </Link>
              </div>

              {/* Google Login */}
              <button type="button" className="google-login">
                <img src="/img_social/ic_google.png" alt="Google" className="google-icon" />
                <span>Google</span>
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
        <div className="login-right">
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

export default Login;
