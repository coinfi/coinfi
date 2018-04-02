import React from 'react'
import ReactDOM from 'react-dom'
import WatchButton from '../../components/watchlist/WatchButton'
import WatchlistPage from '../../pages/WatchlistPage'

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
    ReactDOM.render(<WatchlistPage />, c)
  }
})
