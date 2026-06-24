import { computed, onMounted, onUnmounted, ref, type Ref } from 'vue'
import type { DisplayItem } from '../lib/display'

// Lightbox navegable (flechas + teclado) sobre una lista reactiva de items.
export function useLightbox(items: Ref<DisplayItem[]>) {
  const index = ref(-1)
  const selected = computed(() =>
    index.value >= 0 ? items.value[index.value] ?? null : null,
  )

  function open(item: DisplayItem) {
    index.value = items.value.indexOf(item)
  }
  function close() {
    index.value = -1
  }
  function go(delta: number) {
    const n = items.value.length
    if (!n) return
    index.value = (index.value + delta + n) % n
  }
  function onKey(e: KeyboardEvent) {
    if (index.value < 0) return
    if (e.key === 'Escape') close()
    else if (e.key === 'ArrowRight') go(1)
    else if (e.key === 'ArrowLeft') go(-1)
  }

  onMounted(() => window.addEventListener('keydown', onKey))
  onUnmounted(() => window.removeEventListener('keydown', onKey))

  return { selected, open, close, go }
}
