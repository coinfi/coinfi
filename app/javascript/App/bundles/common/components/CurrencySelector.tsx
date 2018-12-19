import * as React from 'react'
import * as _ from 'lodash'
import { Select, MenuItem, createStyles, withStyles } from '@material-ui/core'
import currencyMap from '~/bundles/common/constants/currencyMap'

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
      minWidth: '60px',
      backgroundColor: '#f6f8fa', // pearl-gray
      borderRadius: '4px',
      color: '#333333', // dark-gray,
      fontSize: '14px',
      [theme.breakpoints.down('sm')]: {
        marginBottom: '8px',
      },
      [theme.breakpoints.up('md')]: {
        marginRight: '12px',
      },
    },
    selectMenu: {
      textAlign: 'center',
      paddingTop: '2px !important',
      paddingLeft: '6px !important',
      paddingBottom: '0 !important',
    },
    icon: {
      color: '#333333',
    },
    menuListRoot: {
      paddingTop: 0,
      paddingBottom: 0,
    },
    menuItem: {
      fontSize: '14px',
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
        classes={{
          root: classes.root,
          selectMenu: classes.selectMenu,
          icon: classes.icon,
        }}
        MenuProps={{
          MenuListProps: {
            classes: {
              root: classes.menuListRoot,
            },
            disablePadding: true,
          },
        }}
      >
        {CURRENCIES.map((currency) => {
          return (
            <MenuItem
              value={currency}
              key={currency}
              dense={true}
              className={classes.menuItem}
            >
              {currencyMap[currency]} {currency}
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
  'SGD',
  // 'BGN',
  // 'BRL',
  // 'CHF',
  // 'CZK',
  // 'DKK',
  // 'HKD',
  // 'HRK',
  // 'HUF',
  // 'IDR',
  // 'ILS',
  // 'INR',
  // 'ISK',
  // 'MXN',
  // 'MYR',
  // 'NOK',
  // 'NZD',
  // 'PHP',
  // 'PLN',
  // 'RON',
  // 'RUB',
  // 'SEK',
  // 'THB',
  // 'TRY',
  // 'ZAR',
]

export default withStyles(styles)(CurrencySelector)
