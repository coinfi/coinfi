import * as React from 'react'
import * as _ from 'lodash'
import compose from 'recompose/compose'
import withWidth, { isWidthDown } from '@material-ui/core/withWidth'
import { Grid, Typography, createStyles, withStyles } from '@material-ui/core'
import CoinTable from './CoinTable'
import MarketDominance, {
  CoinDominance,
} from '~/bundles/common/components/MarketDominance'
import TotalMarketCap, {
  RawMarketCap,
} from '~/bundles/common/components/TotalMarketCap'
import NewsList from '~/bundles/common/components/NewsList'
import { CoinData } from './types'
import Banner from './Banner'
import Footer from './Footer'

interface Props {
  classes: any
  width: any
  coins: CoinData[]
  watchList: number[]
  loggedIn: boolean
  marketDominance: CoinDominance[]
  totalMarketCap: RawMarketCap[]
  pageCount: number
}

interface State {
  currency: string
}

const styles = (theme) =>
  createStyles({
    bannerRoot: {
      width: '100%',
      [theme.breakpoints.up('md')]: {
        margin: '0 auto',
        maxWidth: '1200px',
      },
    },
    widgetContainer: {
      backgroundColor: '#fff',
      [theme.breakpoints.up('md')]: {
        margin: '0 auto !important',
        maxWidth: '1200px',
        padding: '8px',
        flexWrap: 'nowrap',
        alignContent: 'stretch',
      },
      [theme.breakpoints.down('sm')]: {},
    },
    widgetContainerLeft: {
      [theme.breakpoints.down('sm')]: {
        backgroundColor: 'rgb(7, 29, 41)',
      },
      [theme.breakpoints.up('md')]: {},
    },
    widgetContainerRight: {},
    leftContainerInner: {
      [theme.breakpoints.up('md')]: {
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'stretch',
        alignContent: 'stretch',
        flexWrap: 'nowrap',
      },
      [theme.breakpoints.down('sm')]: {
        flexDirection: 'row',
        flexWrap: 'nowrap',
        justifyContent: 'space-between',
        alignItems: 'baseline',
        alignContent: 'baseline',
        paddingLeft: '8px',
        paddingRight: '8px',
      },
    },
    newsWidgetHeader: {
      fontWeight: 500,
      [theme.breakpoints.down('sm')]: {
        borderBottom: '1px solid #e5e8ed',
        paddingTop: `16px !important`,
        paddingBottom: `8px !important`,
        marginBottom: '16px !important',
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
      pageCount,
    } = this.props
    const { currency } = this.state
    const isMobile = isWidthDown('sm', this.props.width)

    return (
      <React.Fragment>
        <Banner className={classes.bannerRoot} />
        <Grid
          container={true}
          justify="center"
          className={classes.widgetContainer}
          spacing={16}
        >
          <Grid
            item={true}
            xs={12}
            md={5}
            className={classes.widgetContainerLeft}
          >
            <Grid
              container={true}
              className={classes.leftContainerInner}
              spacing={16}
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
            md={7}
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
          pageCount={pageCount}
        />

        <Footer />
      </React.Fragment>
    )
  }
}

export default compose(
  withWidth(),
  withStyles(styles),
)(HomeIndex)
