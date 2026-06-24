<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'

const visible = ref(false)
const onScroll = () => (visible.value = window.scrollY > 700)
const toTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

onMounted(() => window.addEventListener('scroll', onScroll, { passive: true }))
onUnmounted(() => window.removeEventListener('scroll', onScroll))
</script>

<template>
  <transition name="fade">
    <button v-if="visible" class="totop" aria-label="Volver arriba" @click="toTop">
      ↑
    </button>
  </transition>
</template>

<style scoped>
.totop {
  position: fixed;
  right: 22px;
  bottom: 22px;
  z-index: 90;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  border: none;
  background: #915530;
  color: #fff;
  font-size: 1.4rem;
  cursor: pointer;
  box-shadow: 0 10px 26px rgba(74, 39, 17, 0.45);
  transition: background 0.2s ease, transform 0.2s ease;
}
.totop:hover {
  background: #4a2711;
  transform: translateY(-3px);
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>
