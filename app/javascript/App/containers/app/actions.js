export const toggleUI = (keyPath) => {
  return { type: 'TOGGLE_UI', keyPath }
}
export const setUI = (keyPath) => {
  return { type: 'SET_UI', keyPath }
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
