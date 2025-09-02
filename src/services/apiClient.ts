import axios, { type AxiosResponse, type AxiosError, type AxiosRequestConfig } from 'axios';
import { TokenManager } from './tokenManager';

interface ApiErrorResponse {
  detail?: string;
  error?: string;
  message?: string;
}

interface EnhancedError extends Error {
  response?: AxiosResponse<ApiErrorResponse>;
  config?: AxiosRequestConfig;
}

const apiClient = axios.create({
  baseURL: 'https://backend.fami.space/api/v1',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

const publicEndpoints = [
  '/users/register',
  '/counsellor/register',
  '/auth/login',
  '/auth/refresh',
  '/auth/forgot-password',
  '/auth/reset-password'
];

const isPublicEndpoint = (url: string): boolean => {
  return publicEndpoints.some(endpoint => url.includes(endpoint));
};

apiClient.interceptors.request.use(
  (config) => {
    if (isPublicEndpoint(config.url || '')) {
      console.log('Public endpoint, skipping auth:', config.url);
      return config;
    }

    const token = TokenManager.getValidToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('Adding Authorization header to request:', config.url);
    } else {
      console.warn('No valid token found for request:', config.url);

      const authStatus = TokenManager.getAuthStatus();
      if (authStatus.wasRemembered || authStatus.userType) {
        console.warn('Token expired or missing, handling expired session');
        TokenManager.handleExpiredToken();
      }
    }

    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => {
    if (import.meta.env.DEV) {
      console.log('API Success:', {
        url: response.config.url,
        status: response.status,
        data: response.data
      });
    }
    return response;
  },
  (error: AxiosError<ApiErrorResponse>) => {
    console.error('API Error:', {
      url: error.config?.url,
      status: error.response?.status,
      data: error.response?.data
    });

    if (!isPublicEndpoint(error.config?.url || '')) {
      if (error.response?.status === 401 || error.response?.status === 403) {
        console.warn('Authentication failed - handling expired token');
        TokenManager.handleExpiredToken();
      }
    }

    let message = 'An error occurred';

    const errorData = error.response?.data;
    if (errorData?.detail) {
      message = errorData.detail;
    } else if (errorData?.error) {
      message = errorData.error;
    } else if (error.response?.status === 403) {
      message = 'Your session has expired. Please login again.';
    } else if (error.response?.status === 401) {
      message = 'Authentication required. Please login.';
    } else if (error.response?.status === 404) {
      message = `API endpoint not found: ${error.config?.url}`;
    } else if (error.message) {
      message = error.message;
    }

    const enhancedError: EnhancedError = new Error(message);
    enhancedError.response = error.response;
    enhancedError.config = error.config;

    return Promise.reject(enhancedError);
  }
);

export default apiClient;
