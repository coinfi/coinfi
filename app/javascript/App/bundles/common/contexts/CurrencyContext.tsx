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
  currencies?: CurrencyInfo
}

export interface CurrencyContextState {
  status: string
  currencies: CurrencyInfo
  currency: string
  currencySymbol: string
  currencyRate: number
}

export interface CurrencyInfo {
  [currencyKey: string]: number
}

export const CURRENCY_CHANGE_EVENT = 'currencyChange'

const cookieOptions = {
  path: '/',
}

class CurrencyProvider extends React.Component<
  CurrencyContextProps,
  CurrencyContextState
> {
  constructor(props: CurrencyContextProps) {
    super(props)

    const { cookies, user, currencies = { [defaultCurrency]: 1 } } = props
    const userCurrency = _.get(user, 'default_currency')
    const cookieCurrency = cookies.get('currency')
    const currency = userCurrency || cookieCurrency || defaultCurrency
    const currencySymbol = _.get(currencyMap, currency, '')
    const currencyRate = _.get(currencies, currency)

    // remediate server-saved currency and local-saved currency
    if (
      _.isString(userCurrency) &&
      _.isString(cookieCurrency) &&
      userCurrency !== cookieCurrency
    ) {
      cookies.set('currency', userCurrency, cookieOptions)
    } else if (_.isUndefined(cookieCurrency)) {
      // save default currency if not present in cookie
      cookies.set('currency', currency, cookieOptions)
    }

    const isReady = !!currencySymbol && !!currencyRate
    const status = isReady ? STATUS.READY : STATUS.INITIALIZING

    this.state = {
      status,
      currencies,
      currency,
      currencySymbol,
      currencyRate: currencyRate || 1,
    }
  }

  public componentDidMount() {
    document.addEventListener(CURRENCY_CHANGE_EVENT, this.onCurrencyChange)
    if (this.state.status !== STATUS.READY) {
      // TODO: fetch from single context and transmit to others
      this.getCurrencyRates()
    }
  }

  public componentWillUnmount() {
    document.removeEventListener(CURRENCY_CHANGE_EVENT, this.onCurrencyChange)
  }

  public async fetchCurrencyRates() {
    try {
      const data = await API.get('/currency')
      const { payload } = data
      const { updated_at, ...currencies } = payload
      return currencies
    } catch {
      const currencies = { [defaultCurrency]: 1 }
      return currencies
    }
  }

  public getCurrencyRates = (requestedCurrency = null) => {
    const { status } = this.state
    if (status === STATUS.READY) {
      this.setState({ status: STATUS.LOADING })
    }

    return this.fetchCurrencyRates()
      .then((currencies) => {
        const { currency: stateCurrency } = this.state
        const currency = requestedCurrency ? requestedCurrency : stateCurrency
        const currencyDetails = this.getCurrencyDetails(currency)

        const payload = {
          currency,
          currencies,
          ...currencyDetails,
        }
        this.setState({
          status: STATUS.READY,
          ...payload,
        })

        return payload
      })
      .catch((err) => {
        this.setState({
          status: STATUS.READY,
        })

        return null
      })
  }

  public getCurrencyDetails(currency) {
    const currencySymbol = _.get(currencyMap, currency)
    const currencyRate = _.get(this.state, ['currencies', currency])

    if (!currencySymbol || !currencyRate) {
      return null
    }

    return {
      currencySymbol,
      currencyRate,
    }
  }

  public onCurrencyChange = (e: CustomEvent) => {
    const { currency, currencySymbol, currencyRate, currencies } = e.detail

    if (currency !== this.state.currency) {
      const hasCurrencyDetails = !!currencySymbol && !!currencyRate
      if (hasCurrencyDetails || currencies) {
        const updatedState: any = {
          currency,
        }
        if (hasCurrencyDetails) {
          updatedState.currencySymbol = currencySymbol
          updatedState.currencyRate = currencyRate
        }
        if (currencies) {
          updatedState.currencies = currencies
        }
        this.setState(updatedState)
      } else {
        this.handleCurrencyChange(currency)
      }
    }
  }

  public changeCurrency = (currency) => {
    const { cookies, loggedIn, user } = this.props
    const { currency: oldCurrency } = this.state

    if (oldCurrency === currency) {
      return
    }

    cookies.set('currency', currency, cookieOptions)
    this.handleCurrencyChange(currency, (currencyData) => {
      const event = new CustomEvent(CURRENCY_CHANGE_EVENT, {
        detail: { currency, ...currencyData },
      })
      document.dispatchEvent(event)
    })

    if (loggedIn || user) {
      API.patch('/user', { currency })
    }
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

  private handleCurrencyChange(currency, cb = null) {
    const currencyDetails = this.getCurrencyDetails(currency)

    if (currencyDetails === null) {
      this.getCurrencyRates(currency).then((currencyRelatedState) => {
        if (cb && typeof cb === 'function') {
          cb(currencyRelatedState)
        }
      })
    } else {
      const currencyRelatedState = {
        currency,
        ...currencyDetails,
      }
      this.setState(currencyRelatedState)
      if (cb && typeof cb === 'function') {
        cb({ ...currencyRelatedState, currencies: this.state.currencies })
      }
    }
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
