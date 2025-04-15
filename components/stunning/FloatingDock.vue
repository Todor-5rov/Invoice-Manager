<!-- FloatingDock.vue -->
<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useScroll } from '@vueuse/core'

const props = defineProps({
  items: {
    type: Array,
    required: true
  },
  desktopClassName: {
    type: String,
    default: ''
  },
  mobileClassName: {
    type: String,
    default: ''
  }
})

// Scroll handling
const isVisible = ref(true)
const lastScrollY = ref(0)
const { y: scrollY } = useScroll(window)

const handleScroll = () => {
  const currentScrollY = scrollY.value
  isVisible.value = lastScrollY.value > currentScrollY || currentScrollY < 100
  lastScrollY.value = currentScrollY
}

// Watch scroll position
watch(scrollY, handleScroll)
</script>

<template>
  <div>
    <!-- Universal Dock (Desktop & Mobile) -->
    <div
      :class="[
        'mx-auto flex h-12 md:h-16 rounded-xl md:rounded-2xl bg-white opacity-5 dark:bg-neutral-900/5 backdrop-blur-xl border border-white/10 dark:border-neutral-800/10 shadow-lg shadow-black/5 dark:shadow-white/5 px-2 md:px-4 transition-all duration-300',
        isVisible ? 'translate-y-0 opacity-100' : '-translate-y-20 opacity-0',
        'w-[calc(100%-2rem)] md:max-w-none',
        desktopClassName
      ]"
    >
      <div class="dock-container">
        <!-- Logo -->
        <!-- <div class="flex items-center mr-3 md:mr-8">
          <NuxtLink to="/" class="flex items-center">
            <img src="/logo.png" alt="Empower Studio" class="h-5 md:h-8 w-auto" />
          </NuxtLink>
        </div> -->

        <!-- Divider -->
        <!-- <div class="h-6 md:h-8 w-px bg-neutral-200 dark:bg-neutral-800 mr-3 md:mr-8"></div> -->

        <!-- Navigation Items -->
        <div class="flex items-center gap-1 md:gap-2 overflow-visible">
          <NuxtLink
            v-for="(item, index) in items"
            :key="item.title"
            :to="item.href"
            class="dock-item group"
            :class="{ 'cta-item': index === items.length - 1 }"
          >
            <div class="dock-icon-wrapper">
              <div class="dock-icon" :class="{ 'cta-icon': index === items.length - 1 }">
                <Icon :name="item.icon" class="w-4 h-4 md:w-5 md:h-5" :class="[
                  index === items.length - 1 
                    ? 'text-white dark:text-white' 
                    : 'text-neutral-600 dark:text-neutral-400'
                ]" />
              </div>
              <span class="dock-text">{{ item.title }}</span>
            </div>
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.dock-container {
  display: flex;
  align-items: center;
  width: 100%;
  height: 100%;
  padding: 4px;
  overflow: visible;
}

@media (min-width: 768px) {
  .dock-container {
    padding: 8px;
  }
}

.dock-item {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: visible;
}

.dock-icon-wrapper {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  overflow: visible;
}

.dock-icon {
  position: relative;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgb(255 255 255 / 0.05);
  backdrop-filter: blur(8px);
  border: 1px solid rgb(255 255 255 / 0.1);
  border-radius: 9999px;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  z-index: 10;
}

@media (min-width: 768px) {
  .dock-icon {
    width: 32px;
    height: 32px;
  }
}

.dark .dock-icon {
  background: rgb(0 0 0 / 0.2);
  border-color: rgb(255 255 255 / 0.1);
}

/* Hover effect logic */
@media (min-width: 768px) {
  .dock-container:hover .dock-item .dock-icon {
    transform: scale(0.9);
  }

  .dock-item:hover .dock-icon {
    transform: scale(1.15) !important;
  }

  .dock-item:hover ~ .dock-item .dock-icon {
    transform: scale(0.9);
  }
}

/* Hover background effect */
.dock-item:hover .dock-icon {
  background: rgb(255 255 255 / 0.1);
  border-color: rgb(255 255 255 / 0.2);
}

.dark .dock-item:hover .dock-icon {
  background: rgb(255 255 255 / 0.05);
  border-color: rgb(255 255 255 / 0.2);
}

/* Hide scrollbar but keep functionality */
.hide-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.hide-scrollbar::-webkit-scrollbar {
  display: none;
}

/* Text styling */
.dock-text {
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  font-size: 0.75rem;
  font-weight: 500;
  color: rgb(64 64 64);
  opacity: 0;
  white-space: nowrap;
  transition: all 0.2s ease;
  pointer-events: none;
  margin-top: 0.5rem;
  background: rgb(255 255 255 / 0.9);
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.dark .dock-text {
  color: rgb(229 231 235);
  background: rgb(0 0 0 / 0.9);
}

.dock-item:hover .dock-text {
  opacity: 1;
}

/* CTA styling */
.cta-icon {
  background: rgb(0 0 0 / 0.8) !important;
  border-color: rgb(255 255 255 / 0.2) !important;
}

.dark .cta-icon {
  background: rgb(0 0 0 / 0.8) !important;
  border-color: rgb(255 255 255 / 0.2) !important;
}

.cta-icon:hover {
  background: rgb(0 0 0 / 0.9) !important;
  border-color: rgb(255 255 255 / 0.3) !important;
}
</style> 