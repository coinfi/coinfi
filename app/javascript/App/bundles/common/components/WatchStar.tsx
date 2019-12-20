import * as React from 'react'
import * as _ from 'lodash'
import classnames from 'classnames'
import Icon from './Icon'
import CoinListContext from '../contexts/CoinListContext'
import { withStyles, createStyles } from '@material-ui/core/styles'
import {
  btn,
  btnXs,
  btnBlueOutline,
  btnGray,
  btnBlue,
} from '~/bundles/common/styles/buttons'
import { aqua, black12, white12 } from '~/bundles/common/styles/colors'
import { openSignUpModal } from '~/bundles/common/utils/modals'

interface CoinForWatchSatr {
  id: number
}

interface Props {
  classes: any
  coin: CoinForWatchSatr
  hasText: boolean
  loggedIn: boolean
}

const styles = (theme) => {
  const isDarkMode = theme.palette.type === 'dark'

  return createStyles({
    starIcon: {
      color: isDarkMode ? white12 : black12,
    },
    starIconSelected: {
      color: _.get(theme, ['palette', 'primary', 'main'], aqua),
    },
    starIconButton: {
      ...btn(theme),
      ...btnXs(theme),
      ...(isDarkMode ? btnBlueOutline : btnGray),
    },
    starIconButtonSelected: {
      ...btn(theme),
      ...btnXs(theme),
      ...(isDarkMode ? btnBlueOutline : btnBlue),
    },
  })
}

const WatchStar = ({ coin, hasText, loggedIn, classes }: Props) => {
  return (
    <CoinListContext.Consumer>
      {(payload) => {
        if (loggedIn) {
          if (payload.isCoinInWatchlist(coin.id)) {
            return (
              <Icon
                name="star"
                solid={true}
                className={classnames(classes.starIconSelected, {
                  [classes.starIconButtonSelected]: hasText,
                })}
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  payload.removeCoinFromWatchlist(coin.id)
                }}
              >
                {hasText && 'Watching'}
              </Icon>
            )
          } else {
            return (
              <Icon
                dataHeapTag="news-add-coin-to-watchlist-button"
                name="star"
                className={classnames(classes.starIcon, {
                  [classes.starIconButton]: hasText,
                })}
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  payload.addCoinToWatchlist(coin.id)
                }}
              >
                {hasText && 'Watch'}
              </Icon>
            )
          }
        }

        return (
          <Icon
            name="star"
            className={classnames(classes.starIcon, {
              [classes.starIconButton]: hasText,
            })}
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              // TODO: Implement new onboarding signup flow.
              openSignUpModal()
            }}
          >
            {hasText && 'Watch'}
          </Icon>
        )
      }}
    </CoinListContext.Consumer>
  )
}

export default withStyles(styles)(WatchStar)
