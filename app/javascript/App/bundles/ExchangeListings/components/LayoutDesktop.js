import React from 'react'
//import CoinList from '../NewsfeedPage/CoinList'
import ListingsHeader from './ListingsHeader'
import ListingsList from './ListingsList'
import BodySection from './BodySection'

export default function(props) {
  return (
    <div className="flex flex-column flex-auto">
      <div className="row no-gutter flex-auto bg-white">
        <div className="col-xs-6 relative flex flex-column b--l">
          <ListingsHeader {...props} />
          <ListingsList {...props} />
        </div>
        <div className="col-xs-6 relative overflow-y-auto b--l b--r">
          <BodySection {...props} />
        </div>
      </div>
    </div>
  )
}
