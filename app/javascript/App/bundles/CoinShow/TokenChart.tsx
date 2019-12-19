import * as React from 'react'
import * as moment from 'moment'
import * as _ from 'lodash'
import * as numeral from 'numeral'
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import NoSsr from '@material-ui/core/NoSsr'
import defaultOptions from '../common/components/CoinCharts/PriceGraph/options'

interface Props {
  data: TokenData[]
  isPercentage?: boolean
  title?: string
  yAxisLabel?: string
  xAxisLabel?: string
}

interface State {
  options: any
  isPercentage: boolean
}

export default class TokenChart extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)

    const { data, title, yAxisLabel, xAxisLabel } = props

    const isPercentage = _.get(props, 'isPercentage', true)

    const processedData = data.map((datum) => {
      const x = moment.utc(datum.date).valueOf()
      const y = isPercentage ? datum.percentage : datum.number

      return {
        x,
        y,
      }
    })

    const options = _.merge(
      { ...defaultOptions },
      {
        title: {
          text: title || '',
          enabled: !!title,
        },
        xAxis: {
          type: 'datetime',
          title: {
            text: xAxisLabel || '',
          },
          enabled: !!xAxisLabel,
          gridLineWidth: 0,
        },
        yAxis: [
          {
            title: {
              text: yAxisLabel || '',
            },
            enabled: !!yAxisLabel,
            gridLineDashStyle: 'Dash',
          },
        ],
        navigator: {
          enabled: false,
        },
        legend: {
          enabled: false,
        },
        time: {
          useUTC: true,
        },
        tooltip: {
          ...(isPercentage
            ? {
                valueSuffix: '%',
                valueDecimals: 2,
              }
            : {
                pointFormatter() {
                  return `<span style="color:${this.color}">●</span> ${
                    this.series.name
                  }: <b>${numeral(this.y).format('0,0')}</b>`
                },
              }),
          xDateFormat: '%Y-%m-%d',
          hideDelay: 1000,
          useHTML: true,
        },
        series: [
          {
            type: 'line',
            name: yAxisLabel || '',
            data: processedData,
          },
        ],
      },
    )

    this.state = {
      options,
      isPercentage,
    }
  }

  public render() {
    const { options } = this.state
    return (
      <NoSsr>
        <HighchartsReact
          highcharts={Highcharts}
          options={options}
          allowChartUpdate={true}
          immutable={true}
        />
      </NoSsr>
    )
  }
}
