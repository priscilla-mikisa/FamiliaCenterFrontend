<template>
  <section id="home" class="pt-24 pb-16 bg-gradient-to-br from-green-50 to-blue-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <div class="inline-flex items-center space-x-2 bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium mb-6">
            <AwardIcon class="w-4 h-4" />
            <span>Faith-Based Family Support</span>
          </div>

          <h1 class="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            <span class="text-green-600">Grow stronger together</span> through guided programs and expert support
          </h1>
          <p class="text-xl text-gray-600 mb-8">
            Access our 3-part system: structured learning, live guidance sessions, and on-demand resources - all designed to help your family flourish.
          </p>

          <div class="flex flex-col sm:flex-row gap-4 mb-10">
            <button class="px-8 py-4 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium flex items-center justify-center space-x-2">
              <span>Explore Programs</span>
              <ArrowRightIcon class="w-5 h-5" />
            </button>
            <button class="px-8 py-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium flex items-center justify-center space-x-2">
              <PlayIcon class="w-5 h-5" />
              <span>How It Works</span>
            </button>
          </div>

          <div class="flex items-center space-x-4">
            <div class="flex -space-x-2">
              <div v-for="i in 4" :key="i" class="w-10 h-10 rounded-full bg-gray-200 border-2 border-white"></div>
            </div>
            <div class="text-sm text-gray-600">
              <p>Trusted by <span class="font-medium">200+ families</span></p>
              <p class="flex items-center">
                <span class="mr-1">⭐️⭐️⭐️⭐️⭐️</span>
                <span>4.9/5 rating</span>
              </p>
            </div>
          </div>
        </div>

        <div class="relative">
          <div class="bg-white rounded-2xl shadow-2xl p-8 transform hover:scale-[1.02] transition-transform duration-300">
            <div class="flex items-center space-x-3 mb-6">
              <div class="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <VideoIcon class="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 class="font-semibold text-gray-900">Three Ways We Help</h3>
                <p class="text-sm text-gray-500">Choose what works for your family</p>
              </div>
            </div>
            <div class="space-y-4">
              <div v-for="(item, index) in helpItems" :key="index" class="flex items-start space-x-3">
                <div class="mt-0.5">
                  <div class="w-5 h-5 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-xs font-bold">{{ index + 1 }}</div>
                </div>
                <div>
                  <h4 class="font-medium text-gray-900">{{ item.title }}</h4>
                  <p class="text-sm text-gray-600">{{ item.description }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const helpItems = [
  {
    title: "Structured Programs",
    description: "6-week guided courses with weekly lessons"
  },
  {
    title: "Live Guidance",
    description: "Q&A sessions with family experts"
  },
  {
    title: "Resource Library",
    description: "On-demand videos and worksheets"
  }
];
</script>
