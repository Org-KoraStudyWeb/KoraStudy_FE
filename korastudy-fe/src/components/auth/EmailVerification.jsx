// EmailVerification.jsx
import { useEffect, useState, useRef } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { CheckCircle, XCircle, Loader2, MailCheck } from "lucide-react";
import authService from "../../api/authService";

const EmailVerification = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);
  const [countdown, setCountdown] = useState(5);

  // Thêm useRef để track API call
  const hasCalledApi = useRef(false);

  useEffect(() => {
    const verifyEmail = async () => {
      const token = searchParams.get("token");

      if (!token) {
        setMessage("Token xác thực không hợp lệ hoặc không tồn tại");
        setIsLoading(false);
        setIsSuccess(false);
        return;
      }

      // Prevent multiple API calls
      if (hasCalledApi.current) {
        console.log("🛑 API already called, skipping...");
        return;
      }

      hasCalledApi.current = true;
      console.log("🚀 Calling verifyEmail API with token:", token);

      try {
        await authService.verifyEmail(token);
        console.log("✅ Email verification successful");

        setMessage(
          "Email đã được xác thực thành công! Bạn sẽ được chuyển hướng đến trang đăng nhập sau vài giây."
        );
        setIsSuccess(true);

        // Countdown timer - chỉ chạy 1 lần
        const timer = setInterval(() => {
          setCountdown((prev) => {
            if (prev <= 1) {
              clearInterval(timer);
              navigate("/dang-nhap");
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      } catch (error) {
        console.error("❌ Email verification failed:", error);

        // Xử lý lỗi đặc biệt - nếu đã verified thì vẫn là success
        if (
          error.message.includes("đã được xác thực") ||
          error.message.includes("đã được kích hoạt")
        ) {
          setMessage(
            "Tài khoản đã được xác thực trước đó. Bạn sẽ được chuyển hướng đến trang đăng nhập."
          );
          setIsSuccess(true);

          // Vẫn chuyển hướng sau 3 giây
          setTimeout(() => {
            navigate("/dang-nhap");
          }, 3000);
        } else {
          setMessage(
            error.message || "Xác thực email thất bại. Vui lòng thử lại."
          );
          setIsSuccess(false);
        }
      } finally {
        setIsLoading(false);
      }
    };

    verifyEmail();

    // Cleanup function
    return () => {
      hasCalledApi.current = false;
    };
  }, []); // ❌ QUAN TRỌNG: Remove dependencies để chỉ chạy 1 lần

  const handleNavigateNow = () => {
    navigate("/dang-nhap");
  };

  // ... phần còn lại của component giữ nguyên
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-dark-800 dark:to-dark-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white dark:bg-dark-800 rounded-3xl shadow-card p-8 text-center">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <Loader2 size={64} className="text-primary-500 animate-spin" />
              <MailCheck
                size={32}
                className="text-primary-400 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
              />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">
            Đang xác thực email...
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Vui lòng chờ trong giây lát
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-dark-800 dark:to-dark-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white dark:bg-dark-800 rounded-3xl shadow-card p-8 text-center">
        {/* Icon */}
        <div className="flex justify-center mb-6">
          {isSuccess ? (
            <div className="relative">
              <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                <CheckCircle size={48} className="text-green-500" />
              </div>
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                <CheckCircle size={14} className="text-white" />
              </div>
            </div>
          ) : (
            <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
              <XCircle size={48} className="text-red-500" />
            </div>
          )}
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">
          {isSuccess ? "Xác thực thành công! 🎉" : "Xác thực thất bại"}
        </h2>

        {/* Message */}
        <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
          {message}
        </p>

        {/* Countdown */}
        {isSuccess && countdown > 0 && (
          <div className="mb-6">
            <div className="flex items-center justify-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              <Loader2 size={16} className="animate-spin" />
              <span>Tự động chuyển hướng sau: </span>
              <span className="font-semibold text-primary-500">
                {countdown}s
              </span>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="space-y-3">
          {isSuccess ? (
            <>
              <button
                onClick={handleNavigateNow}
                className="w-full bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-semibold py-3 px-6 rounded-xl hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300"
              >
                Đăng nhập ngay
              </button>
              <Link
                to="/"
                className="block w-full bg-gray-100 dark:bg-dark-700 text-gray-700 dark:text-gray-300 font-medium py-3 px-6 rounded-xl hover:bg-gray-200 dark:hover:bg-dark-600 transition-all duration-300"
              >
                Về trang chủ
              </Link>
            </>
          ) : (
            <>
              <button
                onClick={() => window.location.reload()}
                className="w-full bg-primary-500 text-white font-semibold py-3 px-6 rounded-xl hover:bg-primary-600 transform hover:-translate-y-0.5 transition-all duration-300"
              >
                Thử lại
              </button>
              <Link
                to="/dang-nhap"
                className="block w-full bg-gray-100 dark:bg-dark-700 text-gray-700 dark:text-gray-300 font-medium py-3 px-6 rounded-xl hover:bg-gray-200 dark:hover:bg-dark-600 transition-all duration-300"
              >
                Đến trang đăng nhập
              </Link>
              <Link
                to="/lien-he"
                className="block w-full border border-gray-300 dark:border-dark-600 text-gray-700 dark:text-gray-300 font-medium py-3 px-6 rounded-xl hover:bg-gray-50 dark:hover:bg-dark-700 transition-all duration-300"
              >
                Liên hệ hỗ trợ
              </Link>
            </>
          )}
        </div>

        {/* Additional Help */}
        {!isSuccess && (
          <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl border border-yellow-200 dark:border-yellow-800">
            <p className="text-sm text-yellow-700 dark:text-yellow-400 text-left">
              <strong>Lưu ý:</strong> Nếu bạn gặp vấn đề với xác thực email, vui
              lòng:
            </p>
            <ul className="text-sm text-yellow-600 dark:text-yellow-500 text-left mt-2 space-y-1">
              <li>• Kiểm tra lại đường link xác thực</li>
              <li>• Đảm bảo token chưa hết hạn</li>
              <li>• Liên hệ hỗ trợ nếu vẫn gặp lỗi</li>
            </ul>
          </div>
        )}

        {/* Success Celebration */}
        {isSuccess && (
          <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800">
            <p className="text-sm text-green-700 dark:text-green-400">
              <strong>Chúc mừng!</strong> Tài khoản của bạn đã được kích hoạt.
              Bây giờ bạn có thể đăng nhập và bắt đầu học tiếng Hàn.
            </p>
          </div>
        )}
      </div>

      {/* Background Decorations */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary-200 dark:bg-primary-900/30 rounded-full blur-3xl opacity-50"></div>
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-secondary-200 dark:bg-secondary-900/30 rounded-full blur-3xl opacity-50"></div>
      </div>
    </div>
  );
};

export default EmailVerification;
