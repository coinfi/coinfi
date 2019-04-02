import React, { Component } from 'react'
import * as _ from 'lodash'
import { withStyles, createStyles } from '@material-ui/core/styles'
import classnames from 'classnames'
import CoinListContext from '../contexts/CoinListContext'
import { athensDarker } from '../styles/colors'

const styles = (theme) => {
  return createStyles({
    tabRoot: {
      padding: '0 !important',
      margin: '0 !important',
      flex: 1,
      height: '59px',
      alignItems: 'flex-end !important',
      display: 'flex !important',
      justifyContent: 'center !important',
      paddingBottom: '12px !important',
      borderBottom: '2px solid transparent',
      color: theme.palette.text.primary,
      '&.active': {
        borderColor: theme.palette.primary.main,
        borderBottomStyle: 'solid',
        borderBottomWidth: '2px',
      },
    },
    linkRoot: {
      cursor: 'pointer',
      fontWeight: 100,
      color: theme.palette.text.secondary,
      '&.active': {
        color: theme.palette.primary.main,
      },
    },
    panelHeader: {
      display: 'flex',
      flex: 'none',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderColor: _.get(theme, ['palette', 'border', 'main'], athensDarker),
      borderBottomStyle: 'solid',
      borderBottomWidth: '1px',
      backgroundColor: theme.palette.background.default,
    },
  })
}

class CoinListHeader extends Component {
  render() {
    const { classes } = this.props
    return (
      <CoinListContext.Consumer>
        {(payload) => {
          return (
            <div id="panel-header" className={classes.panelHeader}>
              <div
                className={classnames(classes.tabRoot, 'coinlist-tab', {
                  active: !payload.isWatchlist,
                })}
                onClick={payload.showToplist}
              >
                <a
                  data-head="toplist-toggle"
                  className={classnames(classes.linkRoot, {
                    active: !payload.isWatchlist,
                  })}
                >
                  Toplist
                </a>
              </div>
              <div
                className={classnames(classes.tabRoot, 'coinlist-tab', {
                  active: payload.isWatchlist,
                })}
                onClick={payload.showWatchlist}
              >
                <a
                  data-head="watchlist-toggle"
                  className={classnames(classes.linkRoot, {
                    active: payload.isWatchlist,
                  })}
                >
                  Watchlist
                </a>
              </div>
            </div>
          )
        }}
      </CoinListContext.Consumer>
    )
  }
}

export default withStyles(styles, { withTheme: true })(CoinListHeader)
