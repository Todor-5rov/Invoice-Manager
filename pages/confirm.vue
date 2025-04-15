<script setup>
const user = useSupabaseUser()

// Get redirect path from cookies
const redirectPath = useCookie(`sb-redirect-path`).value

const error = ref(null)
watch(
  user,
  () => {
    if (user.value) {
      // Clear cookie
      useCookie(`sb-redirect-path`).value = null
      // Redirect to path
      return navigateTo(redirectPath || '/')
    }
  },
  { immediate: true },
)
</script>

<template>
  <div class="flex min-h-screen items-center justify-center">
    <div v-if="error" class="text-center">
      <h2 class="text-2xl font-semibold text-red-600">
        Грешка при автентикация
      </h2>
      <p class="mt-2 text-gray-600">{{ error?.message }}</p>
      <NuxtLink to="/auth/login" class="mt-4 hover:underline">
        Върнете се към входа
      </NuxtLink>
    </div>
    <div v-else class="text-center">
      <h2 class="text-2xl font-semibold text-gray-900">
        Завършване на входа...
      </h2>
      <p class="mt-2 text-gray-600">Моля, изчакайте докато ви пренасочим.</p>
    </div>
  </div>
</template>
