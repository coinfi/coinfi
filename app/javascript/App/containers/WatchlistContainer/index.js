import React from 'react'
import API from '../../utils/localAPI'
import normalize from './normalize'

const WatchlistContainer = Component => {
  class HOC extends React.Component {
    state = {
      category: 'listed',
      search: '',
      coins: {},
      articles: {},
      tags: {}
    }
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
    selectCategory = category => () => {
      this.setState({ category })
    }
    searchCoins = search => {
      this.setState({ search })
    }
    selectedCoins = () => {
      const { coins, category, search } = this.state
      const selectedIDs = Object.keys(coins).filter(
        id => coins[id].category === category
      )
      if (search === '') return selectedIDs.map(id => coins[id])
      return selectedIDs
        .filter(id =>
          coins[id].name.toLowerCase().includes(search.toLowerCase())
        )
        .map(id => coins[id])
    }
    componentDidMount() {
      this.fetchCoins()
      this.fetchArticles()
    }
    render() {
      const { articles, tags } = this.state
      const { selectCategory, searchCoins } = this
      const cProps = {
        searchCoins,
        selectCategory,
        articles,
        tags,
        coins: this.selectedCoins()
      }
      return <Component {...cProps} />
    }
  }
  return HOC
}

export default WatchlistContainer
