import React from 'react'
import Select from 'react-select'
import DateRangeListing from '~/components/DateRangeListing'
import { ExchangeListingContextConsumer } from '~/bundles/ExchangeListings/context'

export default () => (
  <div className="pa3">
    <div className="mb4">
      <h4 className="mb2">Quote Symbol</h4>
      <ExchangeListingContextConsumer>
        {({ quoteSymbols, changeSymbol, selectedSymbols }) => {
          const selectedSymbolData = selectedSymbols.map((item) => {
            return {
              label: item,
              value: item,
            }
          })
          return (
            <Select
              isMulti
              name="quote_symbols"
              options={quoteSymbols}
              onChange={changeSymbol}
              value={selectedSymbolData}
            />
          )
        }}
      </ExchangeListingContextConsumer>
    </div>
    <div className="mb4">
      <h4 className="mb2">Date Range</h4>
      <ExchangeListingContextConsumer>
        {({ filterDates, selectedItems }) => (
          <DateRangeListing
            onChange={filterDates}
            selectedItems={selectedItems}
          />
        )}
      </ExchangeListingContextConsumer>
    </div>

    <div>
      <h4 className="mb2">Exchanges</h4>
      <ExchangeListingContextConsumer>
        {({ exchanges, changeExchange, selectedExchanges }) => {
          const selectedExchangeSlugs = selectedExchanges.map((slug) => {
            return {
              label: slug,
              value: slug,
            }
          })
          return (
            <Select
              isMulti
              name="exchanges"
              options={exchanges}
              onChange={changeExchange}
              value={selectedExchangeSlugs}
            />
          )
        }}
      </ExchangeListingContextConsumer>
    </div>
  </div>
)
