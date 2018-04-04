import React, { Component } from 'react'
import Container from '../containers/WatchlistContainer'
import WatchedItem from '../components/WatchlistItem'
import Article from '../components/Article'

class WatchlistPage extends Component {
  render() {
    const {
      entities,
      category,
      selectCategory,
      searchCoins,
      searchedCoins
    } = this.props
    const { coins, articles } = entities.toObject()
    const buttonProps = name => ({
      onClick: () => selectCategory(name),
      className: `tab ${name === category ? 'tab-active' : ''}`
    })
    return (
      <div className="container pv2">
        <div className="row narrow-gutter flex">
          <div className="col-xs-12 col-md-5 flex flex-column">
            <div className="bg-white">
              <div className="tabs tabs-alt">
                <button {...buttonProps('listed')}>Listed Coins</button>
                <button {...buttonProps('ico')}>ICO</button>
              </div>
              <div className="pa3">
                <input
                  type="text"
                  onChange={({ target: { value } }) => searchCoins(value)}
                  className="input-alt tc"
                  placeholder="Search"
                />
              </div>
            </div>
            {searchedCoins.size > 0 && (
              <div>
                {searchedCoins.map(coin => (
                  <div
                    key={coin.get('id')}
                    className="pb3 mb3 bb b--athens-dark"
                  >
                    {coin.get('name')}
                  </div>
                ))}
              </div>
            )}
            <div className="mt3">
              {coins &&
                coins
                  .valueSeq()
                  .map(coin => (
                    <WatchedItem coin={coin} key={coin.get('id')} />
                  ))}
            </div>
          </div>
          <div className="col-xs-12 col-md-7 flex">
            <div className="bg-white w-100 pa4">
              {articles &&
                articles
                  .valueSeq()
                  .map(article => (
                    <Article
                      article={article}
                      tags={entities.get('tags')}
                      key={article.get('id')}
                    />
                  ))}
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Container(WatchlistPage)
