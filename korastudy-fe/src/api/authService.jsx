import axios from 'axios';

const API_URL = 'http://localhost:8080/api'; // Adjust this to your API base URL

const authService = {
  register: async (registerData) => {
    try {
      const response = await axios.post(`${API_URL}/auth/register`, registerData);
      return response.data;
    } catch (error) {
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        throw new Error(error.response.data.message || 'Registration failed');
      } else if (error.request) {
        // The request was made but no response was received
        throw new Error('No response from server. Please try again later.');
      } else {
        // Something happened in setting up the request
        throw new Error('Error setting up request: ' + error.message);
      }
    }
  }
};

export default authService;