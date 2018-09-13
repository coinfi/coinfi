import React, { Fragment } from 'react'
import FilterPanel from '~/bundles/common/components/FilterPanel'
import FilterBar from '~/bundles/common/components/FilterPanel/FilterBar'
import CoinTipsTab from '~/bundles/common/components/CoinTipsTab'
import ListingFilterFields from './ListingFilterFields'

export default (props) => {
  return (
    <Fragment>
      <CoinTipsTab
        showCoinListDrawer={props.showCoinListDrawer}
        showTips={props.toggleNewsfeedTips}
      />
      <FilterBar toggleFilterPanel={props.toggleFilterPanel} />

      {props.showFilterPanel && (
        <FilterPanel>
          <ListingFilterFields />
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
