/*
 * Responds with breakpoint name (s/ns/m/l) based on Tachyons.
 */

export default () => {
  let screenSize = 's'
  const breakpoints = ['ns', 'm', 'l']
  breakpoints.forEach(breakpoint => {
    if (isVisible(breakpoint)) screenSize = breakpoint
  })
  return screenSize
}

const isVisible = breakpoint => {
  const div = document.createElement('div')
  div.className = `dn-${breakpoint}`
  document.body.appendChild(div)
  const isVisible = window.getComputedStyle(div).display !== 'block'
  document.body.removeChild(div)
  return isVisible
}
