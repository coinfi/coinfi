$(document).ready(() => {
  let navMenuIsOpen = false
  const $navMenu = $('.nav-menu')
  const $navMenuToggle = $('.nav-menu-toggle')

  const closeNavMenu = () => {
    $navMenu.removeClass('nav-menu--in')
    $navMenu.addClass('nav-menu--out')
    navMenuIsOpen = false
  }

  const openNavMenu = () => {
    $navMenu.removeClass('nav-menu--out')
    $navMenu.addClass('nav-menu--in')
    navMenuIsOpen = true
  }

  // Bind click handler to menu toggle
  $navMenuToggle.click((e) => {
    e.preventDefault()

    if (navMenuIsOpen) {
      closeNavMenu()
    } else {
      openNavMenu()
    }
  })

  // Close menu when browser resizes
  $(window).resize(() => {
    closeNavMenu()
  })
})
