var toggleNav = function() {
  var nav = $('#mobile-nav')
  nav.toggleClass('visible')
  $('body').toggleClass('overflow-hidden')
  setTimeout(function() {
    nav.toggleClass('active')
  }, 50)
}
$(document).ready(function() {
  $('.mobile-nav-toggle').on('click', function() {
    toggleNav()
  })
})
