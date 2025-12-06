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

  // Nộp bài thi
  submitExam: async (examId, answers, userId) => {
    try {
      console.log(`Submitting exam ${examId} with answers:`, answers, 'userId:', userId); // Debug log
      // Truyền userId lên query param
      const response = await api.post(`/exams/${examId}/submit?userId=${userId}`, answers);
      console.log('Submit response:', response.data); // Debug log
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
      params.append('size', 1000); // Fetch all matching exams for client-side pagination
      
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

  // Lấy comments của bài thi
  getExamComments: async (examId) => {
    try {
      console.log(`Getting comments for exam ${examId}`);
      const response = await api.get(`/exams/${examId}/comments`);
      console.log('Comments response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching comments:', error);
      throw error;
    }
  },

  // Thêm comment cho bài thi
  addExamComment: async (examId, context, userId) => {
    try {
      console.log(`Adding comment for exam ${examId}, userId: ${userId}, content: "${context}"`);
      
      // Thử các cách khác nhau để gửi userId
      const requestBody = {
        context: context,
        userId: userId
      };
      
      console.log('Request body:', requestBody);
      
      // Thêm userId vào cả query parameters và body để đảm bảo
      const response = await api.post(`/exams/${examId}/comments?userId=${userId}`, requestBody);
      
      console.log('Add comment response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error adding comment:', error);
      if (error.response?.data?.message?.includes('người dùng') || 
          error.response?.data?.message?.includes('User not found')) {
        throw new Error('Không thể xác thực người dùng. Vui lòng đăng nhập lại và thử lại.');
      }
      throw error;
    }
  },

  // Xóa comment bài thi
  deleteExamComment: async (examId, commentId) => {
    try {
      console.log(`Deleting comment ${commentId} for exam ${examId}`);
      const response = await api.delete(`/exams/${examId}/comments/${commentId}`);
      console.log('Delete comment response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error deleting comment:', error);
      throw error;
    }
  },

  // Nộp bài practice test
  submitPracticeTest: async (examId, partIds, answers, userId) => {
    try {
      console.log(`Submitting practice test ${examId} with parts:`, partIds);
      const params = new URLSearchParams();
      partIds.forEach(id => params.append('partIds', id));
      params.append('userId', userId);
      
      const response = await api.post(`/exams/${examId}/submit-practice?${params}`, { answers });
      console.log('Practice submit response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error submitting practice test:', error);
      throw error;
    }
  },
};