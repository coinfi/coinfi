import { fork, all, takeLatest, select } from 'redux-saga/effects'
import * as selectors from './selectors'

import watchlistSagas from '../watchlist/sagas'
import coinSearchSagas from '../coinSearch/sagas'
import icoFiltersSagas from '../icoFilters/sagas'
import newsfeedSagas from '../newsfeed/sagas'

const sagas = [watchlistSagas, coinSearchSagas, icoFiltersSagas, newsfeedSagas]

export default function* watcher() {
  yield all(sagas.map((saga) => fork(saga)))
  yield takeLatest('TOGGLE_UI', toggleBodyScroll)
}

function* toggleBodyScroll({ keyPath, opts }) {
  if (!opts.toggleBodyScroll) return
  let className = ''
  const currentUI = yield select(selectors.currentUI)
  if (currentUI(keyPath)) className = 'overflow-hidden'
  document.body.className = className
}
