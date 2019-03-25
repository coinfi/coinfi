import {
  OPEN_LOGIN_MODAL_EVENT,
  CLOSE_LOGIN_MODAL_EVENT,
  OPEN_SIGN_UP_MODAL_EVENT,
  CLOSE_SIGN_UP_MODAL_EVENT,
} from '../../../constants'

export const openLoginModal = () => {
  window.dispatchEvent(new Event(OPEN_LOGIN_MODAL_EVENT))
}

export const closeLoginModal = () => {
  window.dispatchEvent(new Event(CLOSE_LOGIN_MODAL_EVENT))
}

export const openSignUpModal = () => {
  window.dispatchEvent(new Event(OPEN_SIGN_UP_MODAL_EVENT))
}

export const closeSignUpModal = () => {
  window.dispatchEvent(new Event(CLOSE_SIGN_UP_MODAL_EVENT))
}
