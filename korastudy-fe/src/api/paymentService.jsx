import axios from "axios";
import { API_BASE_URL, API_CONFIG, AUTH_TOKEN_KEY } from "../config";

// Tạo axios instance riêng cho payments
const paymentApi = axios.create({
  baseURL: `${API_BASE_URL}/api/v1/payments`,
  timeout: 30000, // 30 giây (đủ cho payment)
  ...API_CONFIG,
});

// Setup interceptors để tự động thêm token
paymentApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

paymentApi.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("authToken");
      localStorage.removeItem("user");
      window.location.href = "/dang-nhap";
    }
    return Promise.reject(error);
  }
);

/**
 * Lấy thông tin người dùng để pre-fill form thanh toán
 * GET /api/v1/payments/buyer-info
 */
export async function getBuyerInfo() {
  try {
    console.log("👤 Fetching buyer info for pre-fill...");

    const response = await paymentApi.get("/buyer-info");

    console.log("✅ Buyer info loaded:", response.data);

    return response.data;
  } catch (error) {
    console.error("❌ Get buyer info error:", {
      error: error.response?.data || error.message,
    });

    if (error.response?.status === 401) {
      localStorage.removeItem("authToken");
      localStorage.removeItem("user");
      window.location.href = "/dang-nhap";
    }

    // Không throw error - để form hiển thị trống nếu không lấy được thông tin
    return {
      buyerName: "",
      buyerEmail: "",
      buyerPhone: "",
    };
  }
}

/**
 * 💳 Tạo yêu cầu thanh toán
 * Body: { courseId, amount, buyerName, buyerEmail, buyerPhone }
 */
export async function createPayment(paymentData) {
  try {
    const { courseId, amount, buyerName, buyerEmail, buyerPhone } = paymentData;

    // Validation cơ bản phía client
    if (!courseId || !amount || !buyerEmail) {
      throw new Error("Thiếu thông tin bắt buộc cho thanh toán");
    }

    if (amount < 1000) {
      throw new Error("Số tiền thanh toán phải lớn hơn 1,000 VND");
    }

    const body = {
      courseId,
      amount: Number(amount), // Đảm bảo là number
      buyerName,
      buyerEmail,
      buyerPhone,
    };

    console.log("🔄 Creating payment request:", body);

    const response = await paymentApi.post("/create", body);

    console.log("✅ Payment created successfully:", response.data);

    // Kiểm tra response structure
    if (!response.data?.paymentUrl) {
      console.error("Missing paymentUrl in response:", response.data);
      throw new Error("Không nhận được URL thanh toán từ server");
    }

    return response.data;
  } catch (error) {
    console.error("❌ Create payment error:", {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
    });

    // Xử lý lỗi cụ thể
    if (error.response?.status === 401) {
      const errorMsg = "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.";
      alert(errorMsg);
      localStorage.removeItem("authToken");
      localStorage.removeItem("user");
      window.location.href = "/dang-nhap";
      throw new Error(errorMsg);
    }

    const errorMessage =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      "Có lỗi xảy ra khi tạo thanh toán";

    throw new Error(errorMessage);
  }
}

/**
 * Lấy trạng thái thanh toán
 * GET /api/v1/payments/{paymentId}/status
 */
export async function getPaymentStatus(paymentId) {
  try {
    if (!paymentId) {
      throw new Error("Payment ID là bắt buộc");
    }

    console.log("🔍 Getting payment status for:", paymentId);

    const response = await paymentApi.get(`/${paymentId}/status`);
    const status = response.data;

    console.log("✅ Payment status:", status);

    return { status }; // Trả về object thống nhất
  } catch (error) {
    console.error("❌ Get payment status error:", {
      paymentId,
      error: error.response?.data || error.message,
    });

    if (error.response?.status === 401) {
      localStorage.removeItem("authToken");
      localStorage.removeItem("user");
      window.location.href = "/dang-nhap";
    }

    throw new Error(
      error.response?.data?.message ||
        error.message ||
        "Không thể lấy trạng thái thanh toán"
    );
  }
}

/**
 * 🛑 Hủy thanh toán
 * POST /api/v1/payments/{paymentId}/cancel
 */
export async function cancelPayment(paymentId) {
  try {
    if (!paymentId) {
      throw new Error("Payment ID là bắt buộc");
    }

    console.log("🛑 Canceling payment:", paymentId);

    const response = await paymentApi.post(`/${paymentId}/cancel`);

    console.log("✅ Payment canceled successfully:", response.data);

    return response.data;
  } catch (error) {
    console.error("❌ Cancel payment error:", {
      paymentId,
      error: error.response?.data || error.message,
    });

    if (error.response?.status === 401) {
      localStorage.removeItem("authToken");
      localStorage.removeItem("user");
      window.location.href = "/dang-nhap";
    }

    throw new Error(
      error.response?.data?.message ||
        error.message ||
        "Không thể hủy thanh toán"
    );
  }
}

/**
 * 📜 Lấy lịch sử thanh toán của user hiện tại
 * GET /api/v1/payments/history
 */
export async function getPaymentHistory() {
  try {
    console.log("📜 Fetching payment history...");

    const response = await paymentApi.get("/history");

    console.log(`✅ Loaded ${response.data?.length || 0} payment records`);

    return response.data || [];
  } catch (error) {
    console.error("❌ Get payment history error:", {
      error: error.response?.data || error.message,
    });

    if (error.response?.status === 401) {
      const errorMsg = "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.";
      alert(errorMsg);
      localStorage.removeItem("authToken");
      localStorage.removeItem("user");
      window.location.href = "/dang-nhap";
      throw new Error(errorMsg);
    }

    throw new Error(
      error.response?.data?.message ||
        error.message ||
        "Không thể lấy lịch sử thanh toán"
    );
  }
}

/**
 * 🔄 Kiểm tra và xử lý kết quả thanh toán từ callback
 * (Hàm utility cho component)
 */
export function handlePaymentCallback() {
  const urlParams = new URLSearchParams(window.location.search);
  const paymentId = urlParams.get("paymentId");
  const status = urlParams.get("status");
  const message = urlParams.get("message");

  return {
    paymentId,
    status, // 'success', 'failed', 'error'
    message,
    isSuccess: status === "success",
    isFailed: status === "failed",
    isError: status === "error",
  };
}

export default {
  getBuyerInfo,
  createPayment,
  getPaymentStatus,
  cancelPayment,
  getPaymentHistory,
  handlePaymentCallback,
};
