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
  yield takeLatest('TOGGLE_UI', handleFullScreen)
  yield takeLatest('ENABLE_UI', handleFullScreen)
  yield takeLatest('DISABLE_UI', handleFullScreen)
}

function* handleFullScreen({ type, keyPath, opts }) {
  const currentUI = yield select(selectors.currentUI)
  if (type === 'DISABLE_UI' || !currentUI(keyPath)) {
    document.body.className = ''
    return
  }
  if (opts.fullScreen) document.body.className = 'overflow-hidden'
}

function* fetchUser() {
  yield apiSagas.get('/user', null, setUser)
}

function* updateUser({ payload }) {
  console.log('saga payload', payload)
    debugger
  yield apiSagas.patch('/user', payload, setUser)
}
