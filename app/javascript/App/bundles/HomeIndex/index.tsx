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

const styles = (theme) =>
  createStyles({
    root: {
      width: '100%',
      [theme.breakpoints.up('md')]: {
        margin: '16px auto',
        maxWidth: '1200px',
      },
    },
    cardWrapper: {
      [theme.breakpoints.up('md')]: {
        alignContent: 'stretch',
      },
      [theme.breakpoints.down('sm')]: {},
    },
    bannerContainer: {
      [theme.breakpoints.down('sm')]: {
        paddingBottom: '0 !important',
      },
    },
    bannerRoot: {
      width: '100%',
      [theme.breakpoints.up('md')]: {
        borderRadius: '2px',
      },
    },
    widgetContainerLeft: {
      [theme.breakpoints.down('sm')]: {
        backgroundColor: 'rgb(7, 29, 41)',
      },
      [theme.breakpoints.up('md')]: {},
    },
    widgetContainerRight: {
      [theme.breakpoints.down('sm')]: {
        paddingTop: '0 !important',
        paddingBottom: '0 !important',
      },
    },
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
    tableContainer: {
      [theme.breakpoints.down('sm')]: {
        paddingTop: '0 !important',
      },
    },
  })

class HomeIndex extends React.Component<Props> {
  constructor(props) {
    super(props)
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
    const isMobile = isWidthDown('sm', this.props.width)

    return (
      <>
        <div className={classes.root}>
          <Grid
            container={true}
            justify="center"
            className={classes.cardWrapper}
            spacing={16}
          >
            <Grid item={true} xs={12} className={classes.bannerContainer}>
              <Banner className={classes.bannerRoot} />
            </Grid>
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
              <NewsList />
            </Grid>
            <Grid item={true} xs={12} className={classes.tableContainer}>
              <CoinTable
                isMobile={isMobile}
                isLoggedIn={loggedIn}
                coins={coins}
                watchList={watchList}
                pageCount={pageCount}
              />
            </Grid>
          </Grid>
        </div>
        <Footer />
      </>
    )
  }
}

export default compose(
  withWidth(),
  withStyles(styles),
)(HomeIndex)
