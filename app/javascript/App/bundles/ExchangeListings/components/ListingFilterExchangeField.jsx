import * as React from 'react'
import AsyncSelect from 'react-select/lib/Async'
import { colourOptions } from './docs/data'
import _ from 'lodash'

type State = {
  inputValue: string,
}

const filterExchanges = (inputValue: string, data: any) => {
  const formatData = data.payload.map((item) => {
    item.label = item.exchange_name
    item.value = item.exchange_name
    return item
  })
  return _.uniqBy(formatData, 'exchange_name')
}

const promiseOptions = (inputValue) => {
  const url = `/api/exchange_listings?exchangeSlugs=${inputValue}`
  return new Promise((resolve, reject) => {
    return fetch(url)
      .then(
        (response) => {
          if (response.ok) {
            return response.json()
          } else {
            reject(new Error('error'))
          }
        },
        (error) => {
          reject(new Error(error.message))
        },
      )
      .then((data) => {
        resolve(filterExchanges(inputValue, data))
      })
  })
}

export default class WithCallbacks extends React.Component {
  state = { inputValue: '' }
  handleInputChange = (newValue: string) => {
    const inputValue = newValue.replace(/\W/g, '')
    this.setState({ inputValue })
    return inputValue
  }
  render() {
    return (
      <div className="pt3">
        <h4>Exchanges</h4>
        <AsyncSelect
          isMulti
          cacheOptions
          loadOptions={promiseOptions}
          defaultOptions
          onInputChange={this.handleInputChange}
        />
      </div>
    )
  }
}
