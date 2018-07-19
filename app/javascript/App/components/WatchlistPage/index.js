import React, { Component } from 'react'
import watchlistContainer from '../../containers/watchlist'
import LoadingIndicator from '../LoadingIndicator'
import Watchlist from './Watchlist'
import Search from './Search'
import NewsList from './NewsList'
import watchlistStarIcon from '../../images/watch-list-star-icon.svg'

class WatchlistPage extends Component {
  render() {
    const { currentUI, toggleUI } = this.props
    const toggleEditing = () => toggleUI(['watchlist', 'editing', true])
    const isEditing = currentUI(['watchlist', 'editing'])
    return (
      <div className="container-wide ph4-l pv3-l">
        <div className="row narrow-gutter flex">
          <div className="col-xs-12 col-md-5 flex flex-column">
            <div className="bg-white pa3 pt4 pa4-ns">
              <div className="flex items-end justify-between mb3">
                <h1 className="ma0 ttu b f4">Watchlist</h1>
                <button
                  onClick={toggleEditing}
                  className={`btn btn-xs ${
                    isEditing ? 'btn-green' : 'btn-white'
                  }`}
                >
                  {isEditing ? 'Done Editing' : 'Edit Watchlist'}
                </button>
              </div>
              <Search
                {...{
                  ...this.props,
                  searchOpts: { exclude_watched: true, limit: 4 }
                }}
              />
            </div>
            <div className="mt1 mt3-l">
              {currentUI('loading') && <LoadingIndicator className="h5e mb3" />}
              <Watchlist {...this.props} isEditing={isEditing} />
            </div>
          </div>
          <div className="col-xs-12 col-md-7 flex">
            <div className="bg-white w-100 pt5 pa4-m ml2-l">
              <NewsList {...this.props} />
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default watchlistContainer(WatchlistPage)
