import type { DisplayItem } from '../lib/display'
import type { CategoryDef } from '../data/categories'

// Las obras de cada colección ya vienen construidas desde el store (site.ts),
// leídas de Supabase. Aquí solo las exponemos.
export function useGallery() {
  function itemsFor(cat: CategoryDef): DisplayItem[] {
    return cat.items
  }
  return { itemsFor }
}
