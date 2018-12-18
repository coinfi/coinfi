import * as React from 'react'
import * as _ from 'lodash'
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
} from '@material-ui/core'
import { withStyles, createStyles } from '@material-ui/core/styles'
import { formatValue, formatValueFixed } from '../common/utils/numberFormatters'
import SearchCoins from '~/bundles/common/components/SearchCoins'
import RedGreenSpan from '~/bundles/common/components/RedGreenSpan'

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
  token_metric: number
  change_1d: number
  change_7d: number
  change_30d: number
}

interface Props {
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
  tabIndex: number
}

const TABS = [
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
    tableCellRank: {
      width: '30px',
      maxWidth: '30px',
    },
    tableCellCoin: {
      width: '240px',
      maxWidth: '240px',
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

class TokenMetricsIndex extends React.Component<Props, State> {
  constructor(props) {
    super(props)

    const tabIndex =
      _.findIndex(TABS, (tab) => tab.slug === props.metricTypeSlug) || 0
    this.state = {
      tabIndex,
    }
  }

  public handleTabChange = (e, tabIndex) => {
    const tabSlug = _.get(TABS, [tabIndex, 'slug'], '')
    window.location.href = `/token-metrics/${tabSlug}`
  }

  public render() {
    const { classes, user, coinsWithTokenData: rows } = this.props
    const { tabIndex } = this.state

    const isLoggedIn = !_.isUndefined(user)
    const tabInfo = TABS[tabIndex]
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
        <Grid container={true} justify="space-between">
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
              <TableRow>
                <TableCell className={classes.tableCellRank}>#</TableCell>
                <TableCell className={classes.tableCellCoin}>Coin</TableCell>
                <TableCell numeric={true}>{tabInfo.columnName}</TableCell>
                <TableCell numeric={true}>% 1D</TableCell>
                <TableCell numeric={true}>% 1W</TableCell>
                <TableCell numeric={true}>% 1M</TableCell>
                <TableCell numeric={true}>Price</TableCell>
                <TableCell numeric={true}>Market Cap</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => {
                return (
                  <TableRow key={row.coin_key}>
                    <TableCell className={classes.tableCellRank}>
                      {row.rank}
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
                          <img alt={row.name} src={row.image_url} />
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
                      {metricFormatter(row.token_metric)}
                    </TableCell>
                    <TableCell numeric={true}>
                      <RedGreenSpan
                        text={formatValue(row.change_1d, 2)}
                        affix="%"
                      />
                    </TableCell>
                    <TableCell numeric={true}>
                      <RedGreenSpan
                        text={formatValue(row.change_7d, 2)}
                        affix="%"
                      />
                    </TableCell>
                    <TableCell numeric={true}>
                      <RedGreenSpan
                        text={formatValue(row.change_30d, 2)}
                        affix="%"
                      />
                    </TableCell>
                    <TableCell numeric={true}>
                      ${formatValue(row.price)}
                    </TableCell>
                    <TableCell numeric={true}>
                      ${formatValue(row.market_cap)}
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
      </div>
    )
  }
}

export default withStyles(styles)(TokenMetricsIndex)
