import * as React from 'react'
import * as _ from 'lodash'
import Select from 'react-select'
import { CoinSlug } from '~/bundles/common/types'
import localApi from '../utils/localAPI'

interface Props {
  selectedCoin: CoinSlug
  onChange: (selectedOption: CoinOption) => void
  placeholder?: string
}

export interface CoinOption {
  value: string
  label: string
  src?: string
}

interface State {
  q: string
  options: CoinOption[]
  selectedOption: CoinOption
}

const customStyles = {
  option: (base, state) => ({
    ...base,
  }),
  control: (base, state) => ({
    ...base,
    height: '30px',
    minHeight: '30px',
  }),
  singleValue: (base, state) => ({
    ...base,
  }),
}

const labelStyles = {
  display: 'flex',
  alignItems: 'center',
  textOverflow: 'ellipsis',
}

const imageStyles = {
  maxHeight: '15px',
  maxWidth: '15px',
  height: 'auto',
  width: 'auto',
  marginRight: '0.25em',
  padding: 0,
}

interface FormatOptions {
  context: 'menu' | 'value'
  inputValue: string
  selectValue: object | object[] | null | undefined
}

const formatLabel = (value: CoinOption, options: FormatOptions) => {
  const { label, src } = value

  return (
    <div style={labelStyles}>
      {src ? <img src={src} style={imageStyles} /> : ''}
      {label}
    </div>
  )
}

class CoinSelector extends React.Component<Props, State> {
  public state = {
    q: '',
    options: [],
    selectedOption: null,
  }

  public mapPayloadToOptions = (payload: any[]): CoinOption[] =>
    payload.map((elem) => {
      const label = elem.symbol ? `${elem.symbol} | ${elem.name}` : elem.name

      return {
        label,
        value: elem.slug,
        src: elem.image_url,
      }
    })

  public fetchCoinsDetails = (coinSlugs): Promise<CoinOption[]> =>
    coinSlugs
      ? localApi
          .get(`/coins/search_by_params`, { coinSlugs })
          .then((response) => this.mapPayloadToOptions(response.payload))
      : new Promise((resolve) => resolve([]))

  public fetchCoinsByName = (name): Promise<CoinOption[]> =>
    localApi.get(`/coins/search_by_params`, { name }).then((response) => {
      const results = this.mapPayloadToOptions(response.payload)

      if (this.state.q === name) {
        this.setState({ options: results })
      }

      return results
    })

  // tslint:disable-next-line
  public debouncedFetchCoinsByName = _.debounce(this.fetchCoinsByName, 500)

  public handleInputChange = (newInput: string) => {
    this.setState({ q: newInput })

    if (!_.isEmpty(newInput)) {
      this.debouncedFetchCoinsByName(newInput)
    }

    return newInput
  }

  public refreshCoin = (selectedCoin: string) =>
    this.fetchCoinsDetails(selectedCoin).then((results) => {
      if (results && results.length === 1) {
        this.setState({
          selectedOption: results[0],
        })
      } else {
        this.setState({
          selectedOption: null,
        })
      }
    })

  public onChangeWrapper = (selectedOption: CoinOption) => {
    this.setState({
      q: '',
      options: [],
    })

    this.props.onChange(selectedOption)
  }

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
      <Select
        isMulti={false}
        isClearable={true}
        onChange={this.onChangeWrapper}
        onInputChange={this.handleInputChange}
        options={this.state.options}
        value={this.state.selectedOption}
        placeholder={this.props.placeholder}
        formatOptionLabel={formatLabel}
        styles={customStyles}
      />
    )
  }
}

export default CoinSelector
