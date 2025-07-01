import axios from 'axios';

const API_URL = 'http://localhost:8080/api/v1/auth';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  }
);

// Response interceptor to handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      window.location.href = '/dang-nhap';
    }
    return Promise.reject(error);
  }
);

// Auth service methods
const authService = {
  // Register new user
  register: async (userData) => {
    try {
      const registrationData = {
        username: userData.username,
        email: userData.email,
        password: userData.password,
        confirmPassword: userData.confirmPassword
      };

      const response = await api.post('/register', registrationData);
      return response.data;
    } catch (error) {
      if (error.response) {
        const message = error.response.data?.message || 'Đăng ký thất bại';
        throw new Error(message);
      } else if (error.request) {
        throw new Error('Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng.');
      } else {
        throw new Error('Đã xảy ra lỗi khi đăng ký');
      }
    }
  },

  // Login user
  login: async (credentials) => {
    try {
      const loginData = {
        username: credentials.username,
        password: credentials.password
      };

      console.log('Sending login request:', loginData); // Debug log

      const response = await api.post('/login', loginData);
      
      console.log('Login response from server:', response.data); // Debug log
      
      if (response.data) {
        // Store token
        const token = response.data.token || response.data.accessToken;
        if (token) {
          localStorage.setItem('authToken', token);
        }
        
        // Create user object from response or credentials
        const userData = response.data.user || response.data.userInfo || {
          username: credentials.username,
          email: response.data.email || '',
          fullName: response.data.fullName || response.data.name || credentials.username,
          // Add default stats and other properties
          stats: {
            totalTests: 0,
            averageScore: 0,
            studyStreak: 0,
            totalStudyHours: 0
          },
          preferences: {
            testLevel: 'TOPIK I',
            interfaceLanguage: 'Vietnamese'
          },
          testHistory: [],
          badges: []
        };
        
        localStorage.setItem('user', JSON.stringify(userData));
        
        console.log('Stored user data:', userData); // Debug log
        
        return {
          ...response.data,
          user: userData
        };
      }
      
      throw new Error('Invalid response from server');
    } catch (error) {
      console.error('AuthService login error:', error);
      if (error.response) {
        const message = error.response.data?.message || 'Đăng nhập thất bại';
        throw new Error(message);
      } else if (error.request) {
        throw new Error('Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng.');
      } else {
        throw new Error('Đã xảy ra lỗi khi đăng nhập');
      }
    }
  },

  // Logout user
  logout: async () => {
    try {
      await api.post('/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
    }
  },

  // Get current user from localStorage
  getCurrentUser: () => {
    try {
      const user = localStorage.getItem('user');
      const parsedUser = user ? JSON.parse(user) : null;
      console.log('getCurrentUser:', parsedUser); // Debug log
      return parsedUser;
    } catch (error) {
      console.error('Error parsing user data:', error);
      return null;
    }
  },

  // Get current token
  getToken: () => {
    const token = localStorage.getItem('authToken');
    console.log('getToken:', token); // Debug log
    return token;
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    const token = localStorage.getItem('authToken');
    const user = localStorage.getItem('user');
    return !!(token && user);
  },

  // Other methods...
  refreshToken: async () => {
    try {
      const response = await api.post('/refresh');
      if (response.data.token || response.data.accessToken) {
        localStorage.setItem('authToken', response.data.token || response.data.accessToken);
        return response.data.token || response.data.accessToken;
      }
      throw new Error('Failed to refresh token');
    } catch (error) {
      authService.logout();
      throw error;
    }
  },

  forgotPassword: async (email) => {
    try {
      const response = await api.post('/forgot-password', { email });
      return response.data;
    } catch (error) {
      if (error.response) {
        throw new Error(error.response.data?.message || 'Gửi email thất bại');
      }
      throw error;
    }
  },

  updateProfile: async (userData) => {
    try {
      const response = await api.put('/profile', userData);
      if (response.data.user || response.data.userInfo) {
        localStorage.setItem('user', JSON.stringify(response.data.user || response.data.userInfo));
      }
      return response.data;
    } catch (error) {
      if (error.response) {
        throw new Error(error.response.data?.message || 'Cập nhật thông tin thất bại');
      }
      throw error;
    }
  }
};

export default authService;