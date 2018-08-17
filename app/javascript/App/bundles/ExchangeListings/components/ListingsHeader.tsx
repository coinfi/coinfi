import * as React from 'react'
import FilterPanel from '../../FilterPanel'
import FilterBar from '../../FilterBar'
import CoinTipsTab from '../../CoinTipsTab'

interface Props {
  initialListings?: Array<string>
  loggedIn?: Boolean
  user: Boolean
  showFilterPanel: Boolean
  toggleFilterPanel: Function
}

const ListingsHeader = (props: Props) => {
  return (
    <React.Fragment>
      <CoinTipsTab />
      <FilterBar toggleFilterPanel={props.toggleFilterPanel} />

      {props.showFilterPanel && (
        <FilterPanel toggleFilterPanel={props.toggleFilterPanel} />
      )}

      <div className="flex f6 bg-athens">
        <div className="fl w-third pa2">Pair</div>
        <div className="fl w-third pa2">Exchange</div>
        <div className="fl w-third pa2">Date Detected</div>
      </div>
    </React.Fragment>
  )
}

export default ListingsHeader
