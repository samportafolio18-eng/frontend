import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import { collectionsOfKind, type CollectionKind } from '../data/categories'

// Si una disciplina no tiene datos, su página no se muestra (redirige al inicio).
const mediumGuard = (kind: CollectionKind) => () =>
  collectionsOfKind(kind).length > 0 ? true : { path: '/' }

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'home', component: HomeView },
    {
      path: '/pinturas',
      name: 'pintura',
      component: () => import('../views/MediumView.vue'),
      props: { kind: 'pintura' },
      beforeEnter: mediumGuard('pintura'),
    },
    {
      path: '/fotografia',
      name: 'fotografia',
      component: () => import('../views/MediumView.vue'),
      props: { kind: 'fotografia' },
      beforeEnter: mediumGuard('fotografia'),
    },
    {
      path: '/esculturas',
      name: 'escultura',
      component: () => import('../views/MediumView.vue'),
      props: { kind: 'escultura' },
      beforeEnter: mediumGuard('escultura'),
    },
    {
      path: '/ceramicas',
      name: 'ceramica',
      component: () => import('../views/MediumView.vue'),
      props: { kind: 'ceramica' },
      beforeEnter: mediumGuard('ceramica'),
    },
    {
      path: '/coleccion/:slug',
      name: 'collection',
      component: () => import('../views/CollectionView.vue'),
      props: true,
    },
    { path: '/:pathMatch(.*)*', redirect: '/' },
  ],
  scrollBehavior(to, _from, saved) {
    // Con la transición de página, el destino del hash aún no está montado
    // cuando corre scrollBehavior: esperamos a que exista antes de desplazar.
    if (to.hash) {
      return new Promise((resolve) => {
        const tryScroll = (attempts = 0) => {
          if (document.querySelector(to.hash)) {
            resolve({ el: to.hash, top: 78, behavior: 'smooth' })
          } else if (attempts < 20) {
            requestAnimationFrame(() => tryScroll(attempts + 1))
          } else {
            resolve({ top: 0 })
          }
        }
        tryScroll()
      })
    }
    if (saved) return saved
    return { top: 0 }
  },
})

export default router
