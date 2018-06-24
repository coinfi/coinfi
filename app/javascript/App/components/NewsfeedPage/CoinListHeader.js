import React, { Component } from 'react'
import SectionHeader from './SectionHeader'
import Switch from '../Switch'
import Icon from '../Icon'
import Input from '../Input'

class CoinListHeader extends Component {
  onSearchInput = (value) => {
    let { searchCoins, coinIDs } = this.props
    searchCoins(value, { q: { id_not_in: coinIDs }, limit: 4 })
  }
  render() {
    const { toggleUI, currentUI, searchText } = this.props
    return (
      <SectionHeader>
        <div className="pv1">
          {currentUI('coinSearch') ? (
            <Input
              value={searchText}
              onChange={this.onSearchInput}
              placeholder="Search"
              autoFocus
              setRef={(ref) => (this.inputRef = ref)}
              className="unstyled"
            />
          ) : (
            <div className="flex items-center">
              <Switch
                on={currentUI('watchingOnly')}
                onChange={() => toggleUI('watchingOnly')}
              />
              <span className="ml2 f6 silver">Watching only</span>
            </div>
          )}
        </div>
        <div className="pv1">
          {currentUI('coinSearch') ? (
            <Icon onClick={() => toggleUI('coinSearch')} name="times" regular />
          ) : (
            <span className="tooltipped">
              <Icon
                onClick={() => toggleUI('coinSearch')}
                name="plus"
                regular
              />
              <span className="tooltip">Add a coin</span>
            </span>
          )}
        </div>
      </SectionHeader>
    )
  }
}

export default CoinListHeader
