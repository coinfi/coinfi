/*
 * Normally this file would just mount the app on the document body, however
 * this is not an SPA, so it looks for <component> tags in the DOM and injects
 * React components there, optionally with the Redux store.
 */
import 'babel-polyfill'

import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { BrowserRouter as Router, Route, Link } from 'react-router-dom'
import configureStore from './configureStore'
import getScreenSize from './lib/screenSize'
import { PersistGate } from 'redux-persist/integration/react'
import debounce from 'debounce'

import appContainer from './containers/app'

import WatchButton from './components/WatchButton'
import GlobalCoinSearch from './components/GlobalCoinSearch'
import TwitterFeed from './components/TwitterFeed'
import RedditFeed from './components/RedditFeed'
import IcoFilters from './components/IcoFilters'
import ExchangeListingsPage from './bundles/ExchangeListings/client'
import NewsfeedPage from './components/NewsfeedPage'
import NewsfeedPageNew from './bundles/NewsfeedPage/NewsfeedPageContainer'
import Tabs from './components/Tabs'
import CoinCharts from './components/CoinCharts'
import CalendarPage from './bundles/CalendarPage/CalendarPage'
import CoinIndex from './components/CoinIndex'
import CoinShow from './components/CoinShow'
import scrollHelper from './scrollHelper'
import NewsfeedContainer from './bundles/common/containers/NewsfeedContainer'
import CoinListContainer from './bundles/common/containers/CoinListContainer'

const injectableComponents = {
  WatchButton,
  GlobalCoinSearch,
  TwitterFeed,
  RedditFeed,
  IcoFilters,
  ExchangeListingsPage,
  NewsfeedPage,
  Tabs,
  CoinCharts,
  CalendarPage,
  CoinIndex,
  CoinShow,
}

const injectComponents = () => {
  const hooks = document.getElementsByTagName('component')
  if (hooks) {
    const { store, persistor } = configureStore()
    Array.from(hooks).forEach((hook) => {
      const name = hook.getAttribute('name')
      const Component = injectableComponents[name]
      if (!Component) return console.error(`Component "${name}" not found`)
      const props = JSON.parse(hook.getAttribute('props'))
      const withStore = hook.getAttribute('withStore') !== null
      if (withStore) {
        // This is the custom flag for `feature/toplist-watchlist` branch
        if (true) {
          console.warn(
            'we are using the new approach to show the app with React context (without redux)',
          )
          ReactDOM.render(
            <NewsfeedContainer>
              <CoinListContainer user={props.user}>
                <Provider store={store}>
                  <Router>
                    <div>
                      <Route
                        exact
                        path="/news/:coinSlug?"
                        render={(routeProps) => (
                          <NewsfeedPageNew
                            coinSlug={routeProps.match.params.coinSlug}
                          />
                        )}
                      />
                      <Route
                        exact
                        path="/news/:newsItemId/:newsItemSlug"
                        render={(routeProps) => (
                          <NewsfeedPageNew
                            newsItemId={routeProps.match.params.newsItemId}
                          />
                        )}
                      />
                      <Route
                        path="/listings"
                        render={() => <ExchangeListingsPage {...props} />}
                      />
                      <Route
                        path="/calendar"
                        render={() => <CalendarPage {...props} />}
                      />
                    </div>
                  </Router>
                </Provider>
              </CoinListContainer>
            </NewsfeedContainer>,
            hook,
          )
        } else {
          const AppComponent = appContainer(Component)
          ReactDOM.render(
            <Provider store={store}>
              <PersistGate loading={null} persistor={persistor}>
                <AppComponent {...props} />
              </PersistGate>
            </Provider>,
            hook,
          )
        }
      } else {
        ReactDOM.render(<Component {...props} />, hook)
      }
    })
  }
}

const setScreenSize = () => {
  window.screenSize = getScreenSize()
  window.isMobile = !['m', 'l'].includes(window.screenSize)
  window.isTablet = window.screenSize === 'm'
  window.isDesktop = window.screenSize === 'l'
}

document.addEventListener('DOMContentLoaded', () => {
  setScreenSize()
  injectComponents()
})

window.addEventListener('resize', debounce(setScreenSize), 400)
window.addEventListener('resize', debounce(scrollHelper), 400)
