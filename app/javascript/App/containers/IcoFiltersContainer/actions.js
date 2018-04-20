export const toggleUI = (key, value = null) => {
  return { type: 'TOGGLE_UI', key, value }
}

export const setActiveFilters = payload => {
  return { type: 'SET_ACTIVE_FILTERS', payload }
}

export const setFilter = payload => {
  return { type: 'SET_FILTER', payload }
}
