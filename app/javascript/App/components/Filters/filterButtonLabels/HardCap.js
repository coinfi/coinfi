import React from 'react'
import Icon from '../../Icon'

export default ({ value }) => (
  <div>
    {value.get('min')}
    <Icon name="arrow-right" className="mh2 f7 o-50 elephant" />
    {value.get('max')}
  </div>
)
