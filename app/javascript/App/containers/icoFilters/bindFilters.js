import qs from 'qs'

export default props => {
  /*
   * 2-way binding of filters!
   *
   * Filters might be set in the app state, or they might be set in the URL, here
   * we're detecting if they're present in the URL, and if so, updating the state
   * to reflect it.
   *
   * Conversely, if there's no filter params in the URL, but there are filters set
   * in the state, then we'll update the URL (in case a user wants to bookmark the
   * applied filters).
   */
  const { activeFilters, setFilters } = props
  const { search } = window.location

  if (search.length > 0) {
    pullStateFromURL(setFilters)
  } else if (activeFilters.size > 0) {
    pushStateToURL(activeFilters)
  }
}

export const pushStateToURL = (activeFilters, newFilter = null) => {
  let filterObject = activeFilters.toJS().reduce((n, o) => {
    n[o.key] = o.value
    return n
  }, {})
  if (newFilter) filterObject[newFilter.key] = newFilter.value
  const queryString = qs.stringify({ q: filterObject }, { encode: false })
  window.history.pushState(filterObject, document.title, `?${queryString}`)
}

export const pullStateFromURL = setFilters => {}
