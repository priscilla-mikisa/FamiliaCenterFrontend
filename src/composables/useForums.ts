import { ref, computed } from 'vue';
import { ForumService } from '@/services/apiService';
import type { Forum } from '@/types';

export function useForums() {
  const forums = ref<Forum[]>([]);
  const currentForum = ref<Forum | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const fetchLatestForums = async (limit: number = 2) => {
    loading.value = true;
    error.value = null;
    
    try {
      const response = await ForumService.getPublishedForums();
      
      if (response.status) {
        // Handle both null and empty array responses
        if (response.data === null || response.data === undefined) {
          forums.value = [];
        } else if (Array.isArray(response.data)) {
          // Filter upcoming forums and limit results
          const now = new Date();
          
          const upcomingForums = response.data
            .filter((forum: any) => {
              if (!forum.date) {
                return false;
              }
              
              const forumDate = new Date(forum.date);
              return forumDate > now;
            })
            .sort((a: any, b: any) => {
              // Sort by date ascending (nearest first)
              const dateA = new Date(a.date).getTime();
              const dateB = new Date(b.date).getTime();
              return dateA - dateB;
            })
            .slice(0, limit);
          
          // Map API response to Forum type
          forums.value = upcomingForums.map((forum: any) => mapApiForumToForum(forum));
        } else {
          forums.value = [];
        }
      } else {
        forums.value = [];
      }
    } catch (err: any) {
      // Treat 404 as "no forums available" (endpoint may not be implemented yet)
      // Don't show error - just show empty state
      if (err.response?.status === 404) {
        forums.value = [];
        error.value = null;
      } else {
        // Only show error for actual failures, not 404s
        error.value = err.response?.data?.detail || err.response?.data?.error || 'Failed to fetch latest forums';
      }
    } finally {
      loading.value = false;
    }
  };

  const fetchForumById = async (id: string) => {
    loading.value = true;
    error.value = null;
    
    try {
      const response = await ForumService.getPublishedForumById(id);
      if (response.status && response.data) {
        currentForum.value = mapApiForumToForum(response.data);
        return currentForum.value;
      } else {
        error.value = 'Forum not found';
        throw new Error('Forum not found');
      }
    } catch (err: any) {
      error.value = err.response?.data?.detail || err.response?.data?.error || 'Failed to fetch forum details';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const fetchPastForums = async () => {
    loading.value = true;
    error.value = null;
    
    try {
      const response = await ForumService.getPublishedForums();
      if (response.status) {
        if (response.data === null || response.data === undefined) {
          forums.value = [];
        } else if (Array.isArray(response.data)) {
          // Filter past forums (date has passed)
          const now = new Date();
          const pastForums = response.data
            .filter((forum: any) => {
              if (!forum.date) return false;
              const forumDate = new Date(forum.date);
              return forumDate <= now;
            });
          
          // Map API response to Forum type
          forums.value = pastForums.map((forum: any) => mapApiForumToForum(forum));
        } else {
          forums.value = [];
        }
      } else {
        forums.value = [];
      }
    } catch (err: any) {
      if (err.response?.status === 404) {
        forums.value = [];
        error.value = null;
      } else {
        error.value = err.response?.data?.detail || err.response?.data?.error || 'Failed to fetch past forums';
      }
    } finally {
      loading.value = false;
    }
  };

  const fetchUpcomingForums = async () => {
    loading.value = true;
    error.value = null;
    
    try {
      const response = await ForumService.getPublishedForums();
      if (response.status) {
        if (response.data === null || response.data === undefined) {
          forums.value = [];
        } else if (Array.isArray(response.data)) {
          // Filter upcoming forums (date is in the future)
          const now = new Date();
          const upcomingForums = response.data
            .filter((forum: any) => {
              if (!forum.date) return false;
              const forumDate = new Date(forum.date);
              return forumDate > now;
            });
          
          // Map API response to Forum type
          forums.value = upcomingForums.map((forum: any) => mapApiForumToForum(forum));
        } else {
          forums.value = [];
        }
      } else {
        forums.value = [];
      }
    } catch (err: any) {
      if (err.response?.status === 404) {
        forums.value = [];
        error.value = null;
      } else {
        error.value = err.response?.data?.detail || err.response?.data?.error || 'Failed to fetch upcoming forums';
      }
    } finally {
      loading.value = false;
    }
  };

  // Helper function to map API response to Forum type
  const mapApiForumToForum = (apiForum: any): Forum => {
    return {
      id: apiForum.id,
      title: apiForum.title,
      description: apiForum.description || '',
      category: apiForum.category || '',
      color: apiForum.color || 'bg-teal-500',
      date: apiForum.date ? formatDate(apiForum.date) : '',
      time: apiForum.time || '',
      duration: apiForum.duration || '',
      capacity: apiForum.capacity || 0,
      location: apiForum.location || '',
      format: apiForum.format || '',
      topics: apiForum.topics || [],
      about: apiForum.about || '',
      about2: apiForum.about2 || '',
      learning_points: apiForum.learning_points || [],
      related_events: apiForum.related_events || null,
      isRegistered: apiForum.isRegistered || false,
      isPublic: apiForum.is_public !== undefined ? apiForum.is_public : true,
      registeredCount: apiForum.registeredCount || 0,
      host_name: apiForum.host_name || apiForum.hostName,
      host_title: apiForum.host_title || apiForum.hostTitle,
      host_bio: apiForum.host_bio || apiForum.hostBio,
      status: apiForum.status,
      is_past: apiForum.is_past,
      has_video: apiForum.has_video,
      video_url: apiForum.video_url,
      video_preview_url: apiForum.video_preview_url,
      createdAt: apiForum.created_at,
      updatedAt: apiForum.updated_at
    };
  };

  // Helper function to format date from ISO string to readable format
  const formatDate = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    } catch {
      return dateString;
    }
  };

  return {
    forums: computed(() => forums.value),
    currentForum: computed(() => currentForum.value),
    loading: computed(() => loading.value),
    error: computed(() => error.value),
    fetchLatestForums,
    fetchForumById,
    fetchPastForums,
    fetchUpcomingForums
  };
}
