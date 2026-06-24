export interface MetaRow {
  label: string
  value: string
}

// Item visual que muestran las tarjetas y el modal de detalle.
export interface DisplayItem {
  title: string
  subtitle?: string
  description?: string
  image: string
  badge?: string
  /** Marca la obra como destacada (banda "… destacadas" del inicio). */
  featured?: boolean
  /** Ficha técnica: disciplina, colección, técnica, año, precio, etc. */
  meta?: MetaRow[]
}
