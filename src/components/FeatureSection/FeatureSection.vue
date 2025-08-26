<template>
  <section id="features" class="py-20 bg-white">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-16">
        <h2 class="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
          Our Comprehensive Support Platform
        </h2>
        <p class="text-xl text-gray-600 max-w-3xl mx-auto">
          Designed to meet families wherever they are in their journey
        </p>
      </div>

      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="(feature, index) in features" :key="index" class="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow hover:border-green-100">
          <div class="flex items-start space-x-4">
            <div :class="`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${getTypeClass(feature.type)}`">
              <component :is="feature.icon" class="w-5 h-5" />
            </div>
            <div>
              <h3 class="font-semibold text-gray-900 mb-1">{{ feature.title }}</h3>
              <p class="text-gray-600 text-sm">{{ feature.description }}</p>
              <span :class="`inline-block mt-2 text-xs px-2 py-1 rounded-full ${getTypeBadgeClass(feature.type)}`">
                {{ feature.type }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { BookOpenIcon, ShieldIcon, UsersIcon, VideoIcon, DownloadIcon, LockIcon } from 'lucide-vue-next';

const features = [
  {
    icon: BookOpenIcon,
    title: "Structured Programs",
    description: "6-12 week guided courses with weekly lessons and exercises",
    type: "Educational"
  },
  {
    icon: VideoIcon,
    title: "Live Guidance Sessions",
    description: "Interactive Q&A with family experts via secure video",
    type: "Interactive"
  },
  {
    icon: DownloadIcon,
    title: "Resource Library",
    description: "On-demand videos, worksheets, and reading materials",
    type: "Self-Paced"
  },
  {
    icon: UsersIcon,
    title: "Multiple Formats",
    description: "Choose between self-study, group cohorts, or private sessions",
    type: "Flexible"
  },
  {
    icon: ShieldIcon,
    title: "Faith-Based Approach",
    description: "Biblical principles integrated with professional expertise",
    type: "Spiritual"
  },
  {
    icon: LockIcon,
    title: "Complete Privacy",
    description: "Anonymous participation options available",
    type: "Secure"
  }
];

const getTypeClass = (type: string) => {
  switch (type) {
    case "Educational": return "bg-blue-100 text-blue-600";
    case "Interactive": return "bg-purple-100 text-purple-600";
    case "Spiritual": return "bg-green-100 text-green-600";
    default: return "bg-gray-100 text-gray-600";
  }
};

const getTypeBadgeClass = (type: string) => {
  switch (type) {
    case "Educational": return "bg-blue-50 text-blue-600";
    case "Interactive": return "bg-purple-50 text-purple-600";
    case "Spiritual": return "bg-green-50 text-green-600";
    default: return "bg-gray-50 text-gray-600";
  }
};
</script>
