import axios from 'axios';

// Base client kết nối đến server của bạn bạn
export const apiClient = axios.create({
  baseURL: 'http://10.20.86.150:8080',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 giây timeout
});

// Interceptor: Log lỗi chung
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const message = error.response?.data?.message || 'Lỗi kết nối đến server';
    console.error(`[API Error] ${status}: ${message}`);
    return Promise.reject(error);
  }
);
