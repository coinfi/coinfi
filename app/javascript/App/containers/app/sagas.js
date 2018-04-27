import { fork, all } from 'redux-saga/effects'

import watchlistPageSagas from '../watchlistPage/sagas'
import coinSearchSagas from '../coinSearch/sagas'
import icoFiltersSagas from '../icoFilters/sagas'

const sagas = [watchlistPageSagas, coinSearchSagas, icoFiltersSagas]

export default function* watcher() {
  yield all(sagas.map(saga => fork(saga)))
}
