import * as React from 'react'
import * as _ from 'lodash'
import { Select, createStyles, withStyles } from '@material-ui/core'

interface Props {
  initialCurrency?: string
  isManagedState?: boolean
  onChange?: (selected: string) => void
  value?: string
  classes: any
}

interface State {
  selectedCurrency: string
}

const styles = (theme) =>
  createStyles({
    root: {
      color: '#fff',
    },
    icon: {
      color: '#fff',
    },
  })

class CurrencySelector extends React.Component<Props, State> {
  constructor(props) {
    super(props)

    const managedCurrency = props.isManagedState
      ? props.value
      : props.initialCurrency
    const selectedCurrency = managedCurrency || CURRENCIES[0]
    this.state = {
      selectedCurrency,
    }
  }

  public handleChange = (e) => {
    e.preventDefault()
    e.stopPropagation()
    const { onChange, isManagedState } = this.props
    const value = e.target.value

    if (onChange) {
      onChange(value)
    }
    if (!isManagedState) {
      this.setState({
        selectedCurrency: value,
      })
    }
  }

  public componentDidUpdate(prevProps, prevState) {
    const { isManagedState, value } = this.props
    if (
      isManagedState &&
      _.isString(value) &&
      this.state.selectedCurrency !== value
    ) {
      this.setState({
        selectedCurrency: value,
      })
    }
  }

  public render() {
    const { classes } = this.props
    return (
      <Select
        onChange={this.handleChange}
        value={this.state.selectedCurrency}
        classes={classes}
      >
        {CURRENCIES.map((currency) => {
          return (
            <option value={currency} key={currency}>
              {currency}
            </option>
          )
        })}
      </Select>
    )
  }
}

const CURRENCIES = [
  'USD',
  'EUR',
  'GBP',
  'AUD',
  'JPY',
  'CAD',
  'KRW',
  'CNY',
  'BGN',
  'BRL',
  'CHF',
  'CZK',
  'DKK',
  'HKD',
  'HRK',
  'HUF',
  'IDR',
  'ILS',
  'INR',
  'ISK',
  'MXN',
  'MYR',
  'NOK',
  'NZD',
  'PHP',
  'PLN',
  'RON',
  'RUB',
  'SEK',
  'SGD',
  'THB',
  'TRY',
  'ZAR',
]

export default withStyles(styles)(CurrencySelector)
