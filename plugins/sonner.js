import { toast } from 'vue-sonner'

export default defineNuxtPlugin((nuxtApp) => {
  // Make toast globally available
  nuxtApp.vueApp.config.globalProperties.$toast = toast
  
  // Also add it to window for direct access
  if (process.client) {
    window.toast = toast
  }
  
  // Still provide it for compatibility
  return {
    provide: {
      toast
    }
  }
}) 