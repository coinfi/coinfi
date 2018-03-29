import React from 'react'
import ReactDOM from 'react-dom'
import TwitterFeed from '../../components/TwitterFeed'
import RedditFeed from '../../components/RedditFeed'

document.addEventListener('DOMContentLoaded', () => {
  let c = document.getElementById('twitter-feed')
  if (c) {
    ReactDOM.render(<TwitterFeed user={c.getAttribute('data-user')} />, c)
  }
  c = document.getElementById('reddit-feed')
  if (c) {
    ReactDOM.render(
      <RedditFeed subreddit={c.getAttribute('data-subreddit')} />,
      c
    )
  }
})
