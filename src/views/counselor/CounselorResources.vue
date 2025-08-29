<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="bg-white rounded-xl shadow p-6">
      <div class="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
        <h2 class="text-xl font-semibold text-gray-900">Resource Management</h2>
        <div class="flex space-x-3">
          <div class="relative">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search resources..."
              class="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <SearchIcon class="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
          </div>
          <select
            v-model="filterCategory"
            class="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Categories</option>
            <option value="Marriage Counseling">Marriage Counseling</option>
            <option value="Family Therapy">Family Therapy</option>
            <option value="Parenting">Parenting</option>
            <option value="Stress Management">Stress Management</option>
          </select>
          <button
            @click="showUploadModal = true"
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
          >
            <UploadIcon class="w-4 h-4 mr-2" />
            Upload Resource
          </button>
        </div>
      </div>
    </div>

    <!-- Resource Stats -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div class="bg-white rounded-xl shadow p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-500">Total Resources</p>
            <p class="text-2xl font-bold mt-1">{{ resources.length }}</p>
          </div>
          <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <FileTextIcon class="w-5 h-5 text-blue-600" />
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl shadow p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-500">Public Resources</p>
            <p class="text-2xl font-bold mt-1">{{ publicResources.length }}</p>
          </div>
          <div class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
            <ShareIcon class="w-5 h-5 text-green-600" />
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl shadow p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-500">This Month</p>
            <p class="text-2xl font-bold mt-1">{{ monthlyUploads }}</p>
          </div>
          <div class="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
            <CalendarIcon class="w-5 h-5 text-purple-600" />
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl shadow p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-500">Storage Used</p>
            <p class="text-2xl font-bold mt-1">2.4GB</p>
          </div>
          <div class="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
            <HardDriveIcon class="w-5 h-5 text-yellow-600" />
          </div>
        </div>
      </div>
    </div>

    <!-- Resources Grid -->
    <div class="bg-white rounded-xl shadow">
      <div class="p-6 border-b">
        <h3 class="text-lg font-semibold text-gray-900">My Resources</h3>
      </div>
      <div class="p-6">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div
            v-for="resource in filteredResources"
            :key="resource.id"
            class="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <div class="flex items-start justify-between mb-3">
              <div class="flex items-start space-x-3">
                <div :class="`w-10 h-10 rounded-lg flex items-center justify-center ${getResourceTypeClass(resource.type)}`">
                  <component :is="getResourceIcon(resource.type)" class="w-5 h-5" />
                </div>
                <div class="flex-1">
                  <h4 class="font-medium text-gray-900 truncate">{{ resource.title }}</h4>
                  <p class="text-sm text-gray-600">{{ resource.category }}</p>
                </div>
              </div>
              <div class="relative">
                <button
                  @click="toggleResourceMenu(resource.id)"
                  class="p-1 rounded hover:bg-gray-100"
                >
                  <MoreVerticalIcon class="w-4 h-4" />
                </button>
                <div
                  v-if="activeMenuId === resource.id"
                  class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10"
                >
                  <button
                    @click="downloadResource(resource)"
                    class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-t-lg flex items-center"
                  >
                    <DownloadIcon class="w-4 h-4 mr-2" />
                    Download
                  </button>
                  <button
                    @click="shareResource(resource)"
                    class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center"
                  >
                    <ShareIcon class="w-4 h-4 mr-2" />
                    Share with Client
                  </button>
                  <button
                    @click="editResource(resource)"
                    class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center"
                  >
                    <EditIcon class="w-4 h-4 mr-2" />
                    Edit
                  </button>
                  <button
                    @click="deleteResource(resource)"
                    class="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50 rounded-b-lg flex items-center"
                  >
                    <TrashIcon class="w-4 h-4 mr-2" />
                    Delete
                  </button>
                </div>
              </div>
            </div>

            <div class="space-y-2 text-sm text-gray-600">
              <div class="flex justify-between">
                <span>Size:</span>
                <span>{{ resource.size }}</span>
              </div>
              <div class="flex justify-between">
                <span>Uploaded:</span>
                <span>{{ formatDate(resource.uploadDate) }}</span>
              </div>
              <div class="flex justify-between">
                <span>Visibility:</span>
                <span :class="resource.isPublic ? 'text-green-600' : 'text-gray-600'">
                  {{ resource.isPublic ? 'Public' : 'Private' }}
                </span>
              </div>
            </div>

            <div v-if="resource.description" class="mt-3 p-2 bg-gray-50 rounded text-sm text-gray-700">
              {{ resource.description }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Upload Modal -->
    <div v-if="showUploadModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div class="bg-white rounded-xl max-w-md w-full">
        <div class="p-6 border-b">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold">Upload Resource</h3>
            <button @click="showUploadModal = false" class="p-1 hover:bg-gray-100 rounded">
              <XIcon class="w-5 h-5" />
            </button>
          </div>
        </div>

        <form @submit.prevent="uploadResource" class="p-6 space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input
              v-model="uploadForm.title"
              type="text"
              required
              class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select
              v-model="uploadForm.category"
              required
              class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select category</option>
              <option value="Marriage Counseling">Marriage Counseling</option>
              <option value="Family Therapy">Family Therapy</option>
              <option value="Parenting">Parenting</option>
              <option value="Stress Management">Stress Management</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              v-model="uploadForm.description"
              rows="3"
              class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
              placeholder="Brief description of the resource..."
            ></textarea>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">File</label>
            <input
              ref="fileInput"
              type="file"
              required
              accept=".pdf,.doc,.docx,.mp3,.mp4,.jpg,.png,.ppt,.pptx"
              class="w-full border border-gray-300 rounded-lg px-3 py-2"
            />
          </div>

          <div class="flex items-center">
            <input
              v-model="uploadForm.isPublic"
              type="checkbox"
              class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label class="ml-2 text-sm text-gray-700">
              Make this resource publicly available to all clients
            </label>
          </div>

          <div class="flex space-x-3 pt-4">
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
              class="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
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
import { ref, computed } from 'vue';
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
  VideoIcon
} from 'lucide-vue-next';
import type { CounselorResource } from '@/types/counselor';

const searchQuery = ref('');
const filterCategory = ref('');
const showUploadModal = ref(false);
const activeMenuId = ref<string | null>(null);
const uploading = ref(false);

const uploadForm = ref({
  title: '',
  category: '',
  description: '',
  isPublic: false
});

const fileInput = ref<HTMLInputElement | null>(null);

// Mock resources data
const resources = ref<CounselorResource[]>([
  {
    id: '1',
    title: 'Communication Skills Workbook',
    description: 'A comprehensive guide to improving communication in relationships.',
    type: 'PDF',
    category: 'Marriage Counseling',
    size: '2.4 MB',
    url: '/resources/1',
    uploadDate: '2024-01-20',
    isPublic: true
  },
  {
    id: '2',
    title: 'Parenting Techniques Video Series',
    description: 'Video series on effective parenting strategies.',
    type: 'Video',
    category: 'Parenting',
    size: '145 MB',
    url: '/resources/2',
    uploadDate: '2024-01-18',
    isPublic: false
  },
  {
    id: '3',
    title: 'Stress Management Audio Guide',
    description: 'Guided meditation and stress reduction techniques.',
    type: 'Audio',
    category: 'Stress Management',
    size: '25 MB',
    url: '/resources/3',
    uploadDate: '2024-01-15',
    isPublic: true
  }
]);

const publicResources = computed(() =>
  resources.value.filter(r => r.isPublic)
);

const monthlyUploads = computed(() => {
  const thisMonth = new Date().getMonth();
  return resources.value.filter(r =>
    new Date(r.uploadDate).getMonth() === thisMonth
  ).length;
});

const filteredResources = computed(() => {
  let filtered = resources.value;

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
    'Document': 'bg-green-100 text-green-600'
  };
  return classes[type as keyof typeof classes] || 'bg-gray-100 text-gray-600';
};

const getResourceIcon = (type: string) => {
  const icons = {
    'PDF': FileTextIcon,
    'Video': VideoIcon,
    'Audio': PlayIcon,
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

const downloadResource = (resource: CounselorResource) => {
  console.log('Downloading resource:', resource.title);
  activeMenuId.value = null;
};

const shareResource = (resource: CounselorResource) => {
  console.log('Sharing resource:', resource.title);
  activeMenuId.value = null;
};

const editResource = (resource: CounselorResource) => {
  console.log('Editing resource:', resource.title);
  activeMenuId.value = null;
};

const deleteResource = (resource: CounselorResource) => {
  if (confirm(`Are you sure you want to delete "${resource.title}"?`)) {
    const index = resources.value.findIndex(r => r.id === resource.id);
    if (index !== -1) {
      resources.value.splice(index, 1);
    }
  }
  activeMenuId.value = null;
};

const uploadResource = async () => {
  if (!fileInput.value?.files?.[0]) return;

  uploading.value = true;
  try {
    // Simulate upload
    await new Promise(resolve => setTimeout(resolve, 2000));

    const file = fileInput.value.files[0];
    const newResource: CounselorResource = {
      id: Date.now().toString(),
      title: uploadForm.value.title,
      description: uploadForm.value.description,
      type: getFileType(file.name),
      category: uploadForm.value.category,
      size: formatFileSize(file.size),
      url: `/resources/${Date.now()}`,
      uploadDate: new Date().toISOString(),
      isPublic: uploadForm.value.isPublic
    };

    resources.value.unshift(newResource);
    showUploadModal.value = false;

    // Reset form
    uploadForm.value = {
      title: '',
      category: '',
      description: '',
      isPublic: false
    };
  } catch (error) {
    console.error('Upload failed:', error);
  } finally {
    uploading.value = false;
  }
};

const getFileType = (filename: string): 'PDF' | 'Video' | 'Audio' | 'Document' => {
  const ext = filename.split('.').pop()?.toLowerCase();
  if (ext === 'pdf') return 'PDF';
  if (['mp4', 'avi', 'mov'].includes(ext || '')) return 'Video';
  if (['mp3', 'wav', 'ogg'].includes(ext || '')) return 'Audio';
  return 'Document';
};

const formatFileSize = (bytes: number): string => {
  const sizes = ['B', 'KB', 'MB', 'GB'];
  if (bytes === 0) return '0 B';
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return Math.round(bytes / Math.pow(1024, i)) + ' ' + sizes[i];
};
</script>
