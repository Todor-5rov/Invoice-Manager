<template>
  <div :id="id" class="absolute inset-0 z-0" />
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { type Container, type Engine, tsParticles } from '@tsparticles/engine'
import { loadSlim } from '@tsparticles/slim'

const props = defineProps<{
  id?: string
  density?: number
}>()

onMounted(async () => {
  await loadSlim(tsParticles)

  await tsParticles.load({
    id: props.id || 'tsparticles',
    options: {
      fpsLimit: 120,
      particles: {
        number: {
          value: props.density || 80,
          density: {
            enable: true,
            width: 1920,
            height: 1080
          }
        },
        color: {
          value: '#ffffff'
        },
        shape: {
          type: 'circle'
        },
        opacity: {
          value: { min: 0.1, max: 0.5 },
          animation: {
            enable: true,
            speed: 3,
            sync: false
          }
        },
        size: {
          value: { min: 1, max: 3 },
          animation: {
            enable: true,
            speed: 2,
            sync: false
          }
        },
        links: {
          enable: false
        },
        move: {
          enable: true,
          direction: 'none',
          outModes: {
            default: 'out'
          },
          random: true,
          speed: 0.1,
          straight: false
        }
      },
      interactivity: {
        events: {
          onHover: {
            enable: true,
            mode: 'bubble'
          },
          resize: {
            enable: true,
            delay: 0.5
          }
        },
        modes: {
          bubble: {
            distance: 200,
            size: 2,
            duration: 0.4
          }
        }
      },
      detectRetina: true
    }
  })
})
</script> 