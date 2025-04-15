<!-- LightBar.vue -->
<template>
  <div class="relative flex h-[437px] flex-col items-center justify-center bg-white overflow-hidden z-0">
    <div class="relative flex w-full flex-1 scale-y-125 items-center justify-center isolate z-0">
      <div
        class="absolute inset-auto right-1/2 h-56 w-[30rem] bg-gradient-conic from-zinc-500 via-white to-transparent [--conic-position:from_70deg_at_center_top]"
        :style="leftStyle"
      />
      <div
        class="absolute inset-auto left-1/2 h-56 w-[30rem] bg-gradient-conic from-transparent via-white to-zinc-500 [--conic-position:from_290deg_at_center_top]"
        :style="rightStyle"
      />
      <div
        class="absolute top-1/2 h-48 w-full translate-y-12 scale-x-150 bg-white blur-2xl"
      />
      <div
        class="absolute top-1/2 z-50 h-48 w-full bg-transparent opacity-10 backdrop-blur-md"
      />
      <div
        class="absolute inset-auto z-50 h-36 w-[28rem] -translate-y-1/2 rounded-full opacity-50 blur-3xl"
        :style="topStyle"
      />
      <div
        class="absolute inset-auto z-30 h-36 w-64 -translate-y-[6rem] rounded-full blur-2xl"
        :style="bottomStyle"
      />
      <div
        class="absolute inset-auto z-50 h-0.5 w-[30rem] -translate-y-[7rem] blur-sm"
        :style="bottomStyle"
      />
      <div
        class="absolute inset-auto z-40 h-44 w-full -translate-y-[12.5rem] bg-white"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
// Define types and functions directly in component
import type { DefaultColors } from 'tailwindcss/types/generated/colors'

type ColorType = keyof DefaultColors
type colorType = 'emerald' | 'blue' | 'purple' | 'orange' | 'red' | 'zinc'

function formatThemeColors(color: colorType) {
  const colors = {
    emerald: {
      '400': '#34d399',
      '500': '#10b981'
    },
    blue: {
      '400': '#60a5fa',
      '500': '#3b82f6'
    },
    purple: {
      '400': '#c084fc',
      '500': '#a855f7'
    },
    orange: {
      '400': '#fb923c',
      '500': '#f97316'
    },
    red: {
      '400': '#f87171',
      '500': '#ef4444'
    },
    zinc: {
      '400': '#a1a1aa',
      '500': '#71717a'
    }
  }

  return colors[color]
}

const props = withDefaults(defineProps<{ theme?: colorType }>(), {
  theme: 'zinc'
})

const { theme } = toRefs(props)

const topStyle = computed(() => {
  return {
    backgroundColor: formatThemeColors(theme.value)['500']
  }
})

const bottomStyle = computed(() => {
  return {
    backgroundColor: formatThemeColors(theme.value)['400']
  }
})

const leftStyle = computed(() => {
  return {
    '--tw-gradient-from': `${formatThemeColors(theme.value)['500']} var(--tw-gradient-from-position)`
  }
})

const rightStyle = computed(() => {
  return {
    '--tw-gradient-to': `${formatThemeColors(theme.value)['500']} var(--tw-gradient-to-position)`
  }
})
</script> 