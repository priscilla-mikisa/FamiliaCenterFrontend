<template>
  <section class="py-20 bg-white">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-16">
        <h2 class="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
          Designed for Everyone
        </h2>
        <p class="text-xl text-gray-600 max-w-3xl mx-auto">
          Our platform serves different user types with customized experiences and role-based access to ensure the best possible counseling experience.
        </p>
      </div>

      <div class="grid lg:grid-cols-3 gap-8">
        <div v-for="(userType, index) in userTypes" :key="index" class="bg-gradient-to-br from-green-50 to-blue-50 rounded-xl p-8">
          <h3 class="text-2xl font-bold text-gray-900 mb-6">{{ userType.title }}</h3>
          <ul class="space-y-3">
            <li v-for="(feature, featureIndex) in userType.features" :key="featureIndex" class="flex items-start space-x-3">
              <CheckCircleIcon class="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
              <span class="text-gray-700">{{ feature }}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const userTypes = [
  {
    title: "Individuals & Couples",
    features: [
      "Access to 6-week structured programs",
      "One-time counseling sessions",
      "Live sessions via Google Meet",
      "Recorded session playback",
      "Topic selection (Parenting, Marriage, etc.)",
      "Session reminders & notifications"
    ]
  },
  {
    title: "Counselors & Experts",
    features: [
      "Professional dashboard",
      "Session management tools",
      "Google Meet integration",
      "Resource upload capabilities",
      "Progress tracking & notes",
      "Client assignment management"
    ]
  },
  {
    title: "Administrators",
    features: [
      "Complete platform oversight",
      "User & counselor management",
      "Program creation & publishing",
      "Payment & subscription control",
      "Activity logs & analytics",
      "System configuration"
    ]
  }
];
</script>
