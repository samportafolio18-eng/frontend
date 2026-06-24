import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string

// Interruptor: ponlo en 'true' (en .env.local) SOLO cuando las tablas ya existan
// en Supabase (tras correr `migrate` y `policies.sql`). Mientras esté en false, el
// frontend no consulta Supabase y usa las imágenes de muestra (sin errores 404).
export const SUPABASE_READY = import.meta.env.VITE_SUPABASE_READY === 'true'

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    '[supabase] Falta VITE_SUPABASE_URL o VITE_SUPABASE_ANON_KEY. ' +
      'Copia frontend/.env.example a .env.local y rellena tus credenciales.',
  )
}

// Cliente de solo lectura: el frontend usa la anon key y las políticas RLS
// definidas en Supabase solo permiten SELECT sobre las tablas publicadas.
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: { persistSession: false },
})
