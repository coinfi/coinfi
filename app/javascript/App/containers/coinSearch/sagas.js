import { takeLatest } from 'redux-saga/effects'
import * as sagas from '../../utils/genericSagas'
import * as actions from './actions'

export default function* watcher() {
  yield takeLatest('SEARCH_COINS', searchCoins)
}

function* searchCoins({ searchText, searchOpts, namespace }) {
  if (searchText.length < 2) return
  yield sagas.get(
    '/coins.json',
    Object.assign({ q: { name_or_symbol_cont: searchText } }, searchOpts),
    actions.searchCoinsSuccess(namespace)
  )
}
