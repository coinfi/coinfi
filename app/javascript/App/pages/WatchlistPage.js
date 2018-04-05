import React, { Component } from 'react'
import Container from '../containers/WatchlistContainer'
import WatchedItem from '../components/WatchlistItem/index'
import WatchlistSearch from '../components/WatchlistSearch'
import LoadingIndicator from '../components/LoadingIndicator'
import ArticleList from '../components/ArticleList'

class WatchlistPage extends Component {
  render() {
    const { entities, UI, editWatchlist } = this.props
    const { coins } = entities.toObject()
    const { loading, editing } = UI.toObject()
    return (
      <div className="pa3">
        <div className="container">
          <div className="row narrow-gutter flex">
            <div className="col-xs-12 col-md-5 flex flex-column">
              <div className="bg-white pa4">
                <div className="flex justify-between">
                  <h1 className="mt0 mt0 ttu b f4">Watchlist</h1>
                  <button onClick={editWatchlist} className="btn btn-sm">
                    {editing ? 'Done Editing' : 'Edit Watchlist'}
                  </button>
                </div>
                <WatchlistSearch {...this.props} />
              </div>
              <div className="mt3">
                {loading && <LoadingIndicator className="h5e mb3" />}
                {coins &&
                  coins.valueSeq().map(coin => (
                    <WatchedItem
                      {...{
                        ...this.props,
                        key: coin.get('id'),
                        coin: coin.toJS(),
                        editing
                      }}
                    />
                  ))}
                {!loading &&
                  (!coins || coins.size === 0) && (
                    <div className="o-60 pt3 tc">Nothing added yet</div>
                  )}
              </div>
            </div>
            <div className="col-xs-12 col-md-7 flex">
              <div className="bg-white w-100 pa3 pa4-m ml2-m">
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
