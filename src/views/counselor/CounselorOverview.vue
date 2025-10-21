<template>
  <div class="space-y-6">
    <div class="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-6 text-white">
      <div class="flex flex-col md:flex-row md:items-center justify-between">
        <div>
          <h2 class="text-2xl font-bold mb-2">Good {{ getGreeting() }}, Dr. {{ user?.last_name || 'Counselor' }}</h2>
          <p class="max-w-xl">You have {{ todaysSessions.length }} sessions scheduled today and {{ totalSessions }} total sessions.</p>
        </div>
        <router-link
          to="/counselor-dashboard/schedule"
          class="mt-4 md:mt-0 px-6 py-3 bg-white text-blue-600 rounded-lg font-medium hover:bg-gray-100 transition-colors inline-block"
        >
          View Schedule
        </router-link>
      </div>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <div class="bg-white rounded-xl shadow p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-500">Today's Sessions</p>
            <p class="text-2xl font-bold mt-1">{{ todaysSessions.length }}</p>
          </div>
          <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
            <VideoIcon class="w-6 h-6 text-blue-600" />
          </div>
        </div>
        <div class="mt-2 text-sm">
          <span class="text-green-600">{{ pendingSessions.length }} pending approval</span>
        </div>
      </div>

      <div class="bg-white rounded-xl shadow p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-500">Total Sessions</p>
            <p class="text-2xl font-bold mt-1">{{ totalSessions }}</p>
          </div>
          <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
            <CalendarIcon class="w-6 h-6 text-green-600" />
          </div>
        </div>
        <div class="mt-2 text-sm">
          <span class="text-blue-600">{{ acceptedSessions.length }} accepted</span>
        </div>
      </div>

      <div class="bg-white rounded-xl shadow p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-500">Unique Patients</p>
            <p class="text-2xl font-bold mt-1">{{ uniquePatients }}</p>
          </div>
          <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
            <UsersIcon class="w-6 h-6 text-purple-600" />
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl shadow p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-500">Specialization</p>
            <p class="text-lg font-bold mt-1">{{ user?.speciality || 'General' }}</p>
          </div>
          <div class="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
            <BookOpenIcon class="w-6 h-6 text-yellow-600" />
          </div>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div class="lg:col-span-2">
        <div class="bg-white rounded-xl shadow">
          <div class="px-6 py-4 border-b">
            <h3 class="text-lg font-semibold text-gray-900">Today's Schedule</h3>
          </div>
          <div class="p-6">
            <div v-if="sessionsLoading" class="flex justify-center py-8">
              <div class="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            </div>
            <div v-else-if="todaysSessions.length > 0" class="space-y-4">
              <div
                v-for="session in todaysSessions"
                :key="session.id"
                class="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
              >
                <div class="flex justify-between items-start">
                  <div>
                    <h4 class="font-medium text-gray-900">{{ getPatientName(session) }}</h4>
                    <div class="flex items-center mt-1 text-sm text-gray-500">
                      <ClockIcon class="w-4 h-4 mr-1" />
                      <span>{{ formatSessionTime(session.session_date, session.session_time) }}</span>
                      <span class="mx-2">•</span>
                      <span>{{ session.duration }} mins</span>
                    </div>
                    <div class="mt-2">
                      <span class="inline-block bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs">
                        {{ getSessionTopic(session) }}
                      </span>
                    </div>
                    <!-- <div v-if="session.bio" class="mt-2 p-2 bg-gray-50 rounded text-sm text-gray-700">
                      <strong>Patient Notes:</strong> {{ session.bio }}
                    </div> -->
                  </div>
                  <div class="flex items-center space-x-2 ml-4">
                    <span :class="`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getSessionStatusClass(getSessionAccepted(session))}`">
                      {{ getSessionAccepted(session) ? 'Accepted' : 'Pending' }}
                    </span>
                    <div class="flex flex-col space-y-1">
                      <button
                        v-if="!getSessionAccepted(session)"
                        @click="handleAcceptSession(session.id)"
                        :disabled="acceptingSession === session.id"
                        class="px-3 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700 disabled:opacity-50"
                      >
                        {{ acceptingSession === session.id ? 'Accepting...' : 'Accept' }}
                      </button>
                      <button
                        v-if="canStartSession(session) && getSessionAccepted(session)"
                        @click="startSession(session)"
                        class="px-3 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700"
                      >
                        Start Session
                      </button>
                      <button class="px-3 py-1 border border-gray-300 text-gray-700 rounded text-xs hover:bg-gray-50">
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div v-else class="text-center py-8">
              <CalendarIcon class="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p class="text-gray-600">No sessions scheduled for today</p>
            </div>
          </div>
        </div>

        <!-- All Sessions Overview -->
        <div class="bg-white rounded-xl shadow mt-6">
          <div class="px-6 py-4 border-b">
            <div class="flex items-center justify-between">
              <h3 class="text-lg font-semibold text-gray-900">All Sessions</h3>
              <router-link
                to="/counselor-dashboard/sessions"
                class="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                View All →
              </router-link>
            </div>
          </div>
          <div class="p-6">
            <div v-if="sessions.length > 0" class="space-y-3">
              <div
                v-for="session in sessions.slice(0, 5)"
                :key="session.id"
                class="flex items-center justify-between p-3 border border-gray-100 rounded-lg"
              >
                <div>
                  <div class="font-medium text-sm">{{ getPatientName(session) }}</div>
                  <div class="text-xs text-gray-500">{{ getSessionTopic(session) }} • {{ formatSessionTime(session.session_date, session.session_time) }}</div>
                </div>
                <span :class="`text-xs px-2 py-1 rounded ${getSessionStatusClass(getSessionAccepted(session))}`">
                  {{ getSessionAccepted(session) ? 'Accepted' : 'Pending' }}
                </span>
              </div>
            </div>
            <div v-else class="text-center py-4 text-gray-500 text-sm">
              No sessions yet
            </div>
          </div>
        </div>
      </div>

      <div class="space-y-6">
        <!-- Pending Sessions (Requires Action) -->
        <div v-if="pendingSessions.length > 0" class="bg-white rounded-xl shadow">
          <div class="px-6 py-4 border-b">
            <h3 class="text-lg font-semibold text-gray-900">Pending Approval</h3>
            <p class="text-sm text-gray-600">Sessions waiting for your response</p>
          </div>
          <div class="p-6">
            <div class="space-y-3">
              <div
                v-for="session in pendingSessions.slice(0, 3)"
                :key="session.id"
                class="border border-yellow-200 bg-yellow-50 rounded-lg p-3"
              >
                <div class="font-medium text-sm text-gray-900">{{ getPatientName(session) }}</div>
                <div class="text-xs text-gray-600 mb-2">{{ getSessionTopic(session) }}</div>
                <div class="text-xs text-gray-500 mb-3">{{ formatSessionTime(session.session_date, session.session_time) }}</div>
                <div class="flex space-x-2">
                  <button
                    @click="handleAcceptSession(session.id)"
                    :disabled="acceptingSession === session.id"
                    class="flex-1 px-2 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700 disabled:opacity-50"
                  >
                    {{ acceptingSession === session.id ? 'Accepting...' : 'Accept' }}
                  </button>
                  <button
                    @click="handleRejectSession(session.id)"
                    class="flex-1 px-2 py-1 border border-gray-300 text-gray-700 rounded text-xs hover:bg-gray-50"
                  >
                    Decline
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Quick Actions -->
        <div class="bg-white rounded-xl shadow">
          <div class="px-6 py-4 border-b">
            <h3 class="text-lg font-semibold text-gray-900">Quick Actions</h3>
          </div>
          <div class="p-6">
            <div class="space-y-3">
              <router-link
                to="/counselor-dashboard/clients"
                class="w-full flex items-center justify-center px-4 py-3 border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                <UsersIcon class="w-4 h-4 mr-2" />
                View All Clients
              </router-link>

              <router-link
                to="/counselor-dashboard/schedule"
                class="w-full flex items-center justify-center px-4 py-3 border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                <CalendarIcon class="w-4 h-4 mr-2" />
                Manage Schedule
              </router-link>

              <router-link
                to="/counselor-dashboard/resources"
                class="w-full flex items-center justify-center px-4 py-3 border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                <FileTextIcon class="w-4 h-4 mr-2" />
                Upload Resources
              </router-link>

              <router-link
                to="/counselor-dashboard/settings"
                class="w-full flex items-center justify-center px-4 py-3 border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                <SettingsIcon class="w-4 h-4 mr-2" />
                Profile Settings
              </router-link>
            </div>
          </div>
        </div>

        <!-- Session Statistics -->
        <div class="bg-white rounded-xl shadow">
          <div class="px-6 py-4 border-b">
            <h3 class="text-lg font-semibold text-gray-900">Session Overview</h3>
          </div>
          <div class="p-6">
            <div class="space-y-4">
              <div class="flex justify-between items-center">
                <span class="text-sm text-gray-600">Pending Sessions</span>
                <span class="font-medium text-yellow-600">{{ pendingSessions.length }}</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-sm text-gray-600">Accepted Sessions</span>
                <span class="font-medium text-green-600">{{ acceptedSessions.length }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-xl shadow">
          <div class="px-6 py-4 border-b">
            <h3 class="text-lg font-semibold text-gray-900">Pending Tasks</h3>
          </div>
          <div class="p-6">
            <div class="space-y-3">
              <div v-for="task in pendingTasks" :key="task.id" class="flex items-center space-x-3">
                <input type="checkbox" class="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                <span class="text-sm text-gray-900">{{ task.description }}</span>
                <span :class="`text-xs px-2 py-1 rounded ${task.priority === 'high' ? 'bg-red-100 text-red-800' : task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'}`">
                  {{ task.priority }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-xl shadow">
          <div class="px-6 py-4 border-b">
            <div class="flex justify-between items-center">
              <span class="text-sm text-gray-600">Completed Sessions</span>
              <span class="font-medium text-blue-600">{{ completedSessions.length }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import {
  VideoIcon,
  UsersIcon,
  CalendarIcon,
  BookOpenIcon,
  ClockIcon,
  FileTextIcon,
  SettingsIcon
} from 'lucide-vue-next';
import { useSessions } from '@/composables/useSessions';
import { useAuth } from '@/composables/useAuth';
import type { SessionResponse } from '@/services/apiService';

const {
  sessions,
  loading: sessionsLoading,
  fetchCounsellorSessions,
  acceptSession,
  formatSessionTime
} = useSessions();

const { user, getProfile } = useAuth();

const acceptingSession = ref<string | null>(null);

// Computed properties based on actual backend data
const todaysSessions = computed(() => {
  const today = new Date().toISOString().split('T')[0];
  return sessions.value.filter(session => {
    const sessionDate = new Date(session.start_time).toISOString().split('T')[0];
    return sessionDate === today;
  });
});

// Normalizer to handle different backend property names for "accepted" state
const getSessionAccepted = (session: Partial<SessionResponse> & {
  is_counsellor_accepted?: boolean;
  is_counselor_accepted?: boolean;
  counsellor_accepted?: boolean;
  accepted?: boolean;
}) => {
  const s = session as {
    is_counsellor_accepted?: boolean;
    is_counselor_accepted?: boolean;
    counsellor_accepted?: boolean;
    accepted?: boolean;
  };
  return Boolean(
    s.is_counsellor_accepted ??
    s.is_counselor_accepted ??
    s.counsellor_accepted ??
    s.accepted ??
    false
  );
};

const pendingSessions = computed(() => {
  return sessions.value.filter(session => !getSessionAccepted(session));
});

const acceptedSessions = computed(() => {
  return sessions.value.filter(session => getSessionAccepted(session));
});

const completedSessions = computed(() => {
  return sessions.value.filter(session => session.status === 'completed');
});

const totalSessions = computed(() => sessions.value.length);

const uniquePatients = computed(() => {
  const ids = sessions.value
    .map(session => {
      // create a local typed shape to avoid `any` while covering common backend variants
      type SessionLike = Partial<SessionResponse> & {
        user?: {
          id?: string | number;
          user_id?: string | number;
          userId?: string | number;
          email?: string;
        };
        user_id?: string | number;
        patient_id?: string | number;
        userId?: string | number;
      };
      const s = session as SessionLike;
      // prefer nested user id, then common variants, then fallback to null
      return s.user?.id ?? s.user_id ?? s.user?.user_id ?? s.patient_id ?? s.user?.userId ?? s.user?.email ?? null;
    })
    .filter(Boolean);
  return new Set(ids).size;
});

// Simple local tasks list (replace with API-backed data if available)
type Task = {
  id: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
};

const pendingTasks = ref<Task[]>([
  { id: 't1', description: 'Complete patient notes', priority: 'high' },
  { id: 't2', description: 'Upload session resources', priority: 'medium' }
]);

// Methods
const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'morning';
  if (hour < 18) return 'afternoon';
  return 'evening';
};

// Accept a partial session shape from the store/template and use safe accessors.
type ExtendedSession = Partial<SessionResponse> & {
  first_name?: string;
  last_name?: string;
  title?: string;
  topic?: string;
  description?: string;
  user?: {
    first_name?: string;
    last_name?: string;
  };
};

const getPatientName = (session: ExtendedSession) => {
  // Some APIs return a nested user object, others might only include first/last on the root;
  // fall back safely and return a sensible default.
  const first = session.user?.first_name ?? session.first_name ?? 'Unknown';
  const last = session.user?.last_name ?? session.last_name ?? '';
  return `${first} ${last}`.trim();
};

// Helper to display a session "topic" while supporting different backend shapes.
// Prefer explicit topic, then title, then description, then an empty placeholder.
const getSessionTopic = (session: ExtendedSession) => {
  return session.topic ?? session.title ?? session.description ?? 'No topic provided';
};

// Allow undefined to be passed and treat it as not accepted.
const getSessionStatusClass = (isAccepted?: boolean) => {
  return isAccepted ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800';
};

const canStartSession = (session: Partial<SessionResponse>) => {
  if (!session.start_time) return false;
  const sessionTime = new Date(session.start_time);
  const now = new Date();
  const timeDiff = sessionTime.getTime() - now.getTime();
  return timeDiff <= 15 * 60 * 1000 && timeDiff >= -5 * 60 * 1000;
};

const handleAcceptSession = async (sessionId: string) => {
  acceptingSession.value = sessionId;
  try {
    await acceptSession(sessionId);
    console.log('Session accepted successfully');
  } catch (error) {
    console.error('Failed to accept session:', error);
    alert('Failed to accept session. Please try again.');
  } finally {
    acceptingSession.value = null;
  }
};

const handleRejectSession = (sessionId: string) => {
  if (confirm('Are you sure you want to decline this session?')) {
    console.log('Rejecting session:', sessionId);
    // In real implementation, would call reject API
    alert('Session declined. The patient will be notified.');
  }
};

const startSession = (session: Partial<SessionResponse>) => {
  if (session.meeting_link) {
    window.open(session.meeting_link, '_blank');
  } else {
    console.log('Starting session:', session);
    alert(`Starting session with ${getPatientName(session)}`);
  }
};

onMounted(async () => {
  console.log('Loading counselor dashboard data...');
  try {
    await getProfile().catch(() => console.log('Could not load user profile'));
    await fetchCounsellorSessions().catch(() => console.log('Could not load sessions'));
  } catch (error) {
    console.error('Failed to load counselor dashboard data:', error);
  }
});
</script>
