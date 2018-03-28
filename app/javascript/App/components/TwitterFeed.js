import React, { Component } from 'react'
import axios from 'axios'
import Tweet from 'react-tweet'

class TwitterFeed extends Component {
  state = { tweets: [] }
  username = () => {
    // Extract username from URL
    const { user } = this.props
    const parts = user.split('/')
    if (parts.length > 1) return parts.reverse()[0]
    return user
  }
  componentDidMount() {
    // Fetch tweets and update state
    axios
      .get(`/social_feeds/tweets_by_user.json?user=${this.username()}`)
      .then(({ data }) => {
        this.setState({ tweets: data })
      })
      .catch(error => {
        console.log(error)
      })
  }
  render() {
    return (
      <div>
        {this.state.tweets.map(tweet => (
          <Tweet key={tweet.id} data={tweet} linkProps={{ target: '_blank' }} />
        ))}
      </div>
    )
  }
}

export default TwitterFeed
