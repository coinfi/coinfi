import { takeLatest, select } from 'redux-saga/effects'
import { pushObjectToURL } from '..//urlHelpers'

export default function(namespace, selectors, onChange) {
  return function*() {
    yield takeLatest('SET_FILTER', update)
    yield takeLatest('REMOVE_FILTER', update)
    yield takeLatest('UPDATE_RESULTS', update)
  }

  function* update(action) {
    if (action.namespace !== namespace) return
    yield updateURL(action)
    if (onChange) onChange(action)
  }

  function* updateURL({ payload }) {
    const activeFilters = yield select(selectors.activeFilters)
    let newFilter = null
    if (payload && payload.value) newFilter = payload
    pushStateToURL({ activeFilters, newFilter })
  }

  function pushStateToURL({ activeFilters, newFilter }) {
    let filterObject = activeFilters.toJS().reduce((n, o) => {
      n[o.key] = o.value
      return n
    }, {})
    if (newFilter) filterObject[newFilter.key] = newFilter.value
    pushObjectToURL({ q: filterObject })
  }
}
