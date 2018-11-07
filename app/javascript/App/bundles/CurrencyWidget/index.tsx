import * as React from 'react'
import CurrencySelector from '~/bundles/common/components/CurrencySelector'
import CurrencyContext, {
  CurrencyContextType,
} from '~/bundles/common/contexts/CurrencyContext'

const CurrencyWidget = () => {
  return (
    <CurrencyContext.Consumer>
      {(payload: CurrencyContextType) => {
        return (
          <CurrencySelector
            value={payload.currency}
            onChange={payload.changeCurrency}
          />
        )
      }}
    </CurrencyContext.Consumer>
  )
}

export default CurrencyWidget
