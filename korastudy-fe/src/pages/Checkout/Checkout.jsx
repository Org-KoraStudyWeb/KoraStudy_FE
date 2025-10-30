import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Check,
  CreditCard,
  Landmark,
  Smartphone,
  Wallet,
  Banknote,
} from "lucide-react";
import courseService from "../../api/courseService";

const useQuery = () => new URLSearchParams(useLocation().search);

const Step = ({ index, active, label }) => (
  <div className="flex items-center gap-2">
    <div
      className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-semibold ${
        active ? "bg-primary-600 text-white" : "bg-gray-200 text-gray-600"
      }`}
    >
      {active ? <Check size={16} /> : index}
    </div>
    <span
      className={`text-sm ${active ? "text-primary-600" : "text-gray-600"}`}
    >
      {label}
    </span>
  </div>
);

const money = (v) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
    Number(v || 0)
  );

const Checkout = () => {
  const query = useQuery();
  const navigate = useNavigate();
  const courseId = query.get("courseId");
  const [step, setStep] = useState(1);
  const [buyer, setBuyer] = useState({ name: "", email: "", phone: "" });
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [payMethod, setPayMethod] = useState("bank");

  useEffect(() => {
    const run = async () => {
      try {
        if (courseId) {
          const data = await courseService.getCourseById(courseId);
          setCourse(data);
        }
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [courseId]);

  const total = useMemo(() => {
    if (!course) return 0;
    return course.isFree ? 0 : Number(course.coursePrice || 0);
  }, [course]);

  const onSubmitInfo = (e) => {
    e.preventDefault();
    if (!buyer.name || !buyer.email || !buyer.phone) return;
    setStep(2);
  };

  const onPay = () => {
    // TODO: integrate payment later
    navigate(`/course/${courseId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 text-center">
        Đang tải đơn hàng...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16">
      <div className="max-w-6xl mx-auto px-4">
        {/* Stepper */}
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
          {/* Left */}
          <div className="lg:col-span-2">
            {/* Step 1: Buyer Info */}
            {step === 1 && (
              <div className="bg-white rounded-xl p-6 shadow">
                <h2 className="text-lg font-semibold mb-4">
                  Thông tin người mua
                </h2>
                <form onSubmit={onSubmitInfo} className="space-y-4">
                  <input
                    placeholder="Họ và tên"
                    className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary-500 outline-none"
                    value={buyer.name}
                    onChange={(e) =>
                      setBuyer({ ...buyer, name: e.target.value })
                    }
                  />
                  <input
                    placeholder="Email"
                    type="email"
                    className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary-500 outline-none"
                    value={buyer.email}
                    onChange={(e) =>
                      setBuyer({ ...buyer, email: e.target.value })
                    }
                  />
                  <input
                    placeholder="Số điện thoại"
                    className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary-500 outline-none"
                    value={buyer.phone}
                    onChange={(e) =>
                      setBuyer({ ...buyer, phone: e.target.value })
                    }
                  />
                  <button
                    type="submit"
                    className="w-full bg-primary-600 text-white py-3 rounded-lg font-semibold hover:bg-primary-700"
                  >
                    Tiếp theo
                  </button>
                </form>
              </div>
            )}

            {/* Step 2: Payment Methods */}
            {step === 2 && (
              <div className="bg-white rounded-xl p-6 shadow">
                <h2 className="text-lg font-semibold mb-4">
                  Hình thức thanh toán
                </h2>
                <div className="space-y-3">
                  {[
                    {
                      id: "bank",
                      icon: <Landmark size={18} />,
                      label: "Chuyển khoản ngân hàng",
                    },
                    {
                      id: "momo",
                      icon: <Smartphone size={18} />,
                      label: "Ví MoMo",
                    },
                    {
                      id: "vnpay",
                      icon: <CreditCard size={18} />,
                      label: "Thẻ ATM/Internet Banking",
                    },
                    {
                      id: "visa",
                      icon: <CreditCard size={18} />,
                      label: "Thẻ quốc tế (Visa/Master)",
                    },
                    {
                      id: "shoppe",
                      icon: <Wallet size={18} />,
                      label: "Ví điện tử ShopeePay",
                    },
                    {
                      id: "zalo",
                      icon: <Wallet size={18} />,
                      label: "Ví điện tử ZaloPay",
                    },
                    {
                      id: "cod",
                      icon: <Banknote size={18} />,
                      label: "Thanh toán khi nhận tài liệu",
                    },
                  ].map((m) => (
                    <label
                      key={m.id}
                      className={`flex items-center justify-between border rounded-lg px-4 py-3 cursor-pointer transition-colors ${
                        payMethod === m.id
                          ? "border-primary-500 bg-primary-50"
                          : "border-gray-200 hover:bg-gray-50"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {m.icon}
                        <span className="font-medium">{m.label}</span>
                      </div>
                      <input
                        type="radio"
                        className="accent-primary-600"
                        checked={payMethod === m.id}
                        onChange={() => setPayMethod(m.id)}
                      />
                    </label>
                  ))}
                </div>
                <button
                  onClick={onPay}
                  className="mt-5 w-full bg-primary-600 text-white py-3 rounded-lg font-semibold hover:bg-primary-700"
                >
                  Tiến hành thanh toán
                </button>
              </div>
            )}
          </div>

          {/* Right: Order Summary */}
          <div>
            <div className="bg-white rounded-xl p-6 shadow">
              <h3 className="font-semibold mb-4">Đơn hàng</h3>
              {!course ? (
                <div className="text-sm text-gray-500">Không có khóa học</div>
              ) : (
                <>
                  <div className="flex items-center gap-3 mb-3">
                    <img
                      src={course.courseImageUrl || "/topik.png"}
                      alt={course.courseName}
                      className="w-14 h-14 rounded object-cover"
                    />
                    <div className="flex-1">
                      <div className="font-medium line-clamp-2">
                        {course.courseName}
                      </div>
                      <div className="text-sm text-gray-500">
                        {course.courseLevel}
                      </div>
                    </div>
                    <div className="font-semibold text-gray-800">
                      {course.isFree ? "Miễn phí" : money(course.coursePrice)}
                    </div>
                  </div>
                  <div className="border-t pt-3 mt-3 flex justify-between text-sm">
                    <span className="text-gray-600">Tổng cộng</span>
                    <span className="font-semibold text-primary-600">
                      {money(total)}
                    </span>
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
