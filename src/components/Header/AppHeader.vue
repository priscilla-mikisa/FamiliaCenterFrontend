<template>
  <header class="bg-white shadow-sm fixed w-full top-0 z-50">
    <div class="mr-10 ml-12 mx-auto px-4 sm:px-6 lg:px-8">
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

        <!-- Desktop Navigation -->
        <nav class="hidden xl:flex space-x-8">
          <a href="#home" class="text-green-600 font-medium">Home</a>
          <a href="#features" class="text-gray-700 hover:text-green-600">Features</a>
          <a href="#programs" class="text-gray-700 hover:text-green-600">Programs</a>
          <a href="#about" class="text-gray-700 hover:text-green-600">About</a>
          <a href="#footer" class="text-gray-700 hover:text-green-600">Contact</a>
        </nav>

        <div class="hidden xl:flex space-x-4">
          <router-link to="/login">
            <button class="px-4 py-2 text-green-600 border border-green-600 rounded-lg hover:bg-green-50">
              Sign In
            </button>
          </router-link>
          <router-link to="/signup">
            <button class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
              Get Started
            </button>
          </router-link>

          <!-- Upcoming Forums Dropdown -->
          <div class="relative group">
            <button class="px-4 py-2 text-green-600 border border-green-600 rounded-lg hover:bg-green-50 flex items-center space-x-1">
              <span>Upcoming Forums</span>
              <ChevronDownIcon class="w-4 h-4" />
            </button>

            <!-- Dropdown Menu -->
            <div class="absolute top-full right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
              <div class="p-4">
                <h3 class="text-sm font-semibold text-gray-900 mb-3">Upcoming Events</h3>

                <!-- Loading State -->
                <div v-if="loading" class="text-center py-4">
                  <div class="text-sm text-gray-500">Loading events...</div>
                </div>

                <!-- Events -->
                <div v-if="forums.length > 0">
                  <div
                    v-for="(forum, index) in forums"
                    :key="forum.id"
                    class="mb-3 p-3 rounded-lg hover:bg-opacity-80 transition-colors cursor-pointer"
                    :class="index === 0 ? 'bg-green-50 hover:bg-green-100' : 'bg-blue-50 hover:bg-blue-100'"
                    @click="navigateToForum(forum.id)"
                  >
                    <div class="flex items-start space-x-3">
                      <div
                        class="w-2 h-2 rounded-full mt-2"
                        :class="index === 0 ? 'bg-green-500' : 'bg-blue-500'"
                      ></div>
                      <div class="flex-1">
                        <h4 class="text-sm font-medium text-gray-900">{{ forum.title }}</h4>
                        <p class="text-xs text-gray-600 mt-1">
                          {{ forum.date }} • {{ forum.time }}
                        </p>
                        <p class="text-xs text-gray-500 mt-1">{{ truncateDescription(forum.description) }}</p>
                      </div>
                    </div>
                  </div>
                  
                  <!-- Action Links -->
                  <div class="mt-4 pt-4 border-t border-gray-200 space-y-2">
                    <router-link
                      to="/forums/upcoming"
                      class="block w-full text-center px-4 py-2 text-sm text-green-600 hover:bg-green-50 rounded-lg transition-colors font-medium"
                      @click.stop
                    >
                      View All Upcoming
                    </router-link>
                    <router-link
                      to="/forums/past"
                      class="block w-full text-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors font-medium"
                      @click.stop
                    >
                      View Past Forums
                    </router-link>
                  </div>
                </div>

                <!-- No Events -->
                <div v-else-if="!loading && !error" class="text-center py-6">
                  <div class="mx-auto w-16 h-16 bg-gradient-to-br from-green-50 to-green-100 rounded-full flex items-center justify-center mb-4">
                    <CalendarIcon class="w-8 h-8 text-green-600" />
                  </div>
                  <h4 class="text-sm font-semibold text-gray-900 mb-2">No upcoming events</h4>
                  <p class="text-xs text-gray-500 mb-4">Check back later for new events or explore past forums</p>
                  <router-link
                    to="/forums/past"
                    class="inline-flex items-center justify-center w-full px-4 py-2.5 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors shadow-sm hover:shadow"
                    @click.stop
                  >
                    <CalendarIcon class="w-4 h-4 mr-2" />
                    View Past Forums
                  </router-link>
                </div>
                
                <!-- Error State (only show if there's an actual error) -->
                <div v-else-if="error && error !== 'Failed to fetch forums'" class="text-center py-4">
                  <div class="text-sm text-red-500">{{ error }}</div>
                </div>

              </div>
            </div>
          </div>
        </div>

        <!-- Mobile menu button -->
        <button
          class="xl:hidden"
          @click="isMenuOpen = !isMenuOpen"
        >
          <XIcon class="w-6 h-6" v-if="isMenuOpen" />
          <MenuIcon class="w-6 h-6" v-else />
        </button>
      </div>
    </div>

    <!-- Mobile Navigation -->
    <div v-if="isMenuOpen" class="xl:hidden bg-white border-t">
      <div class="px-4 py-2 space-y-2">
        <a href="#home" class="block py-2 text-green-600 font-medium">Home</a>
        <a href="#features" class="block py-2 text-gray-700">Features</a>
        <a href="#programs" class="block py-2 text-gray-700">Programs</a>
        <a href="#about" class="block py-2 text-gray-700">About</a>
        <a href="#footer" class="block py-2 text-gray-700">Contact</a>

        <!-- Mobile Forums Section -->
        <div class="pt-4 border-t border-gray-200">
          <h3 class="text-sm font-semibold text-gray-900 mb-3">Upcoming Forums</h3>

          <!-- Loading State -->
          <div v-if="loading" class="text-center py-4">
            <div class="text-sm text-gray-500">Loading events...</div>
          </div>

          <!-- Events -->
          <div v-if="forums.length > 0">
            <div
              v-for="(forum, index) in forums"
              :key="forum.id"
              class="mb-3 p-3 rounded-lg cursor-pointer"
              :class="index === 0 ? 'bg-green-50' : 'bg-blue-50'"
              @click="navigateToForum(forum.id)"
            >
              <div class="flex items-start space-x-3">
                <div
                  class="w-2 h-2 rounded-full mt-2"
                  :class="index === 0 ? 'bg-green-500' : 'bg-blue-500'"
                ></div>
                <div class="flex-1">
                  <h4 class="text-sm font-medium text-gray-900">{{ forum.title }}</h4>
                  <p class="text-xs text-gray-600 mt-1">
                    {{ forum.date }} • {{ forum.time }}
                  </p>
                  <p class="text-xs text-gray-500 mt-1">{{ truncateDescription(forum.description) }}</p>
                </div>
              </div>
            </div>
            
            <!-- Action Links -->
            <div class="mt-4 pt-4 border-t border-gray-200 space-y-2">
              <router-link
                to="/forums/upcoming"
                class="block w-full text-center px-4 py-2 text-sm text-green-600 hover:bg-green-50 rounded-lg transition-colors font-medium"
                @click.stop
              >
                View All Upcoming
              </router-link>
              <router-link
                to="/forums/past"
                class="block w-full text-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors font-medium"
                @click.stop
              >
                View Past Forums
              </router-link>
            </div>
          </div>

          <!-- No Events -->
          <div v-else-if="!loading && !error" class="text-center py-6">
            <div class="mx-auto w-16 h-16 bg-gradient-to-br from-green-50 to-green-100 rounded-full flex items-center justify-center mb-4">
              <CalendarIcon class="w-8 h-8 text-green-600" />
            </div>
            <h4 class="text-sm font-semibold text-gray-900 mb-2">No upcoming events</h4>
            <p class="text-xs text-gray-500 mb-4">Check back later for new events or explore past forums</p>
            <router-link
              to="/forums/past"
              class="inline-flex items-center justify-center w-full px-4 py-2.5 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors shadow-sm hover:shadow"
              @click.stop
            >
              <CalendarIcon class="w-4 h-4 mr-2" />
              View Past Forums
            </router-link>
          </div>
          
          <!-- Error State (only show if there's an actual error) -->
          <div v-else-if="error && error !== 'Failed to fetch forums'" class="text-center py-4">
            <div class="text-sm text-red-500">{{ error }}</div>
          </div>

        </div>

        <!-- Auth Buttons -->
        <div class="pt-4 space-y-2">
          <router-link to="/login" class="block w-full px-4 py-2 text-green-600 border border-green-600 rounded-lg text-center">
            Sign In
          </router-link>
          <router-link to="/signup" class="block w-full px-4 py-2 bg-green-600 text-white rounded-lg text-center">
            Get Started
          </router-link>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { ChevronDownIcon, MenuIcon, XIcon, CalendarIcon } from 'lucide-vue-next';
import { useForums } from '@/composables/useForums';


const isMenuOpen = ref(false);
const router = useRouter();
const { forums, loading, error, fetchLatestForums } = useForums();

onMounted(async () => {
  await fetchLatestForums(2);
});

const navigateToForum = (forumId: string) => {
  router.push(`/forums/${forumId}`);
  isMenuOpen.value = false; // Close mobile menu after navigation
};

const truncateDescription = (description: string, maxLength: number = 60) => {
  if (description.length <= maxLength) {
    return description;
  }
  return description.substring(0, maxLength) + '...';
};
</script>
