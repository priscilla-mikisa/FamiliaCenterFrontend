<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Sidebar -->
    <div 
      class="fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out" 
      :class="sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'"
    >
      <div class="flex items-center justify-between h-16 px-6 border-b border-gray-200">
        <div class="flex items-center space-x-2">
          <div class="w-8 h-8 bg-gradient-to-r from-green-400 to-green-600 rounded-lg flex items-center justify-center">
            <img src="/images/logo.jpeg" alt="logo" class="w-6 h-6" />
          </div>
          <span class="text-xl font-bold text-gray-900">Admin Panel</span>
        </div>
        <button @click="sidebarOpen = false" class="lg:hidden">
          <XIcon class="w-6 h-6 text-gray-500" />
        </button>
      </div>

      <nav class="mt-6 px-3">
        <div class="space-y-1">
          <router-link
            v-for="item in navigation"
            :key="item.name"
            :to="item.to"
            class="group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors"
            :class="isActiveRoute(item.to) ? 'bg-green-100 text-green-700' : 'text-gray-700 hover:bg-gray-100'"
          >
            <component :is="item.icon" class="w-5 h-5 mr-3" />
            {{ item.label }}
          </router-link>
        </div>
      </nav>
    </div>

    <!-- Main Content -->
    <div class="lg:pl-64">
      <!-- Header -->
      <header class="bg-white shadow-sm border-b border-gray-200">
        <div class="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
          <div class="flex items-center">
            <button @click="sidebarOpen = true" class="lg:hidden mr-4">
              <MenuIcon class="w-6 h-6 text-gray-500" />
            </button>
            <h1 class="text-xl font-semibold text-gray-900">{{ getPageTitle() }}</h1>
          </div>
          
          <div class="flex items-center space-x-4">
            <div class="text-sm text-gray-500">
              Welcome, Admin
            </div>
            <button @click="logout" class="text-sm text-red-600 hover:text-red-700">
              Logout
            </button>
          </div>
        </div>
      </header>

      <!-- Page Content -->
      <main class="p-4 sm:p-6 lg:p-8">
        <router-view />
      </main>
    </div>

    <!-- Mobile Overlay -->
    <div v-if="sidebarOpen" @click="sidebarOpen = false" class="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import {
  HomeIcon,
  CalendarIcon,
  PlusIcon,
  SettingsIcon,
  MenuIcon,
  XIcon
} from 'lucide-vue-next';

const route = useRoute();
const router = useRouter();
const sidebarOpen = ref(false);

const navigation = [
  {
    name: 'admin-overview',
    label: 'Overview',
    to: '/admin-dashboard',
    icon: HomeIcon
  },
  {
    name: 'admin-forums',
    label: 'Forum Management',
    to: '/admin-dashboard/forums',
    icon: CalendarIcon
  },
  {
    name: 'admin-create-forum',
    label: 'Create Forum',
    to: '/admin-dashboard/forums/create',
    icon: PlusIcon
  },
  {
    name: 'admin-settings',
    label: 'Settings',
    to: '/admin-dashboard/settings',
    icon: SettingsIcon
  }
];

const isActiveRoute = (routePath: string) => {
  return route.path === routePath || route.path.startsWith(routePath + '/');
};

const getPageTitle = () => {
  const routeNames: Record<string, string> = {
    'admin-overview': 'Admin Overview',
    'admin-forums': 'Forum Management',
    'admin-create-forum': 'Create Forum',
    'admin-edit-forum': 'Edit Forum',
    'admin-settings': 'Settings'
  };
  return routeNames[route.name as string] || 'Admin Dashboard';
};

const logout = () => {
  // Clear admin authentication
  localStorage.removeItem('authToken');
  localStorage.removeItem('userType');
  router.push('/login');
};
</script>
