<template>
  <div class="min-h-screen bg-background font-sans antialiased">
    <Header />
    <main class="relative flex min-h-screen flex-col pt-20">
      <slot />
    </main>
    <Toaster />
  </div>
</template>

<script setup>
import { Toaster } from "vue-hot-toast";

defineOptions({
  name: "DefaultLayout",
});
</script>
