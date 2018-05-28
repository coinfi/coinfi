export default (namespace) => ({
  resetFilters: (payload) => {
    return { namespace, type: 'RESET_FILTERS', payload }
  },
  setFilter: (payload) => {
    return { namespace, type: 'SET_FILTER', payload }
  },
  removeFilter: (key) => {
    return { namespace, type: 'REMOVE_FILTER', payload: { key } }
  },
  updateResults: () => {
    return { namespace, type: 'UPDATE_RESULTS' }
  }
})
