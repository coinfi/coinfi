import React from 'react'
import API from '../../lib/localAPI'
import normalize from './normalize'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { createStructuredSelector } from 'reselect'

const WatchlistContainer = Component => {
  class HOC extends React.Component {
    state = {
      category: 'listed',
      filterText: '',
      coins: {},
      articles: {},
      tags: {},
      searchedCoins: []
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
    searchCoins = searchTerm => {
      API.get('/coins.json', { q: { name_cont: searchTerm } }).then(
        ({ payload }) => {
          const searchedCoins = payload || []
          this.setState({ searchedCoins })
        }
      )
    }
    componentDidMount() {
      this.fetchCoins()
      this.fetchArticles()
    }
    render() {
      const { articles, tags, category, searchedCoins } = this.state
      const { selectCategory, searchCoins } = this
      const cProps = {
        searchCoins,
        searchedCoins,
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
  function mapDispatch(dispatch) {
    return {
      ...bindActionCreators({}, dispatch)
    }
  }

  const mapState = createStructuredSelector({})
  return connect(mapState, mapDispatch)(HOC)
}

export default WatchlistContainer
