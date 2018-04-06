import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import CoinSearchContainer from '../../containers/CoinSearchContainer'
import configureStore from './configureStore'

document.addEventListener('DOMContentLoaded', () => {
  let c = document.getElementById('coin-search')
  if (c) {
    ReactDOM.render(
      <Provider store={configureStore()}>
        <CoinSearchContainer />
      </Provider>,
      c
    )
  }
})
