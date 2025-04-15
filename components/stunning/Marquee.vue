<script setup>
const props = defineProps({
  reverse: {
    type: Boolean,
    default: false
  },
  pauseOnHover: {
    type: Boolean,
    default: false
  }
})
</script>

<template>
  <div 
    class="group flex gap-6 overflow-hidden [mask-image:linear-gradient(to_right,transparent,white_20%,white_80%,transparent)]"
    :class="{ 'hover:[--play-state:paused]': pauseOnHover }"
  >
    <div 
      class="flex min-w-full shrink-0 items-center justify-around gap-6 py-4 animate-marquee"
      :class="{ 'animation-reverse': reverse }"
    >
      <slot />
    </div>
    <div 
      class="flex min-w-full shrink-0 items-center justify-around gap-6 py-4 animate-marquee"
      :class="{ 'animation-reverse': reverse }"
    >
      <slot />
    </div>
  </div>
</template>

<style>
.animate-marquee {
  animation: marquee var(--duration, 40s) linear infinite;
  animation-play-state: var(--play-state, running);
}

.animation-reverse {
  animation-direction: reverse;
}

@keyframes marquee {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(calc(-100% - 1.5rem));
  }
}
</style> 