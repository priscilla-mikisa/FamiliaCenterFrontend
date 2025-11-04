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
      // Handle different response structures
      if (Array.isArray(response)) {
        resources.value = response;
      } else if (response?.data) {
        resources.value = Array.isArray(response.data) ? response.data : [response.data];
      } else if (response?.resources) {
        resources.value = Array.isArray(response.resources) ? response.resources : [response.resources];
      } else {
        resources.value = [];
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch resources';
      console.error('Error fetching resources:', err);
    } finally {
      loading.value = false;
    }
  };

  const fetchCounsellorResources = async (params?: { category?: string; search?: string }) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await ResourceService.getCounsellorResources(params);
      if (Array.isArray(response)) {
        resources.value = response;
      } else if (response?.data) {
        resources.value = Array.isArray(response.data) ? response.data : [response.data];
      } else if (response?.resources) {
        resources.value = Array.isArray(response.resources) ? response.resources : [response.resources];
      } else {
        resources.value = [];
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch resources';
      console.error('Error fetching counsellor resources:', err);
    } finally {
      loading.value = false;
    }
  };

  const getResourceBlob = async (id: string): Promise<Blob> => {
    try {
      const response = await ResourceService.downloadResource(id);
      
      // Handle different response structures
      let blob: Blob;
      
      if (response instanceof Blob) {
        blob = response;
      } else if (response?.data instanceof Blob) {
        blob = response.data;
      } else if (response?.blob instanceof Blob) {
        blob = response.blob;
      } else if (typeof response === 'object' && response !== null) {
        // Check if response has a data property that might be a Blob
        const data = (response as any).data;
        if (data instanceof Blob) {
          blob = data;
        } else {
          console.error('Unexpected response format:', response);
          throw new Error('Invalid response: expected Blob object');
        }
      } else {
        console.error('Unexpected response type:', typeof response, response);
        throw new Error('Invalid response: expected Blob object');
      }
      
      // Final verification
      if (!(blob instanceof Blob)) {
        console.error('Not a Blob:', blob, typeof blob);
        throw new Error('Invalid response: expected Blob object');
      }
      
      return blob;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch resource';
      error.value = errorMessage;
      console.error('Error in getResourceBlob:', err);
      throw err;
    }
  };

  const downloadResource = async (id: string) => {
    try {
      const blob = await getResourceBlob(id);
      const resource = resources.value.find(r => r.id === id);

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
    loading.value = true;
    error.value = null;
    try {
      const response = await ResourceService.createCounsellorResource(formData);
      await fetchCounsellorResources();
      return response;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to upload resource';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const updateResource = async (resourceId: string, formData: FormData) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await ResourceService.updateCounsellorResource(resourceId, formData);
      await fetchCounsellorResources();
      return response;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to update resource';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const deleteResource = async (resourceId: string) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await ResourceService.deleteCounsellorResource(resourceId);
      await fetchCounsellorResources();
      return response;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to delete resource';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  return {
    resources,
    loading,
    error,
    fetchResources,
    fetchCounsellorResources,
    getResourceBlob,
    downloadResource,
    uploadResource,
    updateResource,
    deleteResource
  };
};
