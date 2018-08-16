export const toggleOverlay = (element) => {
  $('body').toggleClass('overflow-hidden')
  const e = $(element)
  let c = ['active', 'visible']
  let delay = 1
  if (e.hasClass('active')) {
    c.reverse()
    delay = 750
  }
  e.toggleClass(c[0])
  setTimeout(() => {
    e.toggleClass(c[1])
  }, delay)
  return e
}

$(document).ready(() => {
  $('.mobile-nav-toggle').on('click', () => toggleOverlay($('#mobile-nav')))

  $('.search-toggle').on('click', () => {
    toggleOverlay($('#global-coin-search'))
      .find('input[type="text"]')
      .first()
      .focus()
  })

  $('.registration-form-wrapper form').on('submit', function() {
    $(this)
      .find('input[type=submit]')
      .prop('disabled', true)
      .text('Processing...')
  })

  if (document.querySelector('.register-set-password') !== null)
    fbq('track', 'Lead', {})
})

export const darkModeFeature = () => {
  const darkModeBtn = document.querySelector('.trigger-dark-mode')

  var nightly = new Nightly({
    body: '#222',
  })

  darkModeBtn.addEventListener('click', function(event) {
    window.darkModeEnabled = !window.darkModeEnabled
    const head = document.head
    const link = document.createElement('link')

    link.type = 'text/css'
    link.rel = 'stylesheet'
    link.className = 'mobile-nav-css'
    link.href = '/assets/dark-mode.css'

    nightly.toggle()
    if (darkModeEnabled) {
      head.appendChild(link)
    } else {
      const darkStylesheet = document.querySelector('.mobile-nav-css')
      document.getElementsByTagName('head')[0].removeChild(darkStylesheet)
    }
  })

}

darkModeFeature()
