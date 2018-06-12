import React, { Component } from 'react'
import Input from '../Input'

class CoinListSearch extends Component {
  onChange = (value) => {
    let { searchCoins, coinIDs } = this.props
    searchCoins(value, { q: { id_not_in: coinIDs }, limit: 4 })
  }
  render() {
    const { searchText } = this.props
    return (
      <div className="relative">
        <Input
          value={searchText}
          onChange={this.onChange}
          placeholder="Search"
          autoFocus
          setRef={(ref) => (this.inputRef = ref)}
          className="unstyled"
        />
      </div>
    )
  }
}

export default CoinListSearch
