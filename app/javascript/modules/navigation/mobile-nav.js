const toggleNav = () => {
  const nav = $('#mobile-nav')
  nav.toggleClass('visible')
  $('body').toggleClass('overflow-hidden')
  setTimeout(() => {
    nav.toggleClass('active')
  }, 50)
}
$(document).ready(() => {
  $('.mobile-nav-toggle').on('click', () => {
    toggleNav()
  })
})
