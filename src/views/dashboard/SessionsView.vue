<template>
  <div class="space-y-6">
    <!-- Stats Cards -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div class="bg-white rounded-lg shadow p-4">
        <div class="flex items-center">
          <div class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3">
            <VideoIcon class="w-5 h-5 text-green-600" />
          </div>
          <div>
            <p class="text-sm text-gray-500">Total Sessions</p>
            <p class="text-xl font-bold">{{ totalSessions }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow p-4">
        <div class="flex items-center">
          <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
            <CalendarIcon class="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <p class="text-sm text-gray-500">Upcoming</p>
            <p class="text-xl font-bold">{{ upcomingSessions.length }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow p-4">
        <div class="flex items-center">
          <div class="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
            <CheckCircleIcon class="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <p class="text-sm text-gray-500">Completed</p>
            <p class="text-xl font-bold">{{ completedSessions }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow p-4">
        <div class="flex items-center">
          <div class="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center mr-3">
            <ClockIcon class="w-5 h-5 text-yellow-600" />
          </div>
          <div>
            <p class="text-sm text-gray-500">This Month</p>
            <p class="text-xl font-bold">{{ monthlyCount }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Upcoming Sessions -->
    <div class="bg-white rounded-xl shadow">
      <div class="px-6 py-4 border-b">
        <div class="flex items-center justify-between">
          <h2 class="text-xl font-semibold text-gray-900">Upcoming Sessions</h2>
          <button
            @click="showBookingModal = true"
            class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
          >
            Book New Session
          </button>
        </div>
      </div>
      <div class="p-6">
        <div v-if="loading" class="flex justify-center py-8">
          <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
        </div>

        <div v-else-if="error" class="bg-red-50 border-l-4 border-red-500 p-4">
          <p class="text-sm text-red-700">{{ error }}</p>
        </div>

        <div v-else-if="upcomingSessions.length > 0" class="space-y-4">
          <div
            v-for="session in upcomingSessions"
            :key="session.id"
            class="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
          >
            <div class="flex justify-between items-start">
              <div>
                <h3 class="font-medium text-gray-900">{{ session.title }}</h3>
                <div class="flex items-center mt-2 text-sm text-gray-500">
                  <CalendarIcon class="w-4 h-4 mr-1" />
                  <span>{{ formatDate(session.start_time) }}</span>
                  <span class="mx-2">•</span>
                  <ClockIcon class="w-4 h-4 mr-1" />
                  <span>{{ session.duration }} mins</span>
                </div>
                <div class="mt-2 flex items-center text-sm text-gray-600">
                  <UserIcon class="w-4 h-4 mr-1" />
                  <span>{{ session.counselor.name }}</span>
                  <span class="mx-2">•</span>
                  <span>{{ session.counselor.specialization }}</span>
                </div>
              </div>
              <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                {{ session.status }}
              </span>
            </div>
            <div class="mt-4 flex space-x-2">
              <router-link
                :to="`/dashboard/sessions/join/${session.id}`"
                class="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm text-center"
              >
                Join Session
              </router-link>
              <button
                @click="handleReschedule()"
                class="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm"
              >
                Reschedule
              </button>
              <button
                @click="handleCancel(session.id)"
                class="px-4 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>

        <div v-else class="text-center py-8">
          <div class="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <CalendarIcon class="w-8 h-8 text-gray-400" />
          </div>
          <p class="text-gray-600">No upcoming sessions scheduled</p>
          <button
            @click="showBookingModal = true"
            class="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
          >
            Book Your First Session
          </button>
        </div>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="bg-white rounded-xl shadow">
      <div class="px-6 py-4 border-b">
        <h2 class="text-xl font-semibold text-gray-900">Quick Actions</h2>
      </div>
      <div class="p-6">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button
            @click="showBookingModal = true"
            class="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
          >
            <div class="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mb-2">
              <VideoIcon class="w-5 h-5 text-green-600" />
            </div>
            <span class="text-sm font-medium">Book Session</span>
          </button>

          <router-link
            to="/dashboard/programs"
            class="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
          >
            <div class="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mb-2">
              <BookOpenIcon class="w-5 h-5 text-blue-600" />
            </div>
            <span class="text-sm font-medium">Join Program</span>
          </router-link>

          <router-link
            to="/dashboard/resources"
            class="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
          >
            <div class="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mb-2">
              <FileTextIcon class="w-5 h-5 text-purple-600" />
            </div>
            <span class="text-sm font-medium">Resources</span>
          </router-link>

          <button class="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
            <div class="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center mb-2">
              <MessageCircleIcon class="w-5 h-5 text-yellow-600" />
            </div>
            <span class="text-sm font-medium">Messages</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Booking Modal (simplified) -->
    <div v-if="showBookingModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div class="bg-white rounded-xl p-6 max-w-md w-full">
        <h3 class="text-lg font-semibold mb-4">Book New Session</h3>
        <p class="text-gray-600 mb-4">This feature will be implemented with your booking system integration.</p>
        <div class="flex space-x-3">
          <button
            @click="showBookingModal = false"
            class="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            @click="handleBookSession"
            class="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import {
  VideoIcon,
  CalendarIcon,
  ClockIcon,
  UserIcon,
  BookOpenIcon,
  FileTextIcon,
  MessageCircleIcon,
  CheckCircleIcon
} from 'lucide-vue-next';
import { useSessions } from '@/composables/useSessions';

const { sessions, upcomingSessions, fetchSessions, loading, error} = useSessions();

const showBookingModal = ref(false);

const totalSessions = computed(() => sessions.value.length);
const completedSessions = computed(() =>
  sessions.value.filter(s => s.status === 'completed').length
);
const monthlyCount = computed(() => {
  const currentMonth = new Date().getMonth();
  return sessions.value.filter(s => new Date(s.start_time).getMonth() === currentMonth).length;
});

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const handleReschedule = async () => {
  if (confirm('Would you like to reschedule this session?')) {
    try {
      // This would typically open a date/time picker modal
      // For now, just show an alert
      alert('Reschedule functionality will be implemented with your booking system');
    } catch (err) {
      console.error('Reschedule failed:', err);
      alert('Failed to reschedule session');
    }
  }
};

const handleCancel = async (sessionId: number) => {
  if (confirm('Are you sure you want to cancel this session?')) {
    try {
      // Implement cancel logic here using sessionId
      alert(`Cancel functionality for session ${sessionId} will be implemented with your API`);
      await fetchSessions();
    } catch (err) {
      console.error('Cancel failed:', err);
      alert('Failed to cancel session');
    }
  }
};

const handleBookSession = () => {
  showBookingModal.value = false;
  // Implement booking logic here
  alert('Booking system integration needed');
};

onMounted(() => {
  fetchSessions();
});
</script>
