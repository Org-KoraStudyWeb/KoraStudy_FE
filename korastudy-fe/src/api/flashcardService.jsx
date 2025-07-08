import axios from 'axios';
import { toast } from 'react-toastify';
import { API_BASE_URL } from '../config';

// Khởi tạo Axios instance
const flashcardApi = axios.create({
  baseURL: `${API_BASE_URL}/api/flashcards`
});

// Gắn token
flashcardApi.interceptors.request.use(
  config => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

// Xử lý lỗi chung
flashcardApi.interceptors.response.use(
  response => response,
  error => {
    toast.error(error.response?.data?.message || 'Có lỗi xảy ra!');
    return Promise.reject(error);
  }
);

// EXPORT SERVICE
export const flashcardService = {
  getUserSets: async () => {
    const res = await flashcardApi.get('/user');
    return res.data;
  },

  getSystemSets: async () => {
    const res = await flashcardApi.get('/system');
    return res.data;
  },

  getFlashcardSet: async (setId) => {
    const res = await flashcardApi.get(`/${setId}`);
    return res.data;
  },

  updateCardProgress: async (cardId, isKnown) => {
    const res = await flashcardApi.patch('/progress', { cardId, isKnown });
    return res.data;
  },

  createFlashcardSet: async (setData) => {
    const apiData = {
      title: setData.title,
      description: setData.description,
      category: setData.category || "Từ vựng",
      cards: setData.words.map(word => ({
        term: word.korean,
        definition: word.vietnamese,
        example: word.example || "",
        imageUrl: word.imageUrl || null
      }))
    };
    const res = await flashcardApi.post('', apiData);
    toast.success('Tạo bộ flashcard thành công!');
    return res.data;
  },

  createSystemSet: async (setData) => {
    const apiData = {
      title: setData.title,
      description: setData.description,
      category: setData.category || "Từ vựng",
      cards: setData.words.map(word => ({
        term: word.korean,
        definition: word.vietnamese,
        example: word.example || "",
        imageUrl: word.imageUrl || null
      }))
    };
    const res = await flashcardApi.post('/system', apiData);
    toast.success('Tạo bộ flashcard hệ thống thành công!');
    return res.data;
  },
  
  deleteFlashcardSet: async (setId) => {
    try {
      const res = await flashcardApi.delete(`/${setId}`);
      toast.success('Đã xóa bộ flashcard thành công!');
      return res.data;
    } catch (error) {
      if (error.response?.status === 403) {
        toast.error(error.response?.data || 'Bạn không có quyền xóa bộ flashcard này');
      } else {
        toast.error('Không thể xóa bộ flashcard');
      }
      throw error;
    }
  }
};

export default flashcardService;
