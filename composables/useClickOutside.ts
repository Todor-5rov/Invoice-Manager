import { onMounted, onBeforeUnmount, Ref } from 'vue'

export const useClickOutside = (
  elementRef: Ref<HTMLElement | null>,
  callback: (event: MouseEvent) => void
) => {
  const handleClickOutside = (event: MouseEvent) => {
    if (elementRef.value && !elementRef.value.contains(event.target as Node)) {
      callback(event)
    }
  }

  onMounted(() => {
    document.addEventListener('mousedown', handleClickOutside)
  })

  onBeforeUnmount(() => {
    document.removeEventListener('mousedown', handleClickOutside)
  })

  return {
    handleClickOutside
  }
} 