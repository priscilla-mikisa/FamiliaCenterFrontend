// src/composables/useSessions.ts - Fixed with proper types
import { ref, computed } from 'vue';
import { SessionService, CounsellorService, UserService } from '@/services/apiService';
import type { SessionResponse, CounsellorResponse, Session } from '@/services/apiService';

export const useSessions = () => {
  const sessions = ref<Session[]>([]);
  const counsellors = ref<CounsellorResponse[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  // Transform backend session data to frontend format
  const transformSession = (session: SessionResponse): Session => {
    const startTime = new Date(session.start_time);
    const endTime = new Date(startTime.getTime() + session.duration * 60000);

    return {
      id: session.id,
      title: session.topic,
      session_date: startTime.toISOString().split('T')[0],
      session_time: startTime.toTimeString().split(' ')[0].substring(0, 5),
      counsellor_name: `${session.counsellor.first_name} ${session.counsellor.last_name}`,
      counselor: {
        id: session.counsellor.id,
        name: `${session.counsellor.first_name} ${session.counsellor.last_name}`,
        specialization: session.counsellor.speciality
      },
      status: session.status,
      duration: session.duration,
      notes: session.bio,
      start_time: session.start_time,
      end_time: endTime.toISOString(),
      meeting_link: session.meeting_link
    };
  };

  const upcomingSessions = computed(() =>
    sessions.value.filter(s => {
      const sessionDateTime = new Date(`${s.session_date}T${s.session_time}`);
      return sessionDateTime > new Date() && s.status !== 'cancelled';
    }).sort((a, b) => {
      const dateA = new Date(`${a.session_date}T${a.session_time}`);
      const dateB = new Date(`${b.session_date}T${b.session_time}`);
      return dateA.getTime() - dateB.getTime();
    })
  );

  const pastSessions = computed(() =>
    sessions.value.filter(s => {
      const sessionDateTime = new Date(`${s.session_date}T${s.session_time}`);
      return sessionDateTime <= new Date() || s.status === 'completed';
    }).sort((a, b) => {
      const dateA = new Date(`${a.session_date}T${a.session_time}`);
      const dateB = new Date(`${b.session_date}T${b.session_time}`);
      return dateB.getTime() - dateA.getTime();
    })
  );

  const todaySessions = computed(() => {
    const today = new Date().toISOString().split('T')[0];
    return sessions.value.filter(s => s.session_date === today);
  });

  // Fetch all sessions for authenticated user
  const fetchUserSessions = async () => {
    loading.value = true;
    error.value = null;
    try {
      const response = await SessionService.getUserSessions();
      const sessionsList = response.sessions || response.data || response || [];
      sessions.value = sessionsList.map((session: SessionResponse) => transformSession(session));
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch sessions';
      console.error('Error fetching user sessions:', err);
    } finally {
      loading.value = false;
    }
  };

  // Fetch all sessions for counsellor
  const fetchCounsellorSessions = async () => {
    loading.value = true;
    error.value = null;
    try {
      const response = await CounsellorService.getCounsellorSessions();
      const sessionsList = response.sessions || response.data || response || [];
      sessions.value = sessionsList.map((session: SessionResponse) => transformSession(session));
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch counsellor sessions';
      console.error('Error fetching counsellor sessions:', err);
    } finally {
      loading.value = false;
    }
  };

  // Fetch all available counsellors
  const fetchCounsellors = async () => {
    loading.value = true;
    error.value = null;
    try {
      const response = await UserService.getAllCounsellors();
      counsellors.value = response.counsellors || response.data || response || [];
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch counsellors';
      console.error('Error fetching counsellors:', err);
    } finally {
      loading.value = false;
    }
  };

  // Get specific session details
  const getSession = async (sessionId: string) => {
    try {
      const response = await SessionService.getSession(sessionId);
      const sessionData = response.session || response.data || response;
      return transformSession(sessionData);
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch session details';
      throw err;
    }
  };

  // Book a new session
  const bookSession = async (sessionData: {
    counsellor_id: string;
    session_date: string;
    session_time: string;
    topic?: string;
    notes?: string;
  }) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await SessionService.bookSession(sessionData);

      // Add the new session to the list immediately
      if (response.session || response.data) {
        const newSession = transformSession(response.session || response.data);
        sessions.value.push(newSession);
      }

      // Also refresh the full list to ensure consistency
      await fetchUserSessions();
      return response;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to book session';
      console.error('Error booking session:', err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  // Accept session (for counsellors)
  const acceptSession = async (sessionId: string) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await CounsellorService.acceptSession({
        session_id: sessionId
      });

      // Update the session status locally
      const sessionIndex = sessions.value.findIndex(s => s.id === sessionId);
      if (sessionIndex !== -1) {
        sessions.value[sessionIndex].status = 'accepted';
      }

      // Refresh sessions list
      await fetchCounsellorSessions();
      return response;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to accept session';
      console.error('Error accepting session:', err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  // Get session status display text
  const getSessionStatusText = (status: string) => {
    const statusMap: Record<string, string> = {
      'pending': 'Pending Approval',
      'confirmed': 'Confirmed',
      'accepted': 'Accepted',
      'rejected': 'Rejected',
      'completed': 'Completed',
      'cancelled': 'Cancelled',
      'live': 'Live Now',
      'scheduled': 'Scheduled'
    };
    return statusMap[status] || status;
  };

  // Get session status CSS class
  const getSessionStatusClass = (status: string) => {
    const statusClasses: Record<string, string> = {
      'pending': 'bg-yellow-100 text-yellow-800',
      'confirmed': 'bg-blue-100 text-blue-800',
      'accepted': 'bg-green-100 text-green-800',
      'rejected': 'bg-red-100 text-red-800',
      'completed': 'bg-gray-100 text-gray-800',
      'cancelled': 'bg-red-100 text-red-800',
      'live': 'bg-green-100 text-green-800',
      'scheduled': 'bg-blue-100 text-blue-800'
    };
    return statusClasses[status] || 'bg-gray-100 text-gray-800';
  };

  // Format session time for display
  const formatSessionTime = (date: string, time: string) => {
    if (!date || !time) return 'Invalid date/time';

    try {
      const sessionDate = new Date(`${date}T${time}`);
      if (isNaN(sessionDate.getTime())) {
        return 'Invalid date/time';
      }
      return sessionDate.toLocaleString('en-US', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'Invalid date/time';
    }
  };

  // Clear error
  const clearError = () => {
    error.value = null;
  };

  // Fetch sessions based on user type
  const fetchSessions = async () => {
    const userType = localStorage.getItem('userType');
    if (userType === 'counsellor') {
      await fetchCounsellorSessions();
    } else {
      await fetchUserSessions();
    }
  };

  return {
    sessions,
    counsellors,
    upcomingSessions,
    pastSessions,
    todaySessions,
    loading,
    error,
    fetchUserSessions,
    fetchCounsellorSessions,
    fetchCounsellors,
    fetchSessions,
    getSession,
    bookSession,
    acceptSession,
    getSessionStatusText,
    getSessionStatusClass,
    formatSessionTime,
    clearError
  };
};
