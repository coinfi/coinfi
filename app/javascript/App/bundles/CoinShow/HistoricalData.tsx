import * as React from 'react'
import * as _ from 'lodash'
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Typography,
  Toolbar,
} from '@material-ui/core'
import { withStyles, createStyles } from '@material-ui/core/styles'
import LoadingIndicator from '../common/components/LoadingIndicator'
import * as moment from 'moment'
import { Moment } from 'moment'
import DateRangeSelect from './DateRangeSelect'

enum STATUSES {
  INITIALIZING = 'INITIALIZING',
  LOADING = 'LOADING',
  READY = 'READY',
}

interface RawPriceData {
  coin_key: string
  to_currency: string
  time: string
  open: number
  high: number
  low: number
  close: number
  volume_from: number // volume in present currency
  volume_to: number // volume in usd (or to_currency?)
}

interface PriceData {
  time: string
  open: string
  high: string
  low: string
  close: string
  volume: string
  formattedTime: string
  datetime: Moment
  marketCap: string
}

interface Props {
  classes: any
  initialData?: RawPriceData[]
  availableSupply: number
  symbol: string
}

interface State {
  data: PriceData[]
  status: string
  currency?: string
  start?: Moment
  end?: Moment
}

const styles = (theme) =>
  createStyles({
    table: {},
    toolbar: {},
    grow: {
      flexGrow: 1,
    },
    picker: {},
  })

class HistoricalData extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)

    const initialSortedData = props.initialData
      ? props.initialData
          .map<PriceData>(this.parseData.bind(this))
          .sort(this.sortDataFunc)
      : undefined

    // Set initial status
    const statusIsReady = !_.isUndefined(props.initialData)
    const initialStatus = statusIsReady ? STATUSES.READY : undefined
    const currency = props.initialData
      ? _.get(props, ['initialData', '0', 'to_currency'])
      : undefined

    this.state = {
      status: initialStatus || STATUSES.INITIALIZING,
      data: initialSortedData || [],
      currency,
    }
  }

  public sortDataFunc(x: PriceData, y: PriceData) {
    return y.datetime.diff(x.datetime)
  }

  public formatPrice(price: number, decimal: number = 2): string {
    return price.toLocaleString('en-US', {
      maximumFractionDigits: decimal,
    })
  }

  public parseData(d: RawPriceData): PriceData {
    const datetime = moment.utc(d.time)
    const formattedTime = datetime.format('MMM DD, YYYY')
    const marketCap = this.formatPrice(
      Math.round(this.props.availableSupply * d.close),
      0,
    )
    const open = this.formatPrice(d.open)
    const high = this.formatPrice(d.high)
    const low = this.formatPrice(d.low)
    const close = this.formatPrice(d.close)
    const volume = this.formatPrice(d.volume_from, 2)

    return {
      open,
      high,
      low,
      close,
      volume,
      time: d.time,
      datetime,
      formattedTime,
      marketCap,
    }
  }

  public onDateChangeHandler = (startDate: string, endDate: string) => {
    this.setState({
      start: startDate ? moment(startDate) : null,
      end: endDate ? moment(endDate) : null,
    })
  }

  public componentDidMount() {
    if (this.state.status !== STATUSES.READY) {
      // TODO: Retrieve data from api point?
    }
  }

  public render() {
    const { classes, symbol } = this.props
    const { data, status, currency, start, end } = this.state

    if (status !== STATUSES.READY) {
      return <LoadingIndicator />
    }

    let filteredData = data
    if (end) {
      filteredData = filteredData.filter((datum) => datum.datetime <= end)
    }
    if (start) {
      filteredData = filteredData.filter((datum) => datum.datetime >= start)
    }

    return (
      <React.Fragment>
        <Toolbar>
          {currency ? (
            <Typography component="div">Prices in {currency}</Typography>
          ) : (
            ''
          )}
          <div className={classes.grow} />
          <DateRangeSelect
            className={classes.picker}
            onChangeHandler={this.onDateChangeHandler}
          />
        </Toolbar>
        <Table className={classes.table}>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell numeric={true}>Open</TableCell>
              <TableCell numeric={true}>High</TableCell>
              <TableCell numeric={true}>Low</TableCell>
              <TableCell numeric={true}>Close</TableCell>
              <TableCell numeric={true}>Volume ({symbol})</TableCell>
              <TableCell numeric={true}>Market Cap</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredData.map((row, index) => {
              return (
                <TableRow key={index}>
                  <TableCell component="th" scope="row">
                    {row.formattedTime}
                  </TableCell>
                  <TableCell numeric={true}>{row.open}</TableCell>
                  <TableCell numeric={true}>{row.high}</TableCell>
                  <TableCell numeric={true}>{row.low}</TableCell>
                  <TableCell numeric={true}>{row.close}</TableCell>
                  <TableCell numeric={true}>{row.volume}</TableCell>
                  <TableCell numeric={true}>{row.marketCap}</TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </React.Fragment>
    )
  }
}

export default withStyles(styles)(HistoricalData)
