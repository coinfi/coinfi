import * as React from 'react'
import * as _ from 'lodash'
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import defaultOptions from '../common/components/CoinCharts/PriceGraph/options'
import { rgbToHsv, hsvToHex, interpolate } from '~/bundles/common/utils/colours'
import {
  formatAbbreviatedPrice,
  formatPercentage,
} from '~/bundles/common/utils/numberFormatters'

interface Props {
  symbol: string
  data: MarketData[]
  sortBy: SortType
}

type SortType = 'exchange' | 'pair'

interface State {
  options: any
}

const pineGreen: [number, number, number] = [7 / 255, 29 / 255, 41 / 255]
const skyBlue: [number, number, number] = [47 / 255, 174 / 255, 237 / 255]

export default class TokenChart extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)

    const { data, sortBy: inputtedSortBy, symbol } = props
    const sortBy = inputtedSortBy || 'exchange'

    const groupedData =
      sortBy === 'pair'
        ? _.groupBy(data, 'exchange_slug')
        : _.groupBy(data, 'pair')

    const processedData = _.map(groupedData, (group) => {
      const name =
        sortBy === 'pair'
          ? _.get(group, [0, 'pair'], '')
          : _.get(group, [0, 'exchange_name'], '')
      const y = group.reduce((total, pair) => {
        return total + _.get(pair, 'volume_percentage', 0) * 100
      }, 0)
      const volume24h = group.reduce((total, pair) => {
        return total + _.get(pair, 'volume24h', 0)
      }, 0)

      return {
        name,
        y,
        volume24h,
      }
    })

    // generate left over portion of pie-chart, if needed
    const [accountedForPercentage, accountedForVolume] = processedData.reduce(
      (total, slice) => {
        return [total[0] + slice.y, total[1] + slice.volume24h]
      },
      [0, 0],
    )
    if (accountedForPercentage < 100) {
      const remainingPercentage = 100 - accountedForPercentage
      const remainingVolume =
        (accountedForVolume / accountedForPercentage) * remainingPercentage

      processedData.push({
        name: 'Others',
        y: remainingPercentage,
        volume24h: remainingVolume,
      })
    }

    // Generate colours by interpolating between the HSV colour space values of two colours
    const colors = interpolate(
      rgbToHsv(...pineGreen),
      rgbToHsv(...skyBlue),
      processedData.length - 1,
      hsvToHex,
    )

    let title = ''
    if (sortBy === 'exchange') {
      title = `${symbol} Volume By Exchange`
    } else if (sortBy === 'pair') {
      title = `${symbol} Volume By Pair`
    }

    const options = _.merge(
      { ...defaultOptions },
      {
        title: {
          text: title || '',
          enabled: !!title,
          style: {
            fontSize: '16px',
            fontWeight: 500,
            color: '#212121',
          },
        },
        chart: {
          type: 'pie',
          width: null,
          height: 250,
          spacingTop: 10,
          spacingBottom: 0,
        },
        colors,
        navigator: {
          enabled: false,
        },
        legend: {
          enabled: false,
        },
        tooltip: {
          headerFormat: '',
          pointFormatter() {
            return `<span style="color:${this.color}">●</span> ${
              this.name
            }: <b>$${formatAbbreviatedPrice(
              this.volume24h,
            )}</b> (${formatPercentage(this.y)}%)`
          },
          hideDelay: 1000,
          useHTML: true,
        },
        series: [
          {
            name: 'Volume',
            data: processedData,
            size: '100%',
            showInLegend: false,
            dataLabels: {
              enabled: false,
            },
          },
        ],
      },
    )

    this.state = {
      options,
    }
  }

  public render() {
    const { options } = this.state

    return (
      <HighchartsReact
        highcharts={Highcharts}
        options={{ ...options }}
        allowChartUpdate={false}
      />
    )
  }
}
