import * as React from 'react'
import CoinListItem from '~/bundles/common/components/CoinListItem'
import classnames from 'classnames'
import { withStyles, createStyles } from '@material-ui/core/styles'
import { Coin } from '~/bundles/common/types'
import { openSignUpModal } from '~/bundles/common/utils/modals'
import { btn, btnBlue, btnBlueDark } from '../styles/buttons'

const styles = (theme) => {
  const isDarkMode = theme.palette.type === 'dark'

  return createStyles({
    root: {
      flex: '1 1 auto',
      minWidth: 0,
      minHeight: 0,
      position: 'relative',
      overflowY: 'scroll',
      WebkitOverflowScrolling: 'touch',
    },
    ctaText: {
      color: theme.palette.text.primary,
      padding: '1rem',
      textAlign: 'center',
    },
    ctaBtn: {
      ...btn(theme),
      ...(isDarkMode ? btnBlueDark : btnBlue),
      marginTop: '1rem',
      [theme.breakpoints.down('sm')]: {
        display: 'block',
      },
    },
  })
}

interface Props {
  classes: any
  isWatchlist: boolean
  list: Coin[]
  loggedIn: boolean
  onSelectCoin: (coin: Coin) => void
  generateLink?: (coin: Coin) => string
  selectedCoinSlug?: string
}

const CoinList = (props: Props) => (
  <div className={classnames(props.classes.root, 'coinlist-root')}>
    {!props.loggedIn && props.isWatchlist ? (
      <div className={classnames(props.classes.ctaText, 'coinlist-cta')}>
        Sign up to see coins on your Watchlist here.
        <a
          className={classnames(props.classes.ctaBtn, 'coinlist-cta-btn')}
          onClick={openSignUpModal}
        >
          Sign Up Now
        </a>
      </div>
    ) : (
      props.list.map((coin) => (
        <CoinListItem
          key={coin.id}
          coin={coin}
          loggedIn={props.loggedIn}
          onSelectCoin={props.onSelectCoin}
          generateLink={props.generateLink}
          isSelected={
            !!props.selectedCoinSlug && props.selectedCoinSlug === coin.slug
          }
        />
      ))
    )}
  </div>
)

export default withStyles(styles)(CoinList)
