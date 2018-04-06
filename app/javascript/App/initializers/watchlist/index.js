import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import WatchButton from '../../components/WatchButton'
import WatchlistPageContainer from '../../containers/WatchlistPageContainer'
import configureStore from './configureStore'

document.addEventListener('DOMContentLoaded', () => {
  // Watch buttons
  let c = document.getElementsByClassName('watchlist-button')
  if (c) {
    Array.from(c).forEach(cc => {
      const props = {
        coinID: cc.getAttribute('data-coin-id')
      }
      ReactDOM.render(<WatchButton {...props} />, cc)
    })
  }
  // Watchlist page
  c = document.getElementById('watchlist-page')
  if (c) {
    ReactDOM.render(
      <Provider store={configureStore()}>
        <WatchlistPageContainer />
      </Provider>,
      c
    )
  }
})
