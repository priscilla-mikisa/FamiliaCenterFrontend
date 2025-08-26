<template>
  <div class="max-w-4xl mx-auto space-y-6">
    <h1 class="text-2xl font-bold">Account Settings</h1>

    <!-- Profile Information -->
    <div class="bg-white rounded-xl shadow-md overflow-hidden">
      <div class="p-6 border-b">
        <h2 class="text-lg font-semibold">Profile Information</h2>
        <p class="text-gray-600 text-sm">Update your account information</p>
      </div>

      <form @submit.prevent="handleProfileUpdate" class="p-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">First Name</label>
            <input
              v-model="profileForm.first_name"
              type="text"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
            <input
              v-model="profileForm.last_name"
              type="text"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              v-model="profileForm.email"
              type="email"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Phone</label>
            <input
              v-model="profileForm.phone"
              type="tel"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
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
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useUser } from '@/composables/useUser';

const { user, updateUser } = useUser();
const profileLoading = ref(false);

const profileForm = ref({
  first_name: '',
  last_name: '',
  email: '',
  phone: ''
});

const handleProfileUpdate = async () => {
  if (!user.value) return;

  profileLoading.value = true;
  try {
    await updateUser(user.value.id, profileForm.value);
    alert('Profile updated successfully!');
  } catch (err) {
    console.error('Failed to update profile:', err);
    alert('Failed to update profile');
  } finally {
    profileLoading.value = false;
  }
};

onMounted(() => {
  if (user.value) {
    profileForm.value = {
      first_name: user.value.first_name || '',
      last_name: user.value.last_name || '',
      email: user.value.email || '',
      phone: user.value.phone || ''
    };
  }
});
</script>
