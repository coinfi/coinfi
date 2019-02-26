import * as React from 'react'
import { withStyles, createStyles } from '@material-ui/core/styles'

const styles = (theme) => {
  return createStyles({
    root: {
      display: 'flex',
      justifyContent: 'space-between',
      color: theme.palette.text.secondary,
      fontSize: '0.875rem',
    },
    accentText: {
      fontWeight: 600,
      color: theme.palette.primary.main,
    },
  })
}

const MarketMoving = ({ classes }) => {
  return (
    <div className={classes.root}>
      <div>Only show market moving stories</div>
      <div className={classes.accentText}>Coming Soon!</div>
    </div>
  )
}

export default withStyles(styles)(MarketMoving)
