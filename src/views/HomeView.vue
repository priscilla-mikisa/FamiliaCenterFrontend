<template>
  <div class="min-h-screen bg-white">
    <!-- Header -->
    <Header />

    <!-- Hero Section -->
    <HeroSection />

    <!-- Features Section -->
    <FeatureSection />

    <!-- Programs Section -->
    <ProgramSection />

    <!-- User Options -->
    <UsersOptions />

    <!-- About Section -->
    <AboutSection />

    <!-- CTA Section -->
    <CallToActionSection />

    <!-- Footer -->
    <FooterSection />
  </div>
</template>

<script setup lang="ts">
import Header from '@/components/Header/AppHeader.vue';
import HeroSection from '@/components/HeroSection/HeroSection.vue';
import FeatureSection from '@/components/FeatureSection/FeatureSection.vue';
import ProgramSection from '@/components/ProgramSection/ProgramSection.vue';
import UsersOptions from '@/components/UsersOptions/UsersOptions.vue';
import CallToActionSection from '@/components/CallToActionSection/CallToActionSection.vue';
import AboutSection from '@/components/About/AboutSection.vue';
import FooterSection from '@/components/Footer/FooterSection.vue';
</script>
