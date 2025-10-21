<template>
  <div class="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4 relative">
    <router-link to="/" class="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-200 transition-colors">
      <XIcon class="w-6 h-6 text-gray-600" />
    </router-link>

    <div class="w-full max-w-2xl bg-white rounded-2xl shadow-xl overflow-hidden">
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

          <!-- Salutation - Only for counselors -->
          <div v-if="formData.userRole === 'counselor'">
            <label for="salutation" class="block text-sm font-medium text-gray-700 mb-1">
              Salutation <span class="text-red-500">*</span>
            </label>
            <select
              id="salutation"
              v-model="formData.salutation"
              required
              class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="">Select salutation</option>
              <option value="Dr.">Dr.</option>
              <option value="Mr.">Mr.</option>
              <option value="Ms.">Ms.</option>
              <option value="Mrs.">Mrs.</option>
              <option value="Prof.">Prof.</option>
            </select>
            <p v-if="errors.salutation" class="mt-1 text-sm text-red-600">{{ errors.salutation }}</p>
          </div>

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

          <!-- Bio - Only for counselors -->
          <div v-if="formData.userRole === 'counselor'">
            <label for="bio" class="block text-sm font-medium text-gray-700 mb-1">
              Professional Bio <span class="text-red-500">*</span>
            </label>
            <textarea
              id="bio"
              v-model="formData.bio"
              rows="4"
              required
              placeholder="Tell us about your background, experience, and approach to counseling..."
              class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
            ></textarea>
            <p class="text-xs text-gray-500 mt-1">Minimum 50 characters</p>
            <p v-if="errors.bio" class="mt-1 text-sm text-red-600">{{ errors.bio }}</p>
          </div>

          <div v-if="formData.userRole === 'counselor'" class="space-y-4">
            <h3 class="text-lg font-medium text-gray-900">Required Documents</h3>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Selfie Photo <span class="text-red-500">*</span>
              </label>
              <input
                type="file"
                accept="image/*"
                @change="(e) => handleFileUpload(e, 'selfie')"
                required
                class="w-full p-2 border border-gray-300 rounded"
              />
              <div v-if="formData.selfiePhoto" class="text-sm text-green-600 mt-1">
                ✓ {{ formData.selfiePhoto.name }}
              </div>
              <p v-if="errors.selfiePhoto" class="mt-1 text-sm text-red-600">{{ errors.selfiePhoto }}</p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                ID Document (Front) <span class="text-red-500">*</span>
              </label>
              <input
                type="file"
                accept="image/*"
                @change="(e) => handleFileUpload(e, 'documentFront')"
                required
                class="w-full p-2 border border-gray-300 rounded"
              />
              <div v-if="formData.documentFrontPhoto" class="text-sm text-green-600 mt-1">
                ✓ {{ formData.documentFrontPhoto.name }}
              </div>
              <p v-if="errors.documentFrontPhoto" class="mt-1 text-sm text-red-600">{{ errors.documentFrontPhoto }}</p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                ID Document (Back) <span class="text-red-500">*</span>
              </label>
              <input
                type="file"
                accept="image/*"
                @change="(e) => handleFileUpload(e, 'documentBack')"
                required
                class="w-full p-2 border border-gray-300 rounded"
              />
              <div v-if="formData.documentBackPhoto" class="text-sm text-green-600 mt-1">
                ✓ {{ formData.documentBackPhoto.name }}
              </div>
              <p v-if="errors.documentBackPhoto" class="mt-1 text-sm text-red-600">{{ errors.documentBackPhoto }}</p>
            </div>
          </div>

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
import axios from 'axios';
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
  userRole: '',
  account_type: 'individual',
  specialization: '',
  salutation: '',
  bio: '',
  selfiePhoto: null as File | null,
  documentFrontPhoto: null as File | null,
  documentBackPhoto: null as File | null,
  agreeToTerms: false
});

const successMessage = ref('');

const handleFileUpload = (event: Event, type: string) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];

  if (file) {
    if (file.size > 5 * 1024 * 1024) {
      errors.value[`${type}Photo`] = 'File size must be less than 5MB';
      return;
    }
    if (!file.type.startsWith('image/')) {
      errors.value[`${type}Photo`] = 'Please upload a valid image file';
      return;
    }

    delete errors.value[`${type}Photo`];

    if (type === 'selfie') {
      formData.selfiePhoto = file;
    } else if (type === 'documentFront') {
      formData.documentFrontPhoto = file;
    } else if (type === 'documentBack') {
      formData.documentBackPhoto = file;
    }
  }
};

const handleSubmit = async () => {
  console.log('Form submission started');

  Object.keys(errors.value).forEach(key => {
    delete errors.value[key];
  });

  if (formData.userRole === 'counselor') {
    if (!formData.salutation) {
      errors.value.salutation = 'Salutation is required for counselors';
    }
    if (!formData.bio || formData.bio.length < 50) {
      errors.value.bio = 'Bio is required and must be at least 50 characters';
    }
    if (!formData.selfiePhoto) {
      errors.value.selfiePhoto = 'Selfie photo is required for counselors';
    }
    if (!formData.documentFrontPhoto) {
      errors.value.documentFrontPhoto = 'Front ID photo is required for counselors';
    }
    if (!formData.documentBackPhoto) {
      errors.value.documentBackPhoto = 'Back ID photo is required for counselors';
    }
  }

  if (!validateSignUpForm(formData)) {
    console.log('Validation failed:', errors.value);
    return;
  }

  if (Object.keys(errors.value).length > 0) {
    console.log('Additional validation failed:', errors.value);
    return;
  }

  console.log('Validation passed, calling API...');

  try {
    if (formData.userRole === 'counselor') {
      const toBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = error => reject(error);
        });
      };

      const selfieBase64 = await toBase64(formData.selfiePhoto!);
      const frontBase64 = await toBase64(formData.documentFrontPhoto!);
      const backBase64 = await toBase64(formData.documentBackPhoto!);

      const counselorData = {
        salutation: formData.salutation,
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        phone_number: formData.phone_number,
        country_code: formData.country_code,
        speciality: formData.specialization,
        bio: formData.bio,
        selfie_photo: selfieBase64,
        id_front_photo: frontBase64,
        id_back_photo: backBase64
      };

      console.log('Submitting counselor registration with correct field names...');

      const response = await axios.post('https://backend.fami.space/api/v1/counsellor/register', counselorData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      console.log('Counselor registration successful:', response.data);
    } else {
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

      console.log('Calling signUp with userData (ORIGINAL WAY):', userData);
      const response = await signUp(userData);
      console.log('Patient registration successful:', response);
    }

    successMessage.value = 'Account created successfully! Redirecting...';

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
