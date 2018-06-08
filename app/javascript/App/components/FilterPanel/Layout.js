import React from 'react'
import Icon from '../Icon'

const FilterPanel = (props) => {
  const { toggleUI, children, applyFilters } = props
  let containerClass = 'modal bg-athens'
  if (!window.isMobile)
    containerClass = 'overlay z-999 bg-athens overflow-y-auto'
  return (
    <div className={containerClass}>
      <div className="pa3 bb b--geyser flex justify-between items-center">
        <h3 className="mb0">Filters</h3>
        <div>
          <Icon
            name="times"
            regular
            className="slate"
            onClick={() =>
              toggleUI('filters', { toggleBodyScroll: window.isMobile })
            }
          >
            Cancel
          </Icon>
          <button className="btn btn-blue btn-xs ml3" onClick={applyFilters}>
            Apply filters
          </button>
        </div>
      </div>
      <div className="ph3 ph4-l">{children}</div>
    </div>
  )
}

export default FilterPanel
