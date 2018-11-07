import * as React from 'react'
import * as _ from 'lodash'
import { Select, createStyles, withStyles } from '@material-ui/core'

interface Props {
  initialCurrency?: string
  onChange?: (selected: string) => string | void
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

    const selectedCurrency =
      props.initialCurrency || props.value || CURRENCIES[0]
    this.state = {
      selectedCurrency,
    }
  }

  public handleChange = (e) => {
    e.preventDefault()
    e.stopPropagation()
    let value = e.target.value

    if (this.props.onChange) {
      const returnedValue = this.props.onChange(value)
      if (_.isString(returnedValue)) {
        value = returnedValue
      }
    }

    this.setState({
      selectedCurrency: value,
    })
  }

  public componentDidUpdate(prevProps, prevState) {
    // override value with externally dictated value
    if (
      !_.isUndefined(this.props.value) &&
      this.state.selectedCurrency !== this.props.value
    ) {
      this.setState({
        selectedCurrency: this.props.value,
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
