import * as React from 'react'
import CoinListContext, {
  CoinListContextType,
} from '~/bundles/common/contexts/CoinListContext'
import ExchangeListingsPage from './ExchangeListingsPage'
import { Listing } from '~/bundles/ExchangeListings/types'

interface Props {
  user: any
  initialListings: Listing[]
  quoteSymbols: string[]
  exchanges: string[]
}

const ExchangeListingsContainer = (props: Props) => (
  <CoinListContext.Consumer>
    {(payload: CoinListContextType) => (
      <ExchangeListingsPage
        initialListings={props.initialListings}
        quoteSymbols={props.quoteSymbols}
        exchanges={props.exchanges}
        loggedIn={!!props.user}
        selectedCoinSlug={payload.selectedCoinSlug}
        selectCoinBySlug={payload.selectCoinBySlug}
        watchlist={payload.watchlist}
        getWatchlist={payload.getWatchlist}
      />
    )}
  </CoinListContext.Consumer>
)

export default ExchangeListingsContainer
