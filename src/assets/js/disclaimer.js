const disclaimer = () => {
  const sessionStorage = window.sessionStorage
  const disclaimer = document.getElementById('disclaimer')
  const disclaimerMini = document.getElementById('disclaimer-mini')
  const closeBtn = document.getElementById('close-disclaimer')
  const openBtn = document.getElementById('open-disclaimer')

  const showDisclaimer = () => {
    disclaimer.classList.remove('hidden')
    disclaimerMini.classList.add('hidden')
    sessionStorage.removeItem('hideDisclaimer')
  }

  const hideDisclaimer = () => {
    disclaimer.classList.add('hidden')
    disclaimerMini.classList.remove('hidden')
    sessionStorage.setItem('hideDisclaimer', 'true')
  }

  if (sessionStorage.getItem('hideDisclaimer')) {
    hideDisclaimer()
  } else {
    showDisclaimer()
  }

  openBtn.onclick = showDisclaimer
  closeBtn.onclick = hideDisclaimer
}

module.exports = disclaimer
