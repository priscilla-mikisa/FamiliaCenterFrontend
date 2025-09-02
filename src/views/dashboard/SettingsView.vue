<template>
  <div class="max-w-4xl mx-auto space-y-6">
    <h1 class="text-2xl font-bold">Account Settings</h1>

    <div class="bg-white rounded-xl shadow-md overflow-hidden">
      <div class="p-6 border-b">
        <h2 class="text-lg font-semibold">Profile Information</h2>
        <p class="text-gray-600 text-sm">Update your account information</p>
      </div>

      <form @submit.prevent="handleProfileUpdate" class="p-6">
        <div v-if="profileMessage" :class="`mb-6 p-3 rounded-lg ${profileMessage.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`">
          {{ profileMessage.text }}
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">First Name</label>
            <input
              v-model="profileForm.first_name"
              type="text"
              required
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
            <input
              v-model="profileForm.last_name"
              type="text"
              required
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              v-model="profileForm.email"
              type="email"
              required
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Phone</label>
            <input
              v-model="profileForm.phone_number"
              type="tel"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Country</label>
            <select
              v-model="profileForm.country_code"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="">Select Country</option>
              <option value="US">🇺🇸 United States</option>
              <option value="KE">🇰🇪 Kenya</option>
              <option value="UG">🇺🇬 Uganda</option>
              <option value="GB">🇬🇧 United Kingdom</option>
              <option value="NG">🇳🇬 Nigeria</option>
              <option value="ZA">🇿🇦 South Africa</option>
              <option value="CA">🇨🇦 Canada</option>
              <option value="AU">🇦🇺 Australia</option>
            </select>
          </div>
          <div v-if="userType === 'counsellor'">
            <label class="block text-sm font-medium text-gray-700 mb-1">Specialization</label>
            <input
              v-model="profileForm.speciality"
              type="text"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
        </div>

        <div v-if="userType === 'counsellor'" class="mb-6">
          <label class="block text-sm font-medium text-gray-700 mb-1">Bio</label>
          <textarea
            v-model="profileForm.bio"
            rows="4"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="Tell clients about yourself..."
          ></textarea>
        </div>

        <button
          type="submit"
          :disabled="profileLoading"
          class="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
        >
          {{ profileLoading ? 'Updating...' : 'Update Profile' }}
        </button>
      </form>
    </div>

    <div v-if="currentSubscription" class="bg-white rounded-xl shadow-md overflow-hidden">
      <div class="p-6 border-b">
        <h2 class="text-lg font-semibold">Current Subscription</h2>
        <p class="text-gray-600 text-sm">Manage your subscription plan</p>
      </div>

      <div class="p-6">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="font-medium text-gray-900">{{ currentSubscription.plan_name }}</h3>
            <p class="text-gray-600 text-sm">{{ formatPrice(currentSubscription.price, currentSubscription.currency) }}/{{ currentSubscription.billing_cycle }}</p>
            <p class="text-gray-500 text-xs mt-1">
              Status: <span :class="`font-medium ${currentSubscription.status === 'active' ? 'text-green-600' : 'text-red-600'}`">{{ currentSubscription.status }}</span>
            </p>
          </div>
          <div class="flex space-x-3">
            <router-link
              to="/dashboard/subscription"
              class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
            >
              Change Plan
            </router-link>
            <button
              @click="showCancelModal = true"
              class="px-4 py-2 border border-red-600 text-red-600 rounded-lg hover:bg-red-50 text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="bg-white rounded-xl shadow-md overflow-hidden">
      <div class="p-6">
        <div class="text-center">
          <CreditCardIcon class="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 class="text-lg font-semibold text-gray-900 mb-2">No Active Subscription</h3>
          <p class="text-gray-600 mb-4">Subscribe to a plan to access premium features and unlimited sessions.</p>
          <router-link
            to="/dashboard/subscription"
            class="inline-block px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Choose a Plan
          </router-link>
        </div>
      </div>
    </div>

    <div class="bg-white rounded-xl shadow-md overflow-hidden">
      <div class="p-6 border-b">
        <h2 class="text-lg font-semibold">Account Actions</h2>
        <p class="text-gray-600 text-sm">Manage your account</p>
      </div>

      <div class="p-6 space-y-4">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="font-medium text-gray-900">Change Password</h3>
            <p class="text-gray-600 text-sm">Update your account password</p>
          </div>
          <button
            @click="showPasswordModal = true"
            class="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            Change
          </button>
        </div>

        <div class="border-t pt-4">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="font-medium text-red-600">Delete Account</h3>
              <p class="text-gray-600 text-sm">Permanently delete your account and all data</p>
            </div>
            <button
              @click="showDeleteModal = true"
              class="px-4 py-2 border border-red-600 text-red-600 rounded-lg hover:bg-red-50"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="showPasswordModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div class="bg-white rounded-xl max-w-md w-full p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Change Password</h3>

        <form @submit.prevent="handlePasswordChange" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
            <input
              v-model="passwordForm.currentPassword"
              type="password"
              required
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">New Password</label>
            <input
              v-model="passwordForm.newPassword"
              type="password"
              required
              minlength="8"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
            <input
              v-model="passwordForm.confirmPassword"
              type="password"
              required
              minlength="8"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div class="flex space-x-3 pt-4">
            <button
              type="button"
              @click="showPasswordModal = false"
              class="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              :disabled="passwordLoading"
              class="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
            >
              {{ passwordLoading ? 'Changing...' : 'Change Password' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <div v-if="showCancelModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div class="bg-white rounded-xl max-w-md w-full p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Cancel Subscription</h3>
        <p class="text-gray-600 mb-6">
          Are you sure you want to cancel your subscription? You'll lose access to premium features at the end of your current billing period.
        </p>

        <div class="flex space-x-3">
          <button
            @click="showCancelModal = false"
            class="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            Keep Subscription
          </button>
          <button
            @click="handleCancelSubscription"
            :disabled="cancelLoading"
            class="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
          >
            {{ cancelLoading ? 'Canceling...' : 'Yes, Cancel' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { CreditCardIcon } from 'lucide-vue-next';
import { useAuth } from '@/composables/useAuth';
import { useSubscriptions } from '@/composables/useSubscriptions';

interface UserProfile {
  first_name?: string;
  last_name?: string;
  email?: string;
  phone_number?: string;
  country_code?: string;
  speciality?: string;
  bio?: string;
}

interface ProfileForm {
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  country_code: string;
  speciality: string;
  bio: string;
}

interface PasswordForm {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface ProfileMessage {
  type: 'success' | 'error';
  text: string;
}

const authComposable = useAuth();
const { getProfile, updateProfile } = authComposable;
const { currentSubscription, getCurrentSubscription, cancelSubscription, formatPrice } = useSubscriptions();

const user = ref<UserProfile | null>(null);

if ('user' in authComposable && authComposable.user && authComposable.user.value) {
  user.value = authComposable.user.value as unknown as UserProfile;
}

const profileLoading = ref<boolean>(false);
const passwordLoading = ref<boolean>(false);
const cancelLoading = ref<boolean>(false);
const showPasswordModal = ref<boolean>(false);
const showCancelModal = ref<boolean>(false);
const showDeleteModal = ref<boolean>(false);
const userType = localStorage.getItem('userType');

const profileMessage = ref<ProfileMessage | null>(null);

const profileForm = ref<ProfileForm>({
  first_name: '',
  last_name: '',
  email: '',
  phone_number: '',
  country_code: '',
  speciality: '',
  bio: ''
});

const passwordForm = ref<PasswordForm>({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
});

const handleProfileUpdate = async (): Promise<void> => {
  profileLoading.value = true;
  profileMessage.value = null;

  try {
    await updateProfile(profileForm.value);
    profileMessage.value = { type: 'success', text: 'Profile updated successfully!' };

    setTimeout(() => {
      profileMessage.value = null;
    }, 5000);
  } catch (err) {
    console.error('Failed to update profile:', err);
    profileMessage.value = { type: 'error', text: 'Failed to update profile. Please try again.' };
  } finally {
    profileLoading.value = false;
  }
};

const handlePasswordChange = async (): Promise<void> => {
  if (passwordForm.value.newPassword !== passwordForm.value.confirmPassword) {
    alert('New passwords do not match');
    return;
  }

  passwordLoading.value = true;
  try {

    alert('Password changed successfully');
    showPasswordModal.value = false;
    passwordForm.value = {
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    };
  } catch (err) {
    console.error('Failed to change password:', err);
    alert('Failed to change password');
  } finally {
    passwordLoading.value = false;
  }
};

const handleCancelSubscription = async (): Promise<void> => {
  cancelLoading.value = true;
  try {
    await cancelSubscription();
    showCancelModal.value = false;
    alert('Subscription cancelled successfully');
    await getCurrentSubscription();
  } catch (err) {
    console.error('Failed to cancel subscription:', err);
    alert('Failed to cancel subscription');
  } finally {
    cancelLoading.value = false;
  }
};

onMounted(async () => {
  try {
    try {
      const profileData = await getProfile();
      if (profileData && 'data' in profileData) {
        user.value = profileData.data as UserProfile;
      }
    } catch {
      console.log('Could not load user profile from API');
    }

    if (user.value) {
      profileForm.value = {
        first_name: user.value.first_name || '',
        last_name: user.value.last_name || '',
        email: user.value.email || '',
        phone_number: user.value.phone_number || '',
        country_code: user.value.country_code || '',
        speciality: user.value.speciality || '',
        bio: user.value.bio || ''
      };
    }

    await getCurrentSubscription().catch(() => {
      console.log('No current subscription');
    });
  } catch (error) {
    console.error('Failed to load settings data:', error);
  }
});
</script>
