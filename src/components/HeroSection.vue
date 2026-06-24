<script setup lang="ts">
import { computed } from 'vue'
import { site } from '../store/site'
import {
  collectionsOfKind,
  activeKinds,
  KIND_META,
  type CollectionKind,
} from '../data/categories'

const home = computed(() => site.home)

interface Cover {
  image: string
  title: string
  label: string
  kind: CollectionKind
}

// Una obra representativa por disciplina con datos (pintura, fotografía, etc.).
const covers = computed<Cover[]>(() =>
  activeKinds()
    .map((k): Cover | null => {
      const c = collectionsOfKind(k)[0]
      return c && c.items[0]
        ? { image: c.items[0].image, title: c.items[0].title, label: KIND_META[k].label, kind: k }
        : null
    })
    .filter((c): c is Cover => c !== null),
)

const bigIndex = computed(() => Math.round((covers.value.length - 1) / 2))
const featured = computed(() => covers.value[bigIndex.value])

function fanStyle(i: number) {
  const center = (covers.value.length - 1) / 2
  const offset = i - center
  const big = i === bigIndex.value
  return {
    transform: `rotate(${offset * 6}deg) translateY(${Math.abs(offset) * 12 - (big ? 16 : 0)}px)`,
    zIndex: String(big ? 5 : 4 - Math.round(Math.abs(offset))),
  }
}
</script>

<template>
  <section id="top" class="hero">
    <div class="hero__intro">
      <h1 class="hero__title">
        {{ home.heroTitle }}
        <span class="hero__script">{{ home.heroScript }}</span>
      </h1>
      <p class="hero__lead">{{ home.heroLead }}</p>
      <a href="#destacados" class="hero__cta">{{ home.heroCta }} →</a>
    </div>

    <div v-if="covers.length" class="hero__stage">
      <p v-if="featured" class="hero__featured-name">{{ featured.title }}</p>
      <p v-if="featured" class="hero__featured-artist">{{ featured.label }}</p>
      <div class="fan">
        <figure
          v-for="(c, i) in covers"
          :key="c.kind"
          class="fan__card"
          :class="{ 'fan__card--big': i === bigIndex }"
          :style="fanStyle(i)"
        >
          <img :src="c.image" :alt="c.label" loading="eager" />
          <figcaption class="fan__label">{{ c.label }}</figcaption>
        </figure>
      </div>
    </div>
  </section>
</template>

<style scoped>
.hero {
  background: #f1daae;
  color: #3a2a18;
  padding: 130px 32px 70px;
  text-align: center;
  position: relative;
  overflow: hidden;
}
.hero__intro {
  max-width: 820px;
  margin: 0 auto 10px;
}
.hero__title {
  font-size: clamp(2.2rem, 5.5vw, 3.8rem);
  line-height: 1.05;
  margin: 0 0 18px;
  font-weight: 800;
  letter-spacing: -0.02em;
  color: #2e2113;
}
.hero__script {
  font-family: 'Brush Script MT', 'Segoe Script', cursive;
  font-weight: 400;
  color: #915530;
}
.hero__lead {
  max-width: 560px;
  margin: 0 auto 26px;
  color: rgba(58, 42, 24, 0.78);
  font-size: 1.02rem;
  line-height: 1.6;
}
.hero__cta {
  display: inline-block;
  background: #915530;
  color: #fff;
  text-decoration: none;
  padding: 13px 30px;
  border-radius: 999px;
  font-weight: 600;
  transition: background 0.2s ease, transform 0.2s ease;
}
.hero__cta:hover {
  background: #4a2711;
  transform: translateY(-2px);
}
.hero__stage {
  margin-top: 46px;
}
.hero__featured-name {
  font-size: 1.25rem;
  font-weight: 700;
  margin: 0;
  color: #2e2113;
}
.hero__featured-artist {
  margin: 2px 0 26px;
  color: rgba(58, 42, 24, 0.6);
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.2em;
}
.fan {
  display: flex;
  justify-content: center;
  align-items: flex-end;
  gap: 14px;
  min-height: 320px;
}
.fan__card {
  position: relative;
  margin: 0;
  width: 150px;
  height: 230px;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 18px 40px rgba(74, 39, 17, 0.28);
  transition: transform 0.3s ease;
}
.fan__card--big {
  width: 200px;
  height: 300px;
  box-shadow: 0 26px 60px rgba(74, 39, 17, 0.42);
}
.fan__card img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
.fan__label {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 16px 8px 7px;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #fff;
  background: linear-gradient(transparent, rgba(20, 12, 6, 0.8));
}
.fan__card:hover {
  transform: translateY(-10px) scale(1.03) !important;
  z-index: 6 !important;
}
@media (max-width: 720px) {
  .hero {
    padding: 108px 18px 50px;
  }
  .fan {
    gap: 8px;
    min-height: 240px;
  }
  .fan__card {
    width: 84px;
    height: 128px;
  }
  .fan__card--big {
    width: 116px;
    height: 174px;
  }
  .fan__label {
    font-size: 0.6rem;
    padding: 12px 4px 5px;
  }
}
</style>
