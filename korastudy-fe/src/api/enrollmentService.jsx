import axios from "axios";
import { API_BASE_URL, API_CONFIG, AUTH_TOKEN_KEY } from "../config";

// Tạo axios instance riêng cho enrollments
const enrollmentApi = axios.create({
  baseURL: `${API_BASE_URL}/api/v1/enrollments`,
  ...API_CONFIG,
});

// Tạo axios instance cho courses
const courseApi = axios.create({
  baseURL: `${API_BASE_URL}/api/v1/courses`,
  ...API_CONFIG,
});

// Hàm chung để thêm token
const addAuthToken = (config) => {
  const token = localStorage.getItem(AUTH_TOKEN_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
};

// Setup interceptors để tự động thêm token
enrollmentApi.interceptors.request.use(addAuthToken);
courseApi.interceptors.request.use(addAuthToken);

// Interceptor chung cho 401
const handleUnauthorized = async (error) => {
  if (error.response?.status === 401) {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem("user");
    window.location.href = "/dang-nhap";
  }
  return Promise.reject(error);
};

enrollmentApi.interceptors.response.use(
  (response) => response,
  handleUnauthorized
);

courseApi.interceptors.response.use((response) => response, handleUnauthorized);

/**
 * Kiểm tra khóa học có miễn phí không
 */
export async function checkCourseIsFree(courseId) {
  try {
    // Thử gọi API check-free mới
    const response = await courseApi.get(`/${courseId}/check-free`);
    return response.data.isFree;
  } catch (error) {
    // Nếu API check-free không tồn tại, fallback bằng cách lấy course details
    try {
      const response = await courseApi.get(`/${courseId}`);
      const course = response.data;
      return course.coursePrice <= 0 || course.isFree === true;
    } catch (fallbackError) {
      throw fallbackError.response?.data || fallbackError.message;
    }
  }
}

/**
 * Đăng ký khóa học FREE
 */
export async function enrollCourse(courseId) {
  try {
    // Kiểm tra khóa học có free không
    const isFree = await checkCourseIsFree(courseId);
    if (!isFree) {
      throw new Error("Khóa học này có phí, vui lòng thanh toán trước");
    }

    const response = await enrollmentApi.post("", { courseId });

    // Dispatch event để cập nhật UI
    window.dispatchEvent(
      new CustomEvent("enrollment:changed", { detail: { courseId } })
    );

    return response.data;
  } catch (error) {
    const errorMessage =
      error.response?.data?.message ||
      error.response?.data ||
      error.message ||
      "Đăng ký thất bại";

    const detailedError = new Error(errorMessage);
    detailedError.isPaymentRequired =
      errorMessage.includes("thanh toán") ||
      errorMessage.includes("yêu cầu thanh toán") ||
      error.response?.status === 402;

    detailedError.isAlreadyEnrolled =
      errorMessage.includes("đã đăng ký") || errorMessage.includes("already");

    throw detailedError;
  }
}

/**
 * Kiểm tra trạng thái ghi danh của user hiện tại
 */
export async function checkMyEnrollment(courseId) {
  try {
    const response = await enrollmentApi.get(
      `/check-my-enrollment?courseId=${courseId}`
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
}

/**
 * Lấy danh sách khóa học đã ghi danh của user hiện tại
 */
export async function getMyEnrollments() {
  try {
    const response = await enrollmentApi.get("/my-courses");
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
}

/**
 * Cập nhật tiến độ học tập
 */
export async function updateProgress(enrollmentId, progress) {
  try {
    const response = await enrollmentApi.put(
      `/${enrollmentId}/progress?progress=${progress}`
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
}

/**
 * Hủy ghi danh khóa học
 */
export async function cancelEnrollment(enrollmentId) {
  try {
    const response = await enrollmentApi.delete(`/${enrollmentId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
}

export default {
  enrollCourse,
  checkCourseIsFree,
  checkMyEnrollment,
  getMyEnrollments,
  updateProgress,
  cancelEnrollment,
};
