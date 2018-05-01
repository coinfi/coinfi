import { takeLatest, select } from 'redux-saga/effects'
import { pushStateToURL } from './bindFilters'
import * as selectors from './selectors'
import { listIndex } from '../../utils/stateHelpers'

export default function* watcher() {
  yield takeLatest('SET_FILTER', updateURL)
  yield takeLatest('REMOVE_FILTER', updateURL)
}

function* updateURL({ type, payload }) {
  const activeFilters = yield select(selectors.selectActiveFilters())
  let newFilter = null
  if (payload.value) newFilter = payload
  if (type === 'REMOVE_FILTER')
    activeFilters.delete(listIndex(activeFilters, payload.key))
  pushStateToURL(activeFilters, newFilter)
}
