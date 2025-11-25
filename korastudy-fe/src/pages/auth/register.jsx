import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, CheckCircle, XCircle, Loader, Mail } from "lucide-react";
import NavBar from "@components/NavBar";
import Footer from "@components/Footer";
import authService from "@api/authService";

const Register = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeTerms: false,
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [apiMessage, setApiMessage] = useState({ type: "", text: "" });

  // Email validation function
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Password validation function
  const validatePassword = (password) => {
    const validations = {
      length: password.length >= 6,
      uppercase: /[A-Z]/.test(password),
      number: /\d/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };

    return {
      isValid: Object.values(validations).every(Boolean),
      validations,
    };
  };

  // Get password strength
  const getPasswordStrength = (password) => {
    const { validations } = validatePassword(password);
    const score = Object.values(validations).filter(Boolean).length;

    if (score === 0) return { strength: "none", color: "gray", text: "" };
    if (score <= 2) return { strength: "weak", color: "red", text: "Yếu" };
    if (score === 3)
      return { strength: "medium", color: "yellow", text: "Trung bình" };
    return { strength: "strong", color: "green", text: "Mạnh" };
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;

    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
    }));

    // Clear errors when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }

    // Clear API message when user changes anything
    if (apiMessage.text) {
      setApiMessage({ type: "", text: "" });
    }

    // Real-time validation
    validateField(name, newValue);
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }));
    validateField(name, formData[name]);
  };

  const validateField = (name, value) => {
    let error = "";

    switch (name) {
      case "username":
        if (!value.trim()) {
          error = "Vui lòng nhập tên đăng nhập";
        } else if (value.trim().length < 3) {
          error = "Tên đăng nhập phải có ít nhất 3 ký tự";
        } else if (!/^[a-zA-Z0-9_]+$/.test(value.trim())) {
          error = "Tên đăng nhập chỉ được chứa chữ cái, số và dấu gạch dưới";
        }
        break;

      case "email":
        if (!value) {
          error = "Vui lòng nhập địa chỉ email";
        } else if (!validateEmail(value)) {
          error = "Địa chỉ email không hợp lệ";
        }
        break;

      case "password":
        if (!value) {
          error = "Vui lòng nhập mật khẩu";
        } else if (value.length < 6) {
          error = "Mật khẩu phải có ít nhất 6 ký tự";
        } else {
          const { isValid } = validatePassword(value);
          if (!isValid) {
            error = "Mật khẩu không đáp ứng yêu cầu bảo mật";
          }
        }
        break;

      case "confirmPassword":
        if (!value) {
          error = "Vui lòng xác nhận mật khẩu";
        } else if (value !== formData.password) {
          error = "Mật khẩu xác nhận không khớp";
        }
        break;

      case "agreeTerms":
        if (!value) {
          error = "Vui lòng đồng ý với điều khoản dịch vụ";
        }
        break;

      default:
        break;
    }

    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }));

    return error === "";
  };

  const validateForm = () => {
    const fields = [
      "username",
      "email",
      "password",
      "confirmPassword",
      "agreeTerms",
    ];
    let isValid = true;

    fields.forEach((field) => {
      const fieldIsValid = validateField(field, formData[field]);
      if (!fieldIsValid) {
        isValid = false;
      }
    });

    // Mark all fields as touched
    const touchedFields = {};
    fields.forEach((field) => {
      touchedFields[field] = true;
    });
    setTouched(touchedFields);

    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      setIsLoading(true);
      setApiMessage({ type: "", text: "" });

      try {
        const registrationData = {
          username: formData.username,
          email: formData.email,
          password: formData.password,
          confirmPassword: formData.confirmPassword,
        };

        const response = await authService.register(registrationData);

        console.log("Registration successful:", response);

        // Hiển thị thông báo thành công và không redirect ngay
        setApiMessage({
          type: "success",
          text:
            response.message ||
            "Đăng ký thành công! Vui lòng kiểm tra email để xác thực tài khoản.",
        });

        // Reset form
        setFormData({
          username: "",
          email: "",
          password: "",
          confirmPassword: "",
          agreeTerms: false,
        });
        setTouched({});
      } catch (error) {
        console.error("Registration error:", error);

        // Xử lý lỗi email trùng lặp
        if (error.isEmailDuplicate) {
          setApiMessage({
            type: "error",
            text: error.friendlyMessage || "Email đã tồn tại trong hệ thống.",
          });
        } else {
          setApiMessage({
            type: "error",
            text: error.message || "Đăng ký thất bại. Vui lòng thử lại sau.",
          });
        }
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleResendVerification = async () => {
    if (!formData.email) {
      setApiMessage({
        type: "error",
        text: "Vui lòng nhập email để gửi lại xác thực.",
      });
      return;
    }

    setIsResending(true);
    try {
      await authService.resendVerificationEmail(formData.email);
      setApiMessage({
        type: "success",
        text: "Đã gửi lại email xác thực. Vui lòng kiểm tra hộp thư của bạn.",
      });
    } catch (error) {
      setApiMessage({
        type: "error",
        text: error.message || "Gửi lại email thất bại. Vui lòng thử lại sau.",
      });
    } finally {
      setIsResending(false);
    }
  };

  const passwordStrength = getPasswordStrength(formData.password);
  const passwordValidation = validatePassword(formData.password);

  const getStrengthColorClass = (strength) => {
    switch (strength) {
      case "weak":
        return "text-red-500";
      case "medium":
        return "text-yellow-500";
      case "strong":
        return "text-green-500";
      default:
        return "text-gray-500";
    }
  };

  const isFormValid =
    Object.values(errors).every((error) => error === "") &&
    formData.agreeTerms &&
    formData.username &&
    formData.email &&
    formData.password &&
    formData.confirmPassword;

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-dark-900">
      <NavBar />

      <div className="flex flex-1 min-h-[calc(100vh-160px)]">
        {/* Left Side - Registration Form */}
        <div className="w-full lg:w-1/2 bg-gradient-to-br from-primary-500 via-secondary-400 to-secondary-500 flex flex-col items-center justify-center p-4 lg:p-10 lg:rounded-r-custom relative shadow-custom">
          <div className="w-full max-w-md bg-white dark:bg-dark-800 rounded-3xl p-6 lg:p-10 shadow-card my-4 lg:my-5 max-h-[90vh] overflow-y-auto">
            <h2 className="font-bold text-xl lg:text-2xl xl:text-3xl text-gray-800 dark:text-gray-200 mb-4 lg:mb-6 xl:mb-8 text-center">
              Đăng ký
            </h2>

            {/* API Message */}
            {apiMessage.text && (
              <div
                className={`px-4 py-3 rounded-lg mb-4 ${
                  apiMessage.type === "success"
                    ? "bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-600 dark:text-green-400"
                    : "bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400"
                }`}
              >
                <div className="flex items-start gap-2">
                  {apiMessage.type === "success" ? (
                    <CheckCircle size={18} className="flex-shrink-0 mt-0.5" />
                  ) : (
                    <XCircle size={18} className="flex-shrink-0 mt-0.5" />
                  )}
                  <div className="flex-1">
                    <p className="text-sm">{apiMessage.text}</p>
                    {apiMessage.type === "success" && formData.email && (
                      <button
                        onClick={handleResendVerification}
                        disabled={isResending}
                        className="mt-2 text-primary-500 hover:underline text-xs flex items-center gap-1"
                      >
                        {isResending ? (
                          <Loader size={12} className="animate-spin" />
                        ) : (
                          <Mail size={12} />
                        )}
                        {isResending ? "Đang gửi..." : "Gửi lại email xác thực"}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="w-full space-y-4">
              {/* Username Field */}
              <div>
                <label
                  htmlFor="username"
                  className="block font-medium text-sm text-gray-700 dark:text-gray-300 mb-1.5"
                >
                  Tên đăng nhập:
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  placeholder="Nhập tên đăng nhập của bạn"
                  className={`w-full h-12 bg-gray-50 dark:bg-dark-700 border-2 rounded-xl px-4 text-sm transition-all duration-300 outline-none placeholder-gray-400 dark:placeholder-gray-500 text-gray-900 dark:text-gray-100 ${
                    errors.username && touched.username
                      ? "border-red-500 focus:border-red-500 focus:shadow-[0_0_0_3px_rgba(239,68,68,0.1)]"
                      : "border-gray-200 dark:border-dark-600 focus:border-primary-500 focus:bg-white dark:focus:bg-dark-600 focus:shadow-[0_0_0_3px_rgba(52,188,249,0.1)]"
                  }`}
                  disabled={isLoading}
                  required
                />
                {errors.username && touched.username && (
                  <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                    <XCircle size={12} />
                    {errors.username}
                  </p>
                )}
                {!errors.username && touched.username && formData.username && (
                  <p className="text-green-500 text-xs mt-1 flex items-center gap-1">
                    <CheckCircle size={12} />
                    Tên đăng nhập hợp lệ
                  </p>
                )}
              </div>

              {/* Email Field */}
              <div>
                <label
                  htmlFor="email"
                  className="block font-medium text-sm text-gray-700 dark:text-gray-300 mb-1.5"
                >
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
                  className={`w-full h-12 bg-gray-50 dark:bg-dark-700 border-2 rounded-xl px-4 text-sm transition-all duration-300 outline-none placeholder-gray-400 dark:placeholder-gray-500 text-gray-900 dark:text-gray-100 ${
                    errors.email && touched.email
                      ? "border-red-500 focus:border-red-500 focus:shadow-[0_0_0_3px_rgba(239,68,68,0.1)]"
                      : "border-gray-200 dark:border-dark-600 focus:border-primary-500 focus:bg-white dark:focus:bg-dark-600 focus:shadow-[0_0_0_3px_rgba(52,188,249,0.1)]"
                  }`}
                  disabled={isLoading}
                  required
                />
                {errors.email && touched.email && (
                  <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                    <XCircle size={12} />
                    {errors.email}
                  </p>
                )}
                {!errors.email &&
                  touched.email &&
                  validateEmail(formData.email) && (
                    <p className="text-green-500 text-xs mt-1 flex items-center gap-1">
                      <CheckCircle size={12} />
                      Email hợp lệ
                    </p>
                  )}
              </div>

              {/* Password Field */}
              <div>
                <label
                  htmlFor="password"
                  className="block font-medium text-sm text-gray-700 dark:text-gray-300 mb-1.5"
                >
                  Mật khẩu:
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    placeholder="Nhập mật khẩu của bạn"
                    className={`w-full h-12 bg-gray-50 dark:bg-dark-700 border-2 rounded-xl px-4 pr-12 text-sm transition-all duration-300 outline-none placeholder-gray-400 dark:placeholder-gray-500 text-gray-900 dark:text-gray-100 ${
                      errors.password && touched.password
                        ? "border-red-500 focus:border-red-500 focus:shadow-[0_0_0_3px_rgba(239,68,68,0.1)]"
                        : "border-gray-200 dark:border-dark-600 focus:border-primary-500 focus:bg-white dark:focus:bg-dark-600 focus:shadow-[0_0_0_3px_rgba(52,188,249,0.1)]"
                    }`}
                    disabled={isLoading}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-primary-500 transition-colors duration-300"
                    disabled={isLoading}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                {/* Password Strength Indicator */}
                {formData.password && (
                  <div className="mt-2">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex-1 bg-gray-200 dark:bg-dark-600 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all duration-300 ${
                            passwordStrength.strength === "weak"
                              ? "bg-red-500 w-1/4"
                              : passwordStrength.strength === "medium"
                              ? "bg-yellow-500 w-2/4"
                              : passwordStrength.strength === "strong"
                              ? "bg-green-500 w-full"
                              : "w-0"
                          }`}
                        ></div>
                      </div>
                      {passwordStrength.text && (
                        <span
                          className={`text-xs font-medium ${getStrengthColorClass(
                            passwordStrength.strength
                          )}`}
                        >
                          {passwordStrength.text}
                        </span>
                      )}
                    </div>

                    {/* Password Requirements */}
                    <div className="grid grid-cols-2 gap-1 text-xs">
                      <div
                        className={`flex items-center gap-1 ${
                          passwordValidation.validations.length
                            ? "text-green-500"
                            : "text-gray-500 dark:text-gray-400"
                        }`}
                      >
                        {passwordValidation.validations.length ? (
                          <CheckCircle size={10} />
                        ) : (
                          <XCircle size={10} />
                        )}
                        <span>Ít nhất 6 ký tự</span>
                      </div>
                      <div
                        className={`flex items-center gap-1 ${
                          passwordValidation.validations.uppercase
                            ? "text-green-500"
                            : "text-gray-500 dark:text-gray-400"
                        }`}
                      >
                        {passwordValidation.validations.uppercase ? (
                          <CheckCircle size={10} />
                        ) : (
                          <XCircle size={10} />
                        )}
                        <span>Có chữ hoa</span>
                      </div>
                      <div
                        className={`flex items-center gap-1 ${
                          passwordValidation.validations.number
                            ? "text-green-500"
                            : "text-gray-500 dark:text-gray-400"
                        }`}
                      >
                        {passwordValidation.validations.number ? (
                          <CheckCircle size={10} />
                        ) : (
                          <XCircle size={10} />
                        )}
                        <span>Có số</span>
                      </div>
                      <div
                        className={`flex items-center gap-1 ${
                          passwordValidation.validations.special
                            ? "text-green-500"
                            : "text-gray-500 dark:text-gray-400"
                        }`}
                      >
                        {passwordValidation.validations.special ? (
                          <CheckCircle size={10} />
                        ) : (
                          <XCircle size={10} />
                        )}
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
                <label
                  htmlFor="confirmPassword"
                  className="block font-medium text-sm text-gray-700 dark:text-gray-300 mb-1.5"
                >
                  Xác nhận mật khẩu:
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    placeholder="Nhập lại mật khẩu của bạn"
                    className={`w-full h-12 bg-gray-50 dark:bg-dark-700 border-2 rounded-xl px-4 pr-12 text-sm transition-all duration-300 outline-none placeholder-gray-400 dark:placeholder-gray-500 text-gray-900 dark:text-gray-100 ${
                      errors.confirmPassword && touched.confirmPassword
                        ? "border-red-500 focus:border-red-500 focus:shadow-[0_0_0_3px_rgba(239,68,68,0.1)]"
                        : "border-gray-200 dark:border-dark-600 focus:border-primary-500 focus:bg-white dark:focus:bg-dark-600 focus:shadow-[0_0_0_3px_rgba(52,188,249,0.1)]"
                    }`}
                    disabled={isLoading}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-primary-500 transition-colors duration-300"
                    disabled={isLoading}
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && touched.confirmPassword && (
                  <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                    <XCircle size={12} />
                    {errors.confirmPassword}
                  </p>
                )}
                {!errors.confirmPassword &&
                  touched.confirmPassword &&
                  formData.confirmPassword &&
                  formData.password === formData.confirmPassword && (
                    <p className="text-green-500 text-xs mt-1 flex items-center gap-1">
                      <CheckCircle size={12} />
                      Mật khẩu khớp
                    </p>
                  )}
              </div>

              {/* Terms Agreement */}
              <div className="my-4">
                <div className="flex items-start gap-2">
                  <input
                    type="checkbox"
                    id="agreeTerms"
                    name="agreeTerms"
                    checked={formData.agreeTerms}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    className="w-[18px] h-[18px] border-2 border-gray-300 dark:border-dark-600 rounded cursor-pointer accent-primary-500 mt-0.5 flex-shrink-0"
                    disabled={isLoading}
                    required
                  />
                  <label
                    htmlFor="agreeTerms"
                    className="text-[13px] text-gray-700 dark:text-gray-300 cursor-pointer leading-[1.4]"
                  >
                    Tôi đồng ý với{" "}
                    <Link
                      to="/terms"
                      className="text-primary-500 font-medium hover:underline"
                    >
                      Điều khoản dịch vụ
                    </Link>{" "}
                    và{" "}
                    <Link
                      to="/privacy"
                      className="text-primary-500 font-medium hover:underline"
                    >
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
                className="w-full h-12 bg-gradient-to-r from-primary-500 via-secondary-400 to-secondary-500 border-0 rounded-xl text-white font-semibold text-base cursor-pointer transition-all duration-300 mb-4 shadow-[0_4px_12px_rgba(52,188,249,0.3)] hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(52,188,249,0.4)] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:transform-none flex items-center justify-center gap-2"
                disabled={!isFormValid || isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader size={18} className="animate-spin" />
                    Đang xử lý...
                  </>
                ) : (
                  "Đăng ký"
                )}
              </button>

              {/* Login Link */}
              <div className="text-center my-4">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Bạn đã có tài khoản?{" "}
                </span>
                <Link
                  to="/dang-nhap"
                  className="font-semibold text-sm text-primary-500 hover:text-blue-600 hover:underline transition-colors duration-300"
                >
                  Đăng nhập ngay
                </Link>
              </div>

              {/* Google Register */}
              <button
                type="button"
                className="w-full h-12 bg-white dark:bg-dark-700 border-2 border-gray-200 dark:border-dark-600 rounded-xl flex items-center justify-center gap-3 cursor-pointer transition-all duration-300 my-3 hover:border-gray-300 dark:hover:border-dark-500 hover:bg-gray-50 dark:hover:bg-dark-600"
                disabled={isLoading}
              >
                <img
                  src="/img_social/ic_google.png"
                  alt="Google"
                  className="w-5 h-5"
                />
                <span className="font-medium text-sm text-gray-700 dark:text-gray-300">
                  Đăng ký với Google
                </span>
              </button>
            </form>

            {/* Terms and Privacy Links */}
            <div className="text-center mt-6 pt-4 border-t border-gray-200 dark:border-dark-600">
              <Link
                to="/terms"
                className="text-xs text-gray-500 dark:text-gray-400 hover:text-primary-500 hover:underline transition-colors duration-300 mx-2"
              >
                Điều khoản dịch vụ
              </Link>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {" "}
                &{" "}
              </span>
              <Link
                to="/privacy"
                className="text-xs text-gray-500 dark:text-gray-400 hover:text-primary-500 hover:underline transition-colors duration-300 mx-2"
              >
                Chính sách bảo mật
              </Link>
            </div>
          </div>
        </div>

        {/* Right Side - Promotional Content */}
        <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-dark-800 dark:to-dark-700 relative flex-col items-center justify-center px-15 py-10 overflow-hidden">
          <div className="absolute -top-25 -left-25 w-75 h-75 bg-gradient-to-r from-primary-100 to-secondary-100 dark:from-primary-900/20 dark:to-secondary-900/20 rounded-full"></div>
          <div className="absolute -bottom-25 -right-25 w-100 h-100 bg-gradient-to-r from-secondary-100 to-primary-100 dark:from-secondary-900/20 dark:to-primary-900/20 rounded-full"></div>

          <div className="text-center z-10 mb-10">
            <h1 className="font-inter font-bold text-5xl leading-tight text-gray-800 dark:text-gray-200 mb-5 bg-gradient-to-r from-primary-500 to-secondary-500 bg-clip-text text-transparent">
              Bắt đầu hành trình
              <br />
              học tiếng Hàn ngay hôm nay
            </h1>
            <p className="font-inter text-lg leading-relaxed text-gray-500 dark:text-gray-400">
              Tham gia cộng đồng học viên KoraStudy và chinh phục TOPIK
            </p>
          </div>

          <div className="w-full max-w-lg z-10">
            <img
              src="/background.png"
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
