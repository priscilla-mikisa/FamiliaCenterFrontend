import { ref } from 'vue';
import { ResourceService, type Resource } from '@/services/apiService';

export const useResources = () => {
  const resources = ref<Resource[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const fetchResources = async (params?: { category?: string; search?: string }) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await ResourceService.getResources(params);
      resources.value = response.data || [];
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch resources';
    } finally {
      loading.value = false;
    }
  };

  const downloadResource = async (id: string) => {
    try {
      const blob = await ResourceService.downloadResource(id);
      const resource = resources.value.find(r => r.id === id);

      // Create download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = resource?.title || `resource-${id}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to download resource';
      throw err;
    }
  };

  const uploadResource = async (formData: FormData) => {
    try {
      const response = await ResourceService.uploadResource(formData);
      await fetchResources(); // Refresh the list
      return response;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to upload resource';
      throw err;
    }
  };

  return {
    resources,
    loading,
    error,
    fetchResources,
    downloadResource,
    uploadResource
  };
};
