<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
    <div class="bg-white rounded-xl max-w-md w-full">
      <div class="p-6 border-b">
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-semibold">Book Session with {{ counselor?.first_name }} {{ counselor?.last_name }}</h3>
          <button @click="$emit('close')" class="p-1 hover:bg-gray-100 rounded">
            <XIcon class="w-5 h-5" />
          </button>
        </div>
      </div>

      <form @submit.prevent="handleBooking" class="p-6 space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Session Date</label>
          <input
            v-model="bookingForm.session_date"
            type="date"
            :min="minDate"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Session Time</label>
          <input
            v-model="bookingForm.session_time"
            type="time"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Duration (minutes)</label>
          <select
            v-model="bookingForm.duration"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
          >
            <option value="30">30 minutes</option>
            <option value="45">45 minutes</option>
            <option value="60">60 minutes</option>
            <option value="90">90 minutes</option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Topic/Notes</label>
          <textarea
            v-model="bookingForm.topic"
            rows="3"
            placeholder="Briefly describe what you'd like to discuss..."
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
          ></textarea>
        </div>

        <div class="flex space-x-3 pt-4">
          <button
            type="button"
            @click="$emit('close')"
            class="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            :disabled="bookingLoading"
            class="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
          >
            {{ bookingLoading ? 'Booking...' : 'Book Session' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { XIcon } from 'lucide-vue-next';
import { useSessions } from '@/composables/useSessions';
import type { CounsellorResponse } from '@/services/apiService';

interface Props {
  isOpen: boolean;
  counselor: CounsellorResponse | null;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  close: [];
  success: [];
}>();

const { bookSession } = useSessions();

const bookingForm = ref({
  session_date: '',
  session_time: '',
  duration: '60',
  topic: ''
});

const bookingLoading = ref(false);

const minDate = computed(() => {
  const today = new Date();
  return today.toISOString().split('T')[0];
});

const handleBooking = async (): Promise<void> => {
  if (!props.counselor) return;

  bookingLoading.value = true;
  try {
    await bookSession({
      counsellor_id: props.counselor.id,
      session_date: bookingForm.value.session_date,
      session_time: bookingForm.value.session_time,
      topic: bookingForm.value.topic,
      notes: bookingForm.value.topic
    });

    bookingForm.value = {
      session_date: '',
      session_time: '',
      duration: '60',
      topic: ''
    };

    emit('success');
  } catch (error) {
    console.error('Booking failed:', error);
    alert('Failed to book session. Please try again.');
  } finally {
    bookingLoading.value = false;
  }
};
</script>
