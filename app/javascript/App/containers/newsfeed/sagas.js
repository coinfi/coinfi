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
  yield takeLatest('ON_FILTER_CHANGE', fetchNewsItems)
  yield takeLatest('TOGGLE_UI', onWatchingOnly)
  yield fork(filterSagas)
  yield fork(entitySagas)
}

function* fetchCoins(action) {
  if (action.namespace !== namespace) return
  yield put(actions.fetchEntityList('coins', { url: 'newsfeed/coins' }))
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

function* fetchNewsItems(action) {
  if (action.namespace !== namespace) return
  const params = yield newsitemParams()
  yield put(
    actions.fetchEntityList('newsItems', {
      params,
      url: 'news_items'
    })
  )
  yield activateFilteredCoin(params.coinIDs)
}

function* pollNewsItems(action) {
  if (action.namespace !== namespace) return
  while (true) {
    yield delay(60000)
    const newsItems = yield select(selectors.newsItems)
    const params = yield newsitemParams()
    if (newsItems[0]) params.updatedSince = newsItems[0].get('updated_at')
    yield put(
      actions.fetchEntityListUpdates('newsItems', {
        params,
        url: 'news_items'
      })
    )
  }
}

function* onSetActiveCoin(action) {
  /* On clicking a coin, this will do fetchEntityDetails for that coin, and set
  the filter. */
  if (action.namespace !== namespace) return
  const { payload } = action
  if (payload.type === 'coin') {
    let { id, label } = payload
    yield put(actions.fetchEntityDetails('coin', id))
    if (payload.preventSaga) return
    yield put(
      actions.setFilter({
        key: 'coins',
        value: [{ id, label }]
      })
    )
  }
}

function* activateFilteredCoin(coinIDs) {
  if (coinIDs.length === 1) {
    yield put(
      actions.setActiveEntity({
        preventSaga: true,
        type: 'coin',
        id: parseInt(coinIDs[0], 10)
      })
    )
  } else {
    yield put(actions.unsetActiveEntity())
  }
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
