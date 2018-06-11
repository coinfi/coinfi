import React, { Component } from 'react'
import Input from '../Input'
import Icon from '../Icon'

class CoinListSearch extends Component {
  render() {
    const { searchCoins, searchText, clearSearch } = this.props
    return (
      <div className="relative">
        <div className="icon-input tiber">
          <Icon regular name="search" className="f4 reveal-m" />
          <Input
            value={searchText}
            onChange={searchCoins}
            placeholder="Search"
            autoFocus
            setRef={(ref) => (this.inputRef = ref)}
          />
          {searchText.length > 0 && (
            <Icon
              regular
              name="times"
              className="silver conceal-m"
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

export default CoinListSearch
