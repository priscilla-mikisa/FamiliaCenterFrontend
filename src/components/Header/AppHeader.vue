<template>
  <header class="bg-white shadow-sm fixed w-full top-0 z-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center py-4">
        <div class="flex items-center space-x-2">
          <div class="w-8 h-8 bg-gradient-to-r from-green-400 to-green-600 rounded-lg flex items-center justify-center">
            <img
              src="/images/logo.png"
              alt="logo"
              class="w-6 h-6"
            />
          </div>
          <span class="text-xl font-bold text-gray-900">FamiSpace</span>
        </div>

        <!-- Desktop Navigation -->
        <nav class="hidden md:flex space-x-8">
          <a href="#home" class="text-green-600 font-medium">Home</a>
          <a href="#features" class="text-gray-700 hover:text-green-600">Features</a>
          <a href="#programs" class="text-gray-700 hover:text-green-600">Programs</a>
          <a href="#about" class="text-gray-700 hover:text-green-600">About</a>
          <a href="#contact" class="text-gray-700 hover:text-green-600">Contact</a>
        </nav>

        <div class="hidden md:flex space-x-4">
          <router-link to="/login">
            <button class="px-4 py-2 text-green-600 border border-green-600 rounded-lg hover:bg-green-50">
              Sign In
            </button>
          </router-link>
          <router-link to="/signup">
            <button class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
              Get Started
            </button>
          </router-link>
        </div>

        <!-- Mobile menu button -->
        <button
          class="md:hidden"
          @click="isMenuOpen = !isMenuOpen"
        >
          <XIcon class="w-6 h-6" v-if="isMenuOpen" />
          <MenuIcon class="w-6 h-6" v-else />
        </button>
      </div>
    </div>

    <!-- Mobile Navigation -->
    <div v-if="isMenuOpen" class="md:hidden bg-white border-t">
      <div class="px-4 py-2 space-y-2">
        <a href="#home" class="block py-2 text-green-600 font-medium">Home</a>
        <a href="#about" class="block py-2 text-gray-700">About</a>
        <a href="#programs" class="block py-2 text-gray-700">Programs</a>
        <a href="#features" class="block py-2 text-gray-700">Features</a>
        <a href="#contact" class="block py-2 text-gray-700">Contact</a>
        <div class="pt-4 space-y-2">
          <router-link to="/login" class="block w-full px-4 py-2 text-green-600 border border-green-600 rounded-lg text-center">
            Sign In
          </router-link>
          <router-link to="/signup" class="block w-full px-4 py-2 bg-green-600 text-white rounded-lg text-center">
            Get Started
          </router-link>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const isMenuOpen = ref(false);
</script>
