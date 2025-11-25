// src/components/auth/ResetPassword.jsx
import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import {
  Eye,
  EyeOff,
  CheckCircle,
  XCircle,
  Loader2,
  Lock,
  ArrowLeft,
} from "lucide-react";
import authService from "../../api/authService";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");

  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isValidating, setIsValidating] = useState(true);
  const [isTokenValid, setIsTokenValid] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    const validateToken = async () => {
      if (!token) {
        setMessage({
          type: "error",
          text: "Token không hợp lệ hoặc không tồn tại",
        });
        setIsValidating(false);
        return;
      }

      try {
        await authService.validateResetToken(token);
        setIsTokenValid(true);
      } catch (error) {
        setMessage({
          type: "error",
          text: error.message || "Token không hợp lệ hoặc đã hết hạn",
        });
      } finally {
        setIsValidating(false);
      }
    };

    validateToken();
  }, [token]);

  const validatePassword = (password) => {
    const validations = {
      length: password.length >= 6,
    };
    return {
      isValid: Object.values(validations).every(Boolean),
      validations,
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.newPassword || !formData.confirmPassword) {
      setMessage({ type: "error", text: "Vui lòng nhập đầy đủ thông tin" });
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setMessage({ type: "error", text: "Mật khẩu xác nhận không khớp" });
      return;
    }

    if (!validatePassword(formData.newPassword).isValid) {
      setMessage({ type: "error", text: "Mật khẩu phải có ít nhất 6 ký tự" });
      return;
    }

    setIsLoading(true);
    setMessage({ type: "", text: "" });

    try {
      await authService.resetPassword(token, formData.newPassword);
      setMessage({
        type: "success",
        text: "Đặt lại mật khẩu thành công! Bạn sẽ được chuyển hướng đến trang đăng nhập.",
      });

      setTimeout(() => {
        navigate("/dang-nhap");
      }, 3000);
    } catch (error) {
      setMessage({
        type: "error",
        text: error.message || "Có lỗi xảy ra. Vui lòng thử lại sau.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const passwordValidation = validatePassword(formData.newPassword);

  if (isValidating) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-dark-800 dark:to-dark-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white dark:bg-dark-800 rounded-3xl shadow-card p-8 text-center">
          <Loader2 className="animate-spin mx-auto h-12 w-12 text-primary-500 mb-4" />
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
            Đang xác thực...
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Vui lòng chờ trong giây lát
          </p>
        </div>
      </div>
    );
  }

  if (!isTokenValid) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-dark-800 dark:to-dark-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white dark:bg-dark-800 rounded-3xl shadow-card p-8 text-center">
          <XCircle className="mx-auto h-12 w-12 text-red-500 mb-4" />
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
            Link không hợp lệ
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {message.text}
          </p>
          <Link
            to="/quen-mat-khau"
            className="bg-primary-500 text-white font-semibold py-3 px-6 rounded-xl hover:bg-primary-600 transition-colors inline-block"
          >
            Yêu cầu link mới
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-dark-800 dark:to-dark-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white dark:bg-dark-800 rounded-3xl shadow-card p-8">
        {/* Back Button */}
        <div className="mb-6">
          <Link
            to="/quen-mat-khau"
            className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-primary-500 transition-colors duration-300 text-sm font-medium"
          >
            <ArrowLeft size={16} />
            Quay lại quên mật khẩu
          </Link>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center mb-4">
            <Lock className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
            Đặt lại mật khẩu
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Tạo mật khẩu mới cho tài khoản của bạn
          </p>
        </div>

        {/* Message Alert */}
        {message.text && (
          <div
            className={`p-4 rounded-xl mb-6 ${
              message.type === "success"
                ? "bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-600 dark:text-green-400"
                : "bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400"
            }`}
          >
            <p className="text-sm">{message.text}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* New Password */}
          <div>
            <label
              htmlFor="newPassword"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Mật khẩu mới
            </label>
            <div className="relative">
              <input
                id="newPassword"
                name="newPassword"
                type={showPassword ? "text" : "password"}
                value={formData.newPassword}
                onChange={(e) =>
                  setFormData({ ...formData, newPassword: e.target.value })
                }
                className="w-full px-4 py-3 bg-gray-50 dark:bg-dark-700 border border-gray-200 dark:border-dark-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:focus:ring-primary-400 dark:focus:border-primary-400 transition-colors pr-12"
                placeholder="Nhập mật khẩu mới"
                disabled={isLoading}
                autoFocus
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-primary-500 transition-colors"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            {/* Password Requirements */}
            {formData.newPassword && (
              <div className="mt-2 space-y-1">
                <div
                  className={`flex items-center gap-2 text-xs ${
                    passwordValidation.validations.length
                      ? "text-green-500"
                      : "text-gray-500 dark:text-gray-400"
                  }`}
                >
                  {passwordValidation.validations.length ? (
                    <CheckCircle size={12} />
                  ) : (
                    <XCircle size={12} />
                  )}
                  <span>Ít nhất 6 ký tự</span>
                </div>
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Xác nhận mật khẩu
            </label>
            <div className="relative">
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={formData.confirmPassword}
                onChange={(e) =>
                  setFormData({ ...formData, confirmPassword: e.target.value })
                }
                className="w-full px-4 py-3 bg-gray-50 dark:bg-dark-700 border border-gray-200 dark:border-dark-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:focus:ring-primary-400 dark:focus:border-primary-400 transition-colors pr-12"
                placeholder="Nhập lại mật khẩu mới"
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-primary-500 transition-colors"
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            {/* Password Match Indicator */}
            {formData.confirmPassword && (
              <div className="mt-2">
                <div
                  className={`flex items-center gap-2 text-xs ${
                    formData.newPassword === formData.confirmPassword
                      ? "text-green-500"
                      : "text-red-500"
                  }`}
                >
                  {formData.newPassword === formData.confirmPassword ? (
                    <CheckCircle size={12} />
                  ) : (
                    <XCircle size={12} />
                  )}
                  <span>
                    {formData.newPassword === formData.confirmPassword
                      ? "Mật khẩu khớp"
                      : "Mật khẩu không khớp"}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={
              isLoading ||
              !formData.newPassword ||
              !formData.confirmPassword ||
              formData.newPassword !== formData.confirmPassword
            }
            className="w-full bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-semibold py-3 px-4 rounded-xl hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin h-4 w-4" />
                Đang xử lý...
              </>
            ) : (
              "Đặt lại mật khẩu"
            )}
          </button>
        </form>

        {/* Back to Login */}
        <div className="text-center mt-6">
          <Link
            to="/dang-nhap"
            className="text-primary-500 hover:text-primary-600 font-medium text-sm"
          >
            ← Quay lại đăng nhập
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
