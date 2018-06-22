import { takeLatest, fork } from 'redux-saga/effects'
import axios from 'axios'
import { currentURL } from '../../lib/urlHelpers'
import { namespace } from './constants'
import { createFilterSagas } from '../../lib/redux'

const filterSagas = createFilterSagas(namespace)

export default function* watcher() {
  yield takeLatest('ON_FILTER_INITIALIZE', initializeResults)
  yield takeLatest('ON_FILTER_CHANGE', updateResults)
  yield fork(filterSagas)
}

function* initializeResults(action) {
  if (action.namespace !== namespace) return
  /* Here we're checking if the querystring is absent and the filter state is
  present before fetching the results, because for this page the results are
  initially server-rendered anyway, and we don't want to fetch the same thing
  twice. */
  let { queryStringPresent, filterObject } = action.payload
  let shouldUpdate = false
  if (!queryStringPresent && Object.keys(filterObject || {}).length > 0)
    shouldUpdate = true
  if (shouldUpdate) yield updateResults(action)
}

function* updateResults(action) {
  if (action.namespace !== namespace) return
  /* This fetches and injects the HTML for the ICOs index, but without the page
  layout by using &naked=true */
  let { filterObject } = action.payload
  yield axios
    .get(currentURL({ queryObject: { q: filterObject, naked: true } }))
    .then((response) => {
      const { data: html, status } = response
      const domContainer = document.getElementById('ico-table')
      if (domContainer && status === 200) {
        domContainer.innerHTML = html
      }
    })
}
