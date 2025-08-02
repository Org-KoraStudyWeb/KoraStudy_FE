import axios from 'axios';
import { API_BASE_URL } from '../config';

// Tạo axios instance
const notificationApi = axios.create({
  baseURL: `${API_BASE_URL}/api/v1/notifications`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor để thêm token vào headers
notificationApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const notificationService = {
  // Lấy thông báo của người dùng đang đăng nhập
  getMyNotifications: async () => {
    try {
      const response = await notificationApi.get('/me');
      return response.data;
    } catch (error) {
      console.error('Error fetching notifications:', error);
      return [];
    }
  },

  // Đếm số thông báo chưa đọc
  getUnreadCount: async () => {
    try {
      const response = await notificationApi.get('/unread-count');
      return response.data.count;
    } catch (error) {
      console.error('Error fetching unread count:', error);
      return 0;
    }
  },

  // Đánh dấu thông báo đã đọc
  markAsRead: async (notificationId) => {
    try {
      const response = await notificationApi.patch(`/${notificationId}/read`);
      return response.data;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  },

  // Đánh dấu tất cả thông báo đã đọc
  markAllAsRead: async () => {
    try {
      const response = await notificationApi.patch('/read-all');
      return response.data;
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      throw error;
    }
  }
};

export default notificationService;