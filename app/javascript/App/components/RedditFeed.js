import React, { Component } from 'react'
import axios from 'axios'
import RedditPost from './RedditPost'

class RedditFeed extends Component {
  state = { posts: [] }
  componentDidMount() {
    // Fetch posts and update state
    const { subreddit } = this.props
    axios
      .get(`https://www.reddit.com/r/${subreddit}/top/.json?sort=top&t=day`)
      .then(({ data: { data: { children } } }) => {
        this.setState({ posts: children })
      })
      .catch(error => {
        console.log(error)
      })
  }
  render() {
    return (
      <div className="nt4">
        {this.state.posts.map(({ data }, k) => (
          <RedditPost key={k} {...data} />
        ))}
      </div>
    )
  }
}

export default RedditFeed
