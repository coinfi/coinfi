import { takeLatest, put, select } from 'redux-saga/effects'
import * as sagas from '../../utils/genericSagas'
import * as actions from './actions'
import API from '../../utils/API'
import localAPI from '../../utils/localAPI'
import initHighcharts from '../../../modules/coins/highcharts'

export default function* watcher() {
  yield takeLatest('FETCH_DATA', fetchData)
  yield takeLatest('FETCH_DATA_SUCCESS', renderHighcharts)
  yield takeLatest('RENDER_TRADINGVIEW', renderTradingView)
}

function* fetchData({ symbol }) {
  // TODO: Dont run if data already present
  // TODO: Pass friendlyID, don't retrieve from URL
  // TODO: Prices & Articles can be requested at the same time
  const friendlyID = window.location.pathname.split('/').reverse()[0]
  const pricesURL = `api/v1/coins/${symbol}/daily_history.json`
  const articlesURL = `/coins/${friendlyID}/news.json`
  const prices = yield API.get(pricesURL).then(r => r) // Remote API
  const articles = yield localAPI.get(articlesURL).then(r => r.payload) // Local API
  yield put(actions.fetchDataSuccess({ articles, prices }))
}

function renderHighcharts({ data }) {
  console.log(data)
  // TODO: Dont run if already rendered
  initHighcharts(data)
}

function* renderTradingView() {
  // TODO: Dont run if already rendered
  yield null
}
