<template>
    
  <footer class="bg-gray-50 py-16">
    <div class="container mx-auto px-4">
      <div class="max-w-6xl mx-auto">
        <div class="grid md:grid-cols-4 gap-8">
          <div>
            <div class="flex items-center mb-6">
              <div class="bg-blue-100 p-2 rounded-full">
                <Icon name="lucide:zap" class="h-6 w-6 text-blue-600" />
              </div>
              <span class="ml-3 text-lg font-semibold text-navy-900">AI Starter Kit</span>
            </div>
            <p class="text-gray-600 text-sm mb-6">
              A modern starter kit for building AI-powered applications with Nuxt 3, Supabase, and Shadcn UI
            </p>
            <div class="flex space-x-4">
              <a href="#" class="text-gray-400 hover:text-blue-600 transition-colors bg-white p-2 rounded-full">
                <Icon name="lucide:github" class="w-5 h-5" />
              </a>
              <a href="#" class="text-gray-400 hover:text-blue-600 transition-colors bg-white p-2 rounded-full">
                <Icon name="lucide:twitter" class="w-5 h-5" />
              </a>
              <a href="#" class="text-gray-400 hover:text-blue-600 transition-colors bg-white p-2 rounded-full">
                <Icon name="lucide:linkedin" class="w-5 h-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h4 class="font-semibold text-navy-900 mb-4">Resources</h4>
            <ul class="space-y-3">
              <li><a href="#" class="text-gray-600 hover:text-blue-600 transition-colors">Documentation</a></li>
              <li><a href="#" class="text-gray-600 hover:text-blue-600 transition-colors">Components</a></li>
              <li><a href="#" class="text-gray-600 hover:text-blue-600 transition-colors">Examples</a></li>
              <li><a href="#" class="text-gray-600 hover:text-blue-600 transition-colors">GitHub</a></li>
            </ul>
          </div>
          
          <div>
            <h4 class="font-semibold text-navy-900 mb-4">Technologies</h4>
            <ul class="space-y-3">
              <li><a href="https://nuxt.com" target="_blank" class="text-gray-600 hover:text-blue-600 transition-colors">Nuxt 3</a></li>
              <li><a href="https://supabase.com" target="_blank" class="text-gray-600 hover:text-blue-600 transition-colors">Supabase</a></li>
              <li><a href="https://tailwindcss.com" target="_blank" class="text-gray-600 hover:text-blue-600 transition-colors">Tailwind CSS</a></li>
              <li><a href="https://ui.shadcn.com" target="_blank" class="text-gray-600 hover:text-blue-600 transition-colors">Shadcn UI</a></li>
            </ul>
          </div>
          
          <div>
            <h4 class="font-semibold text-navy-900 mb-4">Stay Updated</h4>
            <p class="text-gray-600 text-sm mb-4">
              Subscribe to our newsletter for updates, new features, and releases
            </p>
            <div class="flex">
              <Input placeholder="Email address" class="rounded-l-full rounded-r-none" />
              <Button class="rounded-l-none rounded-r-full bg-blue-600 hover:bg-blue-700 text-white">
                Subscribe
              </Button>
            </div>
          </div>
        </div>
        
        <div class="border-t border-gray-200 mt-16 pt-8 text-center text-gray-500 text-sm">
          <p>© 2025 AI Starter Kit. All rights reserved.</p>
        </div>
      </div>
    </div>
  </footer>
</template>
<script setup>
</script>