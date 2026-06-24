<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import {
  KIND_META,
  collectionsOfKind,
  type CollectionKind,
} from '../data/categories'
import { useGallery } from '../composables/useGallery'
import { useLightbox } from '../composables/useLightbox'
import CategorySection from '../components/CategorySection.vue'
import LightboxViewer from '../components/LightboxViewer.vue'

const props = defineProps<{ kind: CollectionKind }>()

const { itemsFor } = useGallery()
const meta = computed(() => KIND_META[props.kind])
const sections = computed(() =>
  collectionsOfKind(props.kind).map((cat) => ({ cat, items: itemsFor(cat) })),
)
const allItems = computed(() => sections.value.flatMap((s) => s.items))
const { selected, open, close, go } = useLightbox(allItems)
</script>

<template>
  <main>
    <header class="phead">
      <RouterLink to="/" class="phead__back">← Inicio</RouterLink>
      <span class="phead__kicker">Portafolio</span>
      <h1 class="phead__title">{{ meta.label }}</h1>
      <p class="phead__lead">
        Colecciones por tema. Toca cualquier imagen para verla en grande.
      </p>
    </header>

    <template v-if="sections.length">
      <CategorySection
        v-for="s in sections"
        :key="s.cat.slug"
        :category="s.cat"
        :items="s.items"
        :limit="4"
        :to="`/coleccion/${s.cat.slug}`"
        @open="open"
      />
    </template>

    <section v-else class="empty">
      <p>Esta sección estará disponible pronto.</p>
      <RouterLink to="/" class="empty__back">← Volver al inicio</RouterLink>
    </section>

    <LightboxViewer :item="selected" @close="close" @prev="go(-1)" @next="go(1)" />
  </main>
</template>

<style scoped>
.phead {
  background: radial-gradient(circle at 30% 0%, #5a3a22, #2e1d11 70%);
  color: #f4ecdd;
  text-align: center;
  padding: 120px 24px 70px;
}
.phead__back {
  display: inline-block;
  color: rgba(244, 236, 221, 0.7);
  text-decoration: none;
  font-weight: 600;
  margin-bottom: 18px;
}
.phead__back:hover {
  color: #d99a4e;
}
.phead__kicker {
  display: block;
  text-transform: uppercase;
  letter-spacing: 0.28em;
  font-size: 0.72rem;
  color: #d99a4e;
  font-weight: 700;
}
.phead__title {
  font-size: clamp(2.4rem, 6vw, 4rem);
  margin: 8px 0 14px;
  font-weight: 800;
}
.phead__lead {
  max-width: 520px;
  margin: 0 auto;
  color: rgba(244, 236, 221, 0.72);
  line-height: 1.6;
}
.empty {
  background: #2e1d11;
  color: #f4ecdd;
  text-align: center;
  padding: 70px 24px 90px;
  display: grid;
  gap: 14px;
}
.empty__back {
  color: #d99a4e;
  text-decoration: none;
  font-weight: 600;
}
</style>
