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
    <header class="phead" :class="`phead--${kind}`">
      <div class="phead__bg" :style="{ backgroundImage: `url(/decor/${kind}-head.jpg)` }"></div>
      <div class="phead__veil"></div>
      <div class="phead__inner">
        <RouterLink to="/" class="phead__back">← Inicio</RouterLink>
        <span class="phead__kicker">Portafolio</span>
        <h1 class="phead__title">{{ meta.label }}</h1>
        <p class="phead__lead">
          Colecciones por tema. Toca cualquier imagen para verla en grande.
        </p>
      </div>
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
  position: relative;
  min-height: 52vh;
  display: flex;
  align-items: flex-end;
  padding: 130px 32px 48px;
  color: #f4ecdd;
  overflow: hidden;
  background: #2e1d11;
}
.phead__bg {
  position: absolute;
  inset: 0;
  background-size: cover;
  background-position: center;
  z-index: 0;
}
.phead__veil {
  position: absolute;
  inset: 0;
  z-index: 1;
}
.phead__inner {
  position: relative;
  z-index: 2;
  max-width: 1180px;
  margin: 0 auto;
  width: 100%;
}
.phead__back {
  display: inline-block;
  color: rgba(244, 236, 221, 0.8);
  text-decoration: none;
  font-weight: 600;
  margin-bottom: 16px;
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
  font-size: clamp(2.6rem, 7vw, 4.4rem);
  margin: 8px 0 14px;
  font-weight: 800;
  text-shadow: 0 2px 20px rgba(0, 0, 0, 0.4);
}
.phead__lead {
  max-width: 520px;
  margin: 0;
  color: rgba(244, 236, 221, 0.82);
  line-height: 1.6;
}

/* ===== PINTURA: lienzo enmarcado en diagonal a la derecha ===== */
.phead--pintura .phead__bg {
  left: auto;
  right: 0;
  width: 48%;
  clip-path: polygon(16% 0, 100% 0, 100% 100%, 0 100%);
  border-left: 12px solid #fbf7ef;
}
.phead--pintura .phead__veil {
  background: linear-gradient(90deg, #2e1d11 42%, rgba(46, 29, 17, 0.45) 64%, transparent 88%);
}

/* ===== FOTOGRAFÍA: tira de película (perforaciones arriba/abajo) ===== */
.phead--fotografia .phead__bg {
  filter: grayscale(0.35) contrast(1.05);
}
.phead--fotografia .phead__veil {
  background: linear-gradient(90deg, rgba(15, 9, 4, 0.9) 30%, rgba(15, 9, 4, 0.35) 70%, rgba(15, 9, 4, 0.25));
}
.phead--fotografia::before,
.phead--fotografia::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  height: 26px;
  z-index: 3;
  background-color: #15100a;
  background-image: repeating-linear-gradient(90deg, transparent 0 12px, #cdbfa6 12px 24px, transparent 24px 40px);
}
.phead--fotografia::before { top: 0; }
.phead--fotografia::after { bottom: 0; }

/* ===== ESCULTURA: foco / spotlight con viñeta, pieza a la derecha ===== */
.phead--escultura {
  background: #1a120a;
}
.phead--escultura .phead__bg {
  left: auto;
  right: 0;
  width: 52%;
}
.phead--escultura .phead__veil {
  background:
    radial-gradient(80% 70% at 76% 38%, rgba(255, 240, 210, 0.14), transparent 60%),
    linear-gradient(90deg, #1a120a 38%, rgba(26, 18, 10, 0.5) 60%, transparent 86%),
    radial-gradient(120% 120% at 78% 50%, transparent 55%, rgba(8, 5, 2, 0.8));
}

/* ===== CERÁMICA: hornacina con arco a la derecha ===== */
.phead--ceramica {
  background: linear-gradient(180deg, #5a3a22, #2e1d11);
}
.phead--ceramica .phead__bg {
  left: auto;
  right: 7%;
  width: 38%;
  top: auto;
  bottom: 0;
  height: 84%;
  border: 9px solid #f7efe2;
  border-bottom: none;
  border-radius: 240px 240px 0 0;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.4);
}
.phead--ceramica .phead__veil {
  background: linear-gradient(90deg, #3a2416 46%, rgba(58, 36, 22, 0.4) 66%, transparent);
}

/* ===== Móvil: foto a sangre completa con velo oscuro (legible) ===== */
@media (max-width: 760px) {
  .phead {
    min-height: 40vh;
    padding: 110px 18px 34px;
  }
  .phead--pintura .phead__bg,
  .phead--escultura .phead__bg,
  .phead--ceramica .phead__bg {
    inset: 0;
    width: 100%;
    height: 100%;
    right: auto;
    left: 0;
    clip-path: none;
    border: none;
    border-radius: 0;
    box-shadow: none;
  }
  .phead--pintura .phead__veil,
  .phead--escultura .phead__veil,
  .phead--ceramica .phead__veil,
  .phead--fotografia .phead__veil {
    background: linear-gradient(180deg, rgba(20, 12, 6, 0.45), rgba(20, 12, 6, 0.82));
  }
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
