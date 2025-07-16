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
  submitExam: async (examId, submitRequest, userId) => {
    try {
      // Validate parameters
      if (!examId || isNaN(parseInt(examId))) {
        throw new Error('Exam ID không hợp lệ');
      }
      
      if (!userId || isNaN(parseInt(userId)) || parseInt(userId) <= 0) {
        throw new Error('User ID không hợp lệ: ' + userId);
      }
      
      if (!submitRequest || !submitRequest.answers || submitRequest.answers.length === 0) {
        throw new Error('Không có câu trả lời để nộp');
      }

      console.log('📤 Submitting exam:');
      console.log('- Exam ID:', examId, '(type:', typeof examId, ')');
      console.log('- User ID:', userId, '(type:', typeof userId, ')');
      console.log('- Request:', submitRequest);
      
      // Ensure userId is an integer
      const validUserId = parseInt(userId);
      const validExamId = parseInt(examId);
      
      // Send the submitRequest object as JSON body, userId as query param
      const response = await api.post(
        `/exams/${validExamId}/submit?userId=${validUserId}`, 
        submitRequest
      );
      
      console.log('✅ Submit response received:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error submitting exam:', error);
      
      // Provide more detailed error information
      if (error.response) {
        console.error('Response status:', error.response.status);
        console.error('Response data:', error.response.data);
        console.error('Response headers:', error.response.headers);
        
        // Handle specific error cases
        if (error.response.status === 404 && error.response.data?.message?.includes('người dùng')) {
          throw new Error('Không tìm thấy người dùng. Vui lòng đăng nhập lại.');
        } else if (error.response.status === 401) {
          throw new Error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
        } else if (error.response.status === 400) {
          throw new Error(`Dữ liệu không hợp lệ: ${error.response.data?.message || 'Vui lòng kiểm tra lại thông tin'}`);
        } else {
          throw new Error(`Submission failed: ${error.response.data?.message || error.message}`);
        }
      } else if (error.request) {
        throw new Error('Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.');
      } else {
        throw error;
      }
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
      console.log(`Adding comment for exam ${examId}`);
      const response = await api.post(`/exams/${examId}/comments?context=${encodeURIComponent(context)}&userId=${userId}`);
      console.log('Add comment response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error adding comment:', error);
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

  // Lấy chi tiết kết quả thi theo resultId
  getExamResultDetail: async (resultId) => {
    try {
      console.log(`Getting exam result detail for ID: ${resultId}`);
      const response = await api.get(`/exams/result/${resultId}`);
      console.log('Result detail response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching exam result detail:', error);
      throw error;
    }
  },

  // Lấy lịch sử làm bài của user
  getExamHistory: async (userId) => {
    try {
      console.log(`Getting exam history for user: ${userId}`);
      const response = await api.get(`/exams/history?userId=${userId}`);
      console.log('Exam history response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching exam history:', error);
      throw error;
    }
  },
};