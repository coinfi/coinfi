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
import { formatValue } from '~/bundles/common/utils/numberFormatters'

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
    tableWrapper: {
      overflowX: 'scroll',
    },
    table: {},
    tableRow: {
      '& > *': {
        whiteSpace: 'nowrap',
      },
      '& > *:first-child': {
        paddingLeft: '8px',
      },
      '& > *:last-child': {
        paddingRight: '8px',
      },
    },
    toolbar: {
      padding: '0 !important',
    },
    grow: {
      flexGrow: 1,
    },
    picker: {},
  })

class HistoricalPriceDataTable extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)

    const { initialData } = props
    const initialSortedData = Array.isArray(initialData)
      ? initialData
          .map<PriceData>(this.parseData.bind(this))
          .sort(this.sortDataFunc)
      : undefined

    // Set initial status
    const statusIsReady = !_.isUndefined(initialSortedData)
    const initialStatus = statusIsReady ? STATUSES.READY : STATUSES.INITIALIZING
    const currency = initialData
      ? _.get(initialData, ['0', 'to_currency'])
      : undefined

    this.state = {
      status: initialStatus,
      data: initialSortedData || [],
      currency,
    }
  }

  public componentDidUpdate() {
    if (
      this.state.status === STATUSES.INITIALIZING &&
      Array.isArray(this.props.initialData)
    ) {
      const { initialData } = this.props
      this.setState({ status: STATUSES.LOADING }, () => {
        const sortedData = initialData
          .map<PriceData>(this.parseData.bind(this))
          .sort(this.sortDataFunc)

        const currency = initialData
          ? _.get(initialData, ['0', 'to_currency'])
          : undefined

        this.setState({
          status: STATUSES.READY,
          data: sortedData,
          currency,
        })
      })
    }
  }

  public sortDataFunc(x: PriceData, y: PriceData) {
    return y.datetime.diff(x.datetime)
  }

  public parseData(d: RawPriceData): PriceData {
    const datetime = moment.utc(d.time)
    const formattedTime = datetime.format('MMM DD, YYYY')
    const marketCap = formatValue(
      Math.round(this.props.availableSupply * d.close),
      0,
    )
    const open = formatValue(d.open)
    const high = formatValue(d.high)
    const low = formatValue(d.low)
    const close = formatValue(d.close)
    const volume = formatValue(d.volume_to)

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
    const { classes, symbol, availableSupply } = this.props
    const { data, status, currency, start, end } = this.state

    const prepend = currency === 'USD' ? '$' : ''

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
        <Toolbar className={classes.toolbar}>
          {currency ? (
            <Typography component="div">Prices in {currency}</Typography>
          ) : (
            ''
          )}
          <div className={classes.grow} />
          <DateRangeSelect
            initialValue="30-days"
            className={classes.picker}
            onChangeHandler={this.onDateChangeHandler}
          />
        </Toolbar>
        <div className={classes.tableWrapper}>
          <Table className={classes.table} padding="none">
            <TableHead>
              <TableRow className={classes.tableRow}>
                <TableCell numeric={true}>Date</TableCell>
                <TableCell numeric={true}>Open</TableCell>
                <TableCell numeric={true}>High</TableCell>
                <TableCell numeric={true}>Low</TableCell>
                <TableCell numeric={true}>Close</TableCell>
                <TableCell numeric={true}>Volume</TableCell>
                {!!availableSupply && (
                  <TableCell numeric={true}>Market Cap</TableCell>
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredData.map((row, index) => {
                return (
                  <TableRow key={index} className={classes.tableRow}>
                    <TableCell numeric={true} scope="row">
                      {row.formattedTime}
                    </TableCell>
                    <TableCell numeric={true}>
                      {prepend}
                      {row.open}
                    </TableCell>
                    <TableCell numeric={true}>
                      {prepend}
                      {row.high}
                    </TableCell>
                    <TableCell numeric={true}>
                      {prepend}
                      {row.low}
                    </TableCell>
                    <TableCell numeric={true}>
                      {prepend}
                      {row.close}
                    </TableCell>
                    <TableCell numeric={true}>
                      {prepend}
                      {row.volume}
                    </TableCell>
                    {!!availableSupply && (
                      <TableCell numeric={true}>
                        {prepend}
                        {row.marketCap}
                      </TableCell>
                    )}
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
      </React.Fragment>
    )
  }
}

export default withStyles(styles)(HistoricalPriceDataTable)
