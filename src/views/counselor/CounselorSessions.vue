<template>
  <div class="space-y-6">
    <!-- Sessions Overview -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div class="bg-white rounded-xl shadow p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-500">Today's Sessions</p>
            <p class="text-2xl font-bold mt-1">{{ todaySessions.length }}</p>
          </div>
          <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <VideoIcon class="w-5 h-5 text-blue-600" />
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl shadow p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-500">This Week</p>
            <p class="text-2xl font-bold mt-1">{{ weekSessions.length }}</p>
          </div>
          <div class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
            <CalendarIcon class="w-5 h-5 text-green-600" />
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl shadow p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-500">Recordings</p>
            <p class="text-2xl font-bold mt-1">{{ recordedSessions.length }}</p>
          </div>
          <div class="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
            <PlayIcon class="w-5 h-5 text-purple-600" />
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl shadow p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-500">Completed</p>
            <p class="text-2xl font-bold mt-1">{{ completedSessions.length }}</p>
          </div>
          <div class="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
            <CheckCircleIcon class="w-5 h-5 text-yellow-600" />
          </div>
        </div>
      </div>
    </div>

    <!-- Active Sessions -->
    <div class="bg-white rounded-xl shadow">
      <div class="px-6 py-4 border-b">
        <h3 class="text-lg font-semibold text-gray-900">Active & Upcoming Sessions</h3>
      </div>
      <div class="p-6">
        <div class="space-y-4">
          <div
            v-for="session in activeSessions"
            :key="session.id"
            class="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
          >
            <div class="flex justify-between items-start">
              <div class="flex-1">
                <div class="flex items-center space-x-3 mb-2">
                  <h4 class="font-medium text-gray-900">{{ session.client_name }}</h4>
                  <span :class="`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getSessionStatusClass(session.status)}`">
                    {{ session.status }}
                  </span>
                </div>
                <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                  <div class="flex items-center">
                    <ClockIcon class="w-4 h-4 mr-1" />
                    {{ session.date }} at {{ session.time }}
                  </div>
                  <div class="flex items-center">
                    <UserIcon class="w-4 h-4 mr-1" />
                    {{ session.type }}
                  </div>
                  <div class="flex items-center">
                    <BookOpenIcon class="w-4 h-4 mr-1" />
                    {{ session.program || 'Individual Session' }}
                  </div>
                  <div class="flex items-center">
                    <VideoIcon class="w-4 h-4 mr-1" />
                    {{ session.duration }} minutes
                  </div>
                </div>
              </div>

              <div class="flex items-center space-x-2 ml-4">
                <button
                  v-if="session.status === 'scheduled' && canStartSession(session)"
                  @click="startSession(session)"
                  class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
                >
                  Start Session
                </button>
                <button
                  v-if="session.status === 'live'"
                  @click="joinSession(session)"
                  class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                >
                  Join Session
                </button>
                <div class="relative">
                  <button
                    @click="toggleSessionMenu(session.id)"
                    class="p-2 rounded-lg hover:bg-gray-100"
                  >
                    <MoreVerticalIcon class="w-4 h-4" />
                  </button>
                  <div
                    v-if="activeMenuId === session.id"
                    class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10"
                  >
                    <button
                      @click="viewSessionNotes(session)"
                      class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-t-lg"
                    >
                      View Notes
                    </button>
                    <button
                      @click="rescheduleSession(session)"
                      class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      Reschedule
                    </button>
                    <button
                      @click="cancelSession(session)"
                      class="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50 rounded-b-lg"
                    >
                      Cancel Session
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Session Notes Preview -->
            <div v-if="session.notes" class="mt-3 p-3 bg-gray-50 rounded-lg">
              <p class="text-sm text-gray-700">
                <span class="font-medium">Notes:</span> {{ session.notes }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Recorded Sessions -->
    <div class="bg-white rounded-xl shadow">
      <div class="px-6 py-4 border-b">
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-semibold text-gray-900">Recorded Sessions</h3>
          <select v-model="recordingFilter" class="border border-gray-300 rounded-lg px-3 py-2 text-sm">
            <option value="all">All Recordings</option>
            <option value="this_week">This Week</option>
            <option value="this_month">This Month</option>
          </select>
        </div>
      </div>
      <div class="p-6">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div
            v-for="recording in filteredRecordings"
            :key="recording.id"
            class="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <div class="flex items-start justify-between mb-3">
              <div>
                <h4 class="font-medium text-gray-900">{{ recording.client_name }}</h4>
                <p class="text-sm text-gray-600">{{ recording.date }}</p>
              </div>
              <span class="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                {{ recording.duration }}
              </span>
            </div>

            <div class="space-y-2">
              <div class="flex items-center text-sm text-gray-600">
                <PlayIcon class="w-4 h-4 mr-2" />
                <span>{{ recording.type }}</span>
              </div>
              <div class="flex items-center text-sm text-gray-600">
                <FileTextIcon class="w-4 h-4 mr-2" />
                <span>{{ recording.size }}</span>
              </div>
            </div>

            <div class="flex space-x-2 mt-4">
              <button
                @click="playRecording(recording)"
                class="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
              >
                Play
              </button>
              <button
                @click="downloadRecording(recording)"
                class="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm"
              >
                <DownloadIcon class="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Session Notes Modal -->
    <div v-if="showNotesModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div class="bg-white rounded-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
        <div class="p-6 border-b">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold">Session Notes - {{ selectedSession?.client_name }}</h3>
            <button @click="showNotesModal = false" class="p-1 hover:bg-gray-100 rounded">
              <XIcon class="w-5 h-5" />
            </button>
          </div>
        </div>

        <div class="p-6 space-y-4">
          <div class="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span class="text-gray-500">Date:</span> {{ selectedSession?.date }}
            </div>
            <div>
              <span class="text-gray-500">Duration:</span> {{ selectedSession?.duration }} minutes
            </div>
            <div>
              <span class="text-gray-500">Type:</span> {{ selectedSession?.type }}
            </div>
            <div>
              <span class="text-gray-500">Status:</span> {{ selectedSession?.status }}
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Session Notes</label>
            <textarea
              v-model="sessionNotes"
              rows="8"
              class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Add your session notes here..."
            ></textarea>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Action Items</label>
            <textarea
              v-model="actionItems"
              rows="4"
              class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="List any action items or homework for the client..."
            ></textarea>
          </div>

          <div class="flex justify-end space-x-3 pt-4">
            <button
              @click="showNotesModal = false"
              class="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              @click="saveSessionNotes"
              class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
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
  VideoIcon,
  CalendarIcon,
  PlayIcon,
  CheckCircleIcon,
  ClockIcon,
  UserIcon,
  BookOpenIcon,
  MoreVerticalIcon,
  FileTextIcon,
  DownloadIcon,
  XIcon
} from 'lucide-vue-next';

// Define proper interfaces
interface Session {
  id: number;
  client_name: string;
  date: string;
  time: string;
  duration: number;
  type: string;
  program: string | null;
  status: string;
  notes?: string;
  actionItems?: string;
}

interface RecordedSession {
  id: number;
  client_name: string;
  date: string;
  type: string;
  duration: string;
  size: string;
}

const activeMenuId = ref<number | null>(null);
const recordingFilter = ref('all');
const showNotesModal = ref(false);
const selectedSession = ref<Session | null>(null);
const sessionNotes = ref('');
const actionItems = ref('');

// Mock session data - updated to include actionItems
const allSessions = ref<Session[]>([
  {
    id: 1,
    client_name: 'John & Mary Smith',
    date: '2024-01-25',
    time: '09:00',
    duration: 60,
    type: 'Couples Session',
    program: 'Marriage Restoration',
    status: 'scheduled',
    notes: 'Focus on communication patterns discussed in previous session.',
    actionItems: 'Practice active listening exercises'
  },
  {
    id: 2,
    client_name: 'Jennifer Wilson',
    date: '2024-01-25',
    time: '11:00',
    duration: 45,
    type: 'Individual Session',
    program: null,
    status: 'live',
    notes: '',
    actionItems: ''
  },
  {
    id: 3,
    client_name: 'The Johnson Family',
    date: '2024-01-24',
    time: '14:00',
    duration: 60,
    type: 'Family Session',
    program: 'Parenting Program',
    status: 'completed',
    notes: 'Significant progress in family dynamics.',
    actionItems: 'Continue weekly family meetings'
  }
]);

const recordedSessions = ref<RecordedSession[]>([
  {
    id: 1,
    client_name: 'John & Mary Smith',
    date: '2024-01-24',
    type: 'Couples Session',
    duration: '58:32',
    size: '245 MB'
  },
  {
    id: 2,
    client_name: 'Jennifer Wilson',
    date: '2024-01-23',
    type: 'Individual Session',
    duration: '43:15',
    size: '187 MB'
  },
  {
    id: 3,
    client_name: 'The Johnson Family',
    date: '2024-01-22',
    type: 'Family Session',
    duration: '62:08',
    size: '268 MB'
  }
]);

const todaySessions = computed(() => {
  const today = new Date().toISOString().split('T')[0];
  return allSessions.value.filter(session => session.date === today);
});

const weekSessions = computed(() => {
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);
  return allSessions.value.filter(session => new Date(session.date) >= weekAgo);
});

const activeSessions = computed(() => {
  return allSessions.value.filter(session =>
    session.status === 'scheduled' || session.status === 'live'
  );
});

const completedSessions = computed(() => {
  return allSessions.value.filter(session => session.status === 'completed');
});

const filteredRecordings = computed(() => {
  if (recordingFilter.value === 'all') return recordedSessions.value;

  const now = new Date();
  const filterDate = recordingFilter.value === 'this_week'
    ? new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    : new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  return recordedSessions.value.filter(recording =>
    new Date(recording.date) >= filterDate
  );
});

const getSessionStatusClass = (status: string) => {
  const classes = {
    scheduled: 'bg-blue-100 text-blue-800',
    live: 'bg-green-100 text-green-800',
    completed: 'bg-gray-100 text-gray-800',
    cancelled: 'bg-red-100 text-red-800'
  };
  return classes[status as keyof typeof classes] || classes.scheduled;
};

const canStartSession = (session: Session) => {
  const sessionDateTime = new Date(`${session.date}T${session.time}`);
  const now = new Date();
  const timeDiff = sessionDateTime.getTime() - now.getTime();
  return timeDiff <= 15 * 60 * 1000 && timeDiff >= -5 * 60 * 1000; // 15 min before to 5 min after
};

const toggleSessionMenu = (sessionId: number) => {
  activeMenuId.value = activeMenuId.value === sessionId ? null : sessionId;
};

const startSession = (session: Session) => {
  console.log('Starting session:', session);
  alert(`Starting session with ${session.client_name}`);
};

const joinSession = (session: Session) => {
  console.log('Joining session:', session);
  alert(`Joining active session with ${session.client_name}`);
};

const viewSessionNotes = (session: Session) => {
  selectedSession.value = session;
  sessionNotes.value = session.notes || '';
  actionItems.value = session.actionItems || '';
  showNotesModal.value = true;
  activeMenuId.value = null;
};

const rescheduleSession = (session: Session) => {
  console.log('Rescheduling session:', session);
  activeMenuId.value = null;
  alert('Reschedule functionality would open a date/time picker');
};

const cancelSession = (session: Session) => {
  if (confirm(`Are you sure you want to cancel the session with ${session.client_name}?`)) {
    console.log('Cancelling session:', session);
    // Update session status
    const index = allSessions.value.findIndex(s => s.id === session.id);
    if (index !== -1) {
      allSessions.value[index].status = 'cancelled';
    }
  }
  activeMenuId.value = null;
};

const playRecording = (recording: RecordedSession) => {
  console.log('Playing recording:', recording);
  alert(`Playing recording of ${recording.client_name} session`);
};

const downloadRecording = (recording: RecordedSession) => {
  console.log('Downloading recording:', recording);
  alert(`Downloading ${recording.client_name} session recording`);
};

const saveSessionNotes = () => {
  if (selectedSession.value) {
    // Update the session with new notes
    const index = allSessions.value.findIndex(s => s.id === selectedSession.value!.id);
    if (index !== -1) {
      allSessions.value[index].notes = sessionNotes.value;
      allSessions.value[index].actionItems = actionItems.value;
    }
    console.log('Saving notes for session:', selectedSession.value.id);
    showNotesModal.value = false;
    selectedSession.value = null;
  }
};

// Close menu when clicking outside
document.addEventListener('click', (event) => {
  const target = event.target as HTMLElement;
  if (!target.closest('.relative')) {
    activeMenuId.value = null;
  }
});
</script>
