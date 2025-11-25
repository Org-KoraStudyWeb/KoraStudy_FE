import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Mail } from "lucide-react";
import NavBar from "@components/NavBar";
import Footer from "@components/Footer";
import authService from "../../api/authService";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validation tốt hơn
    if (!email.trim()) {
      setError("Vui lòng nhập địa chỉ email");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Địa chỉ email không hợp lệ");
      return;
    }

    try {
      setLoading(true);
      await authService.forgotPassword(email);
      setIsSubmitted(true);
    } catch (err) {
      console.error("Forgot password error:", err);
      const message = err?.message || "Gửi email thất bại. Vui lòng thử lại.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      setResendLoading(true);
      await authService.forgotPassword(email);
      // Có thể thêm toast message thành công
    } catch (err) {
      setError(err?.message || "Gửi lại email thất bại");
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-dark-900">
      <NavBar />

      <div className="flex flex-1 min-h-[calc(100vh-160px)]">
        {/* Left Side - Form */}
        <div className="w-full lg:w-1/2 bg-gradient-to-br from-primary-500 via-secondary-400 to-secondary-500 flex flex-col items-center justify-center p-4 lg:p-10 lg:rounded-r-custom relative shadow-custom">
          <div className="w-full max-w-md bg-white dark:bg-dark-800 rounded-3xl p-6 lg:p-10 shadow-card">
            {/* Back to Login Link */}
            <div className="mb-4 lg:mb-6">
              <Link
                to="/dang-nhap"
                className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-primary-500 transition-colors duration-300 text-sm font-medium"
              >
                <ArrowLeft size={16} />
                Quay lại đăng nhập
              </Link>
            </div>

            {!isSubmitted ? (
              <>
                {/* Title and Description */}
                <div className="text-center mb-6 lg:mb-8">
                  <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Mail className="w-8 h-8 text-primary-500" />
                  </div>
                  <h2 className="font-inter font-bold text-xl lg:text-2xl text-gray-800 dark:text-gray-200 mb-3">
                    Quên mật khẩu?
                  </h2>
                  <p className="font-inter text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                    Đừng lo lắng! Nhập địa chỉ email của bạn và chúng tôi sẽ gửi
                    link đặt lại mật khẩu cho bạn.
                  </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="w-full">
                  {/* Email Field */}
                  <div className="mb-6">
                    <label
                      htmlFor="email"
                      className="block font-inter font-medium text-sm text-gray-700 dark:text-gray-300 mb-2"
                    >
                      Địa chỉ Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Nhập địa chỉ email của bạn"
                      className="w-full h-12 bg-gray-50 dark:bg-dark-700 border-2 border-gray-200 dark:border-dark-600 rounded-xl px-4 text-sm font-inter transition-all duration-300 outline-none focus:border-primary-500 focus:bg-white dark:focus:bg-dark-600 focus:shadow-[0_0_0_3px_rgba(52,188,249,0.1)] placeholder-gray-400 dark:placeholder-gray-500 text-gray-900 dark:text-gray-100"
                      required
                      autoFocus
                      disabled={loading}
                    />
                  </div>

                  {/* Error Message */}
                  {error && (
                    <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                      <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-2">
                        <svg
                          className="w-4 h-4 flex-shrink-0"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                            clipRule="evenodd"
                          />
                        </svg>
                        {error}
                      </p>
                    </div>
                  )}

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className={`w-full h-12 bg-gradient-to-r from-primary-500 via-secondary-400 to-secondary-500 border-0 rounded-xl text-white font-inter font-semibold text-base cursor-pointer transition-all duration-300 mb-6 shadow-[0_4px_12px_rgba(52,188,249,0.3)] hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(52,188,249,0.4)] ${
                      loading ? "opacity-70 cursor-wait" : ""
                    } flex items-center justify-center gap-2`}
                  >
                    {loading && (
                      <svg
                        className="animate-spin h-4 w-4 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                    )}
                    {loading ? "Đang gửi..." : "Gửi link đặt lại mật khẩu"}
                  </button>

                  {/* Alternative Actions */}
                  <div className="text-center">
                    <p className="font-inter text-sm text-gray-600 dark:text-gray-400 mb-4">
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
                  <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg
                      className="w-8 h-8 text-green-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <h2 className="font-inter font-bold text-xl lg:text-2xl text-gray-800 dark:text-gray-200 mb-3">
                    Email đã được gửi!
                  </h2>
                  <p className="font-inter text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-6">
                    Chúng tôi đã gửi link đặt lại mật khẩu đến địa chỉ email{" "}
                    <span className="font-semibold text-gray-800 dark:text-gray-200">
                      {email}
                    </span>
                    <br />
                    Vui lòng kiểm tra hộp thư của bạn.
                  </p>

                  {/* Action Buttons */}
                  <div className="space-y-3">
                    <button
                      onClick={handleResend}
                      disabled={resendLoading}
                      className={`w-full h-12 bg-gradient-to-r from-primary-500 via-secondary-400 to-secondary-500 border-0 rounded-xl text-white font-inter font-semibold text-base cursor-pointer transition-all duration-300 shadow-[0_4px_12px_rgba(52,188,249,0.3)] hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(52,188,249,0.4)] ${
                        resendLoading ? "opacity-70 cursor-wait" : ""
                      } flex items-center justify-center gap-2`}
                    >
                      {resendLoading && (
                        <svg
                          className="animate-spin h-4 w-4 text-white"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                      )}
                      {resendLoading ? "Đang gửi..." : "Gửi lại email"}
                    </button>
                    <Link
                      to="/dang-nhap"
                      className="block w-full h-12 bg-white dark:bg-dark-700 border-2 border-gray-200 dark:border-dark-600 rounded-xl text-gray-700 dark:text-gray-300 font-inter font-medium text-base cursor-pointer transition-all duration-300 hover:border-gray-300 dark:hover:border-dark-500 hover:bg-gray-50 dark:hover:bg-dark-600 flex items-center justify-center"
                    >
                      Quay lại đăng nhập
                    </Link>
                  </div>

                  {/* Help Text */}
                  <div className="mt-6 p-4 bg-gray-50 dark:bg-dark-700 rounded-lg">
                    <p className="font-inter text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                      <strong>Không nhận được email?</strong>
                      <br />
                      Kiểm tra thư mục spam hoặc liên hệ với chúng tôi qua{" "}
                      <Link
                        to="/lien-he"
                        className="text-primary-500 hover:underline"
                      >
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
        <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-dark-800 dark:to-dark-700 relative flex-col items-center justify-center px-15 py-10 overflow-hidden">
          {/* Background Gradients */}
          <div className="absolute -top-25 -left-25 w-75 h-75 gradient-bg-1 rounded-full"></div>
          <div className="absolute -bottom-25 -right-25 w-100 h-100 gradient-bg-2 rounded-full"></div>

          {/* Main Content */}
          <div className="text-center z-10 mb-10">
            <h1 className="font-inter font-bold text-5xl leading-tight text-gray-800 dark:text-gray-200 mb-5 gradient-text">
              Đừng lo lắng!
              <br />
              Chúng tôi sẽ giúp bạn
            </h1>
            <p className="font-inter text-lg leading-relaxed text-gray-500 dark:text-gray-400">
              Khôi phục tài khoản và tiếp tục hành trình học tiếng Hàn của bạn
            </p>
          </div>

          {/* Illustration */}
          <div className="w-full max-w-lg z-10">
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-8 text-center">
              <div className="w-24 h-24 bg-primary-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-12 h-12 text-primary-500" />
              </div>
              <h3 className="font-inter font-semibold text-xl text-gray-700 dark:text-gray-300 mb-2">
                Bảo mật tài khoản
              </h3>
              <p className="font-inter text-sm text-gray-600 dark:text-gray-400">
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
