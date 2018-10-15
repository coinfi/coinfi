import * as React from 'react'
import * as _ from 'lodash'
import AsyncSelect from 'react-select/lib/Async'
import { CoinSlug } from '~/bundles/common/types'
import localApi from '../../../lib/localAPI'

interface Props {
  selectedCoin: CoinSlug
  onChange: (selectedOption: CoinOption) => void
}

export interface CoinOption {
  value: string
  label: string
}

interface State {
  selectedOption: CoinOption
}

class CoinSelector extends React.Component<Props, State> {
  public state = {
    selectedOption: null,
  }

  public mapPayloadToOptions = (payload: any[]): CoinOption[] =>
    payload.map((elem) => {
      const label = elem.symbol ? `${elem.symbol} | ${elem.name}` : elem.name

      return {
        label,
        value: elem.slug,
      }
    })

  public fetchCoinsDetails = (coinSlugs): Promise<CoinOption[]> =>
    localApi
      .get(`/coins/search_by_params`, { coinSlugs })
      .then((response) => this.mapPayloadToOptions(response.payload))

  public fetchCoinsByName = (name): Promise<CoinOption[]> =>
    localApi
      .get(`/coins/search_by_params`, { name })
      .then((response) => this.mapPayloadToOptions(response.payload))

  public loadOptions = (inputValue) => this.fetchCoinsByName(inputValue)

  public refreshCoin = (selectedCoin: string) =>
    this.fetchCoinsDetails(selectedCoin).then((results) => {
      if (results && results.length === 1) {
        this.setState({
          selectedOption: results[0],
        })
      }
    })

  public componentDidUpdate(prevProps: Props, prevState: State) {
    if (!_.isEqual(prevProps.selectedCoin, this.props.selectedCoin)) {
      this.refreshCoin(this.props.selectedCoin)
    }
  }

  public componentDidMount() {
    if (!!this.props.selectedCoin) {
      this.refreshCoin(this.props.selectedCoin)
    }
  }

  public render() {
    return (
      <AsyncSelect
        isMulti={false}
        onChange={this.props.onChange}
        cacheOptions={true}
        loadOptions={this.loadOptions}
        value={this.state.selectedOption}
      />
    )
  }
}

export default CoinSelector
