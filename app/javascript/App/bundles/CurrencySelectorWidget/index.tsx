import * as React from 'react'
import CurrencySelector from '~/bundles/common/components/CurrencySelector'
import CurrencyContext, {
  CurrencyProvider,
  CurrencyContextType,
} from '~/bundles/common/contexts/CurrencyContext'

const CurrencySelectorWidget = (props) => (
  <CurrencyProvider {...props}>
    <CurrencyContext.Consumer>
      {({ currency, changeCurrency }: CurrencyContextType) => (
        <CurrencySelector value={currency} onChange={changeCurrency} />
      )}
    </CurrencyContext.Consumer>
  </CurrencyProvider>
)

export default CurrencySelectorWidget
