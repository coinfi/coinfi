import React, { Fragment } from 'react'
import FilterPanel from '../../common/components/FilterPanel'
import FilterBar from '../../common/components/FilterPanel/FilterBar'
import CoinTipsTab from '../../common/components/CoinTipsTab'
import ListingFilterFields from './ListingFilterFields'

export default (props) => (
  <Fragment>
    <CoinTipsTab />
    <FilterBar toggleFilterPanel={props.toggleFilterPanel} />

    {props.showFilterPanel && (
      <FilterPanel
        toggleFilterPanel={props.toggleFilterPanel}
        applyFilters={props.applyFilters}
      >
        <ListingFilterFields
          quoteSymbols={props.quoteSymbols}
          exchanges={props.exchanges}
        />
      </FilterPanel>
    )}

    <div
      id="listings-column-headers"
      className="b--b f6 bg-athens"
      style={{ height: 60 }}
    >
      <div className="fl w-third pa2 pl3">Pair</div>
      <div className="fl w-third pa2">Exchange</div>
      <div className="fl w-third pa2">Date Detected</div>
    </div>
  </Fragment>
)
