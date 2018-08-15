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
      console.log(this.props)
      this.getToplistAndWatchlistOnMount()
    } else {
      this.getToplistOnMount()
    }
  }

  getToplistOnMount = () => {
    this.fetchToplist().then((res) => {
      this.setState({
        status: STATUSES.READY,
        toplistIndex: res.result,
        toplist: res.entities.coins,
      })
    })
  }

  getToplistAndWatchlistOnMount = () =>
    Promise.all([this.fetchToplist(), this.fetchWatchlist()]).then(
      ([toplist, watchlist]) => {
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
    API.get('/coins/toplist', {}, false).then((response) =>
      Promise.resolve(normalizers.coins(response.payload)),
    )

  fetchWatchlist = () =>
    // TODO: Write Watchlist endpoint.
    API.get('/coins/watchlist', {}, false).then((response) =>
      Promise.resolve(normalizers.coins(response.payload)),
    )

  // TODO: Figure out what
  persistCoinToWatchlist = (coinId) =>
    API.put('/watchlist/coins', { coinId }, false)

  // FIXME: nested promises
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

  // TODO: check this because of comment above `persist...`
  deleteCoinFromWatchlist = (coinId) =>
    API.delete('/watchlist/coins', { coinId }, false)

  // FIXME: nested promises
  removeCoinFromWatchlist = (coinId) =>
    this.setState({ status: STATUSES.REMOVING_COIN_FROM_WATCHLIST }, () =>
      this.deleteCoinFromWatchlist(coinId).then(() =>
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

  isInitializing = () => this.state.status === STATUSES.INITIALIZING

  getToplistArray = () =>
    this.state.toplistIndex.map((id) => this.state.toplist[id])

  getWatchlistArray = () =>
    this.state.watchlistIndex.map((id) => this.state.watchlist[id])

  getCoinList = () => {
    switch (this.state.status) {
      case STATUSES.INITIALIZING:
        return null
      default:
        return this.state.isWatchlist
          ? this.getWatchlistArray()
          : this.getToplistArray()
    }
  }

  render = () => (
    <CoinListContext.Provider
      value={{
        status: this.state.status,
        watchlist: this.state.watchlist,
        toplist: this.state.toplist,
        isInitializing: this.isInitializing,
        isWatchlist: this.state.isWatchlist,
        getWatchlist: this.getWatchlistArray,
        getToplist: this.getToplistArray,
        showWatchlist: this.showWatchlist,
        showToplist: this.showToplist,
        isCoinInWatchlist: this.isCoinInWatchlist,
        addCoinToWatchlist: this.addCoinToWatchlist,
        removeCoinFromWatchlist: this.removeCoinFromWatchlist,
        coinlist: this.getCoinList(),
      }}
    >
      {this.props.children}
    </CoinListContext.Provider>
  )
}

export default CoinListContainer
