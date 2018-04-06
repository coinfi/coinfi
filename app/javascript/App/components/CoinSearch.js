import React, { Component } from 'react'
import Input from './Input'
import CoinSearchContainer from '../containers/CoinSearchContainer'

class CoinSearch extends Component {
  handleSearchInput = ({ target: { value } }) => {
    let { searchOpts } = this.props
    searchOpts = searchOpts || {}
    this.props.searchCoins(value, searchOpts)
  }
  render() {
    const { searchedCoins, searchText } = this.props
    return (
      <div>
        <Input
          value={searchText}
          onChange={this.handleSearchInput}
          className=""
          placeholder="Search"
          autoFocus
        />
        {searchedCoins.size > 0 && (
          <div className="ba b--light-gray mt3">
            <table>
              <tbody>
                {searchedCoins.map(coin => (
                  <tr>
                    <td>
                      <a
                        href={`/coins/${coin.get('slug')}`}
                        key={coin.get('id')}
                        className="db flex"
                      >
                        <div className="flex-auto flex items-center">
                          {coin.get('image_url') && (
                            <img
                              className="w2e h2e mr3"
                              src={coin.get('image_url')}
                              alt=""
                            />
                          )}
                          {coin.get('name')}
                          <span className="b ml2 f7">{coin.get('symbol')}</span>
                        </div>
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    )
  }
}

export default CoinSearchContainer(CoinSearch)
