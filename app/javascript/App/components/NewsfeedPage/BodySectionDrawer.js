import React from 'react'
import Drawer from '../Drawer'
import Icon from '../Icon'
import BodySection from './BodySection'

const BodySectionDrawer = (props) => (
  <Drawer
    uiKey="bodySectionDrawer"
    {...props}
    position="bottom"
    className="overflow-y-auto flex flex-column"
  >
    <div
      className="flex-none pv4 tc"
      onClick={() => props.disableUI('bodySectionDrawer')}
    >
      <Icon name="times" className="f4 slate" regular />
    </div>
    <div className="flex-auto bg-white relative">
      <BodySection {...props} />
    </div>
  </Drawer>
)

export default BodySectionDrawer
