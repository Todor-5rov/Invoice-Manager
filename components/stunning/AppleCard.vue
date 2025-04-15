<script setup>
import { ref, inject, onMounted, onBeforeUnmount, watch } from 'vue'
import { useElementSize } from '@vueuse/core'
import { useClickOutside } from '~/composables/useClickOutside'

const props = defineProps({
  card: {
    type: Object,
    required: true
  },
  index: {
    type: Number,
    required: true
  },
  layout: {
    type: Boolean,
    default: false
  }
})

const open = ref(false)
const containerRef = ref(null)
const carousel = inject('carousel')

// Handle click outside
useClickOutside(containerRef, () => {
  handleClose()
})

// Handle escape key
const onKeyDown = (event) => {
  if (event.key === 'Escape') {
    handleClose()
  }
}

watch(open, (newValue) => {
  if (newValue) {
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKeyDown)
  } else {
    document.body.style.overflow = 'auto'
    window.removeEventListener('keydown', onKeyDown)
  }
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKeyDown)
  document.body.style.overflow = 'auto'
})

const handleOpen = () => {
  open.value = true
}

const handleClose = () => {
  open.value = false
  if (carousel) {
    carousel.onCardClose(props.index)
  }
}
</script>

<template>
  <!-- Card Modal -->
  <Teleport to="body">
    <Transition name="modal-fade">
      <div v-if="open" class="fixed inset-0 h-screen z-50 overflow-hidden flex items-center justify-center">
        <!-- Backdrop with more elegant blur effect -->
        <div 
          class="bg-black/60 backdrop-blur-md h-full w-full fixed inset-0 transition-opacity duration-500" 
          @click="handleClose"
        ></div>
        
        <!-- Modal Content with Scale Animation -->
        <Transition name="modal-scale">
          <div 
            v-if="open"
            ref="containerRef"
            class="max-w-5xl w-[95%] mx-auto bg-[#f5f5f7] dark:bg-[#1d1d1f] z-[60] my-4 relative overflow-hidden shadow-2xl rounded-2xl"
          >
            <!-- Hero Image Section -->
            <div class="relative h-80 md:h-96 w-full overflow-hidden">
              <div class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent z-10"></div>
              <NuxtImg 
                :src="card.src" 
                :alt="card.title" 
                format="webp"
                class="w-full h-full object-cover object-center"
                loading="eager"
              />
              
              <!-- Floating Close Button -->
              <button
                class="absolute top-6 right-6 h-10 w-10 bg-black/20 backdrop-blur-md hover:bg-black/40 dark:bg-white dark:hover:bg-white rounded-full flex items-center justify-center transition-all duration-300 z-20"
                @click="handleClose"
              >
                <Icon name="lucide:x" class="h-5 w-5 text-white" />
              </button>
            </div>
            
            <!-- Content Section -->
            <div class="p-8 md:p-12">
              <!-- Header with improved typography -->
              <div class="mb-8">
                <p class="text-sm font-medium text-zinc-500 dark:text-zinc-400 tracking-wide uppercase mb-2">
                  {{ card.category }}
                </p>
                <h2 class="text-3xl md:text-5xl font-semibold text-zinc-900 dark:text-white tracking-tight leading-tight">
                  {{ card.title }}
                </h2>
              </div>
              
              <!-- Main Content -->
              <div class="prose prose-zinc dark:prose-invert max-w-none">
                <slot name="content" :card="card">
                  <component :is="card.content" />
                </slot>
              </div>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
  
  <!-- Card Thumbnail -->
  <button
    @click="handleOpen"
    class="rounded-3xl bg-zinc-100 dark:bg-neutral-900 h-80 w-56 md:h-[40rem] md:w-96 overflow-hidden flex flex-col items-start justify-start relative z-10 shadow-md hover:shadow-xl transition-shadow duration-300"
  >
    <!-- Gradient Overlay -->
    <div class="absolute h-full top-0 inset-x-0 bg-gradient-to-b from-black/50 via-transparent to-transparent z-30 pointer-events-none" />
    
    <!-- Card Content -->
    <div class="relative z-40 p-8">
      <p class="text-white text-sm md:text-base font-medium font-sans text-left tracking-wide">
        {{ card.category }}
      </p>
      <p class="text-white text-xl md:text-3xl font-semibold max-w-xs text-left mt-2 leading-tight">
        {{ card.title }}
      </p>
    </div>
    
    <!-- Card Image -->
    <div class="absolute inset-0 z-10">
      <NuxtImg 
        :src="card.src" 
        :alt="card.title" 
        format="webp"
        class="object-cover w-full h-full transition duration-300 grayscale hover:grayscale-0 hover:scale-105"
        loading="lazy"
      />
    </div>
  </button>
</template>

<style scoped>
/* Modal fade animation */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.4s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

/* Modal scale animation */
.modal-scale-enter-active,
.modal-scale-leave-active {
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.modal-scale-enter-from,
.modal-scale-leave-to {
  opacity: 0;
  transform: scale(0.95);
}

/* Card hover effects */
button:hover .object-cover {
  filter: contrast(1.05);
}
</style> 