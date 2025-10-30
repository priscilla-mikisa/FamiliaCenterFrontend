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
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1',
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
      return config;
    }

    const token = TokenManager.getValidToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
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
    // Response successful, return as-is
    return response;
  },
  (error: AxiosError<ApiErrorResponse>) => {
    const url = error.config?.url || '';
    const status = error.response?.status;
    
    // Suppress error logging for 404s on subscription/current endpoint (valid case - no subscription)
    const isSubscriptionCurrentEndpoint = url.includes('/subscriptions/current');
    
    if (!isSubscriptionCurrentEndpoint) {
      console.error('API Error:', {
        url,
        status,
        data: error.response?.data
      });
    }

    if (!isPublicEndpoint(url)) {
      if (status === 401 || status === 403) {
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
    } else if (status === 403) {
      message = 'Your session has expired. Please login again.';
    } else if (status === 401) {
      message = 'Authentication required. Please login.';
    } else if (status === 404) {
      // Don't show error message for subscription/current 404s
      if (!isSubscriptionCurrentEndpoint) {
        message = `API endpoint not found: ${url}`;
      }
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
