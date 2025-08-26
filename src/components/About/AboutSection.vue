<template>
  <section id="about" class="py-20 bg-gray-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <div class="inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium mb-6">
            Our Approach
          </div>
          <h2 class="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Helping Families Thrive Through Faith-Based Support
          </h2>
          <p class="text-lg text-gray-600 mb-8">
            Familia Center combines professional guidance with spiritual wisdom to strengthen families at every stage.
          </p>

          <div class="space-y-6">
            <div v-for="(item, index) in approachItems" :key="index" class="flex items-start space-x-4">
              <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <component :is="item.icon" class="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 class="font-semibold text-gray-900 mb-2">{{ item.title }}</h3>
                <p class="text-gray-600">{{ item.description }}</p>
              </div>
            </div>
          </div>
        </div>

        <div class="relative">
          <div class="bg-white rounded-2xl shadow-2xl p-8">
            <div class="text-center">
              <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <HeartIcon class="w-8 h-8 text-green-600" />
              </div>
              <h3 class="text-2xl font-bold text-gray-900 mb-2">Our Mission</h3>
              <p class="text-gray-600 mb-1">
                "Helping families thrive, not just survive"
              </p>
              <p class="text-gray-600 mb-6">
                To provide Christ-centered support through professional guidance, educational programs, and community resources.
              </p>
              <div class="grid grid-cols-3 gap-4 pt-6 border-t border-gray-200">
                <div class="text-center">
                  <div class="text-2xl font-bold text-green-600">6+</div>
                  <div class="text-sm text-gray-500">Structured Programs</div>
                </div>
                <div class="text-center">
                  <div class="text-2xl font-bold text-green-600">50+</div>
                  <div class="text-sm text-gray-500">Expert Facilitators</div>
                </div>
                <div class="text-center">
                  <div class="text-2xl font-bold text-green-600">3</div>
                  <div class="text-sm text-gray-500">Support Formats</div>
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
import { ShieldIcon, UserCheckIcon, MonitorIcon } from 'lucide-vue-next';

const approachItems = [
  {
    icon: ShieldIcon,
    title: "Faith-Based Foundation",
    description: "We integrate Biblical principles with professional expertise to help families build God-centered relationships."
  },
  {
    icon: UserCheckIcon,
    title: "Threefold Support",
    description: "Structured learning programs, live guidance sessions, and on-demand resources tailored to your family's needs."
  },
  {
    icon: MonitorIcon,
    title: "Accessible Design",
    description: "Our platform works seamlessly on any device, with multiple formats to fit your schedule."
  }
];
</script>
