import React from 'react'
import _ from 'lodash'
import RedGreenSpan from '../common/components/RedGreenSpan'
import Icon from '../common/components/Icon'
import { Sparklines, SparklinesLine } from 'react-sparklines'
import {
  formatVolume,
  formatPrice,
  formatPercentage,
} from '../common/utils/numberFormatters'

function ColumnNames({ currency, currencyRate, currencySymbol }) {
  return [
    {
      headerName: '',
      field: 'isWatched',
      suppressSorting: true,
      minWidth: 30,
      maxWidth: 30,
      cellStyle: { 'margin-left': '5px' },
      cellRendererFramework: ({
        value: isWatched,
        data: row,
        rowIndex: index,
        context,
      }) => {
        const { handleWatchStarClick } = context
        return (
          <span>
            <Icon
              name="star"
              solid={isWatched}
              className={isWatched ? 'aqua' : 'light-silver'}
              onClick={() => handleWatchStarClick(row.id, isWatched)}
            />
          </span>
        )
      },
    },
    {
      headerName: '#',
      field: 'ranking',
      suppressSorting: true,
      maxWidth: 40,
      cellRendererFramework: ({ value: text, data: row, rowIndex: index }) => {
        return <span>{text}</span>
      },
    },
    {
      headerName: 'Coin',
      field: 'name',
      suppressSorting: true,
      minWidth: 200,
      cellStyle: { 'border-right': '1px solid #e0e0e0' },
      cellRendererFramework: ({ value: text, data: row, rowIndex: index }) => {
        return (
          <div
            style={{
              lineHeight: 'normal',
              paddingTop: '5px',
              paddingBottom: '5px',
            }}
          >
            <img alt={text} src={row.image_url} className="fl mr2" />
            <div
              className="fl"
              style={{
                maxWidth: '150px',
                overflow: 'hidden',
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis',
              }}
            >
              <a href={`/coins/${row.slug}`}>{row.symbol}</a>
              <div>{text}</div>
            </div>
          </div>
        )
      },
    },
    {
      headerName: 'Price',
      field: 'price',
      unSortIcon: true,
      type: 'numericColumn',
      cellRendererFramework: ({ value: text, data: row, rowIndex: index }) => {
        if (!_.isUndefined(text)) {
          return (
            <span>{`${currencySymbol}${formatPrice(
              text * currencyRate,
            )}`}</span>
          )
        }

        return <span />
      },
    },
    {
      headerName: 'Market Cap',
      field: 'market_cap',
      unSortIcon: true,
      type: 'numericColumn',
      minWidth: 160,
      cellRendererFramework: ({ value: text, data: row, rowIndex: index }) =>
        !_.isUndefined(text) ? (
          <span>
            {currencySymbol}
            {formatPrice(text * currencyRate)}
          </span>
        ) : null,
    },
    {
      headerName: '% Move 1H',
      field: 'change1h',
      unSortIcon: true,
      type: 'numericColumn',
      cellRendererFramework: ({ value: text, data: row, rowIndex: index }) => (
        <RedGreenSpan text={formatPercentage(text)} affix="%" />
      ),
    },
    {
      headerName: '% Move 1D',
      field: 'change24h',
      unSortIcon: true,
      type: 'numericColumn',
      cellRendererFramework: ({ value: text, data: row, rowIndex: index }) => (
        <RedGreenSpan text={formatPercentage(text)} affix="%" />
      ),
    },
    {
      headerName: '% Move 1W',
      field: 'change7d',
      unSortIcon: true,
      type: 'numericColumn',
      cellRendererFramework: ({ value: text, data: row, rowIndex: index }) => (
        <RedGreenSpan text={formatPercentage(text)} affix="%" />
      ),
    },
    {
      headerName: 'Volume (24hr)',
      field: 'volume24h',
      unSortIcon: true,
      type: 'numericColumn',
      minWidth: 150,
      cellRendererFramework: ({ value: text, data: row, rowIndex: index }) =>
        !_.isUndefined(text) ? (
          <span>{`${currencySymbol}${formatVolume(text * currencyRate)}`}</span>
        ) : null,
    },
    {
      headerName: '7D Chart',
      field: 'sparkline',
      cellRendererFramework: ({ value: text, data: row, rowIndex: index }) => {
        return (
          <div style={{ paddingTop: '5px', paddingBottom: '5px' }}>
            <Sparklines data={text}>
              <SparklinesLine />
            </Sparklines>
          </div>
        )
      },
      suppressSorting: true,
    },
  ]
}
export default ColumnNames
