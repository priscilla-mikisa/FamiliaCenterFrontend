<template>
  <div class="space-y-6">
    <!-- Header with Search and Filters -->
    <div class="bg-white rounded-xl shadow p-6">
      <div class="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
        <h2 class="text-xl font-semibold text-gray-900">My Clients</h2>
        <div class="flex space-x-4">
          <div class="relative">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search clients..."
              class="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <SearchIcon class="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
          </div>
          <select
            v-model="filterStatus"
            class="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="completed">Completed</option>
          </select>
          <button class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center">
            <UserPlusIcon class="w-4 h-4 mr-2" />
            Add Client
          </button>
        </div>
      </div>
    </div>

    <!-- Clients Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="client in filteredClients"
        :key="client.id"
        class="bg-white rounded-xl shadow hover:shadow-lg transition-shadow"
      >
        <div class="p-6">
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center space-x-3">
              <div class="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <UserIcon class="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 class="font-medium text-gray-900">{{ client.name }}</h3>
                <p class="text-sm text-gray-500">{{ client.type }}</p>
              </div>
            </div>
            <span :class="`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusClass(client.status)}`">
              {{ client.status }}
            </span>
          </div>

          <div class="space-y-2 mb-4">
            <div class="flex justify-between text-sm">
              <span class="text-gray-500">Program:</span>
              <span class="font-medium">{{ client.program || 'Individual Sessions' }}</span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-gray-500">Sessions:</span>
              <span class="font-medium">{{ client.sessionsCompleted }}/{{ client.totalSessions }}</span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-gray-500">Next Session:</span>
              <span class="font-medium">{{ client.nextSession || 'Not scheduled' }}</span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-gray-500">Progress:</span>
              <span class="font-medium">{{ client.progress }}%</span>
            </div>
          </div>

          <!-- Progress Bar -->
          <div class="w-full bg-gray-200 rounded-full h-2 mb-4">
            <div
              class="bg-blue-600 h-2 rounded-full transition-all duration-300"
              :style="{ width: `${client.progress}%` }"
            ></div>
          </div>

          <!-- Actions -->
          <div class="flex space-x-2">
            <button class="flex-1 px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              View Details
            </button>
            <button class="flex-1 px-3 py-2 text-sm border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
              Schedule
            </button>
            <button class="px-3 py-2 text-sm border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
              <MessageCircleIcon class="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Client Details Modal -->
    <div v-if="selectedClient" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div class="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div class="p-6 border-b">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold">{{ selectedClient.name }} - Client Details</h3>
            <button @click="selectedClient = null" class="p-1 hover:bg-gray-100 rounded">
              <XIcon class="w-5 h-5" />
            </button>
          </div>
        </div>

        <div class="p-6 space-y-6">
          <!-- Client Info -->
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-500">Email</label>
              <p class="mt-1 text-sm text-gray-900">{{ selectedClient.email }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-500">Phone</label>
              <p class="mt-1 text-sm text-gray-900">{{ selectedClient.phone || 'Not provided' }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-500">Start Date</label>
              <p class="mt-1 text-sm text-gray-900">{{ selectedClient.startDate }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-500">Last Session</label>
              <p class="mt-1 text-sm text-gray-900">{{ selectedClient.lastSession || 'Never' }}</p>
            </div>
          </div>

          <!-- Session History -->
          <div>
            <h4 class="font-medium text-gray-900 mb-3">Session History</h4>
            <div class="space-y-2">
              <div v-for="session in selectedClient.sessions" :key="session.id" class="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
                <div>
                  <p class="text-sm font-medium">{{ session.date }}</p>
                  <p class="text-xs text-gray-500">{{ session.type }}</p>
                </div>
                <span :class="`text-xs px-2 py-1 rounded ${session.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`">
                  {{ session.status }}
                </span>
              </div>
            </div>
          </div>

          <!-- Notes -->
          <div>
            <h4 class="font-medium text-gray-900 mb-3">Notes</h4>
            <textarea
              v-model="selectedClient.notes"
              rows="4"
              class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Add notes about this client..."
            ></textarea>
          </div>
        </div>

        <div class="p-6 border-t bg-gray-50">
          <div class="flex justify-end space-x-3">
            <button @click="selectedClient = null" class="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100">
              Close
            </button>
            <button class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              Save Notes
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import {
  SearchIcon,
  UserPlusIcon,
  UserIcon,
  MessageCircleIcon,
  XIcon
} from 'lucide-vue-next';

const searchQuery = ref('');
const filterStatus = ref('');
// Define the Client type
type Client = {
  id: number;
  name: string;
  type: string;
  email: string;
  phone: string | null;
  status: string;
  program: string | null;
  sessionsCompleted: number;
  totalSessions: number;
  progress: number;
  nextSession: string | null;
  startDate: string;
  lastSession: string | null;
  sessions: Array<{
    id: number;
    date: string;
    type: string;
    status: string;
  }>;
  notes: string;
};

const selectedClient = ref<Client | null>(null);

// Mock client data
const clients = ref([
  {
    id: 1,
    name: 'John & Mary Smith',
    type: 'Couple',
    email: 'john.smith@email.com',
    phone: '+1 (555) 123-4567',
    status: 'active',
    program: 'Marriage Restoration',
    sessionsCompleted: 4,
    totalSessions: 6,
    progress: 67,
    nextSession: 'Today 2:00 PM',
    startDate: '2024-01-15',
    lastSession: '2024-01-22',
    sessions: [
      { id: 1, date: '2024-01-22', type: 'Couples Session', status: 'completed' },
      { id: 2, date: '2024-01-15', type: 'Initial Consultation', status: 'completed' }
    ],
    notes: 'Making good progress on communication. Focus on conflict resolution next session.'
  },
  {
    id: 2,
    name: 'Jennifer Wilson',
    type: 'Individual',
    email: 'jennifer.w@email.com',
    phone: '+1 (555) 987-6543',
    status: 'active',
    program: null,
    sessionsCompleted: 2,
    totalSessions: 8,
    progress: 25,
    nextSession: 'Tomorrow 10:00 AM',
    startDate: '2024-01-20',
    lastSession: '2024-01-21',
    sessions: [
      { id: 3, date: '2024-01-21', type: 'Individual Session', status: 'completed' },
      { id: 4, date: '2024-01-20', type: 'Initial Assessment', status: 'completed' }
    ],
    notes: 'Dealing with workplace stress. Recommended mindfulness exercises.'
  },
  {
    id: 3,
    name: 'The Johnson Family',
    type: 'Family',
    email: 'johnson.family@email.com',
    phone: '+1 (555) 456-7890',
    status: 'completed',
    program: 'Parenting Program',
    sessionsCompleted: 6,
    totalSessions: 6,
    progress: 100,
    nextSession: null,
    startDate: '2023-12-01',
    lastSession: '2024-01-10',
    sessions: [
      { id: 5, date: '2024-01-10', type: 'Family Session', status: 'completed' },
      { id: 6, date: '2024-01-03', type: 'Family Session', status: 'completed' }
    ],
    notes: 'Successfully completed parenting program. Family dynamics much improved.'
  }
]);

const filteredClients = computed(() => {
  let filtered = clients.value;

  if (searchQuery.value) {
    filtered = filtered.filter(client =>
      client.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      client.email.toLowerCase().includes(searchQuery.value.toLowerCase())
    );
  }

  if (filterStatus.value) {
    filtered = filtered.filter(client => client.status === filterStatus.value);
  }

  return filtered;
});

const getStatusClass = (status: string) => {
  const classes = {
    active: 'bg-green-100 text-green-800',
    inactive: 'bg-gray-100 text-gray-800',
    completed: 'bg-blue-100 text-blue-800'
  };
  return classes[status as keyof typeof classes] || classes.active;
};
</script>
