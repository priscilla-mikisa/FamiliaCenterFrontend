<template>
  <div class="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
    <div class="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden relative">
      <div class="bg-green-600 p-6 text-center">
        <div class="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
          <div class="bg-white p-2 rounded-full">
            <ShieldCheckIcon class="w-8 h-8 text-green-600" />
          </div>
        </div>
        <h1 class="text-2xl font-bold text-white">Admin Portal</h1>
        <p class="text-green-100 mt-2">Secure Administrative Access</p>
      </div>

      <div v-if="loginStatus.message" :class="`px-4 py-3 mx-6 mt-4 rounded-lg ${
        loginStatus.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
      }`">
        {{ loginStatus.message }}
      </div>

      <form @submit.prevent="handleSubmit" class="p-6 sm:p-8">
        <div class="space-y-4">
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700 mb-1">
              Admin Email
            </label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MailIcon class="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="email"
                name="email"
                type="email"
                v-model="formData.email"
                required
                class="pl-10 w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="admin@example.com"
              />
            </div>
            <p v-if="errors.email" class="mt-1 text-sm text-red-600">{{ errors.email }}</p>
          </div>

          <div>
            <label for="password" class="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <LockIcon class="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="password"
                name="password"
                :type="showPassword ? 'text' : 'password'"
                v-model="formData.password"
                required
                class="pl-10 pr-10 w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="Enter your password"
              />
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                <EyeIcon v-if="!showPassword" class="h-5 w-5 text-gray-400 hover:text-gray-600" />
                <EyeOffIcon v-else class="h-5 w-5 text-gray-400 hover:text-gray-600" />
              </button>
            </div>
            <p v-if="errors.password" class="mt-1 text-sm text-red-600">{{ errors.password }}</p>
          </div>
        </div>

        <button
          type="submit"
          :disabled="isLoading"
          :class="`w-full mt-6 px-6 py-3 ${
            isLoading ? 'bg-green-500' : 'bg-green-600'
          } text-white font-medium rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 flex items-center justify-center disabled:opacity-50 transition`"
        >
          <span v-if="isLoading" class="flex items-center">
            <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Authenticating...
          </span>
          <span v-else class="flex items-center">
            <ShieldCheckIcon class="w-5 h-5 mr-2" />
            Access Admin Portal
          </span>
        </button>

        <div class="mt-6 text-center">
          <router-link to="/login" class="text-sm text-green-600 hover:text-green-700 font-medium">
            ← Back to User Login
          </router-link>
        </div>
      </form>

      <div class="px-8 py-6 bg-gray-50 text-center border-t">
        <div class="flex items-center justify-center space-x-2">
          <ShieldCheckIcon class="h-5 w-5 text-green-600" />
          <p class="text-sm text-gray-600">
            Your session is protected with end-to-end encryption
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import {
  ShieldCheckIcon,
  MailIcon,
  LockIcon,
  EyeIcon,
  EyeOffIcon
} from 'lucide-vue-next';

const router = useRouter();
const showPassword = ref(false);
const isLoading = ref(false);

const formData = reactive({
  email: '',
  password: ''
});

const errors = reactive({
  email: '',
  password: ''
});

const loginStatus = reactive({
  success: null as boolean | null,
  message: ''
});

const handleSubmit = async () => {
  loginStatus.message = '';
  errors.email = '';
  errors.password = '';

  if (!formData.email || !formData.password) {
    loginStatus.success = false;
    loginStatus.message = 'Please fill in all fields';
    return;
  }

  isLoading.value = true;

  try {
    const response = await axios.post(
      `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1'}/admin/login`,
      {
        email: formData.email,
        password: formData.password
      }
    );

    if (response.data.status && response.data.token) {
      // Clear any old tokens first to avoid conflicts
      localStorage.removeItem('authToken');
      localStorage.removeItem('token');
      sessionStorage.removeItem('authToken');
      sessionStorage.removeItem('token');
      
      // Store admin token (this is the admin token with account_type: "admin")
      localStorage.setItem('admin_token', response.data.token);
      localStorage.setItem('authToken', response.data.token);
      localStorage.setItem('userType', 'admin');
      localStorage.setItem('admin_id', response.data.admin_id);
      
      // Store token expiration
      if (response.data.expires_in) {
        const expiresAt = Date.now() + (response.data.expires_in * 1000);
        localStorage.setItem('token_expires_at', expiresAt.toString());
      }
      

      loginStatus.success = true;
      loginStatus.message = 'Login successful! Redirecting...';

      setTimeout(() => {
        router.push('/admin-dashboard');
      }, 1000);
    } else {
      throw new Error(response.data.detail || response.data.error || 'Login failed');
    }
  } catch (error: any) {
    loginStatus.success = false;
    if (error.response?.status === 401) {
      loginStatus.message = error.response?.data?.detail || 'Invalid credentials. Access denied.';
    } else if (error.response?.status === 400) {
      loginStatus.message = error.response?.data?.detail || error.response?.data?.error || 'Validation error';
    } else if (error.response?.data?.detail) {
      loginStatus.message = error.response.data.detail;
    } else if (error.response?.data?.error) {
      loginStatus.message = error.response.data.error;
    } else {
      loginStatus.message = 'An error occurred. Please try again.';
    }
    console.error('Admin login error:', error);
  } finally {
    isLoading.value = false;
  }
};
</script>
