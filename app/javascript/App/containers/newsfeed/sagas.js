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
  yield takeLatest('SET_ENTITY_LIST', fetchNewsItems)
  yield takeLatest('ON_FILTER_INITIALIZE', pollNewsItems)
  yield takeLatest('SET_ACTIVE_ENTITY', applyCoin)
  yield takeLatest('ON_FILTER_CHANGE', applyCoin)
  yield fork(filterSagas)
  yield fork(entitySagas)
}

function* fetchCoins(action) {
  if (action.namespace !== namespace) return
  yield put(actions.fetchEntityList('coins', { url: 'newsfeed/coins' }))
}

function* fetchNewsItems(action, opts = {}) {
  /*
   * Here we want to be sure that there are coin IDs before proceeding, which is
   * why we're calling it on SET_ENTITY_LIST for Coins, because by that time the
   * IDs are available.
   */
  if (action.namespace !== namespace) return
  if (action.type === 'SET_ENTITY_LIST' && action.entityType !== 'coins') return
  const activeFilters = yield select(selectors.activeFilters)
  let { coins, ...params } = buildFilterObject(activeFilters)
  if (coins) {
    params.coin_ids = coins.map((coin) => coin.id)
  } else {
    params.coin_ids = yield select(selectors.coinIDs)
  }
  params = { ...params, ...opts }
  yield put(
    actions.fetchEntityList('newsItems', {
      params,
      url: 'news_items',
      ...opts
    })
  )
}

function* pollNewsItems(action) {
  while (true) {
    yield delay(90000)
    const newsItems = yield select(selectors.newsItems)
    const opts = { isPolling: true }
    if (newsItems[0]) {
      opts.updatedSince = newsItems[0].get('updated_at')
    }
    yield fetchNewsItems(action, opts)
  }
}

function* applyCoin(action) {
  /*
   * On clicking a coin, this will set the filter and fetch NewsItems.
   *
   * On Filter initialize, this will attempt to set the active entity (i.e. if 1
   * coin is selected), and on Filter change, it will also re-fetch the
   * NewsItems.
   */
  const { payload, type } = action
  if (action.namespace !== namespace) return
  if (payload.preventSaga) return
  const preventSaga = true
  switch (type) {
    case 'SET_ACTIVE_ENTITY':
      if (payload.type !== 'coin') return
      let { id, label } = payload
      // When we click a coin, set the coin filter
      yield put(
        actions.setFilter({
          key: 'coins',
          value: [{ id, label }],
          preventSaga
        })
      )
      yield fetchNewsItems(action)
      break
    case 'ON_FILTER_CHANGE':
    case 'ON_FILTER_INITIALIZE':
      let { filterObject } = payload
      const params = filterObject || {}
      let coin_ids
      if (params.coins) {
        coin_ids = params.coins.map((coin) => parseInt(coin.id, 10))
      }
      if (coin_ids && coin_ids.length >= 1) {
        if (coin_ids.length === 1) {
          // When there's 1 coin selected, make it the active entity
          const id = coin_ids[0]
          yield put(actions.fetchEntityDetails('coin', id))
          // TODO: the following line is being called after manual clicking of a
          // coin (look at Redux Devtools after clicking a coin,
          // SET_ACTIVE_ENTITY is called twice)
          yield put(actions.setActiveEntity({ preventSaga, type: 'coin', id }))
        } else {
          // Unset the active coin if multiple are selected
          yield put(actions.unsetActiveEntity())
        }
      } else {
        // Unset the active coin if none are selected
        yield put(actions.unsetActiveEntity())
      }
      if (type === 'ON_FILTER_CHANGE') yield fetchNewsItems(action)
      break
    default:
      break
  }
}
