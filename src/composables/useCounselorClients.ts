import { ref } from 'vue';
import { CounsellorService } from '@/services/apiService';

export const useCounselorClients = () => {
  const clients = ref([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const fetchClients = async () => {
    loading.value = true;
    try {
      const response = await CounsellorService.getCounsellorSessions();
      clients.value = response.data;
    } catch (err) {
      error.value = (err as Error).message;
    } finally {
      loading.value = false;
    }
  };

  return {
    clients,
    loading,
    error,
    fetchClients
  };
};
