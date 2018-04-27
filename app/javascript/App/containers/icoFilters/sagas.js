import { takeLatest, select } from 'redux-saga/effects'
import { pushStateToURL } from './bindFilters'
import * as selectors from './selectors'

export default function* watcher() {
  yield takeLatest('SET_FILTER', updateURL)
  yield takeLatest('REMOVE_FILTER', updateURL)
}

function* updateURL({ payload }) {
  const activeFilters = yield select(selectors.selectActiveFilters())
  let newFilter = null
  if (payload.value) newFilter = payload
  pushStateToURL(activeFilters, newFilter)
}
