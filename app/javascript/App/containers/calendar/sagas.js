import { takeLatest, select, put, fork } from 'redux-saga/effects'
import { delay } from 'redux-saga'
import { createEntitySagas, createFilterSagas } from '../../lib/redux'
import selectors from './selectors'
import actions from './actions'
import { namespace, defaultEvent } from './constants'
import { buildFilterObject } from '../../lib/stateHelpers'

const entitySagas = createEntitySagas(namespace)
const filterSagas = createFilterSagas(namespace)

export default function* watcher() {
  yield takeLatest('ON_FILTER_INITIALIZE', addDefaultFilters)
  yield takeLatest('ON_FILTER_INITIALIZE', fetchCoins)
  yield takeLatest('ON_FILTER_INITIALIZE', pollCalendarEvents)
  yield takeLatest('SET_ENTITY_LIST', onSetCoinList)
  yield takeLatest('SET_ACTIVE_ENTITY', onSetActiveCoin)
  yield takeLatest('ON_FILTER_CHANGE', onFilterChange)
  yield takeLatest('TOGGLE_UI', onWatchingOnly)
  yield takeLatest('FETCH_MORE_CALENDAR_EVENTS', onScrollingToBottom)
  yield fork(filterSagas)
  yield fork(entitySagas)
}

// this is a bit of a hacky loop to avoid adding component-specific code to initializer
// if it doesn't properly set the property it's looking for it will probably cause an infinite loop
function* addDefaultFilters(action) {
  if (action.namespace !== namespace) return
  let { filterObject } = action.payload
  filterObject = filterObject || {}
  let { events } = filterObject

  if (!events) {
    filterObject.events = defaultEvent
    yield put(actions.setFilters(filterObject))
  }

  return
}

function* fetchCoins(action) {
  if (action.namespace !== namespace) return
  const opts = { url: 'newsfeed/coins' }
  let { coinIDs } = action
  if (coinIDs) opts.params = { coinIDs }
  yield put(actions.fetchEntityList('coins', opts))
}

function* onSetCoinList(action) {
  // When we set the Coin list, then fetch the CalendarEvents
  if (action.entityType !== 'coins') return
  yield fetchCalendarEvents(action)
}

function* onWatchingOnly({ keyPath }) {
  // When watchlist is toggled, refetch the CalendarEvents
  if (keyPath !== 'watchingOnly') return
  yield fetchCalendarEvents({ namespace })
}

function* onFilterChange(action) {
  yield fetchCalendarEvents(action)
}

function* fetchCalendarEvents(action) {
  if (action.namespace !== namespace) return
  const params = yield calendarEventParams()
  yield put(
    actions.fetchEntityList('calendarEvents', {
      params,
      url: 'calendar_events',
    }),
  )
}

function* pollCalendarEvents(action) {
  if (action.namespace !== namespace) return
  while (true) {
    yield delay(60000)
    const sortedCalendarEvents = yield select(selectors.sortedCalendarEvents)
    const params = yield calendarEventParams()
    if (sortedCalendarEvents[0])
      params.publishedSince = sortedCalendarEvents[0].get('date_created')
    yield put(
      actions.fetchEntityListUpdates('calendarEvents', {
        params,
        url: 'calendar_events',
      }),
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

function* calendarEventParams() {
  const activeFilters = yield select(selectors.activeFilters)
  let params = buildFilterObject(activeFilters)
  if (!params.coins) {
    const coins = yield select(selectors.coins)
    params.coinIDs = coins.map((coin) => coin.get('id'))
  }
  return params
}

function* onScrollingToBottom(action) {
  const endFetchingMoreEntityList = yield select(
    selectors.endFetchingMoreEntityList,
  )
  const isLoading = yield select(selectors.isLoading)
  if (endFetchingMoreEntityList || isLoading('calendar')) return

  const params = yield calendarEventParams()
  const sortedCalendarEvents = yield select(selectors.sortedCalendarEvents)

  if (sortedCalendarEvents.length) {
    const lastCalendarEvent =
      sortedCalendarEvents[sortedCalendarEvents.length - 1]

    if (params.events === 'Past events')
      params.publishedUntil = lastCalendarEvent.get('date_event')
    else params.publishedSince = lastCalendarEvent.get('date_event')

    params.id = lastCalendarEvent.get('id')
  }

  yield put(
    actions.fetchMoreEntityList('calendarEvents', {
      params,
      url: 'calendar_events',
    }),
  )
}
