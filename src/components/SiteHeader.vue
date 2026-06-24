<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { RouterLink, useRoute, type RouteLocationRaw } from 'vue-router'
import {
  collectionsOfKind,
  activeKinds,
  KIND_META,
  getCollection,
} from '../data/categories'

const route = useRoute()
const scrolled = ref(false)
const menuOpen = ref(false)

const onScroll = () => (scrolled.value = window.scrollY > 40)
const solid = computed(
  () => scrolled.value || menuOpen.value || route.name !== 'home',
)

interface NavItem {
  slug: string
  label: string
  color: string
  to: RouteLocationRaw
  active: boolean
}
interface NavGroup {
  key: string
  label: string
  to: RouteLocationRaw
  active: boolean
  items: NavItem[]
}

// Un desplegable por disciplina (con datos); cada uno con sus colecciones.
const navGroups = computed<NavGroup[]>(() => {
  const currentKind =
    route.name === 'collection'
      ? getCollection(String(route.params.slug))?.kind
      : null

  return activeKinds().map((k) => ({
    key: k,
    label: KIND_META[k].label,
    to: KIND_META[k].path,
    active: route.name === k || currentKind === k,
    items: collectionsOfKind(k).map((c) => ({
      slug: c.slug,
      label: c.name,
      color: c.color,
      to: `/coleccion/${c.slug}`,
      active: route.name === 'collection' && route.params.slug === c.slug,
    })),
  }))
})

onMounted(() => window.addEventListener('scroll', onScroll, { passive: true }))
onUnmounted(() => window.removeEventListener('scroll', onScroll))

const close = () => (menuOpen.value = false)
</script>

<template>
  <header :class="['nav', { 'nav--solid': solid }]">
    <RouterLink :to="{ path: '/', hash: '#top' }" class="nav__brand" @click="close">
      <span class="nav__mark">❦</span> Samanta Meza
    </RouterLink>

    <!-- Desplegables por disciplina (escritorio) -->
    <nav class="nav__links">
      <div v-for="g in navGroups" :key="g.key" class="nav__group">
        <RouterLink
          :to="g.to"
          class="nav__link nav__trigger"
          :class="{ 'nav__link--active': g.active }"
        >
          {{ g.label }} <span class="nav__chev">▾</span>
        </RouterLink>
        <div class="nav__dropdown">
          <RouterLink
            v-for="it in g.items"
            :key="it.slug"
            :to="it.to"
            class="nav__dd-link"
            :class="{ 'nav__dd-link--active': it.active }"
          >
            <span class="nav__swatch" :style="{ background: it.color }"></span>
            {{ it.label }}
          </RouterLink>
        </div>
      </div>
    </nav>

    <RouterLink :to="{ path: '/', hash: '#contacto' }" class="nav__cta">Contacto</RouterLink>

    <!-- Botón hamburguesa (móvil) -->
    <button
      class="nav__burger"
      :class="{ 'nav__burger--open': menuOpen }"
      :aria-expanded="menuOpen"
      aria-label="Abrir menú"
      @click="menuOpen = !menuOpen"
    >
      <span></span><span></span><span></span>
    </button>

    <!-- Menú desplegable (móvil) -->
    <transition name="drop">
      <nav v-if="menuOpen" class="nav__mobile">
        <template v-for="g in navGroups" :key="g.key">
          <RouterLink :to="g.to" class="nav__mobile-head" @click="close">
            {{ g.label }}
          </RouterLink>
          <RouterLink
            v-for="it in g.items"
            :key="it.slug"
            :to="it.to"
            class="nav__mobile-link"
            @click="close"
          >
            <span class="nav__swatch" :style="{ background: it.color }"></span>
            {{ it.label }}
          </RouterLink>
        </template>
        <RouterLink
          :to="{ path: '/', hash: '#contacto' }"
          class="nav__mobile-link nav__mobile-link--cta"
          @click="close"
        >
          Contacto
        </RouterLink>
      </nav>
    </transition>
  </header>
</template>

<style scoped>
.nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  padding: 18px 32px;
  transition: background 0.3s ease, box-shadow 0.3s ease, padding 0.3s ease;
}
.nav--solid {
  background: rgba(72, 47, 29, 0.96);
  backdrop-filter: blur(10px);
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.25);
  padding: 12px 32px;
}
.nav__brand {
  font-size: 1.3rem;
  font-weight: 700;
  letter-spacing: 0.02em;
  color: #fff;
  text-decoration: none;
  white-space: nowrap;
}
.nav__mark {
  color: #d99a4e;
}
.nav__links {
  display: flex;
  gap: 26px;
  align-items: center;
}
.nav__link {
  color: rgba(255, 255, 255, 0.82);
  text-decoration: none;
  font-size: 0.95rem;
  position: relative;
  transition: color 0.2s ease;
}
.nav__link::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: -4px;
  width: 0;
  height: 2px;
  background: #d99a4e;
  transition: width 0.25s ease;
}
.nav__group:hover .nav__link::after,
.nav__link--active::after {
  width: 100%;
}
.nav__link:hover,
.nav__link--active {
  color: #fff;
}

/* ---- Desplegables ---- */
.nav__group {
  position: relative;
}
.nav__trigger {
  display: inline-flex;
  align-items: center;
  gap: 5px;
}
.nav__chev {
  font-size: 0.7em;
  transition: transform 0.2s ease;
}
.nav__group:hover .nav__chev {
  transform: rotate(180deg);
}
.nav__dropdown {
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  margin-top: 12px;
  background: rgba(46, 29, 17, 0.98);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(244, 236, 221, 0.12);
  border-radius: 12px;
  padding: 8px;
  display: grid;
  gap: 2px;
  min-width: 190px;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.2s ease, margin-top 0.2s ease;
  box-shadow: 0 16px 34px rgba(0, 0, 0, 0.4);
}
.nav__dropdown::before {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  top: -14px;
  height: 14px;
}
.nav__group:hover .nav__dropdown {
  opacity: 1;
  visibility: visible;
  margin-top: 8px;
}
.nav__dd-link {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 9px 12px;
  border-radius: 8px;
  color: rgba(255, 255, 255, 0.85);
  text-decoration: none;
  font-size: 0.9rem;
  white-space: nowrap;
  transition: background 0.2s ease, color 0.2s ease;
}
.nav__dd-link:hover {
  background: rgba(255, 255, 255, 0.08);
  color: #fff;
}
.nav__dd-link--active {
  color: #d99a4e;
}
.nav__swatch {
  width: 16px;
  height: 16px;
  border-radius: 5px;
  box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.2);
  flex: none;
}
.nav__cta {
  background: #915530;
  color: #fff;
  text-decoration: none;
  padding: 9px 20px;
  border-radius: 999px;
  font-size: 0.9rem;
  font-weight: 600;
  white-space: nowrap;
  transition: background 0.2s ease, transform 0.2s ease;
}
.nav__cta:hover {
  background: #a4632f;
  transform: translateY(-1px);
}

/* ---- Estado transparente (tope del home, sobre el hero crema) ----
   Sin fondo oscuro detrás, el texto claro no se distingue: usamos tonos oscuros. */
.nav:not(.nav--solid) .nav__brand {
  color: #2e2113;
}
.nav:not(.nav--solid) .nav__mark {
  color: #915530;
}
.nav:not(.nav--solid) .nav__link {
  color: rgba(46, 33, 19, 0.82);
}
.nav:not(.nav--solid) .nav__link:hover,
.nav:not(.nav--solid) .nav__link--active {
  color: #2e2113;
}
.nav:not(.nav--solid) .nav__link::after {
  background: #915530;
}
.nav:not(.nav--solid) .nav__burger {
  background: rgba(46, 33, 19, 0.08);
}
.nav:not(.nav--solid) .nav__burger span {
  background: #2e2113;
}

/* ---- Hamburguesa ---- */
.nav__burger {
  display: none;
  flex-direction: column;
  justify-content: center;
  gap: 5px;
  width: 42px;
  height: 42px;
  padding: 0 9px;
  background: rgba(255, 255, 255, 0.1);
  border: none;
  border-radius: 10px;
  cursor: pointer;
}
.nav__burger span {
  display: block;
  height: 2.5px;
  width: 100%;
  background: #fff;
  border-radius: 2px;
  transition: transform 0.25s ease, opacity 0.25s ease;
}
.nav__burger--open span:nth-child(1) {
  transform: translateY(7.5px) rotate(45deg);
}
.nav__burger--open span:nth-child(2) {
  opacity: 0;
}
.nav__burger--open span:nth-child(3) {
  transform: translateY(-7.5px) rotate(-45deg);
}

/* ---- Menú móvil ---- */
.nav__mobile {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: rgba(46, 29, 17, 0.99);
  backdrop-filter: blur(10px);
  display: flex;
  flex-direction: column;
  padding: 10px 16px 18px;
  box-shadow: 0 16px 30px rgba(0, 0, 0, 0.35);
  max-height: 78vh;
  overflow-y: auto;
}
.nav__mobile-head {
  text-transform: uppercase;
  letter-spacing: 0.18em;
  font-size: 0.74rem;
  color: #d99a4e;
  font-weight: 700;
  text-decoration: none;
  padding: 16px 8px 6px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.07);
}
.nav__mobile-link {
  display: flex;
  align-items: center;
  gap: 12px;
  color: #f4ecdd;
  text-decoration: none;
  padding: 12px 8px 12px 16px;
  font-size: 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}
.nav__mobile-link:active {
  background: rgba(255, 255, 255, 0.05);
}
.nav__mobile-link--cta {
  justify-content: center;
  margin-top: 14px;
  background: #915530;
  border-radius: 999px;
  border-bottom: none;
  font-weight: 700;
  padding: 14px;
}

.drop-enter-active,
.drop-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.drop-enter-from,
.drop-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

/* ---- Breakpoint móvil ---- */
@media (max-width: 940px) {
  .nav {
    padding: 12px 18px;
  }
  .nav--solid {
    padding: 10px 18px;
  }
  .nav__brand {
    font-size: 1.15rem;
  }
  .nav__links,
  .nav__cta {
    display: none;
  }
  .nav__burger {
    display: flex;
  }
}
</style>
