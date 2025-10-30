<template>
  <div class="jitsi-meeting-room">
    <div class="meeting-header">
      <div class="meeting-info">
        <h3 class="text-lg font-semibold">{{ sessionTitle || 'Video Session' }}</h3>
        <p class="text-sm text-gray-600">{{ sessionDetails }}</p>
      </div>
      <button
        @click="$emit('close')"
        class="p-2 rounded-lg hover:bg-gray-100 transition-colors"
      >
        <XIcon class="w-5 h-5 text-gray-500" />
      </button>
    </div>

    <div class="meeting-container">
      <div v-if="!isMeetingStarted" class="meeting-preparation">
        <div class="preparation-content">
          <div class="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <VideoIcon class="w-10 h-10 text-green-600" />
          </div>
          
          <div class="mb-4">
            <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
              <VideoIcon class="w-4 h-4 mr-2" />
              Jitsi Meet
            </span>
          </div>
          
          <h3 class="text-xl font-semibold text-gray-900 mb-2">Prepare for Your Session</h3>
          <p class="text-gray-600 mb-6">Ensure your camera and microphone are working properly</p>
          
          <div class="device-checks space-y-3 mb-6">
            <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div class="flex items-center space-x-3">
                <div class="w-2 h-2 rounded-full" :class="micStatus ? 'bg-green-500' : 'bg-red-500'"></div>
                <span class="text-sm text-gray-700">Microphone</span>
              </div>
              <button
                @click="testMicrophone"
                class="text-sm text-blue-600 hover:text-blue-700"
              >
                Test
              </button>
            </div>
            <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div class="flex items-center space-x-3">
                <div class="w-2 h-2 rounded-full" :class="cameraStatus ? 'bg-green-500' : 'bg-red-500'"></div>
                <span class="text-sm text-gray-700">Camera</span>
              </div>
              <button
                @click="testCamera"
                class="text-sm text-blue-600 hover:text-blue-700"
              >
                Test
              </button>
            </div>
          </div>

          <div class="meeting-controls">
            <button
              @click="startMeeting"
              :disabled="startingMeeting"
              class="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 font-medium flex items-center space-x-2 mx-auto"
            >
              <VideoIcon v-if="!startingMeeting" class="w-5 h-5" />
              <div v-else class="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
              <span>{{ buttonText }}</span>
            </button>
            <button
              @click="exitMeeting"
              class="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium mt-3"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
      
      <div v-else-if="meetingError" class="error-state">
        <div class="text-center py-12">
          <div class="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircleIcon class="w-10 h-10 text-red-600" />
          </div>
          <h3 class="text-xl font-semibold text-gray-900 mb-2">Unable to Start Meeting</h3>
          <p class="text-gray-600 mb-6">{{ meetingError }}</p>
          <button
            @click="isMeetingStarted = false; meetingError = ''"
            class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
          >
            Try Again
          </button>
        </div>
      </div>

      <div v-else class="meeting-iframe-container">
        <iframe
          v-if="meetingUrl"
          :src="meetingUrl"
          width="100%"
          height="100%"
          frameborder="0"
          allow="camera; microphone; fullscreen; speaker; display-capture"
          allowfullscreen
          @load="onIframeLoad"
          @error="onIframeError"
        ></iframe>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { VideoIcon, XIcon, AlertCircleIcon } from 'lucide-vue-next';

interface Props {
  meetingLink: string;
  sessionTitle?: string;
  sessionDetails?: string;
  userName?: string;
  roomName?: string;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  close: [];
}>();

const isMeetingStarted = ref(false);
const startingMeeting = ref(false);
const meetingError = ref('');
const micStatus = ref(false);
const cameraStatus = ref(false);

const buttonText = computed(() => {
  if (startingMeeting.value) return 'Starting...';
  return 'Join Meeting';
});

const meetingUrl = computed(() => {
  if (!props.meetingLink) return '';

  const baseUrl = props.meetingLink;
  
  const configOverwrite = {
    startWithAudioMuted: false,
    startWithVideoMuted: false,
    enableWelcomePage: false,
    enableClosePage: false,
    disableModeratorIndicator: false,
    startScreenSharing: false,
    enableEmailInStats: false,
    enableDisplayNameInStats: false,
    enableJitsiWatermark: false,
    prejoinPageEnabled: false
  };

  const interfaceConfigOverwrite = {
    TOOLBAR_BUTTONS: [
      'microphone', 'camera', 'closedcaptions', 'desktop', 'fullscreen',
      'fodeviceselection', 'hangup', 'invite', 'settings', 'raisehand',
      'videoquality', 'filmstrip', 'feedback', 'stats', 'shortcuts',
      'tileview', 'videobackgroundblur', 'download', 'help', 'mute-everyone', 'security'
    ],
    SHOW_JITSI_WATERMARK: false,
    SHOW_WATERMARK_FOR_GUESTS: false,
    SHOW_POWERED_BY: false,
    SHOW_BRAND_WATERMARK: false,
    SHOW_POLICY_WATERMARK: false,
    SHOW_LOBBY_BUTTON: true,
    AUDIO_LEVEL_PRIMARY_COLOR: 'rgba(34, 197, 94, 0.4)',
    AUDIO_LEVEL_SECONDARY_COLOR: 'rgba(34, 197, 94, 0.2)',
    POLICY_LOGO: null,
    PROVIDER_NAME: 'FamiSpace',
    APP_NAME: 'FamiSpace',
    DISPLAY_WELCOME_PAGE: false
  };

  const configParam = encodeURIComponent(JSON.stringify(configOverwrite));
  const interfaceConfigParam = encodeURIComponent(JSON.stringify(interfaceConfigOverwrite));
  
  let url = `${baseUrl}?config=${configParam}&interfaceConfig=${interfaceConfigParam}`;
  
  if (props.userName) {
    url += `&userInfo.displayName=${encodeURIComponent(props.userName)}`;
  }

  return url;
});

const testMicrophone = async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    micStatus.value = true;
    stream.getTracks().forEach(track => track.stop());
  } catch (error) {
    micStatus.value = false;
    alert('Microphone access denied. Please allow microphone access in your browser settings.');
  }
};

const testCamera = async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    cameraStatus.value = true;
    stream.getTracks().forEach(track => track.stop());
  } catch (error) {
    cameraStatus.value = false;
    alert('Camera access denied. Please allow camera access in your browser settings.');
  }
};

const startMeeting = async () => {
  startingMeeting.value = true;
  
  try {
    await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    isMeetingStarted.value = true;
  } catch (error) {
    meetingError.value = 'Unable to access your camera or microphone. Please check your browser permissions.';
    console.error('Error starting meeting:', error);
  } finally {
    startingMeeting.value = false;
  }
};

const onIframeLoad = () => {
  console.log('Meeting iframe loaded successfully');
};

const onIframeError = () => {
  meetingError.value = 'Failed to load the meeting room. Please check your connection and try again.';
  isMeetingStarted.value = false;
};

const exitMeeting = () => {
  emit('close');
};

testMicrophone();
testCamera();
</script>

<style scoped>
.jitsi-meeting-room {
  @apply fixed inset-0 z-50 flex flex-col bg-white;
}

.meeting-header {
  @apply flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-white;
}

.meeting-info h3 {
  @apply text-lg font-semibold text-gray-900;
}

.meeting-info p {
  @apply text-sm text-gray-600 mt-1;
}

.meeting-container {
  @apply flex-1 flex items-center justify-center bg-gray-50 overflow-hidden;
}

.meeting-preparation {
  @apply w-full max-w-2xl p-8;
}

.preparation-content {
  @apply bg-white rounded-xl shadow-lg p-8 text-center;
}

.device-checks {
  @apply max-w-md mx-auto;
}

.meeting-controls {
  @apply flex flex-col items-center justify-center space-y-2;
}

.meeting-iframe-container {
  @apply w-full h-full;
}

.error-state {
  @apply w-full h-full flex items-center justify-center bg-white;
}
</style>
