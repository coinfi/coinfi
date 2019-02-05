import * as React from 'react'
import classNames from 'classnames'
import Autosuggest from 'react-autosuggest'
import Icon from './Icon'
import localApi from '../utils/localAPI'
import withDevice from '~/bundles/common/utils/withDevice'

interface Coin {
  id: number
  name: string
  symbol: string
  slug: string
  image_url: string
}

interface Props {
  unstyled?: boolean
  coinShow?: boolean
  placeholder?: string
  tokensOnly?: boolean
  isMobile: boolean
  onSelect: (suggestion: Coin) => void
}

interface State {
  suggestions: Coin[]
  value: string
}

const getSuggestionValue = (suggestion: Coin) => suggestion.slug

const renderSuggestion = (suggestion: Coin) => {
  const label = suggestion.symbol
    ? `${suggestion.name} (${suggestion.symbol})`
    : suggestion.name
  const imageStyle: React.CSSProperties = {
    width: '20px',
    height: '20px',
    marginRight: '5px',
    ...(!suggestion.image_url && { visibility: 'hidden' }),
  }

  return (
    <div className="flex items-center">
      <a>
        <img src={suggestion.image_url} style={imageStyle} />
        <span>{label}</span>
      </a>
    </div>
  )
}

const renderSuggestionsContainer = ({ containerProps, children, query }) =>
  !!children && <ul {...containerProps}>{children}</ul>

class SearchCoins extends React.Component<Props, State> {
  private autosuggestRef = null

  constructor(props) {
    super(props)

    this.state = {
      suggestions: [],
      value: '',
    }
  }

  public setAutosuggestRef = (autosuggest) =>
    (this.autosuggestRef = autosuggest)

  public focusTextInput = () => {
    this.autosuggestRef.input.focus()
  }

  public resetState = () => {
    this.setState(
      {
        suggestions: [],
        value: '',
      },
      () => this.focusTextInput(),
    )
  }

  public onChange = (event, { newValue }) => {
    this.setState({
      value: newValue,
    })
  }

  public onSuggestionsFetchRequested = ({ value }) => {
    localApi
      .get(`/coins/search_by_params`, {
        name: value,
        tokensOnly: this.props.tokensOnly,
      })
      .then((response) => {
        this.setState({
          suggestions: response.payload,
        })
      })
  }

  public onSuggestionsClearRequested = () => {
    this.setState({
      suggestions: [],
    })
  }

  public onSuggestionSelected = (e, { suggestion }) => {
    this.setState(
      {
        value: suggestion.name,
      },
      () => this.props.onSelect(suggestion),
    )
  }

  public render() {
    const { value, suggestions } = this.state
    const { placeholder } = this.props

    const inputProps = {
      onChange: this.onChange,
      placeholder: placeholder || 'Search coins',
      value,
    }

    const styleObj = {
      borderLeft: '1px solid #e5e8ed',
      marginLeft: 10,
      paddingLeft: 10,
    }

    const theme = {
      container: {
        width: '100%',
      },
      input: {
        width: '100%',
        maxWidth: '100%',
        border: 'none',
        backgroundColor: 'inherit',
      },
      inputFocused: {
        boxShadow: 'none',
      },
      suggestionsContainer: {
        width: '100%',
      },
      suggestionsList: {
        width: '100%',
        textAlign: 'left',
      },
    }

    return (
      <div
        className={classNames('search-field autosuggest', {
          unstyled: !!this.props.unstyled,
        })}
        style={this.props.coinShow && this.props.isMobile ? styleObj : {}}
      >
        <div className="flex items-center f5 tiber">
          <Icon
            name="search"
            className="silver mr1"
            onClick={this.focusTextInput}
          />
          <Autosuggest
            ref={this.setAutosuggestRef}
            suggestions={suggestions}
            onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
            onSuggestionsClearRequested={this.onSuggestionsClearRequested}
            getSuggestionValue={getSuggestionValue}
            renderSuggestionsContainer={renderSuggestionsContainer}
            renderSuggestion={renderSuggestion}
            onSuggestionSelected={this.onSuggestionSelected}
            highlightFirstSuggestion={false}
            inputProps={inputProps}
            theme={theme}
          />
          {!!value.length && (
            <Icon name="times" className="silver" onClick={this.resetState} />
          )}
        </div>
      </div>
    )
  }
}

export default withDevice(SearchCoins)
