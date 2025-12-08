import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getPaymentStatus, cancelPayment } from "../../api/paymentService";

const useQuery = () => new URLSearchParams(useLocation().search);

const PaymentResult = () => {
  const query = useQuery();
  const navigate = useNavigate();
  const paymentId = query.get("paymentId");
  const status = query.get("status"); // 'success' hoặc 'failed' từ URL

  const [loading, setLoading] = useState(true);
  const [paymentInfo, setPaymentInfo] = useState(null);
  const [error, setError] = useState(null);
  const [isFreeCourse, setIsFreeCourse] = useState(false);

  useEffect(() => {
    const fetchPaymentStatus = async () => {
      try {
        // Kiểm tra nếu là khóa học miễn phí (có status=success nhưng không có paymentId)
        if (status === "success" && !paymentId) {
          setIsFreeCourse(true);
          setLoading(false);
          return;
        }

        if (!paymentId) {
          setError("Không tìm thấy thông tin thanh toán.");
          setLoading(false);
          return;
        }

        // Lấy trạng thái thanh toán từ backend cho khóa học có phí
        const data = await getPaymentStatus(paymentId);
        setPaymentInfo(data);

        // Nếu thanh toán thất bại thì hủy payment
        const paymentStatus = data?.status || "";
        if (
          ["FAILED", "CANCELLED", "ERROR"].includes(paymentStatus.toUpperCase())
        ) {
          try {
            await cancelPayment(paymentId);
          } catch (cancelError) {
            console.log("Không thể hủy thanh toán:", cancelError);
          }
        }
      } catch (err) {
        console.error("Lỗi xác minh thanh toán:", err);
        setError(
          err?.message ||
            "Có lỗi xảy ra khi xác minh thanh toán. Vui lòng thử lại."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentStatus();
  }, [paymentId, status]);

  // Xác định trạng thái thanh toán
  const paymentStatus = paymentInfo?.status || status || "";
  const isSuccess =
    paymentStatus.toUpperCase() === "SUCCESS" ||
    status === "success" ||
    isFreeCourse;

  // Lấy courseId từ localStorage
  const lastCourseId = localStorage.getItem("lastCourseId");

  // Hiển thị loading
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang xác minh thanh toán...</p>
        </div>
      </div>
    );
  }

  // Hiển thị lỗi
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md mx-4">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">❌</span>
          </div>
          <h2 className="text-xl font-semibold text-red-600 mb-2">
            Có lỗi xảy ra
          </h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
            onClick={() => navigate("/courses")}
          >
            Quay lại khóa học
          </button>
        </div>
      </div>
    );
  }

  // Thanh toán thành công (bao gồm khóa học miễn phí)
  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md mx-4">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">✅</span>
          </div>
          <h2 className="text-xl font-semibold text-green-600 mb-2">
            {isFreeCourse ? "Đăng ký thành công!" : "Thanh toán thành công!"}
          </h2>
          <p className="text-gray-600 mb-2">
            {isFreeCourse
              ? "Bạn đã đăng ký khóa học miễn phí thành công."
              : "Thanh toán của bạn đã được xác nhận."}
          </p>
          <p className="text-sm text-gray-500 mb-6">
            Bây giờ bạn có thể bắt đầu học ngay.
          </p>

          <div className="space-y-3">
            <button
              className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg font-medium transition-colors"
              onClick={() => {
                // Xóa dữ liệu localStorage
                localStorage.removeItem("lastCourseId");
                localStorage.removeItem("lastEnrollmentTime");

                // Điều hướng đến trang chi tiết khóa học đã đăng ký (MyCourseDetail)
                if (lastCourseId) {
                  navigate(`/my-courses/${lastCourseId}`);
                } else {
                  navigate("/my-courses");
                }
              }}
            >
              Vào học ngay
            </button>
            <button
              className="w-full border border-gray-300 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              onClick={() => {
                localStorage.removeItem("lastCourseId");
                localStorage.removeItem("lastEnrollmentTime");
                navigate("/courses");
              }}
            >
              Khám phá khóa học khác
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Thanh toán thất bại
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center max-w-md mx-4">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-2xl">❌</span>
        </div>
        <h2 className="text-xl font-semibold text-red-600 mb-2">
          Thanh toán thất bại
        </h2>
        <p className="text-gray-600 mb-2">Thanh toán không thành công.</p>
        <p className="text-sm text-gray-500 mb-6">
          Vui lòng thử lại hoặc liên hệ hỗ trợ nếu cần giúp đỡ.
        </p>

        <div className="space-y-3">
          <button
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg font-medium transition-colors"
            onClick={() => {
              // Quay lại trang chi tiết khóa học (CourseDetail) để người dùng thử lại
              if (lastCourseId) {
                navigate(`/course/${lastCourseId}`);
              } else {
                navigate("/courses");
              }
            }}
          >
            Quay lại chi tiết khóa học
          </button>
          <button
            className="w-full border border-gray-300 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            onClick={() => {
              localStorage.removeItem("lastCourseId");
              navigate("/courses");
            }}
          >
            Khám phá khóa học khác
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentResult;
