import React, { Component } from 'react'
import Watchlist from '../components/Watchlist'
import WatchlistSearch from '../components/WatchlistSearch'
import LoadingIndicator from '../components/LoadingIndicator'
import ArticleList from '../components/ArticleList'

class WatchlistPage extends Component {
  render() {
    const { UI, editWatchlist } = this.props
    const { loading, editing } = UI.toObject()
    return (
      <div className="pa3-l">
        <div className="container">
          <div className="row narrow-gutter flex">
            <div className="col-xs-12 col-md-5 flex flex-column">
              <div className="bg-white pa3 pt4 pa4-ns">
                <div className="flex items-end justify-between mb3">
                  <h1 className="ma0 ttu b f4">Watchlist</h1>
                  <button
                    onClick={editWatchlist}
                    className={`btn btn-xs ${
                      editing ? 'btn-green' : 'btn-white'
                    }`}
                  >
                    {editing ? 'Done Editing' : 'Edit Watchlist'}
                  </button>
                </div>
                <WatchlistSearch
                  {...{
                    ...this.props,
                    searchOpts: { exclude_watched: true, limit: 4 }
                  }}
                />
              </div>
              <div className="mt1 mt3-l">
                {loading && <LoadingIndicator className="h5e mb3" />}
                <Watchlist {...this.props} />
              </div>
            </div>
            <div className="col-xs-12 col-md-7 flex">
              <div className="bg-white w-100 pt5 pa4-m ml2-l">
                <ArticleList {...this.props} />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default WatchlistPage
