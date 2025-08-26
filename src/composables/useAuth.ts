import { ref } from 'vue';
import axios from 'axios';
import type { User, LoginData, ApiResponse } from '@/types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

export const useAuth = () => {
  const isLoading = ref(false);
  const error = ref<string | null>(null);
  const success = ref<string | null>(null);

  const signUp = async (userData: User): Promise<ApiResponse> => {
    isLoading.value = true;
    error.value = null;

    try {
      const response = await axios.post(`${API_BASE_URL}/auth/signup`, userData);
      success.value = 'Account created successfully!';
      return response.data;
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response) {
        error.value = err.response.data?.message || 'Signup failed';
      } else {
        error.value = 'Signup failed';
      }
      throw new Error(error.value ?? 'Signup failed');
    } finally {
      isLoading.value = false;
    }
  };

  const login = async (loginData: LoginData): Promise<ApiResponse> => {
    isLoading.value = true;
    error.value = null;

    try {
      const response = await axios.post(`${API_BASE_URL}/auth/login`, {
        username: loginData.username,
        password: loginData.password
      });

      if (response.data.token) {
        if (loginData.rememberMe) {
          localStorage.setItem('authToken', response.data.token);
        } else {
          sessionStorage.setItem('authToken', response.data.token);
        }
        success.value = 'Login successful!';
      }

      return response.data;
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response) {
        error.value = err.response.data?.message || 'Login failed';
      } else {
        error.value = 'Login failed';
      }
      throw new Error(error.value ?? 'Login failed');
    } finally {
      isLoading.value = false;
    }
  };

  const checkEmailAvailability = async (email: string): Promise<boolean> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/auth/check-email?email=${email}`);
      return response.data.available;
    } catch (err) {
      console.error('Error checking email:', err);
      return false;
    }
  };

  return {
    isLoading,
    error,
    success,
    signUp,
    login,
    checkEmailAvailability
  };
};
