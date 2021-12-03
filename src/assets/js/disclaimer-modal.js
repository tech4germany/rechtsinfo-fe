const disclaimerModal = () => {
  const sessionStorage = window.sessionStorage
  const modal = document.getElementById('disclaimer-modal')
  const modalCloseBtn = document.getElementById('close-disclaimer-modal')

  if (!sessionStorage.getItem('hideDisclaimer')) {
    modal.open()
    modalCloseBtn.onclick = () => {
      sessionStorage.setItem('hideDisclaimer', 'true')
      modal.close()
    }
  }
}

module.exports = disclaimerModal
