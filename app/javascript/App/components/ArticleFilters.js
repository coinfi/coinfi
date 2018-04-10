import React from 'react'

export default () => (
  <div className="flex-auto black-80 relative noselect mt3">
    <div className="absolute absolute--fill z-2 flex items-center justify-center justify-end-l">
      <div className="b ttu tc black-40 f6 bg-white">Filters Coming Soon</div>
    </div>
    <div className="o-20 mtn2 mhn1 flex items-center justify-center blur-1">
      <div className="mt2 mh1 dib ttu pa2 ph3 f7 ba b--moon-gray sans-alt">
        Tags
        <i className="fas fa-chevron-down ml2" />
      </div>
      <div className="mt2 mh1 dib ttu pa2 ph3 f7 ba b--moon-gray sans-alt">
        Source
        <i className="fas fa-chevron-down ml2" />
      </div>
      <div className="mt2 mh1 dib ttu pa2 ph3 f7 ba b--moon-gray sans-alt">
        Date Range
        <i className="fas fa-chevron-down ml2" />
      </div>
    </div>
  </div>
)
