<script setup lang="ts">
import { computed } from 'vue'
import { site } from '../store/site'
import { allCollections } from '../data/categories'

const home = computed(() => site.home)

// La 1ª estadística autocuenta colecciones si su valor quedó vacío en el admin.
const stats = computed(() =>
  home.value.stats.map((s, i) =>
    i === 0 && !s.value
      ? { value: String(allCollections().length), label: s.label }
      : s,
  ),
)
</script>

<template>
  <section id="about" class="about">
    <div class="about__inner">
      <div v-reveal class="about__head">
        <h2 class="about__title">
          {{ home.aboutTitle }} <span class="about__script">{{ home.aboutScript }}</span>
        </h2>
      </div>
      <div v-reveal="100" class="about__body">
        <p class="about__text">{{ home.aboutText1 }}</p>
        <p class="about__text about__text--muted">{{ home.aboutText2 }}</p>
        <a href="#destacados" class="about__link">{{ home.aboutLink }} →</a>
      </div>

      <div class="about__stats">
        <div v-for="s in stats" :key="s.label" class="about__stat">
          <span class="about__stat-value">{{ s.value }}</span>
          <span class="about__stat-label">{{ s.label }}</span>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.about {
  background: #f1daae;
  color: #3a2a18;
  padding: 84px 32px;
}
.about__inner {
  display: grid;
  grid-template-columns: 0.8fr 1.2fr;
  gap: 40px 56px;
  max-width: 1180px;
  margin: 0 auto;
  align-items: start;
}
.about__title {
  font-size: clamp(2rem, 4.5vw, 3rem);
  margin: 0;
  font-weight: 800;
  line-height: 1.1;
}
.about__script {
  display: block;
  font-family: 'Brush Script MT', 'Segoe Script', cursive;
  font-weight: 400;
  color: #915530;
}
.about__text {
  font-size: 1.08rem;
  line-height: 1.7;
  margin: 0 0 16px;
}
.about__text--muted {
  color: rgba(58, 42, 24, 0.7);
  font-size: 1rem;
}
.about__link {
  display: inline-block;
  margin-top: 8px;
  color: #4a2711;
  font-weight: 700;
  text-decoration: none;
  border-bottom: 2px solid #915530;
  padding-bottom: 2px;
}
.about__stats {
  grid-column: 1 / -1;
  display: flex;
  gap: 48px;
  flex-wrap: wrap;
  border-top: 1px solid rgba(74, 39, 17, 0.18);
  padding-top: 28px;
}
.about__stat {
  display: flex;
  flex-direction: column;
}
.about__stat-value {
  font-size: 2rem;
  font-weight: 800;
  color: #915530;
}
.about__stat-label {
  text-transform: uppercase;
  letter-spacing: 0.18em;
  font-size: 0.72rem;
  color: rgba(58, 42, 24, 0.65);
}
@media (max-width: 760px) {
  .about {
    padding: 60px 18px;
  }
  .about__inner {
    grid-template-columns: 1fr;
    gap: 24px;
  }
  .about__stats {
    gap: 28px;
  }
}
</style>
