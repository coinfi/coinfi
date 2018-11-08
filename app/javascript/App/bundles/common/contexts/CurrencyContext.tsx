import * as React from 'react'
import { withCookies, Cookies } from 'react-cookie'

export interface CurrencyContextType {
  currency: string
  changeCurrency: (currency: string) => void
}

const CurrencyContext = React.createContext<CurrencyContextType>(null)

export interface Props {
  cookies: Cookies
}

export interface State {
  currency: string
}

class CurrencyProvider extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)

    const { cookies } = props
    const currency = cookies.get('currency') || 'USD'
    this.state = {
      currency,
    }
  }

  public componentDidMount() {
    document.addEventListener('currencyChange', this.onCurrencyChange)
  }

  public componentDidUpdate(prevProps, prevState) {
    const { cookies } = this.props
    const currency = cookies.get('currency')

    if (prevState.currency !== currency) {
      this.setState({ currency })
    }
  }

  public componentWillUnmount() {
    document.removeEventListener('currencyChange', this.onCurrencyChange)
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

    const event = new CustomEvent('currencyChange', { detail: { currency } })
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
