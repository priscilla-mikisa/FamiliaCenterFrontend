<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center">
    <div class="text-center">
      <h1 class="text-9xl font-bold text-gray-300">401</h1>
      <h2 class="text-2xl font-bold text-gray-900 mb-4">Unauthorized</h2>
      <p class="text-gray-600 mb-8">You don't have permission to access this page.</p>
      <router-link to="/login" class="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700">
        Sign In
      </router-link>
    </div>
  </div>
</template>
