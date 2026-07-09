// @ts-check

/**
 * @param {string} [message]
 * @param {() => void} [onYes]
 * @param {() => void} [onNo]
 */
function Modal(message, onYes, onNo) {
  /**
   * @param {HTMLElement | HTMLStyleElement } root
   */
  function dispose(root) {
    root.childNodes.forEach(node => {
      if (node instanceof HTMLElement || node instanceof HTMLStyleElement) {
        dispose(node)
      }
    })
    root.remove()
  }

  const modal = document.createElement("div")
  modal.className = "modal"

  const content = document.createElement("div")
  content.className = "modal__content"
  modal.appendChild(content)

  const text = document.createElement("p")
  text.textContent = message ? message : "Вы уверены?"
  content.appendChild(text)

  const btnYes = document.createElement("button")
  btnYes.className = "modal-content__button modal-content__button--yes"
  btnYes.textContent = "Да"
  btnYes.onclick = () => {
    dispose(modal)
    if (typeof onYes === "function") onYes()
  }
  content.appendChild(btnYes)

  const btnNo = document.createElement("button")
  btnNo.className = "modal-content__button"
  btnNo.onclick = () => {
    dispose(modal)
    if (typeof onNo === "function") onNo()
  }
  btnNo.textContent = "Нет"
  content.appendChild(btnNo)

  const background = document.createElement("div")
  background.className = "modal__background"
  background.onclick = () => {
    dispose(modal)
    if (typeof onNo === "function") onNo()
  }
  modal.appendChild(background)

  const body = document.querySelector("body")
  body?.appendChild(modal)

  btnNo.focus()
}
