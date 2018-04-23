import { fork, all } from 'redux-saga/effects'
import appSagas from './containers/app/sagas'
import watchlistPageSagas from './containers/watchlistPage/sagas'
import coinSearchSagas from './containers/coinSearch/sagas'
import icoFiltersSagas from './containers/icoFilters/sagas'

const sagas = [appSagas, watchlistPageSagas, coinSearchSagas, icoFiltersSagas]

export default function* root() {
  yield all(sagas.map(saga => fork(saga)))
}
