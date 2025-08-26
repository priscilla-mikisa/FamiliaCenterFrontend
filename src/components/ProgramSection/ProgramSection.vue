<template>
  <section id="programs" class="py-20 bg-gray-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-16">
        <h2 class="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
          Our Family Enrichment Programs
        </h2>
        <p class="text-xl text-gray-600 max-w-3xl mx-auto">
          Choose from structured learning journeys or focused support sessions
        </p>
      </div>

      <div v-for="(group, groupIndex) in programs" :key="groupIndex" class="mb-12">
        <h3 class="text-2xl font-bold text-gray-800 mb-6 text-center">
          <span class="inline-flex items-center">
            <span class="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
            {{ group.category }}
          </span>
        </h3>
        <div class="flex flex-wrap justify-center gap-6">
          <div
            v-for="(program, index) in group.items"
            :key="index"
            class="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow border border-gray-100 w-full md:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] max-w-md"
          >
            <div class="p-6">
              <div class="flex justify-between items-start mb-4">
                <h3 class="text-xl font-bold text-gray-900">{{ program.title }}</h3>
                <span class="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                  {{ program.format }}
                </span>
              </div>

              <div class="flex items-center text-sm text-gray-500 mb-4 space-x-4">
                <span class="flex items-center">
                  <ClockIcon class="w-4 h-4 mr-1" />
                  {{ program.duration }}
                </span>
                <span class="flex items-center">
                  <UsersIcon class="w-4 h-4 mr-1" />
                  {{ program.format.includes("Group") ? "Small Groups" : "1-on-1" }}
                </span>
              </div>

              <p class="text-gray-600 mb-4">{{ program.description }}</p>

              <div class="space-y-2">
                <h4 class="text-sm font-semibold text-gray-900">Key Focus Areas:</h4>
                <ul class="space-y-1">
                  <li v-for="(topic, topicIndex) in program.topics" :key="topicIndex" class="flex items-center space-x-2 text-gray-600 text-sm">
                    <div class="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                    <span>{{ topic }}</span>
                  </li>
                </ul>
              </div>
            </div>
            <div class="px-6 pb-6">
              <button class="w-full px-4 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium text-sm">
                View Program Details
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="text-center mt-8">
        <button class="px-6 py-3 border border-green-600 text-green-600 rounded-lg hover:bg-green-50 font-medium">
          View All Programs
        </button>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const programs = [
  {
    category: "Core Programs",
    items: [
      {
        title: "Parenting With Purpose",
        duration: "6 weeks",
        format: "Group Cohort",
        description: "Biblical parenting strategies for modern challenges",
        topics: ["Discipline", "Communication", "Faith Development"]
      },
      {
        title: "Marriage Restoration",
        duration: "8 weeks",
        format: "Private",
        description: "Rebuild trust and intimacy in your marriage",
        topics: ["Conflict Resolution", "Forgiveness", "Reconnection"]
      }
    ]
  },
  {
    category: "Specialty Tracks",
    items: [
      {
        title: "Overcoming Addiction",
        duration: "12 weeks",
        format: "Group/Private",
        description: "Christ-centered recovery program",
        topics: ["Accountability", "Triggers", "Support Systems"]
      }
    ]
  }
];
</script>
