export default namespace => ({
  initializeFilters: () => {
    return {namespace, type: 'INITIALIZE_FILTERS'}
  },
  resetFilters: payload => {
    return {namespace, type: 'RESET_FILTERS', payload}
  },
  setFilter: payload => {
    return {namespace, type: 'SET_FILTER', payload}
  },
  removeFilter: key => {
    return {namespace, type: 'REMOVE_FILTER', payload: {key}}
  },
  onFilterChange: payload => {
    return {namespace, type: 'ON_FILTER_CHANGE', payload}
  },
  onFilterInitialize: payload => {
    return {namespace, type: 'ON_FILTER_INITIALIZE', payload}
  },
  setFilters: payload => {
    return {namespace, type: 'SET_FILTERS', payload}
  },
})
