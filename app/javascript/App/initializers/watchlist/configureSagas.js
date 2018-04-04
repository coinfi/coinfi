import { fork, all } from 'redux-saga/effects'
import WatchlistSagas from '../../containers/WatchlistContainer/sagas'

const sagas = [WatchlistSagas]

export default function* root() {
  yield all(sagas.map(saga => fork(saga)))
}
