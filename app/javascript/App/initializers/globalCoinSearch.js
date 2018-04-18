import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import GlobalCoinSearch from '../components/GlobalCoinSearch'
import configureStore from '../configureStore'

document.addEventListener('DOMContentLoaded', () => {
  let c = document.getElementById('global-coin-search')
  if (c) {
    ReactDOM.render(
      <Provider store={configureStore()}>
        <GlobalCoinSearch />
      </Provider>,
      c
    )
  }
})
