<template>
  <div class="inline-flex">
    <button
      class="group relative z-[1] bg-transparent text-neutral-100 hover:text-neutral-100 hover:no-underline"
    >
      <div
        class="absolute -left-[1.5px] -top-[1.5px] z-[-1] h-[calc(100%+2.5px)] w-[calc(100%+2.5px)] overflow-hidden rounded-full"
      >
        <div
          class="animate-spin [animation-duration:5s] absolute left-[-12.5%] top-[-40px] aspect-square h-auto w-[125%]"
          :style="{
            backgroundImage: conicGradient
          }"
        ></div>
      </div>
      <div
        class="rounded-full bg-gradient-to-br from-black to-neutral-700 px-4 py-2"
      >
        <div
          class="flex items-center justify-center gap-2 transition-transform duration-100 ease-in-out group-hover:scale-105"
        >
          <slot />
        </div>
      </div>
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { colord } from 'colord'

interface Props {
  color?: string
}

const props = withDefaults(defineProps<Props>(), {
  color: '#ffffff'
})

const conicGradient = computed(() => {
  const alphaColor = colord(props.color).alpha(0.33).toRgbString()
  return `conic-gradient(from 90deg at 50% 50%, ${alphaColor} 0, ${alphaColor} 10%, ${props.color} 20%, ${alphaColor} 30%, ${alphaColor} 60%, ${props.color} 70%, ${alphaColor} 80%, ${alphaColor} 100%)`
})
</script>

<style scoped>
.animate-spin {
  animation: spin 5s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style> 