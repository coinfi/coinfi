import React, { Component, Fragment } from 'react'
import { Table } from 'antd'
import compose from 'recompose/compose'
import ColumnNames from './ColumnNames'
import {
  Button,
  Paper,
  Typography,
  Hidden,
  Grid,
  withWidth,
} from '@material-ui/core'
import SearchCoins from '~/bundles/common/components/SearchCoins'
import API from '../../bundles/common/utils/localAPI'
import * as _ from 'lodash'
import { withStyles, createStyles } from '@material-ui/core/styles'
import NewsList from './NewsList'
import MarketDominance from './MarketDominance'
import TotalMarketCap from './TotalMarketCap'

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
    widthContainer: {
      width: '100%',
      backgroundColor: '#fff',
    },
    widgetContainer: {
      [theme.breakpoints.up('md')]: {
        margin: '0 auto !important',
        maxWidth: '1200px',
        padding: `${theme.spacing.unit * 4}px`,
      },
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

class CoinIndex extends Component {
  constructor(props) {
    super(props)

    const loading =
      _.isUndefined(props.initialCoins) || _.isUndefined(props.marketDominance)

    this.state = {
      coins: props.initialCoins || [],
      pagination: {
        defaultPageSize: 100,
        total: this.props.coinCount,
      },
      loading,
      currency: 'USD',
    }
  }

  handleTableChange = (pagination) => {
    const pager = { ...this.state.pagination }
    pager.current = pagination.current
    this.setState({
      pagination: pager,
    })
    this.fetchCoins({
      per: pagination.pageSize,
      page: pagination.current,
    })
  }

  fetchCoins = (params = {}) => {
    this.setState({ loading: true })
    API.get('/coins', params).then((response) => {
      this.setState({
        loading: false,
        coins: response.payload,
      })
    })
  }

  componentDidMount() {
    if (_.isEmpty(this.state.coins)) {
      this.fetchCoins({ per: this.state.pagination.defaultPageSize })
    }
  }

  changeCurrencyHandler = ({ key }) => {
    this.setState({
      currency: key,
    })
  }
  render() {
    const { classes, marketDominance, totalMarketCap } = this.props

    return (
      <Fragment>
        <Paper className={classes.mainFeaturedPost} square={true}>
          <Grid
            container
            direction="column"
            justify="center"
            alignItems="center"
            className={classes.mainFeaturedPostContent}
          >
            <Grid item md>
              <Typography className={classes.header} color="inherit">
                Financial intelligence for cryptocurrency
              </Typography>
            </Grid>
            <Grid item md>
              <Typography
                className={classes.subheader}
                color="inherit"
                paragraph
              >
                Uncover buy and sell opportunities through data science backed
                blockchain analytics.
              </Typography>
            </Grid>
            <Grid item md>
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

        <div className={classes.widthContainer}>
          <Grid
            container
            direction="row"
            justify="center"
            alignItems="stretch"
            className={classes.widgetContainer}
            spacing={24}
          >
            <Grid item xs={12} md={6} className={classes.widgetContainerLeft}>
              <Grid
                container
                className={classes.leftContainerInner}
                spacing={8}
              >
                <Grid item md>
                  <TotalMarketCap marketCapData={totalMarketCap} />
                </Grid>
                <Grid item md>
                  <MarketDominance coinData={marketDominance} />
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12} md={6} className={classes.widgetContainerRight}>
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
        </div>

        <div className="flex">
          <h1 className="pt3 pl3">Coins</h1>
          <span style={{ flexGrow: 1 }} />
          <div className="flex pt3">
            <div className="ma2">
              <SearchCoins
                onSelect={(suggestion) =>
                  (window.location.href = `/coins/${suggestion.slug}`)
                }
                unstyled
              />
            </div>
          </div>
        </div>

        <Table
          rowKey={(record) => record.symbol + record.name}
          columns={ColumnNames(this.state.currency)}
          dataSource={this.state.coins}
          pagination={this.state.pagination}
          onChange={this.handleTableChange}
          loading={{ spinning: this.state.loading }}
          scroll={{ x: 1080 }}
          style={{ background: '#fff' }}
        />
      </Fragment>
    )
  }
}

export default compose(
  withStyles(styles),
  withWidth(),
)(CoinIndex)
