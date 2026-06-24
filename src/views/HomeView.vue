<script setup lang="ts">
import HeroSection from '../components/HeroSection.vue'
import AboutSection from '../components/AboutSection.vue'
import FeaturedBand from '../components/FeaturedBand.vue'
import QuoteBand from '../components/QuoteBand.vue'
import ContactSection from '../components/ContactSection.vue'
import { kindsWithFeatured } from '../data/categories'

// Una banda "… destacadas" por disciplina que tenga obras destacadas.
// Si ninguna disciplina tiene destacadas, no se muestra ninguna banda.
const featuredKinds = kindsWithFeatured()
</script>

<template>
  <main>
    <HeroSection />
    <AboutSection />
    <FeaturedBand
      v-for="(k, i) in featuredKinds"
      :key="k"
      :kind="k"
      :anchor="i === 0 ? 'destacados' : `destacados-${k}`"
      :alt="i % 2 === 1"
    />
    <QuoteBand />
    <ContactSection />
  </main>
</template>
