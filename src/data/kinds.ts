// Disciplinas fijas del portafolio (etiqueta, plural y ruta de su página).
// Vive aparte de categories.ts y del store para no crear ciclos de importación.

export type CollectionKind = 'pintura' | 'fotografia' | 'escultura' | 'ceramica'

export const KIND_META: Record<
  CollectionKind,
  { label: string; plural: string; path: string }
> = {
  pintura: { label: 'Pintura', plural: 'Pinturas', path: '/pinturas' },
  fotografia: { label: 'Fotografía', plural: 'Fotografías', path: '/fotografia' },
  escultura: { label: 'Escultura', plural: 'Esculturas', path: '/esculturas' },
  ceramica: { label: 'Cerámica', plural: 'Cerámicas', path: '/ceramicas' },
}

export const KIND_ORDER: CollectionKind[] = [
  'pintura',
  'fotografia',
  'escultura',
  'ceramica',
]
