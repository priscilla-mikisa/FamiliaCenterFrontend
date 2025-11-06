<template>
  <div class="min-h-screen bg-gray-100">
    <!-- Admin Navigation -->
    <nav class="bg-white shadow-sm border-b">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex items-center">
            <ShieldCheckIcon class="w-8 h-8 text-green-600 mr-3" />
            <h1 class="text-xl font-bold text-gray-900">Admin Dashboard</h1>
          </div>
          <div class="flex items-center space-x-4">
            <span class="text-sm text-gray-600">Welcome, {{ adminName }}</span>
            <button
              @click="handleLogout"
              class="px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Tab Navigation -->
      <div class="bg-white rounded-lg shadow mb-6">
        <div class="border-b border-gray-200">
          <nav class="flex space-x-8 px-6" aria-label="Tabs">
            <router-link
              v-for="tab in tabs"
              :key="tab.id"
              :to="tab.route"
              :class="[
                $route.path === tab.route || ($route.path.startsWith(tab.route) && tab.route !== '/admin-dashboard')
                  ? 'border-green-600 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center'
              ]"
            >
              <component :is="tab.icon" class="w-5 h-5 mr-2" />
              {{ tab.name }}
            </router-link>
          </nav>
        </div>
      </div>

      <!-- Tab Content -->
      <div class="bg-white rounded-lg shadow p-6">
        <!-- Router View for child routes (forums, settings, etc.) -->
        <router-view v-if="$route.path !== '/admin-dashboard'" />
        
        <!-- Overview Tab (default when on /admin-dashboard) -->
        <div v-else>
          <h2 class="text-2xl font-bold text-gray-900 mb-6">Platform Overview</h2>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div class="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm font-medium text-blue-600">Total Users</p>
                  <p class="text-3xl font-bold text-blue-900 mt-2">{{ stats.totalUsers }}</p>
                </div>
                <UsersIcon class="w-12 h-12 text-blue-600 opacity-50" />
              </div>
              <p class="text-xs text-blue-700 mt-2">+{{ stats.newUsersThisMonth }} this month</p>
            </div>

            <div class="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm font-medium text-green-600">Active Counselors</p>
                  <p class="text-3xl font-bold text-green-900 mt-2">{{ stats.activeCounselors }}</p>
                </div>
                <UserCheckIcon class="w-12 h-12 text-green-600 opacity-50" />
              </div>
              <p class="text-xs text-green-700 mt-2">{{ stats.pendingCounselors }} pending approval</p>
            </div>

            <div class="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-6">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm font-medium text-purple-600">Total Sessions</p>
                  <p class="text-3xl font-bold text-purple-900 mt-2">{{ stats.totalSessions }}</p>
                </div>
                <CalendarIcon class="w-12 h-12 text-purple-600 opacity-50" />
              </div>
              <p class="text-xs text-purple-700 mt-2">{{ stats.sessionsThisWeek }} this week</p>
            </div>

            <div class="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-6">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm font-medium text-orange-600">Pending Reviews</p>
                  <p class="text-3xl font-bold text-orange-900 mt-2">{{ stats.pendingReviews }}</p>
                </div>
                <AlertCircleIcon class="w-12 h-12 text-orange-600 opacity-50" />
              </div>
              <p class="text-xs text-orange-700 mt-2">Requires attention</p>
            </div>
          </div>

          <!-- Recent Activity -->
          <div class="mt-8">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
            <div class="space-y-3">
              <div
                v-for="activity in recentActivity"
                :key="activity.id"
                class="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div class="flex items-center space-x-3">
                  <div :class="`w-2 h-2 rounded-full ${activity.color}`"></div>
                  <div>
                    <p class="text-sm font-medium text-gray-900">{{ activity.title }}</p>
                    <p class="text-xs text-gray-500">{{ activity.timestamp }}</p>
                  </div>
                </div>
                <span :class="`px-3 py-1 text-xs font-medium rounded-full ${activity.badgeClass}`">
                  {{ activity.status }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Users Tab (only show if not using router-view) -->
        <div v-if="activeTab === 'users' && $route.path === '/admin-dashboard'">
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-2xl font-bold text-gray-900">User Management</h2>
            <div class="flex space-x-3">
              <input
                type="text"
                v-model="userSearch"
                placeholder="Search users..."
                class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              />
              <select
                v-model="userFilter"
                class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              >
                <option value="all">All Users</option>
                <option value="active">Active</option>
                <option value="suspended">Suspended</option>
              </select>
            </div>
          </div>

          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Joined</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="user in filteredUsers" :key="user.id">
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                      <div class="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        <span class="text-sm font-medium text-green-600">
                          {{ user.name.charAt(0).toUpperCase() }}
                        </span>
                      </div>
                      <div class="ml-4">
                        <div class="text-sm font-medium text-gray-900">{{ user.name }}</div>
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ user.email }}</td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span class="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                      {{ user.type }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ user.joinedDate }}</td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span :class="`px-2 py-1 text-xs font-medium rounded-full ${
                      user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`">
                      {{ user.status }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm">
                    <button
                      @click="viewUser(user)"
                      class="text-green-600 hover:text-green-900 mr-3"
                    >
                      View
                    </button>
                    <button
                      v-if="user.status === 'active'"
                      @click="suspendUser(user)"
                      class="text-red-600 hover:text-red-900"
                    >
                      Suspend
                    </button>
                    <button
                      v-else
                      @click="activateUser(user)"
                      class="text-green-600 hover:text-green-900"
                    >
                      Activate
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Counselors Tab (only show if not using router-view) -->
        <div v-if="activeTab === 'counselors' && $route.path === '/admin-dashboard'">
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-2xl font-bold text-gray-900">Counselor Verification</h2>
            <select
              v-model="counselorFilter"
              class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
            >
              <option value="all">All Counselors</option>
              <option value="pending">Pending Approval</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          <div class="grid grid-cols-1 gap-6">
            <div
              v-for="counselor in filteredCounselors"
              :key="counselor.id"
              class="border border-gray-200 rounded-lg p-6 hover:shadow-md transition"
            >
              <div class="flex justify-between items-start">
                <div class="flex space-x-4">
                  <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                    <UserIcon class="w-8 h-8 text-green-600" />
                  </div>
                  <div>
                    <h3 class="text-lg font-semibold text-gray-900">
                      {{ counselor.salutation }} {{ counselor.name }}
                    </h3>
                    <p class="text-sm text-gray-600">{{ counselor.email }}</p>
                    <p class="text-sm text-gray-500 mt-1">
                      <span class="font-medium">Specialization:</span> {{ counselor.specialization }}
                    </p>
                    <p class="text-sm text-gray-500">
                      <span class="font-medium">Phone:</span> {{ counselor.phone }}
                    </p>
                  </div>
                </div>
                <span :class="`px-3 py-1 text-xs font-medium rounded-full ${
                  counselor.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  counselor.status === 'approved' ? 'bg-green-100 text-green-800' :
                  'bg-red-100 text-red-800'
                }`">
                  {{ counselor.status }}
                </span>
              </div>

              <div class="mt-4 p-4 bg-gray-50 rounded-lg">
                <p class="text-sm text-gray-700">{{ counselor.bio }}</p>
              </div>

              <div v-if="counselor.status === 'pending'" class="mt-4 flex space-x-3">
                <button
                  @click="viewCounselorDocuments(counselor)"
                  class="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
                >
                  View Documents
                </button>
                <button
                  @click="approveCounselor(counselor)"
                  class="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                >
                  Approve
                </button>
                <button
                  @click="rejectCounselor(counselor)"
                  class="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                >
                  Reject
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Sessions Tab (only show if not using router-view) -->
        <div v-if="activeTab === 'sessions' && $route.path === '/admin-dashboard'">
          <h2 class="text-2xl font-bold text-gray-900 mb-6">Session Monitoring</h2>

          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Session ID</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Patient</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Counselor</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="session in sessions" :key="session.id">
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    #{{ session.id }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ session.patient }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ session.counselor }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ session.date }}</td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span :class="`px-2 py-1 text-xs font-medium rounded-full ${
                      session.status === 'completed' ? 'bg-green-100 text-green-800' :
                      session.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                      'bg-red-100 text-red-800'
                    }`">
                      {{ session.status }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm">
                    <button class="text-green-600 hover:text-green-900">View Details</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Settings Tab (only show if not using router-view) -->
        <div v-if="activeTab === 'settings' && $route.path === '/admin-dashboard'">
          <h2 class="text-2xl font-bold text-gray-900 mb-6">System Settings</h2>

          <div class="space-y-6">
            <div class="border-b border-gray-200 pb-6">
              <h3 class="text-lg font-semibold text-gray-900 mb-4">Create New Admin</h3>
              <form @submit.prevent="createAdmin" class="space-y-4">
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                    <input
                      v-model="newAdmin.firstName"
                      type="text"
                      required
                      class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                    <input
                      v-model="newAdmin.lastName"
                      type="text"
                      required
                      class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    v-model="newAdmin.email"
                    type="email"
                    required
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Password</label>
                  <input
                    v-model="newAdmin.password"
                    type="password"
                    required
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <button
                  type="submit"
                  class="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                >
                  Create Admin Account
                </button>
              </form>
            </div>

            <div>
              <h3 class="text-lg font-semibold text-gray-900 mb-4">Platform Settings</h3>
              <div class="space-y-4">
                <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p class="font-medium text-gray-900">Counselor Auto-Approval</p>
                    <p class="text-sm text-gray-500">Automatically approve verified counselors</p>
                  </div>
                  <button
                    @click="toggleSetting('autoApprove')"
                    :class="`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                      settings.autoApprove ? 'bg-green-600' : 'bg-gray-300'
                    }`"
                  >
                    <span
                      :class="`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                        settings.autoApprove ? 'translate-x-6' : 'translate-x-1'
                      }`"
                    />
                  </button>
                </div>

                <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p class="font-medium text-gray-900">Email Notifications</p>
                    <p class="text-sm text-gray-500">Send email notifications to admins</p>
                  </div>
                  <button
                    @click="toggleSetting('emailNotifications')"
                    :class="`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                      settings.emailNotifications ? 'bg-green-600' : 'bg-gray-300'
                    }`"
                  >
                    <span
                      :class="`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                        settings.emailNotifications ? 'translate-x-6' : 'translate-x-1'
                      }`"
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Document Viewer Modal -->
    <div
      v-if="showDocumentModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      @click.self="showDocumentModal = false"
    >
      <div class="bg-white rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-xl font-bold text-gray-900">Counselor Documents</h3>
          <button @click="showDocumentModal = false" class="text-gray-500 hover:text-gray-700">
            <XIcon class="w-6 h-6" />
          </button>
        </div>
        <div v-if="selectedCounselor" class="space-y-4">
          <div>
            <h4 class="font-semibold text-gray-900 mb-2">Selfie Photo</h4>
            <img :src="selectedCounselor.selfiePhoto" alt="Selfie" class="max-w-md rounded-lg" />
          </div>
          <div>
            <h4 class="font-semibold text-gray-900 mb-2">ID Document (Front)</h4>
            <img :src="selectedCounselor.idFront" alt="ID Front" class="max-w-md rounded-lg" />
          </div>
          <div>
            <h4 class="font-semibold text-gray-900 mb-2">ID Document (Back)</h4>
            <img :src="selectedCounselor.idBack" alt="ID Back" class="max-w-md rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import {
  ShieldCheckIcon,
  UsersIcon,
  UserCheckIcon,
  CalendarIcon,
  AlertCircleIcon,
  SettingsIcon,
  FileTextIcon,
  UserIcon,
  XIcon
} from 'lucide-vue-next';

const router = useRouter();

const adminName = ref('Admin');
const activeTab = ref('overview');
const userSearch = ref('');
const userFilter = ref('all');
const counselorFilter = ref('all');
const showDocumentModal = ref(false);
const selectedCounselor = ref<any>(null);

const tabs = [
  { id: 'overview', name: 'Overview', icon: CalendarIcon, route: '/admin-dashboard' },
  { id: 'forums', name: 'Forums', icon: FileTextIcon, route: '/admin-dashboard/forums' },
  { id: 'users', name: 'Users', icon: UsersIcon, route: '/admin-dashboard/users' },
  { id: 'counselors', name: 'Counselors', icon: UserCheckIcon, route: '/admin-dashboard/counselors' },
  { id: 'sessions', name: 'Sessions', icon: FileTextIcon, route: '/admin-dashboard/sessions' },
  { id: 'settings', name: 'Settings', icon: SettingsIcon, route: '/admin-dashboard/settings' }
];

const stats = ref({
  totalUsers: 0,
  newUsersThisMonth: 0,
  activeCounselors: 0,
  pendingCounselors: 0,
  totalSessions: 0,
  sessionsThisWeek: 0,
  pendingReviews: 0
});

const recentActivity = ref([
  {
    id: 1,
    title: 'New counselor registration',
    timestamp: '5 minutes ago',
    status: 'Pending',
    color: 'bg-yellow-500',
    badgeClass: 'bg-yellow-100 text-yellow-800'
  },
  {
    id: 2,
    title: 'User reported an issue',
    timestamp: '1 hour ago',
    status: 'New',
    color: 'bg-red-500',
    badgeClass: 'bg-red-100 text-red-800'
  },
  {
    id: 3,
    title: 'Session completed successfully',
    timestamp: '2 hours ago',
    status: 'Completed',
    color: 'bg-green-500',
    badgeClass: 'bg-green-100 text-green-800'
  }
]);

const users = ref<any[]>([]);
const counselors = ref<any[]>([]);
const sessions = ref<any[]>([]);

const newAdmin = ref({
  firstName: '',
  lastName: '',
  email: '',
  password: ''
});

const settings = ref({
  autoApprove: false,
  emailNotifications: true
});

const filteredUsers = computed(() => {
  let filtered = users.value;

  if (userFilter.value !== 'all') {
    filtered = filtered.filter(user => user.status === userFilter.value);
  }

  if (userSearch.value) {
    const search = userSearch.value.toLowerCase();
    filtered = filtered.filter(user =>
      user.name.toLowerCase().includes(search) ||
      user.email.toLowerCase().includes(search)
    );
  }

  return filtered;
});

const filteredCounselors = computed(() => {
  if (counselorFilter.value === 'all') {
    return counselors.value;
  }
  return counselors.value.filter(c => c.status === counselorFilter.value);
});

const handleLogout = () => {
  localStorage.removeItem('admin_token');
  localStorage.removeItem('authToken');
  localStorage.removeItem('userType');
  localStorage.removeItem('admin_id');
  localStorage.removeItem('token_expires_at');
  router.push('/admin-login');
};

const viewUser = (user: any) => {
  // Implement user details view
};

const suspendUser = async (user: any) => {
  if (confirm(`Are you sure you want to suspend ${user.name}?`)) {
    try {
      await axios.post(`${import.meta.env.VITE_API_BASE_URL}/admin/users/${user.id}/suspend`);
      user.status = 'suspended';
    } catch (error) {
      console.error('Error suspending user:', error);
    }
  }
};

const activateUser = async (user: any) => {
  try {
    await axios.post(`${import.meta.env.VITE_API_BASE_URL}/admin/users/${user.id}/activate`);
    user.status = 'active';
  } catch (error) {
    console.error('Error activating user:', error);
  }
};

const viewCounselorDocuments = (counselor: any) => {
  selectedCounselor.value = counselor;
  showDocumentModal.value = true;
};

const approveCounselor = async (counselor: any) => {
  if (confirm(`Approve ${counselor.name} as a counselor?`)) {
    try {
      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/admin/counselors/${counselor.id}/approve`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      counselor.status = 'approved';
      stats.value.activeCounselors++;
      stats.value.pendingCounselors--;
    } catch (error) {
      console.error('Error approving counselor:', error);
      alert('Failed to approve counselor');
    }
  }
};

const rejectCounselor = async (counselor: any) => {
  const reason = prompt('Reason for rejection:');
  if (reason) {
    try {
      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/admin/counselors/${counselor.id}/reject`,
        { reason },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      counselor.status = 'rejected';
      stats.value.pendingCounselors--;
    } catch (error) {
      console.error('Error rejecting counselor:', error);
      alert('Failed to reject counselor');
    }
  }
};

const createAdmin = async () => {
  try {
    const token = localStorage.getItem('admin_token') || localStorage.getItem('authToken');
    const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';
    
    await axios.post(
      `${baseURL}/admin/invite`,
      {
        email: newAdmin.value.email,
        password: newAdmin.value.password,
        first_name: newAdmin.value.firstName,
        last_name: newAdmin.value.lastName
      },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    alert('Admin account created successfully!');
    newAdmin.value = { firstName: '', lastName: '', email: '', password: '' };
  } catch (error: any) {
    const errorMsg = error.response?.data?.detail || error.response?.data?.error || 'Failed to create admin account';
    alert(errorMsg);
    console.error('Error creating admin:', error);
  }
};

const toggleSetting = (setting: 'autoApprove' | 'emailNotifications') => {
  settings.value[setting] = !settings.value[setting];
  // Save to backend
};

const fetchDashboardData = async () => {
  try {
    const token = localStorage.getItem('admin_token') || localStorage.getItem('authToken');
    if (!token) {
      router.push('/admin-login');
      return;
    }
    
    const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';

    // Only fetch data if endpoints exist - these may not be implemented yet
    // Note: These endpoints return 404 as they're not implemented yet
    try {
      const [statsRes, usersRes, counselorsRes, sessionsRes] = await Promise.all([
        axios.get(`${baseURL}/admin/stats`, { headers: { Authorization: `Bearer ${token}` } }).catch((err) => {
          if (err.response?.status === 404) {
            // Endpoint not implemented yet - this is expected
            return { data: null };
          }
          throw err;
        }),
        axios.get(`${baseURL}/admin/users`, { headers: { Authorization: `Bearer ${token}` } }).catch((err) => {
          if (err.response?.status === 404) {
            return { data: null };
          }
          throw err;
        }),
        axios.get(`${baseURL}/admin/counselors`, { headers: { Authorization: `Bearer ${token}` } }).catch((err) => {
          if (err.response?.status === 404) {
            return { data: null };
          }
          throw err;
        }),
        axios.get(`${baseURL}/admin/sessions`, { headers: { Authorization: `Bearer ${token}` } }).catch((err) => {
          if (err.response?.status === 404) {
            return { data: null };
          }
          throw err;
        })
      ]);

      // Only update if data is returned (not 404)
      if (statsRes.data) stats.value = statsRes.data;
      if (usersRes.data) users.value = usersRes.data;
      if (counselorsRes.data) counselors.value = counselorsRes.data;
      if (sessionsRes.data) sessions.value = sessionsRes.data;
    } catch (error) {
      // Endpoints may not be implemented yet (404) - this is expected
      // Only log non-404 errors
      if ((error as any)?.response?.status !== 404) {
        console.warn('Error fetching admin dashboard data:', error);
      }
    }
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
  }
};

onMounted(() => {
  // Check if admin is logged in
  const token = localStorage.getItem('admin_token') || localStorage.getItem('authToken');
  if (!token) {
    router.push('/admin-login');
    return;
  }
  
  // Get admin name from stored data
  const adminData = localStorage.getItem('user');
  if (adminData) {
    try {
      const admin = JSON.parse(adminData);
      adminName.value = admin.first_name || admin.email || 'Admin';
    } catch (e) {
      console.error('Error parsing admin data:', e);
    }
  }
  
  fetchDashboardData();
});
</script>
