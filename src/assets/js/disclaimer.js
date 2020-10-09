const disclaimer = () => {
  const sessionStorage = window.sessionStorage
  const disclaimer = document.getElementById('disclaimer')
  const btn = document.getElementById('disclaimer-button')

  if (sessionStorage.getItem('hideDisclaimer')) {
    disclaimer.classList.add('hidden')
  }

  btn.onclick = () => {
    disclaimer.classList.toggle('hidden')
    sessionStorage.setItem('hideDisclaimer', 'true')
  }
}
module.exports = disclaimer
