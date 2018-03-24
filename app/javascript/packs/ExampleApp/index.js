import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import registerServiceWorker from './serviceWorker'
import configureStore from './store'
import ExamplePage from './pages/ExamplePage'
import 'babel-polyfill'

export default container =>
  ReactDOM.render(
    <Provider store={configureStore()}>
      <ExamplePage />
    </Provider>,
    container
  )
registerServiceWorker()
