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
  '/auth/reset-password',
  '/admin/login',
  '/forums'
];

const isPublicEndpoint = (url: string): boolean => {
  if (!url) return false;
  // Check for exact matches or paths that start with the endpoint
  // This prevents /admin/forums from matching /forums
  return publicEndpoints.some(endpoint => {
    // Exact match
    if (url === endpoint) return true;
    // Path starts with endpoint followed by / or ?
    if (url.startsWith(endpoint + '/') || url.startsWith(endpoint + '?')) return true;
    // For /forums, only match if it's exactly /forums or /forums/... but NOT /admin/forums
    if (endpoint === '/forums') {
      return url === '/forums' || (url.startsWith('/forums/') && !url.startsWith('/admin/forums'));
    }
    return false;
  });
};

apiClient.interceptors.request.use(
  (config) => {
    const isAdminEndpoint = config.url?.includes('/admin/');
    
    if (isPublicEndpoint(config.url || '')) {
      return config;
    }

    // Check for admin token first (for admin endpoints)
    let token: string | null = null;
    const userType = localStorage.getItem('userType');
    
    if (userType === 'admin' || isAdminEndpoint) {
      // For admin endpoints, ALWAYS use admin_token (the token from admin login)
      // This token has account_type: "admin" in its claims
      const adminToken = localStorage.getItem('admin_token');
      const authToken = localStorage.getItem('authToken');
      
      if (adminToken) {
        token = adminToken;
      } else if (authToken) {
        token = authToken;
      }
    } else {
      // For non-admin users, use TokenManager
      token = TokenManager.getValidToken();
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      const authStatus = TokenManager.getAuthStatus();
      if (authStatus.wasRemembered || authStatus.userType) {
        TokenManager.handleExpiredToken();
      }
    }

    return config;
  },
  (error) => {
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

    if (!isPublicEndpoint(url)) {
      if (status === 401 || status === 403) {
        const userType = localStorage.getItem('userType');
        const isAdminEndpoint = url.includes('/admin/');
        
        if (userType === 'admin' || isAdminEndpoint) {
          // Don't auto-redirect on 403 - let user see the error
          // They might need to log in again or check their token
        } else {
          TokenManager.handleExpiredToken();
        }
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
