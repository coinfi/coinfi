import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import registerServiceWorker from '../serviceWorker'
import configureStore from '../store'
import CoinPage from '../pages/CoinPage'
import 'babel-polyfill'

document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('app')
  if (!app) return
  ReactDOM.render(
    <Provider store={configureStore()}>
      <CoinPage />
    </Provider>,
    container
  )
})

registerServiceWorker()
