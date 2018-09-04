import * as React from 'react'
import _ from 'lodash'
import AsyncSelect from 'react-select/lib/Async'
import { CoinSlug } from '~/bundles/NewsfeedPage/types'
import localApi from '../../../../lib/localAPI'

interface IProps {
  selectedCoins: CoinSlug[]
  onChange: (e) => void
}

interface IOption {
  value: string
  label: string
}

interface IState {
  selectedOptions: IOption[]
}

class CoinSelector extends React.Component<IProps, IState> {
  public state = {
    selectedOptions: [],
  }

  public mapPayloadToOptions = (payload: any[]): IOption[] =>
    payload.map((elem) => ({
      label: `${elem.symbol} | ${elem.name}`,
      value: elem.slug,
    }))

  public fetchCoinsDetails = (coinSlugs): Promise<IOption[]> => {
    return new Promise((res, rej) => {
      localApi
        .get(`/coins/search_by_params`, { coinSlugs })
        .then((response) => {
          res(this.mapPayloadToOptions(response.payload))
        })
    })
  }

  public fetchCoinsByName = (name): Promise<IOption[]> => {
    return new Promise((res, rej) => {
      localApi.get(`/coins/search_by_params`, { name }).then((response) => {
        res(this.mapPayloadToOptions(response.payload))
      })
    })
  }

  public loadOptions = (inputValue) => this.fetchCoinsByName(inputValue)

  public componentDidUpdate(prevProps: IProps, prevState: IState) {
    if (
      !_.isEqual(prevProps.selectedCoins, this.props.selectedCoins) &&
      !!this.props.selectedCoins.length
    ) {
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
