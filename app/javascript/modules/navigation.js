$(document).ready(() => {
  let navMenuIsOpen = false
  let navMenuMoreIsOpen = false
  const $navMenu = $('.nav-menu')
  const $navMenuToggle = $('.nav-menu-toggle')
  const $navMenuMore = $('.nav-menu-more')
  const $navMenuMoreToggle = $('.nav-menu-more-toggle')

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

  const closeNavMenuMore = () => {
    $navMenuMore.removeClass('nav-menu-more--active')
    navMenuMoreIsOpen = false
  }

  const openNavMenuMore = () => {
    $navMenuMore.addClass('nav-menu-more--active')
    navMenuMoreIsOpen = true
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

  // Bind click handler to more toggle
  $navMenuMoreToggle.click((e) => {
    e.preventDefault()

    if (navMenuMoreIsOpen) {
      closeNavMenuMore()
    } else {
      openNavMenuMore()
    }
  })

  // Close menu when browser resizes
  $(window).resize(() => {
    closeNavMenu()
  })
})
