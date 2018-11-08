import React, { Component, Fragment } from 'react'
import * as _ from 'lodash'
import compose from 'recompose/compose'
import {
  Grid,
  Typography,
  Button,
  Card,
  CardHeader,
  CardContent,
  List,
  ListItem,
  ListItemText,
  Tabs,
  Tab,
  TabContainer,
  withStyles,
  createStyles,
} from '@material-ui/core'
import withWidth, { isWidthDown } from '@material-ui/core/withWidth'
import axios from 'axios'
import SearchCoins from '~/bundles/common/components/SearchCoins'
import CoinCharts from '~/bundles/common/components/CoinCharts'
import FundamentalsList from './FundamentalsList'
import LinksList from './LinksList'
import HistoricalPriceDataTable from './HistoricalPriceDataTable'
import Icon from '~/bundles/common/components/Icon'

const styles = (theme) =>
  createStyles({
    container: {
      width: '100%',
      maxWidth: '1200px',
      margin: '0 auto',
    },
    widgetContainer: {
      [theme.breakpoints.up('md')]: {
        maxWidth: '300px',
      },
      [theme.breakpoints.down('sm')]: {
        paddingTop: '0 !important',
      },
    },
    searchBar: {
      backgroundColor: '#f7f8fa', // athens
      border: '1px solid #e5e8ed', // athens-darker
      borderTop: 'none',
    },
    titleBar: {
      backgroundColor: '#fff',
    },
    tabBar: {
      padding: '0 !important',
      backgroundColor: '#fff',
    },
    tabsRoot: {},
    tabRoot: {
      [theme.breakpoints.down('sm')]: {
        fontSize: '0.7rem',
      },
    },
    coinImage: {
      alignSelf: 'flex-start',
      [theme.breakpoints.up('md')]: {
        marginRight: `${theme.spacing.unit}px`,
      },
      [theme.breakpoints.down('sm')]: {
        flex: '1 0 100%',
        textAlign: 'center',
        marginTop: `${theme.spacing.unit * 1.5}px`,
        marginBottom: `${theme.spacing.unit * 1.5}px`,
      },
    },
    coinName: {
      fontSize: '1.5rem',
      fontWeight: 'bold',
      [theme.breakpoints.up('md')]: {
        marginRight: `${theme.spacing.unit}px`,
      },
      [theme.breakpoints.down('sm')]: {
        flex: '1 0 50%',
        paddingRight: `${theme.spacing.unit * 0.75}px`,
        textAlign: 'right',
        marginBottom: `${theme.spacing.unit * 0.5}px`,
      },
    },
    coinSymbol: {
      fontSize: '1rem',
      [theme.breakpoints.up('md')]: {
        marginRight: `${theme.spacing.unit * 1.5}px`,
      },
      [theme.breakpoints.down('sm')]: {
        flex: '1 0 50%',
        paddingLeft: `${theme.spacing.unit * 0.75}px`,
        textAlign: 'left',
        marginBottom: `${theme.spacing.unit * 0.5}px`,
      },
    },
    coinPrice: {
      fontSize: '1rem',
      fontWeight: 'bold',
      [theme.breakpoints.up('md')]: {
        marginRight: `${theme.spacing.unit * 1.5}px`,
      },
      [theme.breakpoints.down('sm')]: {
        flex: '1 0 33%',
        textAlign: 'center',
      },
    },
    coinChange: {
      fontSize: '0.8rem',
      [theme.breakpoints.up('md')]: {
        marginRight: `${theme.spacing.unit * 1.5}px`,
      },
      [theme.breakpoints.down('sm')]: {
        flex: '1 0 33%',
        textAlign: 'center',
      },
    },
    watchButtonContainer: {
      [theme.breakpoints.down('sm')]: {
        flex: '1 0 33%',
        textAlign: 'center',
      },
    },
    watchedButton: {
      backgroundColor: '#40a9ff',
      color: '#fff',
    },
    unwatchedButton: {
      backgroundColor: '#fff',
      color: '#40a9ff',
    },
    mainCard: {
      padding: 0,
      marginBottom: `${theme.spacing.unit * 2}px`,
      '&:last-child': {
        marginBottom: 0,
      },
    },
    subCard: {
      padding: 0,
      marginBottom: `${theme.spacing.unit * 2}px`,
      '&:last-child': {
        marginBottom: 0,
      },
    },
    subCardHeader: {
      paddingBottom: 0,
    },
  })

class CoinShow extends Component {
  chart = undefined

  constructor(props) {
    super(props)

    this.state = {
      liveCoinArr: [],
      currency: 'USD',
      watched: this.props.watching,
      iconLoading: false,
      tabIndex: 0,
    }
  }

  watchlistHandler(coin) {
    if (window.location === `/coins/${coin.get('name')}`) {
      window.location = `/coins/${coin
        .get('name')
        .replace(/ /, '-')
        .toLowerCase()}`
    }
  }

  watchCoinHandler = () => {
    this.setState((prevState) => ({
      watched: !prevState.watched,
      iconLoading: true,
    }))

    let params
    !this.state.watched
      ? (params = { watchCoin: this.props.coinObj.id })
      : (params = { unwatchCoin: this.props.coinObj.id })
    axios
      .patch('/api/user', params)
      .then((data) => {
        this.setState({
          iconLoading: false,
        })
      })
      .catch((error) => {
        console.log(error)
      })
  }

  handlePriceChartCreated = (priceChart) => {
    this.priceChart = priceChart
  }

  handleTabChange = (e, tabIndex) => {
    this.setState({ tabIndex })
  }

  componentDidMount() {
    setTimeout(() => {
      this.priceChart.setSize()
    }, 100)
  }

  render() {
    const {
      symbol,
      priceData,
      availableSupply,
      annotations,
      isTradingViewVisible,
      metabaseUrl,
      coinObj,
      relatedCoins,
      classes,
    } = this.props
    const { currency, tabIndex } = this.state

    const isMobile = isWidthDown('sm', this.props.width)
    const prepend = currency === 'USD' ? '$' : ''
    const price = `${prepend}${Number.parseFloat(
      _.get(coinObj, ['price', currency.toLowerCase()], 0),
    ).toPrecision(6)} ${currency}`
    const percentChange1h = _.get(coinObj, ['change1h'], 0)
    const isPositive = percentChange1h >= 0
    const arrow = isPositive ? '▲' : '▼'
    const changeStyle = isPositive ? { color: '#12d8b8' } : { color: '#ff6161' }
    const hasAdvancedMetrics = !!metabaseUrl

    return (
      <Grid
        container={true}
        alignContent="stretch"
        alignItems="flex-start"
        spacing={24}
        className={classes.container}
      >
        <Grid item={true} xs={12} className={classes.searchBar}>
          <SearchCoins
            onSelect={(suggestion) =>
              (window.location.href = `/coins/${suggestion.slug}`)
            }
            coinShow
            unstyled
          />
        </Grid>
        <Grid
          item={true}
          xs={12}
          className={classes.titleBar}
          container={true}
          alignContent="flex-start"
          alignItems="baseline"
        >
          <Grid item={true} className={classes.coinImage}>
            <img alt={coinObj.name} src={coinObj.image_url} />
          </Grid>
          <Grid item={true} className={classes.coinName}>
            {coinObj.name}
          </Grid>
          <Grid item={true} className={classes.coinSymbol}>
            {symbol}
          </Grid>
          <Grid item={true} className={classes.coinPrice}>
            {price}
          </Grid>
          <Grid item={true} className={classes.coinChange} style={changeStyle}>
            {arrow}
            {percentChange1h}%
          </Grid>
          <Grid item={true} className={classes.watchButtonContainer}>
            <Icon
              name="star"
              solid={true}
              className={
                this.state.watched
                  ? classes.watchedButton
                  : classes.unwatchedButton
              }
              style={{
                borderWidth: '1px',
                borderStyle: 'solid',
                borderRadius: '4px',
                padding: '8px',
                fontSize: '12px',
                lineHeight: ' 16px',
              }}
              onClick={this.watchCoinHandler}
            >
              {this.state.watched ? 'Unwatch Coin' : 'Watch Coin'}
            </Icon>
          </Grid>
        </Grid>
        <Grid
          item={true}
          xs={12}
          className={classes.tabBar}
          container={true}
          alignContent="flex-start"
          alignItems="baseline"
        >
          <Tabs
            value={tabIndex}
            onChange={this.handleTabChange}
            indicatorColor="primary"
            textColor="primary"
            fullWidth
            className={classes.tabsRoot}
          >
            <Tab label="Overview" className={classes.tabRoot} />
            <Tab label="Markets" className={classes.tabRoot} />
            <Tab label="Historical Data" className={classes.tabRoot} />
            {hasAdvancedMetrics && (
              <Tab label="Advanced Metrics" className={classes.tabRoot} />
            )}
          </Tabs>
        </Grid>
        <Grid item={true} xs={12} md={8}>
          {tabIndex === 0 && (
            <Card raised={false} square={true} className={classes.mainCard}>
              <CardHeader title="Price Chart" />
              <CardContent>
                <CoinCharts
                  symbol={symbol}
                  priceData={priceData}
                  annotations={annotations}
                  isTradingViewVisible={isTradingViewVisible}
                  onPriceChartCreated={this.handlePriceChartCreated}
                />
              </CardContent>
            </Card>
          )}
          {tabIndex === 1 && (
            <Card raised={false} square={true} className={classes.mainCard}>
              <CardHeader title="Markets" />
              <CardContent>Coming soon!</CardContent>
            </Card>
          )}
          {tabIndex === 2 && (
            <Card raised={false} square={true} className={classes.mainCard}>
              <CardHeader title="Historical Data" />
              <CardContent>
                <HistoricalPriceDataTable
                  initialData={priceData}
                  availableSupply={availableSupply}
                  symbol={symbol}
                />
              </CardContent>
            </Card>
          )}
          {tabIndex === 3 && (
            <Card raised={false} square={true} className={classes.mainCard}>
              <CardHeader title="Advanced Token Metrics" />
              <CardContent>
                <iframe
                  title="Advanced Token Metrics"
                  src={metabaseUrl}
                  frameBorder="0"
                  width="100%"
                  height={isMobile ? '900' : '2000'}
                  scrolling="no"
                />
              </CardContent>
            </Card>
          )}
        </Grid>
        <Grid item={true} xs={12} md={8} className={classes.widgetContainer}>
          <Card raised={false} square={true} className={classes.subCard}>
            <CardHeader
              subheader="Fundamentals"
              className={classes.subCardHeader}
            />
            <CardContent>
              <FundamentalsList coinObj={coinObj} currency={currency} />
            </CardContent>
          </Card>
          <Card raised={false} square={true} className={classes.subCard}>
            <CardHeader subheader="Links" className={classes.subCardHeader} />
            <CardContent>
              <LinksList coinObj={coinObj} />
            </CardContent>
          </Card>
          <Card raised={false} square={true} className={classes.subCard}>
            <CardHeader
              subheader="Related Coins"
              className={classes.subCardHeader}
            />
            <CardContent>
              <List dense={true} disablePadding={true}>
                {relatedCoins.map((item, index) => {
                  return (
                    <ListItem key={index} style={{ padding: '4px 0' }}>
                      <ListItemText>
                        <a
                          href={`/coins/${item.slug}`}
                          style={{
                            marginTop: '-.25rem',
                          }}
                        >
                          {item.name}
                        </a>
                      </ListItemText>
                    </ListItem>
                  )
                })}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    )
  }
}

export default compose(
  withWidth(),
  withStyles(styles),
)(CoinShow)
