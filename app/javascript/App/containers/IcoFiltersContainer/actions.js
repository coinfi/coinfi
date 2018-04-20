export const toggleUI = key => {
  return { type: 'TOGGLE_UI', key }
}

export const setActiveFilters = payload => {
  return { type: 'SET_ACTIVE_FILTERS', payload }
}

export const addFilter = payload => {
  return { type: 'ADD_FILTER', payload }
}
