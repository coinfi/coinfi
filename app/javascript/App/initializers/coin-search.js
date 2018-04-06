import React from 'react'
import ReactDOM from 'react-dom'
import CoinSeach from '../components/CoinSearch'

document.addEventListener('DOMContentLoaded', () => {
  let c = document.getElementById('coin-search')
  if (c) ReactDOM.render(<CoinSeach />, c)
})
