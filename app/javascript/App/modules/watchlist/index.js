import React from 'react'
import ReactDOM from 'react-dom'
import WatchlistButton from '../../components/WatchlistButton'

document.addEventListener('DOMContentLoaded', () => {
  const c = document.getElementsByClassName('watchlist-button')
  if (c) {
    Array.from(c).forEach(cc => {
      const props = {
        coinID: cc.getAttribute('data-coin-id')
      }
      ReactDOM.render(<WatchlistButton {...props} />, cc)
    })
  }
})
