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

// Lesson Service - USER ONLY
const lessonService = {
  // ==================== PUBLIC APIs ====================

  /**
   * Lấy thông tin chi tiết một bài học
   * PUBLIC API - không cần đăng nhập
   *
   * @param {Number} lessonId - ID của bài học
   * @returns {Object} Thông tin chi tiết bài học
   */
  getLessonById: async (lessonId) => {
    try {
      console.log(`📥 GET /api/v1/lessons/${lessonId}`);
      const response = await api.get(`/api/v1/lessons/${lessonId}`);
      console.log(`✅ Lấy thông tin bài học thành công:`, response.data);
      return response.data;
    } catch (error) {
      console.error(`❌ Lỗi khi lấy thông tin bài học ID=${lessonId}:`, error);
      throw error;
    }
  },

  /**
   * Lấy danh sách bài học của một chương
   * PUBLIC API - không cần đăng nhập
   *
   * @param {Number} sectionId - ID của chương học
   * @returns {Array} Danh sách bài học
   */
  getLessonsBySectionId: async (sectionId) => {
    try {
      console.log(`📥 GET /api/v1/lessons/section/${sectionId}`);
      const response = await api.get(`/api/v1/lessons/section/${sectionId}`);
      console.log(
        `✅ Lấy danh sách bài học theo section thành công:`,
        response.data.length,
        "bài học"
      );
      return response.data;
    } catch (error) {
      console.error(
        `❌ Lỗi khi lấy danh sách bài học của chương ID=${sectionId}:`,
        error
      );
      throw error;
    }
  },

  /**
   * Lấy danh sách bài học của một khóa học
   * PUBLIC API - không cần đăng nhập
   *
   * @param {Number} courseId - ID của khóa học
   * @returns {Array} Danh sách bài học
   */
  getLessonsByCourseId: async (courseId) => {
    try {
      console.log(`📥 GET /api/v1/lessons/course/${courseId}`);
      const response = await api.get(`/api/v1/lessons/course/${courseId}`);
      console.log(
        `✅ Lấy danh sách bài học theo course thành công:`,
        response.data.length,
        "bài học"
      );
      return response.data;
    } catch (error) {
      console.error(
        `❌ Lỗi khi lấy danh sách bài học của khóa học ID=${courseId}:`,
        error
      );
      throw error;
    }
  },

  // ==================== AUTHENTICATED USER APIs ====================

  /**
   * Cập nhật tiến độ học tập của bài học
   * USER FUNCTIONALITY - cần đăng nhập
   *
   * @param {Object} progressData - Dữ liệu tiến độ {lessonId, status, timeSpent}
   * @returns {Object} Thông tin tiến độ đã cập nhật
   */
  updateLessonProgress: async (progressData) => {
    try {
      // Format data theo đúng backend requirement
      const requestData = {
        lessonId: progressData.lessonId,
        status: progressData.status || "COMPLETED",
        timeSpent: progressData.timeSpent || 300, // Đảm bảo là number
      };

      console.log("📤 POST /api/v1/lessons/progress", requestData);
      const response = await api.post(`/api/v1/lessons/progress`, requestData);
      console.log("✅ Cập nhật tiến độ thành công:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Lỗi khi cập nhật tiến độ bài học:", error);
      console.error("Chi tiết lỗi:", error.response?.data);
      throw error;
    }
  },

  /**
   * Lấy tiến độ học tập của một bài học
   * USER FUNCTIONALITY - cần đăng nhập
   *
   * @param {Number} lessonId - ID của bài học
   * @returns {Object} Thông tin tiến độ học tập
   */
  getLessonProgress: async (lessonId) => {
    try {
      console.log(`📥 GET /api/v1/lessons/${lessonId}/progress`);
      const response = await api.get(`/api/v1/lessons/${lessonId}/progress`);
      console.log(`✅ Lấy tiến độ bài học thành công:`, response.data);
      return response.data;
    } catch (error) {
      console.error(
        `❌ Lỗi khi lấy tiến độ học tập của bài học ID=${lessonId}:`,
        error
      );
      throw error;
    }
  },

  /**
   * Lấy tiến độ học tập tất cả bài học trong một khóa học
   * USER FUNCTIONALITY - cần đăng nhập
   *
   * @param {Number} courseId - ID của khóa học
   * @returns {Array} Danh sách tiến độ học tập
   */
  getUserProgressByCourse: async (courseId) => {
    try {
      console.log(`📥 GET /api/v1/lessons/course/${courseId}/progress`);
      const response = await api.get(
        `/api/v1/lessons/course/${courseId}/progress`
      );
      console.log(
        `✅ Lấy tiến độ khóa học thành công:`,
        response.data.length,
        "bản ghi"
      );
      return response.data;
    } catch (error) {
      console.error(
        `❌ Lỗi khi lấy tiến độ học tập của khóa học ID=${courseId}:`,
        error
      );
      console.error("Chi tiết lỗi:", error.response?.data);
      throw error;
    }
  },

  // ==================== FILE UPLOAD APIs (ADMIN/CONTENT_MANAGER) ====================

  /**
   * Upload video bài học
   * ADMIN FUNCTIONALITY - cần quyền CONTENT_MANAGER hoặc ADMIN
   *
   * @param {File} file - File video
   * @param {String} title - Tiêu đề video
   * @returns {String} URL của video đã upload
   */
  uploadVideo: async (file, title = "") => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      if (title) {
        formData.append("title", title);
      }

      console.log("📤 POST /api/v1/lessons/upload/video", {
        title,
        fileSize: file.size,
      });
      const response = await api.post(
        `/api/v1/lessons/upload/video`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("✅ Upload video thành công:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Lỗi khi upload video:", error);
      throw error;
    }
  },

  /**
   * Upload tài liệu bài học
   * ADMIN FUNCTIONALITY - cần quyền CONTENT_MANAGER hoặc ADMIN
   *
   * @param {File} file - File tài liệu
   * @param {String} title - Tiêu đề tài liệu
   * @returns {String} URL của tài liệu đã upload
   */
  uploadDocument: async (file, title = "") => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      if (title) {
        formData.append("title", title);
      }

      console.log("📤 POST /api/v1/lessons/upload/document", {
        title,
        fileSize: file.size,
      });
      const response = await api.post(
        `/api/v1/lessons/upload/document`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("✅ Upload document thành công:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Lỗi khi upload document:", error);
      throw error;
    }
  },

  /**
   * Xóa file đã upload
   * ADMIN FUNCTIONALITY - cần quyền CONTENT_MANAGER hoặc ADMIN
   *
   * @param {String} fileUrl - URL của file cần xóa
   * @returns {void}
   */
  deleteFile: async (fileUrl) => {
    try {
      console.log("🗑️ DELETE /api/v1/lessons/files", { fileUrl });
      await api.delete(`/api/v1/lessons/files`, {
        params: { fileUrl },
      });
      console.log("✅ Xóa file thành công:", fileUrl);
    } catch (error) {
      console.error("❌ Lỗi khi xóa file:", error);
      throw error;
    }
  },

  // ==================== ADMIN MANAGEMENT APIs ====================

  /**
   * Tạo bài học mới
   * ADMIN FUNCTIONALITY - cần quyền CONTENT_MANAGER hoặc ADMIN
   *
   * @param {Object} lessonData - Dữ liệu bài học mới
   * @returns {Object} Bài học đã tạo
   */
  createLesson: async (lessonData) => {
    try {
      console.log("📤 POST /api/v1/lessons", lessonData);
      const response = await api.post(`/api/v1/lessons`, lessonData);
      console.log("✅ Tạo bài học thành công:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Lỗi khi tạo bài học:", error);
      throw error;
    }
  },

  /**
   * Cập nhật bài học
   * ADMIN FUNCTIONALITY - cần quyền CONTENT_MANAGER hoặc ADMIN
   *
   * @param {Number} id - ID bài học
   * @param {Object} lessonData - Dữ liệu cập nhật
   * @returns {Object} Bài học đã cập nhật
   */
  updateLesson: async (id, lessonData) => {
    try {
      console.log(`📤 PUT /api/v1/lessons/${id}`, lessonData);
      const response = await api.put(`/api/v1/lessons/${id}`, lessonData);
      console.log("✅ Cập nhật bài học thành công:", response.data);
      return response.data;
    } catch (error) {
      console.error(`❌ Lỗi khi cập nhật bài học ID=${id}:`, error);
      throw error;
    }
  },

  /**
   * Xóa bài học
   * ADMIN FUNCTIONALITY - cần quyền CONTENT_MANAGER hoặc ADMIN
   *
   * @param {Number} id - ID bài học
   * @returns {Object} Kết quả xóa
   */
  deleteLesson: async (id) => {
    try {
      console.log(`🗑️ DELETE /api/v1/lessons/${id}`);
      const response = await api.delete(`/api/v1/lessons/${id}`);
      console.log("✅ Xóa bài học thành công:", response.data);
      return response.data;
    } catch (error) {
      console.error(`❌ Lỗi khi xóa bài học ID=${id}:`, error);
      throw error;
    }
  },
};

export default lessonService;
