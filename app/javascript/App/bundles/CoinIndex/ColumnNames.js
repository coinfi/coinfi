import React from 'react'
import _ from 'lodash'
import RedGreenSpan from '~/bundles/common/components/RedGreenSpan'
import { Sparklines, SparklinesLine } from 'react-sparklines'
import { Grid } from '@material-ui/core'
import {
  formatPrice,
  formatPercentage,
  formatVolume,
} from '~/bundles/common/utils/numberFormatters'
import LazyLoadImage from '~/bundles/common/components/LazyLoadImage'

export default ({ currency, currencyRate, currencySymbol }) => {
  return [
    {
      title: '#',
      dataIndex: 'ranking',
      align: 'left',
    },
    {
      title: 'Coin',
      dataIndex: 'name',
      render: (text, row, index, classes) => {
        return (
          <Grid
            container={true}
            direction="row"
            alignContent="flex-start"
            alignItems="stretch"
            wrap="nowrap"
            className={classes.coinWrapper}
          >
            <Grid item={true} className={classes.coinIcon}>
              <LazyLoadImage alt={row.name} src={row.image_url} />
            </Grid>
            <Grid item={true}>
              <Grid container={true} direction="column">
                <Grid item={true} xs={12} className={classes.coinSymbol}>
                  <a href={`/coins/${row.slug}`}>{row.symbol}</a>
                </Grid>
                <Grid item={true} xs={12} className={classes.coinName}>
                  {row.name}
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        )
      },
      mobileRender: (text, row, index) => {
        return (
          <span>
            <a href={`/coins/${row.slug}`}>{row.symbol}</a> {text}
          </span>
        )
      },
    },
    {
      title: 'Price',
      dataIndex: 'price',
      align: 'right',
      render: (text, row, index) => {
        return (
          <span style={{ whiteSpace: 'nowrap' }}>
            {currencySymbol}
            {formatPrice(text * currencyRate)}
          </span>
        )
      },
    },
    {
      title: 'Market Cap',
      dataIndex: 'market_cap',
      align: 'right',
      render: (text, row, index) =>
        !_.isUndefined(text) ? (
          <span>
            {currencySymbol}
            {formatPrice(text * currencyRate)}
          </span>
        ) : null,
    },
    {
      title: '% Move 1H',
      dataIndex: 'change1h',
      align: 'right',
      render: (text, row, index) => (
        <RedGreenSpan text={formatPercentage(text)} affix="%" />
      ),
    },
    {
      title: '% Move 1D',
      dataIndex: 'change24h',
      align: 'right',
      render: (text, row, index) => (
        <RedGreenSpan text={formatPercentage(text)} affix="%" />
      ),
    },
    {
      title: '% Move 1W',
      dataIndex: 'change7d',
      align: 'right',
      render: (text, row, index) => (
        <RedGreenSpan text={formatPercentage(text)} affix="%" />
      ),
    },
    {
      title: 'Volume (24hr)',
      dataIndex: 'volume24h',
      align: 'right',
      render: (text, row, index) =>
        !_.isUndefined(text) ? (
          <span>
            {currencySymbol}
            {formatVolume(text * currencyRate)}
          </span>
        ) : null,
    },
    {
      title: '7D Chart',
      dataIndex: 'sparkline',
      align: 'right',
      render: (text, row, index) => {
        return (
          <Sparklines data={text}>
            <SparklinesLine />
          </Sparklines>
        )
      },
    },
  ]
}
