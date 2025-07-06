import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/v1';

// Tạo axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor để thêm token vào headers
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken') || localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor để handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    if (error.response?.status === 401) {
      // Token expired, redirect to login
      localStorage.removeItem('authToken');
      localStorage.removeItem('token');
      window.location.href = '/dang-nhap';
    }
    return Promise.reject(error);
  }
);

export const examService = {
  // Lấy danh sách tất cả bài thi - ENDPOINT ĐÚNG
  getAllExams: async () => {
    try {
      console.log('Calling API: GET /exams'); // Debug log
      const response = await api.get('/exams'); // Endpoint đúng như trong Postman
      console.log('API Response:', response.data); // Debug log
      return response.data;
    } catch (error) {
      console.error('Error fetching exams:', error);
      throw error;
    }
  },

  // Lấy chi tiết bài thi
  getExamDetail: async (id) => {
    try {
      console.log(`Calling API: GET /exams/${id}`); // Debug log
      const response = await api.get(`/exams/${id}`);
      console.log('Exam detail response:', response.data); // Debug log
      return response.data;
    } catch (error) {
      console.error('Error fetching exam detail:', error);
      throw error;
    }
  },

  // Lấy lịch sử làm bài của user
  getExamHistory: async (userId) => {
    try {
      const response = await api.get(`/exams/history`, {
        params: { userId }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching exam history:', error);
      throw error;
    }
  },

  // Lấy thống kê kết quả thi của user
  getExamStatistics: async (userId) => {
    try {
      const response = await api.get(`/exams/statistics`, {
        params: { userId }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching exam statistics:', error);
      throw error;
    }
  },

  // Nộp bài thi (cần truyền userId)
  submitExam: async (examId, answers, userId) => {
    try {
      const response = await api.post(`/exams/${examId}/submit?userId=${userId}`, {
        answers
      });
      return response.data;
    } catch (error) {
      console.error('Error submitting exam:', error);
      throw error;
    }
  },

  // Tìm kiếm bài thi
  searchExams: async (title, level, type) => {
    try {
      const params = new URLSearchParams();
      if (title) params.append('title', title);
      if (level) params.append('level', level);
      if (type) params.append('type', type);
      
      console.log(`Searching exams with params:`, params.toString()); // Debug log
      const response = await api.get(`/exams/search?${params}`);
      console.log('Search response:', response.data); // Debug log
      return response.data;
    } catch (error) {
      console.error('Error searching exams:', error);
      // Nếu search API chưa có, fallback về getAllExams và filter client-side
      const allExams = await this.getAllExams();
      let filteredExams = allExams;

      if (title) {
        filteredExams = filteredExams.filter(exam => 
          exam.title.toLowerCase().includes(title.toLowerCase())
        );
      }

      if (level) {
        filteredExams = filteredExams.filter(exam => 
          exam.level === level
        );
      }

      if (type) {
        filteredExams = filteredExams.filter(exam => 
          exam.category === type || exam.level === type
        );
      }

      return filteredExams;
    }
  },

  // Lấy chi tiết kết quả theo resultId
  getExamResultDetail: async (resultId) => {
    try {
      const response = await api.get(`/exams/result/${resultId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching exam result detail:', error);
      throw error;
    }
  },
};