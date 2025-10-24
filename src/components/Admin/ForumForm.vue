<template>
  <div class="max-w-4xl mx-auto">
    <form @submit.prevent="handleSubmit" class="space-y-6">
      <!-- Basic Information -->
      <div class="bg-white rounded-lg shadow-sm p-6">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">Basic Information</h2>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Title *</label>
            <input
              v-model="form.title"
              type="text"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              placeholder="Enter forum title"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Category</label>
            <input
              v-model="form.category"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              placeholder="e.g., Workshop, Panel Discussion"
            />
          </div>
        </div>

        <div class="mt-6">
          <label class="block text-sm font-medium text-gray-700 mb-2">Description *</label>
          <textarea
            v-model="form.description"
            required
            rows="3"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            placeholder="Enter forum description"
          ></textarea>
        </div>
      </div>

      <!-- Date & Time -->
      <div class="bg-white rounded-lg shadow-sm p-6">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">Date & Time</h2>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Date *</label>
            <input
              v-model="form.date"
              type="date"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Time *</label>
            <input
              v-model="form.time"
              type="time"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
          </div>
        </div>

        <div class="mt-6">
          <label class="block text-sm font-medium text-gray-700 mb-2">Duration</label>
          <input
            v-model="form.duration"
            type="text"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            placeholder="e.g., 2 hours"
          />
        </div>
      </div>

      <!-- Location & Format -->
      <div class="bg-white rounded-lg shadow-sm p-6">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">Location & Format</h2>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Location *</label>
            <input
              v-model="form.location"
              type="text"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              placeholder="e.g., Online via Zoom, Community Center"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Format *</label>
            <select
              v-model="form.format"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            >
              <option value="">Select format</option>
              <option value="Virtual">Virtual</option>
              <option value="In-Person">In-Person</option>
              <option value="Hybrid">Hybrid</option>
              <option value="Interactive Workshop">Interactive Workshop</option>
              <option value="Panel Discussion">Panel Discussion</option>
            </select>
          </div>
        </div>

        <div class="mt-6">
          <label class="block text-sm font-medium text-gray-700 mb-2">Capacity</label>
          <input
            v-model.number="form.capacity"
            type="number"
            min="1"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            placeholder="Maximum number of participants"
          />
        </div>
      </div>

      <!-- Content -->
      <div class="bg-white rounded-lg shadow-sm p-6">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">Content</h2>
        
        <div class="space-y-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">About This Event</label>
            <textarea
              v-model="form.about"
              rows="4"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              placeholder="Detailed description of the event"
            ></textarea>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Additional Information</label>
            <textarea
              v-model="form.about2"
              rows="3"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              placeholder="Additional details about the event"
            ></textarea>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Topics</label>
            <div class="flex flex-wrap gap-2 mb-2">
              <span
                v-for="(topic, index) in form.topics"
                :key="index"
                class="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800"
              >
                {{ topic }}
                <button
                  type="button"
                  @click="removeTopic(index)"
                  class="ml-2 text-green-600 hover:text-green-800"
                >
                  ×
                </button>
              </span>
            </div>
            <div class="flex">
              <input
                v-model="newTopic"
                type="text"
                @keyup.enter="addTopic"
                class="flex-1 px-3 py-2 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="Add a topic"
              />
              <button
                type="button"
                @click="addTopic"
                class="px-4 py-2 bg-green-600 text-white rounded-r-lg hover:bg-green-700"
              >
                Add
              </button>
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Learning Points</label>
            <div class="space-y-2">
              <div
                v-for="(point, index) in form.learning_points"
                :key="index"
                class="flex items-center space-x-2"
              >
                <input
                  v-model="form.learning_points[index]"
                  type="text"
                  class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="What participants will learn"
                />
                <button
                  type="button"
                  @click="removeLearningPoint(index)"
                  class="text-red-600 hover:text-red-800"
                >
                  Remove
                </button>
              </div>
              <button
                type="button"
                @click="addLearningPoint"
                class="text-green-600 hover:text-green-800 text-sm"
              >
                + Add Learning Point
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Settings -->
      <div class="bg-white rounded-lg shadow-sm p-6">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">Settings</h2>
        
        <div class="flex items-center">
          <input
            v-model="form.isPublic"
            type="checkbox"
            class="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
          />
          <label class="ml-2 text-sm text-gray-700">Make this forum public</label>
        </div>
      </div>

      <!-- Actions -->
      <div class="flex justify-end space-x-4">
        <router-link
          to="/admin-dashboard/forums"
          class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </router-link>
        <button
          type="submit"
          :disabled="loading"
          class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
        >
          {{ loading ? 'Saving...' : (isEdit ? 'Update Forum' : 'Create Forum') }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ForumService } from '@/services/apiService';
import type { Forum } from '@/types';

const route = useRoute();
const router = useRouter();
const loading = ref(false);
const isEdit = ref(false);

const newTopic = ref('');

const form = ref({
  title: '',
  description: '',
  category: '',
  date: '',
  time: '',
  duration: '',
  location: '',
  format: '',
  capacity: 50,
  topics: [] as string[],
  about: '',
  about2: '',
  learning_points: [] as string[],
  isPublic: true
});

const addTopic = () => {
  if (newTopic.value.trim()) {
    form.value.topics.push(newTopic.value.trim());
    newTopic.value = '';
  }
};

const removeTopic = (index: number) => {
  form.value.topics.splice(index, 1);
};

const addLearningPoint = () => {
  form.value.learning_points.push('');
};

const removeLearningPoint = (index: number) => {
  form.value.learning_points.splice(index, 1);
};

const handleSubmit = async () => {
  loading.value = true;
  
  try {
    if (isEdit.value) {
      await ForumService.updateForum(route.params.id as string, form.value);
    } else {
      await ForumService.createForum(form.value);
    }
    
    router.push('/admin-dashboard/forums');
  } catch (error) {
    console.error('Error saving forum:', error);
  } finally {
    loading.value = false;
  }
};

onMounted(async () => {
  if (route.params.id && route.name === 'admin-edit-forum') {
    isEdit.value = true;
    try {
      const response = await ForumService.getForumById(route.params.id as string);
      if (response.success) {
        const forum = response.data;
        form.value = {
          title: forum.title,
          description: forum.description,
          category: forum.category,
          date: forum.date,
          time: forum.time,
          duration: forum.duration,
          location: forum.location,
          format: forum.format,
          capacity: forum.capacity,
          topics: forum.topics,
          about: forum.about,
          about2: forum.about2,
          learning_points: forum.learning_points,
          isPublic: forum.isPublic || true
        };
      }
    } catch (error) {
      console.error('Error fetching forum:', error);
    }
  }
});
</script>
