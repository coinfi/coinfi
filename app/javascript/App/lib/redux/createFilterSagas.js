import { takeLatest, select, put } from 'redux-saga/effects'
import { pushObjectToURL } from '..//urlHelpers'
import { getQueryObject } from '../urlHelpers'
import { createFilterActions, createFilterSelectors } from './index'
import { buildFilterObject } from '../stateHelpers'

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
    let queryStringPresent = false
    let filterObject = getQueryObject().q
    if (filterObject) {
      yield put(actions.resetFilters(filterObject))
      queryStringPresent = true
    } else {
      const activeFilters = yield select(selectors.activeFilters)
      if (activeFilters.size > 0) {
        filterObject = buildFilterObject(activeFilters)
        pushObjectToURL({ q: filterObject })
      }
    }
    yield put(actions.onFilterInitialize({ filterObject, queryStringPresent }))
  }

  function* applyFilters(action) {
    /* Updates the querystring based on state, and calls onChange if present */
    if (action.namespace !== namespace) return
    const activeFilters = yield select(selectors.activeFilters)
    const filterObject = buildFilterObject(activeFilters)
    pushObjectToURL({ q: filterObject })
    yield put(actions.onFilterChange({ filterObject, payload: action.payload }))
  }

  return watcher
}
