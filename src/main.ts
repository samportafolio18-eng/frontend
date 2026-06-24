import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'
import { vReveal } from './directives/reveal'
import { loadSite } from './store/site'

// Cargamos los datos del sitio (colecciones, obras, textos, contacto) ANTES de
// montar, para que el router y los componentes los tengan disponibles al inicio.
loadSite().finally(() => {
  createApp(App).use(router).directive('reveal', vReveal).mount('#app')
})
