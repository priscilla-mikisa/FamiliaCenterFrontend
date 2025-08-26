<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <h1 class="text-2xl font-bold">Resources Library</h1>
      <button
        @click="showUploadModal = true"
        class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center"
      >
        <PlusIcon class="w-5 h-5 mr-1" />
        New Resource
      </button>
    </div>

    <div class="bg-white rounded-xl shadow-md overflow-hidden">
      <div class="p-4 border-b flex items-center space-x-4">
        <div class="relative flex-1 max-w-md">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search resources..."
            class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
          <SearchIcon class="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
        </div>
        <div>
          <select
            v-model="selectedCategory"
            class="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            <option value="">All Categories</option>
            <option value="Marriage Counseling">Marriage Counseling</option>
            <option value="Parenting">Parenting</option>
            <option value="Stress Management">Stress Management</option>
            <option value="Relationships">Relationships</option>
          </select>
        </div>
      </div>

      <div class="divide-y">
        <div v-if="loading" class="p-4 text-center">
          <div class="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500 mx-auto"></div>
          <p class="mt-2 text-gray-600">Loading resources...</p>
        </div>

        <div v-else-if="error" class="p-4 text-red-500">
          Error: {{ error }}
        </div>

        <div v-else-if="filteredResources.length > 0">
          <div
            v-for="resource in filteredResources"
            :key="resource.id"
            class="p-4 flex items-start hover:bg-gray-50 transition-colors"
          >
            <div class="mr-4">
              <div :class="`w-12 h-12 rounded-lg flex items-center justify-center ${getResourceTypeClass(resource.type)}`">
                <component :is="getResourceIcon(resource.type)" class="w-6 h-6" />
              </div>
            </div>
            <div class="flex-1">
              <h3 class="font-medium text-gray-900">{{ resource.title }}</h3>
              <p v-if="resource.description" class="text-sm text-gray-600 mt-1">{{ resource.description }}</p>
              <div class="mt-1 flex items-center space-x-4 text-sm text-gray-500">
                <span class="inline-block bg-gray-100 rounded px-2 py-1 text-xs">
                  {{ resource.category }}
                </span>
                <span>{{ resource.size }}</span>
                <span>{{ formatDate(resource.created_at) }}</span>
              </div>
            </div>
            <div class="flex space-x-2">
              <button
                @click="downloadResource(resource)"
                class="p-2 rounded-lg hover:bg-gray-100"
                title="Download"
              >
                <DownloadIcon class="w-5 h-5 text-gray-600" />
              </button>
              <button class="p-2 rounded-lg hover:bg-gray-100" title="More options">
                <MoreVerticalIcon class="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>
        </div>

        <div v-else class="p-8 text-center text-gray-600">
          <FileTextIcon class="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p>No resources found</p>
          <p class="text-sm">Try adjusting your search or category filter</p>
        </div>
      </div>
    </div>

    <!-- Upload Modal -->
    <div v-if="showUploadModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div class="bg-white rounded-xl p-6 max-w-md w-full">
        <h3 class="text-lg font-semibold mb-4">Upload New Resource</h3>
        <form @submit.prevent="handleUpload">
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input
                v-model="uploadForm.title"
                type="text"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                v-model="uploadForm.description"
                rows="3"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              ></textarea>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                v-model="uploadForm.category"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="">Select category</option>
                <option value="Marriage Counseling">Marriage Counseling</option>
                <option value="Parenting">Parenting</option>
                <option value="Stress Management">Stress Management</option>
                <option value="Relationships">Relationships</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">File</label>
              <input
                ref="fileInput"
                type="file"
                required
                accept=".pdf,.doc,.docx,.mp3,.mp4,.jpg,.png"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </div>
          <div class="flex space-x-3 mt-6">
            <button
              type="button"
              @click="showUploadModal = false"
              class="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              :disabled="uploading"
              class="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
            >
              {{ uploading ? 'Uploading...' : 'Upload' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import {
  PlusIcon,
  SearchIcon,
  DownloadIcon,
  MoreVerticalIcon,
  FileTextIcon,
  FileIcon,
  PlayIcon,
  ImageIcon
} from 'lucide-vue-next';
import { useResources } from '@/composables/useResources';

const { resources, loading, error, fetchResources, downloadResource: downloadResourceFile } = useResources();

const searchQuery = ref('');
const selectedCategory = ref('');
const showUploadModal = ref(false);
const uploading = ref(false);

const uploadForm = ref({
  title: '',
  description: '',
  category: ''
});

const fileInput = ref<HTMLInputElement | null>(null);

const filteredResources = computed(() => {
  let filtered = resources.value;

  if (searchQuery.value) {
    filtered = filtered.filter(r =>
      r.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      r.description?.toLowerCase().includes(searchQuery.value.toLowerCase())
    );
  }

  if (selectedCategory.value) {
    filtered = filtered.filter(r => r.category === selectedCategory.value);
  }

  return filtered;
});

const getResourceTypeClass = (type: string) => {
  switch (type.toLowerCase()) {
    case 'pdf':
      return 'bg-red-100 text-red-600';
    case 'audio':
    case 'mp3':
      return 'bg-blue-100 text-blue-600';
    case 'video':
    case 'mp4':
      return 'bg-purple-100 text-purple-600';
    case 'image':
    case 'jpg':
    case 'png':
      return 'bg-green-100 text-green-600';
    default:
      return 'bg-gray-100 text-gray-600';
  }
};

const getResourceIcon = (type: string) => {
  switch (type.toLowerCase()) {
    case 'audio':
    case 'mp3':
      return PlayIcon;
    case 'video':
    case 'mp4':
      return PlayIcon;
    case 'image':
    case 'jpg':
    case 'png':
      return ImageIcon;
    default:
      return FileIcon;
  }
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

interface Resource {
  id: string;
  title: string;
  description?: string;
  category: string;
  type: string;
  size?: string;
  created_at: string;
}

const downloadResource = async (resource: Resource) => {
  try {
    await downloadResourceFile(resource.id);
  } catch (err) {
    console.error('Download failed:', err);
    alert('Failed to download resource');
  }
};

const handleUpload = async () => {
  if (!fileInput.value?.files?.[0]) return;

  uploading.value = true;
  try {
    const formData = new FormData();
    formData.append('title', uploadForm.value.title);
    formData.append('description', uploadForm.value.description);
    formData.append('category', uploadForm.value.category);
    formData.append('file', fileInput.value.files[0]);

    // This would use your ResourceService.uploadResource
    // await ResourceService.uploadResource(formData);

    // For now, just simulate success
    await new Promise(resolve => setTimeout(resolve, 1000));

    showUploadModal.value = false;
    uploadForm.value = { title: '', description: '', category: '' };
    await fetchResources();

    alert('Resource uploaded successfully!');
  } catch (err) {
    console.error('Upload failed:', err);
    alert('Failed to upload resource');
  } finally {
    uploading.value = false;
  }
};

onMounted(() => {
  fetchResources();
});
</script>
