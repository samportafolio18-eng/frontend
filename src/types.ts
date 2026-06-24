// Estos tipos reflejan las tablas que Django crea en Supabase
// (db_table = "artworks" y "categories" en backend/portfolio/models.py).

export type Availability = 'available' | 'sold' | 'reserved' | 'not_for_sale'

export interface Category {
  id: number
  name: string
  slug: string
  description: string
}

export interface Artwork {
  id: number
  title: string
  slug: string
  description: string
  image: string | null
  created_date: string | null
  category_id: number | null
  tags: string[]
  availability: Availability
  price: string | null
  currency: string
  is_featured: boolean
  is_published: boolean
  sort_order: number
  created_at: string
  updated_at: string
  // join opcional con la categoría
  category?: Category | null
}

export const AVAILABILITY_LABEL: Record<Availability, string> = {
  available: 'Disponible',
  sold: 'Vendido',
  reserved: 'Reservado',
  not_for_sale: 'No a la venta',
}

export interface ContactInfo {
  email: string
  phone: string
  whatsapp: string
  instagram: string
  facebook: string
  tiktok: string
  website: string
  location: string
  about: string
  quote_text?: string
  quote_author?: string
}

export interface ContactMessageInput {
  name: string
  email: string
  phone?: string
  subject?: string
  message: string
  artwork_id?: number | null
}
