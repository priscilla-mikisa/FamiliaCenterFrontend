<template>
  <div class="space-y-6">
    <div class="bg-white rounded-xl shadow p-4 sm:p-6">
      <div class="flex flex-col space-y-4">
        <h2 class="text-lg sm:text-xl font-semibold text-gray-900">Resource Management</h2>
        <div class="flex flex-col sm:flex-row gap-3">
          <div class="relative flex-1 min-w-0">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search resources..."
              class="w-full pl-10 pr-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <SearchIcon class="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
          </div>
          <select
            v-model="filterCategory"
            class="w-full sm:w-auto border border-gray-300 rounded-lg px-3 py-2 text-sm sm:text-base focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Categories</option>
            <option v-for="category in availableCategories" :key="category" :value="category">
              {{ category }}
            </option>
          </select>
          <button
            @click="showUploadModal = true"
            class="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center text-sm sm:text-base whitespace-nowrap"
          >
            <UploadIcon class="w-4 h-4 mr-2" />
            Upload Resource
          </button>
        </div>
      </div>
    </div>

    <!-- Resource Stats -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      <div class="bg-white rounded-xl shadow p-4 sm:p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-xs sm:text-sm text-gray-500">Total Resources</p>
            <p class="text-xl sm:text-2xl font-bold mt-1">{{ transformedResources.length }}</p>
          </div>
          <div class="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <FileTextIcon class="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl shadow p-4 sm:p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-xs sm:text-sm text-gray-500">Public Resources</p>
            <p class="text-xl sm:text-2xl font-bold mt-1">{{ publicResources.length }}</p>
          </div>
          <div class="w-8 h-8 sm:w-10 sm:h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <ShareIcon class="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl shadow p-4 sm:p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-xs sm:text-sm text-gray-500">This Month</p>
            <p class="text-xl sm:text-2xl font-bold mt-1">{{ monthlyUploads }}</p>
          </div>
          <div class="w-8 h-8 sm:w-10 sm:h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <CalendarIcon class="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl shadow p-4 sm:p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-xs sm:text-sm text-gray-500">Storage Used</p>
            <p class="text-xl sm:text-2xl font-bold mt-1">{{ totalStorageUsed }}</p>
          </div>
          <div class="w-8 h-8 sm:w-10 sm:h-10 bg-yellow-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <HardDriveIcon class="w-4 h-4 sm:w-5 sm:h-5 text-yellow-600" />
          </div>
        </div>
      </div>
    </div>

    <div class="bg-white rounded-xl shadow">
      <div class="p-4 sm:p-6 border-b">
        <h3 class="text-base sm:text-lg font-semibold text-gray-900">My Resources</h3>
      </div>
      <div v-if="loading" class="p-4 sm:p-6 text-center">
        <div class="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
        <p class="mt-2 text-sm sm:text-base text-gray-600">Loading resources...</p>
      </div>
      <div v-else-if="error" class="p-4 sm:p-6 text-sm sm:text-base text-red-500">
        Error: {{ error }}
      </div>
      <div v-else class="p-4 sm:p-6">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <div
            v-for="resource in filteredResources"
            :key="resource.id"
            class="border border-gray-200 rounded-lg p-4 sm:p-5 lg:p-6 hover:shadow-md transition-shadow"
          >
            <div class="flex items-start justify-between mb-3 gap-2">
              <div class="flex items-start space-x-2 sm:space-x-3 flex-1 min-w-0">
                <div :class="`w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${getResourceTypeClass(resource.type)}`">
                  <component :is="getResourceIcon(resource.type)" class="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div class="flex-1 min-w-0">
                  <h4 class="font-medium text-sm sm:text-base text-gray-900 truncate">{{ resource.title }}</h4>
                  <p class="text-xs sm:text-sm text-gray-600 truncate">{{ resource.category }}</p>
                </div>
              </div>
              <div class="flex items-center space-x-1 sm:space-x-2 flex-shrink-0">
                <button
                  @click="viewResourceDetails(resource)"
                  class="px-2 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
                  title="View Resource"
                >
                  <FileTextIcon class="w-3 h-3 sm:w-4 sm:h-4 sm:mr-1" />
                  <span class="hidden sm:inline">View</span>
                </button>
                <div class="relative">
                  <button
                    @click.stop="toggleResourceMenu(resource.id)"
                    class="p-1 rounded hover:bg-gray-100"
                  >
                    <MoreVerticalIcon class="w-4 h-4" />
                  </button>
                  <div
                    v-if="activeMenuId === resource.id"
                    class="absolute right-0 mt-2 w-48 sm:w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10"
                  >
                    <button
                      @click.stop="downloadResource(resource)"
                      class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-t-lg flex items-center"
                    >
                      <DownloadIcon class="w-4 h-4 mr-2" />
                      Download
                    </button>
                    <button
                      @click.stop="shareResource(resource)"
                      class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center"
                    >
                      <ShareIcon class="w-4 h-4 mr-2" />
                      Share with Client
                    </button>
                    <button
                      @click.stop="editResource(resource)"
                      class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center"
                    >
                      <EditIcon class="w-4 h-4 mr-2" />
                      Edit
                    </button>
                    <button
                      @click.stop="handleDeleteResource(resource)"
                      class="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50 rounded-b-lg flex items-center"
                    >
                      <TrashIcon class="w-4 h-4 mr-2" />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div class="space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-gray-600">
              <div class="flex justify-between items-center">
                <span class="text-gray-500">Size:</span>
                <span class="font-medium truncate ml-2">{{ resource.size }}</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-gray-500">Uploaded:</span>
                <span class="font-medium truncate ml-2">{{ formatDate(resource.uploadDate) }}</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-gray-500">Visibility:</span>
                <span :class="`font-medium truncate ml-2 ${resource.isPublic ? 'text-green-600' : 'text-gray-600'}`">
                  {{ resource.isPublic ? 'Public' : 'Private' }}
                </span>
              </div>
            </div>

            <div v-if="resource.description" class="mt-2 sm:mt-3 p-2 bg-gray-50 rounded text-xs sm:text-sm text-gray-700 line-clamp-2">
              {{ resource.description }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Upload Modal -->
    <div v-if="showUploadModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 overflow-y-auto">
      <div class="bg-white rounded-xl max-w-md w-full my-4">
        <div class="p-4 sm:p-6 border-b">
          <div class="flex items-center justify-between">
            <h3 class="text-base sm:text-lg font-semibold">Upload Resource</h3>
            <button @click="showUploadModal = false" class="p-1 hover:bg-gray-100 rounded">
              <XIcon class="w-5 h-5" />
            </button>
          </div>
        </div>

        <form @submit.prevent="handleUploadResource" class="p-4 sm:p-6 space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Title *</label>
            <input
              v-model="uploadForm.title"
              type="text"
              required
              class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm sm:text-base focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Category (Optional)</label>
            <input
              v-model="uploadForm.category"
              type="text"
              list="categories"
              class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm sm:text-base focus:ring-2 focus:ring-blue-500"
              placeholder="Enter or select category"
            />
            <datalist id="categories">
              <option v-for="category in availableCategories" :key="category" :value="category" />
            </datalist>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              v-model="uploadForm.description"
              rows="3"
              class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm sm:text-base focus:ring-2 focus:ring-blue-500"
              placeholder="Brief description of the resource..."
            ></textarea>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">File *</label>
            <input
              ref="fileInput"
              type="file"
              required
              accept=".pdf,.doc,.docx,.mp3,.mp4,.jpg,.png,.ppt,.pptx"
              class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm sm:text-base file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Access Type *</label>
            <select
              v-model="uploadForm.access_type"
              required
              class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm sm:text-base focus:ring-2 focus:ring-blue-500"
            >
              <option value="public">Public - Available to all clients</option>
              <option value="private">Private - Only accessible through linked sessions</option>
            </select>
          </div>
          
          <div v-if="uploadForm.access_type === 'private'">
            <label class="block text-sm font-medium text-gray-700 mb-1">Session (Optional)</label>
            <select
              v-model="uploadForm.session_id"
              class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm sm:text-base focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select a session</option>
              <option
                v-for="session in availableSessions"
                :key="session.id"
                :value="session.id"
              >
                {{ formatSessionOption(session) }}
              </option>
            </select>
            <p class="text-xs text-gray-500 mt-1">Resource will be shared with the client who attended this session</p>
          </div>
          
          <div v-if="uploadForm.access_type === 'private'">
            <label class="block text-sm font-medium text-gray-700 mb-1">Program (Optional)</label>
            <select
              v-model="uploadForm.program_id"
              class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm sm:text-base focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select a program</option>
              <option
                v-for="program in counselorPrograms"
                :key="program.id"
                :value="program.id"
              >
                {{ program.title }}
              </option>
            </select>
            <p class="text-xs text-gray-500 mt-1">Resource will be shared with all participants in this program</p>
          </div>
          
          <div v-if="uploadForm.access_type === 'public'">
            <p class="text-xs text-gray-500">This resource will be available to all clients</p>
          </div>

          <div class="flex flex-col sm:flex-row gap-3 pt-4">
            <button
              type="button"
              @click="showUploadModal = false"
              class="flex-1 px-4 py-2 text-sm sm:text-base border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              :disabled="uploading"
              class="flex-1 px-4 py-2 text-sm sm:text-base bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {{ uploading ? 'Uploading...' : 'Upload' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Resource Details Modal -->
    <div v-if="showResourceModal && selectedResource" class="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black bg-opacity-50 overflow-y-auto">
      <div class="bg-white rounded-xl max-w-6xl w-full max-h-[90vh] flex flex-col my-4">
        <div class="p-4 sm:p-6 border-b flex items-center justify-between">
          <div class="flex-1 min-w-0 pr-2">
            <h3 class="text-base sm:text-lg font-semibold text-gray-900 truncate">{{ selectedResource.title }}</h3>
            <p v-if="selectedResource.category" class="text-xs sm:text-sm text-gray-500 mt-1 truncate">{{ selectedResource.category }}</p>
          </div>
          <button @click="closeResourceModal" class="p-1 hover:bg-gray-100 rounded flex-shrink-0">
            <XIcon class="w-5 h-5" />
          </button>
        </div>

        <div class="flex-1 overflow-y-auto p-4 sm:p-6">
          <!-- Resource Details -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6 text-xs sm:text-sm">
            <div>
              <span class="text-gray-500">Type:</span>
              <span class="ml-2 font-medium">{{ selectedResource.type }}</span>
            </div>
            <div>
              <span class="text-gray-500">Size:</span>
              <span class="ml-2 font-medium">{{ selectedResource.size }}</span>
            </div>
            <div>
              <span class="text-gray-500">Uploaded:</span>
              <span class="ml-2 font-medium">{{ formatDate(selectedResource.uploadDate) }}</span>
            </div>
            <div>
              <span class="text-gray-500">Visibility:</span>
              <span :class="`ml-2 font-medium ${selectedResource.isPublic ? 'text-green-600' : 'text-gray-600'}`">
                {{ selectedResource.isPublic ? 'Public' : 'Private' }}
              </span>
            </div>
          </div>

          <!-- Description -->
          <div v-if="selectedResource.description" class="mb-4 sm:mb-6">
            <h4 class="text-xs sm:text-sm font-medium text-gray-700 mb-2">Description</h4>
            <p class="text-xs sm:text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">{{ selectedResource.description }}</p>
          </div>

          <!-- Resource Preview -->
          <div class="border border-gray-200 rounded-lg overflow-hidden">
            <div v-if="loadingPreview" class="p-8 sm:p-12 text-center">
              <div class="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p class="text-xs sm:text-sm text-gray-600">Loading preview...</p>
            </div>
            
            <div v-else-if="selectedResource.type === 'PDF' && resourcePreviewUrl" class="w-full h-[50vh] sm:h-[70vh]">
              <iframe
                :src="resourcePreviewUrl"
                class="w-full h-full border-0"
                title="PDF Viewer"
              ></iframe>
            </div>
            
            <div v-else-if="selectedResource.type === 'Video' && resourcePreviewUrl" class="w-full bg-black flex items-center justify-center" style="max-height: 70vh;">
              <video
                :src="resourcePreviewUrl"
                controls
                class="w-full h-auto max-h-[70vh] object-contain"
              >
                Your browser does not support the video tag.
              </video>
            </div>
            
            <div v-else-if="selectedResource.type === 'Audio' && resourcePreviewUrl" class="p-4 sm:p-6 bg-gray-50">
              <div class="flex items-center justify-center mb-4">
                <div :class="`w-16 h-16 sm:w-24 sm:h-24 rounded-full flex items-center justify-center ${getResourceTypeClass(selectedResource.type)}`">
                  <component :is="getResourceIcon(selectedResource.type)" class="w-8 h-8 sm:w-12 sm:h-12" />
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
            
            <div v-else-if="selectedResource.type === 'Image' && resourcePreviewUrl" class="p-4 sm:p-6 bg-gray-50 flex items-center justify-center">
              <img
                :src="resourcePreviewUrl"
                :alt="selectedResource.title"
                class="max-w-full max-h-[60vh] sm:max-h-[70vh] object-contain rounded-lg shadow-lg"
              />
            </div>
            
            <div v-else-if="(selectedResource.type === 'PDF' || selectedResource.type === 'Video' || selectedResource.type === 'Audio' || selectedResource.type === 'Image') && !resourcePreviewUrl && !loadingPreview" class="p-8 sm:p-12 text-center">
              <div class="text-red-500 mb-4">
                <p class="text-sm sm:text-base font-medium">Failed to load preview</p>
                <p class="text-xs sm:text-sm text-gray-600 mt-2">Please try downloading the file instead</p>
              </div>
              <button
                @click="downloadResource(selectedResource)"
                class="px-3 sm:px-4 py-2 text-xs sm:text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center mx-auto"
              >
                <DownloadIcon class="w-4 h-4 mr-2" />
                Download
              </button>
            </div>
            
            <div v-else class="p-8 sm:p-12 text-center">
              <div :class="`w-16 h-16 sm:w-24 sm:h-24 rounded-lg mx-auto mb-4 flex items-center justify-center ${getResourceTypeClass(selectedResource.type)}`">
                <component :is="getResourceIcon(selectedResource.type)" class="w-8 h-8 sm:w-12 sm:h-12" />
              </div>
              <p class="text-xs sm:text-sm text-gray-600 mb-4">Preview not available for {{ selectedResource.type }} files</p>
              <button
                @click="downloadResource(selectedResource)"
                class="px-3 sm:px-4 py-2 text-xs sm:text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center mx-auto"
              >
                <DownloadIcon class="w-4 h-4 mr-2" />
                Download to View
              </button>
            </div>
          </div>
        </div>

        <!-- Modal Footer -->
        <div class="p-4 sm:p-6 border-t bg-gray-50 flex flex-col sm:flex-row justify-end gap-3">
          <button
            @click="downloadResource(selectedResource)"
            class="w-full sm:w-auto px-4 py-2 text-sm border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 flex items-center justify-center"
          >
            <DownloadIcon class="w-4 h-4 mr-2" />
            Download
          </button>
          <button
            @click="closeResourceModal"
            class="w-full sm:w-auto px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import {
  SearchIcon,
  UploadIcon,
  FileTextIcon,
  ShareIcon,
  CalendarIcon,
  HardDriveIcon,
  MoreVerticalIcon,
  DownloadIcon,
  EditIcon,
  TrashIcon,
  XIcon,
  FileIcon,
  PlayIcon,
  VideoIcon,
  ImageIcon
} from 'lucide-vue-next';
import { useResources } from '@/composables/useResources';
import { useSessions } from '@/composables/useSessions';
import { usePrograms } from '@/composables/usePrograms';
import type { CounselorResource } from '@/types/counselor';

const { resources, loading, error, fetchCounsellorResources, uploadResource: uploadResourceApi, deleteResource, downloadResource: downloadResourceFile, getResourceBlob } = useResources();
const { sessions, fetchCounsellorSessions } = useSessions();
const { programs, fetchCounsellorPrograms } = usePrograms();

const searchQuery = ref('');
const filterCategory = ref('');
const showUploadModal = ref(false);
const showResourceModal = ref(false);
const selectedResource = ref<CounselorResource | null>(null);
const resourcePreviewUrl = ref<string | null>(null);
const loadingPreview = ref(false);
const activeMenuId = ref<string | null>(null);
const uploading = ref(false);

const uploadForm = ref({
  title: '',
  category: '',
  description: '',
  access_type: 'public' as 'public' | 'private',
  session_id: '',
  program_id: ''
});

const fileInput = ref<HTMLInputElement | null>(null);

// Transform API resources to CounselorResource format
const transformedResources = computed<CounselorResource[]>(() => {
  return resources.value.map((resource: any) => ({
    id: resource.id || resource.resource_id || String(resource.id),
    title: resource.title || '',
    description: resource.description || '',
    type: resource.type || 'Document',
    category: resource.category || '',
    size: resource.size || '0 B',
    url: resource.url || resource.filename || `/resources/${resource.id}`,
    filename: resource.filename || resource.url?.split('/').pop() || resource.id,
    uploadDate: resource.uploadDate || resource.created_at || resource.uploaded_at || new Date().toISOString(),
    isPublic: resource.access_type === 'public' || resource.isPublic || false,
    programId: resource.program_id || undefined
  }));
});

// Extract unique categories from resources
const availableCategories = computed(() => {
  const categories = new Set<string>();
  transformedResources.value.forEach(r => {
    if (r.category) {
      categories.add(r.category);
    }
  });
  return Array.from(categories).sort();
});

const publicResources = computed(() =>
  transformedResources.value.filter(r => r.isPublic)
);

const monthlyUploads = computed(() => {
  const thisMonth = new Date().getMonth();
  const thisYear = new Date().getFullYear();
  return transformedResources.value.filter(r => {
    const uploadDate = new Date(r.uploadDate);
    return uploadDate.getMonth() === thisMonth && uploadDate.getFullYear() === thisYear;
  }).length;
});

// Calculate total storage used from all resources
const totalStorageUsed = computed(() => {
  const parseSizeToBytes = (sizeStr: string): number => {
    if (!sizeStr || sizeStr === '0 B') return 0;
    
    // Remove spaces and convert to uppercase for easier parsing
    const cleaned = sizeStr.trim().toUpperCase();
    
    // Extract number and unit
    const match = cleaned.match(/^([\d.]+)\s*([KMGT]?B)$/);
    if (!match) return 0;
    
    const value = parseFloat(match[1]);
    const unit = match[2];
    
    // Convert to bytes
    const multipliers: { [key: string]: number } = {
      'B': 1,
      'KB': 1024,
      'MB': 1024 * 1024,
      'GB': 1024 * 1024 * 1024,
      'TB': 1024 * 1024 * 1024 * 1024
    };
    
    return value * (multipliers[unit] || 1);
  };
  
  const totalBytes = transformedResources.value.reduce((total, resource) => {
    return total + parseSizeToBytes(resource.size);
  }, 0);
  
  return formatFileSize(totalBytes);
});

// Available sessions for dropdown (sorted by date, most recent first)
const availableSessions = computed(() => {
  return [...sessions.value].sort((a, b) => {
    const dateA = new Date(`${a.session_date}T${a.session_time || '00:00:00'}`);
    const dateB = new Date(`${b.session_date}T${b.session_time || '00:00:00'}`);
    return dateB.getTime() - dateA.getTime();
  });
});

// Programs owned by the current counselor
// Note: This assumes programs are filtered by counselor ownership on the backend
// If the API doesn't filter by owner, we may need to add filtering logic here
const counselorPrograms = computed(() => {
  return programs.value;
});

// Format session for dropdown display
const formatSessionOption = (session: any) => {
  const clientName = session.user?.name ||
                     session.user?.first_name ||
                     `${session.user?.first_name || ''} ${session.user?.last_name || ''}`.trim() ||
                     session.user?.email ||
                     session.counsellor_name ||
                     'Unknown Client';
  
  const sessionDate = session.session_date ? new Date(session.session_date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }) : 'No date';
  
  const sessionTime = session.session_time || '';
  const topic = session.topic || session.title || 'Session';
  
  return `${clientName} - ${topic} (${sessionDate}${sessionTime ? ' at ' + sessionTime : ''})`;
};

const filteredResources = computed(() => {
  let filtered = transformedResources.value;

  if (searchQuery.value) {
    filtered = filtered.filter(r =>
      r.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      r.description?.toLowerCase().includes(searchQuery.value.toLowerCase())
    );
  }

  if (filterCategory.value) {
    filtered = filtered.filter(r => r.category === filterCategory.value);
  }

  return filtered;
});

const getResourceTypeClass = (type: string) => {
  const classes = {
    'PDF': 'bg-red-100 text-red-600',
    'Video': 'bg-purple-100 text-purple-600',
    'Audio': 'bg-blue-100 text-blue-600',
    'Image': 'bg-pink-100 text-pink-600',
    'Document': 'bg-green-100 text-green-600'
  };
  return classes[type as keyof typeof classes] || 'bg-gray-100 text-gray-600';
};

const getResourceIcon = (type: string) => {
  const icons = {
    'PDF': FileTextIcon,
    'Video': VideoIcon,
    'Audio': PlayIcon,
    'Image': ImageIcon,
    'Document': FileIcon
  };
  return icons[type as keyof typeof icons] || FileIcon;
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

const toggleResourceMenu = (resourceId: string) => {
  activeMenuId.value = activeMenuId.value === resourceId ? null : resourceId;
};

const viewResourceDetails = async (resource: CounselorResource) => {
  selectedResource.value = resource;
  showResourceModal.value = true;
  activeMenuId.value = null;
  
  // Load preview URL for viewable resources (PDF, Video, Audio, Image)
  if (resource.type === 'PDF' || resource.type === 'Video' || resource.type === 'Audio' || resource.type === 'Image') {
    await loadResourcePreview(resource);
  }
};

const loadResourcePreview = async (resource: CounselorResource) => {
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

const getResourceUrl = (resource: CounselorResource & { filename?: string }): string => {
  // Construct the download/view URL from the API
  const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';
  const userType = localStorage.getItem('userType');
  
  // Check if we have a full URL
  if (resource.url && (resource.url.startsWith('http://') || resource.url.startsWith('https://'))) {
    return resource.url;
  }
  
  // Get filename from resource (from API response or extracted from url)
  const filename = (resource as any).filename || resource.url?.split('/').pop() || resource.id;
  
  // Get auth token for authenticated requests
  const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
  
  if (userType === 'counsellor') {
    // For counselors viewing their own resources
    // Check if backend has a download endpoint, otherwise use the resource endpoint
    // Note: Backend may need to support direct file serving
    let url = `${baseURL}/counsellor/resources/${resource.id}`;
    // If token exists, add it as query parameter (some backends support this for iframes)
    if (token) {
      url += `?token=${token}`;
    }
    return url;
  } else {
    // For users, use the download endpoint with filename
    let url = `${baseURL}/users/resources/download/${filename}`;
    if (token) {
      url += `?token=${token}`;
    }
    return url;
  }
};

const downloadResource = async (resource: CounselorResource) => {
  try {
    await downloadResourceFile(resource.id);
    activeMenuId.value = null;
  } catch (err) {
    console.error('Download failed:', err);
    alert('Failed to download resource');
    activeMenuId.value = null;
  }
};

const shareResource = (resource: CounselorResource) => {
  // TODO: Implement share functionality
  activeMenuId.value = null;
};

const editResource = (resource: CounselorResource) => {
  // TODO: Implement edit functionality
  activeMenuId.value = null;
};

const handleDeleteResource = async (resource: CounselorResource) => {
  if (confirm(`Are you sure you want to delete "${resource.title}"?`)) {
    try {
      await deleteResource(resource.id);
      activeMenuId.value = null;
    } catch (err) {
      console.error('Delete failed:', err);
      alert('Failed to delete resource');
      activeMenuId.value = null;
    }
  } else {
    activeMenuId.value = null;
  }
};

const handleUploadResource = async () => {
  if (!fileInput.value?.files?.[0]) {
    alert('Please select a file to upload');
    return;
  }

  if (!uploadForm.value.title.trim()) {
    alert('Please enter a title');
    return;
  }

  if (!uploadForm.value.access_type) {
    alert('Please select access type (public or private)');
    return;
  }

  uploading.value = true;
  try {
    const formData = new FormData();
    formData.append('file', fileInput.value.files[0]);
    formData.append('title', uploadForm.value.title);
    formData.append('access_type', uploadForm.value.access_type);
    
    if (uploadForm.value.description) {
      formData.append('description', uploadForm.value.description);
    }
    
    if (uploadForm.value.category) {
      formData.append('category', uploadForm.value.category);
    }
    
    if (uploadForm.value.session_id) {
      formData.append('session_id', uploadForm.value.session_id);
    }
    
    if (uploadForm.value.program_id) {
      formData.append('program_id', uploadForm.value.program_id);
    }

    await uploadResourceApi(formData);
    showUploadModal.value = false;

    // Reset form
    uploadForm.value = {
      title: '',
      category: '',
      description: '',
      access_type: 'public' as 'public' | 'private',
      session_id: '',
      program_id: ''
    };
    
    // Reset file input
    if (fileInput.value) {
      fileInput.value.value = '';
    }
  } catch (err) {
    console.error('Upload failed:', err);
    alert('Failed to upload resource. Please try again.');
  } finally {
    uploading.value = false;
  }
};

const getFileType = (filename: string): 'PDF' | 'Video' | 'Audio' | 'Document' | 'Image' => {
  const ext = filename.split('.').pop()?.toLowerCase();
  if (ext === 'pdf') return 'PDF';
  if (['mp4', 'avi', 'mov', 'wmv', 'flv', 'webm', 'mkv'].includes(ext || '')) return 'Video';
  if (['mp3', 'wav', 'ogg', 'aac', 'm4a', 'flac'].includes(ext || '')) return 'Audio';
  if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'svg'].includes(ext || '')) return 'Image';
  return 'Document';
};

const formatFileSize = (bytes: number): string => {
  const sizes = ['B', 'KB', 'MB', 'GB'];
  if (bytes === 0) return '0 B';
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return Math.round(bytes / Math.pow(1024, i)) + ' ' + sizes[i];
};

onMounted(async () => {
  await fetchCounsellorResources();
  // Fetch sessions and programs for dropdowns
  await Promise.all([
    fetchCounsellorSessions(),
    fetchCounsellorPrograms()
  ]);
});

// Watch for upload modal opening to ensure sessions/programs are loaded
watch(showUploadModal, (isOpen) => {
  if (isOpen) {
    if (sessions.value.length === 0) {
      fetchCounsellorSessions();
    }
    if (programs.value.length === 0) {
      fetchCounsellorPrograms();
    }
  }
});
</script>
