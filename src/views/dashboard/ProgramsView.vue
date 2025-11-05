<template>
  <div class="space-y-6">
    <div class="bg-white rounded-xl shadow">
      <div class="px-6 py-4 border-b">
        <h3 class="text-lg font-semibold text-gray-900">Available Programs</h3>
      </div>
      <div class="p-6">
        <!-- Loading state -->
        <div v-if="loading" class="space-y-6">
          <div v-for="n in 3" :key="n" class="border border-gray-200 rounded-lg p-4 animate-pulse">
            <div class="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div class="h-4 bg-gray-200 rounded w-full mb-2"></div>
            <div class="h-4 bg-gray-200 rounded w-5/6 mb-4"></div>
            <div class="h-8 bg-gray-200 rounded w-full"></div>
          </div>
        </div>

        <!-- Error state -->
        <div v-else-if="error" class="text-red-500 text-center py-8">
          <p class="mb-4">Error: {{ error }}</p>
          <button
            @click="fetchPrograms"
            class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Retry
          </button>
        </div>

        <!-- Programs list -->
        <div v-else-if="programs.length > 0" class="space-y-6">
          <div
            v-for="program in programs"
            :key="program.id"
            class="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
          >
            <div class="flex justify-between items-start">
              <div class="flex-1">
                <h4 class="font-medium text-gray-900">{{ program.name }}</h4>
                <p class="mt-1 text-sm text-gray-600">{{ program.bio }}</p>

                <!-- Program details -->
                <div class="mt-3 space-y-2">
                  <div class="text-sm text-gray-600">
                    <span class="font-medium">Topic:</span> {{ program.topic }}
                  </div>
                  <div class="text-sm text-gray-600">
                    <span class="font-medium">Type:</span>
                    <span class="capitalize">{{ program.program_type }}</span>
                  </div>
                  <div class="text-sm text-gray-600">
                    <span class="font-medium">Duration:</span>
                    {{ formatDateRange(program.start_time, program.end_date) }}
                  </div>

                  <!-- Counsellors -->
                  <div v-if="program.counsellors && program.counsellors.length > 0" class="text-sm text-gray-600">
                    <span class="font-medium">Counsellors:</span>
                    <div class="mt-1 flex flex-wrap gap-2">
                      <span
                        v-for="counsellor in program.counsellors"
                        :key="counsellor.id"
                        class="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800"
                      >
                        {{ getCounsellorName(counsellor) }}
                      </span>
                    </div>
                  </div>

                  <!-- Sub-programs count -->
                  <div class="text-sm text-gray-600 flex items-center">
                    <BookOpenIcon class="w-4 h-4 mr-1" />
                    {{ program.sub_programs?.length || 0 }} sessions
                  </div>
                </div>
              </div>

              <!-- Action button -->
              <div class="ml-4">
                <span
                  v-if="!program.is_active"
                  class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-600"
                >
                  Inactive
                </span>
                <button
                  v-else
                  @click="viewProgramDetails(program)"
                  class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
                >
                  View Details
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty state -->
        <div v-else class="text-center py-8">
          <div class="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <BookOpenIcon class="w-8 h-8 text-gray-400" />
          </div>
          <p class="text-gray-600">No programs available at this time</p>
        </div>
      </div>
    </div>

    <!-- Program details modal -->
    <div
      v-if="selectedProgram"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
      @click.self="selectedProgram = null"
    >
      <div class="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div class="p-6 border-b sticky top-0 bg-white">
          <div class="flex items-center justify-between">
            <h3 class="text-xl font-semibold">{{ selectedProgram.name }}</h3>
            <button @click="selectedProgram = null" class="p-1 hover:bg-gray-100 rounded">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div class="p-6 space-y-6">
          <!-- Program overview -->
          <div>
            <h4 class="font-medium text-gray-900 mb-2">About This Program</h4>
            <p class="text-gray-700">{{ selectedProgram.bio }}</p>
          </div>

          <!-- Program info -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="bg-gray-50 rounded-lg p-4">
              <div class="text-sm text-gray-600">Topic</div>
              <div class="font-medium text-gray-900">{{ selectedProgram.topic }}</div>
            </div>
            <div class="bg-gray-50 rounded-lg p-4">
              <div class="text-sm text-gray-600">Type</div>
              <div class="font-medium text-gray-900 capitalize">{{ selectedProgram.program_type }}</div>
            </div>
            <div class="bg-gray-50 rounded-lg p-4">
              <div class="text-sm text-gray-600">Start Date</div>
              <div class="font-medium text-gray-900">{{ formatDate(selectedProgram.start_time) }}</div>
            </div>
            <div class="bg-gray-50 rounded-lg p-4">
              <div class="text-sm text-gray-600">End Date</div>
              <div class="font-medium text-gray-900">{{ formatDate(selectedProgram.end_date) }}</div>
            </div>
          </div>

          <!-- Counsellors -->
          <div v-if="selectedProgram.counsellors && selectedProgram.counsellors.length > 0">
            <h4 class="font-medium text-gray-900 mb-3">Program Counsellors</h4>
            <div class="space-y-3">
              <div
                v-for="counsellor in selectedProgram.counsellors"
                :key="counsellor.id"
                class="border border-gray-200 rounded-lg p-4"
              >
                <div class="flex items-start">
                  <div class="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-3">
                    <span class="text-green-700 font-medium">
                      {{ getInitials(counsellor) }}
                    </span>
                  </div>
                  <div>
                    <h5 class="font-medium text-gray-900">{{ getCounsellorName(counsellor) }}</h5>
                    <p class="text-sm text-gray-600">{{ counsellor.speciality }}</p>
                    <p v-if="counsellor.bio" class="text-sm text-gray-500 mt-1">{{ counsellor.bio }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Sub-programs / Sessions -->
          <div v-if="selectedProgram.sub_programs && selectedProgram.sub_programs.length > 0">
            <h4 class="font-medium text-gray-900 mb-3">Program Sessions</h4>
            <div class="space-y-3">
              <div
                v-for="(session, index) in selectedProgram.sub_programs"
                :key="session.id"
                class="border border-gray-200 rounded-lg p-4"
              >
                <div class="flex justify-between items-start">
                  <div class="flex-1">
                    <h5 class="font-medium text-gray-900">
                      Session {{ index + 1 }}: {{ session.name }}
                    </h5>
                    <p class="text-sm text-gray-600 mt-1">{{ session.bio }}</p>
                    <div class="mt-2 flex items-center text-sm text-gray-500">
                      <ClockIcon class="w-4 h-4 mr-1" />
                      {{ session.duration }} minutes
                    </div>
                  </div>
                  <a
                    v-if="session.meeting_link"
                    :href="session.meeting_link"
                    target="_blank"
                    class="ml-4 px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm whitespace-nowrap"
                  >
                    Join Meeting
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="p-6 border-t bg-gray-50">
          <div class="flex justify-end">
            <button
              @click="selectedProgram = null"
              class="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { BookOpenIcon, ClockIcon } from 'lucide-vue-next';
import { ProgramService, type ProgramResponse } from '@/services/apiService';

const programs = ref<ProgramResponse[]>([]);
const loading = ref(true);
const error = ref<string | null>(null);
const selectedProgram = ref<ProgramResponse | null>(null);

const fetchPrograms = async () => {
  try {
    loading.value = true;
    error.value = null;
    const response = await ProgramService.getUserPrograms();

    // Handle different response structures
    if (response.data) {
      programs.value = response.data;
    } else if (Array.isArray(response)) {
      programs.value = response;
    } else {
      programs.value = [];
    }
  } catch (err: any) {
    console.error('Error fetching programs:', err);
    error.value = err.message || 'Failed to load programs';
  } finally {
    loading.value = false;
  }
};

const viewProgramDetails = (program: ProgramResponse) => {
  selectedProgram.value = program;
};

const getCounsellorName = (counsellor: any) => {
  const parts = [];
  if (counsellor.salutation) parts.push(counsellor.salutation);
  if (counsellor.first_name) parts.push(counsellor.first_name);
  if (counsellor.last_name) parts.push(counsellor.last_name);
  return parts.length > 0 ? parts.join(' ') : 'Unknown Counsellor';
};

const getInitials = (counsellor: any) => {
  const first = counsellor.first_name?.charAt(0) || '';
  const last = counsellor.last_name?.charAt(0) || '';
  return (first + last).toUpperCase() || '??';
};

const formatDate = (dateString: string) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

const formatDateRange = (startDate: string, endDate: string) => {
  if (!startDate || !endDate) return 'N/A';
  const start = new Date(startDate);
  const end = new Date(endDate);
  const weeks = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 7));
  return `${weeks} weeks (${formatDate(startDate)} - ${formatDate(endDate)})`;
};

onMounted(() => {
  fetchPrograms();
});
</script>
