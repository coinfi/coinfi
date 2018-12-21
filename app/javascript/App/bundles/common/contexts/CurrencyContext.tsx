import * as React from 'react'
import * as _ from 'lodash'
import { withCookies, Cookies } from 'react-cookie'
import API from '~/bundles/common/utils/localAPI'
import currencyMap, {
  defaultCurrency,
} from '~/bundles/common/constants/currencyMap'

enum STATUS {
  INITIALIZING = 'INITIALIZING',
  LOADING = 'LOADING',
  READY = 'READY',
}

export interface CurrencyContextType {
  currency: string
  currencyRate: number
  currencySymbol: string
  changeCurrency: (currency: string) => void
}

const CurrencyContext = React.createContext<CurrencyContextType>(null)

export interface CurrencyContextProps {
  cookies: Cookies
  user?: any
  loggedIn?: boolean
}

export interface CurrencyContextState {
  status: string
  currencies: {
    [currencyKey: string]: number
  }
  currency: string
  currencySymbol: string
  currencyRate: number
}

export const CURRENCY_CHANGE_EVENT = 'currencyChange'

class CurrencyProvider extends React.Component<
  CurrencyContextProps,
  CurrencyContextState
> {
  constructor(props: CurrencyContextProps) {
    super(props)

    const { cookies, user } = props
    const userCurrency = _.get(user, 'default_currency')
    const cookieCurrency = cookies.get('currency')
    const currency = userCurrency || cookieCurrency || defaultCurrency
    const currencySymbol = _.get(currencyMap, currency, '')

    // remediate server-saved currency and local-saved currency
    if (
      _.isString(userCurrency) &&
      _.isString(cookieCurrency) &&
      userCurrency !== cookieCurrency
    ) {
      cookies.set('currency', userCurrency)
    } else if (_.isUndefined(cookieCurrency)) {
      // save default currency if not present in cookie
      cookies.set('currency', currency)
    }

    this.state = {
      status: STATUS.INITIALIZING,
      currencies: {},
      currency,
      currencySymbol,
      currencyRate: 1,
    }
  }

  public componentDidMount() {
    document.addEventListener(CURRENCY_CHANGE_EVENT, this.onCurrencyChange)
    this.getCurrencyRates()
  }

  public componentDidUpdate(
    prevProps: CurrencyContextProps,
    prevState: CurrencyContextState,
  ) {
    // update based on cookie
    const { cookies } = this.props
    const cookieCurrency = cookies.get('currency')

    if (
      !_.isUndefined(cookieCurrency) &&
      prevState.currency !== cookieCurrency
    ) {
      const currencyDetails = this.getCurrencyDetails(cookieCurrency)

      this.setState({
        currency: cookieCurrency,
        ...currencyDetails,
      })
    }

    // update if coming out of loading (i.e., got currency rate data)
    if (
      this.state.status === STATUS.READY &&
      prevState.status !== this.state.status
    ) {
      const { currency } = this.state
      const currencyDetails = this.getCurrencyDetails(currency)

      this.setState({
        currency,
        ...currencyDetails,
      })
    }
  }

  public componentWillUnmount() {
    document.removeEventListener(CURRENCY_CHANGE_EVENT, this.onCurrencyChange)
  }

  public getCurrencyRates = () => {
    const { status, currency } = this.state
    if (status === STATUS.READY) {
      this.setState({ status: STATUS.LOADING })
    }

    API.get('/currency').then((data) => {
      const { payload } = data
      if (_.isUndefined(payload)) {
        return
      }
      const { updated_at, ...currencies } = payload
      if (_.isUndefined(currencies)) {
        return
      }

      this.setState({
        status: STATUS.READY,
        currencies,
      })
    })
  }

  public getCurrencyDetails(currency) {
    const currencySymbol = _.get(currencyMap, currency, '')
    const currencyRate = _.get(this.state.currencies, currency, 1)

    return {
      currencySymbol,
      currencyRate,
    }
  }

  public onCurrencyChange = (e: CustomEvent) => {
    const { currency } = e.detail

    const currencyDetails = this.getCurrencyDetails(currency)
    if (currency !== this.state.currency) {
      this.setState({
        currency,
        ...currencyDetails,
      })
    }
  }

  public changeCurrency = (currency) => {
    const { cookies, loggedIn, user } = this.props

    cookies.set('currency', currency)
    const currencyDetails = this.getCurrencyDetails(currency)

    this.setState({
      currency,
      ...currencyDetails,
    })

    if (loggedIn || user) {
      API.patch('/user', { currency })
    }

    const event = new CustomEvent(CURRENCY_CHANGE_EVENT, {
      detail: { currency },
    })
    document.dispatchEvent(event)
  }

  public render() {
    const payload: CurrencyContextType = {
      currency: this.state.currency,
      currencySymbol: this.state.currencySymbol,
      currencyRate: this.state.currencyRate,
      changeCurrency: this.changeCurrency,
    }

    return (
      <CurrencyContext.Provider value={payload}>
        {this.props.children}
      </CurrencyContext.Provider>
    )
  }
}
const ProviderWithCookies = withCookies(CurrencyProvider)
export { ProviderWithCookies as CurrencyProvider }

export const withCurrency = (WrappedComponent) => (props) => (
  <CurrencyContext.Consumer>
    {(payload) => <WrappedComponent {...payload} {...props} />}
  </CurrencyContext.Consumer>
)

export default CurrencyContext
