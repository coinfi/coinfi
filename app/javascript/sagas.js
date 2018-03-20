import { fork, all } from 'redux-saga/effects'
import CoinSagas from './containers/CoinContainer/sagas'

const sagas = [CoinSagas]

export default function* root() {
  yield all(sagas.map(saga => fork(saga)))
}
