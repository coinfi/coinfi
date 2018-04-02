import React, { Component } from 'react'
import Container from '../containers/WatchlistContainer'
import Item from '../components/watchlist/Item'

class WatchlistPage extends Component {
  render() {
    const { coins, articles } = this.props
    return (
      <div className="container">
        <div className="row no-gutter flex">
          <div className="col-xs-12 col-md-4 flex flex-column">
            <div className="bg-athens pa4">
              {Object.entries(coins).map(([id, coin]) => (
                <Item coin={coin} key={id} />
              ))}
            </div>
          </div>
          <div className="col-xs-12 col-md-8 flex">
            <div className="bg-gradient--fl1 w-100 pa4">
              {Object.entries(articles).map(([id, article]) => (
                <div key={id} className="pa3 bb mb3">
                  <h3>{article.title}</h3>
                  {article.summary}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Container(WatchlistPage)
