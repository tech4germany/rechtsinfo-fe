const scrollTop = () => {
  console.log('hello')
  const scrollToTopBtn = document.getElementById('scroll-to-top')
  const rootElement = document.documentElement
  const scrollOptions = { top: 0, behavior: 'smooth' }
  const motionQuery = window.matchMedia('(prefers-reduced-motion)')

  function handleScroll() {
    if (window.scrollY > window.innerHeight / 4) {
      scrollToTopBtn.classList.add('show')
    } else {
      scrollToTopBtn.classList.remove('show')
    }
  }

  if (motionQuery.matches) {
    const scrollOptions = {}
  }

  function scrollToTop() {
    //scroll to top logic
    rootElement.scrollTo(scrollOptions)
  }

  scrollToTopBtn.addEventListener('click', scrollToTop)
  document.addEventListener('scroll', handleScroll)
}

module.exports = scrollTop
