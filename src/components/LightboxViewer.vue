<script setup lang="ts">
import { RouterLink } from 'vue-router'
import type { DisplayItem } from '../lib/display'

defineProps<{ item: DisplayItem | null }>()
defineEmits<{ (e: 'close'): void; (e: 'prev'): void; (e: 'next'): void }>()
</script>

<template>
  <transition name="lb-fade">
    <div v-if="item" class="lb" @click.self="$emit('close')">
      <button class="lb__close" @click="$emit('close')" aria-label="Cerrar">×</button>
      <button class="lb__nav lb__nav--prev" @click.stop="$emit('prev')" aria-label="Anterior">‹</button>
      <button class="lb__nav lb__nav--next" @click.stop="$emit('next')" aria-label="Siguiente">›</button>

      <div class="card" @click.stop>
        <div class="card__media">
          <img :src="item.image" :alt="item.title" />
          <span v-if="item.badge" class="card__badge">{{ item.badge }}</span>
        </div>

        <div class="card__info">
          <h2 class="card__title">{{ item.title }}</h2>
          <p v-if="item.subtitle" class="card__subtitle">{{ item.subtitle }}</p>

          <p v-if="item.description" class="card__desc">{{ item.description }}</p>

          <dl v-if="item.meta && item.meta.length" class="card__meta">
            <div v-for="m in item.meta" :key="m.label" class="card__row">
              <dt>{{ m.label }}</dt>
              <dd>{{ m.value }}</dd>
            </div>
          </dl>

          <RouterLink
            :to="{ path: '/', hash: '#contacto' }"
            class="card__cta"
            @click="$emit('close')"
          >
            Consultar esta obra →
          </RouterLink>
        </div>
      </div>
    </div>
  </transition>
</template>

<style scoped>
.lb {
  position: fixed;
  inset: 0;
  z-index: 200;
  background: rgba(20, 12, 6, 0.92);
  display: grid;
  place-items: center;
  padding: 24px;
}
.card {
  display: grid;
  grid-template-columns: 1.3fr 1fr;
  width: 100%;
  max-width: 1000px;
  max-height: 86vh;
  background: #1c130c;
  border: 1px solid #3a2a1c;
  border-radius: 16px;
  overflow: hidden;
}
.card__media {
  position: relative;
  background: #0c0805;
  display: grid;
  place-items: center;
}
.card__media img {
  width: 100%;
  height: 100%;
  max-height: 86vh;
  object-fit: contain;
  display: block;
}
.card__badge {
  position: absolute;
  top: 12px;
  left: 12px;
  background: #d99a4e;
  color: #2e1d11;
  font-size: 0.72rem;
  font-weight: 700;
  padding: 4px 12px;
  border-radius: 999px;
}
.card__info {
  padding: 30px 28px;
  overflow-y: auto;
  color: #f4ecdd;
}
.card__title {
  margin: 0 0 4px;
  font-size: 1.6rem;
  font-weight: 800;
}
.card__subtitle {
  margin: 0 0 18px;
  color: #d99a4e;
  font-weight: 600;
}
.card__desc {
  margin: 0 0 22px;
  line-height: 1.65;
  color: rgba(244, 236, 221, 0.82);
}
.card__meta {
  margin: 0 0 24px;
  display: grid;
  gap: 0;
  border-top: 1px solid rgba(244, 236, 221, 0.12);
}
.card__row {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  padding: 11px 0;
  border-bottom: 1px solid rgba(244, 236, 221, 0.12);
}
.card__row dt {
  color: rgba(244, 236, 221, 0.55);
  font-size: 0.85rem;
}
.card__row dd {
  margin: 0;
  font-weight: 600;
  font-size: 0.9rem;
  text-align: right;
}
.card__cta {
  display: inline-block;
  background: #915530;
  color: #fff;
  text-decoration: none;
  padding: 12px 24px;
  border-radius: 999px;
  font-weight: 700;
  transition: background 0.2s ease, transform 0.2s ease;
}
.card__cta:hover {
  background: #a4632f;
  transform: translateY(-2px);
}

.lb__close {
  position: fixed;
  top: 18px;
  right: 24px;
  background: rgba(255, 255, 255, 0.14);
  color: #fff;
  border: none;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  font-size: 1.6rem;
  cursor: pointer;
  line-height: 1;
}
.lb__nav {
  position: fixed;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(255, 255, 255, 0.14);
  color: #fff;
  border: none;
  width: 52px;
  height: 52px;
  border-radius: 50%;
  font-size: 2rem;
  cursor: pointer;
  line-height: 1;
  transition: background 0.2s ease;
}
.lb__nav:hover {
  background: rgba(217, 154, 78, 0.55);
}
.lb__nav--prev {
  left: 18px;
}
.lb__nav--next {
  right: 18px;
}

.lb-fade-enter-active,
.lb-fade-leave-active {
  transition: opacity 0.2s ease;
}
.lb-fade-enter-from,
.lb-fade-leave-to {
  opacity: 0;
}

@media (max-width: 760px) {
  .lb {
    padding: 12px;
  }
  .card {
    grid-template-columns: 1fr;
    max-height: 90vh;
  }
  .card__media img {
    max-height: 44vh;
  }
  .card__info {
    padding: 22px 20px;
  }
  .lb__nav {
    width: 42px;
    height: 42px;
    font-size: 1.5rem;
  }
  .lb__nav--prev {
    left: 6px;
  }
  .lb__nav--next {
    right: 6px;
  }
  .lb__close {
    top: 10px;
    right: 12px;
  }
}
</style>
