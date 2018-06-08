export const toggleUI = (keyPath, opts = {}) => {
  return { type: 'TOGGLE_UI', keyPath, opts }
}
export const setUI = (keyPath) => {
  return { type: 'SET_UI', keyPath }
}
