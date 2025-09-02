<template>
  <div class="space-y-6">
    <div class="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-6 text-white">
      <div class="flex flex-col md:flex-row md:items-center justify-between">
        <div>
          <h2 class="text-2xl font-bold mb-2">Good {{ getGreeting() }}, Dr. {{ user?.name?.split(' ')[1] || 'Counselor' }}</h2>
          <p class="max-w-xl">You have {{ upcomingSessions.length }} sessions scheduled today and {{ activeClients }} active clients this week.</p>
        </div>
        <router-link
          to="/counselor-dashboard/schedule"
          class="mt-4 md:mt-0 px-6 py-3 bg-white text-blue-600 rounded-lg font-medium hover:bg-gray-100 transition-colors inline-block"
        >
          View Schedule
        </router-link>
      </div>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <div class="bg-white rounded-xl shadow p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-500">Today's Sessions</p>
            <p class="text-2xl font-bold mt-1">{{ todaysSessions }}</p>
          </div>
          <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
            <VideoIcon class="w-6 h-6 text-blue-600" />
          </div>
        </div>
        <div class="mt-2 text-sm">
          <span class="text-green-600">{{ upcomingSessions.length }} upcoming</span>
        </div>
      </div>

      <div class="bg-white rounded-xl shadow p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-500">Active Clients</p>
            <p class="text-2xl font-bold mt-1">{{ activeClients }}</p>
          </div>
          <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
            <UsersIcon class="w-6 h-6 text-green-600" />
          </div>
        </div>
        <div class="mt-2 text-sm">
          <span class="text-blue-600">{{ newClientsThisWeek }} new this week</span>
        </div>
      </div>

      <div class="bg-white rounded-xl shadow p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-500">Programs</p>
            <p class="text-2xl font-bold mt-1">{{ activePrograms }}</p>
          </div>
          <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
            <BookOpenIcon class="w-6 h-6 text-purple-600" />
          </div>
        </div>
        <div class="mt-2 text-sm">
          <span class="text-purple-600">{{ totalEnrolledClients }} total participants</span>
        </div>
      </div>

      <div class="bg-white rounded-xl shadow p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-500">Completion Rate</p>
            <p class="text-2xl font-bold mt-1">{{ completionRate }}%</p>
          </div>
          <div class="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
            <TrendingUpIcon class="w-6 h-6 text-yellow-600" />
          </div>
        </div>
        <div class="mt-2 text-sm">
          <span class="text-green-600">+5% from last month</span>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div class="lg:col-span-2">
        <div class="bg-white rounded-xl shadow">
          <div class="px-6 py-4 border-b">
            <h3 class="text-lg font-semibold text-gray-900">Today's Schedule</h3>
          </div>
          <div class="p-6">
            <div v-if="upcomingSessions.length > 0" class="space-y-4">
              <div
                v-for="session in upcomingSessions"
                :key="session.id"
                class="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
              >
                <div class="flex justify-between items-start">
                  <div>
                    <h4 class="font-medium text-gray-900">{{ session.client_name }}</h4>
                    <p class="text-sm text-gray-600 mt-1">{{ session.type }} - {{ session.program || 'Individual Session' }}</p>
                    <div class="flex items-center mt-2 text-sm text-gray-500">
                      <ClockIcon class="w-4 h-4 mr-1" />
                      <span>{{ formatTime(session.start_time) }} - {{ formatTime(session.end_time) }}</span>
                      <span class="mx-2">•</span>
                      <span>{{ session.duration }} mins</span>
                    </div>
                  </div>
                  <div class="flex items-center space-x-2">
                    <span :class="`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getSessionStatusClass(session.status)}`">
                      {{ session.status }}
                    </span>
                    <button
                      v-if="session.status === 'scheduled'"
                      @click="startSession(session.id)"
                      class="px-3 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700"
                    >
                      Start
                    </button>
                  </div>
                </div>
                <div class="mt-3 flex space-x-2">
                  <button class="flex-1 px-3 py-1 border border-gray-300 text-gray-700 rounded text-sm hover:bg-gray-50">
                    View Notes
                  </button>
                  <button class="flex-1 px-3 py-1 border border-gray-300 text-gray-700 rounded text-sm hover:bg-gray-50">
                    Client History
                  </button>
                </div>
              </div>
            </div>
            <div v-else class="text-center py-8">
              <CalendarIcon class="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p class="text-gray-600">No sessions scheduled for today</p>
            </div>
          </div>
        </div>
      </div>

      <div class="space-y-6">
        <div class="bg-white rounded-xl shadow">
          <div class="px-6 py-4 border-b">
            <h3 class="text-lg font-semibold text-gray-900">Quick Actions</h3>
          </div>
          <div class="p-6">
            <div class="space-y-3">
              <button class="w-full flex items-center justify-center px-4 py-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                <PlusIcon class="w-4 h-4 mr-2" />
                Schedule Session
              </button>

              <button class="w-full flex items-center justify-center px-4 py-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                <UserPlusIcon class="w-4 h-4 mr-2" />
                Add Client
              </button>

              <button class="w-full flex items-center justify-center px-4 py-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                <FileTextIcon class="w-4 h-4 mr-2" />
                Upload Resource
              </button>

              <button class="w-full flex items-center justify-center px-4 py-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                <BarChartIcon class="w-4 h-4 mr-2" />
                View Reports
              </button>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-xl shadow">
          <div class="px-6 py-4 border-b">
            <h3 class="text-lg font-semibold text-gray-900">Recent Activity</h3>
          </div>
          <div class="p-6">
            <div class="space-y-4">
              <div v-for="activity in recentActivity" :key="activity.id" class="flex items-start space-x-3">
                <div :class="`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${activity.color}`">
                  <component :is="activity.icon" class="w-4 h-4" />
                </div>
                <div class="min-w-0 flex-1">
                  <p class="text-sm text-gray-900">{{ activity.message }}</p>
                  <p class="text-xs text-gray-500">{{ activity.time }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-xl shadow">
          <div class="px-6 py-4 border-b">
            <h3 class="text-lg font-semibold text-gray-900">Pending Tasks</h3>
          </div>
          <div class="p-6">
            <div class="space-y-3">
              <div v-for="task in pendingTasks" :key="task.id" class="flex items-center space-x-3">
                <input type="checkbox" class="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                <span class="text-sm text-gray-900">{{ task.description }}</span>
                <span :class="`text-xs px-2 py-1 rounded ${task.priority === 'high' ? 'bg-red-100 text-red-800' : task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'}`">
                  {{ task.priority }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted} from 'vue';
import {
  VideoIcon,
  UsersIcon,
  BookOpenIcon,
  TrendingUpIcon,
  ClockIcon,
  CalendarIcon,
  PlusIcon,
  UserPlusIcon,
  FileTextIcon,
  BarChartIcon,
  CheckCircleIcon,
  MessageCircleIcon,
  UserIcon
} from 'lucide-vue-next';

const user = ref({
  name: 'Sarah Johnson',
  specialization: 'Marriage Counseling'
});

const todaysSessions = ref(5);
const activeClients = ref(23);
const newClientsThisWeek = ref(3);
const activePrograms = ref(4);
const totalEnrolledClients = ref(45);
const completionRate = ref(87);

const upcomingSessions = ref([
  {
    id: 1,
    client_name: 'John & Mary Smith',
    type: 'Couples Therapy',
    program: 'Marriage Restoration',
    start_time: '09:00',
    end_time: '10:00',
    duration: 60,
    status: 'scheduled'
  },
  {
    id: 2,
    client_name: 'Jennifer Wilson',
    type: 'Individual Session',
    program: null,
    start_time: '11:00',
    end_time: '11:45',
    duration: 45,
    status: 'confirmed'
  },
  {
    id: 3,
    client_name: 'The Johnson Family',
    type: 'Family Therapy',
    program: 'Parenting Program',
    start_time: '14:00',
    end_time: '15:00',
    duration: 60,
    status: 'pending'
  }
]);

const recentActivity = ref([
  {
    id: 1,
    message: 'John Smith completed Week 3 assignment',
    time: '2 hours ago',
    icon: CheckCircleIcon,
    color: 'bg-green-100 text-green-600'
  },
  {
    id: 2,
    message: 'New message from Mary Johnson',
    time: '4 hours ago',
    icon: MessageCircleIcon,
    color: 'bg-blue-100 text-blue-600'
  },
  {
    id: 3,
    message: 'Client feedback received for session #247',
    time: '1 day ago',
    icon: UserIcon,
    color: 'bg-purple-100 text-purple-600'
  }
]);

const pendingTasks = ref([
  {
    id: 1,
    description: 'Review session notes for Jennifer W.',
    priority: 'high'
  },
  {
    id: 2,
    description: 'Prepare materials for Marriage Program Week 4',
    priority: 'medium'
  },
  {
    id: 3,
    description: 'Update client progress reports',
    priority: 'low'
  }
]);

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'morning';
  if (hour < 18) return 'afternoon';
  return 'evening';
};

const formatTime = (time: string) => {
  return time;
};

const getSessionStatusClass = (status: string) => {
  const classes = {
    scheduled: 'bg-blue-100 text-blue-800',
    confirmed: 'bg-green-100 text-green-800',
    pending: 'bg-yellow-100 text-yellow-800',
    completed: 'bg-gray-100 text-gray-800'
  };
  return classes[status as keyof typeof classes] || classes.pending;
};

const startSession = (sessionId: number) => {
  alert(`Starting session ${sessionId}`);
};

onMounted(() => {
  console.log('Loading counselor dashboard data...');
});
</script>
