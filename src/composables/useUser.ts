// src/composables/useUser.ts
import { ref } from 'vue';
import { UserService, type User } from '@/services/apiService';

export const useUser = () => {
  const user = ref<User | null>(null);
  const users = ref<User[]>([]);
  const counselors = ref<User[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const fetchUser = async (id: string) => { // Changed from number to string
    loading.value = true;
    error.value = null;
    try {
      const response = await UserService.getUser(id); // Fixed method name
      user.value = response.data;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch user';
    } finally {
      loading.value = false;
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await UserService.getAllCounsellors();
      users.value = response.data || [];
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch users';
    }
  };

  const fetchCounselors = async () => {
    try {
      const response = await UserService.getCounselors(); // Now exists
      counselors.value = response.data || [];
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch counselors';
    }
  };

  const updateUser = async (id: string, userData: Partial<User>) => { // Changed from number to string
    try {
      const response = await UserService.updateUser(id, userData); // Now exists
      user.value = response.data;
      return response;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to update user';
      throw err;
    }
  };

  return {
    user,
    users,
    counselors,
    loading,
    error,
    fetchUser,
    fetchUsers,
    fetchCounselors,
    updateUser
  };
};
