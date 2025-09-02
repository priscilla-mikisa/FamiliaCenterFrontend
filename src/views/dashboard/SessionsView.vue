<template>
  <div class="p-6 space-y-6">
    <div class="bg-white rounded-lg shadow p-6">
      <div class="flex justify-between items-center">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Sessions</h1>
          <p class="text-gray-600">Book sessions with our counselors</p>
        </div>
        <button
          @click="loadData"
          :disabled="loading"
          class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {{ loading ? 'Loading...' : 'Refresh' }}
        </button>
      </div>
    </div>

    <div v-if="loading && counselors.length === 0" class="text-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
      <p class="mt-4 text-gray-600">Loading counselors...</p>
    </div>

    <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4">
      <div class="flex items-center">
        <svg class="w-5 h-5 text-red-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"></path>
        </svg>
        <div>
          <h3 class="text-sm font-medium text-red-800">Error Loading Data</h3>
          <p class="text-sm text-red-600">{{ error }}</p>
        </div>
      </div>
      <button @click="loadData" class="mt-3 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
        Try Again
      </button>
    </div>

    <div v-else-if="counselors.length === 0" class="bg-white rounded-lg shadow p-12 text-center">
      <svg class="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
      </svg>
      <h3 class="text-xl font-semibold text-gray-900 mb-2">No Counselors Available</h3>
      <p class="text-gray-600 mb-6">There are currently no counselors available for booking.</p>
      <button @click="loadData" class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
        Check Again
      </button>
    </div>

    <!-- Counselors List -->
    <div v-else class="grid gap-6 lg:grid-cols-2">
      <!-- Available Counselors -->
      <div class="space-y-4">
        <h2 class="text-xl font-semibold text-gray-900">Available Counselors</h2>
        <div class="space-y-4">
          <div
            v-for="counselor in counselors"
            :key="counselor.id"
            class="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow"
          >
            <div class="flex items-start space-x-4">
              <div class="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                </svg>
              </div>
              <div class="flex-1">
                <h3 class="text-lg font-medium text-gray-900">
                  {{ counselor.salutation || 'Dr.' }} {{ counselor.first_name }} {{ counselor.last_name }}
                </h3>
                <p class="text-sm text-blue-600 font-medium">{{ counselor.speciality }}</p>
                <p v-if="counselor.bio" class="text-sm text-gray-600 mt-2">{{ counselor.bio }}</p>
                <div class="flex items-center mt-2 text-xs text-gray-500">
                  <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                  </svg>
                  {{ counselor.email }}
                </div>
                <button
                  @click="openBookingModal(counselor)"
                  class="mt-4 w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
                >
                  Book Session
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="space-y-4">
        <h2 class="text-xl font-semibold text-gray-900">My Sessions</h2>

        <div v-if="sessionsLoading" class="bg-white rounded-lg shadow p-6 text-center">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p class="mt-2 text-gray-600">Loading sessions...</p>
        </div>

        <div v-else-if="sessions.length > 0" class="space-y-3">
          <div
            v-for="session in sessions"
            :key="session.id"
            class="bg-white rounded-lg shadow p-4"
          >
            <div class="flex justify-between items-start">
              <div>
                <h4 class="font-medium text-gray-900">{{ getCounselorName(session) }}</h4>
                <p class="text-sm text-gray-600">{{ formatDateTime(session.start_time) }}</p>
                <span
                  :class="getStatusClass(session.status)"
                  class="inline-block px-2 py-1 text-xs font-medium rounded-full mt-2"
                >
                  {{ getStatusText(session.status) }}
                </span>
              </div>
              <button
                v-if="canJoinSession(session)"
                @click="joinSession(session)"
                class="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
              >
                Join
              </button>
            </div>
          </div>
        </div>

        <div v-else class="bg-white rounded-lg shadow p-8 text-center">
          <svg class="w-12 h-12 text-gray-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 0V6a2 2 0 012-2h4a2 2 0 012 2v1m-6 0h12l-1 10a2 2 0 01-2 2H8a2 2 0 01-2-2L5 7h3z"></path>
          </svg>
          <p class="text-gray-600">No sessions booked yet</p>
        </div>
      </div>
    </div>

    <div v-if="showBookingModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-lg max-w-md w-full">
        <div class="p-6 border-b">
          <div class="flex justify-between items-center">
            <h3 class="text-lg font-semibold">Book Session</h3>
            <button @click="closeBookingModal" class="text-gray-400 hover:text-gray-600">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
          <p class="text-sm text-gray-600 mt-1" v-if="selectedCounselor">
            with {{ selectedCounselor.salutation || 'Dr.' }} {{ selectedCounselor.first_name }} {{ selectedCounselor.last_name }}
          </p>
        </div>

        <form @submit.prevent="bookSession" class="p-6 space-y-4">
          <div v-if="bookingError" class="p-3 bg-red-50 border border-red-200 rounded text-sm text-red-600">
            {{ bookingError }}
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Date</label>
            <input
              v-model="bookingForm.date"
              type="date"
              required
              :min="minDate"
              class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Time</label>
            <select
              v-model="bookingForm.time"
              required
              class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select time</option>
              <option value="09:00">9:00 AM</option>
              <option value="10:00">10:00 AM</option>
              <option value="11:00">11:00 AM</option>
              <option value="14:00">2:00 PM</option>
              <option value="15:00">3:00 PM</option>
              <option value="16:00">4:00 PM</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Topic</label>
            <select
              v-model="bookingForm.topic"
              class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="General Counseling">General Counseling</option>
              <option value="Marriage Counseling">Marriage Counseling</option>
              <option value="Family Therapy">Family Therapy</option>
              <option value="Individual Therapy">Individual Therapy</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Notes (Optional)</label>
            <textarea
              v-model="bookingForm.notes"
              rows="3"
              class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Any specific concerns or areas you'd like to focus on..."
            ></textarea>
          </div>

          <div class="flex space-x-3 pt-4">
            <button
              type="button"
              @click="closeBookingModal"
              class="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              :disabled="bookingLoading"
              class="flex-1 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
            >
              {{ bookingLoading ? 'Booking...' : 'Book Session' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <div
      v-if="successMessage"
      class="fixed bottom-4 right-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg z-50"
    >
      {{ successMessage }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import apiClient from '@/services/apiClient';

interface Counselor {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  speciality: string;
  bio?: string;
  salutation?: string;
}

interface Session {
  id: string;
  start_time: string;
  status: string;
  meeting_link?: string;
  counsellor?: {
    first_name: string;
    last_name: string;
  };
}

interface BookingForm {
  date: string;
  time: string;
  topic: string;
  notes: string;
}

const loading = ref<boolean>(false);
const sessionsLoading = ref<boolean>(false);
const bookingLoading = ref<boolean>(false);
const error = ref<string>('');
const bookingError = ref<string>('');
const successMessage = ref<string>('');
const counselors = ref<Counselor[]>([]);
const sessions = ref<Session[]>([]);
const showBookingModal = ref<boolean>(false);
const selectedCounselor = ref<Counselor | null>(null);

const bookingForm = ref<BookingForm>({
  date: '',
  time: '',
  topic: 'General Counseling',
  notes: ''
});

const minDate = computed(() => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return tomorrow.toISOString().split('T')[0];
});

const loadData = async (): Promise<void> => {
  await Promise.all([
    fetchCounselors(),
    fetchSessions()
  ]);
};

const fetchCounselors = async (): Promise<void> => {
  loading.value = true;
  error.value = '';

  try {
    const response = await apiClient.get('/users/counsellors/all');

    if (response.data?.data === null) {
      counselors.value = [];
    } else if (Array.isArray(response.data)) {
      counselors.value = response.data;
    } else if (Array.isArray(response.data?.data)) {
      counselors.value = response.data.data;
    } else {
      counselors.value = [];
    }

    console.log('Loaded counselors:', counselors.value.length);
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Failed to load counselors';
    error.value = errorMessage;
    counselors.value = [];
  } finally {
    loading.value = false;
  }
};

const fetchSessions = async (): Promise<void> => {
  sessionsLoading.value = true;

  try {
    const response = await apiClient.get('/users/sessions/all');

    if (response.data?.data === null) {
      sessions.value = [];
    } else if (Array.isArray(response.data)) {
      sessions.value = response.data;
    } else if (Array.isArray(response.data?.data)) {
      sessions.value = response.data.data;
    } else {
      sessions.value = [];
    }

    console.log('Loaded sessions:', sessions.value.length);
  } catch (err) {
    console.error('Failed to load sessions:', err);
    sessions.value = [];
  } finally {
    sessionsLoading.value = false;
  }
};

const openBookingModal = (counselor: Counselor): void => {
  selectedCounselor.value = counselor;
  showBookingModal.value = true;
  bookingError.value = '';
  bookingForm.value = {
    date: '',
    time: '',
    topic: 'General Counseling',
    notes: ''
  };
};

const closeBookingModal = (): void => {
  showBookingModal.value = false;
  selectedCounselor.value = null;
  bookingError.value = '';
};

const bookSession = async (): Promise<void> => {
  if (!selectedCounselor.value) return;

  bookingLoading.value = true;
  bookingError.value = '';

  try {
    const dateTimeString = `${bookingForm.value.date}T${bookingForm.value.time}:00`;

    const sessionDate = new Date(dateTimeString);
    const startTime = sessionDate.toISOString();

    const bookingData = {
      counsellor_id: selectedCounselor.value.id,
      start_time: startTime,
      duration: 60,
      topic: bookingForm.value.topic,
      bio: bookingForm.value.notes || ''
    };

    console.log('Booking data:', bookingData);

    await apiClient.post('/users/sessions/book', bookingData);

    closeBookingModal();
    showSuccessMessage('Session booked successfully! Waiting for counselor approval.');

    await fetchSessions();
  } catch (err) {
    console.error('Booking error:', err);
    const errorMessage = err instanceof Error ? err.message : 'Failed to book session';
    bookingError.value = errorMessage;
  } finally {
    bookingLoading.value = false;
  }
};

const showSuccessMessage = (message: string): void => {
  successMessage.value = message;
  setTimeout(() => {
    successMessage.value = '';
  }, 5000);
};

const getCounselorName = (session: Session): string => {
  if (session.counsellor) {
    return `${session.counsellor.first_name} ${session.counsellor.last_name}`;
  }
  return 'Unknown Counselor';
};

const formatDateTime = (dateTimeString: string): string => {
  try {
    const date = new Date(dateTimeString);
    return date.toLocaleString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch {
    return 'Invalid date';
  }
};

const getStatusText = (status: string): string => {
  const statusMap: Record<string, string> = {
    'pending': 'Pending',
    'confirmed': 'Confirmed',
    'accepted': 'Accepted',
    'rejected': 'Rejected',
    'completed': 'Completed',
    'cancelled': 'Cancelled'
  };
  return statusMap[status] || status;
};

const getStatusClass = (status: string): string => {
  const classMap: Record<string, string> = {
    'pending': 'bg-yellow-100 text-yellow-800',
    'confirmed': 'bg-blue-100 text-blue-800',
    'accepted': 'bg-green-100 text-green-800',
    'rejected': 'bg-red-100 text-red-800',
    'completed': 'bg-gray-100 text-gray-800',
    'cancelled': 'bg-red-100 text-red-800'
  };
  return classMap[status] || 'bg-gray-100 text-gray-800';
};

const canJoinSession = (session: Session): boolean => {
  if (!['confirmed', 'accepted'].includes(session.status)) return false;

  try {
    const sessionDate = new Date(session.start_time);
    const now = new Date();
    const timeDiff = sessionDate.getTime() - now.getTime();

    return timeDiff <= 15 * 60 * 1000 && timeDiff >= -60 * 60 * 1000;
  } catch {
    return false;
  }
};

const joinSession = (session: Session): void => {
  if (session.meeting_link) {
    window.open(session.meeting_link, '_blank');
  } else {
    alert('Meeting link will be available when the counselor starts the session.');
  }
};

onMounted(() => {
  loadData();
});
</script>
