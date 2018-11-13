import * as React from 'react'
import withDevice from '~/bundles/common/utils/withDevice'

interface Props {
  closeFilterPanel: () => void
  resetFilters: () => void
  applyFilters: () => void
  children: any
  newsFeedStyle?: boolean
  isMobile: boolean
}

const Layout = (props: Props) => {
  let containerClass = 'modal bg-athens'

  if (!props.isMobile) {
    containerClass = 'overlay z-999 bg-athens overflow-y-auto'
  }

  return (
    <div className={containerClass}>
      <div className="pa3 bb b--geyser flex justify-between items-center filter-panel-header">
        <div className="flex items-center">
          <h3 className="mb0 mr1 b">Filters</h3>
          <button
            className="btn btn-white btn-xs"
            onClick={props.resetFilters}
            style={{
              background: 'none',
              border: 'none',
              boxShadow: 'none',
              color: '#2faeed',
              fontSize: '12px',
              textTransform: 'none',
            }}
          >
            Reset
          </button>
        </div>
        <div>
          <button
            className="btn btn-white btn-xs"
            onClick={props.closeFilterPanel}
            style={{
              background: 'none',
              border: 'none',
              boxShadow: 'none',
              color: 'rgba(0, 0, 0, 0.54)',
              fontSize: '14px',
              textTransform: 'none',
            }}
          >
            Cancel
          </button>
          <button
            className="btn btn-blue btn-xs ml3"
            onClick={props.applyFilters}
            style={{
              fontSize: '.88rem',
              padding: '8px 20px',
              textTransform: 'none',
            }}
          >
            Apply
          </button>
        </div>
      </div>
      <div
        className="ph3 ph4-l"
        // @ts-ignore
        style={!!props.newsFeedStyle ? { padding: '1rem' } : {}}
      >
        {props.children}
      </div>
    </div>
  )
}

export default withDevice(Layout)
