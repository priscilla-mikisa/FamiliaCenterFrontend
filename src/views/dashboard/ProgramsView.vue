<template>
  <div class="space-y-6">
    <div class="bg-white rounded-xl shadow">
      <div class="px-6 py-4 border-b">
        <h3 class="text-lg font-semibold text-gray-900">Available Programs</h3>
      </div>
      <div class="p-6">
        <div v-if="loading" class="space-y-6">
          <div v-for="n in 3" :key="n" class="border border-gray-200 rounded-lg p-4 animate-pulse">
            <div class="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div class="h-4 bg-gray-200 rounded w-full mb-2"></div>
            <div class="h-4 bg-gray-200 rounded w-5/6 mb-4"></div>
            <div class="h-8 bg-gray-200 rounded w-full"></div>
          </div>
        </div>

        <div v-else-if="error" class="text-red-500 text-center py-8">
          Error: {{ error }}
        </div>

        <div v-else-if="programs.length > 0" class="space-y-6">
          <div
            v-for="program in programs"
            :key="program.id"
            class="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
          >
            <div class="flex justify-between items-start">
              <div class="flex-1">
                <h4 class="font-medium text-gray-900">{{ program.title }}</h4>
                <p class="mt-1 text-sm text-gray-600">{{ program.description }}</p>
                <div class="mt-3 text-sm text-gray-600">
                  <span class="inline-flex items-center mr-4">
                    <AwardIcon class="w-4 h-4 mr-1" />
                    {{ program.total_weeks }} weeks
                  </span>
                  <span class="inline-flex items-center">
                    <BookOpenIcon class="w-4 h-4 mr-1" />
                    {{ program.resources_count }} resources
                  </span>
                </div>
              </div>
              <div class="ml-4">
                <span
                  v-if="program.is_enrolled"
                  class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800"
                >
                  Enrolled
                </span>
                <button
                  v-else
                  @click="handleEnroll(program.id)"
                  :disabled="enrolling === program.id"
                  class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm disabled:opacity-50"
                >
                  <span v-if="enrolling === program.id">Enrolling...</span>
                  <span v-else>Enroll</span>
                </button>
              </div>
            </div>

            <!-- Progress section for enrolled programs -->
            <div v-if="program.is_enrolled" class="mt-4">
              <div class="flex justify-between text-sm mb-1">
                <span>Progress</span>
                <span>Week {{ program.current_week }} of {{ program.total_weeks }}</span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-2">
                <div
                  class="bg-green-600 h-2 rounded-full transition-all duration-300"
                  :style="{ width: `${(program.current_week / program.total_weeks) * 100}%` }"
                ></div>
              </div>

              <div v-if="program.next_session" class="mt-3 text-sm text-gray-600">
                <span class="inline-flex items-center">
                  <ClockIcon class="w-4 h-4 mr-1" />
                  Next session: {{ formatDate(program.next_session) }}
                </span>
              </div>

              <div class="mt-4 flex space-x-2">
                <button class="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm">
                  Continue Program
                </button>
                <router-link
                  :to="`/dashboard/programs/${program.id}/resources`"
                  class="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm text-center"
                >
                  View Resources
                </router-link>
              </div>
            </div>
          </div>
        </div>

        <div v-else class="text-center py-8">
          <div class="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <BookOpenIcon class="w-8 h-8 text-gray-400" />
          </div>
          <p class="text-gray-600">No programs available at this time</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { AwardIcon, BookOpenIcon, ClockIcon } from 'lucide-vue-next';
import { usePrograms } from '@/composables/usePrograms';

const { programs, loading, error, fetchPrograms, enrollInProgram } = usePrograms();
const enrolling = ref<number | null>(null);

const handleEnroll = async (programId: number) => {
  if (confirm('Are you sure you want to enroll in this program?')) {
    enrolling.value = programId;
    try {
      await enrollInProgram(programId);
      // Success feedback could be added here
    } catch (err) {
      console.error('Enrollment failed:', err);
      alert('Enrollment failed. Please try again.');
    } finally {
      enrolling.value = null;
    }
  }
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

onMounted(() => {
  fetchPrograms();
});
</script>
