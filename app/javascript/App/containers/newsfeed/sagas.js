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
  yield takeLatest('FETCH_MORE_NEWS_FEED', onScrollingToBottom)
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
    const sortedNewsItems = yield select(selectors.sortedNewsItems)
    const params = yield newsitemParams()
    if (sortedNewsItems[0])
      params.publishedSince = sortedNewsItems[0].get('feed_item_published_at')
    yield put(
      actions.fetchEntityListUpdates('newsItems', {
        params,
        url: 'news_items'
      })
    )
  }
}

function* onSetActiveCoin(action) {
  /* On clicking a coin, this will do fetchEntityDetails for that coin. */
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

function* onScrollingToBottom(action) {
  const endFetchingMoreEntityList = yield select(
    selectors.endFetchingMoreEntityList
  )
  const isLoading = yield select(selectors.isLoading)
  if (endFetchingMoreEntityList || isLoading('newsfeed')) return

  const params = yield newsitemParams()
  const sortedNewsItems = yield select(selectors.sortedNewsItems)

  if (sortedNewsItems.length) {
    const lastNewsItem = sortedNewsItems[sortedNewsItems.length - 1]
    params.publishedUntil = lastNewsItem.get('feed_item_published_at')
  }
  yield put(
    actions.fetchMoreEntityList('newsItems', {
      params,
      url: 'news_items'
    })
  )
}
