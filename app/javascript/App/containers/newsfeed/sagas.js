import { takeLatest, select, put, fork } from 'redux-saga/effects'
import { delay } from 'redux-saga'
import { createEntitySagas, createFilterSagas } from '../../lib/redux'
import selectors from './selectors'
import actions from './actions'
import { namespace } from './constants'
import { buildFilterObject } from '../../lib/stateHelpers'

const entitySagas = createEntitySagas(namespace)
const filterSagas = createFilterSagas(namespace)

export default function* watcher() {
  yield takeLatest('ON_FILTER_INITIALIZE', fetchCoins)
  yield takeLatest('ON_FILTER_INITIALIZE', pollNewsItems)
  yield takeLatest('SET_ENTITY_LIST', onSetCoinList)
  yield takeLatest('SET_ACTIVE_ENTITY', onSetActiveCoin)
  yield takeLatest('ON_FILTER_CHANGE', onFilterChange)
  yield takeLatest('TOGGLE_UI', onWatchingOnly)
  yield fork(filterSagas)
  yield fork(entitySagas)
}

function* fetchCoins(action) {
  if (action.namespace !== namespace) return
  const opts = { url: 'newsfeed/coins' }
  let { coinIDs } = action
  if (coinIDs) opts.params = { coinIDs }
  yield put(actions.fetchEntityList('coins', opts))
}

function* onSetCoinList(action) {
  // When we set the Coin list, then fetch the NewsItems
  if (action.entityType !== 'coins') return
  yield fetchNewsItems(action)
}

function* onWatchingOnly({ keyPath }) {
  // When watchlist is toggled, refetch the NewsItems
  if (keyPath !== 'watchingOnly') return
  yield fetchNewsItems({ namespace })
}

function* onFilterChange(action) {
  yield fetchNewsItems(action)
}

function* fetchNewsItems(action) {
  if (action.namespace !== namespace) return
  const params = yield newsitemParams()
  yield put(
    actions.fetchEntityList('newsItems', {
      params,
      url: 'news_items'
    })
  )
}

function* pollNewsItems(action) {
  if (action.namespace !== namespace) return
  while (true) {
    yield delay(60000)
    const newsItems = yield select(selectors.newsItems)
    const params = yield newsitemParams()
    if (newsItems[0])
      params.publishedSince = newsItems[0].get('feed_item_published_at')
    yield put(
      actions.fetchEntityListUpdates('newsItems', {
        params,
        url: 'news_items'
      })
    )
  }
}

function* onSetActiveCoin(action) {
  const { payload } = action
  if (action.namespace !== namespace) return
  if (payload.type !== 'coin') return
  yield put(actions.fetchEntityDetails('coin', payload.id))
}

function* newsitemParams() {
  const activeFilters = yield select(selectors.activeFilters)
  let { coins, ...params } = buildFilterObject(activeFilters)
  if (coins) {
    params.coinIDs = coins.map((coin) => coin.id)
  } else {
    params.coinIDs = yield select(selectors.coinIDs)
  }
  return params
}
