<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="bg-white shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center py-4">
          <div class="flex items-center space-x-2">
            <div class="w-8 h-8 bg-gradient-to-r from-green-400 to-green-600 rounded-lg flex items-center justify-center">
              <img
                src="/images/logo.jpeg"
                alt="logo"
                class="w-6 h-6"
              />
            </div>
            <span class="text-xl font-bold text-gray-900">FamiSpace</span>
          </div>
          <router-link to="/" class="text-green-600 hover:text-green-700 font-medium">
            ← Back to Home
          </router-link>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">Upcoming Forums</h1>
        <p class="text-gray-600">Discover and register for our upcoming forums and events</p>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="text-center py-12">
        <div class="text-lg text-gray-500">Loading upcoming forums...</div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="text-center py-12">
        <div class="text-lg text-red-500">{{ error }}</div>
        <button @click="fetchUpcomingForums" class="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
          Try Again
        </button>
      </div>

      <!-- Forums Grid -->
      <div v-else-if="forums.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="forum in forums"
          :key="forum.id"
          class="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
          @click="navigateToForum(forum.id)"
        >
          <!-- Forum Image/Color -->
          <div :class="`h-32 ${forum.color || 'bg-teal-500'}`"></div>

          <!-- Forum Info -->
          <div class="p-6">
            <div class="flex items-center space-x-2 mb-2">
              <div :class="`w-2 h-2 rounded-full ${forum.color || 'bg-teal-500'}`"></div>
              <span class="text-xs font-medium text-gray-600">{{ forum.category }}</span>
            </div>
            <h3 class="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">{{ forum.title }}</h3>
            <p class="text-sm text-gray-600 mb-4 line-clamp-2">{{ forum.description }}</p>
            <div class="flex items-center text-sm text-gray-500 mb-4">
              <CalendarIcon class="w-4 h-4 mr-2" />
              <span>{{ forum.date }} • {{ forum.time }}</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-xs text-gray-500">{{ forum.location }}</span>
              <span class="text-xs font-medium text-green-600">Learn More →</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-12">
        <CalendarIcon class="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 class="text-lg font-medium text-gray-900 mb-2">No upcoming forums available</h3>
        <p class="text-gray-600 mb-6">Check back later for new events</p>
        <router-link
          to="/forums/past"
          class="inline-block px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
        >
          View Past Forums
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { CalendarIcon } from 'lucide-vue-next';
import { useForums } from '@/composables/useForums';

const router = useRouter();
const { forums, loading, error, fetchUpcomingForums } = useForums();

onMounted(async () => {
  await fetchUpcomingForums();
});

const navigateToForum = (forumId: string) => {
  router.push(`/forums/${forumId}`);
};
</script>

