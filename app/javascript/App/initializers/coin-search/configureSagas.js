import { fork, all } from 'redux-saga/effects'
import CoinSearchSagas from '../../containers/CoinSearchContainer/sagas'

const sagas = [CoinSearchSagas]

export default function* root() {
  yield all(sagas.map(saga => fork(saga)))
}
