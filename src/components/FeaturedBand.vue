<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { featuredOfKind, KIND_META, type CollectionKind } from '../data/categories'

const props = defineProps<{
  kind: CollectionKind
  /** id de ancla (el primero de la página usa 'destacados' para el CTA del hero). */
  anchor?: string
  /** Alterna a fondo claro para dar ritmo cuando hay varias bandas seguidas. */
  alt?: boolean
}>()

const featured = computed(() => featuredOfKind(props.kind))
const meta = computed(() => KIND_META[props.kind])

// Obra temática de fondo, difuminada (rellena el espacio vacío de cada banda).
// Imágenes de dominio público en /public/decor/<kind>.jpg.
const artSrc = computed(() => `/decor/${props.kind}.jpg`)
</script>

<template>
  <section
    v-if="featured.length"
    :id="anchor"
    class="feat"
    :class="[{ 'feat--alt': alt }, `feat--${kind}`]"
  >
    <!-- Obra temática de fondo, difuminada hacia el fondo de la banda -->
    <img
      class="feat__art"
      :class="{ 'feat__art--left': alt }"
      :src="artSrc"
      alt=""
      aria-hidden="true"
      loading="lazy"
    />

    <div v-reveal class="feat__head">
      <div>
        <span class="feat__kicker">Lo mejor de la galería</span>
        <h2 class="feat__title">
          {{ meta.plural }} <span class="feat__script">destacadas</span>
        </h2>
      </div>
      <RouterLink :to="meta.path" class="feat__hint">ver todo →</RouterLink>
    </div>

    <div class="feat__layout" :class="`feat__layout--${kind}`">
      <RouterLink
        v-for="(f, i) in featured"
        :key="f.slug + f.title"
        :to="`/coleccion/${f.slug}`"
        class="piece"
        :style="{ '--i': i, '--c': f.color }"
      >
        <div class="piece__media">
          <img :src="f.image" :alt="f.title" loading="lazy" />
          <span class="piece__hovertitle">{{ f.title }}</span>
        </div>
        <div class="piece__meta">
          <span class="feat__name">{{ f.title }}</span>
          <span class="feat__cat">{{ f.category }}</span>
        </div>
      </RouterLink>

    </div>
  </section>
</template>

<style scoped>
.feat {
  background: radial-gradient(circle at 20% 0%, #5a3a22, #2e1d11 70%);
  color: #f4ecdd;
  padding: 80px 0 88px;
  position: relative;
  overflow: hidden;
}
/* Banda en tono claro (alterna para dar ritmo entre disciplinas) */
.feat--alt {
  background: #f1daae;
  color: #3a2a18;
}

/* ---- Encabezado ---- */
.feat__head {
  max-width: 1180px;
  margin: 0 auto 26px;
  padding: 0 32px;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 16px;
  position: relative;
  z-index: 1;
}
.feat__kicker {
  text-transform: uppercase;
  letter-spacing: 0.28em;
  font-size: 0.72rem;
  color: #d99a4e;
  font-weight: 700;
}
.feat__title {
  font-size: clamp(1.8rem, 4vw, 2.8rem);
  margin: 8px 0 0;
  font-weight: 800;
}
.feat--alt .feat__title {
  color: #2e2113;
}
.feat__script {
  font-family: 'Brush Script MT', 'Segoe Script', cursive;
  font-weight: 400;
  color: #d99a4e;
}
.feat--alt .feat__script {
  color: #915530;
}
.feat__hint {
  color: rgba(244, 236, 221, 0.6);
  font-size: 0.85rem;
  white-space: nowrap;
  text-decoration: none;
  font-weight: 600;
  transition: color 0.2s ease;
}
.feat__hint:hover {
  color: #d99a4e;
}
.feat--alt .feat__hint {
  color: rgba(58, 42, 24, 0.65);
}
.feat--alt .feat__hint:hover {
  color: #915530;
}

/* ---- Contenedor de obras (cada disciplina lo redefine) ---- */
.feat__layout {
  max-width: 1180px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
}
.piece {
  flex: 0 0 auto;
  text-decoration: none;
  color: inherit;
}
.piece__media {
  position: relative;
  overflow: hidden;
  transition: transform 0.28s ease, box-shadow 0.28s ease;
}
.piece__media img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.4s ease;
}
.piece:hover .piece__media img {
  transform: scale(1.06);
}

/* Título que aparece al pasar el cursor (solo donde no hay leyenda fija) */
.piece__hovertitle {
  display: none;
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 20px 8px 7px;
  font-size: 0.72rem;
  font-weight: 700;
  color: #fff;
  background: linear-gradient(transparent, rgba(15, 9, 4, 0.85));
  opacity: 0;
  transition: opacity 0.2s ease;
  pointer-events: none;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Leyenda fija (nombre + colección): solo escultura y cerámica */
.piece__meta {
  display: none;
  flex-direction: column;
  padding: 10px 2px 0;
}
.feat__name {
  font-weight: 700;
  font-size: 0.95rem;
}
.feat__cat {
  color: rgba(244, 236, 221, 0.6);
  font-size: 0.82rem;
  margin-top: 2px;
}
.feat--alt .feat__cat {
  color: rgba(58, 42, 24, 0.6);
}

/* Scroll horizontal para las disposiciones en fila */
.feat__layout--pintura,
.feat__layout--fotografia,
.feat__layout--ceramica {
  display: flex;
  justify-content: safe center;
  overflow-x: auto;
  scrollbar-width: thin;
  scrollbar-color: #915530 transparent;
}
.feat__layout--pintura::-webkit-scrollbar,
.feat__layout--fotografia::-webkit-scrollbar,
.feat__layout--ceramica::-webkit-scrollbar {
  height: 8px;
}
.feat__layout--pintura::-webkit-scrollbar-thumb,
.feat__layout--fotografia::-webkit-scrollbar-thumb,
.feat__layout--ceramica::-webkit-scrollbar-thumb {
  background: #915530;
  border-radius: 999px;
}

/* ============================================================
   PINTURA — tira de lienzos verticales (marco blanco fino)
   ============================================================ */
.feat__layout--pintura {
  align-items: center;
  gap: 24px;
  padding: 32px 32px 36px;
}
.feat--pintura .piece__media {
  width: clamp(140px, 16vw, 194px);
  aspect-ratio: 4 / 5;
  /* Marco de galería: borde crema grueso + filo dorado interior */
  border: 13px solid #fbf7ef;
  border-radius: 2px;
  box-shadow:
    inset 0 0 0 2px #c79a4a,
    0 20px 40px rgba(0, 0, 0, 0.42);
}
/* Colgados a alturas distintas, como una pared de exposición */
.feat--pintura .piece:nth-child(even) {
  transform: translateY(-14px);
}
.feat--pintura .piece:nth-child(3n) {
  transform: translateY(10px);
}
.feat--pintura .piece__hovertitle {
  display: block;
}
.feat--pintura .piece:hover .piece__media {
  transform: translateY(-8px);
}
.feat--pintura .piece:hover .piece__hovertitle {
  opacity: 1;
}

/* ============================================================
   FOTOGRAFÍA — polaroids inclinadas y superpuestas
   ============================================================ */
.feat__layout--fotografia {
  align-items: center;
  padding: 34px 40px 40px;
}
.feat--fotografia .piece {
  margin-left: -20px;
}
.feat--fotografia .piece:first-child {
  margin-left: 0;
}
.feat--fotografia .piece__media {
  width: clamp(140px, 19vw, 196px);
  aspect-ratio: 1 / 1;
  background: #fff;
  border: 7px solid #fff;
  border-bottom-width: 30px;
  border-radius: 2px;
  box-shadow: 0 14px 26px rgba(0, 0, 0, 0.32);
}
.feat--fotografia .piece:nth-child(odd) .piece__media {
  transform: rotate(-5deg);
}
.feat--fotografia .piece:nth-child(even) .piece__media {
  transform: rotate(4deg);
}
.feat--fotografia .piece:nth-child(3n) .piece__media {
  transform: rotate(-2deg);
}
.feat--fotografia .piece__hovertitle {
  display: block;
}
.feat--fotografia .piece:hover {
  z-index: 3;
}
.feat--fotografia .piece:hover .piece__media {
  transform: rotate(0deg) scale(1.04);
  box-shadow: 0 22px 40px rgba(0, 0, 0, 0.45);
}
.feat--fotografia .piece:hover .piece__hovertitle {
  opacity: 1;
}

/* ============================================================
   ESCULTURA — collage en pedestal (tamaños variados + acentos)
   ============================================================ */
.feat__layout--escultura {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: flex-end;
  gap: 30px 32px;
  padding: 28px 44px 32px;
}
.feat--escultura .piece__media {
  width: clamp(120px, 15vw, 158px);
  aspect-ratio: 4 / 5;
  border-radius: 3px;
  border-bottom: 4px solid var(--c);
  box-shadow: 0 24px 40px -16px rgba(0, 0, 0, 0.55);
}
.feat--escultura .piece:nth-child(3n) .piece__media {
  width: clamp(94px, 12vw, 124px);
}
.feat--escultura .piece:nth-child(4n) .piece__media {
  width: clamp(150px, 18vw, 188px);
}
.feat--escultura .piece:nth-child(odd) {
  transform: translateY(-16px);
}
.feat--escultura .piece:nth-child(3n) {
  transform: translateY(12px);
}
.feat--escultura .piece__meta {
  display: flex;
}
.feat--escultura .piece:hover .piece__media {
  transform: translateY(-6px);
}

/* ============================================================
   Obra temática de fondo, difuminada hacia el fondo de la banda
   ============================================================ */
.feat__art {
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  width: 48%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  pointer-events: none;
  user-select: none;
  z-index: 0;
  opacity: 0.42;
  /* Se desvanece hacia el centro (donde están las obras) y por arriba/abajo */
  -webkit-mask-image: linear-gradient(to left, #000 0%, #000 22%, transparent 90%),
    linear-gradient(to bottom, transparent 0%, #000 16%, #000 84%, transparent 100%);
  -webkit-mask-composite: source-in;
  mask-image: linear-gradient(to left, #000 0%, #000 22%, transparent 90%),
    linear-gradient(to bottom, transparent 0%, #000 16%, #000 84%, transparent 100%);
  mask-composite: intersect;
}
.feat__art--left {
  right: auto;
  left: 0;
  -webkit-mask-image: linear-gradient(to right, #000 0%, #000 22%, transparent 90%),
    linear-gradient(to bottom, transparent 0%, #000 16%, #000 84%, transparent 100%);
  mask-image: linear-gradient(to right, #000 0%, #000 22%, transparent 90%),
    linear-gradient(to bottom, transparent 0%, #000 16%, #000 84%, transparent 100%);
}
/* En bandas claras, la obra se integra mejor multiplicando y algo más tenue */
.feat--alt .feat__art {
  opacity: 0.3;
  mix-blend-mode: multiply;
}

/* ============================================================
   CERÁMICA — hornacinas con arco (vasijas) sobre una repisa
   ============================================================ */
.feat__layout--ceramica {
  align-items: flex-end;
  gap: 22px;
  padding: 26px 32px 36px;
}
.feat__layout--ceramica::after {
  content: '';
  position: absolute;
  left: 32px;
  right: 32px;
  bottom: 28px;
  height: 2px;
  background: rgba(244, 236, 221, 0.25);
}
.feat--alt .feat__layout--ceramica::after {
  background: rgba(74, 39, 17, 0.2);
}
.feat--ceramica .piece__media {
  width: clamp(120px, 16vw, 172px);
  aspect-ratio: 4 / 5;
  border: 5px solid #f7efe2;
  border-radius: 110px 110px 12px 12px;
  box-shadow: 0 16px 32px rgba(74, 39, 17, 0.3);
}
.feat--ceramica .piece__meta {
  display: flex;
  text-align: center;
  align-items: center;
}
.feat--ceramica .piece:hover .piece__media {
  transform: translateY(-6px);
}

/* ---- Móvil ---- */
@media (max-width: 640px) {
  .feat {
    padding: 60px 0 64px;
  }
  .feat__head {
    padding: 0 18px;
    margin-bottom: 18px;
  }
  .feat__layout--pintura,
  .feat__layout--fotografia,
  .feat__layout--ceramica {
    padding-left: 18px;
    padding-right: 18px;
  }
  .feat__layout--escultura {
    padding: 24px 18px 28px;
    gap: 20px 18px;
  }
  .feat--fotografia .piece__media {
    border-bottom-width: 22px;
  }
  .feat--ceramica .piece__media {
    border-radius: 80px 80px 10px 10px;
  }
  .feat__layout--ceramica::after {
    left: 18px;
    right: 18px;
    bottom: 30px;
  }
  /* En móvil la obra de fondo va más tenue para no competir con las obras. */
  .feat__art {
    width: 70%;
    opacity: 0.2;
  }
}
</style>
