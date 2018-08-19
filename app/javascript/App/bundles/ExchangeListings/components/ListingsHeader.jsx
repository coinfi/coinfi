import React, { Fragment } from 'react'
import FilterPanel from '../../common/components/FilterPanel'
import FilterBar from '../../common/components/FilterPanel/FilterBar'
import CoinTipsTab from '../../common/components/CoinTipsTab'

const ListingsHeader = (props) => {
  return (
    <Fragment>
      <CoinTipsTab />
      <FilterBar toggleFilterPanel={props.toggleFilterPanel} />

      {props.showFilterPanel && (
        <FilterPanel toggleFilterPanel={props.toggleFilterPanel} />
      )}

      <div className="b--b f6 bg-athens" style={{ height: 60 }}>
        <div className="fl w-third pa2">Pair</div>
        <div className="fl w-third pa2">Exchange</div>
        <div className="fl w-third pa2">Date Detected</div>
      </div>
    </Fragment>
  )
}

export default ListingsHeader
