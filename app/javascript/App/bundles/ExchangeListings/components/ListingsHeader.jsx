import React, { Fragment } from 'react'
import FilterPanel from '../../common/components/FilterPanel'
import FilterBar from '../../common/components/FilterPanel/FilterBar'
import CoinTipsTab from '../../common/components/CoinTipsTab'
import ListingFilterFields from './ListingFilterFields'

export default (props) => {
  return (
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
            changeSymbol={props.changeSymbol}
            changeExchange={props.changeExchange}
            filterDates={props.filterDates}
            selectedItems={props.selectedItems}
            selectedSymbols={props.selectedSymbols}
            selectedExchanges={props.selectedExchanges}
            exchangeSlugs={props.exchangeSlugs}
          />
        </FilterPanel>
      )}

      <div id="listings-column-headers" className="b--b f6 bg-athens">
        <div className="fl w-third pa2 pl3">Pair</div>
        <div className="fl w-third pa2">Exchange</div>
        <div className="fl w-third pa2">Date Detected</div>
      </div>
    </Fragment>
  )
}
