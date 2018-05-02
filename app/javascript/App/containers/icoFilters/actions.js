export const resetFilters = payload => {
  return { type: 'RESET_FILTERS', payload }
}

export const setFilter = (key, value) => {
  return { type: 'SET_FILTER', payload: { key, value } }
}

export const removeFilter = key => {
  return { type: 'REMOVE_FILTER', payload: { key } }
}
