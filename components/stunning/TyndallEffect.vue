<template>
  <div
    class="sui-tyndall-effect relative flex gap-10 min-h-screen overflow-hidden h-auto w-full justify-start items-center"
    :style="wrapperStyle"
  >
    <div
      class="streak streak-1 flex-none mix-blend-overlay overflow-hidden pointer-events-none absolute w-[200%] lg:w-[150%] h-24 lg:h-56 left-[-64vw] top-[48vw] lg:left-[-28vw] lg:top-[32vw] xl:left-[-16vw] xl:top-[21vw]"
      style="transform: rotate(40deg) scaleY(1); opacity: 0.8;"
    ></div>
    <div
      class="streak streak-2 flex-none mix-blend-overlay overflow-hidden pointer-events-none absolute w-[200%] lg:w-[150%] h-12 lg:h-24 left-[-60vw] top-[40vw] lg:left-[-32vw] lg:top-[24vw] xl:left-[-12vw] xl:top-[17vw]"
      style="transform: rotate(32deg) scaleY(1); opacity: 0.92;"
    ></div>
    <div
      class="streak streak-3 flex-none mix-blend-overlay overflow-hidden pointer-events-none absolute w-[200%] lg:w-[150%] h-20 lg:h-48 left-[-32vw] top-[32vw] lg:left-[-12vw] lg:top-[18vw] xl:left-[-10vw] xl:top-[10vw]"
      style="transform: rotate(24deg) scaleY(1); opacity: 1;"
    ></div>
    <div
      class="overlay h-56 flex-none absolute left-0 right-0 top-0 z-10 overflow-hidden pointer-events-none"
    ></div>
    <div
      class="particles-effect flex-none h-screen absolute left-0 top-0 right-0"
      v-if="$slots.particles"
    >
      <slot name="particles" />
    </div>
    <slot />
  </div>
</template>

<script lang="ts" setup>
const props = withDefaults(
  defineProps<{
    streakColor: string
  }>(),
  {
    streakColor: 'rgb(255, 255, 255)'
  }
)

const { streakColor } = toRefs(props)

const wrapperStyle = computed(() => {
  return {
    '--streak-color': streakColor.value
  }
})
</script>

<style scoped>
.sui-tyndall-effect {
  --streak-color: rgb(0, 225, 255);
}

.sui-tyndall-effect .overlay {
  background: linear-gradient(
    180deg,
    #000000 0%,
    rgba(0, 0, 0, 0.32) 43%,
    rgba(0, 0, 0, 0.12) 70%,
    rgba(0, 0, 0, 0) 100%
  );
}

.sui-tyndall-effect .streak {
  background: linear-gradient(
    90deg,
    var(--streak-color) 16%,
    rgba(255, 255, 255, 0) 100%
  );
  mask: linear-gradient(
    180deg,
    rgba(0, 0, 0, 0) 0%,
    rgba(0, 0, 0, 0.5) 35%,
    rgba(0, 0, 0, 0.5) 64%,
    rgba(0, 0, 0, 0) 100%
  );
  animation: fadeIn 2s ease-out forwards;
}

.streak-1 {
  animation-delay: 0.1s;
}

.streak-2 {
  animation-delay: 0.3s;
}

.streak-3 {
  animation-delay: 0.5s;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scaleY(0.5) rotate(var(--rotate-deg, 40deg));
  }
  to {
    opacity: var(--final-opacity, 1);
    transform: scaleY(1) rotate(var(--rotate-deg, 40deg));
  }
}

.streak-1 {
  --rotate-deg: 40deg;
  --final-opacity: 0.8;
}

.streak-2 {
  --rotate-deg: 32deg;
  --final-opacity: 0.92;
}

.streak-3 {
  --rotate-deg: 24deg;
  --final-opacity: 1;
}

.sui-tyndall-effect .particles-effect {
  mask: linear-gradient(
    225deg,
    rgba(0, 0, 0, 0) 30%,
    rgb(0, 0, 0) 36%,
    rgb(0, 0, 0) 63%,
    rgba(0, 0, 0, 0) 76%
  );
}
</style> 