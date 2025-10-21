<template>
  <div class="space-y-6">
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

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div
        v-for="program in programs"
        :key="program.id"
        class="bg-white rounded-xl shadow hover:shadow-lg transition-shadow"
      >
        <div class="p-6">
          <div class="flex items-start justify-between mb-4">
            <div>
              <h3 class="text-lg font-semibold text-gray-900">{{ program.title }}</h3>
              <p class="text-sm text-gray-600 mt-1">{{ program.description }}</p>
            </div>
            <span :class="`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getProgramStatusClass(program.status)}`">
              {{ program.status }}
            </span>
          </div>

          <div class="grid grid-cols-2 gap-4 mb-4 text-sm">
            <div>
              <span class="text-gray-500">Duration:</span>
              <span class="font-medium ml-1">{{ program.weeks }} weeks</span>
            </div>
            <div>
              <span class="text-gray-500">Participants:</span>
              <span class="font-medium ml-1">{{ program.enrolled }}/{{ program.capacity }}</span>
            </div>
            <div>
              <span class="text-gray-500">Sessions:</span>
              <span class="font-medium ml-1">{{ program.sessions }} total</span>
            </div>
            <div>
              <span class="text-gray-500">Resources:</span>
              <span class="font-medium ml-1">{{ program.resources }} files</span>
            </div>
          </div>

          <div class="mb-4">
            <div class="flex justify-between text-sm text-gray-600 mb-1">
              <span>Program Progress</span>
              <span>{{ program.progress }}%</span>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-2">
              <div
                class="bg-blue-600 h-2 rounded-full transition-all duration-300"
                :style="{ width: `${program.progress}%` }"
              ></div>
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
              @click="viewParticipants(program)"
              class="flex-1 px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm"
            >
              Participants
            </button>
            <button class="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              <MoreVerticalIcon class="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="selectedProgram" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div class="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div class="p-6 border-b">
          <div class="flex items-center justify-between">
            <h3 class="text-xl font-semibold">{{ selectedProgram.title }}</h3>
            <button @click="selectedProgram = null" class="p-1 hover:bg-gray-100 rounded">
              <XIcon class="w-6 h-6" />
            </button>
          </div>
        </div>

        <div class="p-6">
          <div class="border-b border-gray-200 mb-6">
            <nav class="-mb-px flex space-x-8">
              <button
                v-for="tab in programTabs"
                :key="tab.id"
                @click="activeTab = tab.id"
                :class="`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`"
              >
                {{ tab.label }}
              </button>
            </nav>
          </div>

          <div v-if="activeTab === 'overview'" class="space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div class="bg-gray-50 rounded-lg p-4">
                <div class="text-2xl font-bold text-blue-600">{{ selectedProgram.enrolled }}</div>
                <div class="text-sm text-gray-600">Enrolled Participants</div>
              </div>
              <div class="bg-gray-50 rounded-lg p-4">
                <div class="text-2xl font-bold text-green-600">{{ selectedProgram.completed }}</div>
                <div class="text-sm text-gray-600">Completed Sessions</div>
              </div>
              <div class="bg-gray-50 rounded-lg p-4">
                <div class="text-2xl font-bold text-purple-600">{{ selectedProgram.avgProgress }}%</div>
                <div class="text-sm text-gray-600">Average Progress</div>
              </div>
            </div>

            <div>
              <h4 class="font-medium text-gray-900 mb-3">Program Description</h4>
              <p class="text-gray-700">{{ selectedProgram.fullDescription }}</p>
            </div>

            <div>
              <h4 class="font-medium text-gray-900 mb-3">Learning Objectives</h4>
              <ul class="space-y-2">
                <li v-for="objective in selectedProgram.objectives" :key="objective" class="flex items-start">
                  <CheckIcon class="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span class="text-gray-700">{{ objective }}</span>
                </li>
              </ul>
            </div>
          </div>

          <div v-if="activeTab === 'sessions'" class="space-y-4">
            <div class="flex justify-between items-center">
              <h4 class="font-medium text-gray-900">Session Schedule</h4>
              <button class="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">
                Add Session
              </button>
            </div>
            <div class="space-y-3">
              <div
                v-for="session in selectedProgram.programSessions"
                :key="session.id"
                class="border border-gray-200 rounded-lg p-4"
              >
                <div class="flex justify-between items-start">
                  <div>
                    <h5 class="font-medium text-gray-900">Week {{ session.week }}: {{ session.title }}</h5>
                    <p class="text-sm text-gray-600 mt-1">{{ session.description }}</p>
                    <div class="flex items-center mt-2 text-sm text-gray-500">
                      <CalendarIcon class="w-4 h-4 mr-1" />
                      {{ session.date }} at {{ session.time }}
                    </div>
                  </div>
                  <span :class="`text-xs px-2 py-1 rounded ${getSessionStatusClass(session.status)}`">
                    {{ session.status }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div v-if="activeTab === 'resources'" class="space-y-4">
            <div class="flex justify-between items-center">
              <h4 class="font-medium text-gray-900">Program Resources</h4>
              <button class="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">
                Upload Resource
              </button>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div
                v-for="resource in selectedProgram.programResources"
                :key="resource.id"
                class="border border-gray-200 rounded-lg p-4 hover:bg-gray-50"
              >
                <div class="flex items-start">
                  <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                    <FileTextIcon class="w-5 h-5 text-blue-600" />
                  </div>
                  <div class="flex-1">
                    <h5 class="font-medium text-gray-900">{{ resource.title }}</h5>
                    <p class="text-sm text-gray-600">{{ resource.type }} • {{ resource.size }}</p>
                    <div class="flex space-x-2 mt-2">
                      <button class="text-xs text-blue-600 hover:underline">Download</button>
                      <button class="text-xs text-gray-500 hover:underline">Edit</button>
                    </div>
                  </div>
                </div>
              </div>
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
            <button class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="showCreateProgram" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div class="bg-white rounded-xl max-w-2xl w-full">
        <div class="p-6 border-b">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold">Create New Program</h3>
            <button @click="showCreateProgram = false" class="p-1 hover:bg-gray-100 rounded">
              <XIcon class="w-5 h-5" />
            </button>
          </div>
        </div>

        <form @submit.prevent="createProgram" class="p-6 space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Program Title</label>
            <input
              v-model="newProgram.title"
              type="text"
              required
              class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              v-model="newProgram.description"
              rows="3"
              class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
            ></textarea>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Duration (weeks)</label>
              <input
                v-model="newProgram.weeks"
                type="number"
                min="1"
                max="52"
                required
                class="w-full border border-gray-300 rounded-lg px-3 py-2"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Capacity</label>
              <input
                v-model="newProgram.capacity"
                type="number"
                min="1"
                required
                class="w-full border border-gray-300 rounded-lg px-3 py-2"
              />
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select
              v-model="newProgram.category"
              class="w-full border border-gray-300 rounded-lg px-3 py-2"
            >
              <option value="marriage">Marriage Counseling</option>
              <option value="family">Family Therapy</option>
              <option value="parenting">Parenting</option>
              <option value="addiction">Addiction Recovery</option>
              <option value="stress">Stress Management</option>
            </select>
          </div>

          <div class="flex space-x-3 pt-4">
            <button
              type="button"
              @click="showCreateProgram = false"
              class="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Create Program
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import {
  PlusIcon,
  MoreVerticalIcon,
  XIcon,
  CheckIcon,
  CalendarIcon,
  FileTextIcon
} from 'lucide-vue-next';

const showCreateProgram = ref(false);
const selectedProgram = ref<Program | null>(null);
const activeTab = ref('overview');

const newProgram = ref({
  title: '',
  description: '',
  weeks: 6,
  capacity: 20,
  category: 'marriage'
});

const programTabs = [
  { id: 'overview', label: 'Overview' },
  { id: 'sessions', label: 'Sessions' },
  { id: 'resources', label: 'Resources' }
];

const programs = ref([
  {
    id: 1,
    title: 'Marriage Restoration Program',
    description: '6-week intensive program for couples seeking to rebuild their relationship',
    weeks: 6,
    enrolled: 12,
    capacity: 15,
    sessions: 6,
    resources: 24,
    progress: 67,
    status: 'active',
    completed: 4,
    avgProgress: 72,
    fullDescription: 'A comprehensive 6-week program designed to help couples rebuild trust, improve communication, and strengthen their relationship foundation through evidence-based therapeutic techniques.',
    objectives: [
      'Develop effective communication skills',
      'Learn conflict resolution strategies',
      'Rebuild trust and intimacy',
      'Create healthy relationship boundaries',
      'Establish long-term relationship goals'
    ],
    programSessions: [
      { id: 1, week: 1, title: 'Foundation Building', description: 'Understanding relationship dynamics', date: '2024-01-15', time: '18:00', status: 'completed' },
      { id: 2, week: 2, title: 'Communication Skills', description: 'Active listening and expression', date: '2024-01-22', time: '18:00', status: 'completed' },
      { id: 3, week: 3, title: 'Conflict Resolution', description: 'Managing disagreements constructively', date: '2024-01-29', time: '18:00', status: 'scheduled' }
    ],
    programResources: [
      { id: 1, title: 'Communication Workbook', type: 'PDF', size: '2.4 MB' },
      { id: 2, title: 'Conflict Resolution Guide', type: 'PDF', size: '1.8 MB' },
      { id: 3, title: 'Daily Exercises Audio', type: 'MP3', size: '45.2 MB' }
    ]
  },
  {
    id: 2,
    title: 'Parenting Program',
    description: '4-week program for effective parenting strategies',
    weeks: 4,
    enrolled: 8,
    capacity: 12,
    sessions: 4,
    resources: 16,
    progress: 25,
    status: 'active',
    completed: 1,
    avgProgress: 31,
    fullDescription: 'Learn evidence-based parenting techniques to build stronger relationships with your children.',
    objectives: [
      'Understand child development stages',
      'Learn positive discipline techniques',
      'Improve parent-child communication'
    ],
    programSessions: [],
    programResources: []
  }
]);

const getProgramStatusClass = (status: string) => {
  const classes = {
    active: 'bg-green-100 text-green-800',
    draft: 'bg-yellow-100 text-yellow-800',
    completed: 'bg-blue-100 text-blue-800',
    archived: 'bg-gray-100 text-gray-800'
  };
  return classes[status as keyof typeof classes] || classes.draft;
};

const getSessionStatusClass = (status: string) => {
  const classes = {
    completed: 'bg-green-100 text-green-800',
    scheduled: 'bg-blue-100 text-blue-800',
    cancelled: 'bg-red-100 text-red-800'
  };
  return classes[status as keyof typeof classes] || classes.scheduled;
};

interface Program {
  id: number;
  title: string;
  description: string;
  weeks: number;
  enrolled: number;
  capacity: number;
  sessions: number;
  resources: number;
  progress: number;
  status: string;
  completed: number;
  avgProgress: number;
  fullDescription: string;
  objectives: string[];
  programSessions: Array<{
    id: number;
    week: number;
    title: string;
    description: string;
    date: string;
    time: string;
    status: string;
  }>;
  programResources: Array<{
    id: number;
    title: string;
    type: string;
    size: string;
  }>;
}

const viewProgram = (program: Program) => {
  selectedProgram.value = program;
  activeTab.value = 'overview';
};

const viewParticipants = (program: Program) => {
  console.log('Viewing participants for:', program.title);
};

const createProgram = () => {
  console.log('Creating program:', newProgram.value);
  showCreateProgram.value = false;
  newProgram.value = {
    title: '',
    description: '',
    weeks: 6,
    capacity: 20,
    category: 'marriage'
  };
};
</script>
