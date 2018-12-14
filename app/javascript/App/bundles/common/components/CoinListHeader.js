import React, { Component } from 'react'
import { withStyles, createStyles } from '@material-ui/core/styles'
import classnames from 'classnames'
import CoinListContext from '../contexts/CoinListContext'

const styles = (theme) =>
  createStyles({
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
      '&.active': {
        borderBottom: '2px solid #23adf0 !important',
      },
    },
    linkRoot: {
      cursor: 'pointer',
      fontWeight: 100,
      color: '#555',
      '&.active': {
        color: '#23adf0 !important',
      },
    },
  })
class CoinListHeader extends Component {
  render() {
    const { classes } = this.props
    return (
      <CoinListContext.Consumer>
        {(payload) => {
          return (
            <div
              id="panel-header"
              className="b--b flex-none flex justify-between items-center bg-athens tabs"
            >
              <div
                className={classnames(classes.tabRoot, {
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
                className={classnames(classes.tabRoot, {
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
