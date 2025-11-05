<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <h1 class="text-2xl font-bold">Resources Library</h1>
      <p class="text-sm text-gray-600">Browse and download resources shared by your counselor</p>
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
            <option v-for="category in availableCategories" :key="category" :value="category">
              {{ category }}
            </option>
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
            class="p-4 flex items-start hover:bg-gray-50 transition-colors cursor-pointer"
            @click="viewResourceDetails(resource)"
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
                @click.stop="downloadResource(resource)"
                class="p-2 rounded-lg hover:bg-gray-100"
                title="Download"
              >
                <DownloadIcon class="w-5 h-5 text-gray-600" />
              </button>
              <button
                @click.stop="viewResourceDetails(resource)"
                class="p-2 rounded-lg hover:bg-gray-100"
                title="View Details"
              >
                <FileTextIcon class="w-5 h-5 text-gray-600" />
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

    <!-- Resource Details Modal -->
    <div v-if="showResourceModal && selectedResource" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div class="bg-white rounded-xl max-w-6xl w-full max-h-[90vh] flex flex-col">
        <div class="p-6 border-b flex items-center justify-between">
          <div>
            <h3 class="text-lg font-semibold text-gray-900">{{ selectedResource.title }}</h3>
            <p v-if="selectedResource.category" class="text-sm text-gray-500 mt-1">{{ selectedResource.category }}</p>
          </div>
          <button @click="closeResourceModal" class="p-1 hover:bg-gray-100 rounded">
            <XIcon class="w-5 h-5" />
          </button>
        </div>

        <div class="flex-1 overflow-y-auto p-6">
          <!-- Resource Details -->
          <div class="grid grid-cols-2 gap-4 mb-6 text-sm">
            <div>
              <span class="text-gray-500">Type:</span>
              <span class="ml-2 font-medium">{{ selectedResource.type }}</span>
            </div>
            <div>
              <span class="text-gray-500">Size:</span>
              <span class="ml-2 font-medium">{{ selectedResource.size || 'N/A' }}</span>
            </div>
            <div>
              <span class="text-gray-500">Uploaded:</span>
              <span class="ml-2 font-medium">{{ formatDate(selectedResource.created_at) }}</span>
            </div>
            <div>
              <span class="text-gray-500">Category:</span>
              <span class="ml-2 font-medium">{{ selectedResource.category || 'N/A' }}</span>
            </div>
          </div>

          <!-- Description -->
          <div v-if="selectedResource.description" class="mb-6">
            <h4 class="text-sm font-medium text-gray-700 mb-2">Description</h4>
            <p class="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">{{ selectedResource.description }}</p>
          </div>

          <!-- Resource Preview -->
          <div class="border border-gray-200 rounded-lg overflow-hidden">
            <div v-if="loadingPreview" class="p-12 text-center">
              <div class="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500 mx-auto mb-4"></div>
              <p class="text-gray-600">Loading preview...</p>
            </div>

            <div v-else-if="isPdfType(selectedResource.type) && resourcePreviewUrl" class="w-full" style="height: 70vh;">
              <iframe
                :src="resourcePreviewUrl"
                class="w-full h-full border-0"
                title="PDF Viewer"
              ></iframe>
            </div>

            <div v-else-if="isVideoType(selectedResource.type) && resourcePreviewUrl" class="w-full bg-black flex items-center justify-center" style="max-height: 70vh;">
              <video
                :src="resourcePreviewUrl"
                controls
                class="w-full h-auto max-h-[70vh] object-contain"
              >
                Your browser does not support the video tag.
              </video>
            </div>

            <div v-else-if="isAudioType(selectedResource.type) && resourcePreviewUrl" class="p-6 bg-gray-50">
              <div class="flex items-center justify-center mb-4">
                <div :class="`w-24 h-24 rounded-full flex items-center justify-center ${getResourceTypeClass(selectedResource.type)}`">
                  <component :is="getResourceIcon(selectedResource.type)" class="w-12 h-12" />
                </div>
              </div>
              <audio
                :src="resourcePreviewUrl"
                controls
                class="w-full"
              >
                Your browser does not support the audio tag.
              </audio>
            </div>

            <div v-else-if="isImageType(selectedResource.type) && resourcePreviewUrl" class="p-6 bg-gray-50 flex items-center justify-center">
              <img
                :src="resourcePreviewUrl"
                :alt="selectedResource.title"
                class="max-w-full max-h-[60vh] sm:max-h-[70vh] object-contain rounded-lg shadow-lg"
              />
            </div>

            <div v-else-if="(isPdfType(selectedResource.type) || isVideoType(selectedResource.type) || isAudioType(selectedResource.type) || isImageType(selectedResource.type)) && !resourcePreviewUrl && !loadingPreview" class="p-12 text-center">
              <div class="text-red-500 mb-4">
                <p class="font-medium">Failed to load preview</p>
                <p class="text-sm text-gray-600 mt-2">Please try downloading the file instead</p>
              </div>
              <button
                @click="downloadResource(selectedResource)"
                class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                <DownloadIcon class="w-4 h-4 inline mr-2" />
                Download
              </button>
            </div>

            <div v-else class="p-12 text-center">
              <div :class="`w-24 h-24 rounded-lg mx-auto mb-4 flex items-center justify-center ${getResourceTypeClass(selectedResource.type)}`">
                <component :is="getResourceIcon(selectedResource.type)" class="w-12 h-12" />
              </div>
              <p class="text-gray-600 mb-4">Preview not available for {{ selectedResource.type }} files</p>
              <button
                @click="downloadResource(selectedResource)"
                class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                <DownloadIcon class="w-4 h-4 inline mr-2" />
                Download to View
              </button>
            </div>
          </div>
        </div>

        <!-- Modal Footer -->
        <div class="p-6 border-t bg-gray-50 flex justify-end space-x-3">
          <button
            @click="downloadResource(selectedResource)"
            class="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 flex items-center"
          >
            <DownloadIcon class="w-4 h-4 mr-2" />
            Download
          </button>
          <button
            @click="closeResourceModal"
            class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import {
  SearchIcon,
  DownloadIcon,
  FileTextIcon,
  FileIcon,
  PlayIcon,
  ImageIcon,
  XIcon,
} from 'lucide-vue-next';
import { useResources } from '@/composables/useResources';

const { resources, loading, error, fetchResources, downloadResource: downloadResourceFile, getResourceBlob } = useResources();

const searchQuery = ref('');
const selectedCategory = ref('');
const showResourceModal = ref(false);
const selectedResource = ref<Resource | null>(null);
const resourcePreviewUrl = ref<string | null>(null);
const loadingPreview = ref(false);

// Extract unique categories from resources
const availableCategories = computed(() => {
  const categories = new Set<string>();
  resources.value.forEach((r: any) => {
    if (r.category) {
      categories.add(r.category);
    }
  });
  return Array.from(categories).sort();
});

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
    case 'jpeg':
    case 'gif':
    case 'webp':
      return 'bg-pink-100 text-pink-600';
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

const viewResourceDetails = async (resource: Resource) => {
  selectedResource.value = resource;
  showResourceModal.value = true;

  // Load preview URL for viewable resources (PDF, Video, Audio, Image)
  if (isPdfType(resource.type) || isVideoType(resource.type) || isAudioType(resource.type) || isImageType(resource.type)) {
    await loadResourcePreview(resource);
  }
};

const loadResourcePreview = async (resource: Resource) => {
  loadingPreview.value = true;
  try {
    // Clean up previous blob URL if exists
    if (resourcePreviewUrl.value) {
      URL.revokeObjectURL(resourcePreviewUrl.value);
      resourcePreviewUrl.value = null;
    }

    // Fetch the resource file with authentication
    const blob = await getResourceBlob(resource.id);

    // Verify it's a Blob before creating URL
    if (!(blob instanceof Blob)) {
      throw new Error('Invalid response: expected Blob object');
    }

    // Create a blob URL for preview
    resourcePreviewUrl.value = URL.createObjectURL(blob);
  } catch (err) {
    console.error('Failed to load preview:', err);
    resourcePreviewUrl.value = null;
  } finally {
    loadingPreview.value = false;
  }
};

const closeResourceModal = () => {
  // Clean up blob URL to prevent memory leaks
  if (resourcePreviewUrl.value) {
    URL.revokeObjectURL(resourcePreviewUrl.value);
    resourcePreviewUrl.value = null;
  }
  showResourceModal.value = false;
  selectedResource.value = null;
};

const isPdfType = (type: string): boolean => {
  return type?.toLowerCase() === 'pdf' || type?.toLowerCase().includes('pdf');
};

const isVideoType = (type: string): boolean => {
  const videoTypes = ['video', 'mp4', 'avi', 'mov', 'wmv', 'flv', 'webm', 'mkv'];
  return videoTypes.some(vt => type?.toLowerCase().includes(vt));
};

const isAudioType = (type: string): boolean => {
  const audioTypes = ['audio', 'mp3', 'wav', 'ogg', 'aac', 'm4a', 'flac'];
  return audioTypes.some(at => type?.toLowerCase().includes(at));
};

const isImageType = (type: string): boolean => {
  const imageTypes = ['image', 'jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'svg'];
  return imageTypes.some(it => type?.toLowerCase().includes(it));
};

onMounted(() => {
  fetchResources();
});
</script>
