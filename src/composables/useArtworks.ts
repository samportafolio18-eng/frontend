import { ref } from 'vue'
import { supabase, SUPABASE_READY } from '../lib/supabase'
import type { Artwork, Category } from '../types'

export function useArtworks() {
  const artworks = ref<Artwork[]>([])
  const categories = ref<Category[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function load() {
    // Sin tablas en Supabase aún: no consultamos (el Home usa las muestras).
    if (!SUPABASE_READY) return

    loading.value = true
    error.value = null
    try {
      // Lee directo de Supabase: solo obras publicadas, ordenadas como en el admin.
      const [artRes, catRes] = await Promise.all([
        supabase
          .from('artworks')
          .select('*')
          .eq('is_published', true)
          .order('sort_order', { ascending: true })
          .order('created_at', { ascending: false }),
        supabase.from('categories').select('*').order('name', { ascending: true }),
      ])

      if (artRes.error) throw artRes.error
      if (catRes.error) throw catRes.error

      artworks.value = (artRes.data as Artwork[]) ?? []
      categories.value = (catRes.data as Category[]) ?? []
    } catch (e: any) {
      error.value = e?.message ?? 'No se pudo cargar el portafolio.'
      console.error('[useArtworks]', e)
    } finally {
      loading.value = false
    }
  }

  return { artworks, categories, loading, error, load }
}
