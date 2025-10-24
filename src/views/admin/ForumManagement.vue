<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Forum Management</h1>
        <p class="text-gray-600">Manage all forums and events</p>
      </div>
      <router-link
        to="/admin-dashboard/forums/create"
        class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
      >
        <PlusIcon class="w-4 h-4" />
        <span>Create Forum</span>
      </router-link>
    </div>

    <!-- Filters -->
    <div class="bg-white rounded-lg shadow-sm p-4">
      <div class="flex flex-wrap gap-4">
        <select v-model="filters.status" class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500">
          <option value="">All Status</option>
          <option value="upcoming">Upcoming</option>
          <option value="past">Past</option>
        </select>
        
        <input
          v-model="filters.search"
          type="text"
          placeholder="Search forums..."
          class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 flex-1 min-w-64"
        />
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-12">
      <div class="text-lg text-gray-500">Loading forums...</div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="text-center py-12">
      <div class="text-lg text-red-500">{{ error }}</div>
      <button @click="fetchForums" class="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
        Try Again
      </button>
    </div>

    <!-- Forums Table -->
    <div v-else class="bg-white rounded-lg shadow-sm overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Forum</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Registrations</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="forum in filteredForums" :key="forum.id" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap">
                <div>
                  <div class="text-sm font-medium text-gray-900">{{ forum.title }}</div>
                  <div class="text-sm text-gray-500">{{ forum.description }}</div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ forum.date }}</div>
                <div class="text-sm text-gray-500">{{ forum.time }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span 
                  class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
                  :class="getStatusClass(forum)"
                >
                  {{ getStatusText(forum) }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ forum.registeredCount || 0 }} / {{ forum.capacity }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div class="flex space-x-2">
                  <router-link
                    :to="`/admin-dashboard/forums/${forum.id}/edit`"
                    class="text-blue-600 hover:text-blue-900"
                  >
                    Edit
                  </router-link>
                  <button
                    @click="deleteForum(forum.id)"
                    class="text-red-600 hover:text-red-900"
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div v-if="pagination.totalPages > 1" class="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
        <div class="flex items-center justify-between">
          <div class="text-sm text-gray-700">
            Showing {{ (pagination.page - 1) * pagination.limit + 1 }} to {{ Math.min(pagination.page * pagination.limit, pagination.total) }} of {{ pagination.total }} results
          </div>
          <div class="flex space-x-2">
            <button
              @click="changePage(pagination.page - 1)"
              :disabled="pagination.page <= 1"
              class="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button
              @click="changePage(pagination.page + 1)"
              :disabled="pagination.page >= pagination.totalPages"
              class="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { PlusIcon } from 'lucide-vue-next';
import { ForumService } from '@/services/apiService';
import { getAllForums } from '@/data/dummyForums';
import type { Forum } from '@/types';

const forums = ref<Forum[]>([]);
const loading = ref(false);
const error = ref<string | null>(null);
const pagination = ref({
  page: 1,
  limit: 10,
  total: 0,
  totalPages: 0
});

const filters = ref({
  status: '',
  search: ''
});

const filteredForums = computed(() => {
  let filtered = forums.value;

  if (filters.value.status) {
    const now = new Date();
    filtered = filtered.filter(forum => {
      const forumDate = new Date(forum.date);
      if (filters.value.status === 'upcoming') {
        return forumDate > now;
      } else if (filters.value.status === 'past') {
        return forumDate <= now;
      }
      return true;
    });
  }

  if (filters.value.search) {
    const search = filters.value.search.toLowerCase();
    filtered = filtered.filter(forum => 
      forum.title.toLowerCase().includes(search) ||
      forum.description.toLowerCase().includes(search)
    );
  }

  return filtered;
});

const fetchForums = async () => {
  loading.value = true;
  error.value = null;
  
  try {
    // Use dummy data only
    const response = getAllForums({
      page: pagination.value.page,
      limit: pagination.value.limit,
      status: filters.value.status || undefined
    });
    
    forums.value = response.data.forums;
    pagination.value = response.data.pagination;
  } catch (err) {
    error.value = 'Failed to fetch forums';
    console.error('Error fetching forums:', err);
  } finally {
    loading.value = false;
  }
};

const changePage = (page: number) => {
  pagination.value.page = page;
  fetchForums();
};

const deleteForum = async (id: string) => {
  if (confirm('Are you sure you want to delete this forum?')) {
    try {
      await ForumService.deleteForum(id);
      await fetchForums();
    } catch (err) {
      console.error('Error deleting forum:', err);
    }
  }
};

const getStatusClass = (forum: Forum) => {
  const now = new Date();
  const forumDate = new Date(forum.date);
  
  if (forumDate > now) {
    return 'bg-green-100 text-green-800';
  } else {
    return 'bg-gray-100 text-gray-800';
  }
};

const getStatusText = (forum: Forum) => {
  const now = new Date();
  const forumDate = new Date(forum.date);
  
  if (forumDate > now) {
    return 'Upcoming';
  } else {
    return 'Past';
  }
};

onMounted(() => {
  fetchForums();
});
</script>
