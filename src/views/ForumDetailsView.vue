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
      <!-- Loading State -->
      <div v-if="loading" class="text-center py-12">
        <div class="text-lg text-gray-500">Loading forum details...</div>
      </div>
      
      <!-- Error State -->
      <div v-else-if="error" class="text-center py-12">
        <div class="text-lg text-red-500">{{ error }}</div>
        <button 
          @click="() => fetchForumById(route.params.id as string)"
          class="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          Try Again
        </button>
      </div>
      
      <!-- Forum Content -->
      <div v-else>
      <!-- Event Header -->
      <div class="bg-white rounded-xl shadow-sm p-4 sm:p-6 lg:p-8 mb-8">
        <div class="flex flex-col lg:flex-row lg:items-start lg:justify-between">
          <div class="flex-1 mb-6 lg:mb-0">
            <div class="flex items-center space-x-3 mb-4">
              <div :class="`w-3 h-3 rounded-full ${eventData.color}`"></div>
              <span class="text-sm font-medium text-gray-600">{{ eventData.category }}</span>
            </div>
            <h1 class="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">{{ eventData.title }}</h1>
            <p class="text-base sm:text-lg text-gray-600 mb-6">{{ eventData.description }}</p>
            
            <!-- Event Details -->
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              <div class="flex items-center space-x-3">
                <CalendarIcon class="w-5 h-5 text-gray-400 flex-shrink-0" />
                <div>
                  <p class="text-sm font-medium text-gray-900">{{ eventData.date }}</p>
                  <p class="text-sm text-gray-500">{{ eventData.time }}</p>
                </div>
              </div>
              
              <div class="flex items-center space-x-3">
                <ClockIcon class="w-5 h-5 text-gray-400 flex-shrink-0" />
                <div>
                  <p class="text-sm font-medium text-gray-900">Duration</p>
                  <p class="text-sm text-gray-500">-</p>
                </div>
              </div>
              
              <div class="flex items-center space-x-3 sm:col-span-2 lg:col-span-1">
                <UsersIcon class="w-5 h-5 text-gray-400 flex-shrink-0" />
                <div>
                  <p class="text-sm font-medium text-gray-900">Capacity</p>
                  <p class="text-sm text-gray-500">50+ participants</p>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Register Button -->
          <div class="lg:ml-8 flex-shrink-0">
            <button 
              v-if="!eventData.isRegistered"
              @click="registerForEvent"
              class="w-full sm:w-auto px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium text-center"
            >
              Register Now
            </button>
            <div 
              v-else
              class="w-full sm:w-auto px-6 py-3 bg-green-100 text-green-800 rounded-lg font-medium text-center"
            >
              ✓ Registered
            </div>
          </div>
        </div>
      </div>

      <!-- Event Content -->
      <div class="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
        <!-- Main Content -->
        <div class="xl:col-span-2 space-y-6 lg:space-y-8">
          <!-- About Section -->
          <div class="bg-white rounded-xl shadow-sm p-4 sm:p-6 lg:p-8">
            <h2 class="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">About This Event</h2>
            <div class="prose prose-gray max-w-none">
              <p class="text-gray-600 mb-4">{{ eventData.about }}</p>
              <p class="text-gray-600 mb-4">{{ eventData.about2 }}</p>
            </div>
          </div>

          <!-- What You'll Learn -->
          <div class="bg-white rounded-xl shadow-sm p-4 sm:p-6 lg:p-8">
            <h2 class="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">What You'll Learn</h2>
            <ul class="space-y-3">
              <li v-for="item in eventData.learningPoints" :key="item" class="flex items-start space-x-3">
                <CheckIcon class="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                <span class="text-gray-600">{{ item }}</span>
              </li>
            </ul>
          </div>

        </div>

        <!-- Sidebar -->
        <div class="space-y-4 lg:space-y-6">
          <!-- Event Info Card -->
          <div class="bg-white rounded-xl shadow-sm p-4 sm:p-6">
            <h3 class="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Event Information</h3>
            <div class="space-y-3 sm:space-y-4">
              <div class="flex items-start space-x-3">
                <MapPinIcon class="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                <div class="min-w-0">
                  <p class="text-sm font-medium text-gray-900">Location</p>
                  <p class="text-sm text-gray-500 break-words">{{ eventData.location }}</p>
                </div>
              </div>
              
              <div class="flex items-start space-x-3">
                <GlobeIcon class="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                <div class="min-w-0">
                  <p class="text-sm font-medium text-gray-900">Format</p>
                  <p class="text-sm text-gray-500">{{ eventData.format }}</p>
                </div>
              </div>
              
              <div class="flex items-start space-x-3">
                <TagIcon class="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                <div class="min-w-0 flex-1">
                  <p class="text-sm font-medium text-gray-900">Topics</p>
                  <div class="flex flex-wrap gap-1 sm:gap-2 mt-1">
                    <span 
                      v-for="topic in eventData.topics" 
                      :key="topic"
                      class="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full"
                    >
                      {{ topic }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Host Information -->
          <div class="bg-white rounded-xl shadow-sm p-4 sm:p-6">
            <h3 class="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Host</h3>
            <div class="flex items-start space-x-4">
              <div class="flex-shrink-0">
                <div class="w-16 h-16 bg-gradient-to-br from-teal-400 to-teal-600 rounded-full flex items-center justify-center">
                  <span class="text-white font-bold text-lg">RM</span>
                </div>
              </div>
              <div class="flex-1 min-w-0">
                <h4 class="text-lg font-semibold text-gray-900">Mrs. Ruth Matoya</h4>
                <p class="text-sm text-teal-600 font-medium">Therapist & Life Coach</p>
                <p class="text-sm text-gray-600 mt-2">
                  Licensed therapist and life coach specializing in family dynamics 
                  and self-reparenting.
                </p>
              </div>
            </div>
          </div>

          <!-- Contact Information -->
          <div class="bg-white rounded-xl shadow-sm p-4 sm:p-6">
            <h3 class="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Contact Information</h3>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div class="flex items-center space-x-3">
                <svg class="w-5 h-5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                </svg>
                <div class="min-w-0">
                  <p class="text-sm font-medium text-gray-900">+254 725 388 111</p>
                </div>
              </div>
              
              <div class="flex items-center space-x-3">
                <svg class="w-5 h-5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                </svg>
                <div class="min-w-0">
                  <p class="text-sm font-medium text-gray-900">info@fami.space</p>
                </div>
              </div>
              
              <div class="flex items-center space-x-3">
                <svg class="w-5 h-5 text-gray-400 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.746-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001.012.001z"/>
                </svg>
                <div class="min-w-0">
                  <p class="text-sm font-medium text-gray-900">@Famispace_</p>
                </div>
              </div>
              
              <div class="flex items-center space-x-3">
                <svg class="w-5 h-5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9"></path>
                </svg>
                <div class="min-w-0">
                  <p class="text-sm font-medium text-gray-900">www.fami.space</p>
                </div>
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
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { 
  CalendarIcon, 
  ClockIcon, 
  UsersIcon, 
  CheckIcon, 
  MapPinIcon, 
  GlobeIcon, 
  TagIcon 
} from 'lucide-vue-next';
import { useForums } from '@/composables/useForums';
import type { Forum } from '@/types';

const route = useRoute();
const router = useRouter();
const { currentForum, loading, error, fetchForumById } = useForums();

onMounted(async () => {
  const forumId = route.params.id as string;
  if (forumId) {
    await fetchForumById(forumId);
  }
});

const eventData = computed(() => {
  if (!currentForum.value) {
    return {
      id: '',
      title: 'Loading...',
      description: '',
      category: '',
      color: 'bg-gray-500',
      date: '',
      time: '',
      duration: '',
      capacity: 0,
      location: '',
      format: '',
      topics: [],
      about: '',
      about2: '',
      learningPoints: [],
      host: {
        name: '',
        title: '',
        description: '',
        contact: '',
        email: ''
      },
      isRegistered: false
    };
  }
  
  const forum = currentForum.value;
  return {
    id: forum.id,
    title: forum.title,
    description: forum.description,
    category: forum.category,
    color: forum.color,
    date: forum.date, // Already formatted from API
    time: forum.time, // Already formatted from API
    duration: forum.duration,
    capacity: forum.capacity,
    location: forum.location,
    format: forum.format,
    topics: forum.topics,
    about: forum.about,
    about2: forum.about2,
    learningPoints: forum.learning_points, // Map from API field
    host: {
      name: 'Mrs. Ruth Matoya',
      title: 'Therapist & Life Coach',
      description: 'Licensed therapist and life coach specializing in family dynamics, self-reparenting, and healing generational patterns. With years of experience helping individuals and couples build healthier relationships.',
      contact: '+254 725 388 111',
      email: 'info@fami.space'
    },
    isRegistered: forum.isRegistered || false
  };
});

const registerForEvent = () => {
  // Redirect to signup page
  router.push('/signup');
};

</script>
