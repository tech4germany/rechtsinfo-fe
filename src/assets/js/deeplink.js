const deepLink = (e) => {
  e.preventDefault()
  const item = e.target
  const parent = item.dataset.parent
  const section = item.getAttribute('href')
  window.location.hash = parent
  const element = document.querySelector(section)
  setTimeout(function () {
    element.scrollIntoView()
  }, 100)
}

const init = () => {
  document.querySelectorAll('a.deep-link').forEach((item) => {
    item.addEventListener('click', deepLink)
  })
}

module.exports = init
