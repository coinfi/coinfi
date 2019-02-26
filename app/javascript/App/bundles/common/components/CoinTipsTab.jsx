import React from 'react'
import * as _ from 'lodash'
import { withStyles, createStyles } from '@material-ui/core/styles'
import { athensDarker, darkSkyBlue, darkerSkyBlue } from '../styles/colors'
import { btn, btnBlue, btnBlueDark } from '../styles/buttons'

const btnStyle = {
  padding: '16px',
  borderRadius: 0,
  textTransform: 'none',
  fontSize: 14,
}

const styles = (theme) => {
  const isDarkMode = theme.palette.type === 'dark'

  return createStyles({
    root: {
      display: 'flex',
      flex: 'none',
      alignContent: 'center',
      justifyContent: 'space-between',
      borderColor: _.get(theme, ['palette', 'border', 'main'], athensDarker),
      borderBottomStyle: 'solid',
      borderBottomWidth: '1px',
      backgroundColor: theme.palette.background.default,
    },
    container: {
      display: 'flex',
      alignContent: 'center',
      flex: '1 1 auto',
      minWidth: 0,
      minHeight: 0,
    },
    coinsBtnTab: {
      ...btn(theme),
      ...(isDarkMode ? btnBlueDark : btnBlue),
      ...btnStyle,
      flex: '1 1 auto',
      minWidth: 0,
      minHeight: 0,
      justifyContent: 'center',
      backgroundColor: `${isDarkMode ? darkerSkyBlue : darkSkyBlue} !important`,
    },
    tipsBtnTab: {
      ...btn(theme),
      ...(isDarkMode ? btnBlueDark : btnBlue),
      ...btnStyle,
      flex: '1 1 auto',
      minWidth: 0,
      minHeight: 0,
      justifyContent: 'center',
    },
  })
}

const CoinTipsTabs = function(props) {
  const { classes } = props
  return (
    <div id="coin-tips-tab" className={classes.root}>
      <div className={classes.container}>
        <button
          className={classes.coinsBtnTab}
          onClick={props.showCoinListDrawer}
        >
          <i className="material-icons f6 mr1">list</i>
          <span className="f6">Coins</span>
        </button>
        <button className={classes.tipsBtnTab} onClick={props.showTips}>
          <i className="material-icons f6 mr1">announcement</i>
          <span className="f6">Tips</span>
        </button>
      </div>
    </div>
  )
}

export default withStyles(styles)(CoinTipsTabs)
