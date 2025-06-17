import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Mail } from 'lucide-react';
import NavBar from '../../components/NavBar';
import Footer from '../../components/Footer';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle forgot password logic here
    console.log('Reset password for:', email);
    setIsSubmitted(true);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      
      <div className="flex flex-1 min-h-[calc(100vh-160px)] bg-gradient-to-br from-blue-50 via-cyan-50 to-slate-50">
        {/* Left Side - Forgot Password Form */}
        <div className="w-1/2 bg-gradient-to-br from-primary-500 via-secondary-400 to-secondary-500 rounded-r-custom relative flex flex-col items-center justify-center p-10 shadow-custom">
          {/* Forgot Password Card */}
          <div className="w-full max-w-md bg-white rounded-3xl p-10 shadow-card">
            {/* Back to Login Link */}
            <div className="mb-6">
              <Link 
                to="/dang-nhap" 
                className="inline-flex items-center gap-2 text-gray-600 hover:text-primary-500 transition-colors duration-300 text-sm font-medium"
              >
                <ArrowLeft size={16} />
                Quay lại đăng nhập
              </Link>
            </div>

            {!isSubmitted ? (
              <>
                {/* Title and Description */}
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Mail className="w-8 h-8 text-primary-500" />
                  </div>
                  <h2 className="font-inter font-bold text-2xl text-gray-800 mb-3">
                    Quên mật khẩu?
                  </h2>
                  <p className="font-inter text-sm text-gray-600 leading-relaxed">
                    Đừng lo lắng! Nhập địa chỉ email của bạn và chúng tôi sẽ gửi 
                    link đặt lại mật khẩu cho bạn.
                  </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="w-full">
                  {/* Email Field */}
                  <div className="mb-6">
                    <label htmlFor="email" className="block font-inter font-medium text-sm text-gray-700 mb-2">
                      Địa chỉ Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Nhập địa chỉ email của bạn"
                      className="w-full h-12 bg-gray-50 border-2 border-gray-200 rounded-xl px-4 text-sm font-inter transition-all duration-300 outline-none focus:border-primary-500 focus:bg-white focus:shadow-[0_0_0_3px_rgba(52,188,249,0.1)] placeholder-gray-400"
                      required
                    />
                  </div>

                  {/* Submit Button */}
                  <button 
                    type="submit" 
                    className="w-full h-12 bg-gradient-to-r from-primary-500 via-secondary-400 to-secondary-500 border-0 rounded-xl text-white font-inter font-semibold text-base cursor-pointer transition-all duration-300 mb-6 shadow-[0_4px_12px_rgba(52,188,249,0.3)] hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(52,188,249,0.4)]"
                  >
                    Gửi link đặt lại mật khẩu
                  </button>

                  {/* Alternative Actions */}
                  <div className="text-center">
                    <p className="font-inter text-sm text-gray-600 mb-4">
                      Bạn nhớ mật khẩu rồi?
                    </p>
                    <Link 
                      to="/dang-nhap" 
                      className="font-inter font-semibold text-sm text-primary-500 hover:text-blue-600 hover:underline transition-colors duration-300"
                    >
                      Đăng nhập ngay
                    </Link>
                  </div>
                </form>
              </>
            ) : (
              <>
                {/* Success State */}
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h2 className="font-inter font-bold text-2xl text-gray-800 mb-3">
                    Email đã được gửi!
                  </h2>
                  <p className="font-inter text-sm text-gray-600 leading-relaxed mb-6">
                    Chúng tôi đã gửi link đặt lại mật khẩu đến địa chỉ email{' '}
                    <span className="font-semibold text-gray-800">{email}</span>
                    <br />
                    Vui lòng kiểm tra hộp thư của bạn.
                  </p>

                  {/* Action Buttons */}
                  <div className="space-y-3">
                    <button 
                      onClick={() => setIsSubmitted(false)}
                      className="w-full h-12 bg-gradient-to-r from-primary-500 via-secondary-400 to-secondary-500 border-0 rounded-xl text-white font-inter font-semibold text-base cursor-pointer transition-all duration-300 shadow-[0_4px_12px_rgba(52,188,249,0.3)] hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(52,188,249,0.4)]"
                    >
                      Gửi lại email
                    </button>
                    <Link 
                      to="/dang-nhap"
                      className="block w-full h-12 bg-white border-2 border-gray-200 rounded-xl text-gray-700 font-inter font-medium text-base cursor-pointer transition-all duration-300 hover:border-gray-300 hover:bg-gray-50 flex items-center justify-center"
                    >
                      Quay lại đăng nhập
                    </Link>
                  </div>

                  {/* Help Text */}
                  <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                    <p className="font-inter text-xs text-gray-600 leading-relaxed">
                      <strong>Không nhận được email?</strong><br />
                      Kiểm tra thư mục spam hoặc liên hệ với chúng tôi qua{' '}
                      <Link to="/lien-he" className="text-primary-500 hover:underline">
                        support@korastudy.com
                      </Link>
                    </p>
                  </div>
                </div>
              </>
            )}
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
              Đừng lo lắng!<br />
              Chúng tôi sẽ giúp bạn
            </h1>
            <p className="font-inter text-lg leading-relaxed text-gray-500">
              Khôi phục tài khoản và tiếp tục hành trình học tiếng Hàn của bạn
            </p>
          </div>

          {/* Illustration */}
          <div className="w-full max-w-lg z-10">
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-8 text-center">
              <div className="w-24 h-24 bg-primary-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-12 h-12 text-primary-500" />
              </div>
              <h3 className="font-inter font-semibold text-xl text-gray-700 mb-2">
                Bảo mật tài khoản
              </h3>
              <p className="font-inter text-sm text-gray-600">
                Chúng tôi luôn đảm bảo an toàn thông tin cá nhân của bạn
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ForgotPassword;
