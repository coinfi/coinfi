import * as React from 'react'
import CurrencySelector from '~/bundles/common/components/CurrencySelector'
import CurrencyContext, {
  CurrencyContextType,
} from '~/bundles/common/contexts/CurrencyContext'

const CurrencySelectorWidget = () => (
  <CurrencyContext.Consumer>
    {({ currency, changeCurrency }: CurrencyContextType) => (
      <CurrencySelector value={currency} onChange={changeCurrency} />
    )}
  </CurrencyContext.Consumer>
)

export default CurrencySelectorWidget
