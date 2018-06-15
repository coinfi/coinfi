import React from 'react'
import Icon from '../Icon'

const Layout = (props) => {
  const { disableUI, children, applyFilters, resetFilters } = props
  let containerClass = 'modal bg-athens'
  if (!window.isMobile)
    containerClass = 'overlay z-999 bg-athens overflow-y-auto'
  return (
    <div className={containerClass}>
      <div className="pa3 bb b--geyser flex justify-between items-center">
        <div className="flex items-center">
          <h3 className="mb0 mr3">Filters</h3>
          <button className="btn btn-white btn-xs" onClick={resetFilters}>
            <Icon name="undo" regular className="mr2" />
            Reset
          </button>
        </div>
        <div>
          <button
            className="btn btn-white btn-xs"
            onClick={() => disableUI('filterPanel')}
          >
            <Icon name="times" regular className="mr2" />
            Cancel
          </button>
          <button className="btn btn-blue btn-xs ml3" onClick={applyFilters}>
            <Icon name="check" className="mr2" regular />
            Apply filters
          </button>
        </div>
      </div>
      <div className="ph3 ph4-l">{children}</div>
    </div>
  )
}

export default Layout
