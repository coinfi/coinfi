import * as React from 'react'
import CoinList from '~/bundles/common/components/CoinList'
import CoinListHeader from './CoinListHeader'
import CoinListContext, {
  CoinListContextType,
} from '~/bundles/common/contexts/CoinListContext'
import LoadingIndicator from './LoadingIndicator'
import { Coin } from '~/bundles/common/types'

interface Props {
  loggedIn: boolean
  onClick?: (slug: string) => void
  isWatchlist?: boolean
}

const CoinListWrapper = (props: Props) => (
  <CoinListContext.Consumer>
    {(payload: CoinListContextType) => {
      return payload.isInitializing() ? (
        <>
          <CoinListHeader />
          <div className="pa3 tc mt4">
            <LoadingIndicator />
          </div>
        </>
      ) : (
        <>
          <CoinListHeader />
          <CoinList
            list={payload.coinlist}
            loggedIn={props.loggedIn}
            isWatchlist={props.isWatchlist}
            selectedCoinSlug={payload.selectedCoinSlug}
            onSelectCoin={(coin: Coin) => {
              payload.selectCoinBySlug(coin.slug)
              if (props.onClick) {
                props.onClick(coin.slug)
              }
            }}
          />
        </>
      )
    }}
  </CoinListContext.Consumer>
)

export default CoinListWrapper
