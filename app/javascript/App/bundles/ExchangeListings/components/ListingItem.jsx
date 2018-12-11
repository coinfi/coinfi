import React from 'react'
import moment from 'moment'
import { withStyles, createStyles } from '@material-ui/core/styles'

const styles = (theme) =>
  createStyles({
    spanDate: {
      color: 'rgba(0, 0, 0, 0.87)',
      fontSize: '14px',
    },
    span: {
      fontSize: '12px',
      color: 'rgba(0, 0, 0, 0.54)',
      marginLeft: '5px',
    },
  })

const ListingItem = (props) => {
  const { listing, classes } = props
  return (
    <div className="b--b tiber flex flex-auto">
      <div className="fl w-third pa3">
        <h3 className="ma0">{listing.symbol}</h3>
      </div>
      <div className="fl w-third pa3">{listing.exchange_name}</div>
      <div className="fl w-third pa3">
        <span className={classes.spanDate}>
          {moment(listing.detected_at).format('MMM DD, YYYY')}{' '}
        </span>
        <span className={classes.span}>
          {moment(listing.detected_at).format('hh:mm')}
        </span>
      </div>
    </div>
  )
}

export default withStyles(styles)(ListingItem)
