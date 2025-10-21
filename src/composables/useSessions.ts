// src/composables/useSessions.ts - Complete updated version with proper TypeScript
import { ref, computed } from 'vue';
import { SessionService, CounsellorService, UserService } from '@/services/apiService';
import type { CounsellorResponse, Session } from '@/services/apiService';

// Define interfaces for better type safety
interface BackendSession {
  id?: string;
  start_time?: string;
  end_time?: string;
  duration?: number;
  topic?: string;
  title?: string;
  status?: string;
  bio?: string;
  notes?: string;
  meeting_link?: string;
  feedback?: string;
  counsellor?: {
    id?: string;
    first_name?: string;
    last_name?: string;
    name?: string;
    speciality?: string;
    specialization?: string;
  };
  counselor?: {
    id?: string;
    first_name?: string;
    last_name?: string;
    name?: string;
    speciality?: string;
    specialization?: string;
  };
  session?: BackendSession;
  data?: BackendSession;
}

interface SessionResponse {
  sessions?: BackendSession[];
  data?: BackendSession[] | BackendSession;
  session?: BackendSession;
  counsellors?: CounsellorResponse[];
  counsellors_data?: CounsellorResponse[];
}

export const useSessions = () => {
  const sessions = ref<Session[]>([]);
  const counsellors = ref<CounsellorResponse[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  // Transform backend session data to frontend format
  const transformSession = (session: BackendSession): Session => {
    const sessionData = session.session || session.data || session;

    // Extract counsellor information safely
    const counsellor = sessionData.counsellor || sessionData.counselor || {};
    const counsellorName = counsellor.name ||
                          (counsellor.first_name && counsellor.last_name
                           ? `${counsellor.first_name} ${counsellor.last_name}`
                           : 'Unknown Counselor');

    const startTime = sessionData.start_time ? new Date(sessionData.start_time) : new Date();
    const duration = sessionData.duration || 60;
    const endTime = new Date(startTime.getTime() + duration * 60000);

    return {
      id: sessionData.id || '',
      title: sessionData.topic || sessionData.title || 'Counseling Session',
      session_date: startTime.toISOString().split('T')[0],
      session_time: startTime.toTimeString().split(' ')[0].substring(0, 5),
      counsellor_name: counsellorName,
      counselor: {
        id: counsellor.id || '',
        name: counsellorName,
        specialization: counsellor.speciality || counsellor.specialization || 'General Counseling'
      },
      status: sessionData.status || 'scheduled',
      duration: duration,
      notes: sessionData.bio || sessionData.notes || '',
      start_time: sessionData.start_time || startTime.toISOString(),
      end_time: sessionData.end_time || endTime.toISOString(),
      meeting_link: sessionData.meeting_link || '',
      feedback: sessionData.feedback || '',
      description: sessionData.bio || sessionData.notes || ''
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

  // Fetch all available counsellors
  const fetchCounselors = async (): Promise<void> => {
    loading.value = true;
    error.value = null;
    try {
      console.log('Fetching counselors from API...');
      const response = await UserService.getAllCounsellors();
      console.log('Counselors API response:', response);

      // Handle different response formats
      let counsellorsList: CounsellorResponse[] = [];

      if (Array.isArray(response)) {
        counsellorsList = response;
      } else if (response && typeof response === 'object') {
        const responseData = response as SessionResponse;
        counsellorsList = responseData.counsellors || responseData.data as CounsellorResponse[] || [];

        // Handle single counsellor response
        if (!Array.isArray(counsellorsList) && responseData.data && 'id' in responseData.data) {
          counsellorsList = [responseData.data as CounsellorResponse];
        }
      }

      counsellors.value = counsellorsList;
      console.log('Processed counselors:', counsellors.value);
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch counsellors';
      console.error('Error fetching counsellors:', err);
    } finally {
      loading.value = false;
    }
  };

  // Fetch all sessions for authenticated user
  const fetchUserSessions = async (): Promise<void> => {
    loading.value = true;
    error.value = null;
    try {
      const response = await SessionService.getUserSessions();

      let sessionsList: BackendSession[] = [];

      if (Array.isArray(response)) {
        sessionsList = response;
      } else if (response && typeof response === 'object') {
        const responseData = response as SessionResponse;
        sessionsList = responseData.sessions || responseData.data as BackendSession[] || [];

        // Handle single session response
        if (!Array.isArray(sessionsList) && responseData.data && 'id' in responseData.data) {
          sessionsList = [responseData.data as BackendSession];
        }
      }

      sessions.value = sessionsList.map(session => transformSession(session));
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch sessions';
      console.error('Error fetching user sessions:', err);
    } finally {
      loading.value = false;
    }
  };

  // Fetch all sessions for counsellor
  const fetchCounsellorSessions = async (): Promise<void> => {
    loading.value = true;
    error.value = null;
    try {
      const response = await CounsellorService.getCounsellorSessions();

      let sessionsList: BackendSession[] = [];

      if (Array.isArray(response)) {
        sessionsList = response;
      } else if (response && typeof response === 'object') {
        const responseData = response as SessionResponse;
        sessionsList = responseData.sessions || responseData.data as BackendSession[] || [];

        // Handle single session response
        if (!Array.isArray(sessionsList) && responseData.data && 'id' in responseData.data) {
          sessionsList = [responseData.data as BackendSession];
        }
      }

      sessions.value = sessionsList.map(session => transformSession(session));
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch counsellor sessions';
      console.error('Error fetching counsellor sessions:', err);
    } finally {
      loading.value = false;
    }
  };

  // Get specific session details
  const getSession = async (sessionId: string): Promise<Session> => {
    try {
      const response = await SessionService.getSession(sessionId);
      const sessionData = (response as SessionResponse).session || (response as SessionResponse).data || response;
      return transformSession(sessionData as BackendSession);
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
  }): Promise<unknown> => {
    loading.value = true;
    error.value = null;
    try {
      const response = await SessionService.bookSession(sessionData);

      if (response && typeof response === 'object') {
        const responseData = response as SessionResponse;
        if (responseData.session || responseData.data) {
          const newSession = transformSession((responseData.session || responseData.data) as BackendSession);
          sessions.value.push(newSession);
        }
      }

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
  const acceptSession = async (sessionId: string): Promise<unknown> => {
    loading.value = true;
    error.value = null;
    try {
      const response = await CounsellorService.acceptSession({
        session_id: sessionId
      });

      const sessionIndex = sessions.value.findIndex(s => s.id === sessionId);
      if (sessionIndex !== -1) {
        sessions.value[sessionIndex].status = 'accepted';
      }

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
  const getSessionStatusText = (status: string): string => {
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
  const getSessionStatusClass = (status: string): string => {
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
  const formatSessionTime = (date: string, time: string): string => {
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
  const clearError = (): void => {
    error.value = null;
  };

  // Fetch sessions based on user type
  const fetchSessions = async (): Promise<void> => {
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
    fetchCounselors,
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
