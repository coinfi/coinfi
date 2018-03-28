import React from 'react'
import ReactDOM from 'react-dom'
import TwitterFeed from './TwitterFeed'

document.addEventListener('DOMContentLoaded', () => {
  const twitterContainer = document.getElementById('twitter-feed')
  if (twitterContainer) {
    ReactDOM.render(
      <TwitterFeed user={twitterContainer.getAttribute('data-user')} />,
      twitterContainer
    )
  }
})
