import * as React from 'react'
import * as _ from 'lodash'
import { Select, MenuItem, createStyles, withStyles } from '@material-ui/core'

interface Props {
  initialCurrency?: string
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

    const managedCurrency = this.isManagedState()
      ? props.value
      : props.initialCurrency
    const selectedCurrency = managedCurrency || CURRENCIES[0]
    this.state = {
      selectedCurrency,
    }
  }

  public isManagedState = () => {
    return _.isString(this.props.value)
  }

  public handleChange = (e) => {
    e.preventDefault()
    e.stopPropagation()
    const { onChange } = this.props
    const value = e.target.value

    if (onChange) {
      onChange(value)
    }
    if (!this.isManagedState()) {
      this.setState({
        selectedCurrency: value,
      })
    }
  }

  public componentDidUpdate(prevProps, prevState) {
    const { value } = this.props
    if (this.isManagedState() && this.state.selectedCurrency !== value) {
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
            <MenuItem value={currency} key={currency}>
              {currency}
            </MenuItem>
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
