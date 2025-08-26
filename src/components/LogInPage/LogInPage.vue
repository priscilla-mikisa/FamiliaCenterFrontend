<template>
  <div class="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
    <div class="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden relative">
      <!-- Close button -->
      <button
        @click="handleClose"
        class="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-100 transition-colors"
        aria-label="Close login"
      >
        <XIcon class="w-6 h-6 text-gray-500" />
      </button>

      <div class="bg-green-600 p-6 text-center">
        <div class="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
          <div class="bg-white p-2 rounded-full">
            <ShieldCheckIcon class="w-8 h-8 text-green-600" />
          </div>
        </div>
        <h1 class="text-2xl font-bold text-white">Welcome Back</h1>
        <p class="text-green-100 mt-2">Sign in to your account</p>
      </div>

      <!-- Status message -->
      <div v-if="loginStatus.message" :class="`px-4 py-3 mx-6 mt-4 rounded-lg ${
        loginStatus.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
      }`">
        {{ loginStatus.message }}
      </div>

      <form @submit.prevent="handleSubmit" class="p-6 sm:p-8">
        <div class="space-y-4">
          <div>
            <label for="username" class="block text-sm font-medium text-gray-700 mb-1">
              Username
            </label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MailIcon class="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="username"
                name="username"
                type="text"
                v-model="formData.username"
                class="pl-10 w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Enter your username"
              />
            </div>
            <p v-if="errors.username" class="mt-1 text-sm text-red-600">{{ errors.username }}</p>
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
                type="password"
                v-model="formData.password"
                class="pl-10 w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Enter your password"
              />
            </div>
            <p v-if="errors.password" class="mt-1 text-sm text-red-600">{{ errors.password }}</p>
          </div>

          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <input
                id="rememberMe"
                name="rememberMe"
                type="checkbox"
                v-model="formData.rememberMe"
                class="h-4 w-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
              />
              <label for="rememberMe" class="ml-2 block text-sm text-gray-700">
                Remember me
              </label>
            </div>
            <div class="text-sm">
              <a href="#" class="text-green-600 hover:underline">
                Forgot password?
              </a>
            </div>
          </div>
        </div>

        <button
          type="submit"
          :disabled="isLoading"
          :class="`w-full mt-6 px-6 py-3 ${
            isLoading ? 'bg-green-500' : 'bg-green-600'
          } text-white font-medium rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 flex items-center justify-center`"
        >
          <span v-if="isLoading" class="flex items-center">
            <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Signing in...
          </span>
          <span v-else class="flex items-center">
            Sign In <ArrowRightIcon class="w-5 h-5 ml-2" />
          </span>
        </button>

        <div class="mt-6 text-center">
          <p class="text-sm text-gray-600">
            Don't have an account?
            <router-link to="/signup" class="text-green-600 font-medium hover:underline">
              Sign up
            </router-link>
          </p>
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
import { reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from '@/composables/useAuth';
import { useValidation } from '@/composables/useValidation';

const router = useRouter();
const { login, isLoading } = useAuth();
const { errors, validateLoginForm } = useValidation();

const formData = reactive({
  username: '',
  password: '',
  rememberMe: false
});

const loginStatus = reactive({
  success: null as boolean | null,
  message: ''
});

// Close modal handler
const handleClose = () => {
  router.push('/');
};

const handleSubmit = async () => {
  if (validateLoginForm(formData)) {
    try {
      const response = await login({
        username: formData.username,
        password: formData.password,
        rememberMe: formData.rememberMe
      });

      if (response?.token) {
        // Successful login
        loginStatus.success = true;
        loginStatus.message = 'Login successful! Redirecting...';

        // Redirect to dashboard after 2 seconds
        setTimeout(() => {
          router.push('/dashboard');
        }, 2000);
      } else {
        // Failed login
        loginStatus.success = false;
        loginStatus.message = response?.message || 'Invalid username or password';
      }
    } catch {
      loginStatus.success = false;
      loginStatus.message = 'An error occurred during login';
    }
  }
};

// Clear status message after 5 seconds
if (loginStatus.message) {
  setTimeout(() => {
    loginStatus.message = '';
  }, 5000);
}
</script>
