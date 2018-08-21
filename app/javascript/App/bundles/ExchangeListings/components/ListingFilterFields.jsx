import React from 'react'
import Select from 'react-select'
import ItemSelectorDate from './../../../components/ItemSelectorDate'

export default (props) => (
  <div className="pa3">
    <div className="mb4">
      <h4 className="mb2">Quote Symbol</h4>
      <Select isMulti name="quote_symbols" options={props.quoteSymbols} onChange={props.changeSymbol} />
    </div>

    <div className="mb4">
      <h4 className="mb2">Date Range</h4>
      <ItemSelectorDate />
    </div>

    <div>
      <h4 className="mb2">Exchanges</h4>
      <Select isMulti name="exchanges" options={props.exchanges} onChange={props.changeExchange} />
    </div>
  </div>
)
