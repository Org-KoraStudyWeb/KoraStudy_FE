import axios from "axios";
import { API_BASE_URL, API_CONFIG, AUTH_TOKEN_KEY } from "../config";

// Tạo axios instance riêng cho enrollments
const enrollmentApi = axios.create({
  baseURL: `${API_BASE_URL}/api/v1/enrollments`,
  ...API_CONFIG,
});

// Setup interceptors để tự động thêm token
enrollmentApi.interceptors.request.use((config) => {
  const token = localStorage.getItem(AUTH_TOKEN_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

enrollmentApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem(AUTH_TOKEN_KEY);
      localStorage.removeItem("user");
      window.location.href = "/dang-nhap";
    }
    return Promise.reject(error);
  }
);

/**
 * Đăng ký khóa học FREE
 * @param {number} courseId - ID của khóa học
 * @returns {Promise} Thông tin ghi danh
 */
export async function enrollCourse(courseId) {
  try {
    console.log("📝 Enrolling in course:", courseId);
    const response = await enrollmentApi.post("", { courseId });
    console.log("✅ Enrolled successfully:", response.data);

    // Dispatch event để cập nhật UI
    try {
      window.dispatchEvent(
        new CustomEvent("enrollment:changed", { detail: { courseId } })
      );
    } catch (e) {
      // ignore if window not available
    }
    return response.data;
  } catch (error) {
    console.error(
      "❌ Enrollment error:",
      error.response?.data || error.message
    );
    throw error.response?.data || error.message;
  }
}

/**
 * ✅ THÊM: Kiểm tra trạng thái ghi danh của user HIỆN TẠI
 * @param {number} courseId - ID của khóa học
 * @returns {Promise<boolean>} true nếu đã ghi danh
 */
export async function checkMyEnrollment(courseId) {
  try {
    const response = await enrollmentApi.get(
      `/check-my-enrollment?courseId=${courseId}`
    );
    return response.data;
  } catch (error) {
    console.error(
      "❌ Check my enrollment error:",
      error.response?.data || error.message
    );
    throw error.response?.data || error.message;
  }
}

/**
 * ❌ DEPRECATED: Kiểm tra trạng thái ghi danh (cần userId)
 * @deprecated Use checkMyEnrollment instead
 */
export async function checkEnrollmentStatus(userId, courseId) {
  try {
    const response = await enrollmentApi.get(
      `/check?userId=${userId}&courseId=${courseId}`
    );
    return response.data;
  } catch (error) {
    console.error(
      "❌ Check enrollment error:",
      error.response?.data || error.message
    );
    throw error.response?.data || error.message;
  }
}

/**
 * Lấy danh sách khóa học đã ghi danh của user hiện tại
 * @returns {Promise<Array>} Danh sách khóa học đã ghi danh
 */
export async function getMyEnrollments() {
  try {
    const response = await enrollmentApi.get("/my-courses");
    return response.data;
  } catch (error) {
    console.error(
      "❌ Get enrollments error:",
      error.response?.data || error.message
    );
    throw error.response?.data || error.message;
  }
}

/**
 * Cập nhật tiến độ học tập
 * @param {number} enrollmentId - ID của ghi danh
 * @param {number} progress - Tiến độ mới (0-100)
 * @returns {Promise} Thông tin ghi danh đã cập nhật
 */
export async function updateProgress(enrollmentId, progress) {
  try {
    const response = await enrollmentApi.put(
      `/${enrollmentId}/progress?progress=${progress}`
    );
    return response.data;
  } catch (error) {
    console.error(
      "❌ Update progress error:",
      error.response?.data || error.message
    );
    throw error.response?.data || error.message;
  }
}

/**
 * Hủy ghi danh khóa học
 * @param {number} enrollmentId - ID của ghi danh cần hủy
 * @returns {Promise} Kết quả hủy ghi danh
 */
export async function cancelEnrollment(enrollmentId) {
  try {
    const response = await enrollmentApi.delete(`/${enrollmentId}`);
    return response.data;
  } catch (error) {
    console.error(
      "❌ Cancel enrollment error:",
      error.response?.data || error.message
    );
    throw error.response?.data || error.message;
  }
}

export default {
  enrollCourse,
  checkMyEnrollment,
  getMyEnrollments,
  updateProgress,
  cancelEnrollment,
};
