<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="bg-white rounded-xl shadow p-6">
      <div class="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
        <h2 class="text-xl font-semibold text-gray-900">My Sessions</h2>
        <button
          @click="showBookingModal = true"
          class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center"
        >
          <PlusIcon class="w-4 h-4 mr-2" />
          Book New Session
        </button>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
      <p class="mt-4 text-gray-600">Loading sessions...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4">
      <p class="text-red-600">{{ error }}</p>
      <button
        @click="refreshSessions"
        class="mt-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
      >
        Retry
      </button>
    </div>

    <!-- Sessions Content -->
    <div v-else>
      <!-- Tabs -->
      <div class="bg-white rounded-xl shadow overflow-hidden">
        <div class="border-b border-gray-200">
          <nav class="-mb-px flex">
            <button
              @click="activeTab = 'upcoming'"
              :class="`flex-1 py-4 px-6 text-center border-b-2 font-medium text-sm ${
                activeTab === 'upcoming'
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`"
            >
              Upcoming ({{ upcomingSessions.length }})
            </button>
            <button
              @click="activeTab = 'past'"
              :class="`flex-1 py-4 px-6 text-center border-b-2 font-medium text-sm ${
                activeTab === 'past'
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`"
            >
              Past ({{ pastSessions.length }})
            </button>
          </nav>
        </div>

        <!-- Upcoming Sessions -->
        <div v-if="activeTab === 'upcoming'" class="p-6">
          <div v-if="upcomingSessions.length === 0" class="text-center py-12">
            <CalendarIcon class="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 class="text-lg font-medium text-gray-900 mb-2">No upcoming sessions</h3>
            <p class="text-gray-500 mb-4">Book a session with one of our counselors to get started.</p>
            <button
              @click="showBookingModal = true"
              class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Book Your First Session
            </button>
          </div>

          <div v-else class="space-y-4">
            <div
              v-for="session in upcomingSessions"
              :key="session.id"
              class="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div class="flex justify-between items-start">
                <div class="flex-1">
                  <div class="flex items-center space-x-3 mb-2">
                    <h3 class="font-medium text-gray-900">
                      {{ session.counsellor_name || session.counselor?.name || 'Counselor Session' }}
                    </h3>
                    <span :class="`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getSessionStatusClass(session.status)}`">
                      {{ getSessionStatusText(session.status) }}
                    </span>
                  </div>

                  <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                    <div class="flex items-center">
                      <CalendarIcon class="w-4 h-4 mr-1" />
                      {{ formatSessionTime(session.session_date, session.session_time) }}
                    </div>
                    <div class="flex items-center">
                      <ClockIcon class="w-4 h-4 mr-1" />
                      {{ session.duration || 60 }} minutes
                    </div>
                    <div class="flex items-center">
                      <UserIcon class="w-4 h-4 mr-1" />
                      {{ session.type || 'Individual Session' }}
                    </div>
                    <div class="flex items-center">
                      <VideoIcon class="w-4 h-4 mr-1" />
                      Online Session
                    </div>
                  </div>

                  <div v-if="session.notes" class="mt-2 p-2 bg-gray-50 rounded text-sm text-gray-700">
                    <strong>Notes:</strong> {{ session.notes }}
                  </div>
                </div>

                <div class="flex items-center space-x-2 ml-4">
                  <button
                    v-if="canJoinSession(session)"
                    @click="joinSession(session)"
                    class="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
                  >
                    Join Session
                  </button>
                  <button
                    @click="viewSessionDetails(session)"
                    class="px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm"
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Past Sessions -->
        <div v-if="activeTab === 'past'" class="p-6">
          <div v-if="pastSessions.length === 0" class="text-center py-12">
            <ClockIcon class="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 class="text-lg font-medium text-gray-900 mb-2">No past sessions</h3>
            <p class="text-gray-500">Your completed sessions will appear here.</p>
          </div>

          <div v-else class="space-y-4">
            <div
              v-for="session in pastSessions"
              :key="session.id"
              class="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div class="flex justify-between items-start">
                <div class="flex-1">
                  <div class="flex items-center space-x-3 mb-2">
                    <h3 class="font-medium text-gray-900">
                      {{ session.counsellor_name || session.counselor?.name || 'Counselor Session' }}
                    </h3>
                    <span :class="`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getSessionStatusClass(session.status)}`">
                      {{ getSessionStatusText(session.status) }}
                    </span>
                  </div>

                  <div class="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm text-gray-600">
                    <div class="flex items-center">
                      <CalendarIcon class="w-4 h-4 mr-1" />
                      {{ formatSessionTime(session.session_date, session.session_time) }}
                    </div>
                    <div class="flex items-center">
                      <ClockIcon class="w-4 h-4 mr-1" />
                      {{ session.duration || 60 }} minutes
                    </div>
                    <div class="flex items-center">
                      <UserIcon class="w-4 h-4 mr-1" />
                      {{ session.type || 'Individual Session' }}
                    </div>
                  </div>

                  <div v-if="session.feedback" class="mt-2 p-2 bg-green-50 rounded text-sm text-green-800">
                    <strong>Feedback:</strong> {{ session.feedback }}
                  </div>
                </div>

                <div class="flex items-center space-x-2 ml-4">
                  <button
                    @click="viewSessionDetails(session)"
                    class="px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm"
                  >
                    View Details
                  </button>
                  <button
                    v-if="session.status === 'completed'"
                    @click="showFeedbackModal(session)"
                    class="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                  >
                    Rate Session
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Book Session Modal -->
    <BookSessionModal
      :isOpen="showBookingModal"
      @close="showBookingModal = false"
      @success="handleBookingSuccess"
    />

    <!-- Session Details Modal -->
    <SessionDetailsModal
      :isOpen="showDetailsModal"
      :session="selectedSession"
      @close="showDetailsModal = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted} from 'vue';
import { useSessions } from '@/composables/useSessions';
import {
  PlusIcon,
  CalendarIcon,
  ClockIcon,
  UserIcon,
  VideoIcon
} from 'lucide-vue-next';
import BookSessionModal from '@/components/Sessions/BookSessionModal.vue';
import SessionDetailsModal from '@/components/Sessions/SessionDetailsModal.vue';
import type { Session } from '@/types';

const {
  upcomingSessions,
  pastSessions,
  loading,
  error,
  fetchUserSessions,
  getSessionStatusText,
  getSessionStatusClass,
  formatSessionTime
} = useSessions();

const activeTab = ref<'upcoming' | 'past'>('upcoming');
const showBookingModal = ref(false);
const showDetailsModal = ref(false);
const selectedSession = ref(null);

// Check if user can join a session (within 15 minutes of start time)
const canJoinSession = (session: Session) => {
  if (session.status !== 'confirmed' && session.status !== 'accepted') {
    return false;
  }

  const sessionDateTime = new Date(`${session.session_date}T${session.session_time}`);
  const now = new Date();
  const timeDiff = sessionDateTime.getTime() - now.getTime();

  // Can join 15 minutes before and up to session end time
  return timeDiff <= 15 * 60 * 1000 && timeDiff >= -60 * 60 * 1000;
};

const joinSession = (session: Session) => {
  // In a real implementation, this would redirect to Google Meet or your video platform
  console.log('Joining session:', session);
  alert(`Joining session with ${session.counsellor_name}...`);
};

const viewSessionDetails = (session: any) => {
  selectedSession.value = session;
  showDetailsModal.value = true;
};

const showFeedbackModal = (session: any) => {
  // Implementation for feedback modal
  console.log('Show feedback modal for session:', session);
};

const handleBookingSuccess = () => {
  showBookingModal.value = false;
  refreshSessions();
};

const refreshSessions = async () => {
  await fetchUserSessions();
};

onMounted(async () => {
  await fetchUserSessions();
});
</script>
