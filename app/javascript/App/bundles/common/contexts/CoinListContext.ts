import * as React from 'react'
import { Coin } from '~/bundles/common/types'

export interface CoinListContextType {
  status: string
  watchlist: Coin[]
  toplist: Coin[]
  isInitializing: () => boolean
  isWatchlist: boolean
  getWatchlist: () => Coin[]
  getToplist: () => Coin[]
  showWatchlist: () => void
  showToplist: () => void
  isCoinInWatchlist: (id: number) => boolean
  addCoinToWatchlist: (id: number) => void
  removeCoinFromWatchlist: (id: number) => void
  coinlist: Coin[]
  selectedCoinSlug: string | null
  isLoading: boolean
  isReady: boolean
  selectCoinBySlug: (coinSlug: string) => void
}

const CoinListContext = React.createContext<CoinListContextType>(null)

export default CoinListContext
