import { fork, all } from 'redux-saga/effects'
import WatchlistPageSagas from '../../containers/WatchlistPageContainer/sagas'
import CoinSearchSagas from '../../containers/CoinSearchContainer/sagas'

const sagas = [WatchlistPageSagas, CoinSearchSagas]

export default function* root() {
  yield all(sagas.map(saga => fork(saga)))
}
