import * as React from 'react'
import HistoricalPriceDataTable from './HistoricalPriceDataTable'
import CurrencyContext, {
  CurrencyContextType,
} from '~/bundles/common/contexts/CurrencyContext'

const HistoricalPriceDataTableWrapper = (props) => (
  <CurrencyContext.Consumer>
    {(payload: CurrencyContextType) => (
      <HistoricalPriceDataTable {...props} {...payload} />
    )}
  </CurrencyContext.Consumer>
)

export default HistoricalPriceDataTableWrapper
