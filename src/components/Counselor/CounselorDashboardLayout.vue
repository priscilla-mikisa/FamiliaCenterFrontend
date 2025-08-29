<template>
  <div class="min-h-screen bg-gray-50 flex">
    <!-- Sidebar -->
    <div :class="`${
      isMenuOpen ? 'translate-x-0' : '-translate-x-full'
    } fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:inset-0`">
      <div class="flex items-center justify-between h-16 px-4 border-b border-gray-200">
        <div class="flex items-center space-x-2">
          <div class="w-8 h-8 bg-gradient-to-r from-blue-400 to-blue-600 rounded-lg flex items-center justify-center">
            <img
              src="/images/logo.png"
              alt="logo"
              class="w-6 h-6"
            />
          </div>
          <span class="text-xl font-bold text-gray-900">FamiSpace Pro</span>
        </div>
        <button
          @click="isMenuOpen = false"
          class="md:hidden p-1 rounded-md hover:bg-gray-100"
        >
          <XIcon class="w-5 h-5" />
        </button>
      </div>

      <nav class="mt-8 px-4">
        <div class="space-y-1">
          <router-link
            v-for="item in navigationItems"
            :key="item.name"
            :to="item.to"
            :class="`${
              $route.name === item.name
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            } group flex items-center px-2 py-2 text-sm font-medium rounded-md`"
          >
            <component :is="item.icon" class="mr-3 h-5 w-5" />
            {{ item.label }}
          </router-link>
        </div>
      </nav>

      <!-- User section at bottom -->
      <div class="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
        <div class="flex items-center space-x-3">
          <div class="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <UserIcon class="w-5 h-5 text-blue-600" />
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium text-gray-900 truncate">{{ user?.name || 'Dr. Counselor' }}</p>
            <p class="text-xs text-gray-500">{{ user?.specialization || 'Counselor' }}</p>
          </div>
          <button
            @click="showLogoutModal = true"
            class="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600"
          >
            <LogOutIcon class="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="flex-1 flex flex-col overflow-hidden">
      <!-- Header -->
      <header class="bg-white shadow-sm">
        <div class="px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between items-center py-4">
            <div class="flex items-center">
              <button
                @click="isMenuOpen = !isMenuOpen"
                class="md:hidden mr-4 p-2 rounded-md hover:bg-gray-100"
              >
                <MenuIcon class="w-6 h-6" />
              </button>
              <h1 class="text-lg font-semibold text-gray-900">{{ getPageTitle() }}</h1>
            </div>

            <div class="flex items-center space-x-4">
              <button class="relative p-2 rounded-full hover:bg-gray-100">
                <BellIcon class="w-5 h-5 text-gray-600" />
                <span class="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              <!-- Quick Stats -->
              <div class="hidden md:flex items-center space-x-4 text-sm text-gray-600">
                <span>Today's Sessions: {{ todayStats.sessions }}</span>
                <span>Active Clients: {{ todayStats.clients }}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <!-- Page Content -->
      <main class="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
        <router-view />
      </main>
    </div>

    <!-- Logout Modal -->
    <LogoutModal :isOpen="showLogoutModal" @close="showLogoutModal = false" />

    <!-- Mobile overlay -->
    <div
      v-if="isMenuOpen"
      @click="isMenuOpen = false"
      class="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 md:hidden"
    ></div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import {
  HomeIcon,
  CalendarIcon,
  UsersIcon,
  VideoIcon,
  FileTextIcon,
  BarChartIcon,
  SettingsIcon,
  BellIcon,
  MenuIcon,
  XIcon,
  UserIcon,
  LogOutIcon,
  BookOpenIcon
} from 'lucide-vue-next';
import LogoutModal from '../DashBoard/LogoutModal.vue';

const route = useRoute();
const isMenuOpen = ref(false);
const showLogoutModal = ref(false);

const user = ref({
  name: 'Dr. Sarah Johnson',
  specialization: 'Marriage Counseling',
  email: 'sarah@familiacenter.com'
});

const todayStats = ref({
  sessions: 5,
  clients: 12
});

const navigationItems = [
  {
    name: 'counselor-overview',
    label: 'Dashboard',
    to: '/counselor-dashboard',
    icon: HomeIcon
  },
  {
    name: 'counselor-schedule',
    label: 'Schedule',
    to: '/counselor-dashboard/schedule',
    icon: CalendarIcon
  },
  {
    name: 'counselor-clients',
    label: 'My Clients',
    to: '/counselor-dashboard/clients',
    icon: UsersIcon
  },
  {
    name: 'counselor-sessions',
    label: 'Sessions',
    to: '/counselor-dashboard/sessions',
    icon: VideoIcon
  },
  {
    name: 'counselor-programs',
    label: 'Programs',
    to: '/counselor-dashboard/programs',
    icon: BookOpenIcon
  },
  {
    name: 'counselor-resources',
    label: 'Resources',
    to: '/counselor-dashboard/resources',
    icon: FileTextIcon
  },
  {
    name: 'counselor-analytics',
    label: 'Analytics',
    to: '/counselor-dashboard/analytics',
    icon: BarChartIcon
  },
  {
    name: 'counselor-settings',
    label: 'Settings',
    to: '/counselor-dashboard/settings',
    icon: SettingsIcon
  }
];

const getPageTitle = () => {
  const routeNames: Record<string, string> = {
    'counselor-overview': 'Dashboard',
    'counselor-schedule': 'Schedule',
    'counselor-clients': 'My Clients',
    'counselor-sessions': 'Sessions',
    'counselor-programs': 'Programs',
    'counselor-resources': 'Resources',
    'counselor-analytics': 'Analytics',
    'counselor-settings': 'Settings'
  };
  return routeNames[route.name as string] || 'Counselor Dashboard';
};
</script>
