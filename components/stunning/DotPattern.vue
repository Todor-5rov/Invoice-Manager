<template>
  <svg
    aria-hidden="true"
    class="pointer-events-none absolute inset-0 h-full w-full fill-neutral-400/60"
    v-bind="$attrs"
  >
  <defs>
    <pattern
    :id="'pattern-' + id"
        :width="width"
        :height="height"
        :patternUnits="userSpaceOnUse"
        :patternContentUnits="userSpaceOnUse"
        :x="x"
        :y="y"
      >
        <circle id="pattern-circle" :cx="cy" :cy="cy" :r="cr" />
      </pattern>
    </defs>
    <rect width="100%" height="100%" stroke-width="0" :fill="`url(#${id})`" />
  </svg>
</template>

<script lang="ts" setup>
const id = useId()
withDefaults(
  defineProps<{
    width?: number
    height?: number
    userSpaceOnUse?: string
    x?: number
    y?: number
    cy?: number
    cr?: number
  }>(),
  {
    width: 16,
    height: 16,
    userSpaceOnUse: 'userSpaceOnUse',
    x: 0,
    y: 0,
    cy: 1,
    cr: 1,
  }
)
</script> 