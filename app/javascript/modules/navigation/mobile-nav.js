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

  var nightly = new Nightly()

  darkModeBtn.addEventListener('click', function(event) {
    window.darkModeEnabled = !window.darkModeEnabled
    const bodyElem = document.querySelector('body')
    Array.from(bodyElem.classList).includes('dark-mode')
      ? bodyElem.classList.remove('dark-mode')
      : bodyElem.classList.add('dark-mode')

    Array.from(bodyElem.classList).includes('dark-mode')
      ? (document.querySelector('.trigger-dark-mode>span').innerText = 'light')
      : (document.querySelector('.trigger-dark-mode>span').innerText = 'dark')
    nightly.toggle()
  })
}

darkModeFeature()
