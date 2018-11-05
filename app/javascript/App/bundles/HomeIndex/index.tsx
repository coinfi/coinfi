import * as React from 'react'
import * as _ from 'lodash'
import compose from 'recompose/compose'
import withWidth, { isWidthDown } from '@material-ui/core/withWidth'
import {
  Grid,
  Typography,
  Paper,
  Button,
  createStyles,
  withStyles,
} from '@material-ui/core'
import CoinTable from './CoinTable'
import MarketDominance, {
  CoinDominance,
} from '~/bundles/common/components/MarketDominance'
import TotalMarketCap, {
  RawMarketCap,
} from '~/bundles/common/components/TotalMarketCap'
import NewsList from '~/bundles/common/components/NewsList'
import { CoinData } from './types'

interface Props {
  classes: any
  width: any
  coins: CoinData[]
  watchList: number[]
  loggedIn: boolean
  marketDominance: CoinDominance[]
  totalMarketCap: RawMarketCap[]
}

interface State {
  currency: string
}

const styles = (theme) =>
  createStyles({
    mainFeaturedPost: {
      backgroundColor: '#253640',
      color: '#d7d7d7',
      boxShadow: 'none',
    },
    mainFeaturedPostContent: {
      padding: `${theme.spacing.unit * 4}px`,
      [theme.breakpoints.up('md')]: {
        paddingLeft: 0,
        paddingRight: 0,
      },
    },
    header: {
      marginBottom: '0.5em !important',
      fontSize: '1.5rem',
      textAlign: 'center',
    },
    subheader: {
      fontSize: '0.8rem',
      textAlign: 'center',
      [theme.breakpoints.up('md')]: {
        fontSize: '1rem',
      },
    },
    cta: {
      backgroundColor: '#23adf0',
      color: '#fff',
      borderRadius: '2px',
      '&:hover': {
        backgroundColor: '#23adf0',
        boxShadow: '0 2px 10px rgba(14, 151, 255, 0.4)',
      },
    },
    widgetContainer: {
      backgroundColor: '#fff',
      [theme.breakpoints.up('md')]: {
        margin: '0 auto !important',
        maxWidth: '1200px',
        padding: `${theme.spacing.unit * 4}px`,
      },
      [theme.breakpoints.down('sm')]: {},
    },
    widgetContainerLeft: {
      [theme.breakpoints.down('sm')]: {
        backgroundColor: 'rgb(7, 29, 41)',
      },
      [theme.breakpoints.up('md')]: {
        maxWidth: '492px',
      },
    },
    widgetContainerRight: {
      [theme.breakpoints.up('md')]: {
        height: '100%',
      },
    },
    leftContainerInner: {
      height: '100%',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'baseline',
      [theme.breakpoints.up('md')]: {
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'stretch',
      },
    },
    newsWidgetHeader: {
      [theme.breakpoints.down('sm')]: {
        borderBottom: '1px solid #e5e8ed',
        paddingTop: `${theme.spacing.unit * 2}px !important`,
        paddingBottom: `${theme.spacing.unit}px !important`,
      },
    },
  })

class HomeIndex extends React.Component<Props, State> {
  constructor(props) {
    super(props)

    const currency = 'USD'
    this.state = {
      currency,
    }
  }

  public render() {
    const {
      classes,
      marketDominance,
      totalMarketCap,
      coins,
      watchList,
      loggedIn,
    } = this.props
    const { currency } = this.state
    const isMobile = isWidthDown('sm', this.props.width)

    return (
      <React.Fragment>
        <Paper className={classes.mainFeaturedPost} square={true}>
          <Grid
            container={true}
            direction="column"
            justify="center"
            alignItems="center"
            className={classes.mainFeaturedPostContent}
          >
            <Grid item={true} md={true}>
              <Typography className={classes.header} color="inherit">
                Financial intelligence for cryptocurrency
              </Typography>
            </Grid>
            <Grid item={true} md={true}>
              <Typography
                className={classes.subheader}
                color="inherit"
                paragraph={true}
              >
                Uncover buy and sell opportunities through data science backed
                blockchain analytics.
              </Typography>
            </Grid>
            <Grid item={true} md={true}>
              <Button
                className={classes.cta}
                onClick={() => {
                  window.location.href = `/signals`
                }}
              >
                Learn more
              </Button>
            </Grid>
          </Grid>
        </Paper>

        <Grid
          container={true}
          direction="row"
          justify="center"
          alignItems="stretch"
          className={classes.widgetContainer}
          spacing={24}
        >
          <Grid
            item={true}
            xs={12}
            md={6}
            className={classes.widgetContainerLeft}
          >
            <Grid
              container={true}
              className={classes.leftContainerInner}
              spacing={8}
            >
              <Grid item={true} md={true}>
                <TotalMarketCap marketCapData={totalMarketCap} />
              </Grid>
              <Grid item={true} md={true}>
                <MarketDominance coinData={marketDominance} />
              </Grid>
            </Grid>
          </Grid>
          <Grid
            item={true}
            xs={12}
            md={6}
            className={classes.widgetContainerRight}
          >
            <Typography
              variant="h5"
              align="center"
              className={classes.newsWidgetHeader}
            >
              Latest Cryptocurrency News
            </Typography>
            <NewsList />
          </Grid>
        </Grid>

        <CoinTable
          isMobile={isMobile}
          isLoggedIn={loggedIn}
          currency={currency}
          coins={coins}
          watchList={watchList}
        />
      </React.Fragment>
    )
  }
}

export default compose(
  withWidth(),
  withStyles(styles),
)(HomeIndex)
