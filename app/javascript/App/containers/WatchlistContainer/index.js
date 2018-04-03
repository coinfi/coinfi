import React from 'react'
import API from '../../utils/localAPI'
import normalize from './normalize'

const WatchlistContainer = Component => {
  class HOC extends React.Component {
    state = {
      category: 'listed',
      filterText: '',
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
    filterCoins = filterText => {
      this.setState({ filterText })
    }
    filteredCoins = () => {
      const { coins, category, filterText } = this.state
      let selectedIDs = Object.keys(coins).filter(
        id => coins[id].category === category
      )
      if (filterText !== '')
        selectedIDs = selectedIDs.filter(id =>
          coins[id].name.toLowerCase().includes(filterText.toLowerCase())
        )
      return selectedIDs.map(id => coins[id])
    }
    componentDidMount() {
      this.fetchCoins()
      this.fetchArticles()
    }
    render() {
      const { articles, tags, category } = this.state
      const { selectCategory, filterCoins } = this
      const cProps = {
        filterCoins,
        selectCategory,
        articles,
        tags,
        category,
        coins: this.filteredCoins()
      }
      console.log(cProps)
      return <Component {...cProps} />
    }
  }
  return HOC
}

export default WatchlistContainer
