<template>
  <div v-if="isOpen" class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
    <div class="bg-white rounded-xl p-6 max-w-sm w-full">
      <div class="text-center">
        <div class="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
          <LogOutIcon class="w-8 h-8 text-red-600" />
        </div>

        <h3 class="text-xl font-bold text-gray-900 mb-2">Log out of your account?</h3>
        <p class="text-gray-600 mb-6">
          Are you sure you want to log out? You'll need to sign back in to access your account.
        </p>

        <div class="flex justify-center space-x-4">
          <button
            @click="$emit('close')"
            :disabled="isLoading"
            class="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            @click="handleLogout"
            :disabled="isLoading"
            :class="`px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 ${
              isLoading ? 'opacity-75' : ''
            }`"
          >
            <div v-if="isLoading" class="flex items-center">
              <div class="animate-spin -ml-1 mr-2 h-4 w-4 border-t-2 border-b-2 border-white rounded-full"></div>
              Logging out...
            </div>
            <span v-else>Log Out</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { LogOutIcon } from 'lucide-vue-next';
import { AuthService } from '@/services/apiService';

interface Props {
  isOpen: boolean;
}

defineProps<Props>();
defineEmits<{
  close: [];
}>();

const router = useRouter();
const isLoading = ref(false);

const handleLogout = async () => {
  isLoading.value = true;

  try {
    await AuthService.logout();
  } catch (error) {
    console.error('Logout error:', error);
  } finally {
    // Clear tokens regardless of API response
    localStorage.removeItem('authToken');
    sessionStorage.removeItem('authToken');

    // Redirect to login
    setTimeout(() => {
      isLoading.value = false;
      router.push('/login');
    }, 1000);
  }
};
</script>
