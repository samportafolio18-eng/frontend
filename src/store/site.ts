// ============================================================================
//  Store del sitio: carga TODO desde Supabase una sola vez (antes de montar la
//  app) para que el frontend sea 100% gestionable desde el admin de Django.
//  - colecciones (tabla categories, con su apariencia)
//  - obras (tabla artworks) agrupadas por colección
//  - textos del inicio (tabla home_content)
//  - contacto + redes + frase (tabla contact_info)
//  Si no hay datos, el sitio muestra solo lo que exista (visibilidad por datos).
// ============================================================================
import { reactive } from 'vue'
import { supabase, SUPABASE_READY } from '../lib/supabase'
import { imageUrl } from '../lib/images'
import { AVAILABILITY_LABEL, type Availability } from '../types'
import { KIND_META, type CollectionKind } from '../data/kinds'
import type { CategoryDef } from '../data/categories'
import type { DisplayItem, MetaRow } from '../lib/display'

export interface HomeContent {
  heroTitle: string
  heroScript: string
  heroLead: string
  heroCta: string
  aboutTitle: string
  aboutScript: string
  aboutText1: string
  aboutText2: string
  aboutLink: string
  stats: { value: string; label: string }[]
}

export interface SiteContact {
  email: string
  phone: string
  whatsapp: string
  instagram: string
  facebook: string
  tiktok: string
  website: string
  location: string
  about: string
  quoteText: string
  quoteAuthor: string
}

const DEFAULT_HOME: HomeContent = {
  heroTitle: 'Sumérgete en el arte de nuestra',
  heroScript: 'colección',
  heroLead:
    'Un portafolio de pintura, fotografía, escultura y cerámica. Explora cada disciplina y descubre la obra una a una.',
  heroCta: 'Explorar colección',
  aboutTitle: 'Sobre la',
  aboutScript: 'galería',
  aboutText1:
    'Bienvenido al estudio de Samanta Meza, donde la pintura cobra vida. Reúno obra propia organizada por colecciones —de paisajes serenos a nocturnos intensos— para que recorras cada tema por su color y su luz.',
  aboutText2:
    'Explora las colecciones, descubre cada pieza y escríbeme si una obra te habla: hay encargos, disponibilidad y precios para cada una.',
  aboutLink: 'Recorrer las colecciones',
  stats: [
    { value: '', label: 'Colecciones' },
    { value: '100%', label: 'Hecho a mano' },
    { value: '∞', label: 'Inspiración' },
  ],
}

const DEFAULT_CONTACT: SiteContact = {
  email: '',
  phone: '',
  whatsapp: '',
  instagram: '',
  facebook: '',
  tiktok: '',
  website: '',
  location: '',
  about: '',
  quoteText:
    'vivir y estar abierto a la melancolía\nque emerge siempre alrededor\nde mis ojos ansiosos por ver\nel mundo es ser víctima de\nla pasión absoluta que aguarda\ntras el papel en blanco.',
  quoteAuthor: 'Samanta Meza',
}

export const site = reactive({
  collections: [] as CategoryDef[],
  home: { ...DEFAULT_HOME },
  contact: { ...DEFAULT_CONTACT },
  loaded: false,
})

// --- Construye un item mostrable a partir de una obra de la BD ---
function buildItem(a: any, cat: any, kind: CollectionKind): DisplayItem {
  const priceText =
    a.price != null ? `${a.currency} ${Number(a.price).toLocaleString()}` : null
  const meta: MetaRow[] = [
    { label: 'Disciplina', value: KIND_META[kind].label },
    { label: 'Colección', value: cat.name },
  ]
  if (a.created_date) meta.push({ label: 'Año', value: String(a.created_date).slice(0, 4) })
  if (priceText) meta.push({ label: 'Precio', value: priceText })
  meta.push({
    label: 'Disponibilidad',
    value: AVAILABILITY_LABEL[a.availability as Availability] ?? '',
  })
  return {
    title: a.title,
    subtitle: priceText ?? AVAILABILITY_LABEL[a.availability as Availability],
    description: a.description || cat.description || '',
    image: imageUrl(a.image),
    badge: a.is_featured ? '★ Destacado' : undefined,
    featured: !!a.is_featured,
    meta,
  }
}

function mapHome(d: any): HomeContent {
  return {
    heroTitle: d.hero_title ?? DEFAULT_HOME.heroTitle,
    heroScript: d.hero_title_script ?? DEFAULT_HOME.heroScript,
    heroLead: d.hero_lead ?? DEFAULT_HOME.heroLead,
    heroCta: d.hero_cta ?? DEFAULT_HOME.heroCta,
    aboutTitle: d.about_title ?? DEFAULT_HOME.aboutTitle,
    aboutScript: d.about_script ?? DEFAULT_HOME.aboutScript,
    aboutText1: d.about_text_1 ?? DEFAULT_HOME.aboutText1,
    aboutText2: d.about_text_2 ?? DEFAULT_HOME.aboutText2,
    aboutLink: d.about_link ?? DEFAULT_HOME.aboutLink,
    stats: [
      { value: d.stat1_value ?? '', label: d.stat1_label ?? 'Colecciones' },
      { value: d.stat2_value ?? '100%', label: d.stat2_label ?? 'Hecho a mano' },
      { value: d.stat3_value ?? '∞', label: d.stat3_label ?? 'Inspiración' },
    ],
  }
}

function mapContact(d: any): SiteContact {
  return {
    email: d.email ?? '',
    phone: d.phone ?? '',
    whatsapp: d.whatsapp ?? '',
    instagram: d.instagram ?? '',
    facebook: d.facebook ?? '',
    tiktok: d.tiktok ?? '',
    website: d.website ?? '',
    location: d.location ?? '',
    about: d.about ?? '',
    quoteText: d.quote_text || DEFAULT_CONTACT.quoteText,
    quoteAuthor: d.quote_author || DEFAULT_CONTACT.quoteAuthor,
  }
}

export async function loadSite(): Promise<void> {
  if (!SUPABASE_READY) {
    site.loaded = true
    return
  }
  try {
    const [catRes, artRes, homeRes, contactRes] = await Promise.all([
      supabase
        .from('categories')
        .select('*')
        .eq('is_visible', true)
        .order('sort_order', { ascending: true }),
      supabase
        .from('artworks')
        .select('*')
        .eq('is_published', true)
        .order('sort_order', { ascending: true })
        .order('created_at', { ascending: false }),
      supabase.from('home_content').select('*').limit(1).maybeSingle(),
      supabase.from('contact_info').select('*').limit(1).maybeSingle(),
    ])

    const cats = catRes.data ?? []
    const arts = artRes.data ?? []
    const itemsByCat = new Map<number, DisplayItem[]>()
    const catById = new Map<number, any>()
    for (const c of cats) catById.set(c.id, c)
    for (const a of arts) {
      if (a.category_id == null) continue
      const c = catById.get(a.category_id)
      if (!c) continue
      const list = itemsByCat.get(c.id) ?? []
      list.push(buildItem(a, c, c.kind as CollectionKind))
      itemsByCat.set(c.id, list)
    }

    site.collections = cats.map(
      (c: any): CategoryDef => ({
        slug: c.slug,
        name: c.name,
        kind: c.kind as CollectionKind,
        tagline: c.tagline || '',
        description: c.description || '',
        color: c.color || '#915530',
        accent: c.accent || '#F1DAAE',
        text: c.text_color || '#F4ECDD',
        muted: c.muted_color || 'rgba(244,236,221,0.7)',
        theme: (c.theme as 'dark' | 'light') || 'dark',
        sortOrder: c.sort_order ?? 0,
        items: itemsByCat.get(c.id) ?? [],
      }),
    )

    if (homeRes.data) site.home = mapHome(homeRes.data)
    if (contactRes.data) site.contact = mapContact(contactRes.data)
  } catch (e) {
    console.error('[site] no se pudo cargar de Supabase:', e)
  } finally {
    site.loaded = true
  }
}
