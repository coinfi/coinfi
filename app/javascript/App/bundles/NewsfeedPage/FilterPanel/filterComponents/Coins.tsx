import * as React from 'react'
import * as _ from 'lodash'
import AsyncSelect from 'react-select/lib/Async'
import { CoinSlug } from '~/bundles/NewsfeedPage/types'
import localApi from '../../../../lib/localAPI'

interface Props {
  selectedCoins: CoinSlug[]
  onChange: (e) => void
}

interface Option {
  value: string
  label: string
}

interface State {
  selectedOptions: Option[]
}

class CoinSelector extends React.Component<Props, State> {
  public state = {
    selectedOptions: [],
  }

  public mapPayloadToOptions = (payload: any[]): Option[] =>
    payload.map((elem) => {
      const label = elem.symbol ? `${elem.symbol} | ${elem.name}` : elem.name

      return {
        label,
        value: elem.slug,
      }
    })

  public fetchCoinsDetails = (coinSlugs): Promise<Option[]> =>
    localApi
      .get(`/coins/search_by_params`, { coinSlugs })
      .then((response) => this.mapPayloadToOptions(response.payload))

  public fetchCoinsByName = (name): Promise<Option[]> =>
    localApi
      .get(`/coins/search_by_params`, { name })
      .then((response) => this.mapPayloadToOptions(response.payload))

  public loadOptions = (inputValue) => this.fetchCoinsByName(inputValue)

  public componentDidUpdate(prevProps: Props, prevState: State) {
    if (!_.isEqual(prevProps.selectedCoins, this.props.selectedCoins)) {
      this.fetchCoinsDetails(this.props.selectedCoins).then((result) => {
        this.setState({
          selectedOptions: result,
        })
      })
    }
  }

  public componentDidMount() {
    if (!!this.props.selectedCoins.length) {
      this.fetchCoinsDetails(this.props.selectedCoins).then((result) => {
        this.setState({
          selectedOptions: result,
        })
      })
    }
  }

  public render() {
    return (
      <AsyncSelect
        isMulti={true}
        onChange={this.props.onChange}
        cacheOptions={true}
        options={this.state.selectedOptions}
        loadOptions={this.loadOptions}
        value={this.state.selectedOptions}
      />
    )
  }
}

export default CoinSelector
