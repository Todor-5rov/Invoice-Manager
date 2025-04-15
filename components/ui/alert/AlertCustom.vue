<template>
  <div 
    :class="[
      'p-4 rounded-lg border',
      variant === 'error' ? 'bg-white border-red-500 text-red-600' : 'bg-white border-gray-300',
    ]"
  >
    <div class="flex items-start">
      <slot name="icon"></slot>
      <div class="ml-3">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  variant: {
    type: String,
    default: 'default',
    validator: (value) => ['default', 'error'].includes(value),
  }
})
</script> 