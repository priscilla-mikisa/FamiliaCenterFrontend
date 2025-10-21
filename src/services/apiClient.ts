// src/services/apiClient.ts - Replace your existing file
import axios from 'axios';
import { TokenManager } from './tokenManager';

const apiClient = axios.create({
  baseURL: 'https://backend.fami.space/api/v1',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - handle token attachment and expiry
apiClient.interceptors.request.use(
  (config) => {
    const token = TokenManager.getValidToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('Added token to request:', config.url);
    } else {
      console.log('No token available for request:', config.url);
    }

    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor - handle authentication errors
apiClient.interceptors.response.use(
  (response) => {
    console.log('API Success:', response.config.url, response.status);
    return response;
  },
  (error) => {
    console.error('API Error:', {
      url: error.config?.url,
      status: error.response?.status,
      data: error.response?.data
    });

    if (error.response?.status === 401 || error.response?.status === 403) {
      console.warn('Authentication failed - redirecting to login');
      TokenManager.handleExpiredToken();
    }

    // Enhanced error messages
    let message = 'An error occurred';

    if (error.response?.data?.detail) {
      message = error.response.data.detail;
    } else if (error.response?.data?.error) {
      message = error.response.data.error;
    } else if (error.response?.status === 403) {
      message = 'Your session has expired. Please login again.';
    } else if (error.response?.status === 401) {
      message = 'Authentication required. Please login.';
    } else if (error.response?.status === 404) {
      message = `API endpoint not found: ${error.config?.url}`;
    } else if (error.message) {
      message = error.message;
    }

    const enhancedError = new Error(message);
    enhancedError.response = error.response;
    enhancedError.config = error.config;

    return Promise.reject(enhancedError);
  }
);

export default apiClient;
