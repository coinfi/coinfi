import * as React from 'react'
import * as _ from 'lodash'
import classnames from 'classnames'
import { withRouter, RouteComponentProps } from 'react-router'
import {
  Grid,
  Paper,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
  TableSortLabel,
} from '@material-ui/core'
import Button from '@material-ui/core/Button'
import { withStyles, createStyles } from '@material-ui/core/styles'
import {
  CurrencyContextType,
  withCurrency,
} from '~/bundles/common/contexts/CurrencyContext'
import Icon from '~/bundles/common/components/Icon'
import API from '~/bundles/common/utils/localAPI'
import {
  formatValue,
  formatValueFixed,
  formatPrice,
  formatPercentage,
} from '~/bundles/common/utils/numberFormatters'
import WatchStar from '~/bundles/common/components/WatchStar'
import SearchCoins from '~/bundles/common/components/SearchCoins'
import RedGreenSpan from '~/bundles/common/components/RedGreenSpan'
import LoadingIndicator from '~/bundles/common/components/LoadingIndicator'
import {
  black54,
  black87,
  pearlGray,
  white,
  borderColor,
  muiBorderColor,
} from '~/bundles/common/styles/colors'
import { TABS, orderByDefaults } from './constants'
import LazyLoadImage from '~/bundles/common/components/LazyLoadImage'

interface Props extends RouteComponentProps<any>, CurrencyContextType {
  classes: any
  page: number
  limit: number
  count: number
  user: any
  metricType: string
  metricTypeSlug: string
  coinsWithTokenData: CoinWithTokenData[]
}

interface State {
  status: STATUSES
  metricType: string
  tabIndex: number
  orderBy: string
  order: ORDERS
  rows: CoinWithTokenData[]
}

enum STATUSES {
  INITIALIZING = 'INITIALIZING',
  LOADING = 'LOADING',
  READY = 'READY',
}

const styles = (theme) =>
  createStyles({
    rootContainer: {
      maxWidth: '1200px',
      margin: '50px auto 0',
      border: `1px solid ${borderColor}`,
      backgroundColor: white,
      padding: '35px 25px',
      color: black87,
    },
    title: {
      color: black87,
      fontSize: '34px',
      fontWeight: 'normal',
    },
    tabsRoot: {
      backgroundColor: white,
      marginBottom: '16px',
    },
    tabsFlexContainer: {
      borderBottom: `1px solid ${borderColor}`,
    },
    tabRoot: {
      textTransform: 'none',
      minWidth: 'unset',
      fontSize: '14px',
      [theme.breakpoints.down('sm')]: {
        whiteSpace: 'nowrap',
      },
    },
    tabSelected: {
      fontWeight: 600,
    },
    tabLabelContainer: {
      paddingRight: '12px',
      paddingLeft: '12px',
    },
    tabTextColorPrimary: {
      color: black87,
    },
    header: {
      marginBottom: '16px',
    },
    description: {
      fontSize: '14px',
      fontWeight: 500,
    },
    searchContainer: {
      [theme.breakpoints.down('sm')]: {
        width: '100%',
        marginTop: '16px',
      },
    },
    searchPaper: {
      padding: '3px 16px',
      // borderRadius: '4px',
    },
    tableWrapper: {
      overflowX: 'scroll',
      '& td': {
        fontSize: '14px',
        fontWeight: 500,
        color: black87,
      },
    },
    tableHeaderRow: {
      height: '36px',
    },
    tableHeaderCell: {
      backgroundColor: pearlGray,
      borderTop: `1px solid ${muiBorderColor}`,
      color: black54,
      fontSize: '14px',
      fontWeight: 500,
    },
    tableCellRank: {
      width: '60px',
      maxWidth: '60px',
    },
    tableCellCoin: {
      width: '240px',
      maxWidth: '240px',
      borderRight: `1px solid ${muiBorderColor}`,
    },
    rankItem: {
      lineHeight: '18px',
      fontSize: '12px',
      fontWeight: 'normal',
    },
    coinTextWrapper: {
      height: '100%',
    },
    coinIcon: {
      flexShrink: 0,
      flexGrow: 0,
      paddingRight: '7px',
    },
    coinImage: {
      maxWidth: '32px',
      height: 'auto',
    },
    coinSymbol: {},
    coinName: {
      fontSize: '12px',
    },
    inlineButton: {
      padding: 0,
      textTransform: 'unset',
      lineHeight: 'unset',
      verticalAlign: 'unset',
    },
  })

const generateSortIcon = ({ property, orderBy, order }) => {
  if (orderBy === property) {
    if (order === 'asc') {
      return () => <Icon name="sort-up" solid={true} />
    } else {
      return () => <Icon name="sort-down" solid={true} />
    }
  } else {
    return () => <Icon name="sort" solid={true} />
  }
}

class TokenMetricsIndex extends React.Component<Props, State> {
  constructor(props) {
    super(props)

    const { metricType, metricTypeSlug, coinsWithTokenData } = props
    const tabIndex = this.getTabIndexFromSlug(metricTypeSlug)

    const hasInitialData =
      _.isArray(coinsWithTokenData) && coinsWithTokenData.length > 0
    const status = hasInitialData ? STATUSES.READY : STATUSES.INITIALIZING
    const rows = hasInitialData ? coinsWithTokenData : []

    this.state = {
      status,
      metricType,
      tabIndex,
      ...orderByDefaults,
      rows,
    }
  }

  public componentDidMount() {
    if (this.state.status !== STATUSES.READY) {
      const { tabIndex, orderBy, order } = this.state
      this.fetchAndSetMetrics(tabIndex, orderBy, order)
    }
  }

  public componentDidUpdate(prevProps, prevState) {
    const hasOrderChanged =
      this.state.orderBy !== prevState.orderBy ||
      this.state.order !== prevState.order
    const hasTabChanged = this.state.tabIndex !== prevState.tabIndex
    if (hasOrderChanged || hasTabChanged) {
      const { tabIndex, orderBy, order } = this.state
      this.fetchAndSetMetrics(tabIndex, orderBy, order)
    }

    if (hasTabChanged) {
      const { tabIndex } = this.state
      const metricTypeSlug = this.getSlugFromTabIndex(tabIndex)
      this.props.history.push(`/token-metrics/${metricTypeSlug}`)
    }
  }

  public fetchAndSetMetrics = (tabIndex, orderBy, order) => {
    this.setState(
      {
        status: STATUSES.LOADING,
      },
      () => {
        this.fetchMetrics(tabIndex, orderBy, order)
          .then((payload) => {
            const {
              data,
              metricType,
              metricTypeSlug,
              orderBy: payloadOrderBy,
              order: payloadOrder,
            } = payload
            const payloadTabIndex = this.getTabIndexFromSlug(metricTypeSlug)

            if (
              this.state.tabIndex === payloadTabIndex &&
              this.state.orderBy === payloadOrderBy &&
              this.state.order === payloadOrder
            ) {
              this.setState({
                status: STATUSES.READY,
                metricType,
                tabIndex: payloadTabIndex,
                orderBy: payloadOrderBy,
                order: payloadOrder,
                rows: data,
              })
            } else {
              this.setState({
                status: STATUSES.READY,
              })
            }
          })
          .catch((error) => {
            this.setState({
              status: STATUSES.READY,
              rows: [],
            })
          })
      },
    )
  }

  public fetchMetrics = (
    tabIndex,
    orderBy,
    order,
  ): Promise<TokenMetricsResponsePayload> => {
    const metricTypeSlug = this.getSlugFromTabIndex(tabIndex)
    return API.get(
      `/token-metrics/${metricTypeSlug}/?orderBy=${orderBy}&order=${order}`,
    ).then((response) => response.payload as TokenMetricsResponsePayload)
  }

  public getSlugFromTabIndex = (tabIndex) => {
    const metricTypeSlug = _.get(TABS, [tabIndex, 'slug'], TABS[0].slug)
    return metricTypeSlug
  }

  public getTabIndexFromSlug = (metricTypeSlug) => {
    const index = _.findIndex(TABS, (tab) => tab.slug === metricTypeSlug)
    return index >= 0 ? index : 0
  }

  public handleRefresh = (e) => {
    const { tabIndex, orderBy, order } = this.state
    this.fetchAndSetMetrics(tabIndex, orderBy, order)
  }

  public handleTabChange = (e, tabIndex: number) => {
    this.setState({
      tabIndex,
      ...orderByDefaults,
    })
  }

  public handleSortChange = (property) => (event) => {
    if (this.state.orderBy === property) {
      const order = this.state.order === 'asc' ? 'desc' : 'asc'
      this.setState({ order })
    } else {
      const orderBy = property
      const { order } = orderByDefaults
      this.setState({
        orderBy,
        order,
      })
    }
  }

  public render() {
    const { classes, user, currencyRate, currencySymbol } = this.props
    const { tabIndex, orderBy, order, status, rows } = this.state

    const isLoading = status !== STATUSES.READY
    const isLoggedIn = !_.isUndefined(user)
    const tabInfo = _.get(TABS, tabIndex, TABS[0])
    const metricFormatter =
      tabInfo.type === 'percentage'
        ? (x) => `${formatValueFixed(x, 1)}%`
        : (x) => formatValue(x, 0)

    return (
      <div className={classes.rootContainer}>
        <h1 className={classes.title}>ERC-20 Advanced Token Metrics</h1>
        <Tabs
          value={tabIndex}
          onChange={this.handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          variant="scrollable"
          scrollButtons="off"
          classes={{
            root: classes.tabsRoot,
            flexContainer: classes.tabsFlexContainer,
          }}
        >
          {TABS.map((tab, index) => (
            <Tab
              label={tab.label}
              value={index}
              key={index}
              classes={{
                root: classes.tabRoot,
                selected: classes.tabSelected,
                labelContainer: classes.tabLabelContainer,
                textColorPrimary: classes.tabTextColorPrimary,
              }}
            />
          ))}
        </Tabs>
        <Grid
          container={true}
          justify="space-between"
          className={classes.header}
        >
          <Grid item={true} className={classes.description}>
            {tabInfo.description}
          </Grid>
          <Grid item={true} className={classes.searchContainer}>
            <Paper className={classes.searchPaper}>
              <SearchCoins
                onSelect={(suggestion) =>
                  (window.location.href = `/coins/${suggestion.slug}`)
                }
                tokensOnly={true}
                coinShow={false}
                unstyled={true}
              />
            </Paper>
          </Grid>
        </Grid>
        <div className={classes.tableWrapper}>
          <Table padding="dense" className={classes.tableRoot}>
            <TableHead>
              <TableRow className={classes.tableHeaderRow}>
                <TableCell
                  className={classnames(
                    classes.tableHeaderCell,
                    classes.tableCellRank,
                  )}
                  align="right"
                >
                  #
                </TableCell>
                <TableCell
                  className={classnames(
                    classes.tableHeaderCell,
                    classes.tableCellCoin,
                  )}
                >
                  Coin
                </TableCell>
                <TableCell className={classes.tableHeaderCell} align="right">
                  <TableSortLabel
                    active={orderBy === 'metric_value'}
                    direction={order}
                    onClick={this.handleSortChange('metric_value')}
                    IconComponent={generateSortIcon({
                      orderBy,
                      order,
                      property: 'metric_value',
                    })}
                  >
                    {tabInfo.columnName}
                  </TableSortLabel>
                </TableCell>
                <TableCell className={classes.tableHeaderCell} align="right">
                  <TableSortLabel
                    active={orderBy === 'change_1d'}
                    direction={order}
                    onClick={this.handleSortChange('change_1d')}
                    IconComponent={generateSortIcon({
                      orderBy,
                      order,
                      property: 'change_1d',
                    })}
                  >
                    % 1D
                  </TableSortLabel>
                </TableCell>
                <TableCell className={classes.tableHeaderCell} align="right">
                  <TableSortLabel
                    active={orderBy === 'change_7d'}
                    direction={order}
                    onClick={this.handleSortChange('change_7d')}
                    IconComponent={generateSortIcon({
                      orderBy,
                      order,
                      property: 'change_7d',
                    })}
                  >
                    % 1W
                  </TableSortLabel>
                </TableCell>
                <TableCell className={classes.tableHeaderCell} align="right">
                  <TableSortLabel
                    active={orderBy === 'change_30d'}
                    direction={order}
                    onClick={this.handleSortChange('change_30d')}
                    IconComponent={generateSortIcon({
                      orderBy,
                      order,
                      property: 'change_30d',
                    })}
                  >
                    % 1M
                  </TableSortLabel>
                </TableCell>
                <TableCell className={classes.tableHeaderCell} align="right">
                  <TableSortLabel
                    active={orderBy === 'price'}
                    direction={order}
                    onClick={this.handleSortChange('price')}
                    IconComponent={generateSortIcon({
                      orderBy,
                      order,
                      property: 'price',
                    })}
                  >
                    Price
                  </TableSortLabel>
                </TableCell>
                <TableCell className={classes.tableHeaderCell} align="right">
                  <TableSortLabel
                    active={orderBy === 'market_cap'}
                    direction={order}
                    onClick={this.handleSortChange('market_cap')}
                    IconComponent={generateSortIcon({
                      orderBy,
                      order,
                      property: 'market_cap',
                    })}
                  >
                    Market Cap
                  </TableSortLabel>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {!isLoading ? (
                rows && rows.length > 0 ? (
                  rows.map((row) => {
                    return (
                      <TableRow key={row.coin_key}>
                        <TableCell
                          className={classes.tableCellRank}
                          align="right"
                        >
                          <Grid
                            container={true}
                            wrap="nowrap"
                            alignContent="stretch"
                            justify="space-between"
                          >
                            <Grid item={true}>
                              {!_.isUndefined(row.id) && (
                                <WatchStar
                                  coin={row as { id: number }}
                                  loggedIn={isLoggedIn}
                                  hasText={false}
                                />
                              )}
                            </Grid>
                            <Grid item={true} className={classes.rankItem}>
                              {row.rank}
                            </Grid>
                          </Grid>
                        </TableCell>
                        <TableCell className={classes.tableCellCoin}>
                          <Grid
                            container={true}
                            direction="row"
                            alignContent="flex-start"
                            alignItems="stretch"
                            wrap="nowrap"
                            className={classes.coinWrapper}
                          >
                            <Grid item={true} className={classes.coinIcon}>
                              {_.isString(row.image_url) && (
                                <LazyLoadImage
                                  alt={row.name}
                                  src={row.image_url}
                                  className={classes.coinImage}
                                />
                              )}
                            </Grid>
                            <Grid item={true}>
                              <Grid
                                container={true}
                                direction="column"
                                justify="space-evenly"
                                wrap="nowrap"
                                className={classes.coinTextWrapper}
                              >
                                <Grid
                                  item={true}
                                  xs={12}
                                  className={classes.coinSymbol}
                                >
                                  <a href={`/coins/${row.slug}`}>
                                    {row.symbol}
                                  </a>
                                </Grid>
                                <Grid
                                  item={true}
                                  xs={12}
                                  className={classes.coinName}
                                >
                                  {row.name}
                                </Grid>
                              </Grid>
                            </Grid>
                          </Grid>
                        </TableCell>
                        <TableCell align="right">
                          {_.isNumber(row.metric_value) &&
                            `${metricFormatter(row.metric_value)}`}
                        </TableCell>
                        <TableCell align="right">
                          {_.isNumber(row.change_1d) && (
                            <RedGreenSpan
                              text={formatPercentage(row.change_1d)}
                              affix="%"
                            />
                          )}
                        </TableCell>
                        <TableCell align="right">
                          {_.isNumber(row.change_7d) && (
                            <RedGreenSpan
                              text={formatPercentage(row.change_7d)}
                              affix="%"
                            />
                          )}
                        </TableCell>
                        <TableCell align="right">
                          {_.isNumber(row.change_30d) && (
                            <RedGreenSpan
                              text={formatPercentage(row.change_30d)}
                              affix="%"
                            />
                          )}
                        </TableCell>
                        <TableCell align="right">
                          {_.isNumber(row.price) &&
                            `${currencySymbol}${formatPrice(
                              row.price * currencyRate,
                            )}`}
                        </TableCell>
                        <TableCell align="right">
                          {_.isNumber(row.market_cap) &&
                            `${currencySymbol}${formatPrice(
                              row.market_cap * currencyRate,
                            )}`}
                        </TableCell>
                      </TableRow>
                    )
                  })
                ) : (
                  // No data
                  <TableRow>
                    <TableCell colSpan={8} align="center">
                      <span>Could not retrieve data. </span>
                      <Button
                        onClick={this.handleRefresh}
                        color="primary"
                        className={classes.inlineButton}
                      >
                        Try again.
                      </Button>
                    </TableCell>
                  </TableRow>
                )
              ) : (
                // Loading
                <TableRow>
                  <TableCell colSpan={8}>
                    <LoadingIndicator />
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    )
  }
}

export default withStyles(styles)(
  withRouter<Props>(withCurrency(TokenMetricsIndex)),
)
