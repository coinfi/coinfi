import React from 'react'
import { SortableElement } from 'react-sortable-hoc'
import ListedData from './ListedData'
import ListedInfo from './ListedInfo'
import IcoData from './IcoData'
import IcoInfo from './IcoInfo'
import Title from './Title'
import Actions from './Actions'

const WatchlistItem = props => {
  const { coin, currentUI } = props
  return (
    <div className="bright-gray db bg-white shadow-s1 ba b--athens-darker mh1 mb1 mb3-l mh0-m">
      <div className="pa3 noselect">
        <div className="row bottom-xs">
          <div className="col-xs-12 col-sm-7 col-md-12 col-lg-7">
            <Title {...props} />
          </div>
          <div className="col-xs-12 col-sm-5 col-md-12 col-lg-5 tr mt2 mt0-ns">
            {currentUI('editing') ? (
              <Actions {...props} />
            ) : (
              <div className="f4 fw9">
                {coin.category === 'listed' ? (
                  <ListedInfo {...props} />
                ) : (
                  <IcoInfo {...props} />
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      {!currentUI('editing') && (
        <div className="bt b--athens-dark pa3 pt3">
          {coin.category === 'listed' ? (
            <ListedData {...props} />
          ) : (
            <IcoData {...props} />
          )}
        </div>
      )}
    </div>
  )
}

export default SortableElement(WatchlistItem)
