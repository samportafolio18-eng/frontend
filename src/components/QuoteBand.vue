<script setup lang="ts">
import { computed } from 'vue'
import { site } from '../store/site'

const text = computed(() => site.contact.quoteText)
const author = computed(() => site.contact.quoteAuthor)
</script>

<template>
  <section class="quote">
    <span class="quote__mark" aria-hidden="true">❝</span>
    <p v-reveal class="quote__text">{{ text }}</p>
    <p v-if="author" v-reveal="120" class="quote__author">— {{ author }}</p>
  </section>
</template>

<style scoped>
.quote {
  background: radial-gradient(circle at 50% 0%, #4a2711, #2e1d11 75%);
  color: #f4ecdd;
  text-align: center;
  padding: 100px 24px;
  position: relative;
  overflow: hidden;
}
.quote__mark {
  display: block;
  font-size: 5rem;
  line-height: 0.6;
  color: #d99a4e;
  opacity: 0.65;
  margin-bottom: 8px;
}
.quote__text {
  max-width: 760px;
  margin: 0 auto;
  font-size: clamp(1.4rem, 3.2vw, 2.1rem);
  line-height: 1.5;
  font-weight: 600;
  white-space: pre-line; /* respeta los saltos de línea de la frase */
}
.quote__hl {
  color: #d99a4e;
}
.quote__author {
  margin: 22px 0 0;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  font-size: 0.78rem;
  color: rgba(244, 236, 221, 0.65);
}
</style>
