import axios from 'axios';
import { API_BASE_URL, AUTH_TOKEN_KEY } from '../config';

/**
 * Service để tương tác với AI Chatbot qua backend
 * Hỗ trợ học tiếng Hàn và trả lời bằng tiếng Việt
 */
class GeminiService {
  /**
   * Lấy token từ localStorage
   */
  getAuthToken() {
    return localStorage.getItem(AUTH_TOKEN_KEY);
  }

  /**
   * Gửi tin nhắn đến AI qua backend API
   * @param {string} message - Tin nhắn của người dùng
   * @param {Array} conversationHistory - Lịch sử hội thoại (optional)
   * @returns {Promise<string>} - Phản hồi từ AI
   */
  async sendMessage(message, conversationHistory = []) {
    try {
      const token = this.getAuthToken();
      const headers = {
        'Content-Type': 'application/json',
      };
      
      // Thêm Authorization header nếu có token
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await axios.post(
        `${API_BASE_URL}/api/v1/ai/chat`,
        {
          message: message,
          conversationHistory: conversationHistory
        },
        { headers }
      );

      if (response.data?.success && response.data?.data?.message) {
        return response.data.data.message;
      } else {
        throw new Error('Không nhận được phản hồi hợp lệ từ AI');
      }
    } catch (error) {
      console.error('Lỗi khi gọi AI API:', error);
      
      if (error.response?.status === 429) {
        throw new Error('Đã vượt quá giới hạn yêu cầu. Vui lòng thử lại sau.');
      } else if (error.response?.status === 500) {
        throw new Error('Lỗi server. Vui lòng thử lại sau.');
      } else if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      } else if (error.message) {
        throw error;
      } else {
        throw new Error('Đã xảy ra lỗi khi kết nối với AI. Vui lòng thử lại.');
      }
    }
  }

  /**
   * Tạo gợi ý nhanh cho người học tiếng Hàn
   * @returns {Array<string>} - Danh sách câu hỏi gợi ý
   */
  getQuickSuggestions() {
    return [
      '안녕하세요 nghĩa là gì?',
      'Giải thích ngữ pháp -았/었어요',
      'Cách đếm số trong tiếng Hàn',
      'Từ vựng về thời tiết',
      'Cách nói "Tôi yêu bạn" trong tiếng Hàn',
      'Phân biệt 이/가 và 은/는',
      'Các cấp độ lịch sự trong tiếng Hàn'
    ];
  }
}

export default new GeminiService();
