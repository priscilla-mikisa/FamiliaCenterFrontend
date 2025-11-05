<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="bg-white rounded-xl shadow p-6">
      <div class="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
        <h2 class="text-xl font-semibold text-gray-900">Program Management</h2>
        <button
          @click="showCreateProgram = true"
          class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
        >
          <PlusIcon class="w-4 h-4 mr-2" />
          Create Program
        </button>
      </div>
    </div>

    <!-- Loading state -->
    <div v-if="loading" class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div v-for="n in 4" :key="n" class="bg-white rounded-xl shadow p-6 animate-pulse">
        <div class="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
        <div class="h-4 bg-gray-200 rounded w-full mb-2"></div>
        <div class="h-4 bg-gray-200 rounded w-5/6"></div>
      </div>
    </div>

    <!-- Error state -->
    <div v-else-if="error" class="bg-white rounded-xl shadow p-6">
      <div class="text-red-500 text-center py-8">
        <p class="mb-4">Error: {{ error }}</p>
        <button
          @click="fetchPrograms"
          class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
    </div>

    <!-- Programs grid -->
    <div v-else-if="programs.length > 0" class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div
        v-for="program in programs"
        :key="program.id"
        class="bg-white rounded-xl shadow hover:shadow-lg transition-shadow"
      >
        <div class="p-6">
          <div class="flex items-start justify-between mb-4">
            <div>
              <h3 class="text-lg font-semibold text-gray-900">{{ program.name }}</h3>
              <p class="text-sm text-gray-600 mt-1">{{ program.bio }}</p>
            </div>
            <span
              :class="`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                program.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
              }`"
            >
              {{ program.is_active ? 'Active' : 'Inactive' }}
            </span>
          </div>

          <div class="grid grid-cols-2 gap-4 mb-4 text-sm">
            <div>
              <span class="text-gray-500">Topic:</span>
              <span class="font-medium ml-1">{{ program.topic }}</span>
            </div>
            <div>
              <span class="text-gray-500">Type:</span>
              <span class="font-medium ml-1 capitalize">{{ program.program_type }}</span>
            </div>
            <div>
              <span class="text-gray-500">Sessions:</span>
              <span class="font-medium ml-1">{{ program.sub_programs?.length || 0 }} total</span>
            </div>
            <div>
              <span class="text-gray-500">Counsellors:</span>
              <span class="font-medium ml-1">{{ program.counsellor_ids?.length || 0 }}</span>
            </div>
          </div>

          <!-- Date range -->
          <div class="mb-4 text-sm text-gray-600">
            <div class="flex items-center">
              <CalendarIcon class="w-4 h-4 mr-1" />
              <span>{{ formatDate(program.start_time) }} - {{ formatDate(program.end_date) }}</span>
            </div>
          </div>

          <div class="flex space-x-2">
            <button
              @click="viewProgram(program)"
              class="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
            >
              Manage
            </button>
            <button
              @click="editProgram(program)"
              class="flex-1 px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm"
            >
              Edit
            </button>
            <button
              @click="confirmDelete(program)"
              class="px-3 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50"
            >
              <TrashIcon class="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty state -->
    <div v-else class="bg-white rounded-xl shadow p-6">
      <div class="text-center py-8">
        <div class="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <BookOpenIcon class="w-8 h-8 text-gray-400" />
        </div>
        <p class="text-gray-600 mb-4">No programs created yet</p>
        <button
          @click="showCreateProgram = true"
          class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Create Your First Program
        </button>
      </div>
    </div>

    <!-- Create/Edit Program Modal -->
    <div
      v-if="showCreateProgram || editingProgram"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
      @click.self="closeModal"
    >
      <div class="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div class="p-6 border-b">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold">
              {{ editingProgram ? 'Edit Program' : 'Create New Program' }}
            </h3>
            <button @click="closeModal" class="p-1 hover:bg-gray-100 rounded">
              <XIcon class="w-5 h-5" />
            </button>
          </div>
        </div>

        <form @submit.prevent="saveProgram" class="p-6 space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Program Name</label>
            <input
              v-model="programForm.name"
              type="text"
              required
              class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Topic</label>
            <input
              v-model="programForm.topic"
              type="text"
              required
              class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              v-model="programForm.bio"
              rows="3"
              required
              class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
            ></textarea>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
              <input
                v-model="programForm.start_date"
                type="date"
                required
                class="w-full border border-gray-300 rounded-lg px-3 py-2"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">End Date</label>
              <input
                v-model="programForm.end_date"
                type="date"
                required
                class="w-full border border-gray-300 rounded-lg px-3 py-2"
              />
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Program Type</label>
            <select
              v-model="programForm.program_type"
              required
              class="w-full border border-gray-300 rounded-lg px-3 py-2"
            >
              <option value="individual">Individual</option>
              <option value="group">Group</option>
              <option value="workshop">Workshop</option>
              <option value="course">Course</option>
            </select>
          </div>

          <div v-if="editingProgram">
            <label class="flex items-center">
              <input
                v-model="programForm.is_active"
                type="checkbox"
                class="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-2"
              />
              <span class="text-sm font-medium text-gray-700">Active</span>
            </label>
          </div>

          <div class="flex space-x-3 pt-4">
            <button
              type="button"
              @click="closeModal"
              class="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              :disabled="saving"
              class="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {{ saving ? 'Saving...' : (editingProgram ? 'Update Program' : 'Create Program') }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Program Details Modal -->
    <div
      v-if="selectedProgram"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
      @click.self="selectedProgram = null"
    >
      <div class="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div class="p-6 border-b">
          <div class="flex items-center justify-between">
            <h3 class="text-xl font-semibold">{{ selectedProgram.name }}</h3>
            <button @click="selectedProgram = null" class="p-1 hover:bg-gray-100 rounded">
              <XIcon class="w-6 h-6" />
            </button>
          </div>
        </div>

        <div class="p-6">
          <div class="border-b border-gray-200 mb-6">
            <nav class="-mb-px flex space-x-8">
              <button
                v-for="tab in ['overview', 'sessions']"
                :key="tab"
                @click="activeTab = tab"
                :class="`py-2 px-1 border-b-2 font-medium text-sm capitalize ${
                  activeTab === tab
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`"
              >
                {{ tab }}
              </button>
            </nav>
          </div>

          <!-- Overview Tab -->
          <div v-if="activeTab === 'overview'" class="space-y-6">
            <div>
              <h4 class="font-medium text-gray-900 mb-2">Description</h4>
              <p class="text-gray-700">{{ selectedProgram.bio }}</p>
            </div>

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
          </div>

          <!-- Sessions Tab -->
          <div v-if="activeTab === 'sessions'" class="space-y-4">
            <div class="flex justify-between items-center">
              <h4 class="font-medium text-gray-900">Program Sessions</h4>
              <button
                @click="showAddSession = true"
                class="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
              >
                Add Session
              </button>
            </div>

            <div v-if="selectedProgram.sub_programs && selectedProgram.sub_programs.length > 0" class="space-y-3">
              <div
                v-for="(session, index) in selectedProgram.sub_programs"
                :key="session.id"
                class="border border-gray-200 rounded-lg p-4"
              >
                <div class="flex justify-between items-start">
                  <div class="flex-1">
                    <h5 class="font-medium text-gray-900">Session {{ index + 1 }}: {{ session.name }}</h5>
                    <p class="text-sm text-gray-600 mt-1">{{ session.bio }}</p>
                    <div class="flex items-center mt-2 text-sm text-gray-500">
                      <ClockIcon class="w-4 h-4 mr-1" />
                      {{ session.duration }} minutes
                    </div>
                    <div v-if="session.meeting_link" class="mt-2">
                      <a
                        :href="session.meeting_link"
                        target="_blank"
                        class="text-sm text-blue-600 hover:underline"
                      >
                        Meeting Link
                      </a>
                    </div>
                  </div>
                  <button
                    @click="deleteSubProgram(session.id)"
                    class="ml-4 p-2 text-red-600 hover:bg-red-50 rounded"
                  >
                    <TrashIcon class="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
            <div v-else class="text-center py-8 text-gray-500">
              No sessions added yet
            </div>
          </div>
        </div>

        <div class="p-6 border-t bg-gray-50">
          <div class="flex justify-end space-x-3">
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

    <!-- Add Session Modal -->
    <div
      v-if="showAddSession && selectedProgram"
      class="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black bg-opacity-50"
      @click.self="showAddSession = false"
    >
      <div class="bg-white rounded-xl max-w-lg w-full">
        <div class="p-6 border-b">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold">Add Session</h3>
            <button @click="showAddSession = false" class="p-1 hover:bg-gray-100 rounded">
              <XIcon class="w-5 h-5" />
            </button>
          </div>
        </div>

        <form @submit.prevent="saveSession" class="p-6 space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Session Name</label>
            <input
              v-model="sessionForm.name"
              type="text"
              required
              class="w-full border border-gray-300 rounded-lg px-3 py-2"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              v-model="sessionForm.bio"
              rows="3"
              required
              class="w-full border border-gray-300 rounded-lg px-3 py-2"
            ></textarea>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Duration (minutes)</label>
            <input
              v-model.number="sessionForm.duration"
              type="number"
              min="15"
              max="240"
              required
              class="w-full border border-gray-300 rounded-lg px-3 py-2"
            />
          </div>

          <div class="flex space-x-3 pt-4">
            <button
              type="button"
              @click="showAddSession = false"
              class="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              :disabled="saving"
              class="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {{ saving ? 'Adding...' : 'Add Session' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import {
  PlusIcon,
  XIcon,
  CalendarIcon,
  BookOpenIcon,
  ClockIcon,
  TrashIcon
} from 'lucide-vue-next';
import { ProgramService, type ProgramResponse, type CreateProgramRequest, type UpdateProgramRequest } from '@/services/apiService';

const programs = ref<ProgramResponse[]>([]);
const loading = ref(true);
const error = ref<string | null>(null);
const saving = ref(false);

const showCreateProgram = ref(false);
const editingProgram = ref<ProgramResponse | null>(null);
const selectedProgram = ref<ProgramResponse | null>(null);
const showAddSession = ref(false);
const activeTab = ref('overview');

const programForm = ref({
  name: '',
  topic: '',
  bio: '',
  start_date: '',
  end_date: '',
  program_type: 'group',
  is_active: true
});

const sessionForm = ref({
  name: '',
  bio: '',
  duration: 60
});

const fetchPrograms = async () => {
  try {
    loading.value = true;
    error.value = null;
    const response = await ProgramService.getCounsellorPrograms();
    programs.value = response.data || [];
  } catch (err: any) {
    console.error('Error fetching programs:', err);
    error.value = err.message || 'Failed to load programs';
  } finally {
    loading.value = false;
  }
};

const viewProgram = async (program: ProgramResponse) => {
  try {
    // Fetch full program details with sub-programs
    const response = await ProgramService.getCounsellorProgram(program.id);
    selectedProgram.value = response.data || program;
    activeTab.value = 'overview';
  } catch (err) {
    console.error('Error fetching program details:', err);
    selectedProgram.value = program;
  }
};

const editProgram = (program: ProgramResponse) => {
  editingProgram.value = program;
  programForm.value = {
    name: program.name,
    topic: program.topic,
    bio: program.bio,
    start_date: program.start_time.split('T')[0],
    end_date: program.end_date.split('T')[0],
    program_type: program.program_type,
    is_active: program.is_active
  };
};

const closeModal = () => {
  showCreateProgram.value = false;
  editingProgram.value = null;
  programForm.value = {
    name: '',
    topic: '',
    bio: '',
    start_date: '',
    end_date: '',
    program_type: 'group',
    is_active: true
  };
};

const saveProgram = async () => {
  try {
    saving.value = true;

    const data: CreateProgramRequest | UpdateProgramRequest = {
      name: programForm.value.name,
      topic: programForm.value.topic,
      bio: programForm.value.bio,
      start_time: new Date(programForm.value.start_date).toISOString(),
      end_date: new Date(programForm.value.end_date).toISOString(),
      program_type: programForm.value.program_type
    };

    if (editingProgram.value) {
      // Update existing program
      await ProgramService.updateProgram(editingProgram.value.id, {
        ...data,
        is_active: programForm.value.is_active
      });
    } else {
      // Create new program
      await ProgramService.createProgram(data as CreateProgramRequest);
    }

    await fetchPrograms();
    closeModal();
  } catch (err: any) {
    console.error('Error saving program:', err);
    alert(err.message || 'Failed to save program');
  } finally {
    saving.value = false;
  }
};

const confirmDelete = async (program: ProgramResponse) => {
  if (confirm(`Are you sure you want to delete "${program.name}"?`)) {
    try {
      await ProgramService.deleteProgram(program.id);
      await fetchPrograms();
    } catch (err: any) {
      console.error('Error deleting program:', err);
      alert(err.message || 'Failed to delete program');
    }
  }
};

const saveSession = async () => {
  if (!selectedProgram.value) return;

  try {
    saving.value = true;
    await ProgramService.createSubProgram({
      program_id: selectedProgram.value.id,
      name: sessionForm.value.name,
      bio: sessionForm.value.bio,
      duration: sessionForm.value.duration
    });

    // Refresh program details
    const response = await ProgramService.getCounsellorProgram(selectedProgram.value.id);
    selectedProgram.value = response.data;

    showAddSession.value = false;
    sessionForm.value = { name: '', bio: '', duration: 60 };
  } catch (err: any) {
    console.error('Error creating session:', err);
    alert(err.message || 'Failed to create session');
  } finally {
    saving.value = false;
  }
};

const deleteSubProgram = async (subProgramId: string) => {
  if (!confirm('Are you sure you want to delete this session?')) return;

  try {
    await ProgramService.deleteSubProgram(subProgramId);

    // Refresh program details
    if (selectedProgram.value) {
      const response = await ProgramService.getCounsellorProgram(selectedProgram.value.id);
      selectedProgram.value = response.data;
    }
  } catch (err: any) {
    console.error('Error deleting session:', err);
    alert(err.message || 'Failed to delete session');
  }
};

const formatDate = (dateString: string) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

onMounted(() => {
  fetchPrograms();
});
</script>
