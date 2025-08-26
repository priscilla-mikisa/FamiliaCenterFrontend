<template>
  <div class="space-y-6">
    <!-- Welcome Banner -->
    <div class="bg-gradient-to-r from-green-600 to-green-700 rounded-xl p-6 text-white">
      <div class="flex flex-col md:flex-row md:items-center justify-between">
        <div>
          <h2 class="text-2xl font-bold mb-2">Welcome back, {{ user?.first_name || 'User' }}</h2>
          <p class="max-w-xl">Your journey to stronger relationships and personal growth continues.</p>
        </div>
        <router-link
          to="/dashboard/sessions"
          class="mt-4 md:mt-0 px-6 py-3 bg-white text-green-600 rounded-lg font-medium hover:bg-gray-100 transition-colors inline-block"
        >
          View Sessions
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
            <p class="text-sm text-gray-500">New Messages</p>
            <p class="text-2xl font-bold mt-1">{{ stats.newMessages }}</p>
          </div>
          <div class="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
            <MessageCircleIcon class="w-6 h-6 text-yellow-600" />
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
                    <h4 class="font-medium text-gray-900">{{ session.title }}</h4>
                    <div class="flex items-center mt-1 text-sm text-gray-500">
                      <CalendarIcon class="w-4 h-4 mr-1" />
                      <span>{{ formatDate(session.start_time) }}</span>
                      <span class="mx-2">•</span>
                      <ClockIcon class="w-4 h-4 mr-1" />
                      <span>{{ session.duration }} mins</span>
                    </div>
                    <div class="mt-2 flex items-center">
                      <div class="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mr-2">
                        <UserIcon class="w-3 h-3 text-green-600" />
                      </div>
                      <span class="text-sm text-gray-600">{{ session.counselor.name }}</span>
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

              <button class="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                <div class="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center mb-2">
                  <MessageCircleIcon class="w-5 h-5 text-yellow-600" />
                </div>
                <span class="text-sm font-medium">Messages</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Recent Activity -->
        <div class="bg-white rounded-xl shadow mt-6">
          <div class="px-6 py-4 border-b">
            <h3 class="text-lg font-semibold text-gray-900">Recent Activity</h3>
          </div>
          <div class="p-6">
            <div class="space-y-4">
              <div class="flex items-start space-x-3">
                <div class="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <CheckCircleIcon class="w-4 h-4 text-green-600" />
                </div>
                <div class="min-w-0 flex-1">
                  <p class="text-sm text-gray-900">Completed session with Dr. Sarah Johnson</p>
                  <p class="text-xs text-gray-500">2 hours ago</p>
                </div>
              </div>

              <div class="flex items-start space-x-3">
                <div class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <BookOpenIcon class="w-4 h-4 text-blue-600" />
                </div>
                <div class="min-w-0 flex-1">
                  <p class="text-sm text-gray-900">Enrolled in Marriage Restoration Program</p>
                  <p class="text-xs text-gray-500">1 day ago</p>
                </div>
              </div>

              <div class="flex items-start space-x-3">
                <div class="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <FileTextIcon class="w-4 h-4 text-purple-600" />
                </div>
                <div class="min-w-0 flex-1">
                  <p class="text-sm text-gray-900">Downloaded new resources</p>
                  <p class="text-xs text-gray-500">3 days ago</p>
                </div>
              </div>
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
  MessageCircleIcon,
  CalendarIcon,
  ClockIcon,
  UserIcon,
  CheckCircleIcon
} from 'lucide-vue-next';
import { useSessions } from '@/composables/useSessions';
import { usePrograms } from '@/composables/usePrograms';
import { AuthService } from '@/services/apiService';

const { upcomingSessions, fetchSessions, loading: sessionsLoading } = useSessions();
const { enrolledPrograms, fetchPrograms } = usePrograms();

interface User {
  first_name?: string;
  last_name?: string;}

const user = ref<User | null>(null);

// Mock stats - replace with actual data from your API
const stats = computed(() => ({
  totalSessions: upcomingSessions.value.length + 8, // mock past sessions
  activePrograms: enrolledPrograms.value.length,
  resources: 24,
  newMessages: 3
}));

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

onMounted(async () => {
  try {
    // Fetch user profile
    const profileResponse = await AuthService.getProfile();
    user.value = profileResponse.data;

    // Fetch dashboard data
    await Promise.all([
      fetchSessions(true), // upcoming only
      fetchPrograms()
    ]);
  } catch (error) {
    console.error('Failed to load dashboard data:', error);
  }
});
</script>
