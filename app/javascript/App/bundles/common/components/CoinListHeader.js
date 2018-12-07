import React, { Component } from 'react'
import { withStyles, createStyles } from '@material-ui/core'
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
    },
    linkRoot: {
      cursor: 'pointer',
      fontWeight: 100,
    },
  })

const tabStyles = (selected) => ({
  borderBottom: selected
    ? '2px solid #23adf0 !important'
    : '2px solid transparent !important',
})

const linkStyles = (selected) => ({
  color: selected ? '#23adf0 !important' : '#555 !important',
})

class CoinListHeader extends Component {
  render() {
    const { classes } = this.props
    return (
      <CoinListContext.Consumer>
        {(payload) => (
          <div
            id="panel-header"
            className="b--b flex-none flex justify-between items-center bg-athens tabs"
          >
            <div
              className={classes.tabRoot}
              style={tabStyles(!payload.isWatchlist)}
              onClick={payload.showToplist}
            >
              <a
                data-head="toplist-toggle"
                className={classes.linkRoot}
                style={linkStyles(!payload.isWatchlist)}
              >
                Toplist
              </a>
            </div>
            <div
              className={classes.tabRoot}
              style={tabStyles(payload.isWatchlist)}
              onClick={payload.showWatchlist}
            >
              <a
                data-head="watchlist-toggle"
                className={classes.linkRoot}
                style={linkStyles(payload.isWatchlist)}
              >
                Watchlist
              </a>
            </div>
          </div>
        )}
      </CoinListContext.Consumer>
    )
  }
}

export default withStyles(styles, { withTheme: true })(CoinListHeader)
