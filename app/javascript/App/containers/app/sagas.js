import { fork, all, takeLatest, select } from 'redux-saga/effects'
import { currentUI } from './selectors'

import watchlistSagas from '../watchlist/sagas'
import coinSearchSagas from '../coinSearch/sagas'
import icoFiltersSagas from '../icoFilters/sagas'
import newsfeedSagas from '../newsfeed/sagas'

const sagas = [watchlistSagas, coinSearchSagas, icoFiltersSagas, newsfeedSagas]

export default function* watcher() {
  yield all(sagas.map(saga => fork(saga)))
  yield takeLatest('TOGGLE_UI', preventScrollOnMobile)
}

function* preventScrollOnMobile({ key, value }) {
  if (!window.isMobile) return
  const blacklist = ['mobileFilters']
  if (blacklist.includes(key)) return
  const cUI = yield select(currentUI)
  const uiActive = cUI(key, value)
  const className = uiActive ? 'overflow-hidden' : ''
  document.body.className = className
}
