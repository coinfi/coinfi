import * as React from 'react'
import * as _ from 'lodash'
import classNames from 'classnames'
import PercentageChange from '~/bundles/common/components/PercentageChange'
import WatchStar from '~/bundles/common/components/WatchStar'
import { Coin } from '~/bundles/common/types'
import { withStyles, createStyles } from '@material-ui/core/styles'
import CurrencyContext, {
  CurrencyContextType,
} from '~/bundles/common/contexts/CurrencyContext'
import { athensDarker, foam } from '~/bundles/common/styles/colors'

interface Props {
  classes: any
  coin: Coin
  loggedIn: boolean
  isSelected: boolean
  onSelectCoin: (coin: Coin) => void
  generateLink?: (coin: Coin) => string
}

const styles = (theme) =>
  createStyles({
    root: {
      padding: '0.75rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      flex: '1 1 auto',
      minWidth: 0,
      minHeight: 57,
      borderColor: _.get(theme, ['palette', 'border', 'main'], athensDarker),
      borderBottomStyle: 'solid',
      borderBottomWidth: '1px',
      color: _.get(theme, ['palette', 'text', 'primary'], '#555'),
    },
    selected: {
      background: _.get(theme, ['palette', 'background', 'selected'], foam),
    },
  })

const roundToDecimalPlaces = (num, places) =>
  Math.round(num * 10 ** places) / 10 ** places

const CoinListItem = (props: Props) => (
  <CurrencyContext.Consumer>
    {({ currencyRate, currencySymbol }: CurrencyContextType) => {
      const { coin, loggedIn, generateLink, classes } = props

      const coinPrice =
        parseFloat(_.get(coin, ['market_info', 'price_usd'])) * currencyRate
      const coinPriceFixed = roundToDecimalPlaces(coinPrice, 4)
      const percentChange = _.get(coin, ['market_info', 'change24h'])
      const link = !_.isUndefined(generateLink)
        ? generateLink(coin)
        : `/news/${coin.slug}`

      return (
        <a
          href={link}
          className={classNames(classes.root, {
            [classes.selected]: props.isSelected,
          })}
          onClick={(event) => {
            event.preventDefault()
            props.onSelectCoin(coin)
          }}
        >
          <WatchStar coin={coin} hasText={false} loggedIn={loggedIn} />
          <div className="flex-auto flex justify-between items-center">
            <div className="b f5 pl2">{coin.symbol}</div>
            {coin.market_info && (
              <div className="right-align">
                {coinPrice ? (
                  <>
                    <div>
                      {currencySymbol}
                      <span>{coinPriceFixed}</span>
                    </div>
                    <PercentageChange
                      value={percentChange}
                      className="smaller2 b db"
                    />
                  </>
                ) : (
                  <div className="smaller3">UNLISTED</div>
                )}
              </div>
            )}
          </div>
        </a>
      )
    }}
  </CurrencyContext.Consumer>
)

export default withStyles(styles)(CoinListItem)
