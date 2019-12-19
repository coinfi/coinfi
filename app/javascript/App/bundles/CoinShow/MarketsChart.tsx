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
import NoSsr from '@material-ui/core/NoSsr'

interface Props {
  symbol: string
  data: MarketData[]
  groupBy: GroupType
}

type GroupType = 'exchange' | 'pair'

interface State {
  options: any
}

const pineGreen: [number, number, number] = [7 / 255, 29 / 255, 41 / 255]
const skyBlue: [number, number, number] = [47 / 255, 174 / 255, 237 / 255]

export function groupMarketData(data, groupBy: GroupType) {
  const groupedData =
    groupBy === 'pair'
      ? _.groupBy(data, 'pair')
      : _.groupBy(data, 'exchange_slug')

  const processedData = _.map(groupedData, (group) => {
    const name =
      groupBy === 'pair'
        ? _.get(group, [0, 'pair'], '')
        : _.get(group, [0, 'exchange_name'], '')
    const value = group.reduce((total, pair) => {
      return total + _.get(pair, 'volume_percentage', 0) * 100
    }, 0)
    const volume24h = group.reduce((total, pair) => {
      return total + _.get(pair, 'volume24h', 0)
    }, 0)

    return {
      name,
      y: value, // 'y' is used for highcharts
      volume24h,
    }
  })

  const sortedData = _.sortBy(processedData, ({ y }) => -y)

  return sortedData
}

export default class TokenChart extends React.Component<Props, State> {
  private internalChart: Highcharts.Chart

  constructor(props: Props) {
    super(props)

    const { data: rawData, groupBy: inputtedGroupBy, symbol } = props
    const groupBy = inputtedGroupBy || 'exchange'

    const processedData = groupMarketData(rawData, groupBy)

    // To make pie-chart more pleasant, we try to reduce the total number of slices
    // using various criteria.
    let reducedData =
      processedData.length > 5
        ? processedData.reduce(
            (acc, slice) => {
              const { slices, percentage, data } = acc
              if (slices > 4) {
                return acc
              }

              return {
                data: [...data, slice],
                slices: slices + 1,
                percentage: percentage + slice.y,
              }
            },
            {
              data: [],
              slices: 0,
              percentage: 0,
            },
          ).data
        : processedData

    // generate left over portion of pie-chart, if needed
    const [accountedForPercentage, accountedForVolume] = reducedData.reduce(
      (total, slice) => {
        return [total[0] + slice.y, total[1] + slice.volume24h]
      },
      [0, 0],
    )
    if (accountedForPercentage < 100) {
      // handle edge case where no volume percentage data was available
      // consider available volume to be full volume
      if (accountedForPercentage === 0 && processedData.length > 0) {
        const totalVolume = processedData.reduce(
          (sum, datum) => sum + _.get(datum, 'volume24h', 0),
          0,
        )
        reducedData = reducedData.map((datum) => {
          const { y, volume24h } = datum
          return {
            ...datum,
            y: (volume24h / totalVolume) * 100,
          }
        })
      } else {
        const remainingPercentage = 100 - accountedForPercentage
        const remainingVolume =
          (accountedForVolume / accountedForPercentage) * remainingPercentage

        reducedData.push({
          name: 'Others',
          y: remainingPercentage,
          volume24h: remainingVolume,
        })
      }
    }

    // sort for better visual presentation
    const finalData = _.reverse(_.sortBy(reducedData, (slice) => slice.y))

    // Generate colours by interpolating between the HSV colour space values of two colours
    const colors = interpolate(
      rgbToHsv(...pineGreen),
      rgbToHsv(...skyBlue),
      finalData.length - 1,
      hsvToHex,
    )

    let title = ''
    if (groupBy === 'exchange') {
      title = `${symbol} Volume By Exchange`
    } else if (groupBy === 'pair') {
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
        navigator: {
          enabled: false,
        },
        legend: {
          enabled: false,
        },
        series: [
          {
            type: 'pie',
            name: 'Volume',
            data: finalData,
            colors,
            size: '100%',
            borderWidth: 0,
            showInLegend: false,
            dataLabels: {
              enabled: true,
              alignTo: 'toPlotEdges',
              crop: false,
              overflow: 'allow',
              padding: 0,
              distance: 10,
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
          },
        ],
      },
    )

    this.state = { options }
  }

  public render() {
    const { options } = this.state

    return (
      <NoSsr>
        <HighchartsReact
          highcharts={Highcharts}
          options={options}
          allowChartUpdate={true}
          callback={this.afterChartCreated}
        />
      </NoSsr>
    )
  }

  protected afterChartCreated(chart) {
    this.internalChart = chart

    this.internalChart.setSize(null, 250)
    this.internalChart.spacingTop = 10
    this.internalChart.spacingBottom = 0
    this.internalChart.margin = [50, 20, 15, 20]
  }
}
