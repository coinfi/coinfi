import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import CoinSearch from '../../components/CoinSearch'
import configureStore from './configureStore'

document.addEventListener('DOMContentLoaded', () => {
  let c = document.getElementById('coin-search')
  if (c) {
    ReactDOM.render(
      <Provider store={configureStore()}>
        <CoinSearch />
      </Provider>,
      c
    )
  }
})
