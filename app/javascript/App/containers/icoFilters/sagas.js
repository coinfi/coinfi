import axios from 'axios'
import { takeLatest, select } from 'redux-saga/effects'
import { currentURL, getQueryObject } from '../../utils/urlHelpers'
import { pushStateToURL } from './bindFilters'
import * as selectors from './selectors'
import { currentUI } from '../app/selectors'

export default function* watcher() {
  yield takeLatest('SET_FILTER', update)
  yield takeLatest('REMOVE_FILTER', update)
  yield takeLatest('TOGGLE_UI', preventScrollOnMobile)
}

function* update(action) {
  yield updateURL(action)
  updateResults(action)
}

function* updateURL({ payload }) {
  const activeFilters = yield select(selectors.selectActiveFilters())
  let newFilter = null
  if (payload.value) newFilter = payload
  pushStateToURL({ activeFilters, newFilter })
}

function updateResults({ payload }) {
  const queryObject = getQueryObject()
  queryObject.naked = true
  axios.get(currentURL({ queryObject })).then(response => {
    const { data: html, status } = response
    const domContainer = document.getElementById('ico-table')
    if (domContainer && status === 200) {
      domContainer.innerHTML = html
    }
  })
}

function* preventScrollOnMobile({ key, value }) {
  if (!window.isMobile) return
  const blacklist = ['mobileFilters']
  if (blacklist.includes(key)) return
  const cUI = yield select(currentUI)
  const uiActive = cUI(key, value)
  const className = uiActive ? 'overflow-hidden' : ''
  document.body.className = className
}
