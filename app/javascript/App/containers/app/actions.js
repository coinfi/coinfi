export const toggleUI = (key, value = null) => {
  return { type: 'TOGGLE_UI', key, value }
}
