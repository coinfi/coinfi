import { takeLatest } from 'redux-saga/effects'
import * as sagas from '../../lib/genericSagas'
import * as actions from './actions'

// TODO:
// inject / cancel this watcher based on route
// (like react-boilerplate does it)

export default function* watcher() {
  yield takeLatest('FETCH_COIN', fetchCoin)
}

function* fetchCoin({ id }) {
  yield sagas.get(`/coins/${id}.json`, null, actions.fetchCoinSuccess)
}
