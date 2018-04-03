import React, { Component } from 'react'
import Container from '../containers/WatchlistContainer'
import WatchedItem from '../components/WatchlistItem'
import Article from '../components/Article'

class WatchlistPage extends Component {
  render() {
    const {
      coins,
      articles,
      tags,
      category,
      selectCategory,
      filterCoins
    } = this.props
    const buttonProps = name => ({
      onClick: selectCategory(name),
      className: `tab ${name === category ? 'tab-active' : ''}`
    })
    return (
      <div className="container pv2">
        <div className="row narrow-gutter flex">
          <div className="col-xs-12 col-md-4 flex flex-column">
            <div className="bg-white">
              <div className="tabs tabs-alt">
                <button {...buttonProps('listed')}>Listed Coins</button>
                <button {...buttonProps('ico')}>ICO</button>
              </div>
              <div className="pa3">
                <input
                  type="text"
                  onChange={({ target: { value } }) => filterCoins(value)}
                  className="input-alt tc"
                  placeholder="Search"
                />
              </div>
            </div>
            <div className="mt2">
              {Object.entries(coins).map(([id, coin]) => (
                <WatchedItem coin={coin} key={id} />
              ))}
            </div>
          </div>
          <div className="col-xs-12 col-md-8 flex">
            <div className="bg-white w-100 pa4">
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
