<template>
  <div>
    <!-- Session Details Modal -->
    <div v-if="isOpen && session && !showMeetingRoom" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
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

          <!-- Show different messages based on session status -->
          <div v-if="session.status === 'scheduled' || session.status === 'pending'" class="border-t pt-4">
            <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p class="text-sm text-yellow-800">
                <strong>Awaiting counselor approval.</strong> You'll be able to join the session once the counselor confirms it.
              </p>
            </div>
          </div>

          <div v-else-if="session.meeting_link && canJoinSession" class="border-t pt-4">
            <button
              @click="openMeetingRoom"
              class="w-full px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium flex items-center justify-center space-x-2"
            >
              <VideoIcon class="w-5 h-5" />
              <span>Join Video Session</span>
            </button>
          </div>

          <div v-else-if="session.meeting_link && !canJoinSession" class="border-t pt-4">
            <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p class="text-sm text-yellow-800">
                <strong>Session not ready yet.</strong> You can join 15 minutes before the scheduled start time.
              </p>
            </div>
          </div>

          <div class="flex justify-end space-x-3 pt-4 border-t">
            <button @click="$emit('close')" class="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
              Close
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Jitsi Meeting Room -->
    <JitsiMeetingRoom
      v-if="showMeetingRoom && session && session.meeting_link"
      :meeting-link="session.meeting_link"
      :session-title="session.title || (session as any).topic || 'Video Session'"
      :session-details="`${session.counsellor_name || 'Counselor'} - ${formatSessionTime(session.session_date, session.session_time)}`"
      :user-name="userName"
      @close="closeMeetingRoom"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useSessions } from '@/composables/useSessions';
import JitsiMeetingRoom from './JitsiMeetingRoom.vue';
import type { Session } from '@/types';
import { XIcon, VideoIcon } from 'lucide-vue-next';

interface Props {
  isOpen: boolean;
  session: Session | null;
}

const props = defineProps<Props>();
defineEmits<{
  close: [];
}>();

const { getSessionStatusText, getSessionStatusClass, formatSessionTime } = useSessions();
const showMeetingRoom = ref(false);

const userName = ref(localStorage.getItem('userName') || 'User');

const canJoinSession = computed(() => {
  if (!props.session?.session_date || !props.session?.session_time) return false;

  try {
    const sessionDateTime = new Date(`${props.session.session_date}T${props.session.session_time}`);
    const now = new Date();
    const timeDiff = sessionDateTime.getTime() - now.getTime();

    // Allow joining 15 minutes before session starts and up to 1 hour after
    return timeDiff <= 15 * 60 * 1000 && timeDiff >= -60 * 60 * 1000;
  } catch {
    return false;
  }
});

const openMeetingRoom = () => {
  showMeetingRoom.value = true;
};

const closeMeetingRoom = () => {
  showMeetingRoom.value = false;
};
</script>
