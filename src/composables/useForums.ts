import { ref, computed } from 'vue';
import { ForumService } from '@/services/apiService';
import { getUpcomingForums, getForumById, getAllForums } from '@/data/dummyForums';
import type { Forum, ForumLatestResponse, ForumResponse } from '@/types';

export function useForums() {
  const forums = ref<Forum[]>([]);
  const currentForum = ref<Forum | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const fetchLatestForums = async (limit: number = 2) => {
    loading.value = true;
    error.value = null;
    
    try {
      // Use dummy data only
      forums.value = getUpcomingForums(limit);
    } catch (err) {
      error.value = 'Failed to fetch latest forums';
      console.error('Error fetching latest forums:', err);
    } finally {
      loading.value = false;
    }
  };

  const fetchForumById = async (id: string) => {
    loading.value = true;
    error.value = null;
    
    try {
      // Use dummy data only
      const forum = getForumById(id);
      if (forum) {
        currentForum.value = forum;
        return forum;
      } else {
        error.value = 'Forum not found';
        throw new Error('Forum not found');
      }
    } catch (err) {
      error.value = 'Failed to fetch forum details';
      console.error('Error fetching forum:', err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  return {
    forums: computed(() => forums.value),
    currentForum: computed(() => currentForum.value),
    loading: computed(() => loading.value),
    error: computed(() => error.value),
    fetchLatestForums,
    fetchForumById
  };
}
