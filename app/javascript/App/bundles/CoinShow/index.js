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
  withStyles,
  createStyles,
} from '@material-ui/core'
import withWidth, { isWidthDown } from '@material-ui/core/withWidth'
import axios from 'axios'
import SearchCoins from '~/bundles/common/components/SearchCoins'
import CoinCharts from '~/bundles/common/components/CoinCharts'
import Fundamentals from './Fundamentals'
import Links from './Links'
import HistoricalPriceDataTable from './HistoricalPriceDataTable'

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

  state = {
    liveCoinArr: [],
    currency: 'USD',
    watched: this.props.watching,
    iconLoading: false,
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

    const percentChange1h = {
      positive: coinObj.change1h > 0,
      value: coinObj.change1h,
    }

    const { currency } = this.state
    const prepend = currency === 'USD' ? '$' : ''
    const price = `${prepend}${Number.parseFloat(
      _.get(coinObj, ['price', currency.toLowerCase()], 0),
    ).toPrecision(6)} ${currency}`
    const isPositive = percentChange1h.value > 0
    const arrow = isPositive ? '▲' : '▼'

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
        <Grid item={true} xs={12} className={classes.titleBar}>
          <img alt={coinObj.name} src={coinObj.image_url} />
          {coinObj.name}
          {symbol}
          {price}
          {arrow}
          {percentChange1h.value}%
          <Button>Watch Button</Button>
        </Grid>
        <Grid item={true} xs={12} md={8}>
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
        </Grid>
        <Grid item={true} xs={12} md={8} className={classes.widgetContainer}>
          <Card raised={false} square={true} className={classes.subCard}>
            <CardHeader
              subheader="Fundamentals"
              className={classes.subCardHeader}
            />
            <CardContent>
              <Fundamentals coinObj={coinObj} currency={currency} />
            </CardContent>
          </Card>
          <Card raised={false} square={true} className={classes.subCard}>
            <CardHeader subheader="Links" className={classes.subCardHeader} />
            <CardContent>
              <Links coinObj={coinObj} />
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
          {metabaseUrl ? (
            <Card raised={false} square={true} className={classes.subCard}>
              <CardHeader
                subheader="Advanced Token Metrics"
                className={classes.subCardHeader}
              />
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
            </Card>
          ) : null}
        </Grid>
      </Grid>
    )
  }
}

export default compose(
  withWidth(),
  withStyles(styles),
)(CoinShow)
