/* global MicroModal:false */

let modalState = ''
const MODAL_IDS = {
  login: 'login',
  signup: 'sign-up',
}

function registerByEmail(e) {
  e.preventDefault()

  const $modal = $(`#modal-${MODAL_IDS.signup}`)
  const $form = $modal.find('#sign_up_form')

  hideAndClearErrors($modal)

  $.ajax({
    url: $form.attr('action'),
    type: 'POST',
    contentType: 'application/json',
    dataType: 'json',
    data: JSON.stringify($form.serializeJSON()),
    success: function(result) {
      $modal.find('#modal-sign-up-content').hide()
      $modal.find('.modal__footer').hide()
      $modal.find('#modal-signed-up-content').show()
    },
    error: function(xhr) {
      handleErrors(xhr, $modal)
    },
  })
}

function loginByEmail(e) {
  e.preventDefault()

  const $modal = $(`#modal-${MODAL_IDS.login}`)
  const $form = $modal.find('#login_form')

  hideAndClearErrors($modal)

  $.ajax({
    url: $form.attr('action'),
    type: 'POST',
    contentType: 'application/json',
    dataType: 'json',
    data: JSON.stringify($form.serializeJSON()),
    success: function(result) {
      if (typeof result === 'string') {
        result = JSON.parse(result)
      }
      if (result && result.location) {
        window.location.href = result.location
      } else {
        removeHash()
        window.location.reload()
      }
    },
    error: function(xhr) {
      handleErrors(xhr, $modal)
    },
  })
}

function handleErrors(response, $modal) {
  if (!response) return

  const json = response.responseJSON
  const text = response.responseText
  if (json && json.errors) {
    showErrors($modal, json.errors)
  } else if (
    typeof text === 'string' &&
    text.match(new RegExp('ActionController::InvalidAuthenticityToken'))
  ) {
    showErrors($modal, ['Your session has timedout. Try refreshing the page.'])
  } else {
    showErrors($modal, ['An unknown error has occurred.'])
  }
}

function hideAndClearErrors($modal) {
  $modal.find('#form-errors').hide()
  $modal.find('.alert-container').empty()
}

function showErrors($modal, errors) {
  $modal.find('#form-errors').show()
  const $alertContainer = $modal.find('.alert-container')
  errors.forEach((message) => {
    if (message === 'Email has already been taken') {
      $alertContainer.append(
        $('<li>').html(
          `It looks like you already have an account. Please login <a href="#login" onclick="switchFromSignUpToLogin(event)">here</a>.`,
        ),
      )
    } else {
      $alertContainer.append($('<li>').text(message))
    }
  })
}

function setState(state) {
  modalState = state
}

function clearState(state) {
  if (!!state) {
    if (state !== modalState) {
      return // don't clear if not equal to specified state
    }
  }

  modalState = ''
}

function getHash() {
  return window.location.hash.slice(1)
}

function setHash(hash) {
  const oldHash = getHash()
  if (oldHash !== hash) {
    window.location.hash = hash
  }
}

function removeHash() {
  window.location.hash = ''
}

function focusFirst(modal) {
  const elementsToFocus = modal.getElementsByClassName('focus-first')
  if (elementsToFocus && elementsToFocus.length > 0) {
    elementsToFocus[0].focus()
  }
}

function clearOpenModal() {
  if (!!modalState) {
    try {
      MicroModal.close(`modal-${modalState}`)
      clearState()
    } catch (e) {
      console.log(`Failed to close modal ${modalState}`)
    }
  }
}

function openLoginModal(event) {
  openModal(MODAL_IDS.login)
}

function closeLoginModal(event) {
  closeModal(MODAL_IDS.login)
}

function openSignUpModal(event) {
  openModal(MODAL_IDS.signup)
}

function closeSignUpModal(event) {
  closeModal(MODAL_IDS.signup)
}

function openModal(modalHash) {
  clearOpenModal()
  setState(modalHash)
  setHash(modalHash)
  MicroModal.show(`modal-${modalHash}`, {
    onShow: focusFirst,
    onClose: removeHash,
  })
}

function closeModal(modalHash) {
  clearState(modalHash)
  MicroModal.close(`modal-${modalHash}`)
}

function switchFromLoginToSignup(e) {
  closeLoginModal(e)
  openSignUpModal(e)
}

function switchFromSignUpToLogin(e) {
  closeSignUpModal(e)
  openLoginModal(e)
}

window.addEventListener('DOMContentLoaded', () => {
  // add event listeners to forms
  Object.values(MODAL_IDS).forEach((name) => {
    $(`#modal-${name} form`).bind('keypress', (e) => {
      if (e.keyCode === 13) {
        e.preventDefault()
        $(`#modal-${name} .btn-enter`).click()
      }
    })
  })

  // check if URL includes modal hash
  const hash = getHash()
  if (Object.values(MODAL_IDS).includes(hash)) {
    openModal(hash)
  }
})

window.addEventListener('show-modal-sign-up', () => {
  openSignUpModal()
})

window.addEventListener('hide-modal-sign-up', () => {
  closeSignUpModal()
})

window.addEventListener('show-modal-login', () => {
  openLoginModal()
})

window.addEventListener('hide-modal-login', () => {
  closeLoginModal()
})
