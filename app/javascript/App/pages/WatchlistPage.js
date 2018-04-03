import React, { Component } from 'react'
import Container from '../containers/WatchlistContainer'
import WatchedItem from '../components/watchlist/WatchedItem'
import Article from '../components/Article'

class WatchlistPage extends Component {
  render() {
    const { coins, articles, tags, selectCategory, searchCoins } = this.props
    return (
      <div className="container">
        <div className="row no-gutter flex">
          <div className="col-xs-12 col-md-4 flex flex-column">
            <div className="bg-athens pa3">
              <div>
                <button onClick={selectCategory('listed')}>Listed Coins</button>
                <button onClick={selectCategory('ico')}>ICO</button>
              </div>
              <input
                type="text"
                onChange={({ target: { value } }) => searchCoins(value)}
              />
            </div>
            <div className="bg-white pa3">
              {Object.entries(coins).map(([id, coin]) => (
                <WatchedItem coin={coin} key={id} />
              ))}
            </div>
          </div>
          <div className="col-xs-12 col-md-8 flex">
            <div className="bg-gradient--fl1 w-100 pa4">
              {Object.entries(articles).map(([id, article]) => (
                <Article article={article} tags={tags} key={id} />
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Container(WatchlistPage)
