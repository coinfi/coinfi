import React from 'react'
import FilterButton from './FilterButton'
import Icon from '~/bundles/common/components/Icon'
import withDevice from '~/bundles/common/utils/withDevice'

const FilterBar = ({
  children,
  showCoinListDrawer,
  toggleFilterPanel,
  isMobile,
}) => (
  <div
    id="panel-header"
    className="pa3 b--b flex-none flex justify-between items-center bg-athens"
    style={{ height: 60 }}
  >
    <div className="flex items-center flex-auto">
      {!isMobile && (
        <button
          className="btn btn-blue btn-xs coins-btn mr2"
          style={
            isMobile
              ? {
                  ...{
                    background: '#2495ce',
                    flex: 1,
                    textTransform: 'none',
                  },
                }
              : {}
          }
          onClick={showCoinListDrawer}
        >
          <Icon name="list" className="f6 mr2" />
          Coins
        </button>
      )}
      <FilterButton onClick={toggleFilterPanel} />
      {children}
    </div>
  </div>
)

export default withDevice(FilterBar)
