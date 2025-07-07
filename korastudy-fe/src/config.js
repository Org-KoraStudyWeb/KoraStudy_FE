/**
 * Cấu hình chung cho ứng dụng KoraStudy
 */

// API và Auth config
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
export const AUTH_TOKEN_KEY = 'authToken';

// Cài đặt ứng dụng
export const APP_CONFIG = {
  name: 'KoraStudy',
  description: 'Nền tảng học tiếng Hàn hiệu quả',
  version: '1.0.0',
  supportEmail: 'support@korastudy.com'
};

// Cấu hình upload file
export const UPLOAD_CONFIG = {
  maxFileSize: 5 * 1024 * 1024, // 5MB
  allowedImageTypes: ['image/jpeg', 'image/png', 'image/gif'],
  allowedAudioTypes: ['audio/mpeg', 'audio/wav']
};

// Cấu hình flashcard
export const FLASHCARD_CONFIG = {
  minCardsPerSet: 1,
  maxCardsPerSet: 100,
  defaultCategory: 'Từ vựng'
};