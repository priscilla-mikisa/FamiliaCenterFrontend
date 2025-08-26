// src/composables/useSessions.ts
import { ref, computed } from 'vue';
import { SessionService, type Session } from '@/services/apiService';

export const useSessions = () => {
  const sessions = ref<Session[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const upcomingSessions = computed(() =>
    sessions.value.filter(s => new Date(s.start_time) > new Date())
  );

  const pastSessions = computed(() =>
    sessions.value.filter(s => new Date(s.start_time) <= new Date())
  );

  const fetchSessions = async (upcoming = false) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await SessionService.getSessions({ upcoming });
      sessions.value = response.data || [];
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch sessions';
    } finally {
      loading.value = false;
    }
  };

  const bookSession = async (sessionData: { counselor_id: number; date: string; time: string }) => {
    try {
      const response = await SessionService.bookSession(sessionData);
      await fetchSessions(); // Refresh the list
      return response;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to book session';
      throw err;
    }
  };

  const rescheduleSession = async (id: number, newDateTime: { date: string; time: string }) => {
    try {
      await SessionService.rescheduleSession(id, newDateTime);
      await fetchSessions(); // Refresh the list
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to reschedule session';
      throw err;
    }
  };

  return {
    sessions,
    upcomingSessions,
    pastSessions,
    loading,
    error,
    fetchSessions,
    bookSession,
    rescheduleSession
  };
};
