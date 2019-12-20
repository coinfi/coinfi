import * as React from 'react'
import * as _ from 'lodash'
import * as moment from 'moment'
import { Grid } from '@material-ui/core'
import { withStyles, createStyles } from '@material-ui/core/styles'
import { formatValue } from '~/bundles/common/utils/numberFormatters'
import { black54 } from '~/bundles/common/styles/colors'

interface Props {
  coinObj: any
  currency: string
  classes: any
}

const styles = (theme) =>
  createStyles({
    title: {
      color: black54,
      marginBottom: '4px',
      fontSize: '12px',
      lineHeight: '22px',
    },
    value: {
      fontWeight: 'bold',
      color: '#555',
      marginBottom: '4px',
      fontSize: '14px',
      lineHeight: '22px',
      whiteSpace: 'nowrap',
    },
  })

class FundamentalsList extends React.Component<Props, {}> {
  public render() {
    const { coinObj, classes } = this.props
    const {
      available_supply,
      total_supply,
      release_date,
      blockchain_tech,
      algorithm,
      ico_start_epoch,
      ico_end_epoch,
    } = coinObj

    const hasStartDate = _.isString(release_date) && !!release_date.trim()
    const hasSupply =
      !_.isUndefined(available_supply) &&
      !_.isUndefined(total_supply) &&
      total_supply > 0
    const hasBlockchainType =
      _.isString(blockchain_tech) && !!blockchain_tech.trim()
    const hasAlgorithm = _.isString(algorithm) && !!algorithm.trim()
    const hasIco = _.isNumber(ico_start_epoch)
    const icoHasEnded = ico_end_epoch < moment().unix()

    return (
      <Grid container={true} direction="column">
        {hasStartDate && (
          <>
            <Grid item={true} className={classes.title}>
              Start date
            </Grid>
            <Grid item={true} className={classes.value}>
              {moment.utc(release_date, 'YYYY-MM-DD').format('MMMM DD, YYYY')}
            </Grid>
          </>
        )}
        {hasSupply && (
          <>
            <Grid item={true} className={classes.title}>
              % of supply in circulation
            </Grid>
            <Grid item={true} className={classes.value}>
              {formatValue((available_supply / total_supply) * 100, 1)}%
            </Grid>
          </>
        )}
        {hasBlockchainType && (
          <>
            <Grid item={true} className={classes.title}>
              Blockchain
            </Grid>
            <Grid item={true} className={classes.value}>
              {blockchain_tech}
            </Grid>
          </>
        )}
        {hasAlgorithm && (
          <>
            <Grid item={true} className={classes.title}>
              Algorithm
            </Grid>
            <Grid item={true} className={classes.value}>
              {algorithm}
            </Grid>
          </>
        )}
        {hasIco && (
          <>
            <Grid item={true} className={classes.title}>
              Completed ICO
            </Grid>
            <Grid item={true} className={classes.value}>
              {icoHasEnded ? 'Yes' : 'No'}
            </Grid>
          </>
        )}
      </Grid>
    )
  }
}

export default withStyles(styles)(FundamentalsList)
