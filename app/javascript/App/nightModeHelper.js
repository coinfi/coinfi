export default () => {
  if (window.darkModeEnabled) {
    const bodyElem = document.querySelector('body')
    bodyElem.classList.add('dark-mode')
  }
}
