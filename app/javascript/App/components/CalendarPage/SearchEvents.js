import React, { Component } from 'react'
import coinSearchProvider from '../containers/coinSearch'
import Input from './Input'
import Icon from './Icon'

class SearchEvents extends Component {
  handleSearchInput = (value) => {
    let { searchEvents } = this.props
    const name_not_in = this.selectedCoins()
    searchEvents(value, { q: { name_not_in }, limit: 10 })
  }
  render() {
    const { classProps, searchText, clearSearch } = this.props

    return (
      <div className={`${classProps ? classProps : ''} search-field`}>
        <div className="flex items-center f5 tiber">
          <Icon
            regular
            name="search"
            className="silver mr1"
            onClick={() => {
              this.inputRef.focus()
            }}
          />
          <Input
            value={searchText}
            onChange={this.handleSearchInput}
            placeholder="Search"
            setRef={(ref) => (this.inputRef = ref)}
            className="unstyled"
          />
          {searchText.length > 0 && (
            <Icon
              regular
              name="times"
              className="silver"
              onClick={() => {
                clearSearch()
                this.inputRef.focus()
              }}
            />
          )}
        </div>
      </div>
    )
  }
}

export default coinSearchProvider('coinFilter')(SearchEvents)
