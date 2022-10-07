import React, { Component } from 'react'
import * as _ from 'lodash'
import { withRouter } from 'react-router'
import compose from 'recompose/compose'
import classnames from 'classnames'
import {
  Grid,
  Card,
  List,
  ListItem,
  ListItemText,
  Tabs,
  Tab,
  ExpansionPanel,
  ExpansionPanelSummary,
  ExpansionPanelDetails,
  Tooltip,
} from '@material-ui/core'
import Breadcrumbs from '@material-ui/lab/Breadcrumbs'
import { withStyles } from '@material-ui/core/styles'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import withDevice from '~/bundles/common/utils/withDevice'
import API from '../common/utils/localAPI'
import SearchCoins from '~/bundles/common/components/SearchCoins'
import CoinCharts from '~/bundles/common/components/CoinCharts'
import MainCard from './MainCard'
import SubCard from './SubCard'
import CardContent from './CardContent'
import CardHeader from './CardHeader'
import NewsLabel from './NewsLabel'
import FundamentalsList from './FundamentalsList'
import InfoBar from './InfoBar'
import LinksList from './LinksList'
import HistoricalPriceDataTable from './HistoricalPriceDataTable'
import DescriptionText from './DescriptionText'
import MarketsTable from './MarketsTable'
import MarketsChart from './MarketsChart'
import SignalTable from './SignalTable'
import BackToTop from './BackToTop'
import Icon from '~/bundles/common/components/Icon'
import CoinListWrapper from '~/bundles/common/components/CoinListWrapper'
import CoinListDrawer from '~/bundles/common/components/CoinListDrawer'
import { formatPrice } from '~/bundles/common/utils/numberFormatters'
import { WATCHLIST_CHANGE_EVENT } from '~/bundles/common/containers/CoinListContainer'
import { withCurrency } from '~/bundles/common/contexts/CurrencyContext'
import { openSignUpModal } from '~/bundles/common/utils/modals'
import styles from './styles'
import moment from 'moment'

const TAB_SLUGS = {
  priceChart: 'price-chart',
  markets: 'markets',
  news: 'news',
}

class CoinShow extends Component {
  chart = undefined

  constructor(props) {
    super(props)

    const tabSlug = this.defaultTab()
    this.state = {
      priceChartSizeSet: false,
      liveCoinArr: [],
      watched: this.props.watching,
      iconLoading: false,
      watchlistIndex: [],
      tabSlug,
      showCoinList: false,
    }
  }

  componentDidMount() {
    // handle tab change here to avoid rendering issues
    const { props } = this
    const hasMarkets = this.hasMarkets()
    const hashTag = _.get(props, ['location', 'hash'], '').slice(1) // remove prepended octothorpe
    const isValidHashTag =
      _.findIndex(Object.values(TAB_SLUGS), (slug) => slug === hashTag) >= 0 &&
      (hasMarkets || hashTag !== TAB_SLUGS.markets)
    const tabSlug = isValidHashTag ? hashTag : this.defaultTab()
    if (tabSlug !== this.state.tabSlug) {
      this.setState({ tabSlug })
    }

    this.updateTitle()

    // Eagerly load price data
    this.getPriceData()

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

  componentDidUpdate(prevProps) {
    if (prevProps.currencyRate !== this.props.currencyRate) {
      this.updateTitle()
    }
  }

  componentWillUnmount() {
    document.removeEventListener(WATCHLIST_CHANGE_EVENT, this.onWatchlistChange)
  }

  updateTitle = () => {
    const { coinObj: coin, currencyRate, currencySymbol } = this.props
    const price = formatPrice(coin.price * currencyRate)
    document.title = `${coin.symbol} (${currencySymbol}${price}) - ${
      coin.name
    } Price Chart, Value, News, Market Cap`
  }

  defaultTab = () => {
    return TAB_SLUGS.priceChart
  }

  hasMarkets = () => {
    const marketPairs = _.get(this.props, ['coinObj', 'market_pairs'])
    return !_.isEmpty(marketPairs)
  }

  watchCoinHandler = () => {
    if (!this.props.user) {
      openSignUpModal()
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

  fetchPriceData = () => {
    const id = _.get(this.props, ['coinObj', 'id'])
    return API.get(`/coins/prices?id=${id}`).then((data) =>
      _.get(data, ['payload']),
    )
  }

  getPriceData() {
    this.fetchPriceData().then((data) => {
      const { priceData, priceDataHourly } = data
      let lastPriceUpdate

      function timeToTimestamp(time) {
        return moment.utc(time).valueOf()
      }

      /***
       * NOTE: data is always one time unit behind the time update was performed,
       * so we need to increment time unit by one
       ***/
      if (!_.isEmpty(priceDataHourly)) {
        const initialTime = _.get(priceDataHourly, [0, 'time'])
        if (initialTime) {
          lastPriceUpdate = priceDataHourly.reduce(
            (latestTimestamp, { time }) => {
              const timestamp = timeToTimestamp(time)
              return timestamp > latestTimestamp ? timestamp : latestTimestamp
            },
            timeToTimestamp(initialTime),
          )
        }
        lastPriceUpdate += 60 * 60 * 1000
      } else if (!_.isEmpty(priceData)) {
        const initialTime = _.get(priceData, [0, 'time'])
        if (initialTime) {
          lastPriceUpdate = priceData.reduce((latestTimestamp, { time }) => {
            const timestamp = timeToTimestamp(time)
            return timestamp > latestTimestamp ? timestamp : latestTimestamp
          }, timeToTimestamp(initialTime))
        }
        lastPriceUpdate += 24 * 60 * 60 * 1000
      }

      this.setState({
        priceData,
        priceDataHourly,
        lastPriceUpdate,
      })
    })
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

  generateCoinLink = (coin) => {
    return `/coins/${coin.slug || ''}`
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
    const tabStartElement = document.getElementById(tabSlug)
    if (tabStartElement) {
      tabStartElement.scrollIntoView()
    }

    if (tabSlug === TAB_SLUGS.priceChart) {
      if (
        _.isEmpty(this.state.priceData) ||
        _.isEmpty(this.state.priceDataHourly)
      ) {
        this.getPriceData()
      }

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

  handleScrollToTop = (e) => {
    const anchor = (e.target.ownerDocument || document).querySelector(
      '#back-to-top-anchor',
    )

    if (anchor) {
      anchor.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }

  render() {
    const {
      symbol,
      availableSupply,
      isTradingViewVisible,
      coinObj,
      relatedCoins,
      classes,
      user,
      chartSignals,
      summarySignals,
      isDesktop,
      currency,
      currencySymbol,
      currencyRate,
      changeCurrency,
      howToArticle,
    } = this.props
    const { tabSlug, priceData, priceDataHourly, lastPriceUpdate } = this.state
    const isMobile = !isDesktop
    const isLoggedIn = !!user
    const hasMarkets = this.hasMarkets()
    const {
      name: coinName,
      slug: coinSlug,
      market_pairs: marketPairs,
      total_market_pairs: totalMarketPairs,
    } = coinObj
    const currencyCtx = {
      currency,
      currencySymbol,
      currencyRate,
      changeCurrency,
    }

    return (
      <div className={classes.root}>
        <Grid
          container={true}
          spacing={16}
          className={classes.container}
          alignItems="stretch"
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
                  generateLink={this.generateCoinLink}
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
                  id="back-to-top-anchor"
                >
                  <Grid
                    container={true}
                    className={classes.breadcrumbsContainer}
                  >
                    <Grid item={true} xs={12} md={10}>
                      <Breadcrumbs
                        separator="›"
                        aria-label="breadcrumb"
                        className={classes.breadcrumbs}
                      >
                        <a href="/">Home</a>
                        <a href="/coins">Cryptocurrency Prices</a>
                        <a href={`/coins/${coinSlug}`}>{coinName} Price</a>
                      </Breadcrumbs>
                    </Grid>
                    <Grid
                      item={true}
                      xs={12}
                      md={2}
                      className={classes.watchButtonContainer}
                    >
                      <Icon
                        name="star"
                        solid={true}
                        dataHeapTag={
                          this.state.watched
                            ? ''
                            : 'news-add-coin-to-watchlist-button'
                        }
                        className={classnames(
                          classes.watchButton,
                          this.state.watched
                            ? classes.watchedButton
                            : classes.unwatchedButton,
                        )}
                        onClick={this.watchCoinHandler}
                      >
                        {this.state.watched ? 'Unwatch Coin' : 'Watch Coin'}
                      </Icon>
                    </Grid>
                  </Grid>
                  <InfoBar isMobile={isMobile} coinObj={coinObj} />
                  <Tabs
                    value={false}
                    onChange={this.handleTabChange}
                    indicatorColor="primary"
                    textColor="primary"
                    className={classes.tabsRoot}
                  >
                    <Tab
                      label="Price Chart"
                      value={TAB_SLUGS.priceChart}
                      classes={{
                        root: classes.tabRoot,
                        selected: classes.tabSelected,
                        labelContainer: classes.tabLabelContainer,
                      }}
                    />
                    {hasMarkets && (
                      <Tab
                        label="Markets"
                        value={TAB_SLUGS.markets}
                        classes={{
                          root: classes.tabRoot,
                          selected: classes.tabSelected,
                          labelContainer: classes.tabLabelContainer,
                        }}
                      />
                    )}
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
              <Grid
                item={true}
                xs={12}
                md={8}
                className={classnames(classes.contentContainer, tabSlug)}
              >
                <MainCard
                  id={TAB_SLUGS.priceChart}
                  className={classes.priceChart}
                >
                  <CardHeader
                    title={`${coinName} Price Chart`}
                    titleTypographyProps={{ variant: 'h2', component: 'h2' }}
                    classes={{
                      root: classes.cardHeader,
                      title: classes.cardTitle,
                    }}
                  />
                  <CardContent>
                    <CoinCharts
                      coinObj={coinObj}
                      priceData={priceData}
                      priceDataHourly={priceDataHourly}
                      annotations={chartSignals}
                      isTradingViewVisible={isTradingViewVisible}
                      onPriceChartCreated={this.handlePriceChartCreated}
                    />
                    {lastPriceUpdate && (
                      <div className={classes.lastUpdated}>
                        Last Updated:{' '}
                        {moment(lastPriceUpdate).format(
                          'MMMM Do YYYY, HH:mm:ss Z',
                        )}
                      </div>
                    )}
                  </CardContent>
                </MainCard>
                <MainCard>
                  <CardContent className={classes.descriptionCardContent}>
                    <DescriptionText
                      coinObj={coinObj}
                      currencyCtx={currencyCtx}
                      relatedArticle={howToArticle}
                    />
                  </CardContent>
                </MainCard>
                {_.isArray(summarySignals) && (
                  <MainCard>
                    <CardHeader
                      title={
                        <>
                          Whale {symbol} Transfers into Exchange (99.999
                          Percentile)
                          <Tooltip
                            title={
                              <>
                                <div>
                                  Whale Transfers Into Exchange are large
                                  transfers of ETH that are larger than 99.999%
                                  of all historical ETH transactions into
                                  exchanges.
                                </div>
                                <div>
                                  When this signal fires, it could indicate one
                                  of the following:
                                </div>
                                <ul>
                                  <li>
                                    The whale has intention to sell but may not
                                    sell immediately or all at once
                                  </li>
                                  <li>
                                    There is an ongoing pump and the whale sees
                                    this as an opportunity to sell
                                  </li>
                                  <li>
                                    The whale could be anticipating higher
                                    volatility in the future and is preparing to
                                    trade if necessary
                                  </li>
                                </ul>
                              </>
                            }
                            className={classes.infoIcon}
                            classes={{ tooltip: classes.infoTooltip }}
                          >
                            <Icon name="info-circle" />
                          </Tooltip>
                        </>
                      }
                      titleTypographyProps={{
                        variant: 'h3',
                        component: 'h3',
                      }}
                      classes={{
                        root: classes.cardHeader,
                        title: classes.cardTitle,
                      }}
                    />
                    <CardContent>
                      <SignalTable signals={summarySignals} symbol={symbol} />
                      <div className={classes.signalCtaText}>
                        <Icon
                          name="alarm-clock"
                          solid={true}
                          className={classes.alarmClockIcon}
                        />
                        <a href="/signals">Click here</a> to be instantly
                        alerted when a whale transfers a large amount of{' '}
                        {symbol} into exchange
                      </div>
                    </CardContent>
                  </MainCard>
                )}
                <ExpansionPanel
                  square={true}
                  elevation={0}
                  className={classes.expansionRoot}
                >
                  <ExpansionPanelSummary
                    expandIcon={<ExpandMoreIcon />}
                    className={classes.expansionSummary}
                  >
                    <h3 className={classes.cardTitle}>
                      {coinName} Historical Data
                    </h3>
                  </ExpansionPanelSummary>
                  <ExpansionPanelDetails className={classes.expansionDetails}>
                    <HistoricalPriceDataTable
                      initialRawData={priceData}
                      availableSupply={availableSupply}
                      coinObj={coinObj}
                    />
                  </ExpansionPanelDetails>
                </ExpansionPanel>
                {hasMarkets && (
                  <>
                    <h2 id={TAB_SLUGS.markets}>{coinName} Markets</h2>
                    <MainCard>
                      <CardContent>
                        <Grid container={true} justify="space-around">
                          <Grid
                            item={true}
                            xs={12}
                            md={6}
                            className={classes.marketsChartWrapper}
                          >
                            <MarketsChart
                              data={marketPairs}
                              symbol={symbol}
                              groupBy="exchange"
                            />
                          </Grid>
                          <Grid
                            item={true}
                            xs={12}
                            md={6}
                            className={classes.marketsChartWrapper}
                          >
                            <MarketsChart
                              data={marketPairs}
                              symbol={symbol}
                              groupBy="pair"
                            />
                          </Grid>
                        </Grid>
                      </CardContent>
                    </MainCard>
                    <MainCard>
                      <CardContent className={classes.marketsCardContent}>
                        <MarketsTable
                          data={marketPairs}
                          total={totalMarketPairs}
                        />
                      </CardContent>
                    </MainCard>
                  </>
                )}
                <BackToTop onClick={this.handleScrollToTop} />
              </Grid>
              <Grid
                item={true}
                xs={12}
                md={4}
                className={classes.widgetContainer}
              >
                <SubCard>
                  <CardHeader
                    title={`${coinName} Fundamentals`}
                    titleTypographyProps={{ variant: 'h3', component: 'h3' }}
                    classes={{
                      root: classes.subCardHeader,
                      title: classes.subCardTitle,
                    }}
                  />
                  <CardContent className={classes.subCardContent}>
                    <FundamentalsList coinObj={coinObj} />
                  </CardContent>
                </SubCard>
                <SubCard>
                  <CardHeader
                    title={`${coinName} Links`}
                    titleTypographyProps={{ variant: 'h3', component: 'h3' }}
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
                    titleTypographyProps={{ variant: 'h3', component: 'h3' }}
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
  withDevice,
  withStyles(styles, { withTheme: true }),
)(withRouter(withCurrency(CoinShow)))
