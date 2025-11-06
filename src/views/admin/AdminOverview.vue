<template>
  <div class="space-y-6">
    <!-- Welcome Section -->
    <div class="bg-white rounded-lg shadow-sm p-6">
      <h1 class="text-2xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
      <p class="text-gray-600">Manage forums, events, and platform settings</p>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div class="bg-white rounded-lg shadow-sm p-6">
        <div class="flex items-center">
          <div class="p-2 bg-green-100 rounded-lg">
            <CalendarIcon class="w-6 h-6 text-green-600" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-500">Total Forums</p>
            <p class="text-2xl font-bold text-gray-900">{{ stats.totalForums }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-sm p-6">
        <div class="flex items-center">
          <div class="p-2 bg-blue-100 rounded-lg">
            <ClockIcon class="w-6 h-6 text-blue-600" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-500">Upcoming Forums</p>
            <p class="text-2xl font-bold text-gray-900">{{ stats.upcomingForums }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-sm p-6">
        <div class="flex items-center">
          <div class="p-2 bg-yellow-100 rounded-lg">
            <UsersIcon class="w-6 h-6 text-yellow-600" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-500">Total Registrations</p>
            <p class="text-2xl font-bold text-gray-900">{{ stats.totalRegistrations }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-sm p-6">
        <div class="flex items-center">
          <div class="p-2 bg-purple-100 rounded-lg">
            <EyeIcon class="w-6 h-6 text-purple-600" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-500">Public Forums</p>
            <p class="text-2xl font-bold text-gray-900">{{ stats.publicForums }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="bg-white rounded-lg shadow-sm p-6">
      <h2 class="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <router-link
          to="/admin-dashboard/forums/create"
          class="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <PlusIcon class="w-5 h-5 text-green-600 mr-3" />
          <div>
            <h3 class="font-medium text-gray-900">Create Forum</h3>
            <p class="text-sm text-gray-500">Add a new forum event</p>
          </div>
        </router-link>

        <router-link
          to="/admin-dashboard/forums"
          class="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <CalendarIcon class="w-5 h-5 text-blue-600 mr-3" />
          <div>
            <h3 class="font-medium text-gray-900">Manage Forums</h3>
            <p class="text-sm text-gray-500">View and edit all forums</p>
          </div>
        </router-link>

        <router-link
          to="/admin-dashboard/settings"
          class="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <SettingsIcon class="w-5 h-5 text-gray-600 mr-3" />
          <div>
            <h3 class="font-medium text-gray-900">Settings</h3>
            <p class="text-sm text-gray-500">Configure platform settings</p>
          </div>
        </router-link>
      </div>
    </div>

    <!-- Recent Activity -->
    <div class="bg-white rounded-lg shadow-sm p-6">
      <h2 class="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
      <div class="space-y-3">
        <div v-for="activity in recentActivity" :key="activity.id" class="flex items-center space-x-3">
          <div class="w-2 h-2 bg-green-500 rounded-full"></div>
          <div class="flex-1">
            <p class="text-sm text-gray-900">{{ activity.description }}</p>
            <p class="text-xs text-gray-500">{{ activity.timestamp }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { CalendarIcon, ClockIcon, UsersIcon, EyeIcon, PlusIcon, SettingsIcon } from 'lucide-vue-next';
import { ForumService } from '@/services/apiService';

const stats = ref({
  totalForums: 0,
  upcomingForums: 0,
  totalRegistrations: 0,
  publicForums: 0
});

const recentActivity = ref([
  {
    id: 1,
    description: 'New forum "Parenting Challenges Session" created',
    timestamp: '2 hours ago'
  },
  {
    id: 2,
    description: 'Forum "Family Communication Workshop" updated',
    timestamp: '1 day ago'
  },
  {
    id: 3,
    description: 'User registration for "Family Communication Workshop"',
    timestamp: '2 days ago'
  }
]);

onMounted(async () => {
  try {
    const response = await ForumService.getAllForums();
    if (response.status && response.data) {
      const forums = response.data;
      const now = new Date();
      
      stats.value.totalForums = forums.length;
      stats.value.upcomingForums = forums.filter((forum: any) => {
        const forumDate = new Date(forum.date);
        return forumDate > now;
      }).length;
      stats.value.publicForums = forums.filter((forum: any) => {
        return forum.is_public !== undefined ? forum.is_public : true;
      }).length;
    }
  } catch (error) {
    console.error('Error fetching forum stats:', error);
  }
});
</script>
