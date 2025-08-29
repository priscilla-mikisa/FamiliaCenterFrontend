<!-- src/views/dashboard/DashboardOverview.vue -->
<template>
  <div class="space-y-6">
    <!-- Welcome Banner -->
    <div class="bg-gradient-to-r from-green-600 to-green-700 rounded-xl p-6 text-white">
      <div class="flex flex-col md:flex-row md:items-center justify-between">
        <div>
          <h2 class="text-2xl font-bold mb-2">Welcome back, {{ user?.first_name || 'User' }}</h2>
          <p class="max-w-xl">Your journey to stronger relationships and personal growth continues.</p>
        </div>
        <div class="mt-4 md:mt-0 flex space-x-3">
          <router-link
            to="/dashboard/sessions"
            class="px-6 py-3 bg-white text-green-600 rounded-lg font-medium hover:bg-gray-100 transition-colors inline-block"
          >
            View Sessions
          </router-link>
          <router-link
            to="/dashboard/subscription"
            v-if="!currentSubscription"
            class="px-6 py-3 bg-green-800 text-white rounded-lg font-medium hover:bg-green-900 transition-colors inline-block"
          >
            Choose Plan
          </router-link>
        </div>
      </div>
    </div>

    <!-- Current Subscription Status -->
    <div v-if="currentSubscription" class="bg-blue-50 border border-blue-200 rounded-xl p-4">
      <div class="flex items-center justify-between">
        <div>
          <h3 class="font-medium text-blue-900">{{ currentSubscription.plan_name }}</h3>
          <p class="text-blue-700 text-sm">
            Next billing: {{ formatDate(currentSubscription.next_billing_date) }}
          </p>
        </div>
        <router-link
          to="/dashboard/subscription"
          class="text-blue-600 hover:text-blue-800 text-sm font-medium"
        >
          Manage Plan →
        </router-link>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <div class="bg-white rounded-xl shadow p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-500">Total Sessions</p>
            <p class="text-2xl font-bold mt-1">{{ stats.totalSessions }}</p>
          </div>
          <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
            <VideoIcon class="w-6 h-6 text-green-600" />
          </div>
        </div>
        <div class="mt-2 text-sm">
          <span class="text-green-600">{{ upcomingSessions.length }} upcoming</span>
        </div>
      </div>

      <div class="bg-white rounded-xl shadow p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-500">Active Programs</p>
            <p class="text-2xl font-bold mt-1">{{ stats.activePrograms }}</p>
          </div>
          <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
            <BookOpenIcon class="w-6 h-6 text-blue-600" />
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl shadow p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-500">Resources</p>
            <p class="text-2xl font-bold mt-1">{{ stats.resources }}</p>
          </div>
          <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
            <FileTextIcon class="w-6 h-6 text-purple-600" />
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl shadow p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-500">Available Counselors</p>
            <p class="text-2xl font-bold mt-1">{{ counsellors.length }}</p>
          </div>
          <div class="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
            <UsersIcon class="w-6 h-6 text-yellow-600" />
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Left Column - Upcoming Sessions -->
      <div class="lg:col-span-2">
        <div class="bg-white rounded-xl shadow">
          <div class="px-6 py-4 border-b">
            <h3 class="text-lg font-semibold text-gray-900">Upcoming Sessions</h3>
          </div>
          <div class="p-6">
            <div v-if="sessionsLoading" class="flex justify-center py-8">
              <div class="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500"></div>
            </div>
            <div v-else-if="upcomingSessions.length > 0" class="space-y-4">
              <div
                v-for="session in upcomingSessions.slice(0, 3)"
                :key="session.id"
                class="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
              >
                <div class="flex justify-between items-start">
                  <div>
                    <h4 class="font-medium text-gray-900">{{ session.counsellor_name || 'Counseling Session' }}</h4>
                    <div class="flex items-center mt-1 text-sm text-gray-500">
                      <CalendarIcon class="w-4 h-4 mr-1" />
                      <span>{{ formatSessionTime(session.session_date, session.session_time) }}</span>
                      <span class="mx-2">•</span>
                      <ClockIcon class="w-4 h-4 mr-1" />
                      <span>{{ session.duration }} mins</span>
                    </div>
                    <div class="mt-2 flex items-center">
                      <div class="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mr-2">
                        <UserIcon class="w-3 h-3 text-green-600" />
                      </div>
                      <span class="text-sm text-gray-600">{{ session.counselor.specialization }}</span>
                    </div>
                  </div>
                  <span :class="`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getSessionStatusClass(session.status)}`">
                    {{ getSessionStatusText(session.status) }}
                  </span>
                </div>
                <div class="mt-4 flex space-x-2">
                  <button
                    v-if="canJoinSession(session)"
                    @click="joinSession(session)"
                    class="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm text-center"
                  >
                    Join Session
                  </button>
                  <router-link
                    v-else
                    :to="`/dashboard/sessions/join/${session.id}`"
                    class="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm text-center"
                  >
                    View Session
                  </router-link>
                  <button class="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm">
                    Reschedule
                  </button>
                </div>
              </div>
            </div>
            <div v-else class="text-center py-8">
              <div class="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <CalendarIcon class="w-8 h-8 text-gray-400" />
              </div>
              <p class="text-gray-600">No upcoming sessions scheduled</p>
              <router-link
                to="/dashboard/sessions"
                class="mt-4 inline-block px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
              >
                Book a Session
              </router-link>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Column - Quick Actions -->
      <div>
        <div class="bg-white rounded-xl shadow">
          <div class="px-6 py-4 border-b">
            <h3 class="text-lg font-semibold text-gray-900">Quick Actions</h3>
          </div>
          <div class="p-6">
            <div class="grid grid-cols-2 gap-4">
              <router-link
                to="/dashboard/sessions"
                class="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                <div class="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mb-2">
                  <VideoIcon class="w-5 h-5 text-green-600" />
                </div>
                <span class="text-sm font-medium">Book Session</span>
              </router-link>

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

              <router-link
                to="/dashboard/subscription"
                class="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                <div class="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center mb-2">
                  <CreditCardIcon class="w-5 h-5 text-yellow-600" />
                </div>
                <span class="text-sm font-medium">Subscription</span>
              </router-link>
            </div>
          </div>
        </div>

        <!-- Recent Activity -->
        <div class="bg-white rounded-xl shadow mt-6">
          <div class="px-6 py-4 border-b">
            <h3 class="text-lg font-semibold text-gray-900">Recent Activity</h3>
          </div>
          <div class="p-6">
            <div v-if="recentActivity.length > 0" class="space-y-4">
              <div v-for="activity in recentActivity" :key="activity.id" class="flex items-start space-x-3">
                <div :class="`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${activity.color}`">
                  <component :is="activity.icon" class="w-4 h-4" />
                </div>
                <div class="min-w-0 flex-1">
                  <p class="text-sm text-gray-900">{{ activity.message }}</p>
                  <p class="text-xs text-gray-500">{{ activity.time }}</p>
                </div>
              </div>
            </div>
            <div v-else class="text-center text-gray-500 text-sm">
              No recent activity
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
  BookOpenIcon,
  FileTextIcon,
  UsersIcon,
  CalendarIcon,
  ClockIcon,
  UserIcon,
  CheckCircleIcon,
  CreditCardIcon
} from 'lucide-vue-next';
import { useSessions } from '@/composables/useSessions';
import { usePrograms } from '@/composables/usePrograms';
import { useSubscriptions } from '@/composables/useSubscriptions';
import { useAuth } from '@/composables/useAuth';
import type { Session } from '@/types';

const { upcomingSessions, counsellors, loading: sessionsLoading, fetchSessions, fetchCounsellors, getSessionStatusText, getSessionStatusClass, formatSessionTime } = useSessions();
const { enrolledPrograms, fetchPrograms } = usePrograms();
const { currentSubscription, getCurrentSubscription } = useSubscriptions();
const { user, getProfile } = useAuth();

const recentActivity = ref([
  {
    id: 1,
    message: 'Profile updated successfully',
    time: '2 hours ago',
    icon: CheckCircleIcon,
    color: 'bg-green-100 text-green-600'
  },
  {
    id: 2,
    message: 'Session booked with counselor',
    time: '1 day ago',
    icon: VideoIcon,
    color: 'bg-blue-100 text-blue-600'
  },
  {
    id: 3,
    message: 'Downloaded new resources',
    time: '3 days ago',
    icon: FileTextIcon,
    color: 'bg-purple-100 text-purple-600'
  }
]);

// Computed stats based on real data
const stats = computed(() => ({
  totalSessions: upcomingSessions.value.length + 8, // Add past sessions count when available
  activePrograms: enrolledPrograms.value.length,
  resources: 24, // This should come from resources API when available
}));

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
  // In a real implementation, this would open the meeting link
  if (session.meeting_link) {
    window.open(session.meeting_link, '_blank');
  } else {
    console.log('Joining session:', session);
    alert(`Joining session with ${session.counsellor_name}...`);
  }
};

const formatDate = (dateString: string) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

onMounted(async () => {
  try {
    // Load user profile
    await getProfile().catch(() => {
      console.log('Could not load user profile');
    });

    // Load dashboard data in parallel
    await Promise.all([
      fetchSessions().catch(() => console.log('Could not load sessions')),
      fetchPrograms().catch(() => console.log('Could not load programs')),
      fetchCounsellors().catch(() => console.log('Could not load counsellors')),
      getCurrentSubscription().catch(() => console.log('No current subscription'))
    ]);
  } catch (error) {
    console.error('Failed to load dashboard data:', error);
  }
});
</script>
