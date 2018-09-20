import React from 'react'
import styled from 'styled-components'
import FilterApplyButton from './FilterApplyButton'
import FilterCancelButton from './FilterCancelButton'
import FilterResetLink from './FilterResetLink'
import ExchangeListingContext from '~/bundles/ExchangeListings/ExchangeListingsContext'
import withDevice from '~/bundles/common/utils/withDevice'

const Modal = styled.div`
  display: block !important;
`

const FilterPanel = ({ children, isMobile }) => {
  // TODO: make this shared component work with other components using FilterPanel
  const { applyFilters, resetFilters } = this

  let containerClass = 'modal bg-athens'
  if (!isMobile) containerClass = 'overlay z-999 bg-athens overflow-y-auto'

  return (
    <div className="ph3 ph4-l">
      <Modal className={containerClass}>
        <ExchangeListingContext.Consumer>
          {({ resetFilters, toggleFilterPanel, applyFilters }) => (
            <div className="pa3 bb b--geyser flex justify-between items-center filter-panel-header">
              <div className="flex items-center">
                <h3 className="mb0 mr1 b">Filters</h3>
                <FilterResetLink resetFilters={resetFilters} />
              </div>
              <div>
                <FilterCancelButton toggleFilterPanel={toggleFilterPanel} />
                <FilterApplyButton applyFilters={applyFilters} />
              </div>
            </div>
          )}
        </ExchangeListingContext.Consumer>
        {children}
      </Modal>
    </div>
  )
}

export default withDevice(FilterPanel)
