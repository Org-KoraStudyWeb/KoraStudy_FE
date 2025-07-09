import axios from 'axios';
import { toast } from 'react-toastify';
import { API_BASE_URL } from '../config';

// Khởi tạo Axios instance
const flashcardApi = axios.create({
  baseURL: `${API_BASE_URL}/api/flashcards`,
  timeout: 10000, // optional: timeout 10s
});

//  Interceptor: Gắn token hợp lệ nếu có
flashcardApi.interceptors.request.use(
  config => {
    const token = localStorage.getItem('authToken');

    if (
      token &&
      token.trim() !== '' &&
      token !== 'null' &&
      token !== 'undefined'
    ) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  error => Promise.reject(error)
);

// Interceptor: Xử lý lỗi chung & custom toast
flashcardApi.interceptors.response.use(
  response => response,
  error => {
    const isSystemEndpoint = error.config?.url?.includes('/system');
    const isUnauthorized = error.response?.status === 401;

    if (!(isSystemEndpoint && isUnauthorized)) {
      toast.error(error.response?.data?.message || 'Đã xảy ra lỗi!');
    }

    return Promise.reject(error);
  }
);

//
//  Service các hàm gọi API: Clean code, trả dữ liệu rõ ràng
//
export const flashcardService = {
  // Lấy các bộ của user đang đăng nhập
  getUserSets: async () => {
    const res = await flashcardApi.get('/user');
    return res.data;
  },

  //  Lấy các bộ hệ thống (public)
  getSystemSets: async () => {
    try {
      const res = await flashcardApi.get('/system');
      return res.data;
    } catch (error) {
      console.warn('Could not fetch system flashcards:', error);
      return [];
    }
  },

  //  Lấy chi tiết 1 bộ flashcard
  getFlashcardSet: async (setId) => {
    const res = await flashcardApi.get(`/${setId}`);
    return res.data;
  },

  //  Cập nhật progress (biết/chưa biết)
  updateCardProgress: async (cardId, isKnown) => {
    const res = await flashcardApi.patch('/progress', { cardId, isKnown });
    return res.data;
  },

  //  Tạo bộ flashcard của user
  createFlashcardSet: async (setData) => {
    const apiData = {
      title: setData.title,
      description: setData.description,
      category: setData.category || "Từ vựng",
      cards: setData.words.map(word => ({
        term: word.korean,
        definition: word.vietnamese,
        example: word.example || "",
        imageUrl: word.imageUrl || null,
      })),
    };

    const res = await flashcardApi.post('', apiData);
    toast.success('Tạo bộ flashcard thành công!');
    return res.data;
  },

  //  Tạo bộ flashcard hệ thống (admin)
  createSystemSet: async (setData) => {
    const apiData = {
      title: setData.title,
      description: setData.description,
      category: setData.category || "Từ vựng",
      cards: setData.words.map(word => ({
        term: word.korean,
        definition: word.vietnamese,
        example: word.example || "",
        imageUrl: word.imageUrl || null,
      })),
    };

    const res = await flashcardApi.post('/system', apiData);
    toast.success('Tạo bộ flashcard hệ thống thành công!');
    return res.data;
  },

  //  Cập nhật bộ flashcard của user
  updateFlashcardSet: async (setId, setData) => {
    const apiData = {
      title: setData.title,
      description: setData.description,
      category: setData.category || "Từ vựng",
      cards: setData.words.map(word => ({
        term: word.korean,
        definition: word.vietnamese,
        example: word.example || "",
        imageUrl: word.imageUrl || null,
      })),
    };

    const res = await flashcardApi.put(`/${setId}`, apiData);
    toast.success('Cập nhật bộ flashcard thành công!');
    return res.data;
  },

  //  Xóa bộ flashcard của user
  deleteFlashcardSet: async (setId) => {
    try {
      const res = await flashcardApi.delete(`/${setId}`);
      toast.success('Đã xoá bộ flashcard thành công!');
      return res.data;
    } catch (error) {
      if (error.response?.status === 403) {
        toast.error(error.response?.data || 'Bạn không có quyền xoá bộ flashcard này');
      } else {
        toast.error('Không thể xoá bộ flashcard');
      }
      throw error;
    }
  },
};


export default flashcardService;
