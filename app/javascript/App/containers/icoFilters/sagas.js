import axios from 'axios'
import { currentURL, getQueryObject } from '../../lib/urlHelpers'
import { namespace } from './constants'
import { createFilterSagas } from '../../lib/redux'

export default function* watcher() {
  const filterSagas = createFilterSagas(namespace, onFilterChange)
  yield filterSagas()
}

function onFilterChange({ payload }) {
  const queryObject = getQueryObject()
  queryObject.naked = true
  axios.get(currentURL({ queryObject })).then((response) => {
    const { data: html, status } = response
    const domContainer = document.getElementById('ico-table')
    if (domContainer && status === 200) {
      domContainer.innerHTML = html
    }
  })
}
