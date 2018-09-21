import React from 'react'
import withDevice from '~/bundles/common/utils/withDevice'

const Layout = (props) => {
  const {
    disableUI,
    children,
    applyFilters,
    resetFilters,
    newsFeedStyle,
    isMobile,
  } = props
  let containerClass = 'modal bg-athens'
  if (!isMobile) {
    containerClass = 'overlay z-999 bg-athens overflow-y-auto filter-panel-wrap'
  }
  return (
    <div className={containerClass}>
      <div className="pa3 bb b--geyser flex justify-between items-center filter-panel-header">
        <div className="flex items-center">
          <h3 className="mb0 mr1 b">Filters</h3>
          <button
            className="btn btn-white btn-xs"
            onClick={resetFilters}
            style={{
              background: 'none',
              border: 'none',
              boxShadow: 'none',
              textTransform: 'none',
              fontSize: '12px',
              color: '#2faeed',
            }}
          >
            Reset
          </button>
        </div>
        <div>
          <a
            className="btn btn-white btn-xs cancel-btn"
            onClick={() => {
              disableUI('filterPanel')
            }}
            style={{
              padding: '8px 20px',
              fontSize: '.88rem',
            }}
          >
            Cancel
          </a>
          <button
            data-heap="news-click-apply-filter-button"
            className="btn btn-blue btn-xs ml3"
            onClick={applyFilters}
            style={{
              textTransform: 'none',
              padding: '8px 20px',
              fontSize: '.88rem',
            }}
          >
            Apply
          </button>
        </div>
      </div>
      <div
        className="ph3 ph4-l"
        style={newsFeedStyle ? { padding: '1rem' } : ''}
      >
        {children}
      </div>
    </div>
  )
}

export default withDevice(Layout)
