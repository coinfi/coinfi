import { fork, all, takeLatest, select } from 'redux-saga/effects'
import { setUser } from './actions'
import apiSagas from '../../lib/redux/apiSagas'
import * as selectors from './selectors'

import watchlistSagas from '../watchlist/sagas'
import coinSearchSagas from '../coinSearch/sagas'
import icoFiltersSagas from '../icoFilters/sagas'
import newsfeedSagas from '../newsfeed/sagas'

const sagas = [watchlistSagas, coinSearchSagas, icoFiltersSagas, newsfeedSagas]

export default function* watcher() {
  yield all(sagas.map((saga) => fork(saga)))
  yield takeLatest('FETCH_USER', fetchUser)
  yield takeLatest('UPDATE_USER', updateUser)
  yield takeLatest('TOGGLE_UI', toggleBodyScroll)
}

function* toggleBodyScroll({ keyPath, opts }) {
  if (!opts.toggleBodyScroll) return
  let className = ''
  const currentUI = yield select(selectors.currentUI)
  if (currentUI(keyPath)) className = 'overflow-hidden'
  document.body.className = className
}

function* fetchUser() {
  yield apiSagas.get('/user', null, setUser)
}

function* updateUser({ payload }) {
  yield apiSagas.patch('/user', payload, setUser)
}
