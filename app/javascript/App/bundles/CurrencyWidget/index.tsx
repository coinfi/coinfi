import * as React from 'react'
import CurrencySelector from '~/bundles/common/components/CurrencySelector'
import { withCookies, Cookies } from 'react-cookie'

interface Props {
  cookies: Cookies
}

interface State {
  currency: string
}

class CurrencyWidget extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)

    const { cookies } = props
    const currency = cookies.get('currency') || 'USD'
    this.state = {
      currency,
    }
  }

  public componentDidUpdate(prevProps, prevState) {
    const { cookies } = this.props
    const currency = cookies.get('currency')

    if (prevState.currency !== currency) {
      this.setState({ currency })
    }
  }

  public changeCurrency = (currency) => {
    const { cookies } = this.props

    cookies.set('currency', currency)
    this.setState({ currency })
  }

  public render() {
    return (
      <CurrencySelector
        value={this.state.currency}
        onChange={this.changeCurrency}
      />
    )
  }
}

export default withCookies(CurrencyWidget)
