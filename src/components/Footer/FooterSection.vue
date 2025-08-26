<template>
  <footer class="bg-gray-900 text-white py-12">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid md:grid-cols-4 gap-8">
        <div>
          <div class="flex items-center space-x-2 mb-4">
            <div class="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
              <img
                src="/images/logo.png"
                alt="logo"
                class="w-6 h-6"
              />
            </div>
            <span class="text-xl font-bold">FamiSpace</span>
          </div>
          <p class="text-gray-400 mb-4">
            Professional counseling and educational services through our secure online platform.
          </p>
        </div>

        <div>
          <h3 class="font-semibold mb-4">Platform</h3>
          <ul class="space-y-2 text-gray-400">
            <li v-for="(link, index) in platformLinks" :key="index">
              <a href="#" class="hover:text-white">{{ link }}</a>
            </li>
          </ul>
        </div>

        <div>
          <h3 class="font-semibold mb-4">Company</h3>
          <ul class="space-y-2 text-gray-400">
            <li v-for="(link, index) in companyLinks" :key="index">
              <a href="#" class="hover:text-white">{{ link }}</a>
            </li>
          </ul>
        </div>

        <div>
          <h3 class="font-semibold mb-4">Contact</h3>
          <ul class="space-y-2 text-gray-400">
            <li>support@familiacenter.com</li>
            <li>+254 754235890</li>
            <li>24/7 Support Available</li>
          </ul>
        </div>
      </div>

      <div class="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
        <p>&copy; 2025 FamiSpace Platform. All rights reserved.</p>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
const platformLinks = [
  "Live Sessions",
  "Programs",
  "Resources",
  "Support"
];

const companyLinks = [
  "About Us",
  "Counselors",
  "Privacy Policy",
  "Terms of Service"
];
</script>
