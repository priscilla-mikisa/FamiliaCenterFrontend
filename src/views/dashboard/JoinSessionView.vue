<template>
  <div class="max-w-4xl mx-auto p-4 sm:p-6">
    <div class="flex flex-col lg:flex-row gap-6">
      <!-- Video Call Section -->
      <div class="flex-1">
        <h1 class="text-2xl font-bold mb-2">Join Your Session</h1>
        <p class="text-gray-600 mb-6">Connect with your counselor for your scheduled appointment</p>

        <div class="bg-gray-900 rounded-xl overflow-hidden aspect-video relative">
          <!-- Video placeholder with counselor info -->
          <div class="absolute inset-0 flex items-center justify-center bg-gray-800">
            <div class="text-center">
              <div class="w-24 h-24 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <UserIcon class="w-12 h-12 text-indigo-600" />
              </div>
              <h3 class="text-xl font-medium text-white">{{ sessionData?.counselor || 'Dr. Sarah Johnson' }}</h3>
              <p class="text-gray-300 mt-1">{{ sessionStatus }}</p>
            </div>
          </div>

          <!-- Local video preview -->
          <div v-if="!videoOff" class="absolute bottom-4 right-4 w-1/4 h-1/4 bg-gray-700 rounded-lg overflow-hidden border-2 border-white">
            <div class="w-full h-full flex items-center justify-center">
              <UserIcon class="w-8 h-8 text-white" />
            </div>
          </div>
        </div>

        <!-- Call controls -->
        <div class="flex justify-center gap-4 mt-6">
          <button
            :class="`p-3 rounded-full ${micMuted ? 'bg-red-500 hover:bg-red-600' : 'bg-gray-200 hover:bg-gray-300'} transition-colors`"
            @click="micMuted = !micMuted"
          >
            <MicOffIcon v-if="micMuted" class="w-5 h-5 text-white" />
            <MicIcon v-else class="w-5 h-5" />
          </button>

          <button
            :class="`p-3 rounded-full ${videoOff ? 'bg-red-500 hover:bg-red-600' : 'bg-gray-200 hover:bg-gray-300'} transition-colors`"
            @click="videoOff = !videoOff"
          >
            <VideoOffIcon v-if="videoOff" class="w-5 h-5 text-white" />
            <VideoIcon v-else class="w-5 h-5" />
          </button>

          <button
            class="p-3 rounded-full bg-red-500 hover:bg-red-600 text-white transition-colors"
            @click="endSession"
          >
            <PhoneOffIcon class="w-5 h-5" />
          </button>

          <button
            :class="`px-6 py-3 rounded-full bg-green-600 hover:bg-green-700 text-white font-medium flex items-center gap-2 ${connecting ? 'opacity-75' : ''}`"
            @click="handleJoinSession"
            :disabled="connecting"
          >
            <div v-if="connecting" class="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
            <span v-if="connecting">Connecting...</span>
            <template v-else>
              <VideoIcon class="w-5 h-5" />
              Join Now
            </template>
          </button>
        </div>
      </div>

      <!-- Session Details Sidebar -->
      <div class="lg:w-80 bg-white rounded-xl shadow p-6 h-fit">
        <h2 class="text-xl font-semibold mb-4">Session Details</h2>

        <div class="space-y-4">
          <div>
            <h3 class="font-medium text-gray-900">{{ sessionData?.title || 'Initial Consultation' }}</h3>
            <p class="text-gray-600 text-sm">Session ID: {{ sessionId }}</p>
          </div>

          <div class="flex items-start gap-3">
            <CalendarIcon class="w-5 h-5 text-gray-400 mt-1" />
            <div>
              <p class="text-sm text-gray-500">Date & Time</p>
              <p class="text-gray-900">{{ formatSessionDate() }}</p>
            </div>
          </div>

          <div class="flex items-start gap-3">
            <ClockIcon class="w-5 h-5 text-gray-400 mt-1" />
            <div>
              <p class="text-sm text-gray-500">Duration</p>
              <p class="text-gray-900">{{ sessionData?.duration || 45 }} minutes</p>
            </div>
          </div>

          <div class="flex items-start gap-3">
            <UserIcon class="w-5 h-5 text-gray-400 mt-1" />
            <div>
              <p class="text-sm text-gray-500">Counselor</p>
              <p class="text-gray-900">{{ sessionData?.counselor || 'Dr. Sarah Johnson' }}</p>
            </div>
          </div>

          <div class="pt-4 border-t border-gray-200">
            <h4 class="text-sm font-medium text-gray-500 mb-2">Need help?</h4>
            <button class="text-sm text-blue-600 hover:text-blue-800">
              Contact support
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import {
  VideoIcon,
  VideoOffIcon,
  MicIcon,
  MicOffIcon,
  PhoneOffIcon,
  UserIcon,
  CalendarIcon,
  ClockIcon
} from 'lucide-vue-next';
// import { SessionService } from '@/services/apiServices';

const router = useRouter();
const route = useRoute();

const sessionId = route.params.sessionId as string;
interface SessionData {
  id: string;
  title: string;
  counselor: string;
  duration: number;
  status: string;
}

const sessionData = ref<SessionData | null>(null);
const connecting = ref(false);
const micMuted = ref(false);
const videoOff = ref(false);
const sessionStatus = ref('Waiting to connect...');

const handleJoinSession = () => {
  connecting.value = true;
  sessionStatus.value = 'Connecting...';

  // Simulate connection
  setTimeout(() => {
    connecting.value = false;
    sessionStatus.value = 'Connected';
    // In a real app, this would integrate with your video calling solution
    alert(`Successfully joined session ${sessionId}`);
  }, 1500);
};

const endSession = () => {
  if (confirm('Are you sure you want to end the session?')) {
    router.push('/dashboard/sessions');
  }
};

const formatSessionDate = () => {
  // Mock date for demo
  const date = new Date();
  date.setHours(date.getHours() + 1); // 1 hour from now

  return date.toLocaleString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

onMounted(async () => {
  try {
    // In a real app, fetch session details
    // const response = await SessionService.getSession(Number(sessionId));
    // sessionData.value = response.data;

    // Mock session data for demo
    sessionData.value = {
      id: sessionId,
      title: 'Initial Consultation',
      counselor: 'Dr. Sarah Johnson',
      duration: 45,
      status: 'scheduled'
    };
  } catch (error) {
    console.error('Failed to load session:', error);
    alert('Failed to load session details');
    router.push('/dashboard/sessions');
  }
});
</script>
