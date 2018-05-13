import { fork, all, takeLatest, select } from 'redux-saga/effects'
import { currentUI } from './selectors'

import watchlistPageSagas from '../watchlistPage/sagas'
import coinSearchSagas from '../coinSearch/sagas'
import icoFiltersSagas from '../icoFilters/sagas'
import coinChartsSagas from '../coinCharts/sagas'

const sagas = [
  watchlistPageSagas,
  coinSearchSagas,
  icoFiltersSagas,
  coinChartsSagas
]

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
