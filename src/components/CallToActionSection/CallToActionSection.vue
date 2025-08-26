<template>
  <section class="py-20 bg-gradient-to-r from-green-600 to-green-700">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
      <h2 class="text-3xl lg:text-4xl font-bold text-white mb-6">
        Find the Right Support for Your Family
      </h2>
      <p class="text-xl text-green-100 mb-8">
        Get started with confidence - all first-time participants receive a free consultation.
      </p>
      <div class="flex flex-col sm:flex-row gap-4 justify-center">
        <button class="px-8 py-4 bg-white text-green-600 rounded-lg hover:bg-gray-50 font-medium shadow-md">
          Browse Programs
        </button>
        <button class="px-8 py-4 border-2 border-white text-white rounded-lg hover:bg-white hover:text-green-600 font-medium">
          Free 15-Min Consultation
        </button>
      </div>
      <div class="mt-8 flex flex-wrap justify-center gap-6 text-green-100 text-sm">
        <div v-for="(item, index) in benefits" :key="index" class="flex items-center">
          <span class="mr-2">✓</span> {{ item }}
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const benefits = [
  "No long-term commitment",
  "Faith-based approach",
  "Cancel anytime"
];
</script>
