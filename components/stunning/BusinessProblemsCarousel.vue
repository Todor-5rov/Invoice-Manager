<script setup>
import { Card, Carousel } from '~/components/stunning/Apple'
import { ref, h } from 'vue'

// Data for the carousel
const carouselData = [
  {
    category: "Предизвикателство",
    title: "Ограничен човешки ресурс за растеж",
    src: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200&auto=format&fit=crop&q=80",
    content: h('div', { class: 'bg-[#F5F5F7] dark:bg-neutral-800 p-8 md:p-14 rounded-3xl mb-4' }, [
      h('p', { class: 'text-neutral-600 dark:text-neutral-400 text-base md:text-2xl font-sans max-w-3xl mx-auto' }, [
        h('span', { class: 'font-bold text-neutral-700 dark:text-neutral-200' }, 'Екипът ви е претоварен и неефективен. '),
        'Служителите ви прекарват ценно време в повторяеми дейности вместо да се фокусират върху обслужване на клиенти и развитие на бизнеса. Това води до по-бавен растеж и пропуснати възможности.'
      ])
    ])
  },
  {
    category: "Предизвикателство",
    title: "Липса на прозрачност",
    src: "https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?w=1200&auto=format&fit=crop&q=80",
    content: h('div', { class: 'bg-[#F5F5F7] dark:bg-neutral-800 p-8 md:p-14 rounded-3xl mb-4' }, [
      h('p', { class: 'text-neutral-600 dark:text-neutral-400 text-base md:text-2xl font-sans max-w-3xl mx-auto' }, [
        h('span', { class: 'font-bold text-neutral-700 dark:text-neutral-200' }, 'Губите ценна информация и нямате яснота. '),
        'Проектите се забавят, сроковете не се спазват и нямате яснота за причините. Липсва ви ясна картина за работните процеси и местата, където се губи ефективност.'
      ])
    ])
  },
  {
    category: "Предизвикателство",
    title: "Времеемки ръчни процеси",
    src: "https://images.unsplash.com/photo-1586473219010-2ffc57b0d282?w=1200&auto=format&fit=crop&q=80",
    content: h('div', { class: 'bg-[#F5F5F7] dark:bg-neutral-800 p-8 md:p-14 rounded-3xl mb-4' }, [
      h('p', { class: 'text-neutral-600 dark:text-neutral-400 text-base md:text-2xl font-sans max-w-3xl mx-auto' }, [
        h('span', { class: 'font-bold text-neutral-700 dark:text-neutral-200' }, 'Рутинната работа поглъща ресурсите ви. '),
        'Административната работа отнема часове, които биха могли да се инвестират в обслужване на клиенти и развитие на бизнеса. Процеси, които биха могли да бъдат автоматизирани, все още се извършват ръчно.'
      ])
    ])
  },
  {
    category: "Предизвикателство",
    title: "Информационно претоварване",
    src: "https://images.unsplash.com/photo-1618044619888-009e412ff12a?w=1200&auto=format&fit=crop&q=80",
    content: h('div', { class: 'bg-[#F5F5F7] dark:bg-neutral-800 p-8 md:p-14 rounded-3xl mb-4' }, [
      h('p', { class: 'text-neutral-600 dark:text-neutral-400 text-base md:text-2xl font-sans max-w-3xl mx-auto' }, [
        h('span', { class: 'font-bold text-neutral-700 dark:text-neutral-200' }, 'Данни без анализ и действие. '),
        'Имате огромни количества данни, но липсват инструменти за анализ и извличане на полезни изводи. Ценната информация остава заключена в таблици и системи, без да подкрепя вземането на решения.'
      ])
    ])
  },
  {
    category: "Предизвикателство",
    title: "Несъгласувани работни процеси",
    src: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&auto=format&fit=crop&q=80",
    content: h('div', { class: 'bg-[#F5F5F7] dark:bg-neutral-800 p-8 md:p-14 rounded-3xl mb-4' }, [
      h('p', { class: 'text-neutral-600 dark:text-neutral-400 text-base md:text-2xl font-sans max-w-3xl mx-auto' }, [
        h('span', { class: 'font-bold text-neutral-700 dark:text-neutral-200' }, 'Фрагментирани системи и дублиране на усилия. '),
        'Различните отдели използват различни системи, което води до дублиране на усилия и грешки в комуникацията. Липсата на интеграция между системите създава информационни силози и неефективности.'
      ])
    ])
  },
  {
    category: "Предизвикателство",
    title: "Непоследователно обслужване",
    src: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=1200&auto=format&fit=crop&q=80",
    content: h('div', { class: 'bg-[#F5F5F7] dark:bg-neutral-800 p-8 md:p-14 rounded-3xl mb-4' }, [
      h('p', { class: 'text-neutral-600 dark:text-neutral-400 text-base md:text-2xl font-sans max-w-3xl mx-auto' }, [
        h('span', { class: 'font-bold text-neutral-700 dark:text-neutral-200' }, 'Променливо качество на обслужването. '),
        'Клиентското преживяване варира значително в зависимост от служителя и момента на контакт с вашия бизнес. Без стандартизирани процеси, качеството на обслужване зависи от индивидуалния подход и настроение.'
      ])
    ])
  }
]

// Generate card components
const cards = carouselData.map((card, index) => {
  return h(Card, { card, index })
})
</script>

<template>
  <div class="w-full h-full py-20 bg-white dark:bg-neutral-950">
    <h2 class="max-w-6xl pl-4 md:pl-0 mx-auto text-xl md:text-4xl font-bold text-neutral-800 dark:text-neutral-200 font-sans">
      Вашият бизнес расте, но системите ви не успяват да го следват
    </h2>
    <Carousel :items="cards" />
  </div>
</template> 