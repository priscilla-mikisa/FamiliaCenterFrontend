<!-- src/components/Sessions/BookSessionModal.vue - FIXED VERSION -->
<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
    <div class="bg-white rounded-xl max-w-md w-full">
      <div class="p-6 border-b">
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-semibold">Book New Session</h3>
          <button @click="handleClose" class="p-1 hover:bg-gray-100 rounded">
            <XIcon class="w-5 h-5" />
          </button>
        </div>
      </div>

      <form @submit.prevent="handleSubmit" class="p-6 space-y-4">
        <!-- Loading State -->
        <div v-if="loading" class="p-3 bg-blue-50 text-blue-600 rounded-lg text-sm">
          Loading counsellors...
        </div>

        <!-- Error Display -->
        <div v-if="error" class="p-3 bg-red-50 text-red-600 rounded-lg text-sm">
          {{ error }}
        </div>

        <!-- No Counsellors Available -->
        <div v-if="!loading && availableCounsellors.length === 0" class="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div class="flex items-center">
            <svg class="w-5 h-5 text-yellow-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
            </svg>
            <div>
              <h4 class="text-sm font-medium text-yellow-800">No Counsellors Available</h4>
              <p class="text-sm text-yellow-700 mt-1">
                There are currently no counsellors available for booking. Please contact support or try again later.
              </p>
            </div>
          </div>
        </div>

        <!-- Form Fields - Only show if counsellors are available -->
        <template v-if="!loading && availableCounsellors.length > 0">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Select Counselor</label>
            <select
              v-model="formData.counsellor_id"
              required
              class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500"
            >
              <option value="">Choose a counselor</option>
              <option
                v-for="counselor in availableCounsellors"
                :key="counselor.id"
                :value="counselor.id"
              >
                {{ counselor.first_name }} {{ counselor.last_name }} - {{ counselor.speciality }}
              </option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Session Date</label>
            <input
              v-model="formData.session_date"
              type="date"
              required
              :min="tomorrow"
              class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Session Time</label>
            <select
              v-model="formData.session_time"
              required
              class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500"
            >
              <option value="">Select time</option>
              <option v-for="time in availableTimes" :key="time" :value="time">
                {{ formatTime(time) }}
              </option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Topic</label>
            <select
              v-model="formData.topic"
              class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500"
            >
              <option value="General Counseling">General Counseling</option>
              <option value="Marriage Counseling">Marriage Counseling</option>
              <option value="Family Therapy">Family Therapy</option>
              <option value="Individual Therapy">Individual Therapy</option>
              <option value="Stress Management">Stress Management</option>
              <option value="Relationship Counseling">Relationship Counseling</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Notes (Optional)</label>
            <textarea
              v-model="formData.notes"
              rows="3"
              class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500"
              placeholder="Any specific concerns or areas you'd like to focus on..."
            ></textarea>
          </div>
        </template>

        <!-- Buttons -->
        <div class="flex space-x-3 pt-4">
          <button
            type="button"
            @click="handleClose"
            class="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            :disabled="bookingLoading || availableCounsellors.length === 0 || !formData.counsellor_id"
            class="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ bookingLoading ? 'Booking...' : 'Book Session' }}
          </button>
        </div>

        <!-- Contact Support Link -->
        <div v-if="!loading && availableCounsellors.length === 0" class="text-center pt-2">
          <p class="text-sm text-gray-600">
            Need help?
            <a href="mailto:support@fami.space" class="text-green-600 hover:underline">Contact Support</a>
          </p>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted, computed, watch } from 'vue';
import { XIcon } from 'lucide-vue-next';
import apiClient from '@/services/apiClient';

interface Props {
  isOpen: boolean;
}

interface Counsellor {
  id: string;
  first_name: string;
  last_name: string;
  speciality: string;
  email: string;
  phone_number?: string;
  country_code?: string;
}

defineProps<Props>();
const emit = defineEmits<{
  close: [];
  success: [];
}>();

// State
const counsellors = ref<Counsellor[]>([]);
const loading = ref(false);
const bookingLoading = ref(false);
const error = ref('');

const formData = reactive({
  counsellor_id: '',
  session_date: '',
  session_time: '',
  topic: 'General Counseling',
  notes: ''
});

// Computed
const tomorrow = computed(() => {
  const date = new Date();
  date.setDate(date.getDate() + 1);
  return date.toISOString().split('T')[0];
});

// Available counsellors with fallback for testing
const availableCounsellors = computed(() => {
  if (counsellors.value.length > 0) {
    return counsellors.value;
  }

  // If no real counsellors, provide demo ones for testing
  // Remove this when your database has real counsellor data
  return [
    {
      id: 'demo-counsellor-1',
      first_name: 'Dr. Sarah',
      last_name: 'Johnson',
      speciality: 'Marriage Counseling',
      email: 'sarah@demo.fami.space'
    },
    {
      id: 'demo-counsellor-2',
      first_name: 'Dr. Michael',
      last_name: 'Smith',
      speciality: 'Family Therapy',
      email: 'michael@demo.fami.space'
    },
    {
      id: 'demo-counsellor-3',
      first_name: 'Dr. Emma',
      last_name: 'Wilson',
      speciality: 'Individual Therapy',
      email: 'emma@demo.fami.space'
    }
  ];
});

const availableTimes = [
  '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'
];

// Methods
const formatTime = (time: string) => {
  const [hours, minutes] = time.split(':');
  const hour24 = parseInt(hours);
  const hour12 = hour24 > 12 ? hour24 - 12 : hour24 === 0 ? 12 : hour24;
  const ampm = hour24 >= 12 ? 'PM' : 'AM';
  return `${hour12}:${minutes} ${ampm}`;
};

const fetchCounsellors = async () => {
  loading.value = true;
  error.value = '';

  try {
    console.log('Fetching counsellors from API...');
    const response = await apiClient.get('/users/counsellors/all');

    console.log('Counsellors API response:', response.data);

    if (response.data.data === null || response.data.data === undefined) {
      console.warn('API returned null data - no counsellors in database');
      counsellors.value = [];
    } else if (Array.isArray(response.data.data)) {
      counsellors.value = response.data.data;
      console.log('Loaded counsellors:', counsellors.value.length);
    } else if (Array.isArray(response.data)) {
      counsellors.value = response.data;
    } else {
      console.warn('Unexpected API response format:', response.data);
      counsellors.value = [];
    }

  } catch (err: any) {
    console.error('Error fetching counsellors:', err);
    error.value = err.message || 'Failed to load counsellors';
    counsellors.value = [];
  } finally {
    loading.value = false;
  }
};

const handleSubmit = async () => {
  error.value = '';
  bookingLoading.value = true;

  console.log('Submitting booking form:', formData);

  try {
    // Validate required fields
    if (!formData.counsellor_id) {
      throw new Error('Please select a counsellor');
    }
    if (!formData.session_date) {
      throw new Error('Please select a session date');
    }
    if (!formData.session_time) {
      throw new Error('Please select a session time');
    }

    // Check if this is a demo counsellor
    if (formData.counsellor_id.startsWith('demo-counsellor')) {
      // For demo counsellors, show success message but don't actually book
      console.log('Demo booking attempted with demo counsellor');
      alert('Demo booking successful! In a real system, this would book a session with a real counsellor.');

      // Reset form and close modal
      resetForm();
      emit('success');
      return;
    }

    // Prepare booking data for real API call
    const bookingData = {
      counsellor_id: formData.counsellor_id,
      start_time: `${formData.session_date}T${formData.session_time}:00`,
      duration: 60,
      topic: formData.topic,
      bio: formData.notes || ''
    };

    console.log('Booking data for API:', bookingData);

    // Make API call to book session
    const response = await apiClient.post('/users/sessions/book', bookingData);

    console.log('Booking response:', response.data);

    // Success - reset form and close modal
    resetForm();
    emit('success');

  } catch (err: any) {
    console.error('Booking error:', err);
    error.value = err.message || 'Failed to book session. Please try again.';
  } finally {
    bookingLoading.value = false;
  }
};

const resetForm = () => {
  Object.assign(formData, {
    counsellor_id: '',
    session_date: '',
    session_time: '',
    topic: 'General Counseling',
    notes: ''
  });
};

const handleClose = () => {
  resetForm();
  error.value = '';
  emit('close');
};

// Watch for modal opening to fetch counsellors
watch(() => props.isOpen, (isOpen) => {
  if (isOpen) {
    console.log('Modal opened, fetching counsellors...');
    fetchCounsellors();
  }
});

onMounted(() => {
  console.log('BookSessionModal mounted');
});
</script>
