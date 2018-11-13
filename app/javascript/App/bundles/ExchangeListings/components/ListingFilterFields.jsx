import React from 'react'
import Select from 'react-select'
import DateRangeListing from '~/bundles/common/components/DateRangeListing'
import ExchangeListingsContext from '~/bundles/ExchangeListings/ExchangeListingsContext'

export default () => (
  <div className="pa3">
    <div className="mb4">
      <h4 className="mb2">Quote Symbol</h4>
      <ExchangeListingsContext.Consumer>
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
      </ExchangeListingsContext.Consumer>
    </div>
    <div className="mb4">
      <h4 className="mb2">Date Range</h4>
      <ExchangeListingsContext.Consumer>
        {({ filterDates, selectedItems }) => (
          <DateRangeListing
            onChange={filterDates}
            selectedItems={selectedItems}
          />
        )}
      </ExchangeListingsContext.Consumer>
    </div>

    <div>
      <h4 className="mb2">Exchanges</h4>
      <ExchangeListingsContext.Consumer>
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
      </ExchangeListingsContext.Consumer>
    </div>
  </div>
)
