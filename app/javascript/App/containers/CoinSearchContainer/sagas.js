import { takeLatest } from 'redux-saga/effects'
import * as sagas from '../../utils/genericSagas'
import * as actions from './actions'

export default function* watcher() {
  yield takeLatest('SEARCH_COINS', searchCoins)
}

function* searchCoins({ searchText, searchOpts }) {
  if (searchText.length < 2) return
  yield sagas.get(
    '/coins.json',
    Object.assign({ q: { name_cont: searchText } }, searchOpts),
    actions.searchCoinsSuccess
  )
}
