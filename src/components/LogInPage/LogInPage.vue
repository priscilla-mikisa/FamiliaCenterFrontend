<template>
  <div class="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
    <div class="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden relative">
      <!-- Close button -->
      <button
        @click="handleClose"
        class="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-100 transition-colors z-10"
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

      <!-- User Type Selection -->
      <div class="p-4 bg-gray-50 border-b">
        <label class="block text-sm font-medium text-gray-700 mb-2">Login as:</label>
        <div class="flex space-x-2">
          <button
            type="button"
            @click="selectedUserType = 'user'"
            :class="`flex-1 px-3 py-2 text-sm rounded-lg border transition-colors ${
              selectedUserType === 'user'
                ? 'bg-green-600 text-white border-green-600'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            }`"
          >
            Patient/Client
          </button>
          <button
            type="button"
            @click="selectedUserType = 'counselor'"
            :class="`flex-1 px-3 py-2 text-sm rounded-lg border transition-colors ${
              selectedUserType === 'counselor'
                ? 'bg-green-600 text-white border-green-600'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            }`"
          >
            Counselor
          </button>
          <button
            type="button"
            @click="selectedUserType = 'admin'"
            :class="`flex-1 px-3 py-2 text-sm rounded-lg border transition-colors ${
              selectedUserType === 'admin'
                ? 'bg-green-600 text-white border-green-600'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            }`"
          >
            Admin
          </button>
        </div>
      </div>

      <!-- SESSION EXPIRY MESSAGES - ADD THIS HERE -->
      <!-- Session Expired Message -->
      <div v-if="sessionExpiredMessage.show" class="mx-6 mt-4 p-4 bg-orange-50 border border-orange-200 rounded-lg">
        <div class="flex items-center">
          <svg class="w-5 h-5 text-orange-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
          </svg>
          <div>
            <h3 class="text-sm font-medium text-orange-800">Session Expired</h3>
            <p class="text-sm text-orange-700 mt-1">
              Your session has expired. Please login again to continue.
              {{ sessionExpiredMessage.userType ? `(Previously logged in as ${sessionExpiredMessage.userType})` : '' }}
            </p>
          </div>
        </div>
      </div>

      <!-- Token Expiry Warning -->
      <div v-if="tokenExpiryInfo?.isExpiringSoon" class="mx-6 mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <div class="flex items-center">
          <svg class="w-5 h-5 text-yellow-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd"></path>
          </svg>
          <div>
            <h3 class="text-sm font-medium text-yellow-800">Session Expiring Soon</h3>
            <p class="text-sm text-yellow-700 mt-1">
              Your session will expire in {{ Math.ceil(tokenExpiryInfo.minutesUntilExpiry) }} minutes.
              Please save any work and login again to continue.
            </p>
          </div>
        </div>
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
              Email Address
            </label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MailIcon class="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="username"
                name="username"
                type="email"
                v-model="formData.username"
                required
                class="pl-10 w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Enter your email address"
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
                required
                class="pl-10 w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Enter your password"
              />
            </div>
            <p v-if="errors.password" class="mt-1 text-sm text-red-600">{{ errors.password }}</p>
          </div>

          <!-- OTP Field for Admin -->
          <div v-if="selectedUserType === 'admin' && showOTPField">
            <label for="otpCode" class="block text-sm font-medium text-gray-700 mb-1">
              OTP Code
            </label>
            <div class="relative">
              <input
                id="otpCode"
                name="otpCode"
                type="text"
                v-model="formData.otpCode"
                required
                maxlength="6"
                class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent text-center text-lg tracking-widest"
                placeholder="000000"
              />
            </div>
            <p class="mt-1 text-xs text-gray-500">Enter the 6-digit code sent to your email</p>
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
          } text-white font-medium rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 flex items-center justify-center disabled:opacity-50`"
        >
          <span v-if="isLoading" class="flex items-center">
            <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {{ selectedUserType === 'admin' && !showOTPField ? 'Sending OTP...' : 'Signing in...' }}
          </span>
          <span v-else class="flex items-center">
            {{ selectedUserType === 'admin' && !showOTPField ? 'Send OTP' : 'Sign In' }}
            <ArrowRightIcon class="w-5 h-5 ml-2" />
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
import { reactive, ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from '@/composables/useAuth';
import { useValidation } from '@/composables/useValidation';
import {
  XIcon,
  ShieldCheckIcon,
  MailIcon,
  LockIcon,
  ArrowRightIcon
} from 'lucide-vue-next';

const router = useRouter();
const { login, verifyAdminOTP, isLoading, getTokenExpiryInfo } = useAuth();
const { errors, validateLoginForm } = useValidation();

const selectedUserType = ref<'user' | 'counselor' | 'admin'>('user');
const showOTPField = ref(false);

// ADD THESE NEW REACTIVE VARIABLES
const sessionExpiredMessage = ref({ show: false, userType: '' });
const tokenExpiryInfo = ref(null);

const formData = reactive({
  username: '',
  password: '',
  otpCode: '',
  rememberMe: false
});

const loginStatus = reactive({
  success: null as boolean | null,
  message: ''
});

// ADD THIS ONMOUNTED HOOK
onMounted(() => {
  // Check for session expired message
  if (typeof window !== 'undefined') {
    // For now, we'll implement a simple check - you'll add TokenManager later
    const sessionExpired = sessionStorage.getItem('sessionExpired') === 'true';
    const previousUserType = sessionStorage.getItem('previousUserType') || '';

    if (sessionExpired) {
      sessionExpiredMessage.value = { show: true, userType: previousUserType };

      // Pre-select the user type if we know what they were before
      if (previousUserType === 'counsellor') {
        selectedUserType.value = 'counselor';
      } else if (previousUserType === 'user') {
        selectedUserType.value = 'user';
      }

      // Clear the session expired flag
      sessionStorage.removeItem('sessionExpired');
      sessionStorage.removeItem('previousUserType');
    }
  }

  // Check token expiry for current session
  try {
    const expiryInfo = getTokenExpiryInfo();
    if (expiryInfo) {
      tokenExpiryInfo.value = expiryInfo;

      // Set up a timer to update expiry info every minute
      const updateTimer = setInterval(() => {
        const updatedInfo = getTokenExpiryInfo();
        if (updatedInfo) {
          tokenExpiryInfo.value = updatedInfo;

          // If token expires in less than 1 minute, clear timer
          if (updatedInfo.minutesUntilExpiry < 1) {
            clearInterval(updateTimer);
            // Token will expire soon, the API client will handle the redirect
          }
        } else {
          clearInterval(updateTimer);
        }
      }, 60000); // Update every minute
    }
  } catch (error) {
    // getTokenExpiryInfo might not exist yet, ignore for now
  }
});

const handleClose = () => {
  router.push('/');
};

const handleSubmit = async () => {
  loginStatus.message = '';
  Object.keys(errors.value).forEach(key => {
    delete errors.value[key];
  });

  if (!validateLoginForm(formData)) {
    return;
  }

  try {
    if (selectedUserType.value === 'admin') {
      if (!showOTPField.value) {
        const response = await login({
          username: formData.username,
          password: formData.password,
          rememberMe: formData.rememberMe,
          userType: 'admin'
        });

        if (response.success) {
          showOTPField.value = true;
          loginStatus.success = true;
          loginStatus.message = 'OTP sent to your email. Please enter the code below.';
        }
      } else {
        if (!formData.otpCode || formData.otpCode.length !== 6) {
          errors.value.otpCode = 'Please enter a valid 6-digit OTP code';
          return;
        }

        const response = await verifyAdminOTP(formData.username, formData.otpCode);

        if (response.token) {
          loginStatus.success = true;
          loginStatus.message = 'Admin login successful! Redirecting...';

          setTimeout(() => {
            router.push('/admin-dashboard');
          }, 2000);
        }
      }
    } else {
      const response = await login({
        username: formData.username,
        password: formData.password,
        rememberMe: formData.rememberMe,
        userType: selectedUserType.value
      });

      if (response?.token) {
        // CLEAR ANY SESSION EXPIRED MESSAGES
        sessionExpiredMessage.value = { show: false, userType: '' };

        loginStatus.success = true;
        loginStatus.message = 'Login successful! Redirecting...';

        console.log('Login successful with remember me:', formData.rememberMe);

        setTimeout(() => {
          if (selectedUserType.value === 'counselor') {
            router.push('/counselor-dashboard');
          } else {
            router.push('/dashboard');
          }
        }, 2000);
      } else {
        loginStatus.success = false;
        loginStatus.message = response?.message || 'Invalid email or password';
      }
    }
  } catch (error) {
    loginStatus.success = false;
    if (error instanceof Error) {
      loginStatus.message = error.message;
    } else {
      loginStatus.message = 'An error occurred during login';
    }
  }
};

const clearMessage = () => {
  if (loginStatus.message) {
    setTimeout(() => {
      loginStatus.message = '';
    }, 5000);
  }
};

const messageWatcher = () => {
  if (loginStatus.message) {
    clearMessage();
  }
};

const originalMessage = loginStatus.message;
setInterval(() => {
  if (loginStatus.message !== originalMessage && loginStatus.message) {
    messageWatcher();
  }
}, 100);
</script>
