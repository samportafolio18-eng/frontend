// ============================================================================
//  Colecciones del portafolio — AHORA provienen de la base (Supabase), cargadas
//  en el store `site`. Este módulo solo expone el tipo y los helpers que usan
//  los componentes (getCollection, collectionsOfKind, activeKinds, etc.).
//  La estructura, colores y orden se gestionan desde el admin de Django.
// ============================================================================
import { site } from '../store/site'
import type { DisplayItem } from '../lib/display'
import { KIND_META, KIND_ORDER, type CollectionKind } from './kinds'

export { KIND_META }
export type { CollectionKind }

export interface CategoryDef {
  slug: string
  name: string
  kind: CollectionKind
  tagline: string
  description: string
  /** Color de fondo de la sección */
  color: string
  /** Color de acento (botones, líneas) */
  accent: string
  /** Color de texto principal */
  text: string
  /** Color de texto atenuado */
  muted: string
  theme: 'dark' | 'light'
  sortOrder: number
  /** Obras de la colección, ya listas para mostrar (de la BD). */
  items: DisplayItem[]
}

export function allCollections(): CategoryDef[] {
  return site.collections
}

export function getCollection(slug: string): CategoryDef | undefined {
  return site.collections.find((c) => c.slug === slug)
}

// Una colección "tiene datos" si trae obras publicadas.
export function hasData(c: CategoryDef): boolean {
  return c.items.length > 0
}

export function collectionsOfKind(kind: CollectionKind): CategoryDef[] {
  return site.collections.filter((c) => c.kind === kind && hasData(c))
}

// Todas las disciplinas con datos (en orden fijo).
export function activeKinds(): CollectionKind[] {
  return KIND_ORDER.filter((k) => collectionsOfKind(k).length > 0)
}

// Disciplinas aparte de pintura, con datos.
export function activeMediums(): CollectionKind[] {
  return activeKinds().filter((k) => k !== 'pintura')
}

// ---- Obras destacadas ----
export interface FeaturedItem {
  title: string
  category: string
  image: string
  slug: string
  color: string
}

export function featuredOfKind(kind: CollectionKind): FeaturedItem[] {
  const out: FeaturedItem[] = []
  for (const c of collectionsOfKind(kind)) {
    for (const it of c.items) {
      if (it.featured) {
        out.push({
          title: it.title,
          category: c.name,
          image: it.image,
          slug: c.slug,
          color: c.color,
        })
      }
    }
  }
  return out
}

export function kindsWithFeatured(): CollectionKind[] {
  return activeKinds().filter((k) => featuredOfKind(k).length > 0)
}
