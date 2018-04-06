import React from 'react'

export default () => (
  <div className="o-40 black-80 relative noselect">
    <div className="absolute absolute--fill hide-child">
      <div className="black b absolute absolute--fill pt1 bg-white-60 child tc">
        Coming soon
      </div>
    </div>
    <div>
      <div className="dib ttu pa2 ph3 f7 ba b--moon-gray sans-alt">
        Tags
        <i className="fas fa-chevron-down ml2" />
      </div>
      <div className="ml2 dib ttu pa2 ph3 f7 ba b--moon-gray sans-alt">
        Source
        <i className="fas fa-chevron-down ml2" />
      </div>
      <div className="ml2 dib ttu pa2 ph3 f7 ba b--moon-gray sans-alt">
        Date range
        <i className="fas fa-chevron-down ml2" />
      </div>
    </div>
  </div>
)
