<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Forum Management</h1>
        <p class="text-gray-600">Manage all forums and events</p>
      </div>
      <router-link
        to="/admin-dashboard/forums/create"
        class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
      >
        <PlusIcon class="w-4 h-4" />
        <span>Create Forum</span>
      </router-link>
    </div>

    <!-- Filters -->
    <div class="bg-white rounded-lg shadow-sm p-4">
      <div class="flex flex-wrap gap-4">
        <select v-model="filters.status" @change="fetchForums" class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500">
          <option value="">All Status</option>
          <option value="draft">Draft</option>
          <option value="published">Published</option>
          <option value="unpublished">Unpublished</option>
        </select>
        
        <input
          v-model="filters.search"
          type="text"
          placeholder="Search forums..."
          class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 flex-1 min-w-64"
        />
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-12">
      <div class="text-lg text-gray-500">Loading forums...</div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="text-center py-12">
      <div class="text-lg text-red-500">{{ error }}</div>
      <button @click="fetchForums" class="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
        Try Again
      </button>
    </div>

    <!-- Forums Table -->
    <div v-else-if="filteredForums.length > 0" class="bg-white rounded-lg shadow-sm overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Forum</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="forum in filteredForums" :key="forum.id" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap">
                <div>
                  <div class="text-sm font-medium text-gray-900">{{ forum.title }}</div>
                  <div class="text-sm text-gray-500">{{ forum.description }}</div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ forum.date }}</div>
                <div class="text-sm text-gray-500">{{ forum.time }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span 
                  class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
                  :class="getStatusClass(forum)"
                >
                  {{ getStatusText(forum) }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div class="flex flex-wrap gap-2">
                  <!-- Edit button: only show when NOT published -->
                  <router-link
                    v-if="forum.status !== 'published'"
                    :to="`/admin-dashboard/forums/${forum.id}/edit`"
                    class="inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-md bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors"
                  >
                    Edit
                  </router-link>
                  <!-- Publish button: only show when NOT published -->
                  <button
                    v-if="forum.status !== 'published'"
                    @click="publishForum(forum.id)"
                    class="inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-md bg-green-50 text-green-700 hover:bg-green-100 transition-colors"
                  >
                    Publish
                  </button>
                  <!-- Unpublish button: only show when published -->
                  <button
                    v-if="forum.status === 'published'"
                    @click="unpublishForum(forum.id)"
                    class="inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-md bg-orange-50 text-orange-700 hover:bg-orange-100 transition-colors"
                  >
                    Unpublish
                  </button>
                  <!-- Delete button: only show when NOT published (draft or unpublished) -->
                  <button
                    v-if="forum.status !== 'published'"
                    @click="deleteForum(forum.id)"
                    class="inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-md bg-red-50 text-red-700 hover:bg-red-100 transition-colors"
                  >
                    Delete
                  </button>
                  <!-- Upload Video button: only show when forum date has passed AND NOT published -->
                  <button
                    v-if="forum.is_past && forum.status !== 'published'"
                    @click="openVideoUploadModal(forum.id)"
                    class="inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-md transition-colors"
                    :class="forum.has_video 
                      ? 'bg-purple-50 text-purple-500 cursor-not-allowed' 
                      : 'bg-purple-50 text-purple-700 hover:bg-purple-100'"
                    :disabled="forum.has_video"
                    :title="forum.has_video ? 'Video already uploaded' : 'Upload video'"
                  >
                    {{ forum.has_video ? 'Video Uploaded' : 'Upload Video' }}
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else-if="!loading && !error && filteredForums.length === 0" class="bg-white rounded-lg shadow-sm p-12 text-center">
      <div class="flex flex-col items-center justify-center">
        <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <CalendarIcon class="w-8 h-8 text-gray-400" />
        </div>
        <h3 class="text-lg font-medium text-gray-900 mb-2">No forums available</h3>
        <p class="text-sm text-gray-500 mb-6">Get started by creating your first forum.</p>
        <router-link
          to="/admin-dashboard/forums/create"
          class="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          <PlusIcon class="w-5 h-5 mr-2" />
          Create Forum
        </router-link>
      </div>
    </div>

    <!-- Video Upload Modal -->
    <div v-if="showVideoModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Upload Video</h3>
        <p class="text-sm text-gray-600 mb-4">
          Upload a video file for this forum. Maximum file size: 2 GB. Supported formats: MP4, AVI, MOV, WMV, FLV, WEBM, MKV
        </p>
        <input
          ref="videoFileInput"
          type="file"
          accept="video/*"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg mb-4"
          @change="handleVideoFileSelect"
        />
        <div v-if="uploadingVideo" class="text-sm text-gray-600 mb-4">
          Uploading video... Please wait.
        </div>
        <div class="flex justify-end space-x-3">
          <button
            @click="closeVideoUploadModal"
            class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            :disabled="uploadingVideo"
          >
            Cancel
          </button>
          <button
            @click="uploadVideo"
            class="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
            :disabled="!selectedVideoFile || uploadingVideo"
          >
            {{ uploadingVideo ? 'Uploading...' : 'Upload' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { PlusIcon, CalendarIcon } from 'lucide-vue-next';
import { ForumService } from '@/services/apiService';
import type { Forum } from '@/types';

const forums = ref<Forum[]>([]);
const loading = ref(false);
const error = ref<string | null>(null);
const showVideoModal = ref(false);
const selectedForumId = ref<string | null>(null);
const selectedVideoFile = ref<File | null>(null);
const uploadingVideo = ref(false);
const videoFileInput = ref<HTMLInputElement | null>(null);

const filters = ref({
  status: '',
  search: ''
});

const filteredForums = computed(() => {
  let filtered = forums.value;

  if (filters.value.search) {
    const search = filters.value.search.toLowerCase();
    filtered = filtered.filter(forum => 
      forum.title.toLowerCase().includes(search) ||
      forum.description.toLowerCase().includes(search)
    );
  }

  return filtered;
});

const fetchForums = async () => {
  loading.value = true;
  error.value = null;
  
  try {
    const status = filters.value.status || undefined;
    const response = await ForumService.getAllForums(status);
    
    if (response.status) {
      // Handle both null and empty array responses
      if (response.data === null || response.data === undefined) {
        forums.value = [];
      } else if (Array.isArray(response.data)) {
        forums.value = response.data.map((forum: any) => mapApiForumToForum(forum));
      } else {
        // If data is not an array, treat as empty
        forums.value = [];
      }
    } else {
      error.value = 'Failed to fetch forums';
    }
  } catch (err: any) {
    error.value = err.response?.data?.detail || err.response?.data?.error || 'Failed to fetch forums';
    console.error('Error fetching forums:', err);
  } finally {
    loading.value = false;
  }
};

// Helper function to map API response to Forum type
const mapApiForumToForum = (apiForum: any): Forum => {
  return {
    id: apiForum.id,
    title: apiForum.title,
    description: apiForum.description || '',
    category: apiForum.category || '',
    color: apiForum.color || 'bg-teal-500',
    date: apiForum.date ? formatDate(apiForum.date) : '',
    time: apiForum.time || '',
    duration: apiForum.duration || '',
    capacity: apiForum.capacity || 0,
    location: apiForum.location || '',
    format: apiForum.format || '',
    topics: apiForum.topics || [],
    about: apiForum.about || '',
    about2: apiForum.about2 || '',
    learning_points: apiForum.learning_points || [],
    related_events: apiForum.related_events || null,
    isRegistered: apiForum.isRegistered || false,
    isPublic: apiForum.is_public !== undefined ? apiForum.is_public : true,
    registeredCount: apiForum.registeredCount || 0,
    status: apiForum.status || 'draft',
    can_edit: apiForum.can_edit,
    is_past: apiForum.is_past,
    has_video: apiForum.has_video,
    createdAt: apiForum.created_at,
    updatedAt: apiForum.updated_at
  };
};

// Helper function to format date from ISO string to readable format
const formatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  } catch {
    return dateString;
  }
};

const deleteForum = async (id: string) => {
  if (confirm('Are you sure you want to delete this forum?')) {
    try {
      await ForumService.deleteForum(id);
      await fetchForums();
    } catch (err: any) {
      const errorMsg = err.response?.data?.detail || err.response?.data?.error || 'Failed to delete forum';
      alert(errorMsg);
      console.error('Error deleting forum:', err);
    }
  }
};

const publishForum = async (id: string) => {
  try {
    await ForumService.publishForum(id);
    await fetchForums();
  } catch (err: any) {
    const errorMsg = err.response?.data?.detail || err.response?.data?.error || 'Failed to publish forum';
    alert(errorMsg);
    console.error('Error publishing forum:', err);
  }
};

const unpublishForum = async (id: string) => {
  try {
    await ForumService.unpublishForum(id);
    await fetchForums();
  } catch (err: any) {
    const errorMsg = err.response?.data?.detail || err.response?.data?.error || 'Failed to unpublish forum';
    alert(errorMsg);
    console.error('Error unpublishing forum:', err);
  }
};

const getStatusClass = (forum: Forum) => {
  // Check if forum has status field from API
  const status = (forum as any).status;
  if (status === 'published') {
    return 'bg-green-100 text-green-800';
  } else if (status === 'draft') {
    return 'bg-yellow-100 text-yellow-800';
  } else if (status === 'unpublished') {
    return 'bg-gray-100 text-gray-800';
  }
  
  // Fallback to date-based status
  const now = new Date();
  const forumDate = new Date(forum.date);
  
  if (forumDate > now) {
    return 'bg-green-100 text-green-800';
  } else {
    return 'bg-gray-100 text-gray-800';
  }
};

const getStatusText = (forum: Forum) => {
  // Check if forum has status field from API
  const status = (forum as any).status;
  if (status) {
    return status.charAt(0).toUpperCase() + status.slice(1);
  }
  
  // Fallback to date-based status
  const now = new Date();
  const forumDate = new Date(forum.date);
  
  if (forumDate > now) {
    return 'Upcoming';
  } else {
    return 'Past';
  }
};

const openVideoUploadModal = (forumId: string) => {
  selectedForumId.value = forumId;
  selectedVideoFile.value = null;
  showVideoModal.value = true;
  if (videoFileInput.value) {
    videoFileInput.value.value = '';
  }
};

const closeVideoUploadModal = () => {
  showVideoModal.value = false;
  selectedForumId.value = null;
  selectedVideoFile.value = null;
  if (videoFileInput.value) {
    videoFileInput.value.value = '';
  }
};

const handleVideoFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files.length > 0) {
    selectedVideoFile.value = target.files[0];
  }
};

const uploadVideo = async () => {
  if (!selectedVideoFile.value || !selectedForumId.value) {
    alert('Please select a video file');
    return;
  }

  uploadingVideo.value = true;
  try {
    await ForumService.uploadVideo(selectedForumId.value, selectedVideoFile.value);
    alert('Video uploaded successfully!');
    closeVideoUploadModal();
    await fetchForums(); // Refresh the forums list
  } catch (err: any) {
    const errorMsg = err.response?.data?.detail || err.response?.data?.error || err.response?.data?.message || 'Failed to upload video';
    alert(errorMsg);
    console.error('Error uploading video:', err);
  } finally {
    uploadingVideo.value = false;
  }
};

onMounted(() => {
  fetchForums();
});
</script>
