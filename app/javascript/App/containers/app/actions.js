export const toggleUI = (keyPath, opts = {}) => {
  return { type: 'TOGGLE_UI', keyPath, opts }
}
export const enableUI = (keyPath, opts = {}) => {
  return { type: 'ENABLE_UI', keyPath, opts }
}
export const disableUI = (keyPath, opts = {}) => {
  return { type: 'DISABLE_UI', keyPath, opts }
}
export const fetchUser = () => {
  return { type: 'FETCH_USER' }
}
export const setUser = (response) => {
  return { type: 'SET_USER', response }
}
export const updateUser = (payload) => {
  return { type: 'UPDATE_USER', payload }
}
