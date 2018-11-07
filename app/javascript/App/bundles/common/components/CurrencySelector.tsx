import * as React from 'react'
import * as _ from 'lodash'
import { Select } from '@material-ui/core'

interface Props {
  initialCurrency?: string
  onChange?: (selected: string) => string | void
}

interface State {
  selectedCurrency: string
}

class CurrencySelector extends React.Component<Props, State> {
  constructor(props) {
    super(props)

    const selectedCurrency = props.initialCurrency || CURRENCIES[0]
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

  public render() {
    return (
      <Select onChange={this.handleChange} value={this.state.selectedCurrency}>
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

export default CurrencySelector
