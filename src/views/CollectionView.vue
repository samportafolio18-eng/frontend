<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { allCollections, getCollection, KIND_META } from '../data/categories'
import { useGallery } from '../composables/useGallery'
import { useLightbox } from '../composables/useLightbox'
import CategorySection from '../components/CategorySection.vue'
import LightboxViewer from '../components/LightboxViewer.vue'

const props = defineProps<{ slug: string }>()

const { itemsFor } = useGallery()
const collection = computed(() => getCollection(props.slug))
const items = computed(() =>
  collection.value ? itemsFor(collection.value) : [],
)
const { selected, open, close, go } = useLightbox(items)

// Otras colecciones del mismo tipo, para seguir explorando.
const siblings = computed(() =>
  collection.value
    ? allCollections().filter(
        (c) => c.kind === collection.value!.kind && c.slug !== collection.value!.slug,
      )
    : [],
)
const backTo = computed(() =>
  collection.value ? KIND_META[collection.value.kind].path : '/',
)
const backLabel = computed(() =>
  collection.value ? KIND_META[collection.value.kind].label : 'Inicio',
)
</script>

<template>
  <div>
    <main v-if="collection && items.length" class="detail">
    <div class="detail__bar">
      <RouterLink :to="backTo" class="detail__back">← {{ backLabel }}</RouterLink>
      <span class="detail__kind">{{ KIND_META[collection.kind].label }}</span>
    </div>

    <CategorySection :category="collection" :items="items" @open="open" />

    <nav v-if="siblings.length" class="detail__others">
      <span class="detail__others-label">Otras colecciones</span>
      <div class="detail__others-list">
        <RouterLink
          v-for="s in siblings"
          :key="s.slug"
          :to="`/coleccion/${s.slug}`"
          class="detail__chip"
          :style="{ '--c': s.color }"
        >
          {{ s.name }}
        </RouterLink>
      </div>
    </nav>
  </main>

  <main v-else class="detail detail--missing">
    <p>Esa colección no existe.</p>
    <RouterLink to="/" class="detail__back">← Volver al inicio</RouterLink>
  </main>

    <LightboxViewer :item="selected" @close="close" @prev="go(-1)" @next="go(1)" />
  </div>
</template>

<style scoped>
.detail__bar {
  background: #2e1d11;
  color: #f4ecdd;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 92px 32px 22px;
}
.detail__back {
  color: #f4ecdd;
  text-decoration: none;
  font-weight: 600;
}
.detail__back:hover {
  color: #d99a4e;
}
.detail__kind {
  text-transform: uppercase;
  letter-spacing: 0.22em;
  font-size: 0.72rem;
  color: #d99a4e;
}
.detail__others {
  background: #2e1d11;
  color: #f4ecdd;
  text-align: center;
  padding: 50px 24px 70px;
}
.detail__others-label {
  display: block;
  text-transform: uppercase;
  letter-spacing: 0.22em;
  font-size: 0.72rem;
  color: rgba(244, 236, 221, 0.5);
  margin-bottom: 16px;
}
.detail__others-list {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  justify-content: center;
}
.detail__chip {
  text-decoration: none;
  color: #f4ecdd;
  border: 1px solid var(--c);
  border-left: 6px solid var(--c);
  padding: 8px 18px;
  border-radius: 8px;
  font-weight: 600;
  transition: background 0.2s ease;
}
.detail__chip:hover {
  background: rgba(255, 255, 255, 0.06);
}
.detail--missing {
  min-height: 60vh;
  display: grid;
  place-content: center;
  gap: 14px;
  text-align: center;
  color: #f4ecdd;
  background: #2e1d11;
  padding-top: 92px;
}
@media (max-width: 640px) {
  .detail__bar {
    padding: 84px 18px 18px;
  }
}
</style>
