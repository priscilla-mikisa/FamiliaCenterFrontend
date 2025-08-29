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

      <form @submit.prevent="handleSubmit" class="p-6 sm:p-8 max-h-[70vh] overflow-y-auto">
        <div v-if="errors.submit" class="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
          {{ errors.submit }}
        </div>

        <div v-if="successMessage" class="mb-4 p-3 bg-green-50 text-green-600 rounded-lg text-sm">
          {{ successMessage }}
        </div>

        <div class="space-y-4">
          <!-- Role Selection - First Field -->
          <div>
            <label for="userRole" class="block text-sm font-medium text-gray-700 mb-1">
              I am signing up as a:
            </label>
            <select
              id="userRole"
              name="userRole"
              v-model="formData.userRole"
              required
              class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="">Select your role</option>
              <option value="patient">Patient/Client - Seeking counseling services</option>
              <option value="counselor">Counselor/Therapist - Providing services</option>
            </select>
            <p v-if="errors.userRole" class="mt-1 text-sm text-red-600">{{ errors.userRole }}</p>
          </div>

          <!-- First Name and Last Name - Side by Side -->
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label for="firstName" class="block text-sm font-medium text-gray-700 mb-1">
                First Name
              </label>
              <input
                id="firstName"
                name="firstName"
                type="text"
                v-model="formData.first_name"
                required
                class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="John"
              />
              <p v-if="errors.first_name" class="mt-1 text-sm text-red-600">{{ errors.first_name }}</p>
            </div>
            <div>
              <label for="lastName" class="block text-sm font-medium text-gray-700 mb-1">
                Last Name
              </label>
              <input
                id="lastName"
                name="lastName"
                type="text"
                v-model="formData.last_name"
                required
                class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Doe"
              />
              <p v-if="errors.last_name" class="mt-1 text-sm text-red-600">{{ errors.last_name }}</p>
            </div>
          </div>

          <!-- Email -->
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
                required
                class="pl-10 w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="john@example.com"
              />
            </div>
            <p v-if="errors.email" class="mt-1 text-sm text-red-600">{{ errors.email }}</p>
          </div>

          <!-- Phone Number and Country Code -->
          <div class="grid grid-cols-5 gap-3">
            <div class="col-span-2">
              <label for="countryCode" class="block text-sm font-medium text-gray-700 mb-1">
                Country
              </label>
              <select
                id="countryCode"
                v-model="formData.country_code"
                required
                class="w-full px-2 py-3 text-sm rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500"
              >
                <option value="">Select</option>
                <option value="US">🇺🇸 US +1</option>
                <option value="KE">🇰🇪 KE +254</option>
                <option value="UG">🇺🇬 UG +256</option>
                <option value="GB">🇬🇧 GB +44</option>
                <option value="NG">🇳🇬 NG +234</option>
                <option value="ZA">🇿🇦 ZA +27</option>
                <option value="CA">🇨🇦 CA +1</option>
                <option value="AU">🇦🇺 AU +61</option>
                <option value="IN">🇮🇳 IN +91</option>
                <option value="DE">🇩🇪 DE +49</option>
                <option value="FR">🇫🇷 FR +33</option>
              </select>
              <p v-if="errors.country_code" class="mt-1 text-sm text-red-600">{{ errors.country_code }}</p>
            </div>
            <div class="col-span-3">
              <label for="phoneNumber" class="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <input
                id="phoneNumber"
                v-model="formData.phone_number"
                type="tel"
                required
                class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500"
                placeholder="123456789"
              />
              <p v-if="errors.phone_number" class="mt-1 text-sm text-red-600">{{ errors.phone_number }}</p>
            </div>
          </div>

          <!-- Specialization field - only for counselors -->
          <div v-if="formData.userRole === 'counselor'">
            <label for="specialization" class="block text-sm font-medium text-gray-700 mb-1">
              Specialization
            </label>
            <select
              id="specialization"
              name="specialization"
              v-model="formData.specialization"
              required
              class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="">Select your specialization</option>
              <option value="Marriage Counseling">Marriage Counseling</option>
              <option value="Family Therapy">Family Therapy</option>
              <option value="Individual Therapy">Individual Therapy</option>
              <option value="Child Psychology">Child Psychology</option>
              <option value="Addiction Recovery">Addiction Recovery</option>
              <option value="Stress Management">Stress Management</option>
              <option value="Relationship Counseling">Relationship Counseling</option>
              <option value="General Counseling">General Counseling</option>
            </select>
            <p v-if="errors.specialization" class="mt-1 text-sm text-red-600">{{ errors.specialization }}</p>
          </div>

          <!-- Account Type - only for patients -->
          <div v-if="formData.userRole === 'patient'">
            <label for="account_type" class="block text-sm font-medium text-gray-700 mb-1">
              Account Type
            </label>
            <select
              id="account_type"
              name="account_type"
              v-model="formData.account_type"
              class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="individual">Individual</option>
              <option value="couple">Couple</option>
              <option value="family">Family</option>
              <option value="anonymous">Anonymous</option>
            </select>
          </div>

          <!-- Password -->
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
                placeholder="At least 8 characters"
              />
            </div>
            <p v-if="errors.password" class="mt-1 text-sm text-red-600">{{ errors.password }}</p>
          </div>

          <!-- Confirm Password -->
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
                required
                class="pl-10 w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Confirm your password"
              />
            </div>
            <p v-if="errors.confirmPassword" class="mt-1 text-sm text-red-600">{{ errors.confirmPassword }}</p>
          </div>

          <!-- Terms Agreement -->
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
          } text-white font-medium rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 flex items-center justify-center disabled:opacity-50`"
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
import {
  XIcon,
  UserIcon,
  MailIcon,
  LockIcon,
  ArrowRightIcon,
  ShieldCheckIcon
} from 'lucide-vue-next';

const router = useRouter();
const { signUp, isLoading } = useAuth();
const { errors, validateSignUpForm } = useValidation();

const formData = reactive({
  first_name: '',
  last_name: '',
  email: '',
  password: '',
  confirmPassword: '',
  phone_number: '',
  country_code: '',
  userRole: '', // 'patient' or 'counselor'
  account_type: 'individual', // for patients
  specialization: '', // for counselors
  agreeToTerms: false
});

const successMessage = ref('');

const handleSubmit = async () => {
  console.log('Form submission started');

  // Clear previous errors
  Object.keys(errors.value).forEach(key => {
    delete errors.value[key];
  });

  // Validate form using the fixed validation function
  if (!validateSignUpForm(formData)) {
    console.log('Validation failed:', errors.value);
    return;
  }

  console.log('Validation passed, calling API...');

  try {
    const userData = {
      name: `${formData.first_name} ${formData.last_name}`,
      first_name: formData.first_name,
      last_name: formData.last_name,
      email: formData.email,
      password: formData.password,
      confirmPassword: formData.confirmPassword,
      phone_number: formData.phone_number,
      country_code: formData.country_code,
      userRole: formData.userRole as 'patient' | 'counselor',
      account_type: formData.account_type,
      specialization: formData.specialization,
    };

    console.log('Calling signUp with userData:', userData);
    const response = await signUp(userData);
    console.log('Registration successful:', response);

    successMessage.value = 'Account created successfully! Redirecting...';

    // Redirect based on role
    setTimeout(() => {
      if (formData.userRole === 'counselor') {
        router.push('/counselor-dashboard');
      } else {
        router.push('/dashboard');
      }
    }, 2000);

  } catch (error: unknown) {
    console.error('Registration error:', error);
    if (error instanceof Error) {
      errors.value.submit = error.message || 'Failed to create account. Please try again.';
    } else {
      errors.value.submit = 'Failed to create account. Please try again.';
    }
  }
};
</script>
