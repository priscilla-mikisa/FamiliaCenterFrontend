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
          <!-- Video Section - Show first if video is available -->
          <div v-if="eventData.has_video || eventData.video_url || eventData.video_preview_url" class="bg-white rounded-xl shadow-sm p-4 sm:p-6 lg:p-8">
            <h2 class="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">Watch Recording</h2>
            <div class="relative">
              <div class="w-full aspect-video bg-black rounded-lg overflow-hidden">
                <video
                  v-if="videoSource && !videoError"
                  ref="videoPlayer"
                  :src="videoSource"
                  controls
                  class="w-full h-full object-contain"
                  @timeupdate="handleTimeUpdate"
                  @loadedmetadata="handleVideoLoaded"
                  @loadstart="handleVideoLoadStart"
                  @canplay="handleVideoCanPlay"
                  @error="handleVideoError"
                  @stalled="handleVideoStalled"
                  @progress="handleVideoProgress"
                  preload="auto"
                  playsinline
                  webkit-playsinline
                  x5-playsinline
                  crossorigin="anonymous"
                >
                  Your browser does not support the video tag.
                </video>
                
                <!-- Video Loading State -->
                <div v-if="videoLoading && !videoError" class="w-full h-full bg-gray-200 flex items-center justify-center">
                  <div class="text-center">
                    <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
                    <p class="text-gray-500">Loading video...</p>
                  </div>
                </div>
                
                <!-- Video Error State -->
                <div v-if="videoError" class="w-full h-full bg-gray-200 flex items-center justify-center">
                  <div class="text-center p-6">
                    <svg class="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h3 class="text-lg font-semibold text-gray-900 mb-2">Video Error</h3>
                    <p class="text-sm text-gray-600 mb-4">{{ videoError }}</p>
                    <button
                      @click="retryVideoLoad"
                      class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                    >
                      Retry
                    </button>
                  </div>
                </div>
                
                <div v-if="!videoSource && !videoError" class="w-full h-full bg-gray-200 flex items-center justify-center">
                  <p class="text-gray-500">No video available</p>
                </div>
              </div>
              
              <!-- Preview Overlay for non-logged-in users -->
              <div
                v-if="!isLoggedIn && showPreviewOverlay"
                class="absolute inset-0 bg-black bg-opacity-75 flex items-center justify-center rounded-lg"
              >
                <div class="text-center text-white p-6 max-w-md">
                  <svg class="w-16 h-16 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd" />
                  </svg>
                  <h3 class="text-xl font-bold mb-2">Continue Watching</h3>
                  <p class="text-gray-300 mb-4">Sign in or create an account to watch the full recording</p>
                  <div class="flex flex-col sm:flex-row gap-3 justify-center">
                    <button
                      @click="goToLogin"
                      class="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                    >
                      Sign In
                    </button>
                    <button
                      @click="goToSignup"
                      class="px-6 py-2 bg-white text-gray-900 rounded-lg hover:bg-gray-100 transition-colors font-medium"
                    >
                      Create Account
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <p v-if="!isLoggedIn" class="text-sm text-gray-500 mt-2">
              Preview: Watch the first 20 seconds. Sign in to watch the full recording.
            </p>
          </div>

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
          <div v-if="eventData.host.name || eventData.host.title || eventData.host.bio" class="bg-white rounded-xl shadow-sm p-4 sm:p-6">
            <h3 class="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Host</h3>
            <div class="flex items-start space-x-4">
              <div class="flex-shrink-0">
                <div class="w-16 h-16 bg-gradient-to-br from-teal-400 to-teal-600 rounded-full flex items-center justify-center">
                  <span class="text-white font-bold text-lg">
                    {{ getHostInitials(eventData.host.name) }}
                  </span>
                </div>
              </div>
              <div class="flex-1 min-w-0">
                <h4 v-if="eventData.host.name" class="text-lg font-semibold text-gray-900">{{ eventData.host.name }}</h4>
                <p v-if="eventData.host.title" class="text-sm text-teal-600 font-medium">{{ eventData.host.title }}</p>
                <p v-if="eventData.host.bio" class="text-sm text-gray-600 mt-2">
                  {{ eventData.host.bio }}
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

const videoPlayer = ref<HTMLVideoElement | null>(null);
const showPreviewOverlay = ref(false);
const videoError = ref<string | null>(null);
const videoLoading = ref(true);
const PREVIEW_DURATION = 20; // 20 seconds preview

const isLoggedIn = computed(() => {
  return !!(localStorage.getItem('authToken') || sessionStorage.getItem('authToken'));
});

const videoSource = computed(() => {
  if (!currentForum.value) return '';
  
  const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';
  
  // Helper function to construct video URL
  const buildVideoUrl = (url: string | undefined): string => {
    if (!url) return '';
    
    // If URL is already a full URL (starts with http:// or https://), use it as is
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    
    // If URL already starts with /api/v1, use it directly with base domain
    if (url.startsWith('/api/v1')) {
      const baseDomain = baseURL.replace('/api/v1', '');
      return `${baseDomain}${url}`;
    }
    
    // If URL starts with /, append to base domain
    if (url.startsWith('/')) {
      const baseDomain = baseURL.replace('/api/v1', '');
      return `${baseDomain}${url}`;
    }
    
    // Otherwise, append to baseURL
    return `${baseURL}/${url}`;
  };
  
  // If logged in, use full video URL
  if (isLoggedIn.value && currentForum.value.video_url) {
    return buildVideoUrl(currentForum.value.video_url);
  }
  
  // If not logged in, use preview URL (20 seconds)
  if (currentForum.value.video_preview_url) {
    return buildVideoUrl(currentForum.value.video_preview_url);
  }
  
  // Fallback: if there's a video_url but no preview_url, use video_url (for logged out users, backend should handle preview)
  if (currentForum.value.video_url) {
    return buildVideoUrl(currentForum.value.video_url);
  }
  
  return '';
});

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
      isRegistered: false,
      has_video: false,
      video_url: '',
      video_preview_url: '',
      is_past: false
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
      name: forum.host_name || '',
      title: forum.host_title || '',
      bio: forum.host_bio || '',
      contact: '+254 725 388 111',
      email: 'info@fami.space'
    },
    isRegistered: forum.isRegistered || false,
    has_video: forum.has_video || false,
    video_url: forum.video_url,
    video_preview_url: forum.video_preview_url,
    is_past: forum.is_past || false
  };
});

const registerForEvent = () => {
  // Redirect to signup page
  router.push('/signup');
};

const getHostInitials = (name: string): string => {
  if (!name) return '';
  const parts = name.trim().split(' ');
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
};

const handleTimeUpdate = () => {
  if (!videoPlayer.value || isLoggedIn.value) return;
  
  // If user is not logged in and video has played for 20 seconds, show overlay
  if (videoPlayer.value.currentTime >= PREVIEW_DURATION) {
    videoPlayer.value.pause();
    showPreviewOverlay.value = true;
  }
};

const handleVideoLoadStart = () => {
  videoLoading.value = true;
  videoError.value = null;
};

const handleVideoCanPlay = () => {
  videoLoading.value = false;
  videoError.value = null;
};

const handleVideoLoaded = () => {
  videoLoading.value = false;
  if (!videoPlayer.value || isLoggedIn.value) return;
  
  // Set video to stop at 20 seconds for preview
  videoPlayer.value.addEventListener('timeupdate', () => {
    if (videoPlayer.value && videoPlayer.value.currentTime >= PREVIEW_DURATION) {
      videoPlayer.value.pause();
      showPreviewOverlay.value = true;
    }
  });
};

const handleVideoError = async (event: Event) => {
  videoLoading.value = false;
  const video = event.target as HTMLVideoElement;
  const error = video.error;
  
  if (error) {
    let errorMessage = 'Failed to load video';
    
    switch (error.code) {
      case error.MEDIA_ERR_ABORTED:
        errorMessage = 'Video loading was aborted';
        break;
      case error.MEDIA_ERR_NETWORK:
        errorMessage = 'Network error while loading video. Please check your connection and try again.';
        break;
      case error.MEDIA_ERR_DECODE:
        errorMessage = 'Video decoding error. The video file may be corrupted or in an unsupported format.';
        break;
      case error.MEDIA_ERR_SRC_NOT_SUPPORTED:
        errorMessage = 'Video format not supported by your browser. The server may not be sending the correct Content-Type header.';
        break;
      default:
        // ERR_CONTENT_LENGTH_MISMATCH often results in a network error
        // but the video might still be playable, so we'll try to continue
        if (error.code === error.MEDIA_ERR_NETWORK) {
          // Don't set error message for network errors, let it try to play
          return;
        }
        errorMessage = `Video error: ${error.message || 'Unknown error'}`;
    }
    
    videoError.value = errorMessage;
  } else {
    videoError.value = 'Failed to load video. Please check the video URL and try again.';
  }
};

const handleVideoProgress = () => {
  // Video is making progress - clear any loading state
  if (videoLoading.value) {
    videoLoading.value = false;
  }
};

const handleVideoStalled = () => {
  // Video stalled - might be network issue or Content-Length mismatch
  // Don't show error immediately, let it try to recover
};

const retryVideoLoad = () => {
  videoError.value = null;
  videoLoading.value = true;
  showPreviewOverlay.value = false;
  
  if (videoPlayer.value) {
    videoPlayer.value.load();
  }
};

const goToLogin = () => {
  router.push('/login');
};

const goToSignup = () => {
  router.push('/signup');
};

</script>
