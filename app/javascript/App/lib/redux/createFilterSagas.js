import { takeLatest, select, put } from 'redux-saga/effects'
import { pushObjectToURL } from '..//urlHelpers'
import { getQueryObject } from '../urlHelpers'
import { createFilterActions, createFilterSelectors } from './index'

export default function(namespace, onChange) {
  function* watcher() {
    yield takeLatest('INITIALIZE_FILTERS', initializeFilters)
    yield takeLatest('SET_FILTER', applyFilters)
    yield takeLatest('REMOVE_FILTER', applyFilters)
  }

  const actions = createFilterActions(namespace)
  const selectors = createFilterSelectors(namespace)

  function* initializeFilters(action) {
    /* If a querystring is present, it calls resetFilters, which updates the app
    * state. Otherwise if filter state is present, it calls applyFilters, which
    * updates the querystring and proceeds. */
    if (action.namespace !== namespace) return
    const queryObject = getQueryObject().q
    const activeFilters = yield select(selectors.activeFilters)
    if (queryObject && Object.keys(queryObject).length > 0) {
      yield put(actions.resetFilters(queryObject))
    } else if (activeFilters.size > 0) {
      yield applyFilters(action)
    }
  }

  function* applyFilters(action) {
    /* Updates the querystring based on state, and calls onChange if present */
    if (action.namespace !== namespace) return
    const activeFilters = yield select(selectors.activeFilters)
    let newFilter = null
    const { payload } = action
    if (payload && payload.value) newFilter = payload
    pushStateToURL({ activeFilters })
    if (onChange) onChange(action)
    yield put(actions.onFilterChange(activeFilters.toJS()))
  }

  return watcher
}

function filterObject(list) {}

function pushStateToURL({ activeFilters, newFilter }) {
  let filterObject = activeFilters.toJS().reduce((n, o) => {
    n[o.key] = o.value
    return n
  }, {})
  if (newFilter) filterObject[newFilter.key] = newFilter.value
  pushObjectToURL({ q: filterObject })
}
