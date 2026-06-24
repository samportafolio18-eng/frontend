// La columna `image` guarda la ruta relativa dentro del bucket (ej. "artworks/obra.png"),
// tal como la escribe django-storages. Aquí construimos la URL pública de Supabase Storage.

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string
const BUCKET = (import.meta.env.VITE_SUPABASE_BUCKET as string) || 'artworks'

export function imageUrl(path: string | null): string {
  if (!path) return ''
  // Si ya es una URL absoluta (http...), úsala tal cual.
  if (/^https?:\/\//i.test(path)) return path
  return `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${path}`
}
