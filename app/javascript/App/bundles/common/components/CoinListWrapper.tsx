import * as React from 'react'
import CoinList from '~/bundles/common/components/CoinList'
import CoinListHeader from './CoinListHeader'
import CoinListContext, {
  ICoinListContextType,
} from '~/bundles/common/contexts/CoinListContext'
import LoadingIndicator from '../../../components/LoadingIndicator'
import { ICoin } from '~/bundles/common/types'

interface IProps {
  loggedIn: boolean
  onClick: any
}

const CoinListWrapper = (props: IProps) => (
  <CoinListContext.Consumer>
    {(payload: ICoinListContextType) => {
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
            onSelectCoin={(coin: ICoin) => {
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
