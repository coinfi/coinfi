import { fork, all } from 'redux-saga/effects'
import EntitySagas from './containers/ExampleContainer/sagas'

const sagas = [EntitySagas]

export default function* root() {
  yield all(sagas.map(saga => fork(saga)))
}
