export const toggleOverlay = element => {
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
})
