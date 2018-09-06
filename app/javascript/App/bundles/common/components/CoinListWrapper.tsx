import * as React from 'react'
import CoinList from '~/bundles/common/components/CoinList'
import CoinListHeader from './CoinListHeader'
import CoinListContext, {
  ICoinListContextType,
} from '~/contexts/CoinListContext'
import LoadingIndicator from '../../../components/LoadingIndicator'
import { ICoin } from '~/bundles/common/types'

interface IProps {
  loggedIn: boolean
}

const CoinListWrapper = (props: IProps) => (
  <CoinListContext.Consumer>
    {(payload: ICoinListContextType) => {
      return payload.isInitializing() ? (
        <LoadingIndicator />
      ) : (
        <>
          <CoinListHeader />
          <CoinList
            list={payload.coinlist}
            loggedIn={props.loggedIn}
            selectedCoinSlug={payload.selectedCoinSlug}
            onSelectCoin={(coin: ICoin) => payload.selectCoinBySlug(coin.slug)}
           />
        </>
      )
    }}
  </CoinListContext.Consumer>
)

export default CoinListWrapper
