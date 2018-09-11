import * as React from 'react'
import CoinList from '~/bundles/common/components/CoinList'
import CoinListHeader from './CoinListHeader'
import CoinListContext, {
  CoinListContextType,
} from '~/bundles/common/contexts/CoinListContext'
import LoadingIndicator from '../../../components/LoadingIndicator'
import { Coin } from '~/bundles/common/types'

interface Props {
  loggedIn: boolean
  onClick: any
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
            selectedCoinSlug={payload.selectedCoinSlug}
            onSelectCoin={(coin: Coin) => {
              payload.selectCoinBySlug(coin.slug)
              props.onClick()
            }}
          />
        </>
      )
    }}
  </CoinListContext.Consumer>
)

export default CoinListWrapper
