import * as React from 'react'
import CoinListContext, { ICoinListContextType } from '~/bundles/common/contexts/CoinListContext'
import ExchangeListingsPage from './ExchangeListingsPage'
import { ICoin } from '~/bundles/common/types'
import { IListing } from '~/bundles/ExchangeListings/types'

interface IProps {
  user: any
  initialListings: IListing[]
  quoteSymbols: string[]
  exchanges: string[]
}

const ExchangeListingsContainer = (props: IProps) => (
  <CoinListContext.Consumer>
    {(payload: ICoinListContextType) => (
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
