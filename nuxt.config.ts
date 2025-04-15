import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  modules: [
    "@nuxtjs/supabase",
    "@nuxt/fonts",
    "@nuxt/image",
    "@nuxt/icon",
    "shadcn-nuxt",
    "@nuxtjs/seo",
    "lenis/nuxt",
  ],

  // Add runtime config for Mistral API
  runtimeConfig: {
    public: {
      mistralApiKey: "7TeDUaQeSy0PODoBFLUVJrIucqOOvXCp",
    },
  },

  lenis: {
    options: {
      root: true,
      smooth: true,
      smoothWheel: true,
      autoRaf: true,
    },
  },

  css: ["~/assets/css/tailwind.css"],

  vite: {
    plugins: [tailwindcss()],
  },

  app: {
    pageTransition: { name: "fade" },
  },

  components: [
    {
      path: "~/components",
      pathPrefix: false,
    },
  ],

  // Auto-import the toast function globally
  imports: {
    imports: [
      {
        from: "vue-sonner",
        name: "toast",
      },
    ],
  },

  shadcn: {
    prefix: "",
    componentDir: "./components/ui",
  },

  supabase: {
    url: "https://scidamehzgohvbzojhol.supabase.co",
    key: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNjaWRhbWVoemdvaHZiem9qaG9sIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ2NjAzMzYsImV4cCI6MjA2MDIzNjMzNn0.M4zgXw-8JjMx_smQpn8CAfUrXSOpGnjhYE997KXBblQ",
    serviceKey:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNjaWRhbWVoemdvaHZiem9qaG9sIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NDY2MDMzNiwiZXhwIjoyMDYwMjM2MzM2fQ.XRLhb-PxzSyfWbdXWNuUJhIrgv7UjI779ThjxOOuxnE",
    redirectOptions: {
      login: "/login",
      callback: "/confirm",
      exclude: ["/", "/admin/*"],
    },
  },

  compatibilityDate: "2025-04-06",
});
