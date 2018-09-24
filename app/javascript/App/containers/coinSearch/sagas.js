import { takeLatest } from 'redux-saga/effects'
import { apiSagas } from '../../lib/redux'
import * as actions from './actions'
import * as _ from 'lodash'

export default function* watcher() {
  yield takeLatest('SEARCH_COINS', searchCoins)
}

function* searchCoins({ searchText, searchOpts, namespace }) {
  if (searchText.length < 2) return
  yield apiSagas.get(
    '/coins/search.json',
    _.merge({ q: { name_or_symbol_cont: searchText } }, searchOpts),
    actions.searchCoinsSuccess(namespace),
  )
}
