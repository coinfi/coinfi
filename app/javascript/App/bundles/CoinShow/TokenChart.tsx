import * as React from 'react'
import * as moment from 'moment'
import * as _ from 'lodash'
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import defaultOptions from '../common/components/CoinCharts/PriceGraph/options'

interface TokenData {
  date: string
  percentage: number
}

interface Props {
  data: TokenData[]
  title?: string
  yAxisLabel?: string
  xAxisLabel?: string
}

interface State {
  options: any
}

export default class TokenChart extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)

    const { data, title, yAxisLabel, xAxisLabel } = props

    const processedData = data.map((datum) => {
      const x = moment.utc(datum.date).valueOf()
      const y = datum.percentage

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
        },
        xAxis: {
          type: 'datetime',
          title: {
            text: xAxisLabel || '',
          },
          gridLineWidth: 0,
        },
        yAxis: {
          title: {
            text: yAxisLabel || '',
          },
          gridLineDashStyle: 'Dash',
        },
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
          valueSuffix: '%',
          valueDecimals: 4,
          xDateFormat: '%Y-%m-%d',
          hideDelay: 1000,
        },
        series: [
          {
            type: 'line',
            name: yAxisLabel || 'percentage',
            data: processedData,
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
        options={options}
        allowChartUpdate={true}
      />
    )
  }
}
