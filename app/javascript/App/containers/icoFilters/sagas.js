import axios from 'axios'
import { takeLatest, select } from 'redux-saga/effects'
import { currentURL, getQueryObject } from '../../lib/urlHelpers'
import { pushObjectToURL } from '../../lib/urlHelpers'
import selectors from './selectors'
import { namespace } from './constants'

export default function* watcher() {
  yield takeLatest('SET_FILTER', update)
  yield takeLatest('REMOVE_FILTER', update)
  yield takeLatest('UPDATE_RESULTS', update)
}

function* update(action) {
  if (action.namespace !== namespace) return
  yield updateURL(action)
  updateResults(action)
}

function* updateURL({ payload }) {
  const activeFilters = yield select(selectors.activeFilters)
  let newFilter = null
  if (payload && payload.value) newFilter = payload
  pushStateToURL({ activeFilters, newFilter })
}

function updateResults({ payload }) {
  const queryObject = getQueryObject()
  queryObject.naked = true
  axios.get(currentURL({ queryObject })).then((response) => {
    const { data: html, status } = response
    const domContainer = document.getElementById('ico-table')
    if (domContainer && status === 200) {
      domContainer.innerHTML = html
    }
  })
}

function pushStateToURL({ activeFilters, newFilter }) {
  let filterObject = activeFilters.toJS().reduce((n, o) => {
    n[o.key] = o.value
    return n
  }, {})
  if (newFilter) filterObject[newFilter.key] = newFilter.value
  pushObjectToURL({ q: filterObject })
}
