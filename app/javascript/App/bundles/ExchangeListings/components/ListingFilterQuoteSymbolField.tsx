import * as React from 'react'
import AsyncSelect from 'react-select/lib/Async'
import { colourOptions } from './docs/data'

type State = {
  inputValue: string,
};

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

class ListingFilterQuoteSymbolField extends React.Component {
      state = { inputValue: '' };
 handleInputChange = (newValue: string) => {
    const inputValue = newValue.replace(/\W/g, '');
    this.setState({ inputValue });
    return inputValue;
  };
  render() {
  return (
    <div className="pb3">
      <h4 className="mb2 f5">Quote Symbol</h4>
        <AsyncSelect isMulti cacheOptions defaultOptions loadOptions={promiseOptions} />

    </div>
  )
}
}

export default ListingFilterQuoteSymbolField
