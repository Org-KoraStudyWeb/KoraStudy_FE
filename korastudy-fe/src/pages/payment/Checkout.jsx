import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import courseService from "../../api/courseService";
import { createPayment, getBuyerInfo } from "../../api/paymentService";

// Custom hook để lấy query parameters từ URL
const useQuery = () => new URLSearchParams(useLocation().search);

// Component hiển thị bước trong stepper
const Step = ({ index, active, label }) => (
  <div className="flex items-center gap-2">
    <div
      className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-semibold ${
        active ? "bg-primary-600 text-white" : "bg-gray-200 text-gray-600"
      }`}
    >
      {active ? "✓" : index}
    </div>
    <span
      className={`text-sm ${active ? "text-primary-600" : "text-gray-600"}`}
    >
      {label}
    </span>
  </div>
);

// Helper function để format tiền VND
const money = (v) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
    Number(v || 0)
  );

const Checkout = () => {
  const query = useQuery();
  const navigate = useNavigate();
  const courseId = query.get("courseId");

  // State management
  const [step, setStep] = useState(1); // Bước hiện tại (1: Thông tin, 2: Thanh toán)
  const [buyer, setBuyer] = useState({ name: "", email: "", phone: "" }); // Thông tin người mua
  const [course, setCourse] = useState(null); // Thông tin khóa học
  const [loading, setLoading] = useState(true); // Loading chính
  const [prefillLoading, setPrefillLoading] = useState(false); // Loading khi pre-fill thông tin user
  const [payMethod, setPayMethod] = useState("vnpay"); // Phương thức thanh toán mặc định
  const [error, setError] = useState(""); // Thông báo lỗi

  useEffect(() => {
    const fetchCourseAndUserInfo = async () => {
      try {
        if (!courseId) {
          setError("Không tìm thấy thông tin khóa học");
          setLoading(false);
          return;
        }

        console.log("Checkout: Đang tải thông tin khóa học", courseId);

        // Lấy thông tin khóa học từ API
        const courseData = await courseService.getCourseById(courseId);
        setCourse(courseData);

        console.log("Checkout: Thông tin khóa học", {
          id: courseData.id,
          name: courseData.courseName,
          price: courseData.coursePrice,
          isFree: courseData.isFree,
        });

        // KIỂM TRA QUAN TRỌNG: Nếu khóa học miễn phí, redirect về trang chi tiết
        // Vì khóa học miễn phí không cần qua checkout
        const isCourseFree = () => {
          if (courseData.isFree === true || courseData.isFree === "true")
            return true;
          if (courseData.coursePrice === 0 || courseData.coursePrice === "0")
            return true;
          if (
            courseData.coursePrice === null ||
            courseData.coursePrice === undefined
          )
            return true;
          if (
            typeof courseData.coursePrice === "string" &&
            parseFloat(courseData.coursePrice) === 0
          )
            return true;
          return false;
        };

        if (isCourseFree()) {
          console.log(
            "Checkout: Khóa học miễn phí, redirect về trang chi tiết"
          );
          alert(
            "Khóa học này miễn phí. Vui lòng đăng ký trực tiếp từ trang chi tiết khóa học."
          );
          navigate(`/course/${courseId}`);
          return;
        }

        // Chỉ lấy thông tin user pre-fill nếu khóa học có phí
        setPrefillLoading(true);
        try {
          const userInfo = await getBuyerInfo();
          console.log("Checkout: Thông tin user đã load", userInfo);

          setBuyer({
            name: userInfo.buyerName || "",
            email: userInfo.buyerEmail || "",
            phone: userInfo.buyerPhone || "",
          });
        } catch (error) {
          console.log(
            "Checkout: Không thể load thông tin user, form sẽ để trống"
          );
          // Không xử lý lỗi - form sẽ để trống để user tự nhập
        } finally {
          setPrefillLoading(false);
        }
      } catch (err) {
        console.error("Checkout: Lỗi khi tải thông tin khóa học:", err);
        setError("Không thể tải thông tin khóa học. Vui lòng thử lại.");
      } finally {
        setLoading(false);
      }
    };

    fetchCourseAndUserInfo();
  }, [courseId, navigate]);

  // Tính tổng tiền
  const total = useMemo(() => {
    if (!course) return 0;
    // Checkout chỉ xử lý khóa học có phí, nên luôn có giá
    return Number(course.coursePrice || 0);
  }, [course]);

  // Xử lý submit form thông tin người mua
  const onSubmitInfo = (e) => {
    e.preventDefault();
    // Validate thông tin bắt buộc
    if (!buyer.name.trim()) {
      alert("Vui lòng nhập họ và tên!");
      return;
    }
    if (!buyer.email.trim()) {
      alert("Vui lòng nhập email!");
      return;
    }
    if (!buyer.phone.trim()) {
      alert("Vui lòng nhập số điện thoại!");
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(buyer.email)) {
      alert("Email không hợp lệ!");
      return;
    }

    // Validate phone format (10-11 số)
    const phoneRegex = /^[0-9]{10,11}$/;
    if (!phoneRegex.test(buyer.phone.replace(/\s/g, ""))) {
      alert("Số điện thoại phải có 10-11 chữ số!");
      return;
    }

    setStep(2);
  };

  // Xử lý thanh toán
  const onPay = async () => {
    try {
      console.log("Checkout: Bắt đầu xử lý thanh toán");

      // Kiểm tra lại thông tin (phòng trường hợp user sửa URL)
      if (!course || !courseId) {
        alert("Thông tin khóa học không hợp lệ!");
        return;
      }

      // Kiểm tra phương thức thanh toán (hiện tại chỉ hỗ trợ VNPay)
      if (payMethod !== "vnpay") {
        alert("Hiện tại chỉ hỗ trợ thanh toán qua VNPay");
        return;
      }

      // Tạo payment request
      const paymentRequest = {
        courseId,
        amount: course.coursePrice,
        buyerName: buyer.name.trim(),
        buyerEmail: buyer.email.trim(),
        buyerPhone: buyer.phone.trim(),
        paymentMethod: payMethod,
      };

      console.log("Checkout: Gửi yêu cầu thanh toán", paymentRequest);

      // Gọi API tạo thanh toán
      const payment = await createPayment(paymentRequest);
      console.log("Checkout: Phản hồi từ API thanh toán", payment);

      if (payment?.paymentUrl) {
        console.log(
          "Checkout: Chuyển hướng đến trang thanh toán",
          payment.paymentUrl
        );

        // Lưu courseId vào localStorage để dùng sau khi thanh toán xong
        localStorage.setItem("lastCourseId", courseId);
        localStorage.setItem("lastPaymentTime", Date.now().toString());

        // Chuyển hướng người dùng đến trang thanh toán VNPay
        window.location.replace(payment.paymentUrl);
      } else {
        console.error("Checkout: Không nhận được URL thanh toán từ server");
        alert("Không thể kết nối đến cổng thanh toán. Vui lòng thử lại sau.");
      }
    } catch (err) {
      console.error("Checkout: Lỗi thanh toán:", err);
      alert(
        err.message || "Có lỗi xảy ra khi xử lý thanh toán. Vui lòng thử lại."
      );
    }
  };

  // Trạng thái loading
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 pb-16 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải thông tin đơn hàng...</p>
        </div>
      </div>
    );
  }

  // Trạng thái lỗi
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 pb-16 flex items-center justify-center">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-md text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">⚠️</span>
          </div>
          <h2 className="text-xl font-semibold text-red-600 mb-2">
            Có lỗi xảy ra
          </h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => navigate("/courses")}
            className="bg-primary-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-primary-700 transition-colors"
          >
            Quay lại danh sách khóa học
          </button>
        </div>
      </div>
    );
  }

  // Nếu không có course (sau khi loading xong)
  if (!course) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 pb-16 flex items-center justify-center">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-md text-center">
          <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">❓</span>
          </div>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">
            Không tìm thấy khóa học
          </h2>
          <p className="text-gray-600 mb-4">
            Khóa học bạn đang tìm không tồn tại hoặc đã bị xóa.
          </p>
          <button
            onClick={() => navigate("/courses")}
            className="bg-primary-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-primary-700 transition-colors"
          >
            Quay lại danh sách khóa học
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16">
      <div className="max-w-6xl mx-auto px-4">
        {/* Stepper - Hiển thị các bước thanh toán */}
        <div className="flex items-center justify-between bg-white rounded-xl p-4 shadow-sm mb-6">
          <Step index={1} active={step >= 1} label="Thông tin" />
          <div
            className={`h-0.5 flex-1 mx-3 ${
              step >= 2 ? "bg-primary-600" : "bg-gray-200"
            }`}
          />
          <Step index={2} active={step >= 2} label="Thanh toán" />
          <div
            className={`h-0.5 flex-1 mx-3 ${
              step >= 3 ? "bg-primary-600" : "bg-gray-200"
            }`}
          />
          <Step index={3} active={step >= 3} label="Vào học" />
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Phần bên trái - Form thông tin và thanh toán */}
          <div className="lg:col-span-2">
            {/* Bước 1: Thông tin người mua */}
            {step === 1 && (
              <div className="bg-white rounded-xl p-6 shadow">
                <h2 className="text-lg font-semibold mb-4">
                  Thông tin người mua
                  {prefillLoading && (
                    <span className="text-sm text-gray-500 ml-2">
                      (Đang tải thông tin...)
                    </span>
                  )}
                </h2>
                <form onSubmit={onSubmitInfo} className="space-y-4">
                  <div>
                    <input
                      placeholder="Họ và tên *"
                      className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary-500 outline-none"
                      value={buyer.name}
                      onChange={(e) =>
                        setBuyer({ ...buyer, name: e.target.value })
                      }
                      disabled={prefillLoading}
                      required
                    />
                  </div>

                  <div>
                    <input
                      placeholder="Email *"
                      type="email"
                      className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary-500 outline-none"
                      value={buyer.email}
                      onChange={(e) =>
                        setBuyer({ ...buyer, email: e.target.value })
                      }
                      disabled={prefillLoading}
                      required
                    />
                  </div>

                  <div>
                    <input
                      placeholder="Số điện thoại *"
                      className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary-500 outline-none"
                      value={buyer.phone}
                      onChange={(e) =>
                        setBuyer({ ...buyer, phone: e.target.value })
                      }
                      disabled={prefillLoading}
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-primary-600 text-white py-3 rounded-lg font-semibold hover:bg-primary-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                    disabled={prefillLoading}
                  >
                    {prefillLoading ? "Đang tải..." : "Tiếp theo →"}
                  </button>
                </form>
              </div>
            )}

            {/* Bước 2: Chọn phương thức thanh toán */}
            {step === 2 && (
              <div className="bg-white rounded-xl p-6 shadow">
                <h2 className="text-lg font-semibold mb-4">
                  Hình thức thanh toán
                </h2>
                <div className="space-y-3">
                  {/* Danh sách các phương thức thanh toán */}
                  {[
                    {
                      id: "bank",
                      icon: "🏦",
                      label: "Chuyển khoản ngân hàng",
                      description: "Chuyển khoản trực tiếp qua ngân hàng",
                    },
                    {
                      id: "momo",
                      icon: "📱",
                      label: "Ví MoMo",
                      description: "Thanh toán qua ứng dụng MoMo",
                    },
                    {
                      id: "vnpay",
                      icon: "💳",
                      label: "Thẻ ATM/Internet Banking",
                      description: "Hỗ trợ hơn 30 ngân hàng tại Việt Nam",
                    },
                    {
                      id: "visa",
                      icon: "🌐",
                      label: "Thẻ quốc tế (Visa/Master)",
                      description: "Thẻ Visa, MasterCard, JCB",
                    },
                    {
                      id: "shoppe",
                      icon: "🛍️",
                      label: "Ví điện tử ShopeePay",
                      description: "Thanh toán qua ShopeePay",
                    },
                    {
                      id: "zalo",
                      icon: "💬",
                      label: "Ví điện tử ZaloPay",
                      description: "Thanh toán qua ZaloPay",
                    },
                    {
                      id: "cod",
                      icon: "📦",
                      label: "Thanh toán khi nhận tài liệu",
                      description:
                        "Chỉ áp dụng cho khóa học có tài liệu vật lý",
                    },
                  ].map((method) => (
                    <label
                      key={method.id}
                      className={`flex items-center justify-between border rounded-lg px-4 py-3 cursor-pointer transition-colors ${
                        payMethod === method.id
                          ? "border-primary-500 bg-primary-50"
                          : "border-gray-200 hover:bg-gray-50"
                      }`}
                      title={method.description}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{method.icon}</span>
                        <div>
                          <div className="font-medium">{method.label}</div>
                          <div className="text-xs text-gray-500">
                            {method.description}
                          </div>
                        </div>
                      </div>
                      <input
                        type="radio"
                        name="payment-method"
                        className="accent-primary-600"
                        checked={payMethod === method.id}
                        onChange={() => setPayMethod(method.id)}
                      />
                    </label>
                  ))}
                </div>

                {/* Lưu ý về phương thức thanh toán */}
                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-start gap-2">
                    <span className="text-blue-500 text-lg">ℹ️</span>
                    <div className="text-sm text-blue-700">
                      <p className="font-medium">Lưu ý:</p>
                      <p className="mt-1">
                        • Hiện tại hệ thống chỉ hỗ trợ thanh toán qua{" "}
                        <strong>VNPay</strong>
                        <br />
                        • Các phương thức khác đang được phát triển
                        <br />• Vui lòng chọn "Thẻ ATM/Internet Banking" để tiếp
                        tục
                      </p>
                    </div>
                  </div>
                </div>

                {/* Nút điều hướng */}
                <div className="mt-6 flex gap-3">
                  <button
                    onClick={() => setStep(1)}
                    className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                  >
                    ← Quay lại
                  </button>
                  <button
                    onClick={onPay}
                    className="flex-1 bg-primary-600 text-white py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
                    disabled={payMethod !== "vnpay"} // Chỉ cho phép thanh toán nếu chọn VNPay
                  >
                    {payMethod === "vnpay"
                      ? "Tiến hành thanh toán →"
                      : "Chọn VNPay để thanh toán"}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Phần bên phải - Tóm tắt đơn hàng */}
          <div>
            <div className="bg-white rounded-xl p-6 shadow sticky top-24">
              <h3 className="font-semibold mb-4 text-lg">Đơn hàng</h3>
              {course && (
                <>
                  <div className="flex items-center gap-3 mb-4 pb-4 border-b">
                    <img
                      src={course.courseImageUrl || "/topik.png"}
                      alt={course.courseName}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <div className="font-medium line-clamp-2">
                        {course.courseName}
                      </div>
                      <div className="text-sm text-gray-500 mt-1">
                        {course.courseLevel}
                      </div>
                    </div>
                    <div className="font-semibold text-gray-800 whitespace-nowrap">
                      {money(course.coursePrice)}
                    </div>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Giá khóa học</span>
                      <span>{money(course.coursePrice)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Giảm giá</span>
                      <span className="text-green-600">0₫</span>
                    </div>
                    <div className="flex justify-between pt-3 border-t">
                      <span className="text-gray-600 font-medium">
                        Tổng cộng
                      </span>
                      <span className="font-semibold text-primary-600 text-lg">
                        {money(total)}
                      </span>
                    </div>
                  </div>

                  {/* Thông tin bổ sung */}
                  <div className="mt-6 pt-4 border-t">
                    <div className="text-sm text-gray-600 space-y-2">
                      <div className="flex items-start gap-2">
                        <span className="text-green-500">✓</span>
                        <span>Truy cập trọn đời</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-green-500">✓</span>
                        <span>Tài liệu học tập đầy đủ</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-green-500">✓</span>
                        <span>Hỗ trợ 24/7</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-green-500">✓</span>
                        <span>Chứng chỉ hoàn thành</span>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
