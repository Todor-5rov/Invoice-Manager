<script setup>
import { ref, provide, onMounted, reactive, onBeforeUnmount, computed } from 'vue'
import { useSwipe, useElementSize, useRafFn, useEventListener } from '@vueuse/core'

const props = defineProps({
  items: {
    type: Array,
    required: true
  },
  initialScroll: {
    type: Number,
    default: 0
  },
  scrollMultiplier: {
    type: Number,
    default: 2.5
  },
  decelerationRate: {
    type: Number,
    default: 0.95 // Higher = less friction
  }
})

const carouselRef = ref(null)
const { width: containerWidth } = useElementSize(carouselRef)
const canScrollLeft = ref(false)
const canScrollRight = ref(true)
const currentIndex = ref(0)

// Enhanced drag state with momentum
const isDragging = ref(false)
const startX = ref(0)
const startScrollLeft = ref(0)
const momentum = ref(0)
const isAnimating = ref(false)

const carouselState = reactive({
  onCardClose: (index) => handleCardClose(index),
  currentIndex: currentIndex
})

provide('carousel', carouselState)

// Calculate card width dynamically for snapping
const cardWidth = computed(() => {
  // Approximate card width (including gap)
  return 400 // Adjust based on your actual card width + gap
})

// Setup swipe gesture support
const { lengthX, isSwiping } = useSwipe(carouselRef, {
  onSwipe(e) {
    if (!carouselRef.value) return
    carouselRef.value.scrollLeft -= e.deltaX * props.scrollMultiplier
    momentum.value = -e.velocityX * 25 // Set momentum based on velocity
    checkScrollability()
  },
  onSwipeEnd() {
    if (Math.abs(momentum.value) > 1) {
      startMomentumScroll()
    } else {
      snapToNearestCard()
    }
  }
})

// Animation loop for momentum scrolling
const { pause: pauseRaf, resume: resumeRaf } = useRafFn(() => {
  if (!carouselRef.value || Math.abs(momentum.value) < 0.5) {
    isAnimating.value = false
    pauseRaf()
    snapToNearestCard()
    return
  }

  carouselRef.value.scrollLeft += momentum.value
  momentum.value *= props.decelerationRate
  checkScrollability()
}, { immediate: false })

// Start momentum scrolling
const startMomentumScroll = () => {
  isAnimating.value = true
  resumeRaf()
}

// Snap to nearest card
const snapToNearestCard = () => {
  if (!carouselRef.value) return

  const { scrollLeft } = carouselRef.value
  const targetPosition = Math.round(scrollLeft / cardWidth.value) * cardWidth.value

  carouselRef.value.scrollTo({
    left: targetPosition,
    behavior: 'smooth'
  })

  setTimeout(checkScrollability, 300)
}

onMounted(() => {
  if (carouselRef.value) {
    carouselRef.value.scrollLeft = props.initialScroll
    checkScrollability()
  }
})

onBeforeUnmount(() => {
  pauseRaf()
})

const checkScrollability = () => {
  if (carouselRef.value) {
    const { scrollLeft, scrollWidth, clientWidth } = carouselRef.value
    canScrollLeft.value = scrollLeft > 0
    canScrollRight.value = scrollLeft < scrollWidth - clientWidth - 10
  }
}

const scrollCarouselLeft = () => {
  if (carouselRef.value) {
    const targetScroll = Math.max(0, carouselRef.value.scrollLeft - cardWidth.value)
    carouselRef.value.scrollTo({ left: targetScroll, behavior: 'smooth' })
    setTimeout(checkScrollability, 500)
  }
}

const scrollCarouselRight = () => {
  if (carouselRef.value) {
    const targetScroll = carouselRef.value.scrollLeft + cardWidth.value
    carouselRef.value.scrollTo({ left: targetScroll, behavior: 'smooth' })
    setTimeout(checkScrollability, 500)
  }
}

const handleCardClose = (index) => {
  currentIndex.value = index
  checkScrollability()
}

// Enhanced mouse drag event handlers
const handleMouseDown = (e) => {
  if (!carouselRef.value) return

  // Stop any ongoing momentum scrolling
  pauseRaf()
  isAnimating.value = false
  momentum.value = 0

  isDragging.value = true
  startX.value = e.pageX
  startScrollLeft.value = carouselRef.value.scrollLeft

  document.addEventListener('mousemove', handleMouseMove)
  document.addEventListener('mouseup', handleMouseUp)

  // Prevent text selection during drag
  document.body.style.userSelect = 'none'
  carouselRef.value.style.cursor = 'grabbing'
}

// Track velocity for momentum
let lastX = 0
let lastTime = 0
let velocityX = 0

const handleMouseMove = (e) => {
  if (!isDragging.value) return

  // Calculate current velocity
  const now = Date.now()
  const dt = Math.max(1, now - lastTime)
  velocityX = (lastX - e.pageX) / dt
  lastX = e.pageX
  lastTime = now

  // Calculate how far the mouse has moved
  const x = e.pageX
  const walk = (startX.value - x) * props.scrollMultiplier

  // Scroll the container
  carouselRef.value.scrollLeft = startScrollLeft.value + walk
  checkScrollability()
}

const handleMouseUp = (e) => {
  isDragging.value = false

  document.removeEventListener('mousemove', handleMouseMove)
  document.removeEventListener('mouseup', handleMouseUp)

  document.body.style.userSelect = ''
  if (carouselRef.value) {
    carouselRef.value.style.cursor = 'grab'
  }

  // Apply momentum based on final velocity
  momentum.value = velocityX * 25

  if (Math.abs(momentum.value) > 1) {
    startMomentumScroll()
  } else {
    snapToNearestCard()
  }
}

// Touch events are now handled by useSwipe
</script>

<template>
  <div class="relative w-full">
    <!-- Carousel Container -->
    <div ref="carouselRef"
      class="flex w-full overflow-x-scroll overscroll-x-auto py-10 md:py-20 scroll-smooth hide-scrollbar cursor-grab transition-all duration-300"
      @scroll="checkScrollability" @mousedown="handleMouseDown">
      <div class="absolute right-0 z-[1000] h-auto w-[5%] overflow-hidden bg-gradient-to-l"></div>
      <div class="flex flex-row justify-start gap-4 pl-4 md:pl-0 max-w-6xl mx-auto">
        <div v-for="(item, index) in items" :key="`card-${index}`"
          class="last:pr-[5%] md:last:pr-[33%] rounded-3xl transition-all duration-500 select-none" :style="{
            opacity: 1,
            transform: 'translateY(0px)',
            transition: `all 0.5s ease-out ${0.2 * index}s`,
          }">
          <component :is="item" />
        </div>
      </div>
    </div>

    <!-- Navigation Controls -->
    <div class="gap-2 max-w-6xl mx-auto">
      <div class="flex flex-row justify-between text-end justify-self-end gap-2 mr-4">
        <button
          class="relative z-40 h-10 w-10 rounded-full bg-zinc-100 flex items-center justify-center disabled:opacity-50 transition-all duration-300 hover:bg-zinc-200 active:scale-95"
          @click="scrollCarouselLeft" :disabled="!canScrollLeft">
          <Icon name="lucide:arrow-left" class="h-5 w-5 text-zinc-500" />
        </button>
        <button
          class="relative z-40 h-10 w-10 rounded-full bg-zinc-100 flex items-center justify-center disabled:opacity-50 transition-all duration-300 hover:bg-zinc-200 active:scale-95"
          @click="scrollCarouselRight" :disabled="!canScrollRight">
          <Icon name="lucide:arrow-right" class="h-5 w-5 text-zinc-500" />
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.hide-scrollbar {
  scrollbar-width: none;
  -ms-overflow-style: none;
  -webkit-overflow-scrolling: touch;
  /* Smooth scrolling on iOS devices */
}

.hide-scrollbar::-webkit-scrollbar {
  display: none;
}

.cursor-grab {
  cursor: grab;
}

.cursor-grab:active {
  cursor: grabbing;
}

/* Add subtle hover effect to carousel */
@media (hover: hover) {
  .carousel-card:hover {
    transform: translateY(-5px);
  }
}
</style>