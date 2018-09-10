import * as React from 'react'
import CoinCharts from '../../../components/CoinCharts'
import Currency from '../../../components/Currency'
import PercentageChange from './PercentageChange'
import WatchButton from './WatchButton'
import LoadingIndicator from '../../../components/LoadingIndicator'
import localAPI from '../../../lib/localAPI'

import { ICoinWithDetails } from '../types'

interface IProps {
  coinSlug?: string
  loggedIn: boolean
}

interface IState {
  coinWithDetails?: ICoinWithDetails
}

class CoinBody extends React.Component<IProps, IState> {
  public state = {
    coinWithDetails: null,
  }

  public componentDidMount() {
    if (!!this.props.coinSlug) {
      this.fetchCoinDetails()
    }
  }

  public componentDidUpdate(prevProps, prevState, snapshot) {
    if (!this.props.coinSlug) {
      if (!!prevState.coinWithDetails) {
        // coinSlug prop turns null
        this.setState({ coinWithDetails: null })
      }
    } else {
      if (!prevProps.coinSlug || prevProps.coinSlug !== this.props.coinSlug) {
        // coinSlug prop changed
        this.setState({ coinWithDetails: null }, () => this.fetchCoinDetails())
      }
    }
  }

  public fetchCoinDetails() {
    localAPI.get(`/coins/by-slug/${this.props.coinSlug}`).then((response) => {
      this.setState({
        coinWithDetails: response.payload,
      })
    })
  }

  public render() {
    const { loggedIn } = this.props
    const { coinWithDetails } = this.state

    if (!coinWithDetails) {
      return (
        <div className="pa3 tc mt4">
          <LoadingIndicator />
        </div>
      )
    }
    return (
      <div className="pa4 bg-white">
        <div className="flex justify-between items-center">
          <a
            href={`/coins/${coinWithDetails.slug}`}
            className="f4 fw6 flex items-center color-inherit"
          >
            {coinWithDetails.image_url && (
              <img
                className="w2e h2e mr3"
                src={coinWithDetails.image_url}
                alt=""
              />
            )}
            {coinWithDetails.name}
            <span className="ml2">({coinWithDetails.symbol})</span>
          </a>
          <div className="tooltipped">
            <WatchButton
              coin={coinWithDetails}
              loggedIn={loggedIn}
              hasText={true}
            />
            {!loggedIn && <div className="tooltip">Login to watch</div>}
          </div>
        </div>
        <div className="min-h12e flex items-center justify-center">
          <div className="tc">
            <div className="flex items-center">
              <span className="f2">
                <Currency>{coinWithDetails.market_info.price_usd}</Currency>
              </span>
              <span className="ml2">
                <PercentageChange
                  value={coinWithDetails.market_info.percent_change_24h}
                  className="b db"
                />
              </span>
            </div>
            <div className="dib ph2 pv1 bg-light-gray f6 mt2">
              {`Market: ${coinWithDetails.market_info.market_cap_usd}`}
            </div>
          </div>
        </div>
        <CoinCharts
          symbol={coinWithDetails.symbol}
          priceData={coinWithDetails.prices_data}
          annotations={coinWithDetails.news_data}
          isTradingViewVisible={true}
        />
      </div>
    )
  }
}

export default CoinBody
