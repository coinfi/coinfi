import * as React from 'react'

export interface CurrencyContextType {
  currency: string
  changeCurrency: (currency: string) => void
}

const CurrencyContext = React.createContext<CurrencyContextType>(null)

export interface Props {
  initialCurrency?: string
}

export interface State {
  currency: string
}

export class CurrencyProvider extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)

    const currency = props.initialCurrency || 'USD'
    this.state = {
      currency,
    }
  }

  public changeCurrency = (currency) => {
    this.setState({ currency })
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

export default CurrencyContext
