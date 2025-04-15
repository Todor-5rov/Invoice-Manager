export const useScrollTo = () => {
  const scrollTo = (hash: string) => {
    const el = document.querySelector(hash)
    if (el) {
      el.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
        inline: 'nearest'
      })
    }
  }

  return {
    scrollTo
  }
} 