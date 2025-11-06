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
        <h1 class="text-3xl font-bold text-gray-900 mb-2">Past Forums</h1>
        <p class="text-gray-600">Watch recordings of our previous forums and events</p>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="text-center py-12">
        <div class="text-lg text-gray-500">Loading past forums...</div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="text-center py-12">
        <div class="text-lg text-red-500">{{ error }}</div>
        <button @click="fetchPastForums" class="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
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
          <!-- Video Thumbnail or Placeholder -->
          <div class="relative aspect-video bg-gray-200">
            <div v-if="forum.has_video" class="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
              <div class="text-center">
                <svg class="w-16 h-16 text-white mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                </svg>
                <p class="text-white text-sm font-medium">Watch Video</p>
              </div>
            </div>
            <div v-else class="absolute inset-0 flex items-center justify-center">
              <div class="text-center">
                <CalendarIcon class="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <p class="text-gray-500 text-sm">No video available</p>
              </div>
            </div>
            <div v-if="forum.has_video" class="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded">
              Video Available
            </div>
          </div>

          <!-- Forum Info -->
          <div class="p-6">
            <div class="flex items-center space-x-2 mb-2">
              <div :class="`w-2 h-2 rounded-full ${forum.color || 'bg-teal-500'}`"></div>
              <span class="text-xs font-medium text-gray-600">{{ forum.category }}</span>
            </div>
            <h3 class="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">{{ forum.title }}</h3>
            <p class="text-sm text-gray-600 mb-4 line-clamp-2">{{ forum.description }}</p>
            <div class="flex items-center text-sm text-gray-500">
              <CalendarIcon class="w-4 h-4 mr-2" />
              <span>{{ forum.date }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-12">
        <CalendarIcon class="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 class="text-lg font-medium text-gray-900 mb-2">No past forums available</h3>
        <p class="text-gray-600">Check back later for forum recordings</p>
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
const { forums, loading, error, fetchPastForums } = useForums();

onMounted(async () => {
  await fetchPastForums();
});

const navigateToForum = (forumId: string) => {
  router.push(`/forums/${forumId}`);
};
</script>

