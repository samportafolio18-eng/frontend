<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import type { CategoryDef } from '../data/categories'
import type { DisplayItem } from '../lib/display'
export type { DisplayItem }

const props = defineProps<{
  category: CategoryDef
  items: DisplayItem[]
  /** Si se pasa, muestra un botón "Ver colección" hacia esa ruta */
  to?: string
  /** Limita cuántas obras se muestran (para vistas previas del Home) */
  limit?: number
}>()
defineEmits<{ (e: 'open', item: DisplayItem): void }>()

const shown = computed(() =>
  props.limit ? props.items.slice(0, props.limit) : props.items,
)
const hasMore = computed(
  () => !!props.to && props.items.length > shown.value.length,
)
</script>

<template>
  <section
    :id="category.slug"
    class="cat"
    :class="`cat--${category.theme}`"
    :style="{
      '--bg': category.color,
      '--accent': category.accent,
      '--text': category.text,
      '--muted': category.muted,
    }"
  >
    <span class="cat__vlabel" aria-hidden="true">{{ category.name }}</span>

    <div v-reveal class="cat__head">
      <span class="cat__tagline">{{ category.tagline }}</span>
      <h2 class="cat__title">{{ category.name }}</h2>
      <p class="cat__desc">{{ category.description }}</p>
      <span class="cat__rule"></span>
    </div>

    <div v-reveal class="cat__grid">
      <figure
        v-for="(item, i) in shown"
        :key="i"
        class="art"
        :class="`art--${category.kind}`"
        @click="$emit('open', item)"
      >
        <div class="art__media">
          <img :src="item.image" :alt="item.title" loading="lazy" />
          <span v-if="item.badge" class="art__badge">{{ item.badge }}</span>
        </div>
        <figcaption class="art__cap">
          <span class="art__title">{{ item.title }}</span>
          <span v-if="item.subtitle" class="art__sub">{{ item.subtitle }}</span>
        </figcaption>
      </figure>
    </div>

    <div v-if="to" class="cat__more">
      <RouterLink :to="to" class="cat__more-btn">
        {{ hasMore ? `Ver colección completa (${items.length})` : 'Ver colección' }} →
      </RouterLink>
    </div>
  </section>
</template>

<style scoped>
.cat {
  background: var(--bg);
  color: var(--text);
  padding: 84px 32px;
  position: relative;
  overflow: hidden;
}

/* Etiqueta vertical gigante (estilo Colorf) */
.cat__vlabel {
  position: absolute;
  left: -6px;
  top: 50%;
  transform: translateY(-50%);
  writing-mode: vertical-rl;
  text-orientation: mixed;
  font-size: clamp(3rem, 9vw, 7rem);
  font-weight: 800;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: var(--accent);
  opacity: 0.12;
  pointer-events: none;
  user-select: none;
  line-height: 1;
}
.cat__head {
  max-width: 720px;
  margin: 0 auto 44px;
  text-align: center;
}
.cat__tagline {
  text-transform: uppercase;
  letter-spacing: 0.28em;
  font-size: 0.72rem;
  color: var(--accent);
  font-weight: 700;
}
.cat__title {
  font-size: clamp(2rem, 4.5vw, 3rem);
  margin: 10px 0 14px;
  font-weight: 800;
  letter-spacing: -0.01em;
}
.cat__desc {
  color: var(--muted);
  font-size: 1.02rem;
  line-height: 1.6;
  margin: 0 auto;
  max-width: 540px;
}
.cat__rule {
  display: block;
  width: 64px;
  height: 3px;
  background: var(--accent);
  border-radius: 2px;
  margin: 22px auto 0;
}
.cat__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(230px, 1fr));
  gap: 26px;
  max-width: 1180px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
}
.art {
  margin: 0;
  cursor: pointer;
  transition: transform 0.25s ease;
}
.art:hover {
  transform: translateY(-6px);
}
.art__media {
  position: relative;
  aspect-ratio: 4 / 5;
  border-radius: 3px;
  overflow: hidden;
  /* PINTURA (base): marco blanco grueso tipo galería */
  border: 9px solid #fff;
  box-shadow: 0 18px 38px rgba(0, 0, 0, 0.32);
}

/* FOTOGRAFÍA: estilo polaroid (borde blanco con base ancha) */
.art--fotografia .art__media {
  border: 7px solid #fff;
  border-bottom-width: 30px;
  border-radius: 2px;
  box-shadow: 0 14px 30px rgba(0, 0, 0, 0.28);
}

/* ESCULTURA: sin marco, sobre un "pedestal" — corte limpio, sombra dramática
   y una repisa de acento bajo la pieza */
.art--escultura .art__media {
  border: none;
  border-bottom: 5px solid var(--accent);
  border-radius: 2px 2px 0 0;
  box-shadow: 0 26px 42px -18px rgba(0, 0, 0, 0.55);
}

/* CERÁMICA: nicho arqueado (evoca una vasija) con borde cálido suave */
.art--ceramica .art__media {
  border: 6px solid #f7efe2;
  border-radius: 120px 120px 14px 14px;
  box-shadow: 0 16px 34px rgba(74, 39, 17, 0.26);
}
.art__media img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.4s ease;
}
.art:hover .art__media img {
  transform: scale(1.06);
}
.art__badge {
  position: absolute;
  top: 10px;
  right: 10px;
  background: var(--accent);
  color: var(--bg);
  font-size: 0.7rem;
  font-weight: 700;
  padding: 4px 10px;
  border-radius: 999px;
}
.art__cap {
  display: flex;
  flex-direction: column;
  padding: 12px 4px 0;
}
.art__title {
  font-weight: 700;
  font-size: 1rem;
}
.art__sub {
  color: var(--muted);
  font-size: 0.85rem;
  margin-top: 2px;
}

.cat__more {
  text-align: center;
  margin-top: 36px;
  position: relative;
  z-index: 1;
}
.cat__more-btn {
  display: inline-block;
  text-decoration: none;
  color: var(--bg);
  background: var(--accent);
  padding: 11px 26px;
  border-radius: 999px;
  font-weight: 700;
  font-size: 0.9rem;
  transition: transform 0.2s ease, opacity 0.2s ease;
}
.cat__more-btn:hover {
  transform: translateY(-2px);
  opacity: 0.92;
}

@media (max-width: 640px) {
  .cat {
    padding: 56px 18px;
  }
  /* La etiqueta vertical gigante estorba en pantallas chicas */
  .cat__vlabel {
    display: none;
  }
  .cat__head {
    margin-bottom: 32px;
  }
  .cat__grid {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 16px;
  }
  .art__media {
    border-width: 6px;
  }
  .art--fotografia .art__media {
    border-width: 5px;
    border-bottom-width: 22px;
  }
  .art--ceramica .art__media {
    border-radius: 90px 90px 10px 10px;
  }
}
</style>
