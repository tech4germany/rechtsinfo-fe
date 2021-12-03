const disclaimerModal = () => {
  const sessionStorage = window.sessionStorage
  const modal = document.getElementById('disclaimer-modal')
  const modalCloseBtn = document.getElementById('close-disclaimer-modal')
  modal.open()
  modalCloseBtn.onclick = () => modal.close()

}

module.exports = disclaimerModal
