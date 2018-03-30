/*
 * This is an example implementation of a React SPA
 * with React Router, Redux, Redux Saga etc. which
 * we may want to use in future.
 */
import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import registerServiceWorker from './serviceWorker'
import configureStore from './store'
import ExamplePage from './pages/ExamplePage'
import 'babel-polyfill'

document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('example-app')
  if (!container) return
  ReactDOM.render(
    <Provider store={configureStore()}>
      <ExamplePage />
    </Provider>,
    container
  )
  registerServiceWorker()
})
