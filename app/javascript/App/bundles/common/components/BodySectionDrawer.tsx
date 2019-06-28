import * as React from 'react'
import Drawer from './Drawer'
import Icon from './Icon'

interface Props {
  isShown: boolean
  onClose: () => void
  bodySection: any
  skipAnimation?: boolean
}

const BodySectionDrawer = (props: Props) => (
  <Drawer
    {...props}
    position={props.skipAnimation ? 'none' : 'bottom'}
    className="flex flex-column"
    onClose={props.onClose}
    isShown={props.isShown}
  >
    <div className="flex-none pv4 tc" onClick={props.onClose}>
      <Icon name="times" className="f4 slate" />
    </div>
    <div className="flex-auto overflow-y-auto bg-white relative">
      {props.bodySection}
    </div>
  </Drawer>
)

export default BodySectionDrawer
