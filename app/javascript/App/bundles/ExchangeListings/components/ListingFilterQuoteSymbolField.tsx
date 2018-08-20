import React, { Component } from 'react'
import AsyncSelect from 'react-select/lib/Async'

const filterColors = (inputValue: string) =>
  colourOptions.filter(i =>
    i.label.toLowerCase().includes(inputValue.toLowerCase())
  );

const promiseOptions = inputValue =>
  new Promise(resolve => {
    setTimeout(() => {
      resolve(filterColors(inputValue));
    }, 1000);
  });

class ListingFilterQuoteSymbolField extends Component {
  render() {
  return (
    <div className="pb3">
      <h4 className="mb2 f5">Quote Symbol</h4>
      <AsyncSelect
        isMulti
        cacheOptions
        defaultOptions
        loadOptions={promiseOptions}
      />
    </div>
  )
}
}

export default ListingFilterQuoteSymbolField
