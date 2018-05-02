/*
 * Normally this file would just mount the app on the
 * document body, however this is not an SPA, so it 
 * looks for <component> tags in the DOM and injects
 * React components there, optionally with the Redux
 * store.
 */
import 'babel-polyfill'
import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import configureStore from './configureStore'
import getScreenSize from './utils/screenSize'
import { PersistGate } from 'redux-persist/integration/react'
import debounce from 'debounce'

import appContainer from './containers/app'

import WatchButton from './components/WatchButton'
import WatchlistPage from './components/WatchlistPage'
import GlobalCoinSearch from './components/GlobalCoinSearch'
import TwitterFeed from './components/TwitterFeed'
import RedditFeed from './components/RedditFeed'
import IcoFilters from './components/IcoFilters'

const injectableComponents = {
  WatchButton,
  WatchlistPage,
  GlobalCoinSearch,
  TwitterFeed,
  RedditFeed,
  IcoFilters
}

const injectComponents = () => {
  const hooks = document.getElementsByTagName('component')
  if (hooks) {
    const { store, persistor } = configureStore()
    Array.from(hooks).forEach(hook => {
      const name = hook.getAttribute('name')
      const Component = injectableComponents[name]
      if (!Component) return console.error(`Component "${name}" not found`)
      const props = JSON.parse(hook.getAttribute('props'))
      const withStore = hook.getAttribute('withStore') !== null
      if (withStore) {
        const AppComponent = appContainer(Component)
        ReactDOM.render(
          <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
              <AppComponent {...props} />
            </PersistGate>
          </Provider>,
          hook
        )
      } else {
        ReactDOM.render(<Component {...props} />, hook)
      }
    })
  }
}
const setScreenSize = () => {
  window.screenSize = getScreenSize()
  window.isMobile = !['m', 'l'].includes(window.screenSize)
}

document.addEventListener('DOMContentLoaded', () => {
  setScreenSize()
  injectComponents()
})

window.addEventListener('resize', debounce(setScreenSize), 400)
