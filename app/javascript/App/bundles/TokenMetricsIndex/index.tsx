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
import { withStyles, createStyles } from '@material-ui/core/styles'
import Icon from '~/bundles/common/components/Icon'
import API from '../common/utils/localAPI'
import { formatValue, formatValueFixed } from '../common/utils/numberFormatters'
import WatchStar from '../common/components/WatchStar'
import SearchCoins from '~/bundles/common/components/SearchCoins'
import RedGreenSpan from '~/bundles/common/components/RedGreenSpan'
import LoadingIndicator from '~/bundles/common/components/LoadingIndicator'

interface CoinWithTokenData {
  id?: number
  coin_key: string
  name?: string
  image_url?: string
  symbol?: string
  slug?: string
  price?: number
  market_cap?: number
  rank: number
  metric_value: number
  change_1d: number
  change_7d: number
  change_30d: number
}

interface TokenMetricsResponsePayload {
  data: CoinWithTokenData[]
  page: number
  limit: number
  count: number
  metricType: string
  metricTypeSlug: string
  orderBy: string
  order: ORDERS
}

interface TabData {
  slug: string
  label: string
  description: string
  columnName: string
  type: DATA_TYPES
}

type DATA_TYPES = 'percentage' | 'number'

interface Props extends RouteComponentProps<any> {
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

type ORDERS = 'asc' | 'desc'

enum STATUSES {
  INITIALIZING = 'INITIALIZING',
  LOADING = 'LOADING',
  READY = 'READY',
}

const TABS: TabData[] = [
  {
    slug: 'exchange-supply',
    label: 'Supply On Exchange',
    description:
      'A high percentage of supply on exchanges could indicate higher intention to sell by holders.',
    columnName: 'Supply on Exchanges',
    type: 'percentage',
  },
  {
    slug: 'token-retention',
    label: 'Retention',
    description:
      'A high percentage of early investors still HODLing could indicate strong believe in project.',
    columnName: '% of Early Investors Still HODLing',
    type: 'percentage',
  },
  {
    slug: 'token-distribution',
    label: 'Decentralization',
    description:
      'A high percentage held by whales could indicate higher vulnerability to price manipulation.',
    columnName: '% Held by Top 100 Wallets',
    type: 'percentage',
  },
  {
    slug: 'unique-wallet',
    label: 'Adoption',
    description:
      'More unique wallets HOLDLing could indicate more adoption by users.',
    columnName: 'Unique Wallets HODLing Token',
    type: 'number',
  },
  {
    slug: 'token-velocity',
    label: 'Velocity',
    description:
      'A high percentage of the supply transacted on the blockchain could indicate strong adoption or usage of the token.',
    columnName: '% of Supply Transacted on Blockchain',
    type: 'percentage',
  },
]

const styles = (theme) =>
  createStyles({
    rootContainer: {
      maxWidth: '1200px',
      margin: '50px auto 0',
      border: '1px solid rgb(0, 0, 0, 0.18)',
      backgroundColor: '#fff',
      padding: '35px 25px',
    },
    tabsRoot: {
      backgroundColor: '#fff',
      marginBottom: '16px',
    },
    tabsFlexContainer: {
      borderBottom: '1px solid rgb(0, 0, 0, 0.12)',
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
    },
    tableHeaderRow: {
      height: '36px',
    },
    tableHeaderCell: {
      backgroundColor: '#f6f8fa', // pearl-gray
      borderTop: '1px solid rgba(224, 224, 224, 1)',
    },
    tableCellRank: {
      width: '60px',
      maxWidth: '60px',
    },
    tableCellCoin: {
      width: '240px',
      maxWidth: '240px',
      borderRight: '1px solid rgba(224, 224, 224, 1)',
    },
    rankItem: {
      lineHeight: '18px',
    },
    coinTextWrapper: {
      height: '100%',
    },
    coinIcon: {
      flexShrink: 0,
      flexGrow: 0,
      paddingRight: '7px',
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
      orderBy: 'rank',
      order: 'asc',
      rows,
    }
  }

  public componentDidUpdate(prevProps, prevState) {
    const hasOrderChanged =
      this.state.orderBy !== prevState.orderBy ||
      this.state.order !== prevState.order
    const hasTabChanged = this.state.tabIndex !== prevState.tabIndex
    if (hasOrderChanged || hasTabChanged) {
      this.setState(
        {
          status: STATUSES.LOADING,
        },
        () => {
          this.fetchMetrics().then((payload) => {
            const { data, metricType, metricTypeSlug, orderBy, order } = payload
            const tabIndex = this.getTabIndexFromSlug(metricTypeSlug)

            if (
              this.state.tabIndex === tabIndex &&
              this.state.orderBy === orderBy &&
              this.state.order === order
            ) {
              this.setState({
                status: STATUSES.READY,
                metricType,
                tabIndex,
                orderBy,
                order,
                rows: data,
              })
            }
          })
        },
      )
    }

    if (hasTabChanged) {
      const { tabIndex } = this.state
      const metricTypeSlug = _.get(TABS, [tabIndex, 'slug'], TABS[0].slug)
      this.props.history.push(`/token-metrics/${metricTypeSlug}`)
    }
  }

  public fetchMetrics = (): Promise<TokenMetricsResponsePayload> => {
    const { tabIndex, orderBy, order } = this.state
    const metricTypeSlug = _.get(TABS, [tabIndex, 'slug'], TABS[0].slug)
    return API.get(
      `/token-metrics/${metricTypeSlug}/?orderBy=${orderBy}&order=${order}`,
    ).then((response) => response.payload as TokenMetricsResponsePayload)
  }

  public getTabIndexFromSlug = (metricTypeSlug) => {
    const index = _.findIndex(TABS, (tab) => tab.slug === metricTypeSlug)
    return index >= 0 ? index : 0
  }

  public handleTabChange = (e, tabIndex: number) => {
    this.setState({
      tabIndex,
      orderBy: 'rank',
      order: 'asc',
    })
  }

  public handleSortChange = (property) => (event) => {
    if (this.state.orderBy === property) {
      const order = this.state.order === 'asc' ? 'desc' : 'asc'
      this.setState({ order })
    } else {
      const orderBy = property
      const order = 'asc'
      this.setState({
        orderBy,
        order,
      })
    }
  }

  public render() {
    const { classes, user } = this.props
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
        <h1>ERC-20 Advanced Token Metrics</h1>
        <Tabs
          value={tabIndex}
          onChange={this.handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          scrollable={true}
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
                  numeric={true}
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
                <TableCell className={classes.tableHeaderCell} numeric={true}>
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
                <TableCell className={classes.tableHeaderCell} numeric={true}>
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
                <TableCell className={classes.tableHeaderCell} numeric={true}>
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
                <TableCell className={classes.tableHeaderCell} numeric={true}>
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
                <TableCell className={classes.tableHeaderCell} numeric={true}>
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
                <TableCell className={classes.tableHeaderCell} numeric={true}>
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
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={8}>
                    <LoadingIndicator />
                  </TableCell>
                </TableRow>
              ) : (
                rows.map((row) => {
                  return (
                    <TableRow key={row.coin_key}>
                      <TableCell
                        className={classes.tableCellRank}
                        numeric={true}
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
                              <img alt={row.name} src={row.image_url} />
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
                                <a href={`/coins/${row.slug}`}>{row.symbol}</a>
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
                      <TableCell numeric={true}>
                        {_.isNumber(row.metric_value) &&
                          `${metricFormatter(row.metric_value)}`}
                      </TableCell>
                      <TableCell numeric={true}>
                        {_.isNumber(row.change_1d) && (
                          <RedGreenSpan
                            text={formatValue(row.change_1d, 2)}
                            affix="%"
                          />
                        )}
                      </TableCell>
                      <TableCell numeric={true}>
                        {_.isNumber(row.change_7d) && (
                          <RedGreenSpan
                            text={formatValue(row.change_7d, 2)}
                            affix="%"
                          />
                        )}
                      </TableCell>
                      <TableCell numeric={true}>
                        {_.isNumber(row.change_30d) && (
                          <RedGreenSpan
                            text={formatValue(row.change_30d, 2)}
                            affix="%"
                          />
                        )}
                      </TableCell>
                      <TableCell numeric={true}>
                        {_.isNumber(row.price) && `$${formatValue(row.price)}`}
                      </TableCell>
                      <TableCell numeric={true}>
                        {_.isNumber(row.market_cap) &&
                          `$${formatValue(row.market_cap)}`}
                      </TableCell>
                    </TableRow>
                  )
                })
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    )
  }
}

export default withStyles(styles)(withRouter<Props>(TokenMetricsIndex))
