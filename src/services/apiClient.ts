import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.mytherapist.ng/v1';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear tokens on unauthorized
      localStorage.removeItem('authToken');
      sessionStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    const errorMessage = error.response?.data?.message || error.message;
    return Promise.reject(new Error(errorMessage));
  }
);

export default apiClient;
