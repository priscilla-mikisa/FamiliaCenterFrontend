<!-- src/components/Sessions/SessionDetailsModal.vue -->
<template>
  <div v-if="isOpen && session" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
    <div class="bg-white rounded-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
      <div class="p-6 border-b">
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-semibold">Session Details</h3>
          <button @click="$emit('close')" class="p-1 hover:bg-gray-100 rounded">
            <XIcon class="w-5 h-5" />
          </button>
        </div>
      </div>

      <div class="p-6 space-y-4">
        <div class="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span class="text-gray-500">Counselor:</span>
            <span class="font-medium ml-2">{{ session.counsellor_name || session.counselor?.name || 'TBD' }}</span>
          </div>
          <div>
            <span class="text-gray-500">Status:</span>
            <span :class="`ml-2 px-2 py-1 rounded text-xs ${getSessionStatusClass(session.status)}`">
              {{ getSessionStatusText(session.status) }}
            </span>
          </div>
          <div>
            <span class="text-gray-500">Date & Time:</span>
            <span class="font-medium ml-2">{{ formatSessionTime(session.session_date, session.session_time) }}</span>
          </div>
          <div>
            <span class="text-gray-500">Duration:</span>
            <span class="font-medium ml-2">{{ session.duration || 60 }} minutes</span>
          </div>
        </div>

        <div v-if="session.notes">
          <h4 class="font-medium text-gray-900 mb-2">Session Notes</h4>
          <p class="text-gray-700 bg-gray-50 p-3 rounded-lg">{{ session.notes }}</p>
        </div>

        <div v-if="session.feedback">
          <h4 class="font-medium text-gray-900 mb-2">Your Feedback</h4>
          <p class="text-gray-700 bg-green-50 p-3 rounded-lg">{{ session.feedback }}</p>
        </div>

        <div v-if="session.meeting_link" class="border-t pt-4">
          <h4 class="font-medium text-gray-900 mb-2">Meeting Link</h4>
          <a
            :href="session.meeting_link"
            target="_blank"
            rel="noopener noreferrer"
            class="text-blue-600 hover:text-blue-800 underline"
          >
            Join Session
          </a>
        </div>

        <div class="flex justify-end space-x-3 pt-4 border-t">
          <button @click="$emit('close')" class="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useSessions } from '@/composables/useSessions';
import type { Session } from '@/types';
import { XIcon } from 'lucide-vue-next';

interface Props {
  isOpen: boolean;
  session: Session | null;
}

defineProps<Props>();
defineEmits<{
  close: [];
}>();

const { getSessionStatusText, getSessionStatusClass, formatSessionTime } = useSessions();
</script>
