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

const componentOptions = {
  WatchButton: {
    Component: WatchButton,
    propNames: ['coinID', 'watching'],
    withStore: false
  },
  WatchlistPage: {
    Component: WatchlistPage,
    propNames: [],
    withStore: true
  },
  TwitterFeed: {
    Component: TwitterFeed,
    propNames: ['user'],
    withStore: false
  },
  RedditFeed: {
    Component: RedditFeed,
    propNames: ['subreddit'],
    withStore: false
  },
  GlobalCoinSearch: {
    Component: GlobalCoinSearch,
    propNames: [],
    withStore: true
  },
  IcoFilters: {
    Component: IcoFilters,
    propNames: ['industriesJson'],
    withStore: true
  }
}

const injectComponents = () => {
  const hooks = document.getElementsByTagName('component')
  const { store, persistor } = configureStore()
  if (hooks) {
    Array.from(hooks).forEach(hook => {
      const name = hook.getAttribute('name')
      const opts = componentOptions[name]
      if (!opts)
        return console.error(`React component options not found for ${name}`)
      const { Component, withStore, propNames } = opts
      const props = {}
      propNames.forEach(name => {
        let attr = hook.getAttribute(name)
        if (name.endsWith('Json')) attr = JSON.parse(attr)
        props[name] = attr
      })
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

document.addEventListener('DOMContentLoaded', () => {
  window.screenSize = getScreenSize()
  injectComponents()
})

window.addEventListener(
  'resize',
  debounce(() => {
    window.screenSize = getScreenSize()
  }),
  500
)
