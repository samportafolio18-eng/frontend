<script setup lang="ts">
import SiteHeader from './components/SiteHeader.vue'
import BackToTop from './components/BackToTop.vue'
import SocialLinks from './components/SocialLinks.vue'
</script>

<template>
  <SiteHeader />

  <RouterView v-slot="{ Component }">
    <transition name="page" mode="out-in">
      <component :is="Component" />
    </transition>
  </RouterView>

  <footer class="footer">
    <span class="footer__brand">❦ Samanta Meza</span>
    <SocialLinks :size="40" />
    <span class="footer__copy">© {{ new Date().getFullYear() }} · Portafolio de arte</span>
  </footer>

  <BackToTop />
</template>

<style scoped>
.footer {
  background: #2e1d11;
  color: rgba(242, 231, 218, 0.6);
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 18px;
  padding: 28px 32px;
  font-size: 0.85rem;
}
.footer__brand {
  color: #f4ecdd;
  font-weight: 700;
}
@media (max-width: 640px) {
  .footer {
    justify-content: center;
    text-align: center;
    gap: 14px;
  }
}
.page-enter-active,
.page-leave-active {
  transition: opacity 0.25s ease;
}
.page-enter-from,
.page-leave-to {
  opacity: 0;
}
</style>
