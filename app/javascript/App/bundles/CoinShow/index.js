import React, { Component } from 'react'
import * as _ from 'lodash'
import { withRouter } from 'react-router'
import compose from 'recompose/compose'
import classnames from 'classnames'
import {
  Grid,
  Button,
  Card,
  CardHeader,
  CardContent,
  List,
  ListItem,
  ListItemText,
  Tabs,
  Tab,
  ExpansionPanel,
  ExpansionPanelSummary,
  ExpansionPanelDetails,
} from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import withWidth, { isWidthDown } from '@material-ui/core/withWidth'
import API from '../common/utils/localAPI'
import SearchCoins from '~/bundles/common/components/SearchCoins'
import CoinCharts from '~/bundles/common/components/CoinCharts'
import FundamentalsList from './FundamentalsList'
import InfoBar from './InfoBar'
import LinksList from './LinksList'
import HistoricalPriceDataTable from './HistoricalPriceDataTable'
import TokenChart from './TokenChart'
import Icon from '~/bundles/common/components/Icon'
import CoinListWrapper from '~/bundles/common/components/CoinListWrapper'
import CoinListDrawer from '~/bundles/common/components/CoinListDrawer'
import { WATCHLIST_CHANGE_EVENT } from '~/bundles/common/containers/CoinListContainer'
import {
  formatValue,
  formatValueFixed,
} from '~/bundles/common/utils/numberFormatters'
import styles from './styles'

const lightbulb = require('~/images/lightbulb.svg') // tslint:disable-line

const TAB_SLUGS = {
  tokenMetrics: 'token-metrics',
  priceChart: 'price-chart',
  news: 'news',
}

const MainCard = ({ children, classes, className, ...props }) => {
  const classNames = classnames(_.get(classes, 'mainCard'), className)
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
}

const SubCard = ({ children, classes, className, ...props }) => {
  const classNames = classnames(_.get(classes, 'subCard'), className)
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
}
const NewsLabel = ({ classes }) => {
  return (
    <React.Fragment>
      <span>News</span>
      <Icon
        name="external-link-alt"
        regular
        className={_.get(classes, 'newsLabelIcon')}
      />
    </React.Fragment>
  )
}

class CoinShow extends Component {
  chart = undefined

  constructor(props) {
    super(props)

    const { tokenMetrics } = props
    const hasTokenMetrics = !_.isEmpty(tokenMetrics)
    const tabSlug = hasTokenMetrics
      ? TAB_SLUGS.tokenMetrics
      : TAB_SLUGS.priceChart

    this.state = {
      priceChartSizeSet: false,
      liveCoinArr: [],
      currency: 'USD',
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
    const { tokenMetrics } = props
    const hasTokenMetrics = !_.isEmpty(tokenMetrics)
    const hashTag = _.get(props, ['location', 'hash'], '').slice(1) // remove prepended octothorpe
    const isValidHashTag =
      _.findIndex(Object.values(TAB_SLUGS), (slug) => slug === hashTag) >= 0 &&
      (hasTokenMetrics || hashTag !== TAB_SLUGS.tokenMetrics)
    const defaultTabSlug = hasTokenMetrics
      ? TAB_SLUGS.tokenMetrics
      : TAB_SLUGS.priceChart
    const tabSlug = isValidHashTag ? hashTag : defaultTabSlug
    if (tabSlug !== this.state.tabSlug) {
      this.setState({ tabSlug })
    }

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

  fetchPriceData = () => {
    const id = _.get(this.props, ['coinObj', 'id'])
    return API.get(`/coins/prices?id=${id}`).then((data) =>
      _.get(data, ['payload']),
    )
  }

  getPriceData() {
    this.fetchPriceData().then((data) => {
      const { priceData, priceDataHourly } = data

      this.setState({
        priceData,
        priceDataHourly,
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

  render() {
    const {
      symbol,
      availableSupply,
      annotations,
      isTradingViewVisible,
      tokenMetrics,
      coinObj,
      relatedCoins,
      classes,
      user,
    } = this.props
    const { currency, tabSlug, priceData, priceDataHourly } = this.state

    const isMobile = isWidthDown('sm', this.props.width)
    const isLoggedIn = !!user
    const hasTokenMetrics = !_.isEmpty(tokenMetrics)

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
                >
                  <InfoBar
                    isWatched={this.state.watched}
                    watchCoinHandler={this.watchCoinHandler}
                    currency={currency}
                    coinObj={coinObj}
                  />
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
                    <CardHeader
                      title="Price Chart"
                      classes={{ title: classes.cardHeader }}
                    />
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
                  <ExpansionPanel
                    square={true}
                    elevation={0}
                    className={classnames(
                      classes.mainCard,
                      classes.expansionRoot,
                    )}
                  >
                    <ExpansionPanelSummary
                      expandIcon={<ExpandMoreIcon />}
                      className={classnames(
                        classes.expansionSummary,
                        classes.cardHeader,
                      )}
                    >
                      Historical Data
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails className={classes.expansionDetails}>
                      <HistoricalPriceDataTable
                        initialData={priceData}
                        availableSupply={availableSupply}
                        symbol={symbol}
                      />
                    </ExpansionPanelDetails>
                  </ExpansionPanel>
                </Grid>
              )}
              {tabSlug === TAB_SLUGS.tokenMetrics && (
                <Grid
                  item={true}
                  xs={12}
                  md={8}
                  className={classes.contentContainer}
                >
                  <Grid container={true} spacing={16}>
                    <Grid
                      item={true}
                      xs={12}
                      className={classes.tokenMetricHeader}
                    >
                      Percentage of {symbol} on Exchange
                    </Grid>
                    <Grid item={true} xs={12}>
                      <SubCard>
                        <CardContent className={classes.tokenChartCardContent}>
                          <TokenChart
                            data={_.get(
                              tokenMetrics,
                              'exchange_supply_data',
                              [],
                            )}
                            yAxisLabel="% Supply on Exchange"
                          />
                        </CardContent>
                      </SubCard>
                    </Grid>
                    <Grid item={true} xs={12} md={6}>
                      <SubCard>
                        <CardContent className={classes.tokenCardContent}>
                          <div className={classes.tokenMetricValue}>
                            {formatValueFixed(
                              _.get(
                                tokenMetrics,
                                ['exchange_supply_metadata', 'metric_value'],
                                0,
                              ) * 100,
                              1,
                            )}%
                          </div>
                          <div className={classes.tokenMetricSubtitle}>
                            Tokens held on an exchange
                          </div>
                        </CardContent>
                      </SubCard>
                    </Grid>
                    <Grid item={true} xs={12} md={6}>
                      <SubCard>
                        <CardContent className={classes.tokenCardContent}>
                          <div className={classes.tokenMetricValue}>
                            #{formatValue(
                              _.get(
                                tokenMetrics,
                                ['exchange_supply_metadata', 'rank'],
                                0,
                              ),
                              0,
                            )}
                          </div>
                          <div className={classes.tokenMetricSubtitle}>
                            Rank out of{' '}
                            {formatValue(
                              _.get(
                                tokenMetrics,
                                ['exchange_supply_metadata', 'num_coins'],
                                0,
                              ),
                              0,
                            )}{' '}
                            coins
                          </div>
                        </CardContent>
                      </SubCard>
                    </Grid>
                    <Grid
                      item={true}
                      xs={12}
                      className={classes.tokenMetricHeader}
                    >
                      Percentage of Early Investors Still HODLing
                    </Grid>
                    <Grid item={true} xs={12}>
                      <SubCard>
                        <CardContent className={classes.tokenChartCardContent}>
                          <TokenChart
                            data={_.get(
                              tokenMetrics,
                              'token_retention_rate_data',
                              [],
                            )}
                            yAxisLabel="% Supply Held by Early Investors"
                          />
                        </CardContent>
                      </SubCard>
                    </Grid>
                    <Grid item={true} xs={12} md={6}>
                      <SubCard>
                        <CardContent className={classes.tokenCardContent}>
                          <div className={classes.tokenMetricValue}>
                            {formatValueFixed(
                              _.get(
                                tokenMetrics,
                                [
                                  'token_retention_rate_metadata',
                                  'metric_value',
                                ],
                                0,
                              ) * 100,
                              1,
                            )}%
                          </div>
                          <div className={classes.tokenMetricSubtitle}>
                            Early investors still HODLing
                          </div>
                        </CardContent>
                      </SubCard>
                    </Grid>
                    <Grid item={true} xs={12} md={6}>
                      <SubCard>
                        <CardContent className={classes.tokenCardContent}>
                          <div className={classes.tokenMetricValue}>
                            #{formatValue(
                              _.get(
                                tokenMetrics,
                                ['token_retention_rate_metadata', 'rank'],
                                0,
                              ),
                              0,
                            )}
                          </div>
                          <div className={classes.tokenMetricSubtitle}>
                            Rank out of{' '}
                            {formatValue(
                              _.get(
                                tokenMetrics,
                                ['token_retention_rate_metadata', 'num_coins'],
                                0,
                              ),
                              0,
                            )}{' '}
                            coins
                          </div>
                        </CardContent>
                      </SubCard>
                    </Grid>
                    <Grid
                      item={true}
                      xs={12}
                      className={classes.tokenMetricHeader}
                    >
                      Unique Wallets HODLing Token
                    </Grid>
                    <Grid item={true} xs={12}>
                      <SubCard>
                        <CardContent className={classes.tokenChartCardContent}>
                          <TokenChart
                            data={_.get(
                              tokenMetrics,
                              'unique_wallet_count_data',
                              [],
                            )}
                            yAxisLabel="Wallets"
                            isPercentage={false}
                          />
                        </CardContent>
                      </SubCard>
                    </Grid>
                    <Grid item={true} xs={12} md={6}>
                      <SubCard>
                        <CardContent className={classes.tokenCardContent}>
                          <div className={classes.tokenMetricValue}>
                            {formatValue(
                              _.get(
                                tokenMetrics,
                                [
                                  'unique_wallet_count_metadata',
                                  'metric_value',
                                ],
                                0,
                              ),
                              0,
                            )}
                          </div>
                          <div className={classes.tokenMetricSubtitle}>
                            Wallets
                          </div>
                        </CardContent>
                      </SubCard>
                    </Grid>
                    <Grid item={true} xs={12} md={6}>
                      <SubCard>
                        <CardContent className={classes.tokenCardContent}>
                          <div className={classes.tokenMetricValue}>
                            #{formatValue(
                              _.get(
                                tokenMetrics,
                                ['unique_wallet_count_metadata', 'rank'],
                                0,
                              ),
                              0,
                            )}
                          </div>
                          <div className={classes.tokenMetricSubtitle}>
                            Rank out of{' '}
                            {formatValue(
                              _.get(
                                tokenMetrics,
                                ['unique_wallet_count_metadata', 'num_coins'],
                                0,
                              ),
                              0,
                            )}{' '}
                            coins
                          </div>
                        </CardContent>
                      </SubCard>
                    </Grid>
                    <Grid
                      item={true}
                      xs={12}
                      className={classes.tokenMetricHeader}
                    >
                      Percentage of Tokens Held By Top 100 Wallets
                    </Grid>
                    <Grid item={true} xs={12}>
                      <SubCard>
                        <CardContent className={classes.tokenChartCardContent}>
                          <TokenChart
                            data={_.get(
                              tokenMetrics,
                              'token_distribution_100_data',
                              [],
                            )}
                            yAxisLabel={'% Supply Held by Top 100 Wallets'}
                          />
                        </CardContent>
                      </SubCard>
                    </Grid>
                    <Grid item={true} xs={12} md={6}>
                      <SubCard>
                        <CardContent className={classes.tokenCardContent}>
                          <div className={classes.tokenMetricValue}>
                            {formatValueFixed(
                              _.get(
                                tokenMetrics,
                                [
                                  'token_distribution_100_metadata',
                                  'metric_value',
                                ],
                                0,
                              ) * 100,
                              1,
                            )}%
                          </div>
                          <div className={classes.tokenMetricSubtitle}>
                            Tokens held by top 100
                          </div>
                        </CardContent>
                      </SubCard>
                    </Grid>
                    <Grid item={true} xs={12} md={6}>
                      <SubCard>
                        <CardContent className={classes.tokenCardContent}>
                          <div className={classes.tokenMetricValue}>
                            #{formatValue(
                              _.get(
                                tokenMetrics,
                                ['token_distribution_100_metadata', 'rank'],
                                0,
                              ),
                              0,
                            )}
                          </div>
                          <div className={classes.tokenMetricSubtitle}>
                            Rank out of{' '}
                            {formatValue(
                              _.get(
                                tokenMetrics,
                                [
                                  'token_distribution_100_metadata',
                                  'num_coins',
                                ],
                                0,
                              ),
                              0,
                            )}{' '}
                            coins
                          </div>
                        </CardContent>
                      </SubCard>
                    </Grid>
                    <Grid
                      item={true}
                      xs={12}
                      className={classes.tokenMetricHeader}
                    >
                      Percentage of Supply Transacted on Blockchain
                    </Grid>
                    <Grid item={true} xs={12}>
                      <SubCard>
                        <CardContent className={classes.tokenChartCardContent}>
                          <TokenChart
                            data={_.get(
                              tokenMetrics,
                              'token_velocity_data',
                              [],
                            )}
                            yAxisLabel="% Supply Tx'd on Blockchain"
                          />
                        </CardContent>
                      </SubCard>
                    </Grid>
                    <Grid item={true} xs={12} md={6}>
                      <SubCard>
                        <CardContent className={classes.tokenCardContent}>
                          <div className={classes.tokenMetricValue}>
                            {formatValueFixed(
                              _.get(
                                tokenMetrics,
                                ['token_velocity_metadata', 'metric_value'],
                                0,
                              ) * 100,
                              2,
                            )}%
                          </div>
                          <div className={classes.tokenMetricSubtitle}>
                            Of supply transacted yesterday
                          </div>
                        </CardContent>
                      </SubCard>
                    </Grid>
                    <Grid item={true} xs={12} md={6}>
                      <SubCard>
                        <CardContent className={classes.tokenCardContent}>
                          <div className={classes.tokenMetricValue}>
                            #{formatValue(
                              _.get(
                                tokenMetrics,
                                ['token_velocity_metadata', 'rank'],
                                0,
                              ),
                              0,
                            )}
                          </div>
                          <div className={classes.tokenMetricSubtitle}>
                            Rank out of{' '}
                            {formatValue(
                              _.get(
                                tokenMetrics,
                                ['token_velocity_metadata', 'num_coins'],
                                0,
                              ),
                              0,
                            )}{' '}
                            coins
                          </div>
                        </CardContent>
                      </SubCard>
                    </Grid>
                  </Grid>
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
                  <CardContent
                    className={classnames(
                      classes.subCardContent,
                      classes.ctaCardContent,
                    )}
                  >
                    <Grid
                      container={true}
                      direction="row"
                      justify="center"
                      className={classes.ctaRoot}
                    >
                      <Grid item={true} xs={12} className={classes.ctaImage}>
                        <img src={lightbulb} alt="Lightbulb" />
                      </Grid>
                      <Grid item={true} xs={12} className={classes.ctaTitle}>
                        Know when to buy or sell {symbol}
                      </Grid>
                      <Grid
                        item={true}
                        xs={2}
                        className={classes.ctaIconContainer}
                      >
                        <Icon
                          name="check"
                          regular
                          className={classes.ctaIcon}
                        />
                      </Grid>
                      <Grid item={true} xs={10}>
                        When whales want to dump
                      </Grid>
                      <Grid
                        item={true}
                        xs={2}
                        className={classes.ctaIconContainer}
                      >
                        <Icon
                          name="check"
                          regular
                          className={classes.ctaIcon}
                        />
                      </Grid>
                      <Grid item={true} xs={10}>
                        When founder tokens unlock
                      </Grid>
                      <Grid
                        item={true}
                        xs={2}
                        className={classes.ctaIconContainer}
                      >
                        <Icon
                          name="check"
                          regular
                          className={classes.ctaIcon}
                        />
                      </Grid>
                      <Grid item={true} xs={10}>
                        When the market is bearish or bullish
                      </Grid>
                      <Grid item={true} className={classes.ctaButtonContainer}>
                        <Button
                          href="/signals/reservation"
                          variant="contained"
                          className={classes.ctaButton}
                          data-heap="coin-details-click-get-trading-signals-button"
                        >
                          Get CoinFi Trading Signals
                        </Button>
                      </Grid>
                    </Grid>
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
  withWidth({ withTheme: true, initialWidth: 'md' }),
  withStyles(styles, { withTheme: true }),
)(withRouter(CoinShow))
