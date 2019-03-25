// Adapted from https://stackoverflow.com/a/3028037
function onClickOutside(selector, fn) {
  const outsideClickListener = (event) => {
    if (!$(event.target).closest(selector).length) {
      fn()
      removeClickListener()
    }
  }

  const removeClickListener = () => {
    document.removeEventListener('click', outsideClickListener)
  }

  document.addEventListener('click', outsideClickListener)
}

$(document).ready(() => {
  let navMenuIsOpen = false
  let navMenuCoinsIsOpen = false
  let navMenuCompanyIsOpen = false
  const $navMenu = $('#nav-menu')
  const $navMenuToggle = $('.nav-menu-toggle')
  const $navMenuClose = $('.nav-menu-close')
  const $navMenuCoins = $('.nav-menu-coins')
  const $navMenuCoinsToggle = $('.nav-menu-coins-toggle')
  const $navMenuCompany = $('.nav-menu-company')
  const $navMenuCompanyToggle = $('.nav-menu-company-toggle')

  const closeNavMenu = () => {
    $navMenu.removeClass('nav-menu--in')
    $navMenu.addClass('nav-menu--out')
    navMenuIsOpen = false
  }

  const openNavMenu = () => {
    $navMenu.removeClass('nav-menu--out')
    $navMenu.addClass('nav-menu--in')
    navMenuIsOpen = true
    onClickOutside('#nav-menu, .nav-menu-toggle', closeNavMenu)
  }

  const closeNavMenuCoins = () => {
    $navMenuCoins.removeClass('nav-menu-coins--active')
    navMenuCoinsIsOpen = false
  }

  const openNavMenuCoins = () => {
    $navMenuCoins.addClass('nav-menu-coins--active')
    navMenuCoinsIsOpen = true
    onClickOutside('.nav-menu-coins, .nav-menu-coins-toggle', closeNavMenuCoins)
  }

  const closeNavMenuCompany = () => {
    $navMenuCompany.removeClass('nav-menu-company--active')
    navMenuCompanyIsOpen = false
  }

  const openNavMenuCompany = () => {
    $navMenuCompany.addClass('nav-menu-company--active')
    navMenuCompanyIsOpen = true
    onClickOutside(
      '.nav-menu-company, .nav-menu-company-toggle',
      closeNavMenuCompany,
    )
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

  // Bind click handler to menu close
  $navMenuClose.click((e) => {
    closeNavMenu()
  })

  // Bind click handler to coins toggle
  $navMenuCoinsToggle.click((e) => {
    e.preventDefault()

    if (navMenuCoinsIsOpen) {
      closeNavMenuCoins()
    } else {
      openNavMenuCoins()
    }
  })

  // Bind click handler to company toggle
  $navMenuCompanyToggle.click((e) => {
    e.preventDefault()

    if (navMenuCompanyIsOpen) {
      closeNavMenuCompany()
    } else {
      openNavMenuCompany()
    }
  })

  $('.expandable > .footer-item__header').click(function(e) {
    e.preventDefault()
    const $expandable = $(this).parent()
    const targetId = $expandable.data('target')

    if ($expandable.is('.open')) {
      $expandable.removeClass('open')
      if (targetId) {
        $(`[data-expandable="${targetId}"`).each(function(index) {
          $(this).css('max-height', '0px')
        })
      }
    } else {
      const defaultHeight = 300

      $expandable.addClass('open')
      if (targetId) {
        $(`[data-expandable="${targetId}"`).each(function(index) {
          const height = $(this).data('height') || defaultHeight
          $(this).css('max-height', `${height}px`)
        })
      }
    }
  })

  // Close menu when browser resizes
  $(window).resize(() => {
    closeNavMenu()
  })
})
