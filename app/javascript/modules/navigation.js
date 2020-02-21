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
  const $navMenu = $('#nav-menu')
  const $navMenuToggle = $('.nav-menu-toggle')
  const $navMenuClose = $('.nav-menu-close')

  const subMenuIsOpen = {}
  const subMenuItems = ['coins', 'exchanges', 'company']
  const closeSubMenuFns = {}
  const openSubMenuFns = {}
  const $subMenuElements = {}
  const $subMenuToggles = {}

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

  subMenuItems.forEach((name) => {
    $subMenuElements[name] = $(`.nav-menu-${name}`)
    $subMenuToggles[name] = $(`.nav-menu-${name}-toggle`)
    subMenuIsOpen[name] = false

    closeSubMenuFns[name] = () => {
      $subMenuElements[name].removeClass('nav-menu__dropdown--active')
      subMenuIsOpen[name] = false
    }

    openSubMenuFns[name] = () => {
      $subMenuElements[name].addClass('nav-menu__dropdown--active')
      subMenuIsOpen[name] = true
      onClickOutside(
        `.nav-menu-${name}, .nav-menu-${name}-toggle`,
        closeSubMenuFns[name],
      )
    }

    // Bind click handler to toggle
    $subMenuToggles[name].click((e) => {
      e.preventDefault()

      if (subMenuIsOpen[name]) {
        closeSubMenuFns[name]()
      } else {
        openSubMenuFns[name]()
      }
    })
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
