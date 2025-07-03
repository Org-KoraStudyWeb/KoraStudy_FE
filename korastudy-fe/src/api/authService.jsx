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
        
        // Tạo user object từ response - sửa lại để lưu đúng ID
        const userData = {
          id: response.data.id, // Lấy ID trực tiếp từ response
          username: response.data.username || credentials.username,
          email: response.data.email || '',
          firstName: response.data.firstName || '',
          lastName: response.data.lastName || '',
          phoneNumber: response.data.phoneNumber || '',
          gender: response.data.gender || '',
          avatar: response.data.avatar || null,
          dateOfBirth: response.data.dateOfBirth || '',
          roles: response.data.roles || ['USER'],
          fullName: response.data.fullName || response.data.name || 
                  `${response.data.firstName || ''} ${response.data.lastName || ''}`.trim() || 
                  response.data.username || credentials.username,
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
          token: token,
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
    const userString = localStorage.getItem('user');
    console.log('Raw user string from localStorage:', userString); // Debug log
    
    if (!userString) {
      console.log('No user data in localStorage'); // Debug log
      return null;
    }
    
    const parsedUser = JSON.parse(userString);
    console.log('Parsed user data:', parsedUser); // Debug log
    console.log('User ID:', parsedUser?.id); // Debug log
    
    return parsedUser;
  } catch (error) {
    console.error('Error parsing user data:', error);
    localStorage.removeItem('user'); // Xóa dữ liệu lỗi
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
    // Lấy user hiện tại từ localStorage
    const currentUser = authService.getCurrentUser();
    const userId = currentUser?.id;
    if (!userId) {
      throw new Error('User ID not found in localStorage. Please login again.');
    }

    console.log('[updateProfile] Updating user ID:', userId);

    // Chuẩn bị request data
    const requestData = {
      email: userData.email,
      firstName: userData.firstName,
      lastName: userData.lastName,
      phoneNumber: userData.phoneNumber,
      gender: userData.gender,
      avatar: userData.avatar || null,
      dateOfBirth: userData.dateOfBirth || null
    };

    console.log('[updateProfile] Request data:', requestData);
    
    try {
      // Dùng axios với error handling
      const response = await api.put(`/user/profile/${userId}`, requestData);
      
      console.log('[updateProfile] Response status:', response.status);
      console.log('[updateProfile] Response headers:', response.headers);
      
      // Phòng trường hợp response.data là string, không phải object
      let responseData = response.data;
      if (typeof responseData === 'string') {
        try {
          responseData = JSON.parse(responseData);
          console.log('[updateProfile] Parsed string response:', responseData);
        } catch (parseError) {
          console.warn('[updateProfile] Could not parse response as JSON:', parseError);
          // Nếu không parse được, sử dụng userData làm dữ liệu thay thế
          responseData = { ...userData };
        }
      }

      // Cập nhật localStorage user
      const updatedUser = {
        ...currentUser,
        email: responseData.email || userData.email || currentUser.email,
        firstName: responseData.firstName || userData.firstName || currentUser.firstName,
        lastName: responseData.lastName || userData.lastName || currentUser.lastName,
        phoneNumber: responseData.phoneNumber || userData.phoneNumber || currentUser.phoneNumber,
        gender: responseData.gender || userData.gender || currentUser.gender,
        avatar: responseData.avatar || userData.avatar || currentUser.avatar,
        dateOfBirth: responseData.dateOfBirth || userData.dateOfBirth || currentUser.dateOfBirth,
        fullName: `${responseData.firstName || userData.firstName || ''} ${responseData.lastName || userData.lastName || ''}`.trim() || currentUser.fullName
      };

      localStorage.setItem('user', JSON.stringify(updatedUser));
      console.log('[updateProfile] Updated user stored:', updatedUser);
      
      return updatedUser;
    } catch (axiosError) {
      // Xử lý lỗi từ axios
      console.error('[updateProfile] Axios error:', axiosError);
      
      // Thử direct fetch request nếu axios thất bại
      console.log('[updateProfile] Trying with fetch API as fallback');
      
      const response = await fetch(`http://localhost:8080/api/v1/user/profile/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify(requestData)
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      // Lấy response text trước để log
      const responseText = await response.text();
      console.log('[updateProfile] Fetch response text:', responseText);
      
      // Nếu không có content hoặc rỗng, coi như thành công
      if (!responseText || responseText.trim() === '') {
        console.log('[updateProfile] Empty response, treating as success');
        
        // Cập nhật localStorage user với userData đã gửi đi
        const updatedUser = {
          ...currentUser,
          ...userData
        };
        
        localStorage.setItem('user', JSON.stringify(updatedUser));
        return updatedUser;
      }
      
      // Thử parse JSON
      try {
        const responseData = JSON.parse(responseText);
        
        // Cập nhật localStorage user
        const updatedUser = {
          ...currentUser,
          ...responseData
        };
        
        localStorage.setItem('user', JSON.stringify(updatedUser));
        return updatedUser;
      } catch (jsonError) {
        console.error('[updateProfile] JSON parse error:', jsonError);
        console.log('[updateProfile] Using userData as fallback');
        
        // Nếu không parse được, dùng userData
        const updatedUser = {
          ...currentUser,
          ...userData
        };
        
        localStorage.setItem('user', JSON.stringify(updatedUser));
        return updatedUser;
      }
    }
  } catch (error) {
    console.error('[updateProfile] Error:', error);
    
    // Kiểm tra nếu là lỗi JSON
    if (error.message && (
      error.message.includes('Unexpected token') || 
      error.message.includes('JSON')
    )) {
      console.log('[updateProfile] JSON error detected, attempting to update user locally');
      
      // Lấy currentUser từ localStorage
      const currentUser = authService.getCurrentUser();
      if (currentUser) {
        // Cập nhật locally
        const updatedUser = {
          ...currentUser,
          ...userData
        };
        
        localStorage.setItem('user', JSON.stringify(updatedUser));
        return updatedUser;
      }
    }
    
    // Re-throw error khác
    throw error;
  }
}

 


};

export default authService;