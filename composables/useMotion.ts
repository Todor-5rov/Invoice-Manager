import { useIntersectionObserver } from '@vueuse/core'
import { type Directive } from 'vue'

export const vMotionSlideVisibleOnceBottom: Directive = {
  mounted(el) {
    el.style.opacity = '0'
    el.style.transform = 'translateY(50px)'
    el.style.transition = 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)'
    
    const { stop } = useIntersectionObserver(
      el,
      ([{ isIntersecting }]) => {
        if (isIntersecting) {
          el.style.opacity = '1'
          el.style.transform = 'translateY(0)'
          if (el.style.getPropertyValue('--motion-delay')) {
            el.style.transitionDelay = el.style.getPropertyValue('--motion-delay')
          }
          stop()
        }
      },
      { threshold: 0.1 }
    )
  }
} 