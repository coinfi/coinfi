import { takeLatest } from 'redux-saga/effects'
import * as sagas from '../../lib/genericSagas'
import * as actions from './actions'

export default function* watcher() {
  yield takeLatest('FETCH_ENTITY', fetchEntity)
}

function* fetchEntity({ id }) {
  yield sagas.get(`/coins/${id}.json`, null, actions.fetchEntitySuccess)
}
