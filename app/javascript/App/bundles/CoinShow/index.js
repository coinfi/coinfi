import React, { Component } from 'react'
import * as _ from 'lodash'
import { withRouter } from 'react-router'
import compose from 'recompose/compose'
import classnames from 'classnames'
import {
  Grid,
  Card,
  CardHeader,
  CardContent,
  List,
  ListItem,
  ListItemText,
  Tabs,
  Tab,
  withStyles,
} from '@material-ui/core'
import withWidth, { isWidthDown } from '@material-ui/core/withWidth'
import API from '../common/utils/localAPI'
import SearchCoins from '~/bundles/common/components/SearchCoins'
import CoinCharts from '~/bundles/common/components/CoinCharts'
import FundamentalsList from './FundamentalsList'
import LinksList from './LinksList'
import HistoricalPriceDataTable from './HistoricalPriceDataTable'
import Icon from '~/bundles/common/components/Icon'
import CoinListWrapper from '~/bundles/common/components/CoinListWrapper'
import CoinListDrawer from '~/bundles/common/components/CoinListDrawer'
import { WATCHLIST_CHANGE_EVENT } from '~/bundles/common/containers/CoinListContainer'
import styles from './styles'

const TAB_SLUGS = {
  tokenMetrics: 'token-metrics',
  priceChart: 'price-chart',
  news: 'news',
}

const MainCard = withStyles(styles)(
  ({ children, classes, className, ...props }) => {
    const classNames = classnames(classes.mainCard, className)
    return (
      <Card
        raised={false}
        square={true}
        elevation={0}
        className={classNames}
        {...props}
      >
        {children}
      </Card>
    )
  },
)

const SubCard = withStyles(styles)(
  ({ children, classes, className, ...props }) => {
    const classNames = classnames(classes.subCard, className)
    return (
      <Card
        raised={false}
        square={true}
        elevation={0}
        className={classNames}
        {...props}
      >
        {children}
      </Card>
    )
  },
)

const NewsLabel = withStyles(styles)(({ classes }) => {
  return (
    <React.Fragment>
      <span>News</span>
      <Icon
        name="external-link-alt"
        regular
        className={classes.newsLabelIcon}
      />
    </React.Fragment>
  )
})

class CoinShow extends Component {
  chart = undefined

  constructor(props) {
    super(props)

    const { metabaseUrl } = props
    const hasTokenMetrics = !!metabaseUrl
    const hashTag = _.get(props, ['location', 'hash']).slice(1) // remove prepended octothorpe
    const defaultTabSlug = hasTokenMetrics
      ? TAB_SLUGS.tokenMetrics
      : TAB_SLUGS.priceChart

    this.state = {
      priceChartSizeSet: false,
      liveCoinArr: [],
      currency: 'USD',
      watched: this.props.watching,
      iconLoading: false,
      watchlistIndex: [],
      tabSlug: hashTag || defaultTabSlug,
      showCoinList: false,
    }
  }

  componentDidMount() {
    this.fetchWatchlist().then((coins) => {
      this.setState({
        watchlistIndex: coins,
      })
    })
    document.addEventListener(WATCHLIST_CHANGE_EVENT, this.onWatchlistChange)

    setTimeout(() => {
      if (this.priceChart && !this.state.priceChartSizeSet) {
        this.priceChart.setSize()
        this.setState({
          priceChartSizeSet: true,
        })
      }
    }, 100)
  }

  componentWillUnmount() {
    document.removeEventListener(WATCHLIST_CHANGE_EVENT, this.onWatchlistChange)
  }

  watchCoinHandler = () => {
    if (!this.props.user) {
      window.location.href = `/login`
      return
    }

    this.setState((prevState) => ({
      watched: !prevState.watched,
      iconLoading: true,
    }))

    const params = !this.state.watched
      ? { watchCoin: this.props.coinObj.id }
      : { unwatchCoin: this.props.coinObj.id }
    API.patch('/user', params)
      .then((data) => {
        this.setState({
          iconLoading: false,
        })

        const coins = _.get(data, ['payload', 'coin_ids'], [])
        const event = new CustomEvent(WATCHLIST_CHANGE_EVENT, {
          detail: { coins },
        })
        document.dispatchEvent(event)
      })
      .catch((error) => {
        console.log(error)
      })
  }

  fetchWatchlist = () =>
    API.get('/user').then((data) => _.get(data, ['payload', 'coin_ids'], []))

  onWatchlistChange = (e) => {
    const { coins } = e.detail
    const coinDifferenceList = _.xor(this.state.watchlistIndex, coins)
    if (coinDifferenceList.length <= 0) {
      return
    }

    this.setState({ iconLoading: true }, () =>
      this.fetchWatchlist().then((coins) => {
        const watched =
          _.findIndex(coins, (id) => id === this.props.coinObj.id) >= 0

        this.setState({
          watched,
          watchlistIndex: coins,
          iconLoading: false,
        })
      }),
    )
  }

  showCoinListDrawer = () => {
    this.setState({ showCoinList: true })
  }

  hideCoinListDrawer = () => {
    this.setState({ showCoinList: false })
  }

  handleClickCoin = (coinSlug) => {
    window.location.href = `/coins/${coinSlug}`
    // TODO: asynchronously retrieve coin data based on coin route
    // this.props.history.push(`/coins/${coinSlug}`)
  }

  handlePriceChartCreated = (priceChart) => {
    this.priceChart = priceChart
  }

  handleTabChange = (e, tabSlug) => {
    if (tabSlug === TAB_SLUGS.news) {
      const coinSlug = _.get(this.props, ['coinObj', 'slug'])
      window.location.href = `/news/${coinSlug}`
      return
    }

    this.props.history.push(`#${tabSlug}`)
    this.setState({ tabSlug })

    if (tabSlug === TAB_SLUGS.priceChart) {
      setTimeout(() => {
        if (this.priceChart && !this.state.priceChartSizeSet) {
          this.priceChart.setSize()
          this.setState({
            priceChartSizeSet: true,
          })
        }
      }, 100)
    }
  }

  render() {
    const {
      symbol,
      priceData,
      priceDataHourly,
      availableSupply,
      annotations,
      isTradingViewVisible,
      metabaseUrl,
      coinObj,
      relatedCoins,
      classes,
      user,
    } = this.props
    const { currency, tabSlug } = this.state

    const isMobile = isWidthDown('sm', this.props.width)
    const isLoggedIn = !!user
    const prepend = currency === 'USD' ? '$' : ''
    const price = Number.parseFloat(_.get(coinObj, ['price'], 0)).toPrecision(6)
    const priceString = `${prepend}${price} ${currency}`
    const percentChange1h = _.get(coinObj, ['change1h'], 0)
    const isPositive = percentChange1h >= 0
    const arrow = isPositive ? '▲' : '▼'
    const changeStyle = isPositive ? { color: '#12d8b8' } : { color: '#ff6161' }
    const hasTokenMetrics = !!metabaseUrl

    return (
      <div className={classes.root}>
        <Grid
          container={true}
          spacing={16}
          className={classes.container}
          alignContent="stretch"
          wrap="nowrap"
        >
          {!isMobile && (
            <Grid item={true} md={2} className={classes.leftPanelGrid}>
              <Card
                raised={false}
                square={true}
                elevation={0}
                className={classnames('bg-white', classes.leftPanelCard)}
              >
                <CoinListWrapper
                  loggedIn={isLoggedIn}
                  onClick={this.handleClickCoin}
                />
              </Card>
            </Grid>
          )}
          <Grid item={true} xs={12} md={10} className={classes.mainPanel}>
            <Grid
              container={true}
              alignContent="stretch"
              alignItems="flex-start"
              spacing={16}
              className={classes.mainContainer}
            >
              <Grid item={true} xs={12} className={classes.header}>
                <Card
                  raised={false}
                  square={true}
                  elevation={0}
                  className={classes.searchBarCard}
                >
                  {isMobile && (
                    <button
                      className={classnames(
                        'btn btn-blue btn-xs coins-btn mr2',
                        classes.mobileCoinButton,
                      )}
                      onClick={this.showCoinListDrawer}
                    >
                      <Icon name="list" className="mr2" />
                      <span>Coins</span>
                    </button>
                  )}
                  <SearchCoins
                    onSelect={(suggestion) =>
                      (window.location.href = `/coins/${suggestion.slug}`)
                    }
                    placeholder="Search"
                    coinShow
                    unstyled
                  />
                </Card>
                <Card
                  raised={false}
                  square={true}
                  elevation={0}
                  className={classes.topBarWrapper}
                >
                  <Grid
                    container={true}
                    alignContent="flex-start"
                    alignItems="baseline"
                    className={classes.titleBar}
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
                      {priceString}
                    </Grid>
                    <Grid
                      item={true}
                      className={classes.coinChange}
                      style={changeStyle}
                    >
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
                  <Tabs
                    value={tabSlug}
                    onChange={this.handleTabChange}
                    indicatorColor="primary"
                    textColor="primary"
                    className={classes.tabsRoot}
                  >
                    {hasTokenMetrics && (
                      <Tab
                        label="Token Metrics"
                        value={TAB_SLUGS.tokenMetrics}
                        classes={{
                          root: classes.tabRoot,
                          selected: classes.tabSelected,
                          labelContainer: classes.tabLabelContainer,
                        }}
                      />
                    )}
                    <Tab
                      label="Price Chart"
                      value={TAB_SLUGS.priceChart}
                      classes={{
                        root: classes.tabRoot,
                        selected: classes.tabSelected,
                        labelContainer: classes.tabLabelContainer,
                      }}
                    />
                    <Tab
                      label={<NewsLabel />}
                      value={TAB_SLUGS.news}
                      classes={{
                        root: classes.tabRoot,
                        selected: classes.tabSelected,
                        labelContainer: classes.tabLabelContainer,
                      }}
                    />
                  </Tabs>
                </Card>
              </Grid>
              {tabSlug === TAB_SLUGS.priceChart && (
                <Grid
                  item={true}
                  xs={12}
                  md={8}
                  className={classnames(
                    classes.contentContainer,
                    classes.chartContainer,
                  )}
                >
                  <MainCard>
                    <CardHeader title="Price Chart" />
                    <CardContent>
                      <CoinCharts
                        symbol={symbol}
                        priceData={priceData}
                        priceDataHourly={priceDataHourly}
                        annotations={annotations}
                        isTradingViewVisible={isTradingViewVisible}
                        onPriceChartCreated={this.handlePriceChartCreated}
                      />
                    </CardContent>
                  </MainCard>
                </Grid>
              )}
              {/*tabIndex === 2 && (
                <Grid item={true} xs={12}>
                  <MainCard>
                    <CardHeader title="Historical Data" />
                    <CardContent>
                      <HistoricalPriceDataTable
                        initialData={priceData}
                        availableSupply={availableSupply}
                        symbol={symbol}
                      />
                    </CardContent>
                  </MainCard>
                </Grid>
              )*/}
              {tabSlug === TAB_SLUGS.tokenMetrics && (
                <Grid
                  item={true}
                  xs={12}
                  md={8}
                  className={classes.contentContainer}
                >
                  <MainCard>
                    <CardHeader title="Advanced Token Metrics" />
                    <CardContent>
                      <iframe
                        title="Advanced Token Metrics"
                        src={metabaseUrl}
                        frameBorder="0"
                        width="100%"
                        height="900"
                        scrolling="no"
                      />
                    </CardContent>
                  </MainCard>
                </Grid>
              )}
              <Grid
                item={true}
                xs={12}
                md={4}
                className={classes.widgetContainer}
              >
                <SubCard>
                  <CardHeader
                    title="Fundamentals"
                    classes={{
                      root: classes.subCardHeader,
                      title: classes.subCardTitle,
                    }}
                  />
                  <CardContent className={classes.subCardContent}>
                    <FundamentalsList coinObj={coinObj} currency={currency} />
                  </CardContent>
                </SubCard>
                <SubCard>
                  <CardHeader
                    title="Links"
                    classes={{
                      root: classes.subCardHeader,
                      title: classes.subCardTitle,
                    }}
                  />
                  <CardContent className={classes.subCardContent}>
                    <LinksList coinObj={coinObj} />
                  </CardContent>
                </SubCard>
                <SubCard>
                  <CardHeader
                    title="Related Coins"
                    classes={{
                      root: classes.subCardHeader,
                      title: classes.subCardTitle,
                    }}
                  />
                  <CardContent className={classes.subCardContent}>
                    <List dense={true} disablePadding={true}>
                      {relatedCoins.map((item, index) => {
                        return (
                          <ListItem
                            key={index}
                            className={classes.linkListItem}
                          >
                            <ListItemText className={classes.linkListText}>
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
                </SubCard>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <CoinListDrawer
          isShown={this.state.showCoinList}
          onClose={this.hideCoinListDrawer}
          loggedIn={isLoggedIn}
          onClick={this.handleClickCoin}
        />
      </div>
    )
  }
}

export default compose(
  withWidth(),
  withStyles(styles),
)(withRouter(CoinShow))
