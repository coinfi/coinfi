import 'babel-polyfill'

import 'jquery' // jQuery has been configured to be globally available

// Non-React code
import '../modules/navigation'

// React
import '../App/startup'

import scrollHelper from '../App/scrollHelper'
import getScreenSize from '../App/lib/screenSize'
import debounce from 'debounce'

const setScreenSize = () => {
  window.screenSize = getScreenSize()
  window.isMobile = !['m', 'l'].includes(window.screenSize)
  window.isTablet = window.screenSize === 'm'
  window.isDesktop = window.screenSize === 'l'
}

document.addEventListener('DOMContentLoaded', () => {
  setScreenSize()
})

window.addEventListener('resize', debounce(setScreenSize, 400))
window.addEventListener('resize', debounce(scrollHelper, 400))
