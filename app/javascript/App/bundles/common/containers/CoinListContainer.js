import React, { Component } from 'react'
import API from '../../../lib/API'
import normalizers from '../../../normalizers'
import CoinListContext from '../../../contexts/CoinListContext'

const STATUSES = {
  INITIALIZING: 'Initializing',
  REFETCHING_WATCHLIST: 'RefetchingWatchList',
  ADDING_NEW_COIN_TO_WATCHLIST: 'AddingNewCoinToWatchList',
  REMOVING_COIN_FROM_WATCHLIST: 'RemovingNewCoinFromWatchList',
  READY: 'Ready',
  // TODO: Add API failure statuses.
}

class CoinListContainer extends Component {
  state = {
    status: STATUSES.INITIALIZING,
    isWatchlist: false,
    toplistIndex: null,
    toplist: null,
    watchlistIndex: null,
    watchlist: null,
  }

  componentDidMount = () => {
    if (this.props.user) {
      this.getToplistAndWatchlistOnMount()
    } else {
      this.getToplistOnMount()
    }
  }

  getToplistOnMount = () => {
    this.fetchToplist().then((res) => {
      console.log(res)
      this.setState({
        status: STATUSES.READY,
        toplistIndex: res.result,
        toplist: res.entities.coins,
      })
    })
  }

  getToplistAndWatchlistOnMount = () =>
    Promise.all([this.fetchToplist(), this.fetchWatchlist()]).then(
      (toplist, watchlist) => {
        this.setState({
          status: STATUSES.READY,
          toplistIndex: toplist.result,
          toplist: toplist.entities.coins,
          watchlistIndex: watchlist.result,
          watchlist: watchlist.entities.coins,
        })
      },
    )

  showToplist = () => {
    console.log('showToplist')
    this.setState((state) => ({ isWatchlist: false }))
  }

  showWatchlist = () => {
    console.log('showWatchlist')
    this.setState((state) => ({ isWatchlist: true }))
  }

  fetchToplist = () =>
    API.get('/newsfeed/coins', {}, false).then((response) =>
      Promise.resolve(normalizers.coins(response.payload)),
    )

  fetchWatchlist = () =>
    // TODO: Write Watchlist endpoint.
    API.get('/newsfeed/coins', {}, false).then((response) =>
      Promise.resolve(normalizers.coins(response.payload)),
    )

  // TODO: Figure out what
  persistCoinToWatchlist = (coinId) =>
    API.put('/watchlist/coins', { coinId }, false)

  addCoinToWatchlist = (coinId) =>
    this.setState({ status: STATUSES.ADDING_NEW_COIN_TO_WATCHLIST }, () =>
      this.persistCoinToWatchlist(coinId).then(() =>
        this.fetchWatchlist().then(({ result, entities }) =>
          this.setState({
            status: STATUSES.READY,
            watchlistIndex: result,
            watchlist: entities.coins,
          }),
        ),
      ),
    )

  isCoinInWatchlist = (coinId) => this.state.watchlistIndex.includes(coinId)

  render = () => this.props.children
}

export default CoinListContainer

/*
    <CoinListContext.Provider
      value={{
        status: this.state.status,
        watchlist: this.state.watchlist,
        toplist: this.state.toplist,
        isCoinInWatchlist: this.isCoinInWatchlist,
        addCoinToWatchlist: this.addCoinToWatchlist,
      }}
    >
      {this.props.children}
    </CoinListContext.Provider>
<CoinListContext.Consumer>
  {(payload) => payload.watchlist.map}
</CoinListContext.Consumer>
*/
