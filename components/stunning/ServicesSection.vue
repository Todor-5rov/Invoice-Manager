<template>
  <section class="relative py-24 overflow-hidden">
    <!-- Background Pattern -->
    <div class="absolute inset-0 bg-grid-neutral-100/25 dark:bg-grid-neutral-900/25 bg-neutral-50 dark:bg-neutral-950" />
    <div class="absolute inset-0 bg-gradient-to-t from-neutral-50 via-neutral-50/80 to-neutral-50/0 dark:from-neutral-950 dark:via-neutral-950/80 dark:to-neutral-950/0" />
    
    <div class="container relative mx-auto px-4 md:px-0 max-w-6xl">
      <!-- Section Header -->
      <div class="max-w-3xl mx-auto text-center mb-20">
        <h2 class="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-neutral-950 to-neutral-500 dark:from-white dark:to-neutral-400">
          Нашите Услуги
        </h2>
        <p class="text-lg md:text-xl text-neutral-600 dark:text-neutral-400">
          Изграждаме персонализирани решения, които помагат на вашия бизнес да се развива ефективно.
        </p>
      </div>

      <!-- Services Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        
        <!-- AI Workflows -->
        <div 
          class="group relative p-8 rounded-2xl bg-white dark:bg-black border border-neutral-200/50 dark:border-neutral-800/50 shadow-lg hover:shadow-xl transition-all duration-300 card-hover"
          @mousemove="cardHover"
        >
          <div class="absolute inset-0 rounded-2xl bg-gradient-to-r from-neutral-100/50 to-neutral-50/50 dark:from-neutral-800/10 dark:to-neutral-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          <div class="relative">
            <div class="mb-6 inline-block p-4 rounded-xl bg-neutral-100 dark:bg-neutral-800">
              <Icon name="lucide:cpu" class="h-8 w-8 text-neutral-900 dark:text-white" />
            </div>
            
            <h3 class="text-2xl font-bold mb-4">AI Работни Процеси</h3>
            <p class="text-neutral-600 dark:text-neutral-400 mb-6">
              Автоматизирайте повтарящи се задачи и оптимизирайте процесите си с помощта на AI.
            </p>
            
            <ul class="space-y-3 mb-8">
              <li class="flex items-center text-sm text-neutral-600 dark:text-neutral-400">
                <Icon name="lucide:check" class="h-5 w-5 mr-2 text-emerald-500" />
                Автоматизация на процеси
              </li>
              <li class="flex items-center text-sm text-neutral-600 dark:text-neutral-400">
                <Icon name="lucide:check" class="h-5 w-5 mr-2 text-emerald-500" />
                Интелигентни интеграции
              </li>
              <li class="flex items-center text-sm text-neutral-600 dark:text-neutral-400">
                <Icon name="lucide:check" class="h-5 w-5 mr-2 text-emerald-500" />
                Персонализирани AI модели
              </li>
            </ul>
            
            <!-- <Button variant="link" class="group/btn">
              Learn More
              <Icon name="lucide:arrow-right" class="h-4 w-4 ml-2 transition-transform group-hover/btn:translate-x-1" />
            </Button> -->
          </div>
        </div>
        
        <!-- Frontend Development -->
        <div 
          class="group relative p-8 rounded-2xl bg-white dark:bg-black border border-neutral-200/50 dark:border-neutral-800/50 shadow-lg hover:shadow-xl transition-all duration-300 card-hover"
          @mousemove="cardHover"
        >
          <div class="absolute inset-0 rounded-2xl bg-gradient-to-r from-neutral-100/50 to-neutral-50/50 dark:from-neutral-800/10 dark:to-neutral-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          <div class="relative">
            <div class="mb-6 inline-block p-4 rounded-xl bg-neutral-100 dark:bg-neutral-800">
              <Icon name="lucide:layout" class="h-8 w-8 text-neutral-900 dark:text-white" />
            </div>
            
            <h3 class="text-2xl font-bold mb-4">Frontend Разработка</h3>
            <p class="text-neutral-600 dark:text-neutral-400 mb-6">
              Красиви, отзивчиви интерфейси, които вашите потребители ще харесат. Изградени с модерни технологии и добри практики.
            </p>
            
            <ul class="space-y-3 mb-8">
              <li class="flex items-center text-sm text-neutral-600 dark:text-neutral-400">
                <Icon name="lucide:check" class="h-5 w-5 mr-2 text-emerald-500" />
                Отзивчив дизайн
              </li>
              <li class="flex items-center text-sm text-neutral-600 dark:text-neutral-400">
                <Icon name="lucide:check" class="h-5 w-5 mr-2 text-emerald-500" />
                Модерни фреймуърки
              </li>
              <li class="flex items-center text-sm text-neutral-600 dark:text-neutral-400">
                <Icon name="lucide:check" class="h-5 w-5 mr-2 text-emerald-500" />
                Оптимизирана производителност
              </li>
            </ul>
            
            <!-- <Button variant="link" class="group/btn">
              Learn More
              <Icon name="lucide:arrow-right" class="h-4 w-4 ml-2 transition-transform group-hover/btn:translate-x-1" />
            </Button> -->
          </div>
        </div>


        <!-- Data Analytics -->
        <div 
          class="group relative p-8 rounded-2xl bg-white dark:bg-black border border-neutral-200/50 dark:border-neutral-800/50 shadow-lg hover:shadow-xl transition-all duration-300 card-hover"
          @mousemove="cardHover"
        >
          <div class="absolute inset-0 rounded-2xl bg-gradient-to-r from-neutral-100/50 to-neutral-50/50 dark:from-neutral-800/10 dark:to-neutral-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          <div class="relative">
            <div class="mb-6 inline-block p-4 rounded-xl bg-neutral-100 dark:bg-neutral-800">
              <Icon name="lucide:bar-chart" class="h-8 w-8 text-neutral-900 dark:text-white" />
            </div>
            
            <h3 class="text-2xl font-bold mb-4">Данни и Анализи</h3>
            <p class="text-neutral-600 dark:text-neutral-400 mb-6">
              Превърнете данните си в практически идеи с мощни инструменти за анализ и визуализация.
            </p>
            
            <ul class="space-y-3 mb-8">
              <li class="flex items-center text-sm text-neutral-600 dark:text-neutral-400">
                <Icon name="lucide:check" class="h-5 w-5 mr-2 text-emerald-500" />
                Табла в реално време
              </li>
              <li class="flex items-center text-sm text-neutral-600 dark:text-neutral-400">
                <Icon name="lucide:check" class="h-5 w-5 mr-2 text-emerald-500" />
                Персонализирани отчети
              </li>
              <li class="flex items-center text-sm text-neutral-600 dark:text-neutral-400">
                <Icon name="lucide:check" class="h-5 w-5 mr-2 text-emerald-500" />
                Прогнозни анализи
              </li>
            </ul>
            
            <!-- <Button variant="link" class="group/btn">
              Learn More
              <Icon name="lucide:arrow-right" class="h-4 w-4 ml-2 transition-transform group-hover/btn:translate-x-1" />
            </Button> -->
          </div>
        </div>
      </div>

      <!-- CTA Section -->
      <div class="mt-20 text-center">
        <NuxtLink to="#consultation">
          <Button size="lg" variant="default" class="group rounded-full">
            Планирайте консултация
            <Icon name="lucide:arrow-right" class="h-4 w-4 ml-2 transition-transform group-hover:translate-x-1" />
          </Button>
        </NuxtLink>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
// Card hover effect
const cardHover = (event: MouseEvent) => {
  const card = event.currentTarget as HTMLElement
  const rect = card.getBoundingClientRect()
  const x = event.clientX - rect.left
  const y = event.clientY - rect.top

  card.style.setProperty('--mouse-x', `${x}px`)
  card.style.setProperty('--mouse-y', `${y}px`)
}
</script>

<style scoped>
.bg-grid-neutral-100\/25 {
  background-image: linear-gradient(to right, rgba(0,0,0,0.05) 1px, transparent 1px),
                    linear-gradient(to bottom, rgba(0,0,0,0.05) 1px, transparent 1px);
  background-size: 24px 24px;
}

.bg-grid-neutral-900\/25 {
  background-image: linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px),
                    linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px);
  background-size: 24px 24px;
}

.card-hover {
  position: relative;
  overflow: hidden;
}

.card-hover::before {
  content: '';
  position: absolute;
  width: 150px;
  height: 150px;
  background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%);
  transform: translate(-50%, -50%);
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.3s;
}

.card-hover:hover::before {
  opacity: 1;
  left: var(--mouse-x);
  top: var(--mouse-y);
}
</style> 