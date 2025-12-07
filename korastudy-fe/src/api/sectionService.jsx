import axios from "axios";
import { API_BASE_URL, API_CONFIG, AUTH_TOKEN_KEY } from "../config";

// Create axios instance with base URL and config
const api = axios.create({
  baseURL: API_BASE_URL,
  ...API_CONFIG,
});

// Add request interceptor for authentication
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const customError = {
      message:
        error.response?.data?.message || "Đã xảy ra lỗi, vui lòng thử lại sau.",
      status: error.response?.status,
      data: error.response?.data,
    };
    return Promise.reject(customError);
  }
);

// Section Service - USER ONLY
const sectionService = {
  /**
   * Lấy danh sách chương học của một khóa học
   * PUBLIC API - không cần đăng nhập
   *
   * @param {Number} courseId - ID của khóa học
   * @returns {Array} Danh sách chương học
   */
  getSectionsByCourseId: async (courseId) => {
    try {
      const response = await api.get(`/api/v1/sections/course/${courseId}`);
      return response.data;
    } catch (error) {
      console.error(
        `Lỗi khi lấy danh sách chương học của khóa học ID=${courseId}:`,
        error
      );
      throw error;
    }
  },

  /**
   * Lấy thông tin chi tiết một chương học theo ID
   * PUBLIC API - không cần đăng nhập
   *
   * @param {Number} sectionId - ID của chương học
   * @returns {Object} Thông tin chi tiết chương học
   */
  getSectionById: async (sectionId) => {
    try {
      const response = await api.get(`/api/v1/sections/${sectionId}`);
      return response.data;
    } catch (error) {
      console.error(`Lỗi khi lấy thông tin chương học ID=${sectionId}:`, error);
      throw error;
    }
  },
};

export default sectionService;
