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
  formatPrice,
  formatVolume,
} from '~/bundles/common/utils/numberFormatters'
import {
  CurrencyContextType,
  withCurrency,
} from '~/bundles/common/contexts/CurrencyContext'

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
  coinObj: CoinObj
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
    const { currencyRate, availableSupply } = this.props

    const datetime = moment.utc(d.time)
    const formattedTime = datetime.format('MMM DD, YYYY')
    const marketCap = formatPrice(availableSupply * d.close * currencyRate)
    const open = formatPrice(d.open * currencyRate)
    const high = formatPrice(d.high * currencyRate)
    const low = formatPrice(d.low * currencyRate)
    const close = formatPrice(d.close * currencyRate)
    const volume = formatVolume(d.volume_to * currencyRate)

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
    const {
      classes,
      availableSupply,
      currency,
      currencySymbol,
      coinObj,
    } = this.props
    const { data, status, start, end } = this.state
    const { name: coinName } = coinObj

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
            <Typography component="div">
              {coinName} Prices in {currency}
            </Typography>
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
                <TableCell align="right">Date</TableCell>
                <TableCell align="right">Open</TableCell>
                <TableCell align="right">High</TableCell>
                <TableCell align="right">Low</TableCell>
                <TableCell align="right">Close</TableCell>
                <TableCell align="right">Volume</TableCell>
                {!!availableSupply && (
                  <TableCell align="right">Market Cap</TableCell>
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredData.map((row, index) => {
                return (
                  <TableRow key={index} className={classes.tableRow}>
                    <TableCell align="right" scope="row">
                      {row.formattedTime}
                    </TableCell>
                    <TableCell align="right">
                      {currencySymbol}
                      {row.open}
                    </TableCell>
                    <TableCell align="right">
                      {currencySymbol}
                      {row.high}
                    </TableCell>
                    <TableCell align="right">
                      {currencySymbol}
                      {row.low}
                    </TableCell>
                    <TableCell align="right">
                      {currencySymbol}
                      {row.close}
                    </TableCell>
                    <TableCell align="right">
                      {currencySymbol}
                      {row.volume}
                    </TableCell>
                    {!!availableSupply && (
                      <TableCell align="right">
                        {currencySymbol}
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

export default withStyles(styles)(withCurrency(HistoricalPriceDataTable))
