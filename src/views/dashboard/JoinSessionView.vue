<template>
  <div>
    <JitsiMeetingRoom
      v-if="sessionData?.meeting_link"
      :meeting-link="sessionData.meeting_link"
      :session-title="sessionData?.title || getCounselorName()"
      :session-details="`${formatSessionDate()} - ${sessionData?.duration || 45} minutes`"
      :user-name="userName"
      @close="exitSession"
    />
    <div v-else class="max-w-4xl mx-auto p-4 sm:p-6">
      <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
        <h2 class="text-xl font-semibold text-gray-900 mb-2">Session Not Ready</h2>
        <p class="text-gray-600 mb-4">
          The meeting link will be available once the counselor accepts your session request.
        </p>
        <button
          @click="exitSession"
          class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Go Back to Sessions
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import JitsiMeetingRoom from '@/components/Sessions/JitsiMeetingRoom.vue';
import apiClient from '@/services/apiClient';

const router = useRouter();
const route = useRoute();

const sessionId = route.params.sessionId as string;
const userName = ref(localStorage.getItem('userName') || 'User');

interface SessionData {
  id: string;
  title: string;
  counselor: string;
  duration: number;
  status: string;
  meeting_link?: string;
  counsellor?: {
    first_name: string;
    last_name: string;
    speciality?: string;
  };
  start_time?: string;
}

const sessionData = ref<SessionData | null>(null);

const getCounselorName = () => {
  if (sessionData.value?.counsellor) {
    return `${sessionData.value.counsellor.first_name} ${sessionData.value.counsellor.last_name}`;
  }
  return sessionData.value?.counselor || 'Your Counselor';
};

const formatSessionDate = () => {
  if (sessionData.value?.start_time) {
    const date = new Date(sessionData.value.start_time);
    return date.toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
  
  const date = new Date();
  date.setHours(date.getHours() + 1);
  return date.toLocaleString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const exitSession = () => {
  router.push('/dashboard/sessions');
};

onMounted(async () => {
  try {
    const response = await apiClient.get(`/users/sessions/${sessionId}`);
    
    // Handle different response formats
    const session = response.data?.data || response.data?.session || response.data;
    
    sessionData.value = {
      id: session.id || sessionId,
      title: session.topic || session.title || 'Video Session',
      counselor: session.counselor || (session.counsellor ? `${session.counsellor.first_name} ${session.counsellor.last_name}` : 'Counselor'),
      duration: session.duration || 45,
      status: session.status || 'scheduled',
      meeting_link: session.meeting_link,
      counsellor: session.counsellor,
      start_time: session.start_time
    };
    
    if (!sessionData.value.meeting_link) {
      console.warn('No meeting link found for session:', sessionId);
    }
  } catch (error) {
    console.error('Failed to load session:', error);
    alert('Failed to load session details. You will be redirected to sessions page.');
    router.push('/dashboard/sessions');
  }
});
</script>
