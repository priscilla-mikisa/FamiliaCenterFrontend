<template>
  <div class="space-y-6">
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
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="n in 6" :key="n" class="bg-white rounded-xl shadow p-6 animate-pulse">
        <div class="flex items-center space-x-3 mb-4">
          <div class="w-12 h-12 bg-gray-200 rounded-full"></div>
          <div class="flex-1">
            <div class="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div class="h-3 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
        <div class="space-y-2">
          <div class="h-3 bg-gray-200 rounded"></div>
          <div class="h-3 bg-gray-200 rounded"></div>
          <div class="h-3 bg-gray-200 rounded"></div>
        </div>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="bg-white rounded-xl shadow p-6">
      <div class="text-center py-8">
        <p class="text-red-500 mb-4">{{ error }}</p>
        <button
          @click="fetchClients"
          class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
    </div>

    <!-- Clients Grid -->
    <div v-else-if="filteredClients.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                <p class="text-sm text-gray-500">{{ client.email }}</p>
              </div>
            </div>
            <span :class="`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusClass(client.status)}`">
              {{ client.status }}
            </span>
          </div>

          <div class="space-y-2 mb-4">
            <div class="flex justify-between text-sm">
              <span class="text-gray-500">Total Sessions:</span>
              <span class="font-medium">{{ client.totalSessions }}</span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-gray-500">Completed:</span>
              <span class="font-medium">{{ client.completedSessions }}</span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-gray-500">Pending:</span>
              <span class="font-medium">{{ client.pendingSessions }}</span>
            </div>
            <div v-if="client.nextSession" class="flex justify-between text-sm">
              <span class="text-gray-500">Next Session:</span>
              <span class="font-medium">{{ formatDate(client.nextSession) }}</span>
            </div>
            <div v-if="client.lastSession" class="flex justify-between text-sm">
              <span class="text-gray-500">Last Session:</span>
              <span class="font-medium">{{ formatDate(client.lastSession) }}</span>
            </div>
          </div>

          <div v-if="client.completedSessions > 0" class="mb-4">
            <div class="flex justify-between text-sm text-gray-600 mb-1">
              <span>Progress</span>
              <span>{{ Math.round((client.completedSessions / client.totalSessions) * 100) }}%</span>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-2">
              <div
                class="bg-blue-600 h-2 rounded-full transition-all duration-300"
                :style="{ width: `${(client.completedSessions / client.totalSessions) * 100}%` }"
              ></div>
            </div>
          </div>

          <div class="flex space-x-2">
            <button
              @click="viewClientDetails(client)"
              class="flex-1 px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              View Details
            </button>
            <button
              class="px-3 py-2 text-sm border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              title="Contact Client"
            >
              <MessageCircleIcon class="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="bg-white rounded-xl shadow p-6">
      <div class="text-center py-8">
        <div class="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <UserIcon class="w-8 h-8 text-gray-400" />
        </div>
        <p class="text-gray-600">No clients found</p>
        <p class="text-sm text-gray-500 mt-2">Clients will appear here once they book sessions with you</p>
      </div>
    </div>

    <!-- Client Details Modal -->
    <div
      v-if="selectedClient"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
      @click.self="selectedClient = null"
    >
      <div class="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div class="p-6 border-b sticky top-0 bg-white">
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
            <div v-if="selectedClient.phone">
              <label class="block text-sm font-medium text-gray-500">Phone</label>
              <p class="mt-1 text-sm text-gray-900">{{ selectedClient.phone }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-500">Total Sessions</label>
              <p class="mt-1 text-sm text-gray-900">{{ selectedClient.totalSessions }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-500">Completed</label>
              <p class="mt-1 text-sm text-gray-900">{{ selectedClient.completedSessions }}</p>
            </div>
            <div v-if="selectedClient.lastSession">
              <label class="block text-sm font-medium text-gray-500">Last Session</label>
              <p class="mt-1 text-sm text-gray-900">{{ formatDate(selectedClient.lastSession) }}</p>
            </div>
            <div v-if="selectedClient.nextSession">
              <label class="block text-sm font-medium text-gray-500">Next Session</label>
              <p class="mt-1 text-sm text-gray-900">{{ formatDate(selectedClient.nextSession) }}</p>
            </div>
          </div>

          <!-- Session History -->
          <div>
            <h4 class="font-medium text-gray-900 mb-3">Session History</h4>
            <div class="space-y-2 max-h-96 overflow-y-auto">
              <div
                v-for="session in selectedClient.sessions"
                :key="session.id"
                class="flex justify-between items-start py-3 border-b border-gray-100 last:border-0"
              >
                <div class="flex-1">
                  <div class="flex items-center justify-between mb-1">
                    <p class="text-sm font-medium">{{ session.topic }}</p>
                    <span :class="`text-xs px-2 py-1 rounded ${getSessionStatusClass(session.status)}`">
                      {{ session.status }}
                    </span>
                  </div>
                  <p class="text-xs text-gray-500">
                    {{ formatDateTime(session.start_time) }} • {{ session.duration }} minutes
                  </p>
                  <p v-if="session.bio" class="text-xs text-gray-600 mt-1">{{ session.bio }}</p>
                  <a
                    v-if="session.meeting_link && session.status === 'confirmed'"
                    :href="session.meeting_link"
                    target="_blank"
                    class="text-xs text-blue-600 hover:underline mt-1 inline-block"
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
              @click="selectedClient = null"
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
import { ref, computed, onMounted } from 'vue';
import {
  SearchIcon,
  UserIcon,
  MessageCircleIcon,
  XIcon
} from 'lucide-vue-next';
import { CounsellorService } from '@/services/apiService';

interface Session {
  id: string;
  user_id: string;
  counsellor_id: string;
  start_time: string;
  duration: number;
  topic: string;
  bio?: string;
  status: string;
  is_counsellor_accepted: boolean;
  meeting_link?: string;
  created_at: string;
  user?: {
    id?: string;
    first_name?: string;
    last_name?: string;
    email?: string;
    phone_number?: string;
    country_code?: string;
  };
}

interface Client {
  id: string;
  name: string;
  email: string;
  phone?: string;
  status: string;
  totalSessions: number;
  completedSessions: number;
  pendingSessions: number;
  nextSession?: string;
  lastSession?: string;
  sessions: Session[];
}

const searchQuery = ref('');
const filterStatus = ref('');
const loading = ref(true);
const error = ref<string | null>(null);
const selectedClient = ref<Client | null>(null);
const clients = ref<Client[]>([]);

const fetchClients = async () => {
  try {
    loading.value = true;
    error.value = null;

    // Fetch all counsellor sessions
    const response = await CounsellorService.getCounsellorSessions();
    const sessions: Session[] = response.data || [];

    // Group sessions by user to create client records
    const clientsMap = new Map<string, Client>();

    sessions.forEach((session) => {
      const userId = session.user_id;
      const user = session.user;

      if (!userId || !user) return;

      if (!clientsMap.has(userId)) {
        // Create new client record
        const name = [user.first_name, user.last_name].filter(Boolean).join(' ') || 'Unknown Client';

        clientsMap.set(userId, {
          id: userId,
          name,
          email: user.email || 'No email',
          phone: user.phone_number ? `${user.country_code || ''} ${user.phone_number}` : undefined,
          status: 'active',
          totalSessions: 0,
          completedSessions: 0,
          pendingSessions: 0,
          sessions: [],
        });
      }

      const client = clientsMap.get(userId)!;
      client.sessions.push(session);
      client.totalSessions++;

      // Count sessions by status
      if (session.status === 'completed') {
        client.completedSessions++;
      } else if (session.status === 'pending' || session.status === 'confirmed') {
        client.pendingSessions++;
      }

      // Find next and last sessions
      const sessionTime = new Date(session.start_time);
      const now = new Date();

      if (sessionTime > now) {
        // Future session - check if it's the nearest
        if (!client.nextSession || sessionTime < new Date(client.nextSession)) {
          client.nextSession = session.start_time;
        }
      } else {
        // Past session - check if it's the most recent
        if (!client.lastSession || sessionTime > new Date(client.lastSession)) {
          client.lastSession = session.start_time;
        }
      }
    });

    // Convert map to array and determine status
    clients.value = Array.from(clientsMap.values()).map(client => {
      // Sort sessions by date (newest first)
      client.sessions.sort((a, b) =>
        new Date(b.start_time).getTime() - new Date(a.start_time).getTime()
      );

      // Determine client status
      if (client.completedSessions === client.totalSessions && client.totalSessions > 0) {
        client.status = 'completed';
      } else if (client.pendingSessions > 0) {
        client.status = 'active';
      } else {
        client.status = 'pending';
      }

      return client;
    });

    // Sort clients by last activity
    clients.value.sort((a, b) => {
      const aTime = a.lastSession || a.nextSession || '0';
      const bTime = b.lastSession || b.nextSession || '0';
      return new Date(bTime).getTime() - new Date(aTime).getTime();
    });

  } catch (err: any) {
    console.error('Error fetching clients:', err);
    error.value = err.message || 'Failed to load clients';
  } finally {
    loading.value = false;
  }
};

const filteredClients = computed(() => {
  let filtered = clients.value;

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(client =>
      client.name.toLowerCase().includes(query) ||
      client.email.toLowerCase().includes(query)
    );
  }

  if (filterStatus.value) {
    filtered = filtered.filter(client => client.status === filterStatus.value);
  }

  return filtered;
});

const viewClientDetails = (client: Client) => {
  selectedClient.value = client;
};

const getStatusClass = (status: string) => {
  const classes = {
    active: 'bg-green-100 text-green-800',
    pending: 'bg-yellow-100 text-yellow-800',
    completed: 'bg-blue-100 text-blue-800'
  };
  return classes[status as keyof typeof classes] || classes.active;
};

const getSessionStatusClass = (status: string) => {
  const classes = {
    completed: 'bg-green-100 text-green-800',
    confirmed: 'bg-blue-100 text-blue-800',
    pending: 'bg-yellow-100 text-yellow-800',
    cancelled: 'bg-red-100 text-red-800'
  };
  return classes[status as keyof typeof classes] || classes.pending;
};

const formatDate = (dateString: string) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  const now = new Date();
  const diff = date.getTime() - now.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (days === 0) return 'Today';
  if (days === 1) return 'Tomorrow';
  if (days === -1) return 'Yesterday';
  if (days > 0 && days < 7) return `In ${days} days`;
  if (days < 0 && days > -7) return `${Math.abs(days)} days ago`;

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
  });
};

const formatDateTime = (dateString: string) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

onMounted(() => {
  fetchClients();
});
</script>
