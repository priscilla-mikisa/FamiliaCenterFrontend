<template>
  <div class="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4 relative">
    <!-- Close Button -->
    <router-link to="/" class="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-200 transition-colors">
      <XIcon class="w-6 h-6 text-gray-600" />
    </router-link>

    <div class="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden">
      <div class="bg-green-600 p-6 text-center relative">
        <div class="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
          <UserIcon class="w-8 h-8 text-white" />
        </div>
        <h1 class="text-2xl font-bold text-white">Join Our Community</h1>
        <p class="text-green-100 mt-2">Create your account to access family support resources</p>
      </div>

      <form @submit.prevent="handleSubmit" class="p-6 sm:p-8">
        <div v-if="errors.submit" class="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
          {{ errors.submit }}
        </div>

        <div v-if="successMessage" class="mb-4 p-3 bg-green-50 text-green-600 rounded-lg text-sm">
          {{ successMessage }}
        </div>

        <div class="space-y-4">
          <div>
            <label for="name" class="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <UserIcon class="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="name"
                name="name"
                type="text"
                v-model="formData.name"
                class="pl-10 w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="John Doe"
              />
            </div>
            <p v-if="errors.name" class="mt-1 text-sm text-red-600">{{ errors.name }}</p>
          </div>

          <div>
            <label for="email" class="block text-sm font-medium text-gray-700 mb-1">
              Email Address
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
                class="pl-10 w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="john@example.com"
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
                type="password"
                v-model="formData.password"
                class="pl-10 w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="At least 8 characters"
              />
            </div>
            <p v-if="errors.password" class="mt-1 text-sm text-red-600">{{ errors.password }}</p>
          </div>

          <div>
            <label for="confirmPassword" class="block text-sm font-medium text-gray-700 mb-1">
              Confirm Password
            </label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <LockIcon class="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                v-model="formData.confirmPassword"
                class="pl-10 w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Confirm your password"
              />
            </div>
            <p v-if="errors.confirmPassword" class="mt-1 text-sm text-red-600">{{ errors.confirmPassword }}</p>
          </div>

          <div>
            <label for="userType" class="block text-sm font-medium text-gray-700 mb-1">
              Account Type
            </label>
            <select
              id="userType"
              name="userType"
              v-model="formData.userType"
              class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="individual">Individual</option>
              <option value="couple">Couple</option>
              <option value="family">Family</option>
              <option value="anonymous">Anonymous</option>
            </select>
          </div>

          <div class="flex items-start">
            <div class="flex items-center h-5">
              <input
                id="agreeToTerms"
                name="agreeToTerms"
                type="checkbox"
                v-model="formData.agreeToTerms"
                class="h-4 w-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
              />
            </div>
            <div class="ml-3 text-sm">
              <label for="agreeToTerms" class="text-gray-700">
                I agree to the
                <a href="#" class="text-green-600 hover:underline">Terms of Service</a>
                and
                <a href="#" class="text-green-600 hover:underline">Privacy Policy</a>
              </label>
              <p v-if="errors.agreeToTerms" class="mt-1 text-sm text-red-600">{{ errors.agreeToTerms }}</p>
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
            Creating Account...
          </span>
          <span v-else class="flex items-center">
            Create Account <ArrowRightIcon class="w-5 h-5 ml-2" />
          </span>
        </button>

        <div class="mt-6 text-center">
          <p class="text-sm text-gray-600">
            Already have an account?
            <router-link to="/login" class="text-green-600 font-medium hover:underline">
              Sign in
            </router-link>
          </p>
        </div>
      </form>

      <div class="px-8 py-6 bg-gray-50 text-center border-t">
        <div class="flex items-center justify-center space-x-2">
          <ShieldCheckIcon class="h-5 w-5 text-green-600" />
          <p class="text-sm text-gray-600">
            Your information is securely encrypted
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from '@/composables/useAuth';
import { useValidation } from '@/composables/useValidation';

const router = useRouter();
const { signUp, isLoading } = useAuth();
const { errors, validateSignUpForm } = useValidation();

const formData = reactive({
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
  userType: 'individual',
  agreeToTerms: false
});

const successMessage = ref('');

const handleSubmit = async () => {
  if (validateSignUpForm(formData)) {
    try {
      const response = await signUp({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        userType: formData.userType,
        first_name: '',
        last_name: ''
      });
      console.log(response);

      successMessage.value = 'Account created successfully! Redirecting...';
      // Redirect to dashboard or verification page
      setTimeout(() => {
        router.push('/dashboard');
      }, 2000);
    } catch (error: unknown) {
      if (error instanceof Error) {
        errors.value.submit = error.message || 'Failed to create account. Please try again.';
      } else {
        errors.value.submit = 'Failed to create account. Please try again.';
      }
    }
  }
};
</script>
