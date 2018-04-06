import React from 'react'

export default () => (
  <div className="black-80 relative noselect">
    <div className="absolute absolute--fill">
      <div className="b absolute absolute--fill pt2 bg-white-90 ttu tc black-50 f6">
        Coming Soon
      </div>
    </div>
    <div className="o-20">
      <div className="dib ttu pa2 ph3 f7 ba b--moon-gray sans-alt">
        Tags
        <i className="fas fa-chevron-down ml2" />
      </div>
      <div className="ml2 dib ttu pa2 ph3 f7 ba b--moon-gray sans-alt">
        Source
        <i className="fas fa-chevron-down ml2" />
      </div>
      <div className="ml2 dib ttu pa2 ph3 f7 ba b--moon-gray sans-alt">
        Date Range
        <i className="fas fa-chevron-down ml2" />
      </div>
    </div>
  </div>
)
