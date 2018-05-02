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

import qs from 'qs'
import { getQueryObject } from '../../utils/urlHelpers'

const queryObject = getQueryObject().q

export default props => {
  if (queryObject && Object.keys(queryObject).length > 0) {
    props.resetFilters(queryObject)
  } else if (props.activeFilters.size > 0) {
    pushStateToURL(props)
  }
}

export const pushStateToURL = ({ activeFilters, newFilter }) => {
  let filterObject = activeFilters.toJS().reduce((n, o) => {
    n[o.key] = o.value
    return n
  }, {})
  if (newFilter) filterObject[newFilter.key] = newFilter.value
  const queryString = qs.stringify({ q: filterObject }, { encode: false })
  window.history.pushState(filterObject, document.title, `?${queryString}`)
}
