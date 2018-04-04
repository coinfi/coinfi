import React, { Component } from 'react'
import Container from '../containers/WatchlistContainer'
import WatchedItem from '../components/WatchlistItem'
import WatchlistSearch from '../components/WatchlistSearch'
import LoadingIndicator from '../components/LoadingIndicator'
import ArticleList from '../components/ArticleList'

class WatchlistPage extends Component {
  render() {
    const { entities, isLoading } = this.props
    const { coins } = entities.toObject()
    return (
      <div className="pa2">
        <div className="container">
          <div className="row narrow-gutter flex">
            <div className="col-xs-12 col-md-5 flex flex-column">
              <WatchlistSearch {...this.props} />
              <div className="mt3">
                {isLoading && <LoadingIndicator className="h5e mb3" />}
                {coins &&
                  coins
                    .valueSeq()
                    .map(coin => (
                      <WatchedItem coin={coin} key={coin.get('id')} />
                    ))}
                {(!coins || coins.size === 0) && (
                  <div className="o-60 pt3 tc">Nothing added yet</div>
                )}
              </div>
            </div>
            <div className="col-xs-12 col-md-7 flex">
              <div className="bg-white w-100 pa3 pa4-m">
                <ArticleList {...this.props} />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Container(WatchlistPage)
