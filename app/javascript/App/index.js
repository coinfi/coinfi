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
import WatchButton from './components/WatchButton'
import WatchlistPageContainer from './containers/WatchlistPageContainer'
import GlobalCoinSearch from './components/GlobalCoinSearch'
import TwitterFeed from './components/TwitterFeed'
import RedditFeed from './components/RedditFeed'

const componentMap = {
  WatchButton: {
    Component: WatchButton,
    propNames: ['coinID', 'watching']
  },
  WatchlistPage: { Component: WatchlistPageContainer, withStore: true },
  TwitterFeed: { Component: TwitterFeed, propNames: ['user'] },
  RedditFeed: { Component: RedditFeed, propNames: ['subreddit'] },
  GlobalCoinSearch: { Component: GlobalCoinSearch, withStore: true }
}

document.addEventListener('DOMContentLoaded', () => {
  const hooks = document.getElementsByTagName('component')
  if (hooks) {
    Array.from(hooks).forEach(hook => {
      const name = hook.getAttribute('name')
      const { Component, withStore, propNames } = componentMap[name]
      const props = {}
      if (propNames) {
        propNames.forEach(name => {
          props[name] = hook.getAttribute(name)
        })
      }
      if (withStore) {
        ReactDOM.render(
          <Provider store={configureStore()}>
            <Component />
          </Provider>,
          hook
        )
      } else {
        ReactDOM.render(<Component {...props} />, hook)
      }
    })
  }
})
