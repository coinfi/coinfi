import * as React from 'react'
import Drawer from './Drawer'
import Icon from './Icon'
import CoinListWrapper from '~/bundles/common/components/CoinListWrapper'
import { withStyles, createStyles } from '@material-ui/core/styles'
import { slate } from '~/bundles/common/styles/colors'

const styles = (theme) => {
  return createStyles({
    root: {
      display: 'flex',
      flex: '1 1 auto',
      minWidth: 0,
      minHeight: 0,
      flexDirection: 'column',
      width: '100%',
      maxWidth: '20em',
      background: theme.palette.background.paper,
    },
    closeIcon: {
      color: slate,
      fontSize: '1.25rem',
    },
  })
}

const CoinListDrawer = (props) => {
  const { classes, ...remainingProps } = props
  return (
    <Drawer
      {...remainingProps}
      position="left"
      className="flex"
      onClose={props.onClose}
    >
      <div className={classes.root}>
        <CoinListWrapper
          loggedIn={props.loggedIn}
          isWatchlist={props.isWatchlist}
          onClick={props.onClick}
        />
      </div>
      <div className="flex-auto flex items-center ph4" onClick={props.onClose}>
        <Icon name="times" className={classes.closeIcon} />
      </div>
    </Drawer>
  )
}

export default withStyles(styles)(CoinListDrawer)
