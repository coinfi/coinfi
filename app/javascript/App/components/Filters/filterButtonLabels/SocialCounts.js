import React from 'react'
import Icon from '~/bundles/common/components/Icon'

export default ({ value }) => (
  <div>
    <span className="mr3">
      <Icon brand name="twitter" className="mr2" />
      {value.get('twitter')}
    </span>
    <span>
      <Icon brand name="telegram" className="mr2" />
      {value.get('telegram')}
    </span>
  </div>
)
