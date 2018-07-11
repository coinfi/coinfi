import { takeLatest } from 'redux-saga/effects'
import { apiSagas } from '../../lib/redux'
import * as actions from './actions'
import _ from 'lodash'

export default function* watcher() {
  yield takeLatest('SEARCH_COINS', searchCoins)
}

function* searchCoins({ searchText, searchOpts, namespace }) {
    console.log('searchCoins')
  if (searchText.length < 2) return
  yield apiSagas.get(
    '/coins.json',
    _.merge({ q: { name_or_symbol_cont: searchText } }, searchOpts),
    actions.searchCoinsSuccess(namespace)
  )
}
