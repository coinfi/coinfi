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
import DateRangeSelect from './DateRangeSelect'
import {
  formatValue,
  formatValueByCurrencyRate,
} from '~/bundles/common/utils/numberFormatters'
import { CurrencyContextType } from '~/bundles/common/contexts/CurrencyContext'

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
  datetime: moment.Moment
  marketCap: string
}

interface Props extends CurrencyContextType {
  classes: any
  initialRawData?: RawPriceData[]
  availableSupply: number
  symbol: string
}

interface State {
  rawData: RawPriceData[]
  data: PriceData[]
  status: string
  start?: moment.Moment
  end?: moment.Moment
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

    const { initialRawData } = props

    const initialSortedData = Array.isArray(initialRawData)
      ? initialRawData.map<PriceData>(this.parseData).sort(this.sortDataFunc)
      : undefined

    // Set initial status
    const statusIsReady = !_.isUndefined(initialSortedData)
    const initialStatus = statusIsReady ? STATUSES.READY : STATUSES.INITIALIZING

    this.state = {
      status: initialStatus,
      data: initialSortedData || [],
      rawData: initialRawData || [],
    }
  }

  public componentDidUpdate(prevProps, prevState) {
    const shouldProcessInitialData =
      this.state.status === STATUSES.INITIALIZING &&
      Array.isArray(this.props.initialRawData)
    const currencyHasChanged = this.props.currency !== prevProps.currency

    if (shouldProcessInitialData || currencyHasChanged) {
      const rawData = shouldProcessInitialData
        ? _.get(this.props, 'initialRawData', [])
        : _.get(this.state, 'rawData', [])

      this.setState({ status: STATUSES.LOADING }, () => {
        const sortedData = rawData
          .map<PriceData>(this.parseData)
          .sort(this.sortDataFunc)

        this.setState({
          status: STATUSES.READY,
          data: sortedData,
          ...(shouldProcessInitialData && {
            rawData,
          }),
        })
      })
    }
  }

  public sortDataFunc(x: PriceData, y: PriceData) {
    return y.datetime.diff(x.datetime)
  }

  public parseData = (d: RawPriceData): PriceData => {
    const { currencyRate } = this.props

    const datetime = moment.utc(d.time)
    const formattedTime = datetime.format('MMM DD, YYYY')
    const marketCap = formatValue(
      Math.round(this.props.availableSupply * d.close * currencyRate),
      0,
    )
    const open = formatValueByCurrencyRate(d.open * currencyRate, currencyRate)
    const high = formatValueByCurrencyRate(d.high * currencyRate, currencyRate)
    const low = formatValueByCurrencyRate(d.low * currencyRate, currencyRate)
    const close = formatValueByCurrencyRate(
      d.close * currencyRate,
      currencyRate,
    )
    const volume = formatValueByCurrencyRate(
      d.volume_to * currencyRate,
      currencyRate,
    )

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
    const { classes, availableSupply, currency } = this.props
    const { data, status, start, end } = this.state

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
          <Table className={classes.table} padding="dense">
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
                    <TableCell numeric={true}>{row.open}</TableCell>
                    <TableCell numeric={true}>{row.high}</TableCell>
                    <TableCell numeric={true}>{row.low}</TableCell>
                    <TableCell numeric={true}>{row.close}</TableCell>
                    <TableCell numeric={true}>{row.volume}</TableCell>
                    {!!availableSupply && (
                      <TableCell numeric={true}>{row.marketCap}</TableCell>
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
