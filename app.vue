<template>
  <vue-lenis root>
    <div class="flex min-h-screen flex-col">
      <div class="flex-1">
        <NuxtLayout>
          <NuxtPage />
        </NuxtLayout>
      </div>
    </div>
  </vue-lenis>
  <ClientOnly>
    <Toaster class="pointer-events-auto" />
  </ClientOnly>
</template>
<script setup>
import { Toaster } from "@/components/ui/sonner";

// Add site-wide meta tags for SEO
useHead({
  title: "AI Starter Kit - Modern Development with Nuxt & Supabase",
  meta: [
    {
      name: "description",
      content:
        "Jump-start your AI applications with this powerful starter kit featuring Nuxt 3, Supabase, Shadcn UI components, and stunning visual effects.",
    },
    { name: "viewport", content: "width=device-width, initial-scale=1" },
    { name: "robots", content: "index, follow" },
    { name: "og:type", content: "website" },
    {
      name: "og:title",
      content: "AI Starter Kit - Modern Development with Nuxt & Supabase",
    },
    {
      name: "og:description",
      content:
        "Jump-start your AI applications with this powerful starter kit featuring Nuxt 3, Supabase, Shadcn UI components, and stunning visual effects.",
    },
    { name: "og:image", content: "/og-image.jpg" },
    { name: "twitter:card", content: "summary_large_image" },
  ],
  link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }],
});
</script>
<style>
body {
  font-family: Nunito, serif;
  font-weight: 600;
}

.font-courier {
  font-family: Courier Prime;
}

/* Fade page transition */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
