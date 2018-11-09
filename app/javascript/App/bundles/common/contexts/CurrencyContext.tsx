import * as React from 'react'
import { withCookies, Cookies } from 'react-cookie'

export interface CurrencyContextType {
  currency: string
  changeCurrency: (currency: string) => void
}

const CurrencyContext = React.createContext<CurrencyContextType>(null)

export interface CurrencyContextProps {
  cookies: Cookies
}

export interface CurrencyContextState {
  currency: string
}

export const CURRENCY_CHANGE_EVENT = 'currencyChange'

class CurrencyProvider extends React.Component<
  CurrencyContextProps,
  CurrencyContextState
> {
  constructor(props: CurrencyContextProps) {
    super(props)

    const { cookies } = props
    const currency = cookies.get('currency') || 'USD'
    this.state = {
      currency,
    }
  }

  public componentDidMount() {
    document.addEventListener(CURRENCY_CHANGE_EVENT, this.onCurrencyChange)
  }

  public componentDidUpdate(
    prevProps: CurrencyContextProps,
    prevState: CurrencyContextState,
  ) {
    const { cookies } = this.props
    const currency = cookies.get('currency')

    if (prevState.currency !== currency) {
      this.setState({ currency })
    }
  }

  public componentWillUnmount() {
    document.removeEventListener(CURRENCY_CHANGE_EVENT, this.onCurrencyChange)
  }

  public onCurrencyChange = (e: CustomEvent) => {
    const { currency } = e.detail
    if (currency !== this.state.currency) {
      this.setState({ currency })
    }
  }

  public changeCurrency = (currency) => {
    const { cookies } = this.props

    cookies.set('currency', currency)
    this.setState({ currency })

    const event = new CustomEvent(CURRENCY_CHANGE_EVENT, {
      detail: { currency },
    })
    document.dispatchEvent(event)
  }

  public render() {
    const payload: CurrencyContextType = {
      currency: this.state.currency,
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

export default CurrencyContext
