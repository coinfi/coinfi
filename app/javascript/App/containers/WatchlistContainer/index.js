import React from 'react'
import API from '../../utils/localAPI'
import normalize from './normalize'

const WatchlistContainer = Component => {
  class HOC extends React.Component {
    state = { coins: {}, articles: {}, tags: {} }
    fetchCoins = () => {
      API.get('/watchlist/coins.json').then(({ payload }) => {
        this.setState(normalize.coins(payload))
      })
    }
    fetchArticles = () => {
      API.get('/watchlist/articles.json').then(({ payload }) => {
        this.setState(normalize.articles(payload))
      })
    }
    componentDidMount() {
      this.fetchCoins()
      this.fetchArticles()
    }
    render() {
      console.log(this.state)
      return <Component {...this.state} />
    }
  }
  return HOC
}

export default WatchlistContainer
