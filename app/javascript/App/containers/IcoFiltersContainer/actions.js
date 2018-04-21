export const toggleUI = (key, value = null) => {
  return { type: 'TOGGLE_UI', key, value }
}

export const setFilters = payload => {
  return { type: 'SET_FILTERS', payload }
}

export const setFilter = (key, value) => {
  return { type: 'SET_FILTER', payload: { key, value } }
}
