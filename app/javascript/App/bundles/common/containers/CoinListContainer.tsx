import * as React from 'react'
import * as _ from 'lodash'
import { normalize, schema } from 'normalizr'
import API from '../../../lib/API'
import normalizers from '../../../normalizers'
import CoinListContext, {
  CoinListContextType,
} from '~/bundles/common/contexts/CoinListContext'
import { Coin } from '~/bundles/common/types'

const STATUSES = {
  INITIALIZING: 'Initializing',
  REFETCHING_WATCHLIST: 'RefetchingWatchList',
  ADDING_NEW_COIN_TO_WATCHLIST: 'AddingNewCoinToWatchList',
  REMOVING_COIN_FROM_WATCHLIST: 'RemovingNewCoinFromWatchList',
  READY: 'Ready',
  // TODO: Add API failure statuses.
}

const normalizeCoins = (coinsData) => {
  const coinSchema = new schema.Entity('coins')
  const coinListSchema = [coinSchema]
  return normalize(coinsData, coinListSchema)
}

interface Props {
  loggedIn: boolean
  initialToplistData?: any[]
  initialWatchlistData?: any[]
}

interface State {
  status: string
  isWatchlist: boolean
  toplistIndex: number[]
  toplist: Coin[]
  watchlistIndex: number[]
  watchlist: Coin[]
  selectedCoinSlug: string | null
}

class CoinListContainer extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)

    // Normalize toplist
    const normalizedInitialToplist = props.initialToplistData
      ? normalizeCoins(props.initialToplistData)
      : undefined
    const initialToplist = normalizedInitialToplist
      ? normalizedInitialToplist.entities.coins
      : undefined
    const initialToplistIndex = normalizedInitialToplist
      ? normalizedInitialToplist.result
      : undefined

    // Normalize watchlist
    const normalizedInitialWatchlist = props.initialWatchlistData
      ? normalizeCoins(props.initialWatchlistData)
      : undefined
    const initialWatchlist = normalizedInitialWatchlist
      ? normalizedInitialWatchlist.entities.coins
      : undefined
    const initialWatchlistIndex = normalizedInitialWatchlist
      ? normalizedInitialWatchlist.result
      : undefined

    // Set initial status
    const statusIsReady = props.loggedIn
      ? !_.isUndefined(initialToplist) && !_.isUndefined(initialWatchlist)
      : !_.isUndefined(initialToplist)
    const initialStatus = statusIsReady ? STATUSES.READY : undefined

    this.state = {
      status: initialStatus || STATUSES.INITIALIZING,
      isWatchlist: false,
      toplistIndex: initialToplistIndex || [],
      toplist: initialToplist || [],
      watchlistIndex: initialWatchlistIndex || [],
      watchlist: initialWatchlist || [],
      selectedCoinSlug: null,
    }
  }

  public componentDidMount = () => {
    // If required data is set provided so we don't need to perform an initial fetch
    if (this.state.status === STATUSES.READY) {
      return
    }

    if (this.props.loggedIn) {
      this.getToplistAndWatchlistOnMount()
    } else {
      this.getToplistOnMount()
    }
  }

  public getToplistOnMount = () => {
    this.fetchToplist().then((res) => {
      this.setState({
        status: STATUSES.READY,
        toplistIndex: res.result,
        toplist: res.entities.coins,
      })
    })
  }

  public getToplistAndWatchlistOnMount = () =>
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

  public showToplist = () => {
    this.setState((state) => ({ isWatchlist: false }))
  }

  public showWatchlist = () => {
    this.setState((state) => ({ isWatchlist: true }))
  }

  public fetchToplist = () =>
    API.get('/coins/toplist', {}, false).then((response) =>
      Promise.resolve(normalizers.coins(response.payload)),
    )

  public fetchWatchlist = () =>
    API.get('/coins/watchlist', {}, false).then((response) =>
      Promise.resolve(normalizers.coins(response.payload)),
    )

  public persistCoinToWatchlist = (id) =>
    API.post('/watchlist/coins', { id }, false)

  public addCoinToWatchlist = (coinId) =>
    this.setState({ status: STATUSES.ADDING_NEW_COIN_TO_WATCHLIST }, () =>
      this.persistCoinToWatchlist(coinId)
        .then(this.fetchWatchlist)
        .then(({ result, entities }) =>
          this.setState({
            status: STATUSES.READY,
            watchlistIndex: result,
            watchlist: entities.coins,
          }),
        ),
    )

  public deleteCoinFromWatchlist = (id) =>
    API.delete(`/watchlist/coins/${id}`, {}, false)

  public removeCoinFromWatchlist = (coinId) =>
    this.setState({ status: STATUSES.REMOVING_COIN_FROM_WATCHLIST }, () =>
      this.deleteCoinFromWatchlist(coinId)
        .then(this.fetchWatchlist)
        .then(({ result, entities }) =>
          this.setState({
            status: STATUSES.READY,
            watchlistIndex: result,
            watchlist: entities.coins,
          }),
        ),
    )

  public isCoinInWatchlist = (coinId) =>
    this.state.watchlistIndex.includes(coinId)

  public isInitializing = () => this.state.status === STATUSES.INITIALIZING

  public getToplistArray = (): Coin[] =>
    this.state.toplistIndex.map((id) => this.state.toplist[id])

  public getWatchlistArray = (): Coin[] =>
    this.state.watchlistIndex.map((id) => this.state.watchlist[id])

  public getCoinList = () => {
    switch (this.state.status) {
      case STATUSES.INITIALIZING:
        return null
      default:
        return this.state.isWatchlist
          ? this.getWatchlistArray()
          : this.getToplistArray()
    }
  }

  public selectCoinBySlug = (coinSlug: string) =>
    this.setState({
      selectedCoinSlug: coinSlug,
    })

  public render = () => {
    const payload: CoinListContextType = {
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
      isLoading: this.state.status !== STATUSES.READY,
      isReady: this.state.status === STATUSES.READY,
      selectedCoinSlug: this.state.selectedCoinSlug,
      selectCoinBySlug: this.selectCoinBySlug,
    }

    return (
      <CoinListContext.Provider value={payload}>
        {this.props.children}
      </CoinListContext.Provider>
    )
  }
}

export default CoinListContainer
