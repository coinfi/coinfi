export const setFilters = payload => {
  return { type: 'SET_FILTERS', payload }
}

export const setFilter = (key, value) => {
  return { type: 'SET_FILTER', payload: { key, value } }
}

export const removeFilter = key => {
  return { type: 'FILTER_FILTER', key }
}
