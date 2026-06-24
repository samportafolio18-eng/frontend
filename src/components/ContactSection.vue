<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { supabase, SUPABASE_READY } from '../lib/supabase'
import { site } from '../store/site'
import SocialLinks from './SocialLinks.vue'

// Datos de contacto desde el store (cargados de Supabase al inicio).
const info = computed(() => site.contact)

const form = reactive({ name: '', email: '', message: '' })
const sending = ref(false)
const sent = ref(false)
const error = ref<string | null>(null)

async function submit() {
  error.value = null
  if (!form.name || !form.email || !form.message) {
    error.value = 'Completa nombre, email y mensaje.'
    return
  }
  if (!SUPABASE_READY) {
    error.value = info.value.email
      ? 'Por ahora escríbeme directo a ' + info.value.email + '.'
      : 'Por ahora el formulario no está disponible.'
    return
  }
  sending.value = true
  try {
    const { error: e } = await supabase.from('contact_messages').insert({
      name: form.name,
      email: form.email,
      message: form.message,
    })
    if (e) throw e
    sent.value = true
    form.name = form.email = form.message = ''
  } catch (err: any) {
    error.value = info.value.email
      ? 'No se pudo enviar ahora mismo. Escríbeme directo a ' + info.value.email + '.'
      : 'No se pudo enviar ahora mismo. Intenta más tarde.'
    console.error('[contacto]', err)
  } finally {
    sending.value = false
  }
}
</script>

<template>
  <section id="contacto" class="contact">
    <div class="contact__grid">
      <div class="contact__info">
        <h2 class="contact__title">¿Te interesa una obra?</h2>
        <p class="contact__lead">
          Escríbeme para consultar disponibilidad, precios o encargos.
        </p>
        <p v-if="info.about" class="contact__about">{{ info.about }}</p>

        <ul class="contact__list">
          <li v-if="info.email">
            <span>✉</span> <a :href="`mailto:${info.email}`">{{ info.email }}</a>
          </li>
          <li v-if="info.whatsapp">
            <span>✆</span>
            <a :href="`https://wa.me/${info.whatsapp.replace(/\D/g, '')}`" target="_blank"
              >WhatsApp {{ info.whatsapp }}</a
            >
          </li>
          <li v-else-if="info.phone"><span>✆</span> {{ info.phone }}</li>
          <li v-if="info.location"><span>⌖</span> {{ info.location }}</li>
        </ul>

        <SocialLinks :size="46" class="contact__social" />
      </div>

      <form class="contact__form" @submit.prevent="submit">
        <template v-if="!sent">
          <label>
            Nombre
            <input v-model="form.name" type="text" required />
          </label>
          <label>
            Email
            <input v-model="form.email" type="email" required />
          </label>
          <label>
            Mensaje
            <textarea v-model="form.message" rows="4" required></textarea>
          </label>
          <p v-if="error" class="contact__error">{{ error }}</p>
          <button type="submit" :disabled="sending">
            {{ sending ? 'Enviando…' : 'Enviar consulta' }}
          </button>
        </template>
        <p v-else class="contact__ok">
          ¡Gracias! Tu mensaje fue enviado. Te responderé pronto.
        </p>
      </form>
    </div>
  </section>
</template>

<style scoped>
.contact {
  background: #482f1d;
  color: #f4ecdd;
  padding: 90px 32px;
}
.contact__grid {
  max-width: 1000px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 48px;
  align-items: start;
}
.contact__title {
  font-size: clamp(1.8rem, 4vw, 2.6rem);
  margin: 0 0 12px;
  font-weight: 800;
}
.contact__lead {
  color: rgba(244, 236, 221, 0.72);
  margin: 0 0 18px;
}
.contact__about {
  color: rgba(244, 236, 221, 0.6);
  font-size: 0.92rem;
  line-height: 1.6;
  margin: 0 0 18px;
}
.contact__list {
  list-style: none;
  padding: 0;
  margin: 0 0 18px;
  display: grid;
  gap: 10px;
}
.contact__list li {
  display: flex;
  align-items: center;
  gap: 10px;
}
.contact__list span {
  color: #d99a4e;
  width: 18px;
}
.contact__list a {
  color: #f4ecdd;
  text-decoration: none;
}
.contact__list a:hover {
  text-decoration: underline;
}
.contact__social {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}
.contact__social a {
  border: 1px solid rgba(244, 236, 221, 0.3);
  color: #f4ecdd;
  text-decoration: none;
  padding: 6px 14px;
  border-radius: 999px;
  font-size: 0.85rem;
  transition: background 0.2s ease;
}
.contact__social a:hover {
  background: rgba(217, 154, 78, 0.2);
}
.contact__form {
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(244, 236, 221, 0.12);
  border-radius: 16px;
  padding: 24px;
  display: grid;
  gap: 14px;
}
.contact__form label {
  display: grid;
  gap: 6px;
  font-size: 0.85rem;
  color: rgba(244, 236, 221, 0.8);
}
.contact__form input,
.contact__form textarea {
  background: rgba(0, 0, 0, 0.25);
  border: 1px solid rgba(244, 236, 221, 0.2);
  border-radius: 8px;
  padding: 10px 12px;
  color: #fff;
  font: inherit;
  resize: vertical;
}
.contact__form input:focus,
.contact__form textarea:focus {
  outline: none;
  border-color: #d99a4e;
}
.contact__form button {
  background: #915530;
  color: #fff;
  border: none;
  padding: 13px;
  border-radius: 999px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s ease;
}
.contact__form button:hover:not(:disabled) {
  background: #a4632f;
}
.contact__form button:disabled {
  opacity: 0.6;
  cursor: default;
}
.contact__error {
  color: #ffb4a0;
  font-size: 0.85rem;
  margin: 0;
}
.contact__ok {
  color: #cfe6a8;
  text-align: center;
  margin: 0;
  padding: 20px 0;
}
@media (max-width: 760px) {
  .contact {
    padding: 60px 18px;
  }
  .contact__grid {
    grid-template-columns: 1fr;
    gap: 28px;
  }
}
</style>
